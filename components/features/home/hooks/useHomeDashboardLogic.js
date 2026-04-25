import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import useLiveClock from "@/hooks/useLiveClock";
import useTimedFlag from "@/hooks/useTimedFlag";
import {
  fetchUserProfileByUserId,
  isUserProfileOnboarded,
} from "@/lib/supabase-user-profiles";
import { fetchDashboardInternHoursByUserId } from "@/lib/supabase-dashboard-hours";
import { fetchAttendanceRecordByDate } from "@/lib/supabase-history";

const EMPTY_SESSION = { timeIn: null, timeOut: null };


function formatNowClock(date) {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

function toMinutes(clock) {
  if (!clock) return null;
  const trimmed = clock.trim().toUpperCase();

  // 12-hour format: "02:07 PM"
  const match12 = trimmed.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/);
  if (match12) {
    let hours = Number(match12[1]);
    const minutes = Number(match12[2]);
    const period = match12[3];
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
    if (period === "AM" && hours === 12) hours = 0;
    if (period === "PM" && hours !== 12) hours += 12;
    return hours * 60 + minutes;
  }

  // 24-hour format: "14:07"
  const [hours, minutes] = trimmed.split(":").map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
  return hours * 60 + minutes;
}

function calculateDuration(startTime, endTime) {
  if (!startTime || !endTime) return 0;
  const start = toMinutes(startTime);
  const end = toMinutes(endTime);
  if (start === null || end === null || end <= start) return 0;
  return (end - start) / 60;
}

function toLocalDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDashboardDate(dateText) {
  if (typeof dateText !== "string") return null;

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateText.trim());
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
    return null;
  }

  const localDate = new Date(year, month - 1, day);
  if (
    localDate.getFullYear() !== year ||
    localDate.getMonth() !== month - 1 ||
    localDate.getDate() !== day
  ) {
    return null;
  }

  return localDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function useHomeDashboardLogic() {
  const router = useRouter();
  const hasSupabaseConfig =
    typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
    /^https?:\/\//.test(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

  const supabase = useMemo(() => {
    if (!hasSupabaseConfig) return null;
    return createClient();
  }, [hasSupabaseConfig]);

  const [amSession, setAmSession] = useState(EMPTY_SESSION);
  const [pmSession, setPmSession] = useState(EMPTY_SESSION);
  const [fullName, setFullName] = useState("");
  const [targetHours, setTargetHours] = useState(null);
  const [persistedTotalHours, setPersistedTotalHours] = useState(0);
  const [persistedWeekHours, setPersistedWeekHours] = useState(0);
  const [persistedTodayHours, setPersistedTodayHours] = useState(0);
  const [persistedMonthHours, setPersistedMonthHours] = useState(0);
  const [persistedEstimatedFinishDate, setPersistedEstimatedFinishDate] =
    useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [attendanceMode, setAttendanceMode] = useState("dual");
  const [showClockOutModal, setShowClockOutModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Auto-dismiss error after 5 seconds
  useEffect(() => {
    if (!errorMessage) return;
    const timer = setTimeout(() => setErrorMessage(null), 5000);
    return () => clearTimeout(timer);
  }, [errorMessage]);

  const now = useLiveClock(60000);
  const todayKey = useMemo(() => toLocalDateKey(now), [now]);

  const refreshPersistedSummary = useCallback(
    async (userId) => {
      if (!supabase || !userId) return;

      const [dashboardHours, todayRecord, profileResult] = await Promise.all([
        fetchDashboardInternHoursByUserId({
          supabase,
          userId,
        }),
        fetchAttendanceRecordByDate({
          supabase,
          userId,
          dateKey: todayKey,
        }),
        supabase
          .from("user_profiles")
          .select("attendance_mode")
          .eq("user_id", userId)
          .maybeSingle(),
      ]);

      if (profileResult?.data) {
        setAttendanceMode(profileResult.data.attendance_mode || "dual");
      }

      if (!dashboardHours) {
        setPersistedTodayHours(0);
        setPersistedWeekHours(0);
        setPersistedMonthHours(0);
        setPersistedTotalHours(0);
        setPersistedEstimatedFinishDate(null);
      } else {
        setPersistedTodayHours(dashboardHours.todayHours);
        setPersistedWeekHours(dashboardHours.weekHours);
        setPersistedMonthHours(dashboardHours.monthHours);
        setPersistedTotalHours(dashboardHours.totalHours);
        setPersistedEstimatedFinishDate(dashboardHours.estimatedFinishDate);
      }

      if (todayRecord) {
        setAmSession({
          timeIn: todayRecord.amIn,
          timeOut: todayRecord.amOut,
        });
        setPmSession({
          timeIn: todayRecord.pmIn,
          timeOut: todayRecord.pmOut,
        });
      } else {
        setAmSession(EMPTY_SESSION);
        setPmSession(EMPTY_SESSION);
      }
    },
    [supabase, todayKey],
  );

  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    let mounted = true;

    const loadOnboardingState = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (!mounted || userError || !user) {
          if (mounted) {
            setIsLoading(false);
          }
          return;
        }

        const { data: profile, error: profileError } =
          await fetchUserProfileByUserId({
            supabase,
            userId: user.id,
          });

        if (!mounted) return;

        if (profileError) {
          router.replace("/onboarding");
          setIsLoading(false);
          return;
        }

        setFullName(profile?.full_name || "");
        const parsedTargetHours = Number(profile?.target_hours);
        setTargetHours(
          Number.isFinite(parsedTargetHours) && parsedTargetHours > 0
            ? parsedTargetHours
            : null,
        );

        await refreshPersistedSummary(user.id);

        if (!mounted) return;

        if (!isUserProfileOnboarded(profile)) {
          router.replace("/onboarding");
        }

        setIsLoading(false);
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.error("Failed to load Home onboarding state", error);
        }

        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadOnboardingState();

    return () => {
      mounted = false;
    };
  }, [refreshPersistedSummary, router, supabase]);


  const draftTodayHours =
    (amSession.timeIn && amSession.timeOut ? 4 : amSession.timeIn ? 2 : 0) +
    (pmSession.timeIn && pmSession.timeOut ? 4 : pmSession.timeIn ? 2 : 0);

  const todayHours = persistedTodayHours;
  const weekHours = persistedWeekHours;
  const monthHours = persistedMonthHours;
  const totalRenderedHours = persistedTotalHours;
  const hasValidTargetHours =
    Number.isFinite(targetHours) && Number(targetHours) > 0;
  const pct = Math.min(
    100,
    hasValidTargetHours
      ? Math.round((totalRenderedHours / Number(targetHours)) * 100)
      : 0,
  );
  const remaining = hasValidTargetHours
    ? Math.max(0, Number(targetHours) - totalRenderedHours)
    : 0;
  const formattedEstimatedFinish = formatDashboardDate(persistedEstimatedFinishDate);
  const estimatedFinishText = !hasValidTargetHours
    ? "Set target hours"
    : formattedEstimatedFinish || "Not available";

  // ─── 4-STATE ATTENDANCE LOGIC (derived from Supabase data only) ───
  const currentStatus = useMemo(() => {
    // PM-only session (late-start dual mode): AM is empty but PM is complete
    if (!amSession.timeIn && pmSession.timeIn && pmSession.timeOut) return "done";
    if (!amSession.timeIn) return "clock-in";
    if (!amSession.timeOut) return "clock-out-am";
    if (!pmSession.timeIn) return "start-pm";
    if (!pmSession.timeOut) return "clock-out-pm";
    return "done";
  }, [amSession, pmSession]);

  const buttonConfig = useMemo(() => {
    switch (currentStatus) {
      case "clock-in":
        return {
          label: "Clock In",
          background: "linear-gradient(135deg, #58D4D4 0%, #2AC9C9 100%)",
          color: "#0F172A",
          shadow: "rgba(88, 212, 212, 0.3)",
        };
      case "clock-out-am":
        return {
          label: "Clock Out (AM)",
          background: "linear-gradient(135deg, #FB923C 0%, #F59E0B 100%)",
          color: "#FFFFFF",
          shadow: "rgba(245, 158, 11, 0.3)",
        };
      case "start-pm":
        return {
          label: "Start PM",
          background: "linear-gradient(135deg, #38BDF8 0%, #0EA5E9 100%)",
          color: "#FFFFFF",
          shadow: "rgba(14, 165, 233, 0.3)",
        };
      case "clock-out-pm":
        return {
          label: "Clock Out",
          background: "linear-gradient(135deg, #FB7185 0%, #E11D48 100%)",
          color: "#FFFFFF",
          shadow: "rgba(225, 29, 72, 0.3)",
        };
      default:
        return {
          label: "Already Logged",
          background: "rgba(255, 255, 255, 0.05)",
          color: "rgba(255, 255, 255, 0.3)",
          shadow: "transparent",
        };
    }
  }, [currentStatus]);

  const isClockIn =
    (amSession.timeIn && !amSession.timeOut) ||
    (pmSession.timeIn && !pmSession.timeOut);

  const activeSessionTimeIn = (amSession.timeIn && !amSession.timeOut) 
    ? amSession.timeIn 
    : (pmSession.timeIn && !pmSession.timeOut) 
      ? pmSession.timeIn 
      : null;

  const currentSessionHours = useMemo(() => {
    if (!activeSessionTimeIn) return 0;
    const startMinutes = toMinutes(activeSessionTimeIn);
    const nowMinutes = toMinutes(formatNowClock(now));
    if (startMinutes === null || nowMinutes === null) return 0;
    return Math.max(0, (nowMinutes - startMinutes) / 60);
  }, [activeSessionTimeIn, now]);

  const modalHours = useMemo(() => {
    const timeNow = formatNowClock(now);
    if (currentStatus === "clock-out-am") {
      if (attendanceMode === "dual") {
        const amInMinutes = toMinutes(amSession.timeIn);
        const amCutoff = toMinutes("11:00");

        if (amInMinutes !== null && amInMinutes >= amCutoff) {
          // Late start (>= 11:00 AM): PM-only, duration = now - original am_in
          return calculateDuration(amSession.timeIn, timeNow);
        }

        // Normal dual: morning (am_in → 11:00) + afternoon (12:00 → now)
        const morning = calculateDuration(amSession.timeIn, "11:00");
        const afternoon = calculateDuration("12:00", timeNow);
        return morning + afternoon;
      }
      return calculateDuration(amSession.timeIn, timeNow);
    }
    if (currentStatus === "clock-out-pm") {
      const morning = calculateDuration(amSession.timeIn, amSession.timeOut);
      const afternoon = calculateDuration(pmSession.timeIn, timeNow);
      return morning + afternoon;
    }
    return 0;
  }, [currentStatus, amSession, pmSession, attendanceMode, now]);

  const statusLabel = isClockIn ? "CLOCKED IN" : "CLOCK OUT";
  const isDayComplete = currentStatus === "done";
  const hasAnyLog = Boolean(
    amSession.timeIn ||
      amSession.timeOut ||
      pmSession.timeIn ||
      pmSession.timeOut,
  );

  // ─── CLOCK IN: Insert a new row with am_in = now ───
  const handleClockIn = async () => {
    if (!supabase || isSaving) return;
    setErrorMessage(null);
    setIsSaving(true);
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !user) {
        setErrorMessage("Your session has expired. Please log in again to record your attendance.");
        return;
      }
      const timeNow = formatNowClock(new Date());
      const { error: insertError } = await supabase
        .from("attendance_entries")
        .upsert(
          {
            user_id: user.id,
            work_date: todayKey,
            am_in: timeNow,
            status: "REGULAR_DUTY_DAY",
            source: "ENCODE_PAST",
            total_hours: 0,
          },
          { onConflict: "user_id,work_date" },
        );
      if (insertError) {
        setErrorMessage("We couldn't reach the server. Please check your connection and try clocking in again.");
        return;
      }
      await refreshPersistedSummary(user.id);
    } catch (err) {
      setErrorMessage("Something went wrong on our end. Please refresh the page and try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // ─── START PM: Update existing row with pm_in = now ───
  const handleStartPm = async () => {
    if (!supabase || isSaving) return;
    setErrorMessage(null);
    setIsSaving(true);
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !user) {
        setErrorMessage("Session expired. Please log in again to start your PM session.");
        return;
      }
      const timeNow = formatNowClock(new Date());
      const { error: updateError } = await supabase
        .from("attendance_entries")
        .update({ pm_in: timeNow })
        .eq("user_id", user.id)
        .eq("work_date", todayKey);
      if (updateError) {
        setErrorMessage("Failed to start PM session. Please check your internet connection.");
        return;
      }
      await refreshPersistedSummary(user.id);
    } catch (err) {
      setErrorMessage("We encountered an error starting your session. Please try again in a moment.");
    } finally {
      setIsSaving(false);
    }
  };

  // ─── CONFIRM CLOCK OUT: Update row with am_out/pm_out ───
  const handleConfirmClockOut = async () => {
    if (!supabase || isSaving) return;
    setErrorMessage(null);
    setIsSaving(true);
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !user) {
        setErrorMessage("Session expired. Please log in again to save your clock out.");
        return;
      }
      const timeNow = formatNowClock(new Date());
      let updates = {};

      if (currentStatus === "clock-out-am") {
        if (attendanceMode === "dual") {
          const amInMinutes = toMinutes(amSession.timeIn);
          const amCutoff = toMinutes("11:00");

          if (amInMinutes !== null && amInMinutes >= amCutoff) {
            // CASE 2: Late start (am_in >= 11:00 AM) — treat as PM-only
            // Move original am_in → pm_in, clear AM fields, set pm_out = now
            updates = {
              am_in: null,
              am_out: null,
              pm_in: amSession.timeIn,
              pm_out: timeNow,
              total_hours: modalHours,
            };
          } else {
            // CASE 1: Normal dual mode (am_in < 11:00 AM)
            // am_out = 11:00, pm_in = 12:00, pm_out = now
            updates = {
              am_out: "11:00",
              pm_in: "12:00",
              pm_out: timeNow,
              total_hours: modalHours,
            };
          }
        } else {
          // Single mode: just set pm_out = now
          updates = { pm_out: timeNow, total_hours: modalHours };
        }
      } else if (currentStatus === "clock-out-pm") {
        updates = { pm_out: timeNow, total_hours: modalHours };
      }

      const { error: updateError } = await supabase
        .from("attendance_entries")
        .update(updates)
        .eq("user_id", user.id)
        .eq("work_date", todayKey);
      if (updateError) {
        setErrorMessage("Unable to save your clock out. Please check your connection.");
        return;
      }
      await refreshPersistedSummary(user.id);
      setShowClockOutModal(false);
    } catch (err) {
      setErrorMessage("Something went wrong while clocking out. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // ─── TOGGLE CLOCK: Dispatches to the correct handler ───
  const onToggleClock = () => {
    if (currentStatus === "clock-in") {
      handleClockIn();
    } else if (currentStatus === "start-pm") {
      handleStartPm();
    } else if (
      currentStatus === "clock-out-am" ||
      currentStatus === "clock-out-pm"
    ) {
      setShowClockOutModal(true);
    }
  };

  const resetSessionLogs = () => {
    setAmSession(EMPTY_SESSION);
    setPmSession(EMPTY_SESSION);
  };

  return {
    loading: {
      isLoading,
    },
    constants: {
      TARGET_HOURS: hasValidTargetHours ? Number(targetHours) : 0,
    },
    header: {
      now,
      isClockIn,
      statusLabel,
      userName: fullName,
      currentSessionTimeIn: activeSessionTimeIn,
      currentSessionHours: currentSessionHours,
      isDayComplete,
    },
    progress: {
      pct,
      remaining,
      estimatedFinishText,
    },
    sessions: {
      now,
      isSaving,
      amSession,
      pmSession,
      currentStatus,
      buttonConfig,
      isDayComplete,
      onToggleClock,
      showClockOutModal,
      setShowClockOutModal,
      handleConfirmClockOut,
      attendanceMode,
      modalHours,
      errorMessage,
      clearError: () => setErrorMessage(null),
    },
    summary: {
      todayHours,
      weekHours,
      monthHours,
      totalHours: totalRenderedHours,
    },
  };
}
