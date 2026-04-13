import { SkeletonBlock } from "@/components/ui/Skeleton";

export default function TimeSessionsSkeleton({ mode }) {
  const showSessionSkeleton = mode !== "simple";
  const showSimpleSkeleton = mode !== "dual";

  return (
    <div className="space-y-4">
      {showSessionSkeleton ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[0, 1].map((index) => (
            <div
              key={`session-${index}`}
              className="rounded-2xl p-5"
              style={{
                border: "1px solid var(--border-soft)",
                background: "var(--surface-card)",
                boxShadow: "var(--shadow-soft)",
              }}
            >
              <div className="mb-4 flex items-center gap-2">
                <SkeletonBlock className="h-2.5 w-2.5 rounded-full" />
                <SkeletonBlock className="h-3 w-28" />
              </div>

              <div className="space-y-3">
                <div>
                  <SkeletonBlock className="mb-2 h-2.5 w-24" />
                  <SkeletonBlock className="h-10 w-full rounded-xl" />
                </div>
                <div>
                  <SkeletonBlock className="mb-2 h-2.5 w-26" />
                  <SkeletonBlock className="h-10 w-full rounded-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {showSimpleSkeleton ? (
        <div
          className="rounded-2xl p-5"
          style={{
            border: "1px solid var(--border-soft)",
            background: "var(--surface-card)",
            boxShadow: "var(--shadow-soft)",
          }}
        >
          <div className="mb-4 flex items-center gap-2">
            <SkeletonBlock className="h-2.5 w-2.5 rounded-full" />
            <SkeletonBlock className="h-3 w-28" />
          </div>

          <div className="space-y-3">
            <div>
              <SkeletonBlock className="mb-2 h-2.5 w-24" />
              <SkeletonBlock className="h-10 w-full rounded-xl" />
            </div>
            <div>
              <SkeletonBlock className="mb-2 h-2.5 w-26" />
              <SkeletonBlock className="h-10 w-full rounded-xl" />
            </div>
          </div>
        </div>
      ) : null}

      <div
        className="rounded-2xl p-5"
        style={{
          border: "1px solid var(--border-soft)",
          background: "var(--surface-card)",
          boxShadow: "var(--shadow-soft)",
        }}
      >
        <SkeletonBlock className="mb-3 h-3 w-18" />
        <SkeletonBlock className="mb-3 h-10 w-full rounded-xl" />
        <SkeletonBlock className="mb-3 h-3 w-28" />
        <SkeletonBlock className="h-20 w-full rounded-xl" />
      </div>
    </div>
  );
}
