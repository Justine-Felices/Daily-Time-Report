const ERROR_STYLE = {
  padding: "12px 16px",
  background: "rgba(255,105,180,0.1)",
  border: "1px solid rgba(255,105,180,0.25)",
  borderRadius: "12px",
  color: "#CC2277",
  fontSize: "13px",
  fontFamily: "'Inter',sans-serif",
};

export default function ErrorMessage({ error }) {
  if (!error) {
    return null;
  }

  return <div style={ERROR_STYLE}>{error}</div>;
}
