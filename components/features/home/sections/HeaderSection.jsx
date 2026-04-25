import { formatLongDate, formatTime } from "@/lib/dtr-formatters";
import { memo, useMemo } from "react";

const DATE_TEXT_STYLE = {
  color: "rgba(255, 255, 255, 0.5)",
  fontSize: "14px",
  fontWeight: 600,
  fontFamily: "var(--font-geist-sans), Inter, sans-serif",
  letterSpacing: "0.05em",
  textTransform: "uppercase",
};

const TIME_TEXT_STYLE = {
  fontSize: "48px",
  fontWeight: 800,
  fontFamily: "var(--font-geist-sans), Inter, sans-serif",
  letterSpacing: "-0.04em",
  lineHeight: "1",
  background: "linear-gradient(to right, #7C3AED, #2563EB, #06B6D4)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  marginBottom: "4px",
};

const STATUS_TEXT_STYLE = {
  color: "rgba(255, 255, 255, 0.6)",
  fontSize: "13px",
  fontWeight: 500,
  fontFamily: "var(--font-geist-sans), Inter, sans-serif",
};

export default memo(function HeaderSection({ 
  now, 
  isClockIn, 
  statusLabel, 
  userName,
  currentSessionTimeIn,
  currentSessionHours
}) {
  const greeting = useMemo(() => {
    const hour = now.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  }, [now]);

  return (
    <div className="flex flex-col items-center justify-center gap-1 py-12 px-2 text-center">
      <div style={DATE_TEXT_STYLE}>{formatLongDate(now)}</div>
      
      <div className="mt-4 mb-2">
        <span 
          className="text-white/80 font-medium text-5xl tracking-tight"
          style={{ fontFamily: "var(--font-dancing-script), cursive" }}
        >
          {greeting},{" "}
          <span className="text-white font-bold bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] bg-clip-text text-transparent">
            {userName || "User"}
          </span>
        </span>
      </div>

      <div style={TIME_TEXT_STYLE}>{formatTime(now)}</div>

      <div className="flex flex-col items-center gap-3 mt-2">
        {isClockIn && (
          <div className="flex items-center gap-4 text-white/50 text-[13px] font-medium tracking-wide">
            <div className="flex items-center gap-1.5">
              <span className="text-[#00F0FF] opacity-80">TIME IN:</span>
              <span className="text-white/80">{currentSessionTimeIn}</span>
            </div>
            <div className="h-3 w-[1px] bg-white/10" />
            <div className="flex items-center gap-1.5">
              <span className="text-[#00F0FF] opacity-80">WORKED:</span>
              <span className="text-white/80">{currentSessionHours.toFixed(1)} hrs</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-center gap-2">
          <div
            className="h-2 w-2 rounded-full"
            style={{
              background: isClockIn ? "#00F0FF" : "rgba(255,255,255,0.2)",
              boxShadow: isClockIn
                ? "0 0 10px #00F0FF"
                : "none",
            }}
          />
          <span style={STATUS_TEXT_STYLE}>{statusLabel}</span>
        </div>
      </div>
    </div>
  );
});
