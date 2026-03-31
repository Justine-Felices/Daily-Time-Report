export default function FieldLabel({ label, noMargin }) {
  return (
    <div
      style={{
        color: "#334155",
        fontSize: "12px",
        fontWeight: 700,
        letterSpacing: "0.06em",
        fontFamily: "'Inter',sans-serif",
        marginBottom: noMargin ? 0 : "5px",
      }}
    >
      {label}
    </div>
  );
}
