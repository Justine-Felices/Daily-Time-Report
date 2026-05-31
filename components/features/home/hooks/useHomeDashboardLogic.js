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
import {
  fetchAttendanceRecordByDate,
  fetchAttendanceRecordsByDateRange,
  fetchAttendanceMonthsWithData,
} from "@/lib/supabase-history";
import {
  isResetStatus,
  isHalfDayStatus,
  calculateTotalHours,
} from "@/lib/dtr-time-validation";
import { PHILIPPINE_HOLIDAYS_2026 } from "@/lib/dtr-constants";

const EMPTY_SESSION = { timeIn: null, timeOut: null };

const STATUS_TO_ENUM = {
  "Regular Duty Day": "REGULAR_DUTY_DAY",
  "Sick Leave": "SICK_LEAVE",
  "Vacation Leave": "VACATION_LEAVE",
  Absent: "ABSENT",
  Holiday: "HOLIDAY",
  "Half Day": "HALF_DAY",
  "Work From Home": "WORK_FROM_HOME",
  "On Field": "ON_FIELD",
};

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

function to24hClock(value) {
  if (!value) return null;
  const trimmed = value.trim();

  if (/^\d{2}:\d{2}$/.test(trimmed)) return trimmed;

  const match = trimmed.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
  if (!match) return null;

  let hours = Number(match[1]);
  const minutes = match[2];
  const period = match[3].toUpperCase();
  if (period === "AM" && hours === 12) hours = 0;
  if (period === "PM" && hours !== 12) hours += 12;
  return `${hours.toString().padStart(2, "0")}:${minutes}`;
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

function getMonthBounds(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);
  return {
    startKey: toLocalDateKey(start),
    endKey: toLocalDateKey(end),
  };
}

function monthKeyFromDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function dateFromMonthKey(monthKey) {
  const [year, month] = monthKey.split("-").map(Number);
  return new Date(year, month - 1, 1);
}

