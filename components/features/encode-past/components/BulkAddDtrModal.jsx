import { useMemo, useState } from "react";
import { CalendarRange, Loader2, X } from "lucide-react";
import GlassCard from "@/components/ui/cards/GlassCard";
import { GLASS_INPUT_STYLE } from "@/lib/dtr-constants";
import { createBulkAttendanceRecords } from "@/lib/supabase-operations";

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toMinutes(timeString) {
  if (!timeString) return null;
  const [hour, minute] = timeString.split(":").map(Number);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return null;
  return hour * 60 + minute;
}

function formatDatePreview(dateKey) {
  const date = new Date(`${dateKey}T00:00:00`);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function formatTimePreview(value) {
  if (!value) return "--:--";
  const [hourRaw, minuteRaw] = value.split(":");
  const hour = Number(hourRaw);
  const minute = Number(minuteRaw);

  if (Number.isNaN(hour) || Number.isNaN(minute)) return value;

  const suffix = hour >= 12 ? "PM" : "AM";
  const normalizedHour = hour % 12 || 12;

  return `${normalizedHour}:${String(minute).padStart(2, "0")} ${suffix}`;
}

function buildDateRange(startDate, endDate, weekdaysOnly) {
  if (!startDate || !endDate) return [];

  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start > end) {
    return [];
  }

  const dates = [];
  const cursor = new Date(start);

  while (cursor <= end) {
    const day = cursor.getDay();
    const isWeekday = day !== 0 && day !== 6;

    if (!weekdaysOnly || isWeekday) {
      dates.push(toDateKey(cursor));
    }

    cursor.setDate(cursor.getDate() + 1);
  }

  return dates;
}

function buildEntryPayload({ entryType, mode, times, note, dates }) {
  const statusByType = {
    regular: "Regular Duty Day",
    absent: "Absent",
    leave: "Vacation Leave",
    half_day: "Half Day",
  };

  return dates.map((date) => {
    if (entryType === "absent" || entryType === "leave") {
      return {
        date,
        status: statusByType[entryType],
        am_in: null,
        am_out: null,
        pm_in: null,
        pm_out: null,
        total_hours: 0,
        mode,
        note,
      };
    }

    if (entryType === "half_day") {
      const amInMinutes = toMinutes(times.amIn);
      const amOutMinutes = toMinutes(times.amOut);
      const hours =
        amInMinutes !== null && amOutMinutes !== null
          ? Math.max(0, (amOutMinutes - amInMinutes) / 60)
          : 0;

      return {
        date,
        status: statusByType[entryType],
        am_in: times.amIn || null,
        am_out: times.amOut || null,
        pm_in: null,
        pm_out: null,
        total_hours: Number(hours.toFixed(2)),
        mode,
        note,
      };
    }

    const amInMinutes = toMinutes(times.amIn);
    const amOutMinutes = toMinutes(times.amOut);
    const pmInMinutes = toMinutes(times.pmIn);
    const pmOutMinutes = toMinutes(times.pmOut);

    let totalHours = 0;

    if (amInMinutes !== null && amOutMinutes !== null) {
      totalHours += Math.max(0, (amOutMinutes - amInMinutes) / 60);
    }
    if (pmInMinutes !== null && pmOutMinutes !== null) {
      totalHours += Math.max(0, (pmOutMinutes - pmInMinutes) / 60);
    }

    return {
      date,
      status: statusByType[entryType],
      am_in: times.amIn || null,
      am_out: times.amOut || null,
      pm_in: times.pmIn || null,
      pm_out: times.pmOut || null,
      total_hours: Number(totalHours.toFixed(2)),
      mode,
      note,
    };
  });
}

