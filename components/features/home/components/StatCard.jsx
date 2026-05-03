import { SkeletonBlock } from "@/components/ui/Skeleton";

export default function StatCard({
  label,
  value,
  sub,
  isLoading = false,
}) {
  return (
    <div
      className="relative flex flex-col items-center justify-center gap-y-1 bg-[#1C1C1E] rounded-2xl sm:rounded-3xl p-2 sm:p-4 text-center border-t border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
    >
      {/* Label */}
      <span className="text-[#58D4d4] font-bold tracking-tight uppercase text-[8px] sm:text-[12px]">
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




