import { GraduationCap } from "lucide-react";

const WRAPPER_STYLE = {
  borderRadius: "20px",
  padding: "20px",
  background:
    "linear-gradient(135deg, rgba(6,148,148,0.1), rgba(0,240,255,0.08))",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1px solid rgba(6,148,148,0.2)",
  boxShadow: "0 4px 20px rgba(6,148,148,0.08)",
};

const TITLE_STYLE = {
  color: "#046060",
  fontSize: "12px",
  fontWeight: 700,
  letterSpacing: "0.06em",
  fontFamily: "'Inter',sans-serif",
};

const LABEL_STYLE = {
  color: "#FF69B4",
  fontSize: "9px",
  fontWeight: 700,
  letterSpacing: "0.1em",
  fontFamily: "'Inter',sans-serif",
  marginBottom: "2px",
};

const VALUE_STYLE = {
  color: "#046060",
  fontSize: "13px",
  fontWeight: 600,
  fontFamily: "'Inter',sans-serif",
};

export default function OJTDetailsSection({ details }) {
  return (
    <div style={WRAPPER_STYLE}>
      <div className="mb-3 flex items-center gap-2">
        <GraduationCap size={14} color="#069494" />
        <span style={TITLE_STYLE}>OJT DETAILS</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {details.map(({ label, value }) => (
          <div key={label}>
            <div style={LABEL_STYLE}>{label.toUpperCase()}</div>
            <div style={VALUE_STYLE}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
