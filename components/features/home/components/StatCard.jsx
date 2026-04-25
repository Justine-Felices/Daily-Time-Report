import { SkeletonBlock } from "@/components/ui/Skeleton";

export default function StatCard({
  label,
  value,
  sub,
  isLoading = false,
}) {
  return (
    <div
      className="relative flex flex-col items-center justify-center gap-y-1 bg-[#1C1C1E] rounded-3xl p-4 text-center border-t border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
    >
      {/* Label */}
      <span className="text-[#58D4d4] font-bold tracking-tight uppercase md:text-[12px] text-[10px]">
        {label}
      </span>

      {/* Main Stat */}
      <div className="flex items-center justify-center py-0.5 md:py-1">
        {isLoading ? (
          <SkeletonBlock className="md:h-10 h-8 md:w-24 w-16 rounded-lg bg-white/5" />
        ) : (
          <span 
            className="text-white md:text-3xl text-3xl font-semibold leading-none tracking-tight"
            style={{ fontFamily: "var(--font-geist-sans), Inter, sans-serif" }}
          >
            {value}
          </span>
        )}
      </div>

      {/* Subtext */}
      <div className="text-[#8E8E93] font-bold tracking-tight md:text-[10px] text-[8px] text-center uppercase">
        {sub}
      </div>
    </div>
  );
}




