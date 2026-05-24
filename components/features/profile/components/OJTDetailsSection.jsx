import { GraduationCap } from "lucide-react";

const WRAPPER_STYLE = {
  borderRadius: "24px",
  padding: "20px",
  background: "var(--surface-card)",
  backdropFilter: "blur(32px)",
  WebkitBackdropFilter: "blur(32px)",
  border: "1px solid var(--border-soft)",
  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
};

const TITLE_STYLE = {
  color: "var(--text-primary)",
  fontSize: "12px",
  fontWeight: 800,
  letterSpacing: "0.06em",
  fontFamily: "'Inter',sans-serif",
};

const LABEL_STYLE = {
  color: "var(--text-muted)",
  fontSize: "9px",
  fontWeight: 800,
  letterSpacing: "0.1em",
  fontFamily: "'Inter',sans-serif",
  marginBottom: "4px",
};

const VALUE_STYLE = {
  color: "var(--text-secondary)",
  fontSize: "13px",
  fontWeight: 600,
  fontFamily: "'Inter',sans-serif",
};

export default function OJTDetailsSection({ details }) {
  return (
    <div style={WRAPPER_STYLE}>
      <div className="mb-4 flex items-center gap-2">
        <GraduationCap size={14} className="text-blue-500" />
        <span style={TITLE_STYLE}>OJT PROGRAM DETAILS</span>
      </div>

      <div className="grid grid-cols-2 gap-y-5 gap-x-4">
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
