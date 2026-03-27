function formatTimeLabel(timeValue) {
  const [hourText, minute] = timeValue.split(":");
  const hour = Number(hourText);
  const suffix = hour >= 12 ? "PM" : "AM";
  const twelveHour = hour % 12 || 12;
  return `${twelveHour}:${minute} ${suffix}`;
}

function formatDateLabel(dateValue) {
  const date = new Date(`${dateValue}T00:00:00`);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function EncodePastRecordsTable({ records }) {
  return (
    <section className="space-y-3 rounded-xl border border-gray-200 p-4">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700">
        Encoded Records
      </h3>

      {records.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
          No encoded records yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-3 py-2 font-semibold">Date</th>
                <th className="px-3 py-2 font-semibold">AM IN</th>
                <th className="px-3 py-2 font-semibold">AM OUT</th>
                <th className="px-3 py-2 font-semibold">PM IN</th>
                <th className="px-3 py-2 font-semibold">PM OUT</th>
                <th className="px-3 py-2 font-semibold">Total Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white text-gray-700">
              {records.map((record) => (
                <tr key={record.id} className="transition hover:bg-gray-50">
                  <td className="whitespace-nowrap px-3 py-2 font-medium text-gray-900">
                    {formatDateLabel(record.date)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">{formatTimeLabel(record.amIn)}</td>
                  <td className="whitespace-nowrap px-3 py-2">{formatTimeLabel(record.amOut)}</td>
                  <td className="whitespace-nowrap px-3 py-2">{formatTimeLabel(record.pmIn)}</td>
                  <td className="whitespace-nowrap px-3 py-2">{formatTimeLabel(record.pmOut)}</td>
                  <td className="whitespace-nowrap px-3 py-2 font-semibold text-gray-900">
                    {record.totalHours.toFixed(2)} h
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
