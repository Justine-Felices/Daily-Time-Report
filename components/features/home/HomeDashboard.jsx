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
        userName={header.userName}
        currentSessionTimeIn={header.currentSessionTimeIn}
        currentSessionHours={header.currentSessionHours}
        isDayComplete={header.isDayComplete}
      />

      <ProgressSection
        isLoading={loading.isLoading}
        pct={progress.pct}
        remaining={progress.remaining}
        targetHours={constants.TARGET_HOURS}
        totalHours={summary.totalHours}
        buttonConfig={sessions.buttonConfig}
        isDayComplete={sessions.isDayComplete}
        estimatedFinishText={progress.estimatedFinishText}
        onToggleClock={sessions.onToggleClock}
      />

      {/* Error Toast */}
      {sessions.errorMessage && (
        <div
          className="fixed top-8 left-1/2 -translate-x-1/2 z-[200] w-[90%] max-w-sm animate-[slideDown_0.4s_cubic-bezier(0.16,1,0.3,1)]"
        >
          <div
            className="flex flex-col gap-1 rounded-3xl p-5 border shadow-2xl"
            style={{
              background: "rgba(20, 20, 30, 0.8)",
              borderColor: "rgba(239, 68, 68, 0.3)",
              backdropFilter: "blur(24px)",
              boxShadow: "0 12px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(239, 68, 68, 0.1)",
            }}
          >
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-red-500/20 flex items-center justify-center border border-red-500/30">
                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-white font-bold text-sm tracking-tight">Action Required</span>
              <button
                onClick={sessions.clearError}
                className="ml-auto flex-shrink-0 p-1 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-slate-300 text-[13px] leading-relaxed mt-2 pl-11">
              {sessions.errorMessage}
            </p>
          </div>
        </div>
      )}
      {/* Clock Out Confirmation Modal */}
      {sessions.showClockOutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-8 shadow-2xl">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4 border border-red-500/20">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {sessions.currentStatus === "clock-out-am"
                  ? "Finish Morning Session?"
                  : "Clock Out for the Day?"}
              </h3>
              <p className="text-slate-400 text-sm">
                Review your session summary for today before saving.
              </p>
            </div>

            <div className="bg-slate-800/50 rounded-2xl p-6 mb-8 border border-white/5 space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 uppercase font-semibold">
                  Attendance Mode
                </span>
                <span className="text-[#00F0FF] font-bold uppercase tracking-widest">
                  {sessions.attendanceMode}
                </span>
              </div>
              <div className="h-px bg-white/5" />
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">AM Time In</span>
                  <span className="text-white font-medium">
                    {sessions.amSession?.timeIn || "—"}
                  </span>
                </div>
                {sessions.attendanceMode === "dual" && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">AM Time Out</span>
                      <span className="text-white font-medium">
                        {sessions.currentStatus === "clock-out-am" ? "11:00" : (sessions.amSession?.timeOut || "—")}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">PM Time In</span>
                      <span className="text-white font-medium">
                        {sessions.currentStatus === "clock-out-am" ? "12:00" : (sessions.pmSession?.timeIn || "—")}
                      </span>
                    </div>
                  </>
                )}
                {sessions.attendanceMode === "single" && sessions.currentStatus === "clock-out-pm" && (
                   <div className="flex justify-between text-sm">
                    <span className="text-slate-400">AM Time Out</span>
                    <span className="text-white font-medium">
                      {sessions.amSession?.timeOut || "—"}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Current Time</span>
                  <span className="text-white font-medium">
                    {header.now.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>

              {sessions.attendanceMode === "dual" &&
                sessions.currentStatus === "clock-out-am" && (
                  <div className="bg-cyan-500/5 border border-cyan-500/10 rounded-xl p-3 mt-4">
                    <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest mb-1">
                      Dual Mode Automation
                    </p>
                    <p className="text-xs text-slate-300 italic">
                      This will auto-fill AM Out (11:00), PM In (12:00), and PM
                      Out (current time).
                    </p>
                  </div>
                )}

              <div className="h-px bg-white/5" />
              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-400 font-medium text-sm">
                  Total Logged Hours
                </span>
                <span className="text-2xl font-black text-teal-400 tracking-tight">
                  {sessions.modalHours.toFixed(1)}{" "}
                  <span className="text-xs uppercase ml-1">hrs</span>
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={sessions.handleConfirmClockOut}
                disabled={sessions.isSaving}
                className="w-full py-4 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-bold rounded-2xl transition-all shadow-lg shadow-red-500/20 active:scale-[0.98]"
              >
                {sessions.isSaving ? "Saving Entry..." : "Confirm Clock Out"}
              </button>
              <button
                onClick={() => sessions.setShowClockOutModal(false)}
                className="w-full py-4 bg-transparent hover:bg-white/5 text-slate-500 font-medium rounded-2xl transition-all active:scale-[0.98]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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
              background: "var(--surface-card)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              borderColor: "var(--border-soft)",
              boxShadow: "0 8px 30px rgba(15,23,42,0.28)",
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Confirm log reset"
          >
            <h3
              style={{
                color: "var(--text-primary)",
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
                color: "var(--text-secondary)",
                fontSize: "13px",
                lineHeight: 1.5,
                fontFamily: "'Inter',sans-serif",
                marginBottom: "16px",
              }}
            >
              Changing status to {resetDialog.pendingStatus || "this option"}{" "}
              will delete your Morning and Afternoon session logs for today. Do
              you want to continue?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={resetDialog.handleCancelReset}
                className="rounded-xl px-3.5 py-2"
                style={{
                  background: "rgba(148,163,184,0.16)",
                  border: "1px solid var(--border-soft)",
                  color: "var(--text-secondary)",
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
