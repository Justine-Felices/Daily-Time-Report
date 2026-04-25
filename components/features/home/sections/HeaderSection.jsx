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
  const firstName = useMemo(() => {
    if (!userName) return "User";
    return userName.trim().split(/\s+/)[0];
  }, [userName]);

  const isBreakTime = useMemo(() => {
    const hour = now.getHours();
    // Temporarily set to 18 (6 PM) for testing
    return hour === 18;
  }, [now]);

  const greeting = useMemo(() => {
    const hour = now.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  }, [now]);

  const VideoElement = ({ flip = false }) => (
    <div>
      <video
        src="/gojo.webm"
        autoPlay
        loop
        muted
        playsInline
        style={{ 
          height: '200px', 
          width: '200px', 
          objectFit: 'contain',
          transform: flip ? 'scaleX(-1)' : 'none'
        }}
      />
    </div>
  );

  // ─── BREAK TIME: Full-width cinematic layout ───
  if (isBreakTime) {
    return (
      <div 
        className="relative flex items-center justify-center pt-16 pb-8 px-6"
        style={{ 
          width: '100vw', 
          marginLeft: 'calc(-50vw + 50%)',
          overflow: 'hidden' 
        }}
      >
        {/* Left Video */}
        <div className="absolute left-[25%] hidden lg:flex items-center">
          <VideoElement />
        </div>

        {/* Center Content */}
        <div className="flex flex-col items-center justify-center text-center z-10">
          <div style={DATE_TEXT_STYLE}>{formatLongDate(now)}</div>

          <div className="mt-6 flex flex-col items-center">
            {/* Name — large cursive, light blue */}
            <span
              style={{
                fontFamily: "var(--font-dancing-script), 'Dancing Script', cursive",
                fontSize: "clamp(72px, 12vw, 140px)",
                lineHeight: 0.9,
                fontWeight: 400,
                color: "#5BB8F0",
                textShadow: "0 2px 20px rgba(91, 184, 240, 0.3)",
              }}
            >
              {firstName}
            </span>

            {/* "is" — small italic */}
            <span
              style={{
                fontFamily: "var(--font-dancing-script), 'Dancing Script', cursive",
                fontSize: "clamp(20px, 3vw, 32px)",
                color: "rgba(255, 255, 255, 0.7)",
                fontStyle: "italic",
                marginTop: "-4px",
                marginBottom: "4px",
              }}
            >
              is
            </span>

            {/* "ON BREAK" — massive, bold, brush feel */}
            <h2
              style={{
                fontFamily: "var(--font-dancing-script), 'Dancing Script', cursive",
                fontSize: "clamp(64px, 11vw, 130px)",
                fontWeight: 700,
                lineHeight: 0.95,
                color: "#FFFFFF",
                letterSpacing: "0.02em",
                textShadow: "0 4px 30px rgba(255, 255, 255, 0.15), 0 1px 3px rgba(0, 0, 0, 0.3)",
              }}
            >
              ON BREAK
            </h2>

            {/* Subtext */}
            <p
              style={{
                fontFamily: "var(--font-dancing-script), 'Dancing Script', cursive",
                fontSize: "clamp(16px, 2.5vw, 22px)",
                color: "rgba(91, 184, 240, 0.7)",
                fontStyle: "italic",
                marginTop: "20px",
                letterSpacing: "0.04em",
              }}
            >
              Will be back shortly!
            </p>
          </div>

          {/* Time — small, subtle */}
          <div
            style={{
              fontFamily: "var(--font-geist-sans), Inter, sans-serif",
              fontSize: "18px",
              fontWeight: 600,
              color: "rgba(255, 255, 255, 0.5)",
              marginTop: "20px",
              letterSpacing: "0.1em",
            }}
          >
            {formatTime(now)}
          </div>

          {/* Session info */}
          {isClockIn && (
            <div className="flex items-center gap-4 text-white/50 text-[13px] font-medium tracking-wide mt-4">
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

          <div className="flex items-center justify-center gap-2 mt-3">
            <div
              className="h-2 w-2 rounded-full"
              style={{
                background: isClockIn ? "#00F0FF" : "rgba(255,255,255,0.2)",
                boxShadow: isClockIn ? "0 0 10px #00F0FF" : "none",
              }}
            />
            <span style={STATUS_TEXT_STYLE}>{statusLabel}</span>
          </div>
        </div>

        {/* Right Video */}
        <div className="absolute right-[25%] hidden lg:flex items-center">
          <VideoElement flip />
        </div>
      </div>
    );
  }

  // ─── NORMAL STATE ───
  return (
    <div className="flex flex-col items-center justify-center gap-1 pt-12 pb-4 px-2 text-center">
      <div style={DATE_TEXT_STYLE}>{formatLongDate(now)}</div>
      
      <div className="mt-4 mb-2">
        <span 
          className="text-white/80 font-medium text-5xl sm:text-7xl tracking-tight"
          style={{ fontFamily: "var(--font-dancing-script), cursive" }}
        >
          {greeting},{" "}
          <span className="text-white font-bold bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] bg-clip-text text-transparent">
            {firstName}
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

