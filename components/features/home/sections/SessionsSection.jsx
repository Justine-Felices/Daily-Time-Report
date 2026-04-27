import { useMemo, useState } from "react";
import { Coffee, Sun, Clock, Save, ClipboardList } from "lucide-react";
import SessionCard from "../components/SessionCard";
import { STATUS_OPTIONS } from "@/lib/dtr-constants";
import { isResetStatus, isHalfDayStatus } from "@/lib/dtr-time-validation";

export default function SessionsSection({ 
  amSession, 
  pmSession, 
  status,
  attendanceMode = "dual",
  isLoading, 
  isSaving,
  onManualSave,
  onStatusChange,
  onGlobalSave,
  onToggleClock 
}) {
  const [amError, setAmError] = useState(false);
  const [pmError, setPmError] = useState(false);
  const [singleError, setSingleError] = useState(false);

  const isSingleMode = attendanceMode === "single";

  const hasValidationError = isSingleMode ? singleError : (amError || pmError);
  const pmEarliestTime = amSession?.timeOut || amSession?.timeIn;
  
  const amDisabled = isResetStatus(status);
  const pmDisabled = isResetStatus(status) || isHalfDayStatus(status);
  const singleDisabled = isResetStatus(status);

  // For single mode: combine am.timeIn + pm.timeOut into one virtual session
  const singleSession = useMemo(() => ({
    timeIn: amSession?.timeIn || null,
    timeOut: pmSession?.timeOut || null,
  }), [amSession?.timeIn, pmSession?.timeOut]);

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
              background: isSingleMode ? "rgba(34,197,94,0.1)" : "rgba(6,182,212,0.1)",
              color: isSingleMode ? "#22C55E" : "#06B6D4",
              border: `1px solid ${isSingleMode ? "rgba(34,197,94,0.2)" : "rgba(6,182,212,0.2)"}`,
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
              className="appearance-none bg-slate-900 border border-white/10 rounded-xl px-4 py-2 pr-10 text-[12px] font-bold text-white focus:outline-none focus:border-cyan-500/50 transition-all cursor-pointer hover:bg-slate-800"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <button
            onClick={onGlobalSave}
            disabled={isSaving || hasValidationError}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-[12px] font-bold text-white shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
          >
            <Save size={14} />
            {isSaving ? "SAVING..." : "SAVE ALL"}
          </button>
        </div>
      </div>
      
      {isSingleMode ? (
        /* ─── Single Mode: One card with Time In (→ am_in) and Time Out (→ pm_out) ─── */
        <div className="grid grid-cols-1 gap-4">
          <SessionCard
            title="DAILY ENTRY"
            icon={Clock}
            iconColor="#22C55E"
            draftStorageKey="single-session-draft"
            session={singleSession}
            isLoading={isLoading}
            disabled={singleDisabled}
            inLabel="TIME IN"
            outLabel="TIME OUT"
            inGrad="linear-gradient(135deg, #22C55E 0%, #16A34A 100%)"
            inShadow="rgba(34, 197, 94, 0.2)"
            onValidationChange={setSingleError}
            onTimeIn={() => onToggleClock()}
            onTimeOut={() => onToggleClock()}
            onTimeInChange={(val) => onManualSave("am", "timeIn", val)}
            onTimeOutChange={(val) => onManualSave("pm", "timeOut", val)}
          />
        </div>
      ) : (
        /* ─── Dual Mode: Two cards (Morning + Afternoon) ─── */
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <SessionCard
            title="MORNING SESSION"
            icon={Sun}
            iconColor="#F59E0B"
            draftStorageKey="am-session-draft"
            session={amSession}
            isLoading={isLoading}
            disabled={amDisabled}
            inLabel="AM IN"
            outLabel="AM OUT"
            inGrad="linear-gradient(135deg, #F59E0B 0%, #D97706 100%)"
            inShadow="rgba(245, 158, 11, 0.2)"
            onValidationChange={setAmError}
            onTimeIn={() => onToggleClock()}
            onTimeOut={() => onToggleClock()}
            onTimeInChange={(val) => onManualSave("am", "timeIn", val)}
            onTimeOutChange={(val) => onManualSave("am", "timeOut", val)}
          />
          
          <SessionCard
            title="AFTERNOON SESSION"
            icon={Coffee}
            iconColor="#06B6D4"
            draftStorageKey="pm-session-draft"
            session={pmSession}
            isLoading={isLoading}
            disabled={pmDisabled}
            inLabel="PM IN"
            outLabel="PM OUT"
            inGrad="linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)"
            inShadow="rgba(6, 182, 212, 0.2)"
            onValidationChange={setPmError}
            earliestTime={pmEarliestTime}
            earliestLabel="Morning session"
            onTimeIn={() => onToggleClock()}
            onTimeOut={() => onToggleClock()}
            onTimeInChange={(val) => onManualSave("pm", "timeIn", val)}
            onTimeOutChange={(val) => onManualSave("pm", "timeOut", val)}
          />
        </div>
      )}
    </div>
  );
}
