export const GLASS = {
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(32px)",
  WebkitBackdropFilter: "blur(32px)",
  border: "1px solid rgba(255, 255, 255, 0.12)",
  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
  borderRadius: "32px",
};

export const GLASS_INPUT = {
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(4px)",
  WebkitBackdropFilter: "blur(4px)",
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "rgba(255, 255, 255, 0.1)",
  borderRadius: "14px",
  color: "#fff",
  fontFamily: "'Inter', sans-serif",
  fontSize: "14px",
  outline: "none",
  width: "100%",
  padding: "13px 14px 13px 44px",
  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
};

export const GLASS_INPUT_FOCUS = {
  borderColor: "rgba(59,130,246,0.6)",
  background: "rgba(255, 255, 255, 0.08)",
  boxShadow: "0 0 0 4px rgba(59,130,246,0.15)",
};

export const BTN_PRIMARY = {
  width: "100%",
  padding: "12px 20px",
  borderRadius: "12px",
  border: "none",
  background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
  color: "#fff",
  fontFamily: "'Inter', sans-serif",
  fontSize: "14px",
  fontWeight: 700,
  letterSpacing: "0.02em",
  cursor: "pointer",
  boxShadow: "0 4px 16px rgba(37,99,235,0.38)",
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
  border: "1.5px solid rgba(59,130,246,0.30)",
  background: "rgba(239,246,255,0.60)",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
  color: "#3b82f6",
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
