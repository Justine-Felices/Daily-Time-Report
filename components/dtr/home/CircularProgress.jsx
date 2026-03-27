export default function CircularProgress({ pct }) {
  const size = 168;
  const strokeWidth = 13;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <defs>
          <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#046060" />
            <stop offset="50%" stopColor="#069494" />
            <stop offset="100%" stopColor="#00F0FF" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(6,148,148,0.12)"
          strokeWidth={strokeWidth}
        />

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#progressGrad)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          filter="url(#glow)"
          style={{ transition: "stroke-dashoffset 0.9s ease" }}
        />
      </svg>

      <div
        className="absolute flex flex-col items-center justify-center rounded-full"
        style={{
          width: size - strokeWidth * 2 - 12,
          height: size - strokeWidth * 2 - 12,
          background: "rgba(224,249,249,0.5)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          border: "1px solid rgba(6,148,148,0.15)",
        }}
      >
        <span
          style={{
            color: "#069494",
            fontSize: "28px",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}
        >
          {pct}%
        </span>
        <span
          style={{
            color: "#94A3B8",
            fontSize: "10px",
            fontWeight: 600,
            letterSpacing: "0.06em",
            marginTop: "3px",
          }}
        >
          COMPLETE
        </span>
      </div>
    </div>
  );
}
