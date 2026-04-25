import { SkeletonCircle } from "@/components/ui/Skeleton";

export default function CircularProgress({ pct, isLoading = false }) {
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
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="0.8" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

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
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          filter="url(#glow)"
          style={{ transition: "stroke-dashoffset 0.9s ease" }}
        />
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
              `${pct}%`
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


