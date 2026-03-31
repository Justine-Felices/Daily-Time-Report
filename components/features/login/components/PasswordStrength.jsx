export default function PasswordStrength({ password }) {
  const score =
    (password.length >= 8 ? 1 : 0) +
    (/[A-Z]/.test(password) ? 1 : 0) +
    (/[0-9]/.test(password) ? 1 : 0) +
    (/[^A-Za-z0-9]/.test(password) ? 1 : 0);

  const labels = ["Weak", "Fair", "Good", "Strong"];
  const colors = ["#DC2626", "#D97706", "#069494", "#16A34A"];

  return (
    <div style={{ marginTop: "8px" }}>
      <div style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
        {[1, 2, 3, 4].map((value) => (
          <div
            key={value}
            style={{
              flex: 1,
              height: "4px",
              borderRadius: "2px",
              background:
                value <= score ? colors[score - 1] : "rgba(6,148,148,0.12)",
              transition: "background 0.25s",
            }}
          />
        ))}
      </div>
      <div
        style={{
          color: colors[score - 1] ?? "#94A3B8",
          fontSize: "10px",
          fontWeight: 600,
          fontFamily: "'Inter',sans-serif",
          letterSpacing: "0.04em",
        }}
      >
        {score > 0 ? `${labels[score - 1]} password` : ""}
      </div>
    </div>
  );
}
