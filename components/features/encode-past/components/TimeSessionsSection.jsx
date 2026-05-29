import { useMemo, useState, useEffect } from "react";
import { Coffee, Sun, Clock, Save, ClipboardList, Calendar } from "lucide-react";
import TimeSessionCard from "./TimeSessionCard";
import { STATUS_OPTIONS } from "@/lib/dtr-constants";
import { formatReadableDate } from "@/lib/dtr-formatters";
import {
  isResetStatus,
  isHalfDayStatus,
  calculateTotalHours,
} from "@/lib/dtr-time-validation";

export default function TimeSessionsSection({
  mode = "session",
  amIn,
  amOut,
  pmIn,
  pmOut,
  otIn,
  otOut,
  simpleIn,
  simpleOut,
  onAmInChange,
  onAmOutChange,
  onPmInChange,
  onPmOutChange,
  onOtInChange,
  onOtOutChange,
  onSimpleInChange,
  onSimpleOutChange,
  onValidationChange,
  onStatusChange,
  onSave,
  status = "Regular Duty Day",
  date,
  onDateChange,
  maxDate,
  isLoading = false,
  isSaving = false,
  sessionsLocked = false,
}) {
  const [amError, setAmError] = useState(false);
  const [pmError, setPmError] = useState(false);
  const [otError, setOtError] = useState(false);
  const [simpleError, setSimpleError] = useState(false);
  const [showOt, setShowOt] = useState(Boolean(otIn || otOut));

  const isSimpleMode = mode === "simple";
  const hasValidationError = isSimpleMode
    ? simpleError
    : amError || pmError || (showOt && otError);

  // Notify parent of validation state
  useEffect(() => {
    onValidationChange?.({
      am: amError,
      pm: pmError,
      ot: showOt ? otError : false,
      simple: simpleError,
    });
  }, [amError, pmError, otError, simpleError, showOt, onValidationChange]);

  useEffect(() => {
    if (otIn || otOut) {
      setShowOt(true);
    }
  }, [otIn, otOut]);

  const pmEarliestTime = amOut || amIn;
  const amDisabled = sessionsLocked;
  const pmDisabled = sessionsLocked || isHalfDayStatus(status);
  const simpleDisabled = sessionsLocked;
  const otDisabled = sessionsLocked;
  const otEarliestTime = pmOut || pmIn || amOut || amIn;

  const amSession = useMemo(
    () => ({ timeIn: amIn, timeOut: amOut }),
    [amIn, amOut],
  );
  const pmSession = useMemo(
    () => ({ timeIn: pmIn, timeOut: pmOut }),
    [pmIn, pmOut],
  );
  const otSession = useMemo(
    () => ({ timeIn: otIn, timeOut: otOut }),
    [otIn, otOut],
  );
  const simpleSession = useMemo(
    () => ({ timeIn: simpleIn, timeOut: simpleOut }),
    [simpleIn, simpleOut],
  );

  const totalHours = useMemo(() => {
    const payload = isSimpleMode
      ? {
          amIn: simpleIn || "",
          amOut: "",
          pmIn: "",
          pmOut: simpleOut || "",
          otIn: "",
          otOut: "",
        }
      : {
          amIn: amIn || "",
          amOut: amOut || "",
          pmIn: pmIn || "",
          pmOut: pmOut || "",
          otIn: showOt ? otIn || "" : "",
          otOut: showOt ? otOut || "" : "",
        };
    return calculateTotalHours(payload);
  }, [
    isSimpleMode,
    simpleIn,
    simpleOut,
    amIn,
    amOut,
    pmIn,
    pmOut,
    otIn,
    otOut,
    showOt,
  ]);

  const handleToggleOt = () => {
    if (showOt) {
      onOtInChange?.("");
      onOtOutChange?.("");
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
        <div className="flex flex-wrap items-center gap-2">
          <ClipboardList size={18} className="text-slate-400" />
          <h3 className="text-sm font-bold tracking-widest text-slate-400 uppercase">
            Session Entries
          </h3>
          <span
            className="rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest"
            style={{
              background: isSimpleMode
                ? "rgba(59,130,246,0.1)"
                : "rgba(6,182,212,0.1)",
              color: isSimpleMode ? "#3b82f6" : "#06B6D4",
              border: `1px solid ${isSimpleMode ? "rgba(59,130,246,0.2)" : "rgba(6,182,212,0.2)"}`,
            }}
          >
            {isSimpleMode ? "Single" : "Dual"}
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3">
          {!isSimpleMode && (
            <button
              type="button"
              onClick={handleToggleOt}
              disabled={isLoading || isSaving}
              className="rounded-xl px-2.5 py-[9px] sm:px-4 sm:py-[11px] text-[10px] sm:text-[12px] font-bold uppercase tracking-widest transition-all whitespace-nowrap"
              style={{
                border: "1.5px solid rgba(59, 130, 246, 0.35)",
                background: showOt
                  ? "rgba(59, 130, 246, 0.18)"
                  : "rgba(15, 23, 42, 0.6)",
                color: showOt ? "#60a5fa" : "#3b82f6",
                opacity: isLoading || isSaving ? 0.6 : 1,
              }}
            >
              <span className="text-[14px] leading-none mr-0.5">{showOt ? "−" : "+"}</span> {showOt ? "Remove OT" : "OT"}
            </button>
          )}

          <div className="relative group flex-1 sm:flex-initial">
            <select
              value={status}
              onChange={(e) => onStatusChange?.(e.target.value)}
              disabled={isLoading || isSaving}
              className="w-full appearance-none bg-slate-900 border border-white/10 rounded-xl px-2.5 py-[9px] pr-7 sm:px-4 sm:py-[11px] sm:pr-10 text-[10px] sm:text-[12px] font-bold text-white focus:outline-none focus:border-cyan-500/50 transition-all cursor-pointer hover:bg-slate-800 disabled:opacity-50 truncate"
              style={{ border: "1.5px solid rgba(255,255,255,0.05)" }}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <div className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
              <svg
                className="w-2.5 h-2.5 sm:w-3 sm:h-3"
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

          <div className="relative group flex-1 sm:flex-initial">
            <input
              type="date"
              value={date}
              onChange={(e) => onDateChange?.(e.target.value)}
              max={maxDate}
              disabled={isLoading || isSaving}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div
              className="w-full flex items-center justify-between gap-2 bg-slate-900 border border-white/10 rounded-xl px-2.5 py-[9px] sm:px-4 sm:py-[11px] text-[10px] sm:text-[12px] font-bold text-white transition-all hover:bg-slate-800"
              style={{ border: "1.5px solid rgba(255,255,255,0.05)" }}
            >
              <span className="truncate">{formatReadableDate(date)}</span>
              <Calendar size={12} className="text-slate-500 opacity-50 flex-shrink-0" />
            </div>
          </div>
        </div>
      </div>

      {isSimpleMode ? (
        <div className="grid grid-cols-1 gap-4">
          <TimeSessionCard
            title="DAILY ENTRY"
            icon={Clock}
            iconColor="#3b82f6"
            session={simpleSession}
            isLoading={isLoading}
            disabled={simpleDisabled}
            inLabel="TIME IN"
            outLabel="TIME OUT"
            inGrad="#3b82f6"
            inShadow="rgba(59, 130, 246, 0.2)"
            onValidationChange={setSimpleError}
            onTimeInChange={onSimpleInChange}
            onTimeOutChange={onSimpleOutChange}
          />
        </div>
      ) : (
        <div className={sessionGridClass}>
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
            iconColor="#3b82f6"
            session={pmSession}
            isLoading={isLoading}
            disabled={pmDisabled}
            inLabel="PM IN"
            outLabel="PM OUT"
            inGrad="#3b82f6"
            inShadow="rgba(59, 130, 246, 0.2)"
            onValidationChange={setPmError}
            earliestTime={pmEarliestTime}
            earliestLabel="Morning session"
            onTimeInChange={onPmInChange}
            onTimeOutChange={onPmOutChange}
          />
          {showOt && (
            <TimeSessionCard
              title="OVERTIME SESSION"
              icon={Clock}
              iconColor="#F97316"
              session={otSession}
              isLoading={isLoading}
              disabled={otDisabled}
              inLabel="OT IN"
              outLabel="OT OUT"
              inGrad="#F97316"
              inShadow="rgba(249, 115, 22, 0.2)"
              onValidationChange={setOtError}
              earliestTime={otEarliestTime}
              earliestLabel="PM session"
              onTimeInChange={onOtInChange}
              onTimeOutChange={onOtOutChange}
            />
          )}
        </div>
      )}
    </div>
  );
}
