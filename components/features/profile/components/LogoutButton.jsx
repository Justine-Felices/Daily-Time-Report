import { LogOut } from "lucide-react";

const BUTTON_STYLE = {
  background: "rgba(255,105,180,0.08)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1.5px solid rgba(255,105,180,0.22)",
  color: "#CC2277",
  fontFamily: "'Inter',sans-serif",
  fontSize: "13px",
  fontWeight: 600,
  cursor: "pointer",
  borderRadius: "12px",
};

export default function LogoutButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 transition-all"
      style={BUTTON_STYLE}
      onMouseEnter={(event) => {
        event.currentTarget.style.background = "rgba(255,105,180,0.16)";
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.background = "rgba(255,105,180,0.08)";
      }}
    >
      <LogOut size={14} /> Sign Out
    </button>
  );
}
