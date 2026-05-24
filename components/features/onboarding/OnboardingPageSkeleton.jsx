"use client";

import { PAGE_BACKGROUND_STYLE } from "@/lib/dtr-constants";

export default function OnboardingPageSkeleton() {
  return (
    <div className="min-h-screen animate-pulse" style={PAGE_BACKGROUND_STYLE}>
      <div className="grid min-h-screen lg:grid-cols-[minmax(280px,38%)_1fr]">
        <aside
          className="hidden px-8 py-10 lg:block"
          style={{
            background:
              "linear-gradient(160deg, #1e40af 0%, #3b82f6 55%, #1e3a8a 100%)",
          }}
        >
          <div className="mb-10 h-12 w-36 rounded-xl bg-white/20" />
          <div className="mb-8 h-1.5 rounded-full bg-white/20" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full bg-white/20" />
                <div className="space-y-2">
                  <div className="h-3 w-32 rounded bg-white/20" />
                  <div className="h-2 w-24 rounded bg-white/15" />
                </div>
              </div>
            ))}
          </div>
        </aside>

        <div
          className="px-6 py-10 sm:px-10"
          style={{ background: "var(--surface-card)" }}
        >
          <div className="mx-auto max-w-lg space-y-6">
            <div className="h-5 w-20 rounded-full bg-slate-200/70 dark:bg-slate-700/50" />
            <div className="h-8 w-64 rounded-xl bg-slate-200/70 dark:bg-slate-700/50" />
            <div className="h-4 w-full max-w-sm rounded bg-slate-200/60 dark:bg-slate-700/40" />
            <div className="space-y-4 pt-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index}>
                  <div className="mb-2 h-3 w-28 rounded bg-slate-200/60 dark:bg-slate-700/40" />
                  <div className="h-11 rounded-xl bg-slate-200/70 dark:bg-slate-700/50" />
                </div>
              ))}
            </div>
            <div className="flex justify-between pt-4">
              <div className="h-10 w-24 rounded-xl bg-slate-200/70 dark:bg-slate-700/50" />
              <div className="h-10 w-32 rounded-xl bg-blue-200/70 dark:bg-blue-900/40" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
