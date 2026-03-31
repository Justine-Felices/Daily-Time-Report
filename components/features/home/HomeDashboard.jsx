"use client";

import { useState } from "react";
import useLiveClock from "@/hooks/useLiveClock";
import useTimedFlag from "@/hooks/useTimedFlag";
import { GLASS_INPUT_STYLE, STATUS_OPTIONS } from "@/lib/dtr-constants";
import PageShell from "@/components/layout/PageShell";
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
const NON_WORKING_STATUSES = [
  "Sick Leave",
  "Vacation Leave",
  "Absent",
  "Holiday",
];
const EMPTY_SESSION = { timeIn: null, timeOut: null };

const HOME_INPUT_STYLE = {
  ...GLASS_INPUT_STYLE,
  fontSize: "13px",
  transition: "all 0.15s",
};

export default function HomeDashboard() {
  const [amSession, setAmSession] = useState(EMPTY_SESSION);
  const [pmSession, setPmSession] = useState(EMPTY_SESSION);
  const [dailyStatus, setDailyStatus] = useState(STATUS_OPTIONS[0]);
  const [pendingStatus, setPendingStatus] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [dailyNote, setDailyNote] = useState("");
  const [amHasTimeError, setAmHasTimeError] = useState(false);
  const [pmHasTimeError, setPmHasTimeError] = useState(false);
  const [noteSaved, triggerNoteSaved] = useTimedFlag(2500);
  const now = useLiveClock();

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
  const isSessionLocked = NON_WORKING_STATUSES.includes(dailyStatus);
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

  const isResetStatus = (status) => {
    const normalizedStatus = status.toLowerCase();

    return (
      NON_WORKING_STATUSES.includes(status) ||
      normalizedStatus.includes("sick") ||
      normalizedStatus.includes("vacation") ||
      normalizedStatus.includes("absent") ||
      normalizedStatus.includes("holiday")
    );
  };

  const resetSessionLogs = () => {
    setAmSession(EMPTY_SESSION);
    setPmSession(EMPTY_SESSION);
    setAmHasTimeError(false);
    setPmHasTimeError(false);
  };

  const handleDailyStatusChange = (event) => {
    const nextStatus = event.target.value;

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
        onSave={triggerNoteSaved}
        disableSave={hasTimeLoggingError}
        noteSaved={noteSaved}
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
    </PageShell>
  );
}
