import { GLASS_INPUT_STYLE } from "@/lib/dtr-constants";

export default function ProfileInputField({
  label,
  icon: Icon,
  value,
  onChange,
  type,
}) {
  return (
    <div>
      <label
        style={{
          color: "#64748B",
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "0.1em",
          fontFamily: "'Inter',sans-serif",
          display: "flex",
          alignItems: "center",
          gap: "4px",
          marginBottom: "5px",
        }}
      >
        <Icon size={10} color="#069494" /> {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full"
        style={{
          ...GLASS_INPUT_STYLE,
          padding: "10px 14px",
          transition: "all 0.2s",
        }}
        onFocus={(event) => {
          event.currentTarget.style.borderColor = "rgba(6,148,148,0.5)";
          event.currentTarget.style.boxShadow = "0 0 0 3px rgba(6,148,148,0.1)";
        }}
        onBlur={(event) => {
          event.currentTarget.style.borderColor = "rgba(6,148,148,0.18)";
          event.currentTarget.style.boxShadow = "none";
        }}
      />
    </div>
  );
}
