import { Printer } from "lucide-react";

const BUTTON_STYLE = {
  padding: "10px 18px",
  background: "var(--surface-card)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1.5px solid var(--border-soft)",
  color: "var(--accent-strong)",
  fontFamily: "'Inter',sans-serif",
  fontSize: "13px",
  fontWeight: 600,
  cursor: "pointer",
  boxShadow: "var(--shadow-soft)",
  letterSpacing: "0.02em",
  whiteSpace: "nowrap",
};

export default function ActionsSection({ onPrint }) {
  return (
    <button
      onClick={onPrint}
      className="flex shrink-0 items-center gap-2 rounded-xl transition-all"
      style={BUTTON_STYLE}
      onMouseEnter={(event) => {
        event.currentTarget.style.background =
          "linear-gradient(135deg,#069494,#0aacac)";
        event.currentTarget.style.color = "#fff";
        event.currentTarget.style.boxShadow = "0 4px 16px rgba(6,148,148,0.38)";
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.background = "var(--surface-card)";
        event.currentTarget.style.color = "var(--accent-strong)";
        event.currentTarget.style.boxShadow = "var(--shadow-soft)";
      }}
    >
      <Printer size={14} />
      Print DTR (PDF)
    </button>
  );
}
