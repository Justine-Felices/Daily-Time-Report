import { useMemo, useState, useEffect } from "react";
import {
  Coffee,
  Sun,
  Clock,
  Save,
  ClipboardList,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import SessionCard from "../components/SessionCard";
import { STATUS_OPTIONS } from "@/lib/dtr-constants";
import { isResetStatus, isHalfDayStatus } from "@/lib/dtr-time-validation";

export default function SessionsSection({
  amSession,
  pmSession,
  otSession,
  persistedAmSession,
  persistedPmSession,
  persistedOtSession,
  status,
  attendanceMode = "dual",
  isLoading,
  isSaving,
  showSuccess,
  errorMessage,
  onManualSave,
  onStatusChange,
  onGlobalSave,
  onToggleClock,
  note,
  onNoteChange,
  sessions,
}) {
  const [amError, setAmError] = useState(false);
  const [pmError, setPmError] = useState(false);
  const [otError, setOtError] = useState(false);
  const [singleError, setSingleError] = useState(false);
  const [showOt, setShowOt] = useState(
    Boolean(otSession?.timeIn || otSession?.timeOut),
  );

  const isSingleMode = attendanceMode === "single";

  const hasValidationError = isSingleMode
    ? singleError
    : amError || pmError || (showOt && otError);
  const pmEarliestTime = amSession?.timeOut || amSession?.timeIn;
  const otEarliestTime =
    pmSession?.timeOut ||
    pmSession?.timeIn ||
    amSession?.timeOut ||
    amSession?.timeIn;

  const amDisabled = isResetStatus(status);
  const pmDisabled = isResetStatus(status) || isHalfDayStatus(status);
  const otDisabled = isResetStatus(status);
  const singleDisabled = isResetStatus(status);

  // For single mode: combine am.timeIn + pm.timeOut into one virtual session
  const singleSession = useMemo(
    () => ({
      timeIn: amSession?.timeIn || null,
      timeOut: pmSession?.timeOut || null,
    }),
    [amSession?.timeIn, pmSession?.timeOut],
  );

  const isSinglePersistedDone =
    persistedAmSession?.timeIn && persistedPmSession?.timeOut;
  const isAmPersistedDone =
    persistedAmSession?.timeIn && persistedAmSession?.timeOut;
  const isPmPersistedDone =
    persistedPmSession?.timeIn && persistedPmSession?.timeOut;
  const isOtPersistedDone =
    persistedOtSession?.timeIn && persistedOtSession?.timeOut;

  useEffect(() => {
    if (otSession?.timeIn || otSession?.timeOut) {
      setShowOt(true);
    }
  }, [otSession?.timeIn, otSession?.timeOut]);

  const handleToggleOt = () => {
    if (showOt) {
      onManualSave?.("ot", "timeIn", null);
      onManualSave?.("ot", "timeOut", null);
      setOtError(false);
    }
    setShowOt((current) => !current);
  };

  const sessionGridClass = showOt
    ? "grid grid-cols-1 gap-4 lg:grid-cols-3"
    : "grid grid-cols-1 gap-4 lg:grid-cols-2";

  return (
    <div className="mt-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
        <div className="flex items-center gap-2">
          <ClipboardList size={18} className="text-slate-400" />
          <h3 className="text-sm font-bold tracking-widest text-slate-400 uppercase">
            Daily Sessions
          </h3>
          {/* Mode indicator pill */}
          <span
            className="rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest"
            style={{
              background: "rgba(59, 130, 246, 0.1)",
              color: "#3b82f6",
              border: `1px solid rgba(59, 130, 246, 0.22)`,
            }}
          >
            {isSingleMode ? "Single" : "Dual"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
              className="appearance-none bg-slate-900 border border-white/10 rounded-xl px-4 py-2 pr-10 text-[12px] font-bold text-white focus:outline-none focus:border-blue-500/50 transition-all cursor-pointer hover:bg-slate-800"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {!isSingleMode && (
            <button
              type="button"
              onClick={handleToggleOt}
              disabled={isSaving || otDisabled}
              className="rounded-xl px-4 py-2 text-[12px] font-bold uppercase tracking-widest transition-all"
              style={{
                border: "1px solid rgba(249, 115, 22, 0.35)",
                background: showOt
                  ? "rgba(249, 115, 22, 0.18)"
                  : "rgba(15, 23, 42, 0.6)",
                color: showOt ? "#FB923C" : "#F97316",
                opacity: isSaving || otDisabled ? 0.6 : 1,
              }}
            >
              {showOt ? "Remove OT" : "Add OT"}
            </button>
          )}

          <div className="flex flex-col items-end gap-2">
            <button
              onClick={onGlobalSave}
              disabled={isSaving || hasValidationError}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-[12px] font-bold text-white shadow-lg shadow-blue-500/20 transition-all active:scale-95 border border-white/10"
            >
              <Save size={14} />
              {isSaving ? "SAVING..." : "SAVE ALL"}
            </button>

            {(showSuccess || errorMessage || sessions?.warningMessage) && (
              <div className="animate-in fade-in slide-in-from-top-1 duration-300 pr-1 flex flex-col items-end gap-1">
                {showSuccess && (
                  <div
                    className="flex items-center gap-1.5 rounded-lg"
                    style={{
                      color: "#10b981",
                      fontSize: "10px",
                      fontWeight: 800,
                      letterSpacing: "0.02em",
                      textTransform: "uppercase",
                    }}
                  >
                    <CheckCircle2 size={12} />
                    Changes Saved
                  </div>
                )}
                {errorMessage && (
                  <div
                    className="flex items-center gap-1.5 rounded-lg"
                    style={{
                      color: "#ef4444",
                      fontSize: "10px",
                      fontWeight: 800,
                      letterSpacing: "0.02em",
                      textTransform: "uppercase",
                    }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    {errorMessage}
                  </div>
                )}
                {sessions?.warningMessage && (
                  <div
                    className="flex items-center gap-1.5 rounded-lg"
                    style={{
                      color: "#f59e0b",
                      fontSize: "10px",
                      fontWeight: 800,
                      letterSpacing: "0.02em",
                      textAlign: "right",
                      maxWidth: "200px",
                    }}
                  >
                    <AlertCircle size={12} />
                    {sessions.warningMessage}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {isSingleMode ? (
        /* ─── Single Mode: One card with Time In (→ am_in) and Time Out (→ pm_out) ─── */
        <div className="grid grid-cols-1 gap-4">
          <SessionCard
            title="DAILY ENTRY"
            icon={Clock}
            iconColor="#3b82f6"
            draftStorageKey="single-session-draft"
            session={singleSession}
            isPersistedDone={isSinglePersistedDone}
            isLoading={isLoading}
            disabled={singleDisabled}
            inLabel="TIME IN"
            outLabel="TIME OUT"
            inGrad="#3b82f6"
            inShadow="rgba(59, 130, 246, 0.2)"
            onValidationChange={setSingleError}
            onTimeIn={() => onToggleClock()}
            onTimeOut={() => onToggleClock()}
            onTimeInChange={(val) => onManualSave("am", "timeIn", val)}
            onTimeOutChange={(val) => onManualSave("pm", "timeOut", val)}
            onGlobalSave={onGlobalSave}
            isSaving={isSaving}
          />
        </div>
      ) : (
        /* ─── Dual Mode: Two cards (Morning + Afternoon) ─── */
        <div className={sessionGridClass}>
          <SessionCard
            title="MORNING SESSION"
            icon={Sun}
            iconColor="#3b82f6"
            draftStorageKey="am-session-draft"
            session={amSession}
            isPersistedDone={isAmPersistedDone}
            isLoading={isLoading}
            disabled={amDisabled}
            inLabel="AM IN"
            outLabel="AM OUT"
            inGrad="#3b82f6"
            inShadow="rgba(59, 130, 246, 0.2)"
            onValidationChange={setAmError}
            onTimeIn={() => onToggleClock()}
            onTimeOut={() => onToggleClock()}
            onTimeInChange={(val) => onManualSave("am", "timeIn", val)}
            onTimeOutChange={(val) => onManualSave("am", "timeOut", val)}
            onGlobalSave={onGlobalSave}
            isSaving={isSaving}
          />

          <SessionCard
            title="AFTERNOON SESSION"
            icon={Coffee}
            iconColor="#3b82f6"
            draftStorageKey="pm-session-draft"
            session={pmSession}
            isPersistedDone={isPmPersistedDone}
            isLoading={isLoading}
            disabled={pmDisabled}
            inLabel="PM IN"
            outLabel="PM OUT"
            inGrad="#3b82f6"
            inShadow="rgba(59, 130, 246, 0.2)"
            onValidationChange={setPmError}
            earliestTime={pmEarliestTime}
            earliestLabel="Morning session"
            onTimeIn={() => onToggleClock()}
            onTimeOut={() => onToggleClock()}
            onTimeInChange={(val) => onManualSave("pm", "timeIn", val)}
            onTimeOutChange={(val) => onManualSave("pm", "timeOut", val)}
            onGlobalSave={onGlobalSave}
            isSaving={isSaving}
          />
          {showOt && (
            <SessionCard
              title="OVERTIME SESSION"
              icon={Clock}
              iconColor="#F97316"
              draftStorageKey="ot-session-draft"
              session={otSession}
              isPersistedDone={isOtPersistedDone}
              isLoading={isLoading}
              disabled={otDisabled}
              inLabel="OT IN"
              outLabel="OT OUT"
              inGrad="#F97316"
              inShadow="rgba(249, 115, 22, 0.2)"
              onValidationChange={setOtError}
              earliestTime={otEarliestTime}
              earliestLabel="PM session"
              onTimeInChange={(val) => onManualSave("ot", "timeIn", val)}
              onTimeOutChange={(val) => onManualSave("ot", "timeOut", val)}
              onGlobalSave={onGlobalSave}
              isSaving={isSaving}
            />
          )}
        </div>
      )}

      {/* Note / Remarks Field */}
      <div className="px-1">
        <div
          className="rounded-2xl p-5"
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            backdropFilter: "blur(40px)",
            WebkitBackdropFilter: "blur(40px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10">
              <Save size={14} className="text-blue-500" />
            </div>
            <span className="text-[13px] font-bold text-white uppercase tracking-wider">
              Notes & Remarks
            </span>
          </div>

          <textarea
            value={note}
            onChange={(e) => onNoteChange(e.target.value)}
            placeholder="Add any notes or remarks for today (optional)..."
            className="w-full bg-slate-900/40 border border-white/5 rounded-xl p-4 text-[14px] text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/30 transition-all min-h-[100px] resize-none"
          />
        </div>
      </div>
    </div>
  );
}
