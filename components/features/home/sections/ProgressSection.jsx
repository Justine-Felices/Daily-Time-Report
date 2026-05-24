import React from "react";
import { TrendingUp, Lightbulb } from "lucide-react";
import GlassCard from "@/components/ui/cards/GlassCard";
import CircularProgress from "@/components/features/home/components/CircularProgress";
import { SkeletonBlock } from "@/components/ui/Skeleton";

const TITLE_TEXT_STYLE = {
  color: "#FFFFFF",
  fontSize: "13px",
  fontWeight: 700,
  letterSpacing: "0.08em",
  fontFamily: "var(--font-geist-sans), Inter, sans-serif",
};

const STAT_VALUE_STYLE = {
  color: "white",
  fontSize: "20px",
  fontWeight: 600,
  fontFamily: "var(--font-geist-sans), Inter, sans-serif",
  lineHeight: "1",
  letterSpacing: "-0.025em",
  textAlign: "center",
};

const STAT_LABEL_STYLE = {
  color: "#3b82f6",
  fontSize: "10px",
  fontWeight: 700,
  letterSpacing: "0.04em",
  fontFamily: "var(--font-geist-sans), Inter, sans-serif",
  marginTop: "6px",
  textTransform: "uppercase",
  textAlign: "center",
};

export default function ProgressSection({
  isLoading = false,
  pct,
  remaining,
  targetHours,
  totalHours,
  estimatedFinishText,
}) {
  const hoursPerDayNeeded = remaining > 0 ? (remaining / 20).toFixed(1) : 0;

  const statItems = [
    { label: "REMAINING", value: `${remaining.toFixed(0)}h` },
    { label: "TARGET", value: `${targetHours}h` },
    { label: "EST. FINISH DATE", value: estimatedFinishText },
  ];

  return (
    <GlassCard padding="22px" className="overflow-hidden">
      <div className="mb-6 flex items-center gap-3">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{
            background: "#3b82f6",
            boxShadow: "0 0 8px rgba(59, 130, 246, 0.2)",
          }}
        >
          <TrendingUp size={17} color="white" strokeWidth={2.5} />
        </div>
        <span style={TITLE_TEXT_STYLE}>OJT PROGRESS</span>

        <div className="ml-auto">
          <div
            className="rounded-full border border-[#3b82f6]/30 px-3 py-1 text-[#3b82f6]"
            style={{
              fontSize: "11px",
              fontWeight: 500,
              fontFamily: "var(--font-geist-sans), Inter, sans-serif",
            }}
          >
            {totalHours?.toFixed(0) || 0} Hours Completed
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
        <div className="shrink-0">
          <CircularProgress pct={pct} isLoading={isLoading} />
        </div>

        <div className="flex w-full flex-row items-center justify-between gap-1">
          {statItems.map((item, index) => (
            <React.Fragment key={item.label}>
              <div className="flex flex-1 flex-col items-center text-center">
                {isLoading ? (
                  <SkeletonBlock className="mb-1 h-7 w-16 rounded-md" />
                ) : (
                  <div style={STAT_VALUE_STYLE}>{item.value}</div>
                )}
                <div style={STAT_LABEL_STYLE}>{item.label}</div>
              </div>
              {index < statItems.length - 1 && (
                <div className="h-10 w-px shrink-0 bg-white/10" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div
        className="mt-6 flex items-center gap-3 rounded-xl px-4 py-3"
        style={{
          background: "rgba(0, 0, 0, 0.25)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
        }}
      >
        <Lightbulb size={18} className="shrink-0 text-[#3b82f6]" />
        <p className="text-[13px] font-medium text-white/65">
          You need{" "}
          <span className="font-bold text-[#3b82f6]">{hoursPerDayNeeded} hrs/day</span>{" "}
          to finish on time.
        </p>
      </div>
    </GlassCard>
  );
}
