import { Printer } from "lucide-react";

const BUTTON_STYLE = {
  padding: "10px 18px",
  background: "rgba(255,255,255,0.75)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1.5px solid rgba(6,148,148,0.3)",
  color: "#069494",
  fontFamily: "'Inter',sans-serif",
  fontSize: "13px",
  fontWeight: 600,
  cursor: "pointer",
  boxShadow:
    "0 3px 14px rgba(6,148,148,0.15), inset 0 1px 0 rgba(255,255,255,0.9)",
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
        event.currentTarget.style.background = "rgba(255,255,255,0.75)";
        event.currentTarget.style.color = "#069494";
        event.currentTarget.style.boxShadow =
          "0 3px 14px rgba(6,148,148,0.15), inset 0 1px 0 rgba(255,255,255,0.9)";
      }}
    >
      <Printer size={14} />
      Print DTR (PDF)
    </button>
  );
}
