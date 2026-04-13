import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import useLiveClock from "@/hooks/useLiveClock";
import useTimedFlag from "@/hooks/useTimedFlag";
import { GLASS_INPUT_STYLE, STATUS_OPTIONS } from "@/lib/dtr-constants";
import { isHalfDayStatus, isResetStatus } from "@/lib/dtr-time-validation";
import {
  fetchUserProfileByUserId,
  isUserProfileOnboarded,
} from "@/lib/supabase-user-profiles";
import { fetchDashboardInternHoursByUserId } from "@/lib/supabase-dashboard-hours";

const EMPTY_SESSION = { timeIn: null, timeOut: null };
const HOME_STATUS_SAVE_LOCK_KEY = "dtr-home-status-save-lock";
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

const HOME_INPUT_STYLE = {
  ...GLASS_INPUT_STYLE,
  fontSize: "13px",
  transition: "all 0.15s",
};

function formatNowClock(date) {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

function toMinutes(clock) {
  if (!clock) return null;
  const [hours, minutes] = clock.split(":").map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
  return hours * 60 + minutes;
}

function toLocalDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
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
  const [dailyStatus, setDailyStatus] = useState(STATUS_OPTIONS[0]);
  const [pendingStatus, setPendingStatus] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [dailyNote, setDailyNote] = useState("");
  const [amHasTimeError, setAmHasTimeError] = useState(false);
  const [pmHasTimeError, setPmHasTimeError] = useState(false);
  const [noteSaved, triggerNoteSaved] = useTimedFlag(2500);
  const [hasSavedToday, setHasSavedToday] = useState(false);
  const [targetHours, setTargetHours] = useState(null);
  const [persistedTotalHours, setPersistedTotalHours] = useState(0);
  const [persistedWeekHours, setPersistedWeekHours] = useState(0);
  const [persistedTodayHours, setPersistedTodayHours] = useState(0);
  const [persistedMonthHours, setPersistedMonthHours] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const now = useLiveClock(60000);
  const todayKey = useMemo(() => toLocalDateKey(now), [now]);

  const refreshPersistedSummary = useCallback(
    async (userId) => {
      if (!supabase || !userId) return;

      const dashboardHours = await fetchDashboardInternHoursByUserId({
        supabase,
        userId,
      });

      if (!dashboardHours) {
        setPersistedTodayHours(0);
        setPersistedWeekHours(0);
        setPersistedMonthHours(0);
        setPersistedTotalHours(0);
        return;
      }

      setPersistedTodayHours(dashboardHours.todayHours);
      setPersistedWeekHours(dashboardHours.weekHours);
      setPersistedMonthHours(dashboardHours.monthHours);
      setPersistedTotalHours(dashboardHours.totalHours);
    },
    [supabase],
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

  useEffect(() => {
    if (typeof window === "undefined") return;

    Promise.resolve().then(() => {
      try {
        const raw = window.localStorage.getItem(HOME_STATUS_SAVE_LOCK_KEY);

        if (!raw) {
          setHasSavedToday(false);
          return;
        }

        const parsed = JSON.parse(raw);
        setHasSavedToday(parsed?.date === todayKey);
      } catch {
        setHasSavedToday(false);
      }
    });
  }, [todayKey]);

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

  const estimatedFinish = new Date();
  estimatedFinish.setDate(estimatedFinish.getDate() + Math.ceil(remaining / 8));
  const estimatedFinishText = hasValidTargetHours
    ? estimatedFinish.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Set target hours";

  const isClockIn =
    (amSession.timeIn && !amSession.timeOut) ||
    (pmSession.timeIn && !pmSession.timeOut);

  const statusLabel = isClockIn ? "CLOCKED IN" : "CLOCK OUT";
  const isSessionLocked = isResetStatus(dailyStatus);
  const hasTimeLoggingError = amHasTimeError || pmHasTimeError;
  const pmEarliestTime = amSession.timeOut || amSession.timeIn;
  const hasAnyLog = Boolean(
    amSession.timeIn ||
      amSession.timeOut ||
      pmSession.timeIn ||
      pmSession.timeOut,
  );

  const handleAmTimeIn = () => {
    setAmSession((prev) => ({
      ...prev,
      timeIn: formatNowClock(new Date()),
    }));
  };

  const handleAmTimeOut = () => {
    setAmSession((prev) => {
      const nowClock = formatNowClock(new Date());
      if (prev.timeIn && toMinutes(nowClock) <= toMinutes(prev.timeIn)) {
        return prev;
      }

      return {
        ...prev,
        timeOut: nowClock,
      };
    });
  };

  const handlePmTimeIn = () => {
    setPmSession((prev) => {
      const nowClock = formatNowClock(new Date());
      if (pmEarliestTime && toMinutes(nowClock) < toMinutes(pmEarliestTime)) {
        return prev;
      }

      return {
        ...prev,
        timeIn: nowClock,
      };
    });
  };

  const handlePmTimeOut = () => {
    setPmSession((prev) => {
      const nowClock = formatNowClock(new Date());
      if (pmEarliestTime && toMinutes(nowClock) < toMinutes(pmEarliestTime)) {
        return prev;
      }
      if (prev.timeIn && toMinutes(nowClock) <= toMinutes(prev.timeIn)) {
        return prev;
      }

      return {
        ...prev,
        timeOut: nowClock,
      };
    });
  };

  const handleAmTimeInChange = (value) => {
    setAmSession((prev) => ({ ...prev, timeIn: value }));
  };

  const handleAmTimeOutChange = (value) => {
    setAmSession((prev) => ({ ...prev, timeOut: value }));
  };

  const handlePmTimeInChange = (value) => {
    setPmSession((prev) => ({ ...prev, timeIn: value }));
  };

  const handlePmTimeOutChange = (value) => {
    setPmSession((prev) => ({ ...prev, timeOut: value }));
  };

  const resetSessionLogs = () => {
    setAmSession(EMPTY_SESSION);
    setPmSession(EMPTY_SESSION);
    setAmHasTimeError(false);
    setPmHasTimeError(false);
  };

  const handleDailyStatusChange = (event) => {
    const nextStatus = event.target.value;

    if (isHalfDayStatus(nextStatus)) {
      setDailyStatus(nextStatus);
      setPmSession(EMPTY_SESSION);
      setPmHasTimeError(false);
      return;
    }

    if (!isResetStatus(nextStatus)) {
      setDailyStatus(nextStatus);
      return;
    }

    if (!hasAnyLog) {
      setDailyStatus(nextStatus);
      resetSessionLogs();
      return;
    }

    setPendingStatus(nextStatus);
    setShowResetConfirm(true);
  };

  const handleConfirmReset = () => {
    if (pendingStatus) {
      setDailyStatus(pendingStatus);
    }

    resetSessionLogs();
    setPendingStatus(null);
    setShowResetConfirm(false);
  };

  const handleCancelReset = () => {
    setPendingStatus(null);
    setShowResetConfirm(false);
  };

  const handleSaveTodayStatus = async () => {
    if (hasSavedToday || isSaving || !supabase) {
      return;
    }

    setIsSaving(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("You must be logged in to save your session.");
      }

      const { error: saveError } = await supabase
        .from("attendance_entries")
        .upsert(
          {
            user_id: user.id,
            work_date: todayKey,
            am_in: amSession.timeIn || null,
            am_out: amSession.timeOut || null,
            pm_in: pmSession.timeIn || null,
            pm_out: pmSession.timeOut || null,
            status: STATUS_TO_ENUM[dailyStatus] || "REGULAR_DUTY_DAY",
            note: dailyNote.trim() || null,
            total_hours: Number(draftTodayHours) || 0,
            source: "ENCODE_PAST",
          },
          { onConflict: "user_id,work_date" },
        );

      if (saveError) {
        throw new Error(saveError.message || "Failed to save today's status.");
      }

      await refreshPersistedSummary(user.id);

      triggerNoteSaved();
      setHasSavedToday(true);

      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem(
            HOME_STATUS_SAVE_LOCK_KEY,
            JSON.stringify({
              date: todayKey,
              savedAt: new Date().toISOString(),
            }),
          );
        } catch {
          // Ignore storage issues in restricted browsing contexts.
        }
      }
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Failed to save Home session/status", error);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return {
    loading: {
      isLoading,
    },
    constants: {
      TARGET_HOURS: hasValidTargetHours ? Number(targetHours) : 0,
      STATUS_OPTIONS,
      HOME_INPUT_STYLE,
    },
    header: {
      now,
      isClockIn,
      statusLabel,
    },
    progress: {
      pct,
      remaining,
      estimatedFinishText,
    },
    sessions: {
      now,
      amSession,
      pmSession,
      dailyStatus,
      dailyNote,
      noteSaved,
      saveLocked: hasSavedToday,
      sessionsLocked: isSessionLocked,
      disableSave: hasTimeLoggingError || isSaving,
      onAmTimeIn: handleAmTimeIn,
      onAmTimeOut: handleAmTimeOut,
      onPmTimeIn: handlePmTimeIn,
      onPmTimeOut: handlePmTimeOut,
      onAmTimeInChange: handleAmTimeInChange,
      onAmTimeOutChange: handleAmTimeOutChange,
      onPmTimeInChange: handlePmTimeInChange,
      onPmTimeOutChange: handlePmTimeOutChange,
      onAmValidationChange: setAmHasTimeError,
      onPmValidationChange: setPmHasTimeError,
      onDailyStatusChange: handleDailyStatusChange,
      onDailyNoteChange: (event) => setDailyNote(event.target.value),
      onSave: handleSaveTodayStatus,
    },
    summary: {
      todayHours,
      weekHours,
      monthHours,
      totalHours: totalRenderedHours,
    },
    resetDialog: {
      showResetConfirm,
      pendingStatus,
      handleCancelReset,
      handleConfirmReset,
    },
  };
}
