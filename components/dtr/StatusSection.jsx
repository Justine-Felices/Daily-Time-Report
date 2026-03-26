const DUTY_OPTIONS = [
  "Regular Duty Day",
  "Sick Leave",
  "Vacation Leave",
  "Absent",
];

export default function StatusSection({
  dutyStatus,
  note,
  onDutyChange,
  onNoteChange,
  onSave,
}) {
  return (
    <section className="space-y-3 rounded-xl border border-gray-200 p-4">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700">
        Daily Status Exception
      </h3>

      <select
        value={dutyStatus}
        onChange={(event) => onDutyChange(event.target.value)}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none ring-0 focus:border-gray-400"
      >
        {DUTY_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <input
        value={note}
        onChange={(event) => onNoteChange(event.target.value)}
        placeholder="e.g. sick leave"
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 outline-none ring-0 placeholder:text-gray-400 focus:border-gray-400"
      />

      <button
        onClick={onSave}
        className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-black"
      >
        Save Status / Note
      </button>
    </section>
  );
}
