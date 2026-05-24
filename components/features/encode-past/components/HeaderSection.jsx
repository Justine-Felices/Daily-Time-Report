import { PenLine, Calendar, Zap } from "lucide-react";

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

export default function HeaderSection({ title, subtitle, onBulkAdd }) {
  return (
    <div className="mb-6 pt-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col">
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

        <button
          onClick={onBulkAdd}
          className="flex h-11 items-center gap-2 px-4 rounded-xl transition-all active:scale-95 group"
          style={{
            background: "rgba(59, 130, 246, 0.1)",
            border: "1px solid rgba(59, 130, 246, 0.2)",
          }}
        >
          <Calendar size={18} className="text-blue-500 transition-transform group-hover:scale-110" />
          <span className="text-[13px] font-bold text-white uppercase tracking-tight">
            Bulk Add
          </span>
        </button>
      </div>
    </div>
  );
}
