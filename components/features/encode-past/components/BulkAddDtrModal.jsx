import { useMemo, useState } from "react";
import {
  Calendar,
  CalendarDays,
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  Globe,
  Loader2,
  ShieldCheck,
  StickyNote,
  X,
} from "lucide-react";
import GlassCard from "@/components/ui/cards/GlassCard";
import { GLASS_INPUT_STYLE } from "@/lib/dtr-constants";
import { createBulkAttendanceRecords } from "@/lib/supabase-operations";
import { formatReadableDate, getPhilippineParts, getPhilippineToday } from "@/lib/dtr-formatters";
import { calculateTotalHours } from "@/lib/dtr-time-validation";

function toDateKey(date) {
  const { year, month, day } = getPhilippineParts(date);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function toMinutes(timeString) {
  if (!timeString) return null;
  const [hour, minute] = timeString.split(":").map(Number);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return null;
  return hour * 60 + minute;
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

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function buildMonthCells(monthDate) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startWeekday = firstDay.getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < startWeekday; i += 1) {
    cells.push(null);
  }

  for (let day = 1; day <= totalDays; day += 1) {
    const date = new Date(year, month, day);
    cells.push({
      date,
      dateKey: toDateKey(date),
      day,
    });
  }

  const remainder = cells.length % 7;
  if (remainder !== 0) {
    for (let i = 0; i < 7 - remainder; i += 1) {
      cells.push(null);
    }
  }

  return cells;
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
        ot_in: null,
        ot_out: null,
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
        ot_in: null,
        ot_out: null,
        total_hours: Number(hours.toFixed(2)),
        mode,
        note,
      };
    }

    const totalHours = calculateTotalHours({
      amIn: times.amIn || null,
      amOut: times.amOut || null,
      pmIn: times.pmIn || null,
      pmOut: times.pmOut || null,
      otIn: times.otIn || null,
      otOut: times.otOut || null,
    });

    return {
      date,
      status: statusByType[entryType],
      am_in: times.amIn || null,
      am_out: times.amOut || null,
      pm_in: times.pmIn || null,
      pm_out: times.pmOut || null,
      ot_in: times.otIn || null,
      ot_out: times.otOut || null,
      total_hours: totalHours,
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
  const [onDuplicate, setOnDuplicate] = useState("skip");
  const [calendarMonth, setCalendarMonth] = useState(() => getPhilippineToday());
  const [selectedDates, setSelectedDates] = useState([]);
  const [note, setNote] = useState("");
  const [times, setTimes] = useState({
    amIn: "08:00",
    amOut: "11:00",
    pmIn: "12:00",
    pmOut: "17:00",
    otIn: "",
    otOut: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  const todayKey = useMemo(() => toDateKey(new Date()), []);
  const selectedDateKeys = useMemo(
    () => [...selectedDates].sort(),
    [selectedDates],
  );
  const selectedDateSet = useMemo(
    () => new Set(selectedDateKeys),
    [selectedDateKeys],
  );

  const monthLabel = useMemo(
    () =>
      calendarMonth.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
    [calendarMonth],
  );

  const calendarCells = useMemo(
    () => buildMonthCells(calendarMonth),
    [calendarMonth],
  );

  const monthCells = useMemo(
    () => calendarCells.filter(Boolean),
    [calendarCells],
  );

  const toggleDateSelection = (dateKey) => {
    if (!dateKey || dateKey > todayKey) return;
    setSelectedDates((prev) => {
      const set = new Set(prev);
      if (set.has(dateKey)) {
        set.delete(dateKey);
      } else {
        set.add(dateKey);
      }
      return Array.from(set).sort();
    });
  };

  const addMonthDates = (predicate) => {
    setSelectedDates((prev) => {
      const set = new Set(prev);
      monthCells.forEach((cell) => {
        if (!cell?.dateKey || cell.dateKey > todayKey) return;
        if (!predicate || predicate(cell.date)) {
          set.add(cell.dateKey);
        }
      });
      return Array.from(set).sort();
    });
  };

  const clearMonthDates = () => {
    const monthKeys = new Set(monthCells.map((cell) => cell.dateKey));
    setSelectedDates((prev) => prev.filter((dateKey) => !monthKeys.has(dateKey)));
  };

  const clearAllDates = () => {
    setSelectedDates([]);
  };

  const goToPrevMonth = () => {
    setCalendarMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
    );
  };

  const goToNextMonth = () => {
    setCalendarMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
    );
  };

  const previewRows = useMemo(() => {
    return selectedDateKeys.map((date) => {
      if (entryType === "regular") {
        const otPreview =
          times.otIn || times.otOut
            ? `, OT (${formatTimePreview(times.otIn)} - ${formatTimePreview(times.otOut)})`
            : "";
        return `${formatReadableDate(date)} - Regular (${formatTimePreview(times.amIn)} - ${formatTimePreview(times.pmOut)}${otPreview})`;
      }

      if (entryType === "half_day") {
        return `${formatReadableDate(date)} - Half Day (${formatTimePreview(times.amIn)} - ${formatTimePreview(times.amOut)})`;
      }

      if (entryType === "leave") {
        return `${formatReadableDate(date)} - Leave`;
      }

      return `${formatReadableDate(date)} - Absent`;
    });
  }, [selectedDateKeys, entryType, times]);

  const shouldShowFullTimes = entryType === "regular";
  const shouldShowHalfDayTimes = entryType === "half_day";

  const handleSaveBulk = async () => {
    setError("");
    setFeedback("");

    if (selectedDateKeys.length === 0) {
      setError("Select at least one date to continue.");
      return;
    }

    if (selectedDateKeys.some((dateKey) => dateKey > todayKey)) {
      setError("Bulk entries cannot be added for future dates.");
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

      if (times.otIn || times.otOut) {
        if (!times.otIn || !times.otOut) {
          setError("Please provide both OT In and OT Out.");
          return;
        }

        if (toMinutes(times.otOut) <= toMinutes(times.otIn)) {
          setError("OT Out must be later than OT In.");
          return;
        }

        if (toMinutes(times.otIn) < toMinutes(times.pmOut)) {
          setError("OT In must be after PM Out.");
          return;
        }
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
      dates: selectedDateKeys,
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
      <GlassCard
        padding="16px"
        className="w-full max-w-5xl max-h-[90vh] overflow-y-auto"
      >
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

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr]">
          {/* Left Column: Configuration */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                          entryType === value
                            ? "#ffffff"
                            : "var(--text-secondary)",
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

            <div>
              <div style={SECTION_LABEL_STYLE}>SELECT DATES</div>
              <div
                className="rounded-2xl border p-4"
                style={{
                  borderColor: "var(--border-soft)",
                  background: "var(--surface-muted)",
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <button
                    type="button"
                    onClick={goToPrevMonth}
                    className="rounded-lg px-2 py-1"
                    style={{
                      border: "1px solid var(--border-soft)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    <ChevronLeft size={14} />
                  </button>

                  <div
                    style={{
                      color: "var(--text-primary)",
                      fontSize: "13px",
                      fontWeight: 700,
                    }}
                  >
                    {monthLabel}
                  </div>

                  <button
                    type="button"
                    onClick={goToNextMonth}
                    className="rounded-lg px-2 py-1"
                    style={{
                      border: "1px solid var(--border-soft)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {WEEKDAYS.map((label) => (
                    <div
                      key={label}
                      className="text-center"
                      style={{
                        color: "var(--text-muted)",
                        fontSize: "10px",
                        fontWeight: 700,
                        letterSpacing: "0.04em",
                      }}
                    >
                      {label}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {calendarCells.map((cell, index) => {
                    if (!cell) {
                      return <div key={`empty-${index}`} className="h-9" />;
                    }

                    const isSelected = selectedDateSet.has(cell.dateKey);
                    const isFuture = cell.dateKey > todayKey;
                    const isToday = cell.dateKey === todayKey;
                    const isWeekend =
                      cell.date.getDay() === 0 || cell.date.getDay() === 6;

                    return (
                      <button
                        key={cell.dateKey}
                        type="button"
                        disabled={isFuture}
                        onClick={() => toggleDateSelection(cell.dateKey)}
                        className="h-9 rounded-lg text-xs font-semibold"
                        style={{
                          border: `1px solid ${
                            isSelected
                              ? "var(--accent-strong)"
                              : isToday
                                ? "rgba(59, 130, 246, 0.7)"
                                : "var(--border-soft)"
                          }`,
                          background: isSelected
                            ? "var(--accent-strong)"
                            : "var(--surface-card)",
                          color: isSelected
                            ? "#ffffff"
                            : isFuture
                              ? "rgba(148, 163, 184, 0.45)"
                              : isWeekend
                                ? "var(--text-muted)"
                                : "var(--text-primary)",
                          cursor: isFuture ? "not-allowed" : "pointer",
                          opacity: isFuture ? 0.6 : 1,
                        }}
                      >
                        {cell.day}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    addMonthDates((date) => {
                      const day = date.getDay();
                      return day !== 0 && day !== 6;
                    })
                  }
                  style={{
                    ...OPTION_BUTTON_STYLE,
                    background: "var(--surface-muted)",
                    color: "var(--text-secondary)",
                  }}
                >
                  Select Weekdays
                </button>
                <button
                  type="button"
                  onClick={() => addMonthDates()}
                  style={{
                    ...OPTION_BUTTON_STYLE,
                    background: "var(--surface-muted)",
                    color: "var(--text-secondary)",
                  }}
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={clearMonthDates}
                  style={{
                    ...OPTION_BUTTON_STYLE,
                    background: "var(--surface-muted)",
                    color: "var(--text-secondary)",
                  }}
                >
                  Clear Month
                </button>
                <button
                  type="button"
                  onClick={clearAllDates}
                  style={{
                    ...OPTION_BUTTON_STYLE,
                    background: "var(--surface-muted)",
                    color: "var(--text-secondary)",
                  }}
                >
                  Clear All
                </button>
              </div>

              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "10px",
                  marginTop: "8px",
                }}
              >
                Pick any dates you want to log. Future dates are disabled.
              </p>
            </div>

            {(shouldShowFullTimes || shouldShowHalfDayTimes) && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div>
                  <div style={SECTION_LABEL_STYLE}>AM IN</div>
                  <input
                    type="time"
                    value={times.amIn}
                    onChange={(event) =>
                      setTimes((current) => ({
                        ...current,
                        amIn: event.target.value,
                      }))
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
                      setTimes((current) => ({
                        ...current,
                        amOut: event.target.value,
                      }))
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
                          setTimes((current) => ({
                            ...current,
                            pmIn: event.target.value,
                          }))
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
                          setTimes((current) => ({
                            ...current,
                            pmOut: event.target.value,
                          }))
                        }
                        className="w-full"
                        style={{ ...GLASS_INPUT_STYLE, padding: "10px 12px" }}
                      />
                    </div>

                    <div>
                      <div style={SECTION_LABEL_STYLE}>
                        OT IN{" "}
                        <span className="text-[9px] opacity-60 font-normal">
                          (OPTIONAL)
                        </span>
                      </div>
                      <input
                        type="time"
                        value={times.otIn}
                        onChange={(event) =>
                          setTimes((current) => ({
                            ...current,
                            otIn: event.target.value,
                          }))
                        }
                        className="w-full"
                        style={{ ...GLASS_INPUT_STYLE, padding: "10px 12px" }}
                      />
                    </div>

                    <div>
                      <div style={SECTION_LABEL_STYLE}>
                        OT OUT{" "}
                        <span className="text-[9px] opacity-60 font-normal">
                          (OPTIONAL)
                        </span>
                      </div>
                      <input
                        type="time"
                        value={times.otOut}
                        onChange={(event) =>
                          setTimes((current) => ({
                            ...current,
                            otOut: event.target.value,
                          }))
                        }
                        className="w-full"
                        style={{ ...GLASS_INPUT_STYLE, padding: "10px 12px" }}
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            <div>
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
          </div>

          {/* Right Column: Preview */}
          <div
            style={{
              background: "rgba(0,0,0,0.1)",
              borderRadius: "20px",
              padding: "16px",
              border: "1px solid var(--border-soft)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div style={SECTION_LABEL_STYLE} className="mb-0">
                PREVIEW
              </div>
              <div
                style={{
                  background: "rgba(30, 64, 175, 0.2)",
                  color: "var(--accent-strong)",
                  fontSize: "10px",
                  fontWeight: 800,
                  padding: "2px 8px",
                  borderRadius: "6px",
                  border: "1px solid rgba(30, 64, 175, 0.3)",
                }}
              >
                {previewRows.length} ENTRIES
              </div>
            </div>

            <div
              className="rounded-2xl border"
              style={{
                borderColor: "var(--border-soft)",
                background: "var(--surface-muted)",
                padding: "16px",
                minHeight: "120px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {previewRows.length === 0 ? (
                <>
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "10px",
                      background: "rgba(30, 64, 175, 0.1)",
                      display: "grid",
                      placeItems: "center",
                      color: "var(--accent-strong)",
                      marginBottom: "10px",
                    }}
                  >
                    <Calendar size={20} />
                  </div>
                  <h4
                    style={{
                      color: "var(--text-primary)",
                      fontSize: "13px",
                      fontWeight: 700,
                      margin: "0 0 4px 0",
                    }}
                  >
                    No dates selected yet
                  </h4>
                  <p
                    style={{
                      margin: 0,
                      color: "var(--text-muted)",
                      fontSize: "11px",
                      maxWidth: "180px",
                    }}
                  >
                    Select dates to preview the entries.
                  </p>
                </>
              ) : (
                <div className="w-full text-left">
                  <div
                    className="mb-2"
                    style={{
                      color: "var(--text-secondary)",
                      fontSize: "11px",
                      fontWeight: 600,
                      letterSpacing: "0.02em",
                    }}
                  >
                    DATES TO BE CREATED
                  </div>
                  <div
                    style={{
                      maxHeight: "100px",
                      overflowY: "auto",
                      paddingRight: "8px",
                    }}
                    className="custom-scrollbar"
                  >
                    <ul className="space-y-1">
                      {previewRows.map((row) => (
                        <li
                          key={row}
                          style={{
                            color: "var(--text-secondary)",
                            fontSize: "12px",
                          }}
                        >
                          {row}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6">
              <div
                className="mb-4"
                style={{
                  color: "var(--text-primary)",
                  fontSize: "11px",
                  fontWeight: 800,
                  letterSpacing: "0.05em",
                }}
              >
                WHAT WILL BE APPLIED
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "6px",
                        background: "rgba(59, 130, 246, 0.1)",
                        display: "grid",
                        placeItems: "center",
                        color: "#3b82f6",
                      }}
                    >
                      <FileText size={14} />
                    </div>
                    <span
                      style={{
                        color: "var(--text-secondary)",
                        fontSize: "12px",
                      }}
                    >
                      Entry Type
                    </span>
                  </div>
                  <span
                    style={{
                      color: "var(--text-primary)",
                      fontSize: "12px",
                      fontWeight: 500,
                    }}
                  >
                    {
                      {
                        regular: "Regular Duty Day",
                        absent: "Absent",
                        leave: "Leave",
                        half_day: "Half Day",
                      }[entryType]
                    }
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "6px",
                        background: "rgba(99, 102, 241, 0.1)",
                        display: "grid",
                        placeItems: "center",
                        color: "#6366f1",
                      }}
                    >
                      <ShieldCheck size={14} />
                    </div>
                    <span
                      style={{
                        color: "var(--text-secondary)",
                        fontSize: "12px",
                      }}
                    >
                      Duplicate Handling
                    </span>
                  </div>
                  <span
                    style={{
                      color: "var(--text-primary)",
                      fontSize: "12px",
                      fontWeight: 500,
                    }}
                  >
                    {
                      {
                        skip: "Skip existing",
                        replace: "Replace existing",
                      }[onDuplicate]
                    }
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "6px",
                        background: "rgba(16, 185, 129, 0.1)",
                        display: "grid",
                        placeItems: "center",
                        color: "#10b981",
                      }}
                    >
                      <CalendarDays size={14} />
                    </div>
                    <span
                      style={{
                        color: "var(--text-secondary)",
                        fontSize: "12px",
                      }}
                    >
                      Selected Dates
                    </span>
                  </div>
                  <span
                    style={{
                      color: "var(--text-primary)",
                      fontSize: "12px",
                      fontWeight: 500,
                    }}
                  >
                    {pluralize(selectedDateKeys.length, "date")}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "6px",
                        background: "rgba(139, 92, 246, 0.1)",
                        display: "grid",
                        placeItems: "center",
                        color: "#8b5cf6",
                      }}
                    >
                      <Clock size={14} />
                    </div>
                    <span
                      style={{
                        color: "var(--text-secondary)",
                        fontSize: "12px",
                      }}
                    >
                      Time Schedule
                    </span>
                  </div>
                  <span
                    style={{
                      color: "var(--text-primary)",
                      fontSize: "12px",
                      fontWeight: 500,
                    }}
                  >
                    {entryType === "regular"
                      ? `${formatTimePreview(times.amIn)} - ${formatTimePreview(times.pmOut)}`
                      : entryType === "half_day"
                        ? `${formatTimePreview(times.amIn)} - ${formatTimePreview(times.amOut)}`
                        : "Not applicable"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "6px",
                        background: "rgba(245, 158, 11, 0.1)",
                        display: "grid",
                        placeItems: "center",
                        color: "#f59e0b",
                      }}
                    >
                      <Globe size={14} />
                    </div>
                    <span
                      style={{
                        color: "var(--text-secondary)",
                        fontSize: "12px",
                      }}
                    >
                      OT
                    </span>
                  </div>
                  <span
                    style={{
                      color: "var(--text-primary)",
                      fontSize: "12px",
                      fontWeight: 500,
                    }}
                  >
                    {entryType === "regular" && (times.otIn || times.otOut)
                      ? `${formatTimePreview(times.otIn)} - ${formatTimePreview(times.otOut)}`
                      : "Not set"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "6px",
                        background: "rgba(236, 72, 153, 0.1)",
                        display: "grid",
                        placeItems: "center",
                        color: "#ec4899",
                      }}
                    >
                      <StickyNote size={14} />
                    </div>
                    <span
                      style={{
                        color: "var(--text-secondary)",
                        fontSize: "12px",
                      }}
                    >
                      Note
                    </span>
                  </div>
                  <span
                    style={{
                      color: "var(--text-primary)",
                      fontSize: "12px",
                      fontWeight: 500,
                      maxWidth: "120px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {note || "No note added"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end items-center">
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
                padding: "9px 16px",
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
                padding: "9px 20px",
                opacity: isSaving ? 0.75 : 1,
                cursor: isSaving ? "not-allowed" : "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxShadow: "0 10px 20px rgba(59, 130, 246, 0.15)",
              }}
            >
              {isSaving ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> SAVING...
                </>
              ) : (
                <>
                  <CalendarRange size={14} /> APPLY BULK ENTRIES
                </>
              )}
            </button>
          </div>

          {(error || feedback) && (
            <div className="flex justify-end animate-in fade-in slide-in-from-top-1 duration-300">
              {error && (
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                  style={{
                    background: "rgba(220, 38, 38, 0.08)",
                    border: "1px solid rgba(220, 38, 38, 0.15)",
                    color: "#ef4444",
                    fontSize: "10px",
                    fontWeight: 800,
                    letterSpacing: "0.02em",
                    textTransform: "uppercase",
                  }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  {error}
                </div>
              )}
              {feedback && (
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                  style={{
                    background: "rgba(16, 185, 129, 0.08)",
                    border: "1px solid rgba(16, 185, 129, 0.15)",
                    color: "#10b981",
                    fontSize: "10px",
                    fontWeight: 800,
                    letterSpacing: "0.02em",
                    textTransform: "uppercase",
                  }}
                >
                  <ShieldCheck size={12} />
                  {feedback}
                </div>
              )}
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
