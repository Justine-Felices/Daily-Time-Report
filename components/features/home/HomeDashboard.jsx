"use client";

import PageShell from "@/components/layout/PageShell";
import HeaderSection from "@/components/features/home/sections/HeaderSection";
import ProgressSection from "@/components/features/home/sections/ProgressSection";
import SummarySection from "@/components/features/home/sections/SummarySection";
import SessionsSection from "@/components/features/home/sections/SessionsSection";
import useHomeDashboardLogic from "@/components/features/home/hooks/useHomeDashboardLogic";
import { useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
export default function HomeDashboard() {
  const { loading, constants, header, progress, sessions, summary } =
    useHomeDashboardLogic();

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
        dashboardView={sessions.dashboardView}
      />

      {sessions.dashboardView === "manual" && !sessions.isDayComplete && (
        <SessionsSection
          amSession={sessions.amSession}
          pmSession={sessions.pmSession}
          otSession={sessions.otSession}
          persistedAmSession={sessions.persistedAmSession}
          persistedPmSession={sessions.persistedPmSession}
          persistedOtSession={sessions.persistedOtSession}
          status={sessions.status}
          attendanceMode={sessions.attendanceMode}
          isLoading={loading.isLoading}
          isSaving={sessions.isSaving}
          showSuccess={sessions.showSuccess}
          errorMessage={sessions.errorMessage}
          onManualSave={sessions.handleManualTimeChange}
          onStatusChange={sessions.handleStatusChange}
          onGlobalSave={sessions.handleGlobalSave}
          onToggleClock={sessions.onToggleClock}
          note={sessions.note}
          onNoteChange={sessions.setNote}
          sessions={sessions}
        />
      )}

      {/* Clock Out Confirmation Modal */}
      {sessions.showClockOutModal &&
        (() => {
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
          const isLateStart =
            sessions.attendanceMode === "dual" &&
            sessions.currentStatus === "clock-out-am" &&
            amInMinutes !== null &&
            amInMinutes >= 660; // 11:00 = 660 minutes

          return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xl">
              <div
                className="w-full max-w-md rounded-3xl p-8 shadow-2xl"
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  backdropFilter: "blur(40px)",
                  WebkitBackdropFilter: "blur(40px)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
                }}
              >
                <div className="flex flex-col items-center text-center mb-8">
                  <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4 border border-red-500/20">
                    <svg
                      className="w-8 h-8 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {sessions.currentStatus === "clock-out-am"
                      ? isLateStart
                        ? "Clock Out for the Day?"
                        : "Finish Morning Session?"
                      : "Clock Out for the Day?"}
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Review your session summary for today before saving.
                  </p>
                </div>

                <div
                  className="rounded-2xl p-6 mb-8 border border-white/5 space-y-4"
                  style={{ background: "rgba(0, 0, 0, 0.2)" }}
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 uppercase font-semibold">
                      Attendance Mode
                    </span>
                    <span className="text-[#3b82f6] font-bold uppercase tracking-widest">
                      {sessions.attendanceMode}
                    </span>
                  </div>
                  <div className="h-px bg-white/5" />
                  <div className="space-y-3">
                    {/* Dual mode + late start: show PM-only rows */}
                    {sessions.attendanceMode === "dual" && isLateStart && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">PM Time In</span>
                        <input
                          type="text"
                          value={sessions.modalPmIn}
                          onChange={(e) =>
                            sessions.setModalPmIn(e.target.value)
                          }
                          className="bg-white/5 text-white font-medium text-right outline-none focus:ring-1 focus:ring-[#00F0FF] rounded px-2 py-0.5 transition-all w-28"
                        />
                      </div>
                    )}

                    {/* Dual mode + normal start: show all 4 rows */}
                    {sessions.attendanceMode === "dual" && !isLateStart && (
                      <>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-400">AM Time In</span>
                          <input
                            type="text"
                            value={sessions.modalAmIn}
                            onChange={(e) =>
                              sessions.setModalAmIn(e.target.value)
                            }
                            className="bg-white/5 text-white font-medium text-right outline-none focus:ring-1 focus:ring-[#00F0FF] rounded px-2 py-0.5 transition-all w-28"
                          />
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-400">AM Time Out</span>
                          <input
                            type="text"
                            value={sessions.modalAmOut}
                            onChange={(e) =>
                              sessions.setModalAmOut(e.target.value)
                            }
                            className="bg-white/5 text-white font-medium text-right outline-none focus:ring-1 focus:ring-[#00F0FF] rounded px-2 py-0.5 transition-all w-28"
                          />
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-400">PM Time In</span>
                          <input
                            type="text"
                            value={sessions.modalPmIn}
                            onChange={(e) =>
                              sessions.setModalPmIn(e.target.value)
                            }
                            className="bg-white/5 text-white font-medium text-right outline-none focus:ring-1 focus:ring-[#00F0FF] rounded px-2 py-0.5 transition-all w-28"
                          />
                        </div>
                      </>
                    )}

                    {/* Single mode rows */}
                    {sessions.attendanceMode === "single" && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">Time In</span>
                        <input
                          type="text"
                          value={sessions.modalAmIn}
                          onChange={(e) =>
                            sessions.setModalAmIn(e.target.value)
                          }
                          className="bg-white/5 text-white font-medium text-right outline-none focus:ring-1 focus:ring-[#00F0FF] rounded px-2 py-0.5 transition-all w-28"
                        />
                      </div>
                    )}
                  </div>

                  {sessions.attendanceMode === "dual" &&
                    sessions.currentStatus === "clock-out-am" && (
                      <div
                        className={`${isLateStart ? "bg-amber-500/5 border-amber-500/10" : "bg-blue-500/5 border-blue-500/10"} border rounded-xl p-3 mt-4`}
                      >
                        <p
                          className={`text-[10px] ${isLateStart ? "text-amber-400" : "text-blue-400"} font-bold uppercase tracking-widest mb-1`}
                        >
                          {isLateStart
                            ? "Late Start — PM Only"
                            : "Dual Mode Automation"}
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
                    <span className="text-2xl font-black text-blue-400 tracking-tight">
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
                    {sessions.isSaving
                      ? "Saving Entry..."
                      : "Confirm Clock Out"}
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
