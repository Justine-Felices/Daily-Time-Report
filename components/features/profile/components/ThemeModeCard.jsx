"use client";

import { Monitor, MoonStar, Sun } from "lucide-react";
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

const OPTION_LABELS = {
  light: "Light",
  dark: "Dark",
  system: "System",
};

const OPTION_ICONS = {
  light: Sun,
  dark: MoonStar,
  system: Monitor,
};

export default function ThemeModeCard({ mode, resolvedMode, onModeChange }) {
  return (
    <GlassCard padding="20px">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <div style={TITLE_STYLE}>THEME</div>
          <div style={SUBTITLE_STYLE}>
            Selected: {OPTION_LABELS[mode]} | Active: {OPTION_LABELS[resolvedMode]}
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            if (mode === "light") onModeChange("dark");
            else if (mode === "dark") onModeChange("system");
            else onModeChange("light");
          }}
          className="rounded-xl px-3 py-2"
          style={{
            border: "1px solid var(--border-soft)",
            background: "var(--surface-muted)",
            color: "var(--text-secondary)",
            fontSize: "12px",
            fontWeight: 600,
            fontFamily: "'Inter',sans-serif",
          }}
          aria-label="Cycle theme mode"
        >
          Cycle
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {(["light", "dark", "system"]).map((option) => {
          const Icon = OPTION_ICONS[option];
          const isActive = mode === option;

          return (
            <button
              key={option}
              type="button"
              onClick={() => onModeChange(option)}
              aria-label={`Switch to ${OPTION_LABELS[option]} theme`}
              aria-pressed={isActive}
              className="rounded-xl px-3 py-2"
              style={{
                border: isActive
                  ? "1px solid rgba(6,148,148,0.35)"
                  : "1px solid var(--border-soft)",
                background: isActive
                  ? "linear-gradient(135deg, rgba(6,148,148,0.18), rgba(0,240,255,0.12))"
                  : "var(--surface-muted)",
                color: isActive ? "var(--accent-strong)" : "var(--text-secondary)",
                fontSize: "12px",
                fontWeight: 600,
                fontFamily: "'Inter',sans-serif",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
              }}
            >
              <Icon size={14} />
              {OPTION_LABELS[option]}
            </button>
          );
        })}
      </div>
    </GlassCard>
  );
}
