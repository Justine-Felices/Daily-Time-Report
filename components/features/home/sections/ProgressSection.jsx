import { CalendarCheck, Target, Timer, TrendingUp } from "lucide-react";
import GlassCard from "@/components/ui/cards/GlassCard";
import CircularProgress from "@/components/features/home/components/CircularProgress";

const TITLE_TEXT_STYLE = {
  color: "#1E293B",
  fontSize: "13px",
  fontWeight: 700,
  letterSpacing: "0.05em",
  fontFamily: "'Inter',sans-serif",
};

const PILL_STYLE = {
  background: "rgba(6,148,148,0.1)",
  border: "1px solid rgba(6,148,148,0.2)",
  color: "#069494",
  fontSize: "12px",
  fontWeight: 600,
  fontFamily: "'Inter',sans-serif",
};

const CARD_TITLE_STYLE = {
  color: "#1E293B",
  fontSize: "13px",
  fontWeight: 700,
  fontFamily: "'Inter',sans-serif",
};

const CARD_LABEL_STYLE = {
  color: "#94A3B8",
  fontSize: "9px",
  fontWeight: 700,
  letterSpacing: "0.08em",
  fontFamily: "'Inter',sans-serif",
  marginTop: "2px",
};

export default function ProgressSection({
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
      color: "#FF69B4",
    },
    {
      icon: Target,
      label: "TARGET",
      value: `${targetHours}h`,
      color: "#069494",
    },
    {
      icon: CalendarCheck,
      label: "EST. FINISH",
      value: estimatedFinishText,
      color: "#00B4B4",
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
        <CircularProgress pct={pct} />
      </div>

      <div
        className="mb-5 w-full rounded-full"
        style={{ height: "8px", background: "rgba(6,148,148,0.1)" }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${pct}%`,
            background: "linear-gradient(90deg, #046060, #069494, #00F0FF)",
            transition: "width 0.9s ease",
            boxShadow: "0 2px 10px rgba(0,240,255,0.4)",
          }}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {statItems.map(({ icon: Icon, label, value, color }) => (
          <div
            key={label}
            className="flex flex-col items-center rounded-xl p-3 text-center"
            style={{
              background: "rgba(240,253,253,0.6)",
              border: "1px solid rgba(6,148,148,0.12)",
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
            <div style={CARD_TITLE_STYLE}>{value}</div>
            <div style={CARD_LABEL_STYLE}>{label}</div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