function pluralize(count, singular, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

function buildBulkResultMessage(result, onDuplicate) {
  const inserted = Number(result?.insertedCount) || 0;
  const replaced = Number(result?.replacedCount) || 0;
  const skipped = Number(result?.skippedCount) || 0;
  const totalUpdated = inserted + replaced;

  if (totalUpdated === 0 && skipped > 0 && onDuplicate === "skip") {
    return {
      feedback: "",
      error: `No changes were saved. ${pluralize(skipped, "selected date")} already ${
        skipped === 1 ? "has" : "have"
      } attendance records. Try \"Replace existing\" if you want to overwrite them.`,
    };
  }

  if (totalUpdated === 0) {
    return {
      feedback: "",
      error: "No entries were saved. Check your selected dates and try again.",
    };
  }

  const parts = [];

  if (inserted > 0) {
    parts.push(`${pluralize(inserted, "new entry", "new entries")} added`);
  }

  if (replaced > 0) {
    parts.push(
      `${pluralize(replaced, "existing record", "existing records")} updated`,
    );
  }

  if (skipped > 0) {
    parts.push(
      `${pluralize(skipped, "date")} already ${
        skipped === 1 ? "has" : "have"
      } records (skipped)`,
    );
  }

  return {
    feedback: `Saved successfully: ${parts.join(", ")}.`,
    error: "",
  };
}

const OPTION_BUTTON_STYLE = {
  borderRadius: "999px",
  border: "1px solid var(--border-soft)",
  padding: "6px 10px",
  fontSize: "11px",
  fontWeight: 700,
  fontFamily: "'Inter',sans-serif",
  transition: "all 0.2s ease",
};

const SECTION_LABEL_STYLE = {
  color: "var(--text-primary)",
  fontSize: "11px",
  fontWeight: 700,
  letterSpacing: "0.05em",
  fontFamily: "'Inter',sans-serif",
  marginBottom: "6px",
};

export default function BulkAddDtrModal({ open, onClose }) {
  const [entryType, setEntryType] = useState("regular");
  const [weekdaysOnly, setWeekdaysOnly] = useState(true);
  const [onDuplicate, setOnDuplicate] = useState("skip");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [note, setNote] = useState("");
  const [times, setTimes] = useState({
    amIn: "09:30",
    amOut: "12:00",
    pmIn: "13:00",
    pmOut: "18:30",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  const selectedDates = useMemo(
    () => buildDateRange(startDate, endDate, weekdaysOnly),
    [startDate, endDate, weekdaysOnly],
  );

  const previewRows = useMemo(() => {
    return selectedDates.map((date) => {
      if (entryType === "regular") {
        return `${formatDatePreview(date)} - Regular (${formatTimePreview(times.amIn)} - ${formatTimePreview(times.pmOut)})`;
      }

      if (entryType === "half_day") {
        return `${formatDatePreview(date)} - Half Day (${formatTimePreview(times.amIn)} - ${formatTimePreview(times.amOut)})`;
      }

      if (entryType === "leave") {
        return `${formatDatePreview(date)} - Leave`;
      }

      return `${formatDatePreview(date)} - Absent`;
    });
  }, [selectedDates, entryType, times]);

  const shouldShowFullTimes = entryType === "regular";
  const shouldShowHalfDayTimes = entryType === "half_day";

  const handleSaveBulk = async () => {
    setError("");
    setFeedback("");

    if (selectedDates.length === 0) {
      setError("Select a valid date range first.");
      return;
    }

    if (entryType === "regular") {
      if (!times.amIn || !times.amOut || !times.pmIn || !times.pmOut) {
        setError("Please provide AM/PM times for Regular Duty Day.");
        return;
      }

      if (
        toMinutes(times.amOut) <= toMinutes(times.amIn) ||
        toMinutes(times.pmOut) <= toMinutes(times.pmIn) ||
        toMinutes(times.pmIn) < toMinutes(times.amOut)
      ) {
        setError("Please use a valid time sequence (AM then PM). ");
        return;
      }
    }

    if (entryType === "half_day") {
      if (!times.amIn || !times.amOut) {
        setError("Please provide AM In and AM Out for Half Day.");
        return;
      }

      if (toMinutes(times.amOut) <= toMinutes(times.amIn)) {
        setError("AM Out must be later than AM In.");
        return;
      }
    }

    const mode = "session";
    const entries = buildEntryPayload({
      entryType,
      mode,
      times,
      note,
      dates: selectedDates,
    });

    setIsSaving(true);

    try {
      const result = await createBulkAttendanceRecords({
        entries,
        onDuplicate,
      });

      const message = buildBulkResultMessage(result, onDuplicate);
      setFeedback(message.feedback);
      setError(message.error);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Failed to save bulk entries.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/55 p-3 sm:items-center sm:p-4">
      <GlassCard padding="16px" className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h3
              style={{
                color: "var(--text-primary)",
                fontSize: "16px",
                fontWeight: 800,
                fontFamily: "'Inter',sans-serif",
                margin: 0,
              }}
            >
              Bulk Add DTR Entries
            </h3>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "12px",
                fontFamily: "'Inter',sans-serif",
                margin: "4px 0 0 0",
              }}
            >
              Apply one setup to multiple dates without Excel import.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              border: "1px solid var(--border-soft)",
              background: "var(--surface-muted)",
              borderRadius: "10px",
              width: "32px",
              height: "32px",
              display: "grid",
              placeItems: "center",
              color: "var(--text-secondary)",
            }}
            aria-label="Close bulk add"
          >
            <X size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <div style={SECTION_LABEL_STYLE}>ENTRY TYPE</div>
            <div className="flex flex-wrap gap-2">
              {[
                ["regular", "Regular Duty Day"],
                ["absent", "Absent"],
                ["leave", "Leave"],
                ["half_day", "Half Day"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setEntryType(value)}
                  style={{
                    ...OPTION_BUTTON_STYLE,
                    background:
                      entryType === value
                        ? "var(--accent-strong)"
                        : "var(--surface-muted)",
                    color:
                      entryType === value ? "#ffffff" : "var(--text-secondary)",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div style={SECTION_LABEL_STYLE}>DUPLICATE HANDLING</div>
            <div className="flex flex-wrap gap-2">
              {[
                ["skip", "Skip existing"],
                ["replace", "Replace existing"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setOnDuplicate(value)}
                  style={{
                    ...OPTION_BUTTON_STYLE,
                    background:
                      onDuplicate === value
                        ? "var(--accent-strong)"
                        : "var(--surface-muted)",
                    color:
                      onDuplicate === value
                        ? "#ffffff"
                        : "var(--text-secondary)",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <div style={SECTION_LABEL_STYLE}>START DATE</div>
            <input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              className="w-full"
              style={{ ...GLASS_INPUT_STYLE, padding: "10px 12px" }}
            />
          </div>

          <div>
            <div style={SECTION_LABEL_STYLE}>END DATE</div>
            <input
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              className="w-full"
              style={{ ...GLASS_INPUT_STYLE, padding: "10px 12px" }}
            />
          </div>
        </div>

        <label
          className="mt-3 inline-flex items-center gap-2"
          style={{
            color: "var(--text-secondary)",
            fontSize: "12px",
            fontFamily: "'Inter',sans-serif",
          }}
        >
          <input
            type="checkbox"
            checked={weekdaysOnly}
            onChange={(event) => setWeekdaysOnly(event.target.checked)}
          />
          Weekdays only
        </label>

        {(shouldShowFullTimes || shouldShowHalfDayTimes) && (
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div>
              <div style={SECTION_LABEL_STYLE}>AM IN</div>
              <input
                type="time"
                value={times.amIn}
                onChange={(event) =>
                  setTimes((current) => ({ ...current, amIn: event.target.value }))
                }
                className="w-full"
                style={{ ...GLASS_INPUT_STYLE, padding: "10px 12px" }}
              />
            </div>

            <div>
              <div style={SECTION_LABEL_STYLE}>AM OUT</div>
              <input
                type="time"
                value={times.amOut}
                onChange={(event) =>
                  setTimes((current) => ({ ...current, amOut: event.target.value }))
                }
                className="w-full"
                style={{ ...GLASS_INPUT_STYLE, padding: "10px 12px" }}
              />
            </div>

            {shouldShowFullTimes && (
              <>
                <div>
                  <div style={SECTION_LABEL_STYLE}>PM IN</div>
                  <input
                    type="time"
                    value={times.pmIn}
                    onChange={(event) =>
                      setTimes((current) => ({ ...current, pmIn: event.target.value }))
                    }
                    className="w-full"
                    style={{ ...GLASS_INPUT_STYLE, padding: "10px 12px" }}
                  />
                </div>

                <div>
                  <div style={SECTION_LABEL_STYLE}>PM OUT</div>
                  <input
                    type="time"
                    value={times.pmOut}
                    onChange={(event) =>
                      setTimes((current) => ({ ...current, pmOut: event.target.value }))
                    }
                    className="w-full"
                    style={{ ...GLASS_INPUT_STYLE, padding: "10px 12px" }}
                  />
                </div>
              </>
            )}
          </div>
        )}

        <div className="mt-3">
          <div style={SECTION_LABEL_STYLE}>NOTE (OPTIONAL)</div>
          <textarea
            rows={2}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Optional note for all selected dates"
            className="w-full resize-none"
            style={{ ...GLASS_INPUT_STYLE, padding: "10px 12px" }}
          />
        </div>

        <div className="mt-3">
          <div style={SECTION_LABEL_STYLE}>PREVIEW ({previewRows.length} ENTRIES)</div>
          <div
            className="rounded-xl border p-2"
            style={{
              borderColor: "var(--border-soft)",
              background: "var(--surface-muted)",
              maxHeight: "180px",
              overflowY: "auto",
            }}
          >
            {previewRows.length === 0 ? (
              <p
                style={{
                  margin: 0,
                  color: "var(--text-muted)",
                  fontSize: "12px",
                  fontFamily: "'Inter',sans-serif",
                }}
              >
                Select dates to preview bulk entries.
              </p>
            ) : (
              <ul className="space-y-1">
                {previewRows.map((row) => (
                  <li
                    key={row}
                    style={{
                      color: "var(--text-secondary)",
                      fontSize: "12px",
                      fontFamily: "'Inter',sans-serif",
                    }}
                  >
                    {row}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {error && (
          <p
            className="mt-3"
            style={{
              color: "#DC2626",
              fontSize: "12px",
              fontFamily: "'Inter',sans-serif",
              marginBottom: 0,
            }}
          >
            {error}
          </p>
        )}

        {feedback && (
          <p
            className="mt-3"
            style={{
              color: "#059669",
              fontSize: "12px",
              fontFamily: "'Inter',sans-serif",
              marginBottom: 0,
            }}
          >
            {feedback}
          </p>
        )}

        <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            style={{
              border: "1px solid var(--border-soft)",
              background: "var(--surface-muted)",
              color: "var(--text-secondary)",
              fontSize: "12px",
              fontWeight: 700,
              fontFamily: "'Inter',sans-serif",
              borderRadius: "10px",
              padding: "9px 12px",
            }}
          >
            Close
          </button>

          <button
            type="button"
            onClick={handleSaveBulk}
            disabled={isSaving}
            style={{
              border: "none",
              background: "var(--accent-strong)",
              color: "#ffffff",
              fontSize: "12px",
              fontWeight: 700,
              fontFamily: "'Inter',sans-serif",
              borderRadius: "10px",
              padding: "9px 12px",
              opacity: isSaving ? 0.75 : 1,
              cursor: isSaving ? "not-allowed" : "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
          >
            {isSaving ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Saving
              </>
            ) : (
              <>
                <CalendarRange size={14} /> Apply Bulk Entries
              </>
            )}
          </button>
        </div>
      </GlassCard>
    </div>
  );
}
