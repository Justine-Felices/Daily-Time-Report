import { GLASS_INPUT_STYLE } from "@/lib/dtr-constants";

export default function ProfileInputField({
  label,
  icon: Icon,
  value,
  onChange,
  type,
}) {
  const isDateType = type === "date";

  return (
    <div>
      <label
        style={{
          color: "var(--text-muted)",
          fontSize: "10px",
          fontWeight: 800,
          letterSpacing: "0.1em",
          fontFamily: "'Inter', sans-serif",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          marginBottom: "6px",
        }}
      >
        <Icon size={11} className="text-blue-500" /> {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full min-w-0"
        style={{
          width: "100%",
          background: "var(--surface-muted)",
          border: "1px solid var(--border-soft)",
          borderRadius: "14px",
          color: "var(--text-primary)",
          fontSize: "14px",
          fontWeight: 500,
          padding: "12px 16px",
          outline: "none",
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          fontFamily: "'Inter', sans-serif",
        }}
        onFocus={(event) => {
          event.currentTarget.style.borderColor = "var(--accent-strong)";
          event.currentTarget.style.boxShadow =
            "0 0 0 4px rgba(59, 130, 246, 0.1)";
          event.currentTarget.style.background = "var(--surface-card)";
        }}
        onBlur={(event) => {
          event.currentTarget.style.borderColor = "var(--border-soft)";
          event.currentTarget.style.boxShadow = "none";
          event.currentTarget.style.background = "var(--surface-muted)";
        }}
      />
    </div>
  );
}
