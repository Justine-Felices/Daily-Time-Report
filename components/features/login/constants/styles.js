export const GLASS = {
  background: "rgba(255,255,255,0.80)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(6,148,148,0.16)",
  boxShadow:
    "0 8px 40px rgba(6,148,148,0.10), 0 1px 0 rgba(255,255,255,0.95) inset",
  borderRadius: "24px",
};

export const GLASS_INPUT = {
  background: "rgba(240,253,253,0.70)",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
  borderWidth: "1.5px",
  borderStyle: "solid",
  borderColor: "rgba(6,148,148,0.18)",
  borderRadius: "12px",
  color: "#1E293B",
  fontFamily: "'Inter', sans-serif",
  fontSize: "14px",
  outline: "none",
  width: "100%",
  padding: "11px 14px 11px 40px",
  transition: "border-color 0.18s, box-shadow 0.18s",
};

export const GLASS_INPUT_FOCUS = {
  borderColor: "rgba(6,148,148,0.55)",
  boxShadow: "0 0 0 3px rgba(6,148,148,0.10)",
};

export const BTN_PRIMARY = {
  width: "100%",
  padding: "12px 20px",
  borderRadius: "12px",
  border: "none",
  background: "linear-gradient(135deg, #069494 0%, #0aacac 100%)",
  color: "#fff",
  fontFamily: "'Inter', sans-serif",
  fontSize: "14px",
  fontWeight: 700,
  letterSpacing: "0.02em",
  cursor: "pointer",
  boxShadow: "0 4px 16px rgba(6,148,148,0.38)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  transition: "transform 0.12s, box-shadow 0.12s",
};

export const BTN_SECONDARY = {
  width: "100%",
  padding: "11px 20px",
  borderRadius: "12px",
  border: "1.5px solid rgba(6,148,148,0.30)",
  background: "rgba(240,253,253,0.60)",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
  color: "#069494",
  fontFamily: "'Inter', sans-serif",
  fontSize: "14px",
  fontWeight: 600,
  letterSpacing: "0.01em",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  transition: "background 0.15s, border-color 0.15s",
};
