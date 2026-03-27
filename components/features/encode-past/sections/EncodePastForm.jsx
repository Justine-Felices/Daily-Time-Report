export default function EncodePastForm({
  formData,
  errors,
  maxDate,
  onFieldChange,
  onSave,
}) {
  return (
    <section className="space-y-4 rounded-xl border border-gray-200 p-4">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700">
        Encode Past Record
      </h3>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Date
          </label>
          <input
            type="date"
            value={formData.date}
            max={maxDate}
            onChange={(event) => onFieldChange("date", event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 outline-none focus:border-gray-400"
          />
          {errors.date && <p className="text-xs text-red-600">{errors.date}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            AM Time In
          </label>
          <input
            type="time"
            value={formData.amIn}
            onChange={(event) => onFieldChange("amIn", event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 outline-none focus:border-gray-400"
          />
          {errors.amIn && <p className="text-xs text-red-600">{errors.amIn}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            AM Time Out
          </label>
          <input
            type="time"
            value={formData.amOut}
            onChange={(event) => onFieldChange("amOut", event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 outline-none focus:border-gray-400"
          />
          {errors.amOut && <p className="text-xs text-red-600">{errors.amOut}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            PM Time In
          </label>
          <input
            type="time"
            value={formData.pmIn}
            onChange={(event) => onFieldChange("pmIn", event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 outline-none focus:border-gray-400"
          />
          {errors.pmIn && <p className="text-xs text-red-600">{errors.pmIn}</p>}
        </div>

        <div className="space-y-1 md:col-span-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            PM Time Out
          </label>
          <input
            type="time"
            value={formData.pmOut}
            onChange={(event) => onFieldChange("pmOut", event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 outline-none focus:border-gray-400"
          />
          {errors.pmOut && <p className="text-xs text-red-600">{errors.pmOut}</p>}
        </div>
      </div>

      {errors.form && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {errors.form}
        </p>
      )}

      <button
        onClick={onSave}
        className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
      >
        Save Record
      </button>
    </section>
  );
}
