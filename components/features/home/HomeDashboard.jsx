"use client";

import PageShell from "@/components/layout/PageShell";
import HeaderSection from "@/components/features/home/sections/HeaderSection";
import ProgressSection from "@/components/features/home/sections/ProgressSection";
import SessionAndStatusSection from "@/components/features/home/sections/SessionAndStatusSection";
import SummarySection from "@/components/features/home/sections/SummarySection";
import useHomeDashboardLogic from "@/components/features/home/hooks/useHomeDashboardLogic";

export default function HomeDashboard() {
  const {
    loading,
    constants,
    header,
    progress,
    sessions,
    summary,
    resetDialog,
  } = useHomeDashboardLogic();

  return (
    <PageShell width="wide">
      <HeaderSection
        now={header.now}
        isClockIn={header.isClockIn}
        statusLabel={header.statusLabel}
      />

      <ProgressSection
        isLoading={loading.isLoading}
        pct={progress.pct}
        remaining={progress.remaining}
        targetHours={constants.TARGET_HOURS}
        estimatedFinishText={progress.estimatedFinishText}
      />

      <SessionAndStatusSection
        isLoading={loading.isLoading}
        now={sessions.now}
        amSession={sessions.amSession}
        pmSession={sessions.pmSession}
        onAmTimeIn={sessions.onAmTimeIn}
        onAmTimeOut={sessions.onAmTimeOut}
        onPmTimeIn={sessions.onPmTimeIn}
        onPmTimeOut={sessions.onPmTimeOut}
        onAmTimeInChange={sessions.onAmTimeInChange}
        onAmTimeOutChange={sessions.onAmTimeOutChange}
        onPmTimeInChange={sessions.onPmTimeInChange}
        onPmTimeOutChange={sessions.onPmTimeOutChange}
        onAmValidationChange={sessions.onAmValidationChange}
        onPmValidationChange={sessions.onPmValidationChange}
        sessionsLocked={sessions.sessionsLocked}
        dailyStatus={sessions.dailyStatus}
        dailyNote={sessions.dailyNote}
        onDailyStatusChange={sessions.onDailyStatusChange}
        onDailyNoteChange={sessions.onDailyNoteChange}
        onSave={sessions.onSave}
        disableSave={sessions.disableSave}
        noteSaved={sessions.noteSaved}
        saveLocked={sessions.saveLocked}
        statusOptions={constants.STATUS_OPTIONS}
        inputStyle={constants.HOME_INPUT_STYLE}
      />

      {resetDialog.showResetConfirm && (
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
              Changing status to {resetDialog.pendingStatus || "this option"}{" "}
              will delete your AM and PM session logs for today. Do you want to
              continue?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={resetDialog.handleCancelReset}
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
                onClick={resetDialog.handleConfirmReset}
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
        isLoading={loading.isLoading}
        todayHours={summary.todayHours}
        weekHours={summary.weekHours}
        monthHours={summary.monthHours}
        totalHours={summary.totalHours}
      />
    </PageShell>
  );
}
