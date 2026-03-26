export default function SummarySection({ todayHours, monthHours, totalHours }) {
  const items = [
    { label: "Today Hours", value: `${todayHours.toFixed(2)} h` },
    { label: "Month Hours", value: `${monthHours.toFixed(2)} h` },
    { label: "Total Hours", value: `${totalHours.toFixed(2)} h` },
  ];

  return (
    <section className="space-y-3 rounded-xl border border-gray-200 p-4">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700">
        Summary
      </h3>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {items.map((item) => (
          <div key={item.label} className="rounded-lg bg-gray-50 px-3 py-2">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              {item.label}
            </p>
            <p className="text-base font-bold text-gray-900">{item.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
