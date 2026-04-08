import { CalendarCheck, Target, Timer, TrendingUp } from "lucide-react";
import GlassCard from "@/components/ui/cards/GlassCard";
import CircularProgress from "@/components/features/home/components/CircularProgress";
import { SkeletonBlock } from "@/components/ui/Skeleton";

const TITLE_TEXT_STYLE = {
  color: "var(--text-primary)",
  fontSize: "13px",
  fontWeight: 700,
  letterSpacing: "0.05em",
  fontFamily: "'Inter',sans-serif",
};

const PILL_STYLE = {
  background: "rgba(6,148,148,0.1)",
  border: "1px solid var(--border-soft)",
  color: "var(--accent-strong)",
  fontSize: "12px",
  fontWeight: 600,
  fontFamily: "'Inter',sans-serif",
};

const CARD_TITLE_STYLE = {
  color: "var(--text-primary)",
  fontSize: "13px",
  fontWeight: 700,
  fontFamily: "'Inter',sans-serif",
};

const CARD_LABEL_STYLE = {
  color: "var(--text-muted)",
  fontSize: "9px",
  fontWeight: 700,
  letterSpacing: "0.08em",
  fontFamily: "'Inter',sans-serif",
  marginTop: "2px",
};

export default function ProgressSection({
  isLoading = false,
  pct,
  remaining,
  targetHours,
  estimatedFinishText,
}) {
  const statItems = [
    {
      icon: Timer,
      label: "REMAINING",
      value: `${remaining.toFixed(0)}h`,
      color: "var(--accent-strong)",
    },
    {
      icon: Target,
      label: "TARGET",
      value: `${targetHours}h`,
      color: "var(--accent-strong)",
    },
    {
      icon: CalendarCheck,
      label: "EST. FINISH",
      value: estimatedFinishText,
      color: "var(--accent-strong)",
    },
  ];

  return (
    <GlassCard padding="24px">
      <div className="mb-5 flex items-center gap-2">
        <div
          className="flex h-7 w-7 items-center justify-center rounded-lg"
          style={{
            background: "linear-gradient(135deg,#069494,#00F0FF)",
            boxShadow: "0 3px 10px rgba(6,148,148,0.4)",
          }}
        >
          <TrendingUp size={14} color="#fff" />
        </div>
        <span style={TITLE_TEXT_STYLE}>OJT PROGRESS</span>
        <div className="ml-auto rounded-full px-3 py-0.5" style={PILL_STYLE}>
          {pct}% Done
        </div>
      </div>

      <div className="mb-5 flex flex-col items-center">
        <CircularProgress pct={pct} isLoading={isLoading} />
      </div>

      <div
        className="mb-5 w-full rounded-full"
        style={{
          height: "8px",
          background: "color-mix(in srgb, var(--accent-strong) 20%, transparent)",
        }}
      >
        {isLoading ? (
          <SkeletonBlock className="h-full w-full rounded-full" />
        ) : (
          <div
            className="h-full rounded-full"
            style={{
              width: `${pct}%`,
              background: "linear-gradient(90deg, #046060, #069494, #00F0FF)",
              transition: "width 0.9s ease",
              boxShadow: "0 2px 10px rgba(0,240,255,0.4)",
            }}
          />
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {statItems.map(({ icon: Icon, label, value, color }) => (
          <div
            key={label}
            className="flex flex-col items-center rounded-xl p-3 text-center"
            style={{
              background: "var(--surface-muted)",
              border: "1px solid var(--border-soft)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          >
            <div
              className="mb-2 flex h-7 w-7 items-center justify-center rounded-lg"
              style={{ background: `${color}18` }}
            >
              <Icon size={13} color={color} />
            </div>
            {isLoading ? (
              <SkeletonBlock className="h-4 w-20 rounded-md" />
            ) : (
              <div style={CARD_TITLE_STYLE}>{value}</div>
            )}
            <div style={CARD_LABEL_STYLE}>{label}</div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
