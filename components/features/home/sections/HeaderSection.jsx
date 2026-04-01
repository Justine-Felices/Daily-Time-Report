import { formatLongDate, formatTime } from "@/lib/dtr-formatters";
import { memo } from "react";

const HEADER_WRAPPER_STYLE = {
  background: "linear-gradient(135deg, #046060 0%, #069494 50%, #FF69B4 100%)",
  boxShadow: "0 6px 28px rgba(6,148,148,0.28)",
  borderRadius: "20px",
};

const DATE_TEXT_STYLE = {
  color: "rgba(255,255,255,0.75)",
  fontSize: "12px",
  fontWeight: 500,
  fontFamily: "'Inter',sans-serif",
};

const TIME_TEXT_STYLE = {
  color: "#fff",
  fontSize: "28px",
  fontWeight: 800,
  fontFamily: "'Inter',sans-serif",
  letterSpacing: "-0.03em",
  lineHeight: 1.15,
};

const STATUS_CHIP_STYLE = {
  background: "rgba(255,255,255,0.18)",
  border: "1px solid rgba(255,255,255,0.35)",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
};

const STATUS_TEXT_STYLE = {
  color: "#fff",
  fontSize: "12px",
  fontWeight: 600,
  fontFamily: "'Inter',sans-serif",
  letterSpacing: "0.06em",
};

export default memo(function HeaderSection({ now, isClockIn, statusLabel }) {
  return (
    <div
      className="flex flex-col gap-3 rounded-2xl px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
      style={HEADER_WRAPPER_STYLE}
    >
      <div>
        <div style={DATE_TEXT_STYLE}>{formatLongDate(now)}</div>
        <div style={TIME_TEXT_STYLE}>{formatTime(now)}</div>
      </div>

      <div
        className="flex items-center gap-2 self-start rounded-full px-4 py-2 sm:self-auto"
        style={STATUS_CHIP_STYLE}
      >
        <div
          className="h-2 w-2 rounded-full"
          style={{
            background: isClockIn ? "#00F0FF" : "rgba(255,255,255,0.5)",
            boxShadow: isClockIn
              ? "0 0 8px #00F0FF, 0 0 18px rgba(0,240,255,0.5)"
              : "none",
          }}
        />
        <span style={STATUS_TEXT_STYLE}>{statusLabel}</span>
      </div>
    </div>
  );
});
