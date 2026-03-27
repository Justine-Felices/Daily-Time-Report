import { CheckCircle2, Save } from "lucide-react";

export default function SaveButton({ saved, onSave }) {
  return (
    <button
      onClick={onSave}
      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 transition-all duration-200"
      style={{
        background: saved
          ? "linear-gradient(135deg,#22C55E,#16A34A)"
          : "linear-gradient(135deg,#069494,#0aacac)",
        color: "#fff",
        border: "none",
        cursor: "pointer",
        fontFamily: "'Inter',sans-serif",
        fontSize: "13px",
        fontWeight: 600,
        boxShadow: saved
          ? "0 4px 12px rgba(34,197,94,0.35)"
          : "0 4px 14px rgba(6,148,148,0.35)",
      }}
    >
      {saved ? (
        <>
          <CheckCircle2 size={14} /> Changes Saved!
        </>
      ) : (
        <>
          <Save size={14} /> Save Changes
        </>
      )}
    </button>
  );
}
