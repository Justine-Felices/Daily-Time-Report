"use client";

import { CheckCircle2 } from "lucide-react";
import GlassCard from "@/components/ui/cards/GlassCard";

const TITLE_STYLE = {
  color: "var(--text-primary)",
  fontSize: "12px",
  fontWeight: 700,
  letterSpacing: "0.06em",
  fontFamily: "'Inter',sans-serif",
};

const SUBTITLE_STYLE = {
  color: "var(--text-muted)",
  fontSize: "12px",
  fontWeight: 500,
  fontFamily: "'Inter',sans-serif",
};

const MODE_OPTIONS = [
  { value: "single", label: "Single Entry", help: "simple time in / time out" },
  { value: "dual", label: "Dual Entry", help: "AM/PM sessions" },
];

export default function AttendanceFormatCard({
  mode = "dual",
  isSaving = false,
  saved = false,
  onModeChange,
}) {
  return (
    <GlassCard padding="20px">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div style={TITLE_STYLE}>ATTENDANCE FORMAT</div>
          <div style={SUBTITLE_STYLE}>
            Controls default mode for future entries only.
          </div>
        </div>

        {saved ? (
          <span
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1"
            style={{
              border: "1px solid rgba(34,197,94,0.26)",
              background: "rgba(34,197,94,0.12)",
              color: "#16A34A",
              fontSize: "11px",
              fontWeight: 700,
              fontFamily: "'Inter',sans-serif",
            }}
          >
            <CheckCircle2 size={12} /> Saved
          </span>
        ) : null}
      </div>

      <div
        className="grid grid-cols-2 gap-2 rounded-xl p-1"
        style={{
          border: "1px solid var(--border-soft)",
          background: "var(--surface-muted)",
        }}
      >
        {MODE_OPTIONS.map((option) => {
          const isActive = mode === option.value;

          return (
            <button
              key={option.value}
              type="button"
              disabled={isSaving}
              onClick={() => onModeChange?.(option.value)}
              aria-pressed={isActive}
              aria-label={`Set attendance format to ${option.label}`}
              className="rounded-lg px-3 py-2 text-left transition-all"
              style={{
                border: isActive
                  ? "1px solid rgba(6,148,148,0.36)"
                  : "1px solid transparent",
                background: isActive
                  ? "linear-gradient(135deg, rgba(6,148,148,0.15), rgba(0,240,255,0.1))"
                  : "transparent",
                color: isActive ? "var(--accent-strong)" : "var(--text-secondary)",
                cursor: isSaving ? "not-allowed" : "pointer",
                opacity: isSaving ? 0.7 : 1,
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  fontFamily: "'Inter',sans-serif",
                }}
              >
                {option.label}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 500,
                  fontFamily: "'Inter',sans-serif",
                  color: "var(--text-muted)",
                }}
              >
                {option.help}
              </div>
            </button>
          );
        })}
      </div>
    </GlassCard>
  );
}
