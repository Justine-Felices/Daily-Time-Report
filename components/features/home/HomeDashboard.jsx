"use client";

import PageShell from "@/components/layout/PageShell";
import HeaderSection from "@/components/features/home/sections/HeaderSection";
import ProgressSection from "@/components/features/home/sections/ProgressSection";
import SummarySection from "@/components/features/home/sections/SummarySection";
import SessionsSection from "@/components/features/home/sections/SessionsSection";
import useHomeDashboardLogic from "@/components/features/home/hooks/useHomeDashboardLogic";
import { useState } from "react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
export default function HomeDashboard() {
  const {
    loading,
    constants,
    header,
    progress,
    sessions,
    summary,
  } = useHomeDashboardLogic();

  const [isManualMode, setIsManualMode] = useState(false);

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
        hasAnyLog={sessions.hasAnyLog}
        estimatedFinishText={progress.estimatedFinishText}
        onToggleClock={sessions.onToggleClock}
      />

      {!sessions.hasAnyLog && (
        <>
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setIsManualMode(!isManualMode)}
              className="group flex items-center gap-2 px-6 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all active:scale-95"
            >
              <div className={`w-2 h-2 rounded-full ${isManualMode ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]' : 'bg-slate-600'}`} />
              <span className="text-[11px] font-bold tracking-widest uppercase text-slate-400 group-hover:text-white transition-colors">
                {isManualMode ? 'Disable Manual Input' : 'Enable Manual Input'}
              </span>
            </button>
          </div>

          {isManualMode && (
            <SessionsSection
              amSession={sessions.amSession}
              pmSession={sessions.pmSession}
              status={sessions.status}
              attendanceMode={sessions.attendanceMode}
              isLoading={loading.isLoading}
              isSaving={sessions.isSaving}
              onManualSave={sessions.handleManualTimeChange}
              onStatusChange={sessions.handleStatusChange}
              onGlobalSave={sessions.handleGlobalSave}
              onToggleClock={sessions.onToggleClock}
            />
          )}
        </>
      )}

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
      {sessions.showClockOutModal && (() => {
        // Detect late clock-in for dual mode (am_in >= 11:00)
        const amInTime = sessions.amSession?.timeIn;
        const amInMinutes = amInTime
          ? (() => {
              const t = amInTime.trim().toUpperCase();
              const m12 = t.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/);
              if (m12) {
                let h = Number(m12[1]);
                const mm = Number(m12[2]);
                if (m12[3] === "AM" && h === 12) h = 0;
                if (m12[3] === "PM" && h !== 12) h += 12;
                return h * 60 + mm;
              }
              const [h, m] = t.split(":").map(Number);
              return h * 60 + m;
            })()
          : null;
        const isLateStart = sessions.attendanceMode === "dual"
          && sessions.currentStatus === "clock-out-am"
          && amInMinutes !== null
          && amInMinutes >= 660; // 11:00 = 660 minutes

        return (
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
                  ? (isLateStart ? "Clock Out for the Day?" : "Finish Morning Session?")
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
                {/* Dual mode + late start: show PM-only rows */}
                {sessions.attendanceMode === "dual" && isLateStart && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">PM Time In</span>
                      <span className="text-white font-medium">
                        {sessions.amSession?.timeIn || "—"}
                      </span>
                    </div>
                  </>
                )}
                {/* Dual mode + normal start: show all 4 rows */}
                {sessions.attendanceMode === "dual" && !isLateStart && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">AM Time In</span>
                      <span className="text-white font-medium">
                        {sessions.amSession?.timeIn || "—"}
                      </span>
                    </div>
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
                {/* Single mode rows */}
                {sessions.attendanceMode === "single" && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">AM Time In</span>
                      <span className="text-white font-medium">
                        {sessions.amSession?.timeIn || "—"}
                      </span>
                    </div>
                    {sessions.currentStatus === "clock-out-pm" && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">AM Time Out</span>
                        <span className="text-white font-medium">
                          {sessions.amSession?.timeOut || "—"}
                        </span>
                      </div>
                    )}
                  </>
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
                  <div className={`${isLateStart ? "bg-amber-500/5 border-amber-500/10" : "bg-cyan-500/5 border-cyan-500/10"} border rounded-xl p-3 mt-4`}>
                    <p className={`text-[10px] ${isLateStart ? "text-amber-400" : "text-cyan-400"} font-bold uppercase tracking-widest mb-1`}>
                      {isLateStart ? "Late Start — PM Only" : "Dual Mode Automation"}
                    </p>
                    <p className="text-xs text-slate-300 italic">
                      {isLateStart
                        ? "You clocked in after 11:00 AM. AM fields will be cleared and your session will be recorded as PM only."
                        : "This will auto-fill AM Out (11:00), PM In (12:00), and PM Out (current time)."}
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
                className="w-full py-4 bg-[#FB7185] hover:bg-[#E11D48] disabled:opacity-50 text-white font-bold rounded-2xl transition-all shadow-lg shadow-rose-500/20 active:scale-[0.98]"
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
        );
      })()}





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
