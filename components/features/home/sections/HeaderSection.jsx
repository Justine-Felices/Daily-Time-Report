import { formatLongDate, formatTime } from "@/lib/dtr-formatters";
import { memo, useMemo } from "react";

const DATE_TEXT_STYLE = {
  color: "rgba(255, 255, 255, 0.45)",
  fontSize: "12px",
  fontWeight: 600,
  fontFamily: "var(--font-geist-sans), Inter, sans-serif",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
};

const TIME_TEXT_STYLE = {
  fontSize: "clamp(44px, 6.5vw, 72px)",
  fontWeight: 800,
  fontFamily: "var(--font-geist-sans), Inter, sans-serif",
  letterSpacing: "-0.04em",
  lineHeight: "1",
  backgroundImage: "linear-gradient(to right, #60a5fa, #d946ef)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

const STATUS_TEXT_STYLE = {
  color: "rgba(255, 255, 255, 0.45)",
  fontSize: "11px",
  fontWeight: 600,
  fontFamily: "var(--font-geist-sans), Inter, sans-serif",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
};

export default memo(function HeaderSection({
  now,
  isClockIn,
  statusLabel,
  userName,
  currentSessionTimeIn,
  currentSessionHours,
  isDayComplete,
  dashboardView,
  onToggleClock,
}) {
  const firstName = useMemo(() => {
    if (!userName) return "User";
    return userName.trim().split(/\s+/)[0];
  }, [userName]);

  const greeting = useMemo(() => {
    const hour = now.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  }, [now]);

  const isBreakTime = useMemo(() => {
    const hour = now.getHours();
    return hour === 11;
  }, [now]);

  const canToggleClock =
    dashboardView !== "manual" && !isDayComplete && onToggleClock;

  const StatusRow = () => (
    <button
      type="button"
      onClick={canToggleClock ? onToggleClock : undefined}
      disabled={!canToggleClock}
      className={`mt-3 flex items-center gap-2 ${canToggleClock ? "cursor-pointer transition-opacity hover:opacity-80" : "cursor-default"}`}
    >
      <span
        className={`inline-block h-1.5 w-1.5 rounded-full ${isClockIn ? "animate-dot-blink" : ""}`}
        style={{
          background: isClockIn ? "#3b82f6" : "rgba(255,255,255,0.25)",
          boxShadow: isClockIn ? "0 0 8px #3b82f6" : "none",
        }}
      />
      <span style={STATUS_TEXT_STYLE}>{statusLabel}</span>
    </button>
  );

  if (isBreakTime) {
    return (
      <div className="flex flex-col items-start pt-2 pb-2">
        <span style={DATE_TEXT_STYLE}>{formatLongDate(now).toUpperCase()}</span>
        <p
          className="mt-3 text-white/90"
          style={{
            fontFamily: "var(--font-dancing-script), cursive",
            fontSize: "clamp(36px, 5vw, 52px)",
            lineHeight: 1.1,
          }}
        >
          {firstName} is on break
        </p>
        <div className="mt-4" style={TIME_TEXT_STYLE}>
          {formatTime(now)}
        </div>
        {isClockIn && (
          <div className="mt-3 flex items-center gap-4 text-[12px] font-medium tracking-wide text-white/45">
            <span>
              <span className="text-blue-400">TIME IN:</span> {currentSessionTimeIn}
            </span>
            <span className="h-3 w-px bg-white/10" />
            <span>
              <span className="text-blue-400">WORKED:</span>{" "}
              {currentSessionHours.toFixed(1)} hrs
            </span>
          </div>
        )}
        <StatusRow />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start pt-2 pb-2">
      <span style={DATE_TEXT_STYLE}>{formatLongDate(now).toUpperCase()}</span>

      <p
        className="mt-3 text-white"
        style={{
          fontFamily: "var(--font-dancing-script), cursive",
          fontSize: "clamp(36px, 5vw, 52px)",
          lineHeight: 1.15,
        }}
      >
        {greeting}, {firstName}
      </p>

      <div className="mt-4" style={TIME_TEXT_STYLE}>
        {formatTime(now)}
      </div>

      {isClockIn && (
        <div className="mt-3 flex items-center gap-4 text-[12px] font-medium tracking-wide text-white/45">
          <span>
            <span className="text-blue-400">TIME IN:</span> {currentSessionTimeIn}
          </span>
          <span className="h-3 w-px bg-white/10" />
          <span>
            <span className="text-blue-400">WORKED:</span>{" "}
            {currentSessionHours.toFixed(1)} hrs
          </span>
        </div>
      )}

      <StatusRow />
    </div>
  );
});
