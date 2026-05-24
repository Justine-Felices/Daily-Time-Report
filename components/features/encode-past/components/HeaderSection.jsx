import { PenLine } from "lucide-react";

const TITLE_STYLE = {
  color: "var(--text-primary)",
  fontFamily: "'Inter',sans-serif",
  fontWeight: 800,
  fontSize: "24px",
  margin: 0,
};

const SUBTITLE_STYLE = {
  color: "var(--text-muted)",
  fontSize: "13px",
  fontFamily: "'Inter',sans-serif",
  margin: 0,
};

export default function HeaderSection({ title, subtitle }) {
  return (
    <div className="mb-6">
      <div className="mb-1 flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{
            background: "linear-gradient(135deg,#3b82f6,#2563eb)",
            boxShadow: "0 4px 12px rgba(59,130,246,0.35)",
          }}
        >
          <PenLine size={18} color="#fff" strokeWidth={2.5} />
        </div>
        <h1 style={TITLE_STYLE}>{title}</h1>
      </div>

      <p style={SUBTITLE_STYLE}>{subtitle}</p>
    </div>
  );
}
