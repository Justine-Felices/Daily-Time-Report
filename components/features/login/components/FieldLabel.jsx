export default function FieldLabel({ label, noMargin }) {
  return (
    <div
      style={{
        color: "rgba(255, 255, 255, 0.7)",
        fontSize: "12px",
        fontWeight: 600,
        letterSpacing: "0.02em",
        fontFamily: "'Inter',sans-serif",
        marginBottom: noMargin ? 0 : "5px",
      }}
    >
      {label}
    </div>
  );
}
