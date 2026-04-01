import {
  CheckCircle2,
  ChevronDown,
  Clock,
  Save,
  Sun,
  Sunset,
  Zap,
} from "lucide-react";
import { memo } from "react";
import SessionCard from "@/components/features/home/components/SessionCard";
import GlassCard from "@/components/ui/cards/GlassCard";

const TITLE_STYLE = {
  color: "#1E293B",
  fontSize: "14px",
  fontWeight: 700,
  fontFamily: "'Inter',sans-serif",
};

const DATE_STYLE = {
  color: "#94A3B8",
  fontSize: "12px",
  fontFamily: "'Inter',sans-serif",
};

const STATUS_TITLE_STYLE = {
  color: "#1E293B",
  fontSize: "13px",
  fontWeight: 700,
  letterSpacing: "0.05em",
  fontFamily: "'Inter',sans-serif",
};

const BUTTON_BASE_STYLE = {
  color: "#fff",
  border: "none",
  cursor: "pointer",
  fontFamily: "'Inter',sans-serif",
  fontSize: "13px",
  fontWeight: 600,
  letterSpacing: "0.02em",
  borderRadius: "12px",
};

export default memo(function SessionAndStatusSection({
  now,
  amSession,
  pmSession,
  sessionsLocked,
  onAmTimeIn,
  onAmTimeOut,
  onPmTimeIn,
  onPmTimeOut,
  onAmTimeInChange,
  onAmTimeOutChange,
  onPmTimeInChange,
  onPmTimeOutChange,
  onAmValidationChange,
  onPmValidationChange,
  dailyStatus,
  dailyNote,
  onDailyStatusChange,
  onDailyNoteChange,
  onSave,
  disableSave = false,
  noteSaved,
  statusOptions,
  inputStyle,
}) {
  const pmEarliestTime = amSession.timeOut || amSession.timeIn || null;

  return (
    <div className="space-y-4">
      {/* Time Sessions Section */}
      <div>
        <div className="mb-3 flex items-center gap-2 px-1">
          <Clock size={15} color="#069494" />
          <span style={TITLE_STYLE}>Today</span>
          <span style={DATE_STYLE}>
            -{" "}
            {now.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SessionCard
            title="AM Session"
            icon={Sun}
            iconColor="#FF69B4"
            session={amSession}
            onValidationChange={onAmValidationChange}
            onTimeIn={onAmTimeIn}
            onTimeOut={onAmTimeOut}
            onTimeInChange={onAmTimeInChange}
            onTimeOutChange={onAmTimeOutChange}
            disabled={sessionsLocked}
            inLabel="AM IN"
            outLabel="AM OUT"
            inGrad="linear-gradient(135deg,#FF69B4,#ff8fca)"
            inShadow="rgba(255,105,180,0.4)"
          />

          <SessionCard
            title="PM Session"
            icon={Sunset}
            iconColor="#069494"
            session={pmSession}
            onValidationChange={onPmValidationChange}
            earliestTime={pmEarliestTime}
            earliestLabel="AM session"
            onTimeIn={onPmTimeIn}
            onTimeOut={onPmTimeOut}
            onTimeInChange={onPmTimeInChange}
            onTimeOutChange={onPmTimeOutChange}
            disabled={sessionsLocked}
            inLabel="PM IN"
            outLabel="PM OUT"
            inGrad="linear-gradient(135deg,#069494,#0aacac)"
            inShadow="rgba(6,148,148,0.38)"
          />
        </div>
      </div>

      {/* Daily Status Section */}
      <GlassCard padding="20px">
        <div className="mb-4 flex items-center gap-2">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-lg"
            style={{
              background: "linear-gradient(135deg,#FF69B4,#069494)",
              boxShadow: "0 3px 10px rgba(255,105,180,0.3)",
            }}
          >
            <Zap size={13} color="#fff" />
          </div>
          <span style={STATUS_TITLE_STYLE}>DAILY STATUS / NOTES</span>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <select
              value={dailyStatus}
              onChange={onDailyStatusChange}
              className="w-full appearance-none"
              style={{
                ...inputStyle,
                padding: "10px 40px 10px 14px",
                cursor: "pointer",
              }}
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <ChevronDown
              size={15}
              color="#069494"
              className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2"
            />
          </div>

          <textarea
            rows={2}
            value={dailyNote}
            onChange={onDailyNoteChange}
            placeholder="Add a note (e.g. field work, running errand, etc.)"
            className="w-full resize-none"
            style={{ ...inputStyle, padding: "10px 14px" }}
          />

          <button
            onClick={onSave}
            disabled={disableSave}
            className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 transition-all duration-200"
            style={{
              ...BUTTON_BASE_STYLE,
              background: disableSave
                ? "rgba(148,163,184,0.22)"
                : noteSaved
                  ? "linear-gradient(135deg,#22C55E,#16A34A)"
                  : "linear-gradient(135deg,#069494,#0aacac)",
              boxShadow: disableSave
                ? "none"
                : noteSaved
                  ? "0 4px 12px rgba(34,197,94,0.35)"
                  : "0 4px 14px rgba(6,148,148,0.32)",
              cursor: disableSave ? "not-allowed" : "pointer",
            }}
          >
            {noteSaved ? (
              <>
                <CheckCircle2 size={14} /> Saved!
              </>
            ) : (
              <>
                <Save size={14} /> Save Status / Note
              </>
            )}
          </button>
        </div>
      </GlassCard>
    </div>
  );
});
