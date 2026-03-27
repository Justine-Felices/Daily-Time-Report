import { CheckCircle2, Save } from "lucide-react";

export default function SaveButton({ saved, onSave }) {
  return (
    <button
      onClick={onSave}
      className="flex w-full items-center justify-center gap-2 rounded-xl py-3 transition-all duration-200"
      style={{
        background: saved
          ? "linear-gradient(135deg,#22C55E,#16A34A)"
          : "linear-gradient(135deg,#069494,#0aacac)",
        color: "#fff",
        border: "none",
        cursor: "pointer",
        fontFamily: "'Inter',sans-serif",
        fontSize: "14px",
        fontWeight: 600,
        boxShadow: saved
          ? "0 4px 14px rgba(34,197,94,0.4)"
          : "0 4px 16px rgba(6,148,148,0.38)",
        letterSpacing: "0.02em",
      }}
    >
      {saved ? (
        <>
          <CheckCircle2 size={16} /> Record Saved!
        </>
      ) : (
        <>
          <Save size={15} /> Save Attendance Record
        </>
      )}
    </button>
  );
}
