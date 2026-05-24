import { SkeletonBlock } from "@/components/ui/Skeleton";

export default function StatCard({
  label,
  value,
  sub,
  isLoading = false,
}) {
  return (
    <div
      className="relative flex flex-col items-center justify-center gap-y-1 rounded-2xl sm:rounded-3xl p-2 sm:p-4 text-center"
      style={{
        background: "rgba(255, 255, 255, 0.03)",
        backdropFilter: "blur(40px)",
        WebkitBackdropFilter: "blur(40px)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
      }}
    >
      {/* Label */}
      <span className="text-[#3b82f6] font-bold tracking-tight uppercase text-[8px] sm:text-[12px]">
        {label}
      </span>

      {/* Main Stat */}
      <div className="flex items-center justify-center py-0.5 sm:py-1">
        {isLoading ? (
          <SkeletonBlock className="h-6 w-12 sm:h-10 sm:w-24 rounded-lg bg-white/5" />
        ) : (
          <span 
            className="text-white text-lg sm:text-3xl font-semibold leading-none tracking-tight"
            style={{ fontFamily: "var(--font-geist-sans), Inter, sans-serif" }}
          >
            {value}
          </span>
        )}
      </div>

      {/* Subtext */}
      <div className="text-[#8E8E93] font-bold tracking-tight text-[7px] sm:text-[10px] text-center uppercase">
        {sub}
      </div>
    </div>
  );
}




