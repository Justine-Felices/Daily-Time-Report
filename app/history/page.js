const SAMPLE_HISTORY = [
  {
    id: "h-1",
    date: "2026-03-24",
    status: "Regular Duty Day",
    note: "Completed documentation tasks",
    totalHours: 8,
  },
  {
    id: "h-2",
    date: "2026-03-23",
    status: "Regular Duty Day",
    note: "Frontend implementation",
    totalHours: 7.5,
  },
  {
    id: "h-3",
    date: "2026-03-22",
    status: "Sick Leave",
    note: "Half-day leave",
    totalHours: 4,
  },
];

function formatDate(dateValue) {
  const date = new Date(`${dateValue}T00:00:00`);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function HistoryPage() {
  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10">
      <section className="mx-auto w-full max-w-200 space-y-4 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
        <header className="space-y-1 border-b border-gray-100 pb-4">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            History
          </h1>
          <p className="text-sm text-gray-500">
            Review your recent attendance and status entries.
          </p>
        </header>

        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-3 py-2 font-semibold">Date</th>
                <th className="px-3 py-2 font-semibold">Status</th>
                <th className="px-3 py-2 font-semibold">Note</th>
                <th className="px-3 py-2 font-semibold">Total Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white text-gray-700">
              {SAMPLE_HISTORY.map((record) => (
                <tr key={record.id}>
                  <td className="whitespace-nowrap px-3 py-2 font-medium text-gray-900">
                    {formatDate(record.date)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">
                    {record.status}
                  </td>
                  <td className="px-3 py-2">{record.note}</td>
                  <td className="whitespace-nowrap px-3 py-2 font-semibold text-gray-900">
                    {record.totalHours.toFixed(2)} h
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
