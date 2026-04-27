import React from "react";
import { CalendarCheck, Target, Timer, TrendingUp, Lightbulb } from "lucide-react";
import GlassCard from "@/components/ui/cards/GlassCard";
import CircularProgress from "@/components/features/home/components/CircularProgress";
import { SkeletonBlock } from "@/components/ui/Skeleton";

const TITLE_TEXT_STYLE = {
  color: "#FFFFFF",
  fontSize: "14px",
  fontWeight: 700,
  letterSpacing: "0.05em",
  fontFamily: "var(--font-geist-sans), Inter, sans-serif",
};

const PILL_STYLE = {
  background: "transparent",
  border: "1px solid rgba(6, 182, 212, 0.3)",
  color: "#06B6D4",
  fontSize: "12px",
  fontWeight: 500,
  fontFamily: "var(--font-geist-sans), Inter, sans-serif",
};

const STAT_VALUE_STYLE = {
  color: "white",
  fontSize: "21px",
  fontWeight: 600,
  fontFamily: "var(--font-geist-sans), Inter, sans-serif",
  lineHeight: "1",
  letterSpacing: "-0.025em",
  textAlign: "center",
};

const STAT_LABEL_STYLE = {
  color: "#06B6D4",
  fontSize: "11px",
  fontWeight: 700,
  letterSpacing: "-0.01em",
  fontFamily: "var(--font-geist-sans), Inter, sans-serif",
  marginTop: "2px",
  textTransform: "uppercase",
  textAlign: "center",
};

export default function ProgressSection({
  isLoading = false,
  pct,
  remaining,
  targetHours,
  totalHours,
  buttonConfig,
  isDayComplete,
  estimatedFinishText,
  onToggleClock,
}) {
  // Simple calculation for the tip - assuming 20 working days left as a placeholder or a rough estimate
  // In a real app, this would be calculated based on the actual working days between now and estimated finish
  const hoursPerDayNeeded = remaining > 0 ? (remaining / 20).toFixed(1) : 0;

  const statItems = [
    {
      label: "REMAINING",
      value: `${remaining.toFixed(0)}h`,
    },
    {
      label: "TARGET",
      value: `${targetHours}h`,
    },
    {
      label: "EST. FINISH DATE",
      value: estimatedFinishText,
    },
  ];

  return (
    <GlassCard padding="24px" className="overflow-hidden">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{
            background: "#06B6D4",
            boxShadow: "0 0 8px rgba(6, 182, 212, 0.15)",
          }}
        >
          <TrendingUp size={18} color="white" strokeWidth={2.5} />
        </div>
        <span style={TITLE_TEXT_STYLE}>OJT PROGRESS</span>
        <div className="ml-auto rounded-full px-4 py-1.5" style={PILL_STYLE}>
          {totalHours?.toFixed(0) || 0} Hours Completed
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
        {/* Left: Circular Progress */}
        <div className="flex-shrink-0 px-10 md:px-6">
          <CircularProgress pct={pct} isLoading={isLoading} />
        </div>

        {/* Right: Stats and Tip */}
        <div className="flex flex-col flex-grow w-full">
          {/* Stats Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-y-6 sm:gap-x-0 mb-10 w-full">
            {statItems.map((item, index) => (
              <React.Fragment key={item.label}>
                <div className="flex flex-col items-center text-center flex-1">
                  {isLoading ? (
                    <SkeletonBlock className="h-7 w-24 rounded-md mb-1" />
                  ) : (
                    <div style={STAT_VALUE_STYLE}>{item.value}</div>
                  )}
                  <div style={STAT_LABEL_STYLE}>{item.label}</div>
                </div>
                {index < statItems.length - 1 && (
                  <div className="hidden sm:block h-10 w-[1px] bg-white/10" />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Tip Section */}
          <div 
            className="flex items-center gap-3 rounded-2xl p-4 w-full mb-4"
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.05)",
            }}
          >
            <div className="text-[#06B6D4]">
              <Lightbulb size={20} />
            </div>
            <p className="text-[13px] text-white/70 font-medium">
              You need <span className="text-[#06B6D4] font-bold">{hoursPerDayNeeded} hrs/day</span> to finish on time.
            </p>
          </div>

          {/* Action Button */}
          <button
            onClick={onToggleClock}
            disabled={isDayComplete}
            className="w-full py-4 rounded-2xl font-bold text-sm uppercase tracking-wider transition-all duration-300 active:scale-95 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: buttonConfig.background,
              color: buttonConfig.color,
              boxShadow: isDayComplete
                ? "none"
                : `0 8px 25px ${buttonConfig.shadow}`,
              fontFamily: "var(--font-geist-sans), Inter, sans-serif",
              border: isDayComplete ? "1px solid rgba(255,255,255,0.1)" : "none",
            }}
          >
            {buttonConfig.label}
          </button>
        </div>
      </div>
    </GlassCard>
  );
}