function formatDashboardDate(dateText) {
  if (typeof dateText !== "string") return null;

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateText.trim());
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (
    !Number.isFinite(year) ||
    !Number.isFinite(month) ||
    !Number.isFinite(day)
  ) {
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
  const [otSession, setOtSession] = useState(EMPTY_SESSION);
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
  const [status, setStatus] = useState("Regular Duty Day");
  const [hasTodayRecord, setHasTodayRecord] = useState(false);
  const [dashboardView, setDashboardView] = useState("live");
  const [note, setNote] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [warningMessage, setWarningMessage] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [calendarMonth, setCalendarMonth] = useState(() => new Date());
  const [calendarRecords, setCalendarRecords] = useState([]);
  const [calendarMonthsWithData, setCalendarMonthsWithData] = useState([]);
  const [isCalendarLoading, setIsCalendarLoading] = useState(false);
  const [calendarRefreshKey, setCalendarRefreshKey] = useState(0);

  // Keep track of the last known DB state to allow reverting manual edits
  const [persistedAmSession, setPersistedAmSession] = useState(EMPTY_SESSION);
  const [persistedPmSession, setPersistedPmSession] = useState(EMPTY_SESSION);
  const [persistedOtSession, setPersistedOtSession] = useState(EMPTY_SESSION);

  // Modal-specific editable fields
  const [modalAmIn, setModalAmIn] = useState("");
  const [modalAmOut, setModalAmOut] = useState("");
  const [modalPmIn, setModalPmIn] = useState("");
  const [modalPmOut, setModalPmOut] = useState("");

  // Auto-dismiss error after 5 seconds
  useEffect(() => {
    if (!errorMessage) return;
    const timer = setTimeout(() => setErrorMessage(null), 5000);
    return () => clearTimeout(timer);
  }, [errorMessage]);

  // Auto-dismiss success after 3 seconds
  useEffect(() => {
    if (!showSuccess) return;
    const timer = setTimeout(() => setShowSuccess(false), 3000);
    return () => clearTimeout(timer);
  }, [showSuccess]);

  // Auto-dismiss warning after 8 seconds
  useEffect(() => {
    if (!warningMessage) return;
    const timer = setTimeout(() => setWarningMessage(null), 8000);
    return () => clearTimeout(timer);
  }, [warningMessage]);

  const now = useLiveClock(60000);
  const todayKey = useMemo(() => toLocalDateKey(now), [now]);

  useEffect(() => {
    if (!supabase || !currentUserId) return;

    let mounted = true;

    fetchAttendanceMonthsWithData({ supabase, userId: currentUserId })
      .then((months) => {
        if (mounted) setCalendarMonthsWithData(months);
      })
      .catch(() => {
        if (mounted) setCalendarMonthsWithData([]);
      });

    return () => {
      mounted = false;
    };
  }, [supabase, currentUserId, calendarRefreshKey]);

  useEffect(() => {
    if (calendarMonthsWithData.length === 0) return;

    const currentKey = monthKeyFromDate(calendarMonth);
    if (calendarMonthsWithData.includes(currentKey)) return;

    const todayMonthKey = monthKeyFromDate(new Date());
    const fallbackKey = calendarMonthsWithData.includes(todayMonthKey)
      ? todayMonthKey
      : calendarMonthsWithData[calendarMonthsWithData.length - 1];

    setCalendarMonth(dateFromMonthKey(fallbackKey));
  }, [calendarMonthsWithData, calendarMonth]);

  useEffect(() => {
    if (!supabase || !currentUserId) return;

    let mounted = true;
    const { startKey, endKey } = getMonthBounds(calendarMonth);
    setIsCalendarLoading(true);

    fetchAttendanceRecordsByDateRange({
      supabase,
      userId: currentUserId,
      startDate: startKey,
      endDate: endKey,
    })
      .then((records) => {
        if (mounted) {
          setCalendarRecords(records);
        }
      })
      .catch(() => {
        if (mounted) {
          setCalendarRecords([]);
        }
      })
      .finally(() => {
        if (mounted) {
          setIsCalendarLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [supabase, currentUserId, calendarMonth, calendarRefreshKey]);

  // Revert manual edits when toggling back to Live Mode
  useEffect(() => {
    if (dashboardView === "live") {
      setAmSession(persistedAmSession);
      setPmSession(persistedPmSession);
      setOtSession(persistedOtSession);
    }
  }, [
    dashboardView,
    persistedAmSession,
    persistedPmSession,
    persistedOtSession,
  ]);

  // ─── 4-STATE ATTENDANCE LOGIC ───
  const currentStatus = useMemo(() => {
    // Single Mode Flow
    if (attendanceMode === "single") {
      if (!amSession.timeIn) return "clock-in";
      if (!pmSession.timeOut) return "clock-out-pm";
      return "done";
    }

    // Dual Mode Flow
    if (!amSession.timeIn && pmSession.timeIn && pmSession.timeOut)
      return "done";
    if (!amSession.timeIn) return "clock-in";
    if (!amSession.timeOut) return "clock-out-am";
    if (!pmSession.timeIn) return "start-pm";
    if (!pmSession.timeOut) return "clock-out-pm";
    return "done";
  }, [amSession, pmSession, attendanceMode]);

  // Persistence-based status to determine if the day is actually "finished" in DB
  const persistedStatus = useMemo(() => {
    if (attendanceMode === "single") {
      if (!persistedAmSession.timeIn) return "clock-in";
      if (!persistedPmSession.timeOut) return "clock-out-pm";
      return "done";
    }
    if (
      !persistedAmSession.timeIn &&
      persistedPmSession.timeIn &&
      persistedPmSession.timeOut
    )
      return "done";
    if (!persistedAmSession.timeIn) return "clock-in";
    if (!persistedAmSession.timeOut) return "clock-out-am";
    if (!persistedPmSession.timeIn) return "start-pm";
    if (!persistedPmSession.timeOut) return "clock-out-pm";
    return "done";
  }, [persistedAmSession, persistedPmSession, attendanceMode]);

  const isDayComplete = persistedStatus === "done";
  const hasAnyLog = Boolean(
    amSession.timeIn ||
    amSession.timeOut ||
    pmSession.timeIn ||
    pmSession.timeOut ||
    otSession.timeIn ||
    otSession.timeOut,
  );

  // Sync modal state when it opens
  useEffect(() => {
    if (showClockOutModal) {
      const timeNow = formatNowClock(now);
      setModalAmIn(amSession.timeIn || "");

      if (currentStatus === "clock-out-am") {
        if (attendanceMode === "dual") {
          const amInMinutes = toMinutes(amSession.timeIn);
          const amCutoff = toMinutes("11:00");
          if (amInMinutes !== null && amInMinutes >= amCutoff) {
            // Late start
            setModalAmOut("");
            setModalPmIn(amSession.timeIn || "");
            setModalPmOut(timeNow);
          } else {
            // Normal dual
            setModalAmOut("11:00");
            setModalPmIn("12:00");
            setModalPmOut(timeNow);
          }
        } else {
          // Single
          setModalAmOut("");
          setModalPmIn("");
          setModalPmOut(timeNow);
        }
      } else if (currentStatus === "clock-out-pm") {
        setModalAmOut(amSession.timeOut || "");
        setModalPmIn(pmSession.timeIn || "");
        setModalPmOut(timeNow);
      }
    }
  }, [
    showClockOutModal,
    amSession,
    pmSession,
    currentStatus,
    attendanceMode,
    now,
  ]);

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
          .select("attendance_mode, dashboard_view")
          .eq("user_id", userId)
          .maybeSingle(),
      ]);

      if (profileResult?.data) {
        setAttendanceMode(profileResult.data.attendance_mode || "dual");
        setDashboardView(profileResult.data.dashboard_view || "live");
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
        setOtSession({
          timeIn: todayRecord.otIn,
          timeOut: todayRecord.otOut,
        });
        setPersistedAmSession({
          timeIn: todayRecord.amIn,
          timeOut: todayRecord.amOut,
        });
        setPersistedPmSession({
          timeIn: todayRecord.pmIn,
          timeOut: todayRecord.pmOut,
        });
        setPersistedOtSession({
          timeIn: todayRecord.otIn,
          timeOut: todayRecord.otOut,
        });
        setStatus(todayRecord.status || "Regular Duty Day");
        setNote(todayRecord.note || "");
        setHasTodayRecord(true);
      } else {
        setAmSession(EMPTY_SESSION);
        setPmSession(EMPTY_SESSION);
        setOtSession(EMPTY_SESSION);
        setPersistedAmSession(EMPTY_SESSION);
        setPersistedPmSession(EMPTY_SESSION);
        setPersistedOtSession(EMPTY_SESSION);
        setStatus("Regular Duty Day");
        setNote("");
        setHasTodayRecord(false);
      }

      setCalendarRefreshKey((prev) => prev + 1);
    },
    [supabase, todayKey],
  );

  const handleManualTimeChange = useCallback((sessionType, field, value) => {
    if (sessionType === "am") {
      setAmSession((prev) => ({ ...prev, [field]: value }));
    } else if (sessionType === "ot") {
      setOtSession((prev) => ({ ...prev, [field]: value }));
    } else {
      setPmSession((prev) => ({ ...prev, [field]: value }));
    }
  }, []);

  const handleStatusChange = (newStatus) => {
    if (isResetStatus(newStatus)) {
      setAmSession(EMPTY_SESSION);
      setPmSession(EMPTY_SESSION);
      setOtSession(EMPTY_SESSION);
    } else if (isHalfDayStatus(newStatus)) {
      setPmSession(EMPTY_SESSION);
    }
    setStatus(newStatus);
  };

  const handleGlobalSave = async () => {
    if (!supabase || isSaving) return;
    setIsSaving(true);
    setErrorMessage(null);

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !user) {
        setErrorMessage("Session expired. Please log in again.");
        setIsSaving(false);
        return;
      }

      const amIn = to24hClock(amSession.timeIn);
      const amOut = to24hClock(amSession.timeOut);
      const pmIn = to24hClock(pmSession.timeIn);
      const pmOut = to24hClock(pmSession.timeOut);
      const otIn = to24hClock(otSession.timeIn);
      const otOut = to24hClock(otSession.timeOut);

      // Match Encode Past: single mode only saves am_in (Time In) + pm_out (Time Out)
      const isSingleMode = attendanceMode === "single";
      const dbPayload = isSingleMode
        ? {
            amIn: amIn || "",
            amOut: "",
            pmIn: "",
            pmOut: pmOut || "",
            otIn: otIn || "",
            otOut: otOut || "",
          }
        : {
            amIn: amIn || "",
            amOut: amOut || "",
            pmIn: pmIn || "",
            pmOut: pmOut || "",
            otIn: otIn || "",
            otOut: otOut || "",
          };

      const total = calculateTotalHours(dbPayload);

      const dbStatus = STATUS_TO_ENUM[status] || "REGULAR_DUTY_DAY";

      // Map attendance mode: DB only accepts "session" or "simple", not "dual"
      const dbMode = isSingleMode ? "simple" : "session";

      const finalRecord = {
        user_id: user.id,
        work_date: todayKey,
        am_in: dbPayload.amIn || null,
        am_out: dbPayload.amOut || null,
        pm_in: dbPayload.pmIn || null,
        pm_out: dbPayload.pmOut || null,
        ot_in: dbPayload.otIn || null,
        ot_out: dbPayload.otOut || null,
        total_hours: total,
        status: dbStatus,
        note: note.trim() || null,
        source: "ENCODE_PAST",
        mode: dbMode,
      };

      if (process.env.NODE_ENV !== "production") {
        console.log("Saving Attendance Payload:", finalRecord);
      }

      // Execute Upsert
      const { data: savedData, error: updateError } = await supabase
        .from("attendance_entries")
        .upsert(finalRecord, { onConflict: "user_id,work_date" })
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      const otSent = Boolean(finalRecord.ot_in || finalRecord.ot_out);
      const otSaved = Boolean(savedData?.ot_in || savedData?.ot_out);
      if (otSent && !otSaved) {
        setWarningMessage(
          "Note: Overtime (OT) times were not saved because your database does not currently support OT or has constraints preventing it.",
        );
      }

      // Success -> Refresh
      await refreshPersistedSummary(user.id);
      setShowSuccess(true);
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Dashboard Save Exception:", err);
      }

      const msg = err instanceof Error ? err.message : "Unknown error";
      setErrorMessage(`Save failed: ${msg}`);
    } finally {
      setIsSaving(false);
    }
  };

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

        setCurrentUserId(user.id);

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

  // client-side holiday-aware finish date calc
  const clientEstimatedFinishDate = useMemo(() => {
    if (!hasValidTargetHours || remaining <= 0) return null;

    // assume 8 hours per day
    const hoursPerDay = 8;
    const daysNeeded = Math.ceil(remaining / hoursPerDay);

    let currentDate = new Date();
    // if it's already past 5pm today, start counting from tomorrow
    if (currentDate.getHours() >= 17) {
      currentDate.setDate(currentDate.getDate() + 1);
    }

    let workDaysCount = 0;
    while (workDaysCount < daysNeeded) {
      const dayOfWeek = currentDate.getDay(); // 0=Sun, 6=Sat
      const dateString = currentDate.toISOString().split("T")[0];
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isHoliday = PHILIPPINE_HOLIDAYS_2026.includes(dateString);

      if (!isWeekend && !isHoliday) {
        workDaysCount++;
      }

      if (workDaysCount < daysNeeded) {
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
    return currentDate.toISOString().split("T")[0];
  }, [hasValidTargetHours, remaining]);

  const formattedEstimatedFinish = formatDashboardDate(
    clientEstimatedFinishDate || persistedEstimatedFinishDate,
  );
  const estimatedFinishText = !hasValidTargetHours
    ? "Set target hours"
    : formattedEstimatedFinish || "Not available";

  // ─── 4-STATE ATTENDANCE LOGIC (derived from Supabase data only) ───

  const buttonConfig = useMemo(() => {
    // If the day is complete, show as "Already Logged"
    if (currentStatus === "done") {
      return {
        label: "Already Logged",
        background: "rgba(255, 255, 255, 0.05)",
        color: "rgba(255, 255, 255, 0.3)",
        shadow: "transparent",
      };
    }

    switch (currentStatus) {
      case "clock-in":
        return {
          label: "Clock In",
          background: "linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)",
          color: "#FFFFFF",
          shadow: "rgba(59, 130, 246, 0.4)",
        };
      case "clock-out-am":
        return {
          label: "Clock Out (AM)",
          background: "linear-gradient(135deg, #FB7185 0%, #E11D48 100%)",
          color: "#FFFFFF",
          shadow: "rgba(225, 29, 72, 0.3)",
        };
      case "start-pm":
        return {
          label: "Start PM",
          background: "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)",
          color: "#FFFFFF",
          shadow: "rgba(59, 130, 246, 0.4)",
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
  }, [currentStatus, hasAnyLog]);

  const isClockIn = useMemo(() => {
    if (attendanceMode === "single") {
      return Boolean(amSession.timeIn && !pmSession.timeOut);
    }
    return Boolean(
      (amSession.timeIn && !amSession.timeOut) ||
      (pmSession.timeIn && !pmSession.timeOut),
    );
  }, [amSession, pmSession, attendanceMode]);

  const activeSessionTimeIn = useMemo(() => {
    if (attendanceMode === "single") {
      return amSession.timeIn && !pmSession.timeOut ? amSession.timeIn : null;
    }
    return amSession.timeIn && !amSession.timeOut
      ? amSession.timeIn
      : pmSession.timeIn && !pmSession.timeOut
        ? pmSession.timeIn
        : null;
  }, [amSession, pmSession, attendanceMode]);

  const currentSessionHours = useMemo(() => {
    const otHours = calculateDuration(otSession.timeIn, otSession.timeOut);
    if (!activeSessionTimeIn) return otHours;
    const startMinutes = toMinutes(activeSessionTimeIn);
    const nowMinutes = toMinutes(formatNowClock(now));
    if (startMinutes === null || nowMinutes === null) return otHours;
    return Math.max(0, (nowMinutes - startMinutes) / 60) + otHours;
  }, [activeSessionTimeIn, now, otSession]);

  const modalHours = useMemo(() => {
    if (!showClockOutModal) return 0;

    if (attendanceMode === "dual") {
      const amInMinutes = toMinutes(modalAmIn);
      const amCutoff = toMinutes("11:00");

      if (amInMinutes !== null && amInMinutes >= amCutoff) {
        // Late start (treated as PM only)
        const pm = calculateDuration(modalPmIn, modalPmOut);
        const ot = calculateDuration(otSession.timeIn, otSession.timeOut);
        return Math.min(8, pm) + ot;
      }

      // Normal dual
      const morning = calculateDuration(modalAmIn, modalAmOut);
      const afternoon = calculateDuration(modalPmIn, modalPmOut);
      const ot = calculateDuration(otSession.timeIn, otSession.timeOut);
      return Math.min(8, morning + afternoon) + ot;
    }

    // Single mode
    const base = calculateDuration(modalAmIn, modalPmOut);
    const ot = calculateDuration(otSession.timeIn, otSession.timeOut);
    return Math.min(8, base) + ot;
  }, [
    showClockOutModal,
    modalAmIn,
    modalAmOut,
    modalPmIn,
    modalPmOut,
    attendanceMode,
    otSession,
  ]);

  const statusLabel = isClockIn ? "CLOCKED IN" : "CLOCK OUT";

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
        setErrorMessage(
          "Your session has expired. Please log in again to record your attendance.",
        );
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
        setErrorMessage(
          "We couldn't reach the server. Please check your connection and try clocking in again.",
        );
        return;
      }
      await refreshPersistedSummary(user.id);
    } catch (err) {
      setErrorMessage(
        "Something went wrong on our end. Please refresh the page and try again.",
      );
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
        setErrorMessage(
          "Session expired. Please log in again to start your PM session.",
        );
        return;
      }
      const timeNow = formatNowClock(new Date());
      const { error: updateError } = await supabase
        .from("attendance_entries")
        .update({ pm_in: timeNow })
        .eq("user_id", user.id)
        .eq("work_date", todayKey);
      if (updateError) {
        setErrorMessage(
          "Failed to start PM session. Please check your internet connection.",
        );
        return;
      }
      await refreshPersistedSummary(user.id);
    } catch (err) {
      setErrorMessage(
        "We encountered an error starting your session. Please try again in a moment.",
      );
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
        setErrorMessage(
          "Session expired. Please log in again to save your clock out.",
        );
        return;
      }

      // --- VALIDATION ---
      const amInMin = toMinutes(modalAmIn);
      const amOutMin = toMinutes(modalAmOut);
      const pmInMin = toMinutes(modalPmIn);
      const pmOutMin = toMinutes(modalPmOut);

      // 1. Basic Format Checks
      if (modalAmIn && amInMin === null) {
        setErrorMessage("Invalid format for AM Time In");
        setIsSaving(false);
        return;
      }
      if (modalAmOut && amOutMin === null) {
        setErrorMessage("Invalid format for AM Time Out");
        setIsSaving(false);
        return;
      }
      if (modalPmIn && pmInMin === null) {
        setErrorMessage("Invalid format for PM Time In");
        setIsSaving(false);
        return;
      }
      if (modalPmOut && pmOutMin === null) {
        setErrorMessage("Invalid format for Current Time");
        setIsSaving(false);
        return;
      }

      // 2. Logical Sequence Checks
      if (attendanceMode === "dual") {
        const amCutoff = toMinutes("11:00");
        const isLateStart = amInMin !== null && amInMin >= amCutoff;

        if (isLateStart) {
          // Validate PM-only flow
          if (pmInMin === null) {
            setErrorMessage("PM Time In is required");
            setIsSaving(false);
            return;
          }
          if (pmOutMin <= pmInMin) {
            setErrorMessage("Current Time must be after PM Time In");
            setIsSaving(false);
            return;
          }
        } else {
          // Validate normal Dual flow
          if (amInMin === null) {
            setErrorMessage("AM Time In is required");
            setIsSaving(false);
            return;
          }
          if (amOutMin === null) {
            setErrorMessage("AM Time Out is required");
            setIsSaving(false);
            return;
          }
          if (pmInMin === null) {
            setErrorMessage("PM Time In is required");
            setIsSaving(false);
            return;
          }
          if (amOutMin <= amInMin) {
            setErrorMessage("AM Time Out must be after AM Time In");
            setIsSaving(false);
            return;
          }
          if (pmInMin < amOutMin) {
            setErrorMessage("PM Time In cannot be before AM Time Out");
            setIsSaving(false);
            return;
          }
          if (pmOutMin <= pmInMin) {
            setErrorMessage("Current Time must be after PM Time In");
            setIsSaving(false);
            return;
          }
        }
      } else {
        // Single Mode Validation
        if (amInMin === null) {
          setErrorMessage("Time In is required");
          setIsSaving(false);
          return;
        }
        if (pmOutMin <= amInMin) {
          setErrorMessage("Current Time must be after Time In");
          setIsSaving(false);
          return;
        }
      }

      const timeNow = formatNowClock(new Date());
      const otInValue = to24hClock(otSession.timeIn);
      const otOutValue = to24hClock(otSession.timeOut);
      let updates = {};

      if (currentStatus === "clock-out-am") {
        if (attendanceMode === "dual") {
          const amInMinutes = toMinutes(modalAmIn);
          const amCutoff = toMinutes("11:00");

          if (amInMinutes !== null && amInMinutes >= amCutoff) {
            // CASE 2: Late start (am_in >= 11:00 AM) — treat as PM-only
            updates = {
              am_in: null,
              am_out: null,
              pm_in: modalPmIn,
              pm_out: modalPmOut,
              ot_in: otInValue || null,
              ot_out: otOutValue || null,
              total_hours: modalHours,
            };
          } else {
            // CASE 1: Normal dual mode
            updates = {
              am_in: modalAmIn,
              am_out: modalAmOut,
              pm_in: modalPmIn,
              pm_out: modalPmOut,
              ot_in: otInValue || null,
              ot_out: otOutValue || null,
              total_hours: modalHours,
            };
          }
        } else {
          // Single mode
          updates = {
            am_in: modalAmIn,
            pm_out: modalPmOut,
            ot_in: otInValue || null,
            ot_out: otOutValue || null,
            total_hours: modalHours,
          };
        }
      } else if (currentStatus === "clock-out-pm") {
        updates = {
          am_in: modalAmIn,
          am_out: modalAmOut,
          pm_in: modalPmIn,
          pm_out: modalPmOut,
          ot_in: otInValue || null,
          ot_out: otOutValue || null,
          total_hours: modalHours,
          note: note.trim() || null,
        };
      }

      const { data: savedData, error: updateError } = await supabase
        .from("attendance_entries")
        .update(updates)
        .eq("user_id", user.id)
        .eq("work_date", todayKey)
        .select()
        .single();
      if (updateError) {
        setErrorMessage(
          "Unable to save your clock out. Please check your connection.",
        );
        return;
      }

      const otSent = Boolean(updates.ot_in || updates.ot_out);
      const otSaved = Boolean(savedData?.ot_in || savedData?.ot_out);
      if (otSent && !otSaved) {
        setWarningMessage(
          "Note: Overtime (OT) times were not saved because your database does not currently support OT or has constraints preventing it.",
        );
      }

      await refreshPersistedSummary(user.id);
      setShowSuccess(true);
      setShowClockOutModal(false);
    } catch (err) {
      setErrorMessage(
        "Something went wrong while clocking out. Please try again.",
      );
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
    setOtSession(EMPTY_SESSION);
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
      otSession,
      persistedAmSession,
      persistedPmSession,
      persistedOtSession,
      currentStatus,
      buttonConfig,
      isDayComplete,
      hasAnyLog,
      hasTodayRecord,
      onToggleClock,
      showClockOutModal,
      setShowClockOutModal,
      handleConfirmClockOut,
      attendanceMode,
      modalHours,
      errorMessage,
      status,
      handleStatusChange,
      handleGlobalSave,
      handleManualTimeChange,
      modalAmIn,
      setModalAmIn,
      modalAmOut,
      setModalAmOut,
      modalPmIn,
      setModalPmIn,
      modalPmOut,
      setModalPmOut,
      dashboardView,
      note,
      setNote,
      showSuccess,
      setShowSuccess,
      warningMessage,
      setWarningMessage,
      clearError: () => setErrorMessage(null),
    },
    summary: {
      todayHours,
      weekHours,
      monthHours,
      totalHours: totalRenderedHours,
    },
    calendar: {
      monthDate: calendarMonth,
      setMonthDate: setCalendarMonth,
      records: calendarRecords,
      monthsWithData: calendarMonthsWithData,
      isLoading: isCalendarLoading,
      todayKey,
    },
  };
}
