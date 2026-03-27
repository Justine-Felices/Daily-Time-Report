export default function ToggleSwitch({ checked, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="shrink-0 rounded-full transition-all duration-200"
      style={{
        width: "46px",
        height: "26px",
        padding: "3px",
        background: checked
          ? "linear-gradient(135deg,#FF69B4,#069494)"
          : "rgba(148,163,184,0.2)",
        border: checked
          ? "1px solid rgba(255,105,180,0.35)"
          : "1px solid rgba(148,163,184,0.3)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: checked ? "flex-end" : "flex-start",
        boxShadow: checked ? "0 2px 8px rgba(255,105,180,0.38)" : "none",
      }}
    >
      <div
        style={{
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          background: "#fff",
          boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
        }}
      />
    </button>
  );
}
