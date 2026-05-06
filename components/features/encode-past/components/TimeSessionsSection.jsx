import { useMemo, useState, useEffect } from "react";
import { Coffee, Sun, Clock, Save, ClipboardList } from "lucide-react";
import TimeSessionCard from "./TimeSessionCard";
import { STATUS_OPTIONS } from "@/lib/dtr-constants";
import { isResetStatus, isHalfDayStatus } from "@/lib/dtr-time-validation";

export default function TimeSessionsSection({
  mode = "session",
  amIn,
  amOut,
  pmIn,
  pmOut,
  simpleIn,
  simpleOut,
  onAmInChange,
  onAmOutChange,
  onPmInChange,
  onPmOutChange,
  onSimpleInChange,
  onSimpleOutChange,
  onValidationChange,
  onStatusChange,
  onSave,
  status = "Regular Duty Day",
  isLoading = false,
  isSaving = false,
  sessionsLocked = false,
}) {
  const [amError, setAmError] = useState(false);
  const [pmError, setPmError] = useState(false);
  const [simpleError, setSimpleError] = useState(false);

  const isSimpleMode = mode === "simple";
  const hasValidationError = isSimpleMode ? simpleError : (amError || pmError);

  // Notify parent of validation state
  useEffect(() => {
    onValidationChange?.(hasValidationError);
  }, [hasValidationError, onValidationChange]);

  const pmEarliestTime = amOut || amIn;
  const amDisabled = sessionsLocked;
  const pmDisabled = sessionsLocked || isHalfDayStatus(status);
  const simpleDisabled = sessionsLocked;

  const amSession = useMemo(() => ({ timeIn: amIn, timeOut: amOut }), [amIn, amOut]);
  const pmSession = useMemo(() => ({ timeIn: pmIn, timeOut: pmOut }), [pmIn, pmOut]);
  const simpleSession = useMemo(() => ({ timeIn: simpleIn, timeOut: simpleOut }), [simpleIn, simpleOut]);

  return (
    <div className="mt-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
        <div className="flex items-center gap-2">
          <ClipboardList size={18} className="text-slate-400" />
          <h3 className="text-sm font-bold tracking-widest text-slate-400 uppercase">
            Session Entries
          </h3>
          <span 
            className="rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest"
            style={{
              background: isSimpleMode ? "rgba(6,148,148,0.1)" : "rgba(6,182,212,0.1)",
              color: isSimpleMode ? "#069494" : "#06B6D4",
              border: `1px solid ${isSimpleMode ? "rgba(6,148,148,0.2)" : "rgba(6,182,212,0.2)"}`,
            }}
          >
            {isSimpleMode ? "Single" : "Dual"}
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <select
              value={status}
              onChange={(e) => onStatusChange?.(e.target.value)}
              disabled={isLoading || isSaving}
              className="appearance-none bg-slate-900 border border-white/10 rounded-xl px-4 py-2 pr-10 text-[12px] font-bold text-white focus:outline-none focus:border-cyan-500/50 transition-all cursor-pointer hover:bg-slate-800 disabled:opacity-50"
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
            onClick={onSave}
            disabled={isSaving || isLoading || hasValidationError}
            className="flex items-center gap-2 px-6 py-2 bg-[#069494] hover:bg-[#057a7a] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-[12px] font-bold text-white shadow-lg shadow-teal-500/20 transition-all active:scale-95"
          >
            <Save size={14} />
            {isSaving ? "SAVING..." : "SAVE ALL"}
          </button>
        </div>
      </div>
      
      {isSimpleMode ? (
        <div className="grid grid-cols-1 gap-4">
          <TimeSessionCard
            title="DAILY ENTRY"
            icon={Clock}
            iconColor="#069494"
            session={simpleSession}
            isLoading={isLoading}
            disabled={simpleDisabled}
            inLabel="TIME IN"
            outLabel="TIME OUT"
            inGrad="#069494"
            inShadow="rgba(6, 148, 148, 0.2)"
            onValidationChange={setSimpleError}
            onTimeInChange={onSimpleInChange}
            onTimeOutChange={onSimpleOutChange}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <TimeSessionCard
            title="MORNING SESSION"
            icon={Sun}
            iconColor="#06B6D4"
            session={amSession}
            isLoading={isLoading}
            disabled={amDisabled}
            inLabel="AM IN"
            outLabel="AM OUT"
            inGrad="#06B6D4"
            inShadow="rgba(6, 182, 212, 0.2)"
            onValidationChange={setAmError}
            onTimeInChange={onAmInChange}
            onTimeOutChange={onAmOutChange}
          />
          
          <TimeSessionCard
            title="AFTERNOON SESSION"
            icon={Coffee}
            iconColor="#069494"
            session={pmSession}
            isLoading={isLoading}
            disabled={pmDisabled}
            inLabel="PM IN"
            outLabel="PM OUT"
            inGrad="#069494"
            inShadow="rgba(6, 148, 148, 0.2)"
            onValidationChange={setPmError}
            earliestTime={pmEarliestTime}
            earliestLabel="Morning session"
            onTimeInChange={onPmInChange}
            onTimeOutChange={onPmOutChange}
          />
        </div>
      )}
    </div>
  );
}
