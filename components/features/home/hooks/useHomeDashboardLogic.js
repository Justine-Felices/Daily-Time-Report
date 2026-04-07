import { useEffect, useMemo, useState } from "react";
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
import { fetchOverallInternHoursByUserId } from "@/lib/supabase-overall-hours";

const BASE_MONTH_HOURS = 126;
const EMPTY_SESSION = { timeIn: null, timeOut: null };
const HOME_STATUS_SAVE_LOCK_KEY = "dtr-home-status-save-lock";

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
  const [isLoading, setIsLoading] = useState(true);

  const now = useLiveClock(60000);
  const todayKey = useMemo(() => toLocalDateKey(now), [now]);

  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    let mounted = true;

    const loadOnboardingState = async () => {
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

      const overallHours = await fetchOverallInternHoursByUserId({
        supabase,
        userId: user.id,
      });

      if (!mounted) return;

      if (overallHours !== null) {
        setPersistedTotalHours(overallHours);
      }

      if (!isUserProfileOnboarded(profile)) {
        router.replace("/onboarding");
      }

      setIsLoading(false);
    };

    loadOnboardingState();

    return () => {
      mounted = false;
    };
  }, [router, supabase]);

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

  const todayHours =
    (amSession.timeIn && amSession.timeOut ? 4 : amSession.timeIn ? 2 : 0) +
    (pmSession.timeIn && pmSession.timeOut ? 4 : pmSession.timeIn ? 2 : 0);

  const monthHours = BASE_MONTH_HOURS + todayHours;
  const totalRenderedHours = persistedTotalHours + todayHours;
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

  const hasAnyLog = amSession.timeIn || pmSession.timeIn;
  const isClockIn =
    (amSession.timeIn && !amSession.timeOut) ||
    (pmSession.timeIn && !pmSession.timeOut);

  const statusLabel = isClockIn
    ? "CLOCKED IN"
    : hasAnyLog
      ? "CLOCKED OUT"
      : "NOT YET";
  const isSessionLocked = isResetStatus(dailyStatus);
  const hasTimeLoggingError = amHasTimeError || pmHasTimeError;
  const pmEarliestTime = amSession.timeOut || amSession.timeIn;

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

  const handleSaveTodayStatus = () => {
    if (hasSavedToday) {
      return;
    }

    triggerNoteSaved();
    setHasSavedToday(true);

    if (typeof window === "undefined") return;

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
      disableSave: hasTimeLoggingError,
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
