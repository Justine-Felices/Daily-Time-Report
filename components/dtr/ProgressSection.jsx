export default function ProgressSection({
  progressPercent,
  remainingHours,
  targetHours,
  finishDate,
}) {
  const safePercent = Math.max(0, Math.min(progressPercent, 100));

  return (
    <section className="space-y-3 rounded-xl border border-gray-200 p-4">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700">
        OJT Progress
      </h3>

      <div className="flex justify-center py-2">
        <div
          className="relative grid h-28 w-28 place-items-center rounded-full"
          style={{
            background: `conic-gradient(#10bcd4 ${safePercent}%, #d4d4d8 ${safePercent}% 100%)`,
          }}
        >
          <div className="pointer-events-none grid h-20 w-20 place-items-center rounded-full bg-white">
            <span className="text-2xl font-extrabold tracking-tight text-cyan-600">
              {safePercent}%
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 text-sm text-gray-700 sm:grid-cols-3">
        <p>
          Remaining Hours:{" "}
          <span className="font-semibold">{remainingHours.toFixed(2)} h</span>
        </p>
        <p>
          Target Hours: <span className="font-semibold">{targetHours}</span>
        </p>
        <p>
          Estimated Finish Date:{" "}
          <span className="font-semibold">{finishDate}</span>
        </p>
      </div>
    </section>
  );
}
