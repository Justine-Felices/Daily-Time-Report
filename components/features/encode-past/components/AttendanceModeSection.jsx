const BUTTON_STYLE = {
  border: "none",
  borderRadius: "999px",
  fontFamily: "'Inter',sans-serif",
  fontSize: "9px",
  fontWeight: 600,
  letterSpacing: "0.02em",
  padding: "4px 2px",
  transition: "all 0.2s ease",
};

export default function AttendanceModeSection({ mode, onModeChange }) {
  const isSessionMode = mode !== "simple";

  return (
    <div className="w-full" style={{ maxWidth: "142px" }}>
      <div
        className="inline-flex w-full gap-0.5 rounded-full p-0.5"
        style={{
          background: "var(--surface-card)",
          border: "1px solid var(--border-soft)",
        }}
      >
        <button
          type="button"
          onClick={() => onModeChange("session")}
          className="flex-1"
          style={{
            ...BUTTON_STYLE,
            background: isSessionMode ? "var(--accent-strong)" : "transparent",
            color: isSessionMode ? "#ffffff" : "var(--accent-strong)",
            boxShadow: isSessionMode ? "0 1px 6px rgba(15,23,42,0.16)" : "none",
          }}
        >
          Dual
        </button>

        <button
          type="button"
          onClick={() => onModeChange("simple")}
          className="flex-1"
          style={{
            ...BUTTON_STYLE,
            background: !isSessionMode ? "var(--accent-pink)" : "transparent",
            color: !isSessionMode ? "#ffffff" : "var(--accent-pink)",
            boxShadow: !isSessionMode
              ? "0 1px 6px rgba(15,23,42,0.16)"
              : "none",
          }}
        >
          Single
        </button>
      </div>
    </div>
  );
}
