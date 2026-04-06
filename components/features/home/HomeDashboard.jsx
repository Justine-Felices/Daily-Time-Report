"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import useLiveClock from "@/hooks/useLiveClock";
import useTimedFlag from "@/hooks/useTimedFlag";
import { GLASS_INPUT_STYLE, STATUS_OPTIONS } from "@/lib/dtr-constants";
import { isResetStatus, isHalfDayStatus } from "@/lib/dtr-time-validation";
import {
  fetchUserProfileByUserId,
  isUserProfileOnboarded,
  mapUserProfileToOnboardingValues,
} from "@/lib/supabase-user-profiles";
import PageShell from "@/components/layout/PageShell";
import OnboardingModal from "@/components/features/home/components/OnboardingModal";
import HeaderSection from "@/components/features/home/sections/HeaderSection";
import ProgressSection from "@/components/features/home/sections/ProgressSection";
import SessionAndStatusSection from "@/components/features/home/sections/SessionAndStatusSection";
import SummarySection from "@/components/features/home/sections/SummarySection";

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

const TARGET_HOURS = 500;
const BASE_MONTH_HOURS = 126;
const BASE_TOTAL_HOURS = 274;
const EMPTY_SESSION = { timeIn: null, timeOut: null };
const HOME_STATUS_SAVE_LOCK_KEY = "dtr-home-status-save-lock";

function toLocalDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const HOME_INPUT_STYLE = {
  ...GLASS_INPUT_STYLE,
  fontSize: "13px",
  transition: "all 0.15s",
};

export default function HomeDashboard() {
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
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [onboardingUserId, setOnboardingUserId] = useState("");
  const [onboardingValues, setOnboardingValues] = useState(null);
  const now = useLiveClock(60000); // Updates every minute
  const todayKey = useMemo(() => toLocalDateKey(now), [now]);

  useEffect(() => {
    if (!supabase) return;

    let mounted = true;

    const loadOnboardingState = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (!mounted || userError || !user) {
        return;
      }

      setOnboardingUserId(user.id);

      const { data: profile, error: profileError } =
        await fetchUserProfileByUserId({
          supabase,
          userId: user.id,
        });

      if (!mounted) return;

      if (profileError) {
        setIsOnboardingOpen(true);
        return;
      }

      setOnboardingValues(
        profile ? mapUserProfileToOnboardingValues(profile) : null,
      );
      setIsOnboardingOpen(!isUserProfileOnboarded(profile));
    };

    loadOnboardingState();

    return () => {
      mounted = false;
    };
  }, [supabase]);

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
  const totalRenderedHours = BASE_TOTAL_HOURS + todayHours;
  const pct = Math.min(
    100,
    Math.round((totalRenderedHours / TARGET_HOURS) * 100),
  );
  const remaining = Math.max(0, TARGET_HOURS - totalRenderedHours);

  const estimatedFinish = new Date();
  estimatedFinish.setDate(estimatedFinish.getDate() + Math.ceil(remaining / 8));
  const estimatedFinishText = estimatedFinish.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

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

    // Handle half day status - clear PM session only
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

  return (
    <PageShell width="wide">
      <HeaderSection
        now={now}
        isClockIn={isClockIn}
        statusLabel={statusLabel}
      />

      <ProgressSection
        pct={pct}
        remaining={remaining}
        targetHours={TARGET_HOURS}
        estimatedFinishText={estimatedFinishText}
      />

      <SessionAndStatusSection
        now={now}
        amSession={amSession}
        pmSession={pmSession}
        onAmTimeIn={handleAmTimeIn}
        onAmTimeOut={handleAmTimeOut}
        onPmTimeIn={handlePmTimeIn}
        onPmTimeOut={handlePmTimeOut}
        onAmTimeInChange={handleAmTimeInChange}
        onAmTimeOutChange={handleAmTimeOutChange}
        onPmTimeInChange={handlePmTimeInChange}
        onPmTimeOutChange={handlePmTimeOutChange}
        onAmValidationChange={setAmHasTimeError}
        onPmValidationChange={setPmHasTimeError}
        sessionsLocked={isSessionLocked}
        dailyStatus={dailyStatus}
        dailyNote={dailyNote}
        onDailyStatusChange={handleDailyStatusChange}
        onDailyNoteChange={(event) => setDailyNote(event.target.value)}
        onSave={handleSaveTodayStatus}
        disableSave={hasTimeLoggingError}
        noteSaved={noteSaved}
        saveLocked={hasSavedToday}
        statusOptions={STATUS_OPTIONS}
        inputStyle={HOME_INPUT_STYLE}
      />

      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 px-4">
          <div
            className="w-full max-w-md rounded-2xl border p-5"
            style={{
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              borderColor: "rgba(6,148,148,0.2)",
              boxShadow: "0 8px 30px rgba(15,23,42,0.28)",
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Confirm log reset"
          >
            <h3
              style={{
                color: "#0F172A",
                fontSize: "16px",
                fontWeight: 800,
                fontFamily: "'Inter',sans-serif",
                marginBottom: "8px",
              }}
            >
              Reset time logs?
            </h3>
            <p
              style={{
                color: "#334155",
                fontSize: "13px",
                lineHeight: 1.5,
                fontFamily: "'Inter',sans-serif",
                marginBottom: "16px",
              }}
            >
              Changing status to {pendingStatus || "this option"} will delete
              your AM and PM session logs for today. Do you want to continue?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCancelReset}
                className="rounded-xl px-3.5 py-2"
                style={{
                  background: "rgba(148,163,184,0.16)",
                  border: "1px solid rgba(148,163,184,0.28)",
                  color: "#334155",
                  fontSize: "12px",
                  fontWeight: 700,
                  fontFamily: "'Inter',sans-serif",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                className="rounded-xl px-3.5 py-2"
                style={{
                  background: "linear-gradient(135deg,#EF4444,#DC2626)",
                  border: "1px solid rgba(220,38,38,0.28)",
                  color: "#fff",
                  fontSize: "12px",
                  fontWeight: 700,
                  fontFamily: "'Inter',sans-serif",
                  boxShadow: "0 3px 12px rgba(220,38,38,0.3)",
                }}
              >
                Yes, Reset Logs
              </button>
            </div>
          </div>
        </div>
      )}

      <SummarySection
        todayHours={todayHours}
        monthHours={monthHours}
        totalHours={totalRenderedHours}
      />

      <OnboardingModal
        isOpen={isOnboardingOpen}
        supabase={supabase}
        userId={onboardingUserId}
        initialValues={onboardingValues}
        allowCancel={false}
        onComplete={(profile) => {
          setOnboardingValues(mapUserProfileToOnboardingValues(profile));
          setIsOnboardingOpen(false);
        }}
      />
    </PageShell>
  );
}
