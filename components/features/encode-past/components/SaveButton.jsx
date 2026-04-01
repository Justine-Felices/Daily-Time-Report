import { CheckCircle2, Save, Loader } from "lucide-react";

export default function SaveButton({
  saved,
  onSave,
  disabled = false,
  isLoading = false,
}) {
  return (
    <button
      onClick={onSave}
      disabled={disabled}
      className="flex w-full items-center justify-center gap-2 rounded-xl py-3 transition-all duration-200"
      style={{
        background: disabled
          ? "rgba(148,163,184,0.22)"
          : saved
            ? "linear-gradient(135deg,#22C55E,#16A34A)"
            : "linear-gradient(135deg,#069494,#0aacac)",
        color: disabled ? "#94A3B8" : "#fff",
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: "'Inter',sans-serif",
        fontSize: "14px",
        fontWeight: 600,
        boxShadow: disabled
          ? "none"
          : saved
            ? "0 4px 14px rgba(34,197,94,0.4)"
            : "0 4px 16px rgba(6,148,148,0.38)",
        letterSpacing: "0.02em",
      }}
    >
      {isLoading ? (
        <>
          <Loader size={16} className="animate-spin" /> Saving...
        </>
      ) : saved ? (
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
