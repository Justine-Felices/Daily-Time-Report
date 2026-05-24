import { useEffect, useId, useState } from "react";
import { SkeletonCircle } from "@/components/ui/Skeleton";

export default function CircularProgress({ pct, isLoading = false }) {
  const [displayPct, setDisplayPct] = useState(0);
  const uid = useId().replace(/:/g, "");

  useEffect(() => {
    if (isLoading) return;
    const duration = 1500;
    const start = displayPct;
    const end = pct;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplayPct(Math.floor(start + (end - start) * ease));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [pct, isLoading]);

  const strokeWidth = 8;
  const radius = 41;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  const gradId = `progressGrad-${uid}`;
  const shimmerGradId = `shimmerGrad-${uid}`;
  const maskId = `progressMask-${uid}`;
  const glowId = `ringGlow-${uid}`;

  return (
    <div className="relative flex h-36 w-36 items-center justify-center transition-all duration-500 sm:h-44 sm:w-44">
      <svg
        viewBox="0 0 100 100"
        className="h-full w-full"
        style={{ transform: "rotate(-90deg)" }}
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="55%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#e879f9" />
          </linearGradient>

          <linearGradient id={shimmerGradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="20%" stopColor="#7dd3fc" stopOpacity="0" />
            <stop offset="42%" stopColor="#a5b4fc" stopOpacity="0.35" />
            <stop offset="50%" stopColor="#f0abfc" stopOpacity="0.7" />
            <stop offset="58%" stopColor="#a5b4fc" stopOpacity="0.35" />
            <stop offset="80%" stopColor="#7dd3fc" stopOpacity="0" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>

          <filter id={glowId} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <mask id={maskId}>
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="white"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
            />
          </mask>
        </defs>

        <style>
          {`
            @keyframes ring-shimmer-${uid} {
              0% { stroke-dashoffset: 0; }
              100% { stroke-dashoffset: -${circumference}; }
            }
            .ring-track-${uid} {
              stroke-dasharray: ${circumference};
              stroke-dashoffset: ${offset};
              transition: stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .ring-shimmer-${uid} {
              stroke-dasharray: 72 ${circumference - 72};
              will-change: stroke-dashoffset;
              animation: ring-shimmer-${uid} 6s linear infinite;
            }
          `}
        </style>

        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.06)"
          strokeWidth={strokeWidth}
        />

        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          filter={`url(#${glowId})`}
          className={`ring-track-${uid}`}
        />

        {!isLoading && pct > 0 && (
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={`url(#${shimmerGradId})`}
            strokeWidth={strokeWidth + 1}
            strokeLinecap="round"
            mask={`url(#${maskId})`}
            className={`ring-shimmer-${uid}`}
            style={{
              filter: "drop-shadow(0 0 8px rgba(167, 139, 250, 0.35))",
            }}
          />
        )}
      </svg>

      <div
        className="absolute flex h-[68%] w-[68%] flex-col items-center justify-center rounded-full"
        style={{
          background: "#0d1219",
          border: "1px solid rgba(255, 255, 255, 0.05)",
        }}
      >
        <span
          className="text-4xl font-bold leading-none tracking-tight text-white md:text-5xl"
          style={{ fontFamily: "var(--font-geist-sans), Inter, sans-serif" }}
        >
          {isLoading ? (
            <SkeletonCircle
              size={48}
              className="mx-auto"
              style={{ background: "rgba(255, 255, 255, 0.1)" }}
            />
          ) : (
            `${displayPct}%`
          )}
        </span>
        <span
          className="mt-3 text-[9px] font-bold uppercase tracking-[0.25em] text-white/80 md:text-[10px]"
          style={{ fontFamily: "var(--font-geist-sans), Inter, sans-serif" }}
        >
          COMPLETE
        </span>
      </div>
    </div>
  );
}
