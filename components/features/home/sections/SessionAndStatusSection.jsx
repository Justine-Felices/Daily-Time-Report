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
import { isHalfDayStatus } from "@/lib/dtr-time-validation";

const TITLE_STYLE = {
  color: "var(--text-primary)",
  fontSize: "14px",
  fontWeight: 700,
  fontFamily: "'Inter',sans-serif",
};

const DATE_STYLE = {
  color: "var(--text-muted)",
  fontSize: "12px",
  fontFamily: "'Inter',sans-serif",
};

const STATUS_TITLE_STYLE = {
  color: "var(--text-primary)",
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
  isLoading = false,
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
  saveLocked = false,
  statusOptions,
  inputStyle,
}) {
  const pmEarliestTime = amSession.timeOut || amSession.timeIn || null;
  const amDisabled = sessionsLocked || saveLocked || isLoading;
  const pmDisabled =
    sessionsLocked || isHalfDayStatus(dailyStatus) || saveLocked || isLoading;
  const saveButtonDisabled = disableSave || saveLocked;

  if (saveLocked) {
    return (
      <GlassCard padding="20px">
        <div
          className="rounded-xl px-3 py-2"
          style={{
            background: "rgba(6,148,148,0.08)",
            border: "1px solid rgba(6,148,148,0.22)",
            color: "#0F766E",
            fontSize: "12px",
            fontWeight: 600,
            fontFamily: "'Inter',sans-serif",
          }}
        >
          You already saved today&apos;s session and status. This section will
          unlock tomorrow.
        </div>
      </GlassCard>
    );
  }

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
            isLoading={isLoading}
            draftStorageKey="dtr-home-session-draft-am"
            session={amSession}
            onValidationChange={onAmValidationChange}
            onTimeIn={onAmTimeIn}
            onTimeOut={onAmTimeOut}
            onTimeInChange={onAmTimeInChange}
            onTimeOutChange={onAmTimeOutChange}
            disabled={amDisabled}
            inLabel="AM IN"
            outLabel="AM OUT"
            inGrad="linear-gradient(135deg,#FF69B4,#ff8fca)"
            inShadow="rgba(255,105,180,0.4)"
          />

          <SessionCard
            title="PM Session"
            icon={Sunset}
            iconColor="#069494"
            isLoading={isLoading}
            draftStorageKey="dtr-home-session-draft-pm"
            session={pmSession}
            onValidationChange={onPmValidationChange}
            earliestTime={pmEarliestTime}
            earliestLabel="AM session"
            onTimeIn={onPmTimeIn}
            onTimeOut={onPmTimeOut}
            onTimeInChange={onPmTimeInChange}
            onTimeOutChange={onPmTimeOutChange}
            disabled={pmDisabled}
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
              disabled={saveLocked}
              className="w-full appearance-none"
              style={{
                ...inputStyle,
                padding: "10px 40px 10px 14px",
                cursor: saveLocked ? "not-allowed" : "pointer",
                opacity: saveLocked ? 0.65 : 1,
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
            disabled={saveLocked}
            placeholder="Add a note (e.g. field work, running errand, etc.)"
            className="w-full resize-none"
            style={{
              ...inputStyle,
              padding: "10px 14px",
              opacity: saveLocked ? 0.65 : 1,
              cursor: saveLocked ? "not-allowed" : "text",
            }}
          />

          <button
            onClick={onSave}
            disabled={saveButtonDisabled}
            className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 transition-all duration-200"
            style={{
              ...BUTTON_BASE_STYLE,
              background: saveButtonDisabled
                ? "rgba(148,163,184,0.22)"
                : noteSaved
                  ? "linear-gradient(135deg,#22C55E,#16A34A)"
                  : "linear-gradient(135deg,#069494,#0aacac)",
              boxShadow: saveButtonDisabled
                ? "none"
                : noteSaved
                  ? "0 4px 12px rgba(34,197,94,0.35)"
                  : "0 4px 14px rgba(6,148,148,0.32)",
              cursor: saveButtonDisabled ? "not-allowed" : "pointer",
            }}
          >
            {saveLocked ? (
              <>
                <CheckCircle2 size={14} /> Already Saved Today
              </>
            ) : noteSaved ? (
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
