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
  backgroundImage: "linear-gradient(to right, #7C3AED, #2563EB, #06B6D4)",
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
    return hour === 12;
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

  // ─── Decorative accent line with dot ───
  const AccentLine = ({ flip = false }) => (
    <div className="flex items-center gap-0" style={{ direction: flip ? "rtl" : "ltr" }}>
      <div
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          background: "#38BDF8",
          boxShadow: "0 0 8px rgba(56, 189, 248, 0.6)",
          flexShrink: 0,
        }}
      />
      <div
        style={{
          width: "clamp(40px, 8vw, 100px)",
          height: "1px",
          background: "linear-gradient(to right, rgba(56, 189, 248, 0.6), transparent)",
          flexShrink: 0,
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
          width: "100vw",
          marginLeft: "calc(-50vw + 50%)",
          overflow: "hidden",
        }}
      >
        {/* Left Video */}
        <div className="absolute left-[20%] hidden lg:flex items-center">
          <VideoElement />
        </div>

        {/* Center Content */}
        <div className="flex flex-col items-center justify-center text-center z-10">

          {/* ── Date with decorative accents ── */}
          <div className="flex items-center gap-3">
            <AccentLine />
            <span
              style={{
                ...DATE_TEXT_STYLE,
                fontSize: "13px",
                color: "rgba(255, 255, 255, 0.55)",
                letterSpacing: "0.18em",
              }}
            >
              {formatLongDate(now)}
            </span>
            <AccentLine flip />
          </div>

          {/* ── "JUSTINE IS" with decorative accents ── */}
          <div className="flex items-center gap-3 mt-4">
            {/* <AccentLine /> */}
            <span
              style={{
                fontFamily: "var(--font-geist-sans), Inter, sans-serif",
                fontSize: "clamp(13px, 2vw, 16px)",
                fontWeight: 600,
                color: "rgba(255, 255, 255, 0.55)",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
              }}
            >
              {firstName} is
            </span>
            {/* <AccentLine flip /> */}
          </div>

          {/* ── "ON BREAK" — massive ultra-bold ── */}
          <h2
            className="mt-2"
            style={{
              fontFamily: "var(--font-geist-sans), Inter, sans-serif",
              fontSize: "clamp(64px, 14vw, 120px)",
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: "-0.03em",
              backgroundImage: "linear-gradient(135deg, #06B6D4 0%, #38BDF8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            ON BREAK
          </h2>

          {/* ── Time — small, subtle ── */}
          <div
            style={{
              fontFamily: "var(--font-geist-sans), Inter, sans-serif",
              fontSize: "18px",
              fontWeight: 600,
              color: "rgba(255, 255, 255, 0.45)",
              marginTop: "16px",
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
        <div className="absolute right-[20%] hidden lg:flex items-center">
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

