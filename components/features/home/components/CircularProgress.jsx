import { useEffect, useState } from "react";
import { SkeletonCircle } from "@/components/ui/Skeleton";

export default function CircularProgress({ pct, isLoading = false }) {
  const [displayPct, setDisplayPct] = useState(0);

  // Animate the percentage number
  useEffect(() => {
    if (isLoading) return;
    const duration = 1500;
    const start = displayPct;
    const end = pct;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (easeOutExpo)
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      const currentVal = Math.floor(start + (end - start) * ease);
      setDisplayPct(currentVal);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [pct, isLoading]);

  // SVG coordinate system constants (relative to viewBox 0 0 100 100)
  const strokeWidth = 8;
  const radius = 41; 
  const circumference = 2 * Math.PI * radius;
  
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-40 h-40 md:w-52 md:h-52 transition-all duration-500">
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full"
        style={{ transform: "rotate(-90deg)" }}
      >
        <defs>
          <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#088A8A" />
            <stop offset="100%" stopColor="#00F0FF" />
          </linearGradient>

          <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="white" stopOpacity="0.8" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
          
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feComposite in="SourceGraphic" in2="coloredBlur" operator="over" />
          </filter>

          <filter id="waveGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feFlood floodColor="#00F0FF" floodOpacity="1" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feComposite in="SourceGraphic" in2="glow" operator="over" />
          </filter>

          <mask id="progressMask">
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
            @keyframes wave-travel {
              from { stroke-dashoffset: 0; }
              to { stroke-dashoffset: -${circumference}; }
            }
            .wave-arc {
              stroke-dasharray: ${circumference};
              stroke-dashoffset: ${offset};
              transition: stroke-dashoffset 1s ease-in-out;
            }
            .wave-highlight {
              stroke-dasharray: 120 ${circumference - 120};
              animation: wave-travel 4s linear infinite;
              filter: drop-shadow(0 0 5px #00F0FF);
              opacity: 0.8;
            }
          `}
        </style>

        {/* Background Track (Thick) */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.04)"
          strokeWidth={strokeWidth}
        />

        {/* Progress Path (Main Thick Arc) */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="url(#progressGrad)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          filter="url(#glow)"
          className="wave-arc"
        />

        {/* Traveling Wave Highlight */}
        {!isLoading && pct > 0 && (
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#00F0FF"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            mask="url(#progressMask)"
            filter="url(#waveGlow)"
            className="wave-highlight"
            style={{ 
              mixBlendMode: "plus-lighter"
            }}
          />
        )}
      </svg>

      {/* Inner Content Card */}
      <div
        className="absolute flex flex-col items-center justify-center rounded-full w-[68%] h-[68%]"
        style={{
          background: "#111D29",
          border: "1px solid rgba(255, 255, 255, 0.05)",
        }}
      >
        <div className="flex flex-col items-center">
          <span
            className="text-white font-bold leading-none tracking-tight text-4xl md:text-5xl"
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
            className="text-white font-bold tracking-[0.25em] mt-3 text-[9px] md:text-[10px] uppercase opacity-80"
            style={{ fontFamily: "var(--font-geist-sans), Inter, sans-serif" }}
          >
            COMPLETE
          </span>
        </div>
      </div>
    </div>
  );
}


