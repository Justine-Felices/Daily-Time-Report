import { SkeletonBlock } from "@/components/ui/Skeleton";

export default function StatCard({ label, value, sub, isLoading = false }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-3 text-center sm:rounded-[18px] sm:px-3 sm:py-4"
      style={{
        background: "rgba(255, 255, 255, 0.03)",
        border: "1px solid rgba(255, 255, 255, 0.06)",
      }}
    >
      <span className="text-[9px] font-bold uppercase tracking-wide text-[#3b82f6] sm:text-[10px]">
        {label}
      </span>

      <div className="flex items-center justify-center py-0.5">
        {isLoading ? (
          <SkeletonBlock className="h-7 w-14 rounded-md bg-white/5 sm:h-9 sm:w-16" />
        ) : (
          <span
            className="text-xl font-semibold leading-none tracking-tight text-white sm:text-[28px]"
            style={{ fontFamily: "var(--font-geist-sans), Inter, sans-serif" }}
          >
            {value}
          </span>
        )}
      </div>

      <span className="text-[8px] font-bold uppercase tracking-wide text-[#3b82f6]/80 sm:text-[9px]">
        {sub}
      </span>
    </div>
  );
}
