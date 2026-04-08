import { PenLine } from "lucide-react";

const TITLE_STYLE = {
  color: "var(--text-primary)",
  fontFamily: "'Inter',sans-serif",
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
    <div>
      <div className="mb-1 flex items-center gap-2">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-xl"
          style={{
            background: "linear-gradient(135deg,#069494,#FF69B4)",
            boxShadow: "0 4px 12px rgba(6,148,148,0.35)",
          }}
        >
          <PenLine size={15} color="#fff" />
        </div>
        <h1 style={TITLE_STYLE}>{title}</h1>
      </div>

      <p style={SUBTITLE_STYLE}>{subtitle}</p>
    </div>
  );
}
