import { Eye, EyeOff } from "lucide-react";

export default function EyeButton({ show, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 0,
        display: "flex",
        color: "rgba(6,148,148,0.6)",
      }}
    >
      {show ? <EyeOff size={16} /> : <Eye size={16} />}
    </button>
  );
}
