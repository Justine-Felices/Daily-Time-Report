import { formatLogTime } from "@/lib/dtr-utils";

function TimeRow({ label, value }) {
  const logged = Boolean(value);

  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
      <div>
        <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
        <p className="text-sm font-semibold text-gray-800">
          {formatLogTime(value)}
        </p>
      </div>
      <span
        className={`text-xs font-semibold ${
          logged ? "text-green-600" : "text-gray-400"
        }`}
      >
        {logged ? "✓ Logged" : "Pending"}
      </span>
    </div>
  );
}

export default function TimeSection({
  title,
  timeIn,
  timeOut,
  onIn,
  onOut,
  outHighlighted = false,
}) {
  const isAm = title.startsWith("AM");

  return (
    <section className="space-y-3 rounded-xl border border-gray-200 p-4">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700">
        {title}
      </h3>
      <TimeRow label="Time In" value={timeIn} />
      <TimeRow label="Time Out" value={timeOut} />

      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          onClick={onIn}
          disabled={Boolean(timeIn)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isAm ? "AM IN" : "PM IN"}
        </button>
        <button
          onClick={onOut}
          disabled={Boolean(timeOut) || !timeIn}
          className={`rounded-lg px-3 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
            outHighlighted
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-700 hover:bg-gray-800"
          }`}
        >
          {isAm ? "AM OUT" : "PM OUT"}
        </button>
      </div>
    </section>
  );
}
