"use client";

export default function OnboardingPageSkeleton() {
  return (
    <div className="mx-auto w-full max-w-4xl animate-pulse px-4 py-6 sm:py-10">
      <div
        className="w-full rounded-3xl p-6"
        style={{
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.72), rgba(240,253,253,0.58))",
          border: "1px solid rgba(255,255,255,0.45)",
          boxShadow:
            "0 12px 34px rgba(15,23,42,0.16), inset 0 1px 0 rgba(255,255,255,0.72)",
        }}
      >
        <div
          className="mb-6 rounded-2xl px-5 py-5 sm:px-8"
          style={{
            background:
              "linear-gradient(125deg, rgba(224,247,249,0.55), rgba(255,255,255,0.42))",
            border: "1px solid rgba(255,255,255,0.55)",
          }}
        >
          <div className="mb-3 flex flex-col items-center gap-2">
            <div className="h-3 w-28 rounded-full bg-teal-200/75" />
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-7 rounded-full bg-teal-200/80" />
              <div className="h-2 w-3.5 rounded-full bg-slate-200/80" />
            </div>
          </div>
          <div className="mx-auto mb-2 h-8 w-72 max-w-full rounded-xl bg-slate-300/55" />
          <div className="mx-auto h-4 w-80 max-w-full rounded-xl bg-slate-200/70" />
        </div>

        <div className="flex flex-col">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div className="h-5 w-44 rounded-full bg-slate-300/60" />
            <div className="h-5 w-20 rounded-full bg-teal-100/80" />
          </div>

          <div>
            <div className="grid grid-cols-1 gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index}>
                  <div className="mb-2 h-3 w-28 rounded-full bg-slate-300/60" />
                  <div className="h-11 rounded-xl bg-slate-200/70" />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-between gap-2">
            <div className="h-10 w-24 rounded-xl bg-slate-200/80" />
            <div className="h-10 w-36 rounded-xl bg-teal-200/80" />
          </div>
        </div>
      </div>
    </div>
  );
}