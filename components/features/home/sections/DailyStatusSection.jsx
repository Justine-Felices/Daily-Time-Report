import { CheckCircle2, ChevronDown, Save, Zap } from "lucide-react";
import GlassCard from "@/components/ui/cards/GlassCard";

const TITLE_STYLE = {
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

export default function DailyStatusSection({
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
  return (
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
        <span style={TITLE_STYLE}>DAILY STATUS / NOTES</span>
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
  );
}
