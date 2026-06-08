import { useMemo } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import GlassCard from "@/components/ui/cards/GlassCard";
import { getPhilippineParts, getPhilippineDateString } from "@/lib/dtr-formatters";

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const STATUS_META = {
  "Regular Duty Day": { label: "Regular Day", color: "#3b82f6" },
  "Half Day": { label: "Half Day", color: "#a855f7" },
  Absent: { label: "Absent", color: "#f43f5e" },
  "Vacation Leave": { label: "Leave", color: "#f59e0b" },
  "Sick Leave": { label: "Leave", color: "#f59e0b" },
  Holiday: { label: "Holiday", color: "#eab308" },
  "Work From Home": { label: "Work From Home", color: "#22d3ee" },
  "On Field": { label: "On Field", color: "#38bdf8" },
};

function toDateKey(date) {
  return getPhilippineDateString(date);
}

function monthKeyFromDate(date) {
  const { year, month } = getPhilippineParts(date);
  return `${year}-${String(month).padStart(2, "0")}`;
}

function dateFromMonthKey(monthKey) {
  const [year, month] = monthKey.split("-").map(Number);
  return new Date(year, month - 1, 1);
}

function formatHours(hours) {
  if (!Number.isFinite(hours) || hours <= 0) return "";
  const rounded = Math.round(hours * 10) / 10;
  return Number.isInteger(rounded) ? `${rounded}h` : `${rounded.toFixed(1)}h`;
}

function getStatusMeta(status) {
  if (!status) return null;
  return STATUS_META[status] || { label: status, color: "#94a3b8" };
}

export default function CalendarSection({
  monthDate,
  records,
  monthsWithData = [],
  onMonthChange,
  isLoading,
  todayKey,
}) {
  const monthLabel = useMemo(
    () =>
      monthDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
    [monthDate],
  );

  const currentMonthKey = useMemo(() => monthKeyFromDate(monthDate), [monthDate]);

  const currentMonthIndex = useMemo(
    () => monthsWithData.indexOf(currentMonthKey),
    [monthsWithData, currentMonthKey],
  );

  const canGoPrev = currentMonthIndex > 0;
  const canGoNext =
    currentMonthIndex >= 0 && currentMonthIndex < monthsWithData.length - 1;

  const todayMonthKey = useMemo(() => monthKeyFromDate(new Date()), []);
  const canGoToday = monthsWithData.includes(todayMonthKey);
  const isOnTodayMonth = currentMonthKey === todayMonthKey;

  const cells = useMemo(() => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startWeekday = firstDay.getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const monthDays = Array.from({ length: totalDays }, (_, idx) =>
      new Date(year, month, idx + 1),
    );

    const leading = Array.from({ length: startWeekday }, () => null);
    const rawCells = [...leading, ...monthDays];
    const remainder = rawCells.length % 7;
    const trailing = remainder === 0 ? 0 : 7 - remainder;
    return [...rawCells, ...Array.from({ length: trailing }, () => null)];
  }, [monthDate]);

  const recordMap = useMemo(() => {
    const map = new Map();
    (records || []).forEach((record) => {
      if (record?.date) map.set(record.date, record);
    });
    return map;
  }, [records]);

  const todayDate = useMemo(() => {
    if (!todayKey) return null;
    const [year, month, day] = todayKey.split("-").map(Number);
    if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
      return null;
    }
    return new Date(year, month - 1, day);
  }, [todayKey]);

  const goToMonthByIndex = (index) => {
    if (!onMonthChange || index < 0 || index >= monthsWithData.length) return;
    onMonthChange(dateFromMonthKey(monthsWithData[index]));
  };

  const handleToday = () => {
    if (!onMonthChange || !canGoToday) return;
    onMonthChange(dateFromMonthKey(todayMonthKey));
  };

  const navButtonClass = (enabled) =>
    `px-2.5 py-1.5 transition-colors ${
      enabled
        ? "text-slate-400 hover:text-white"
        : "cursor-not-allowed text-slate-600 opacity-40"
    }`;

  return (
    <GlassCard padding="20px" className="flex h-full min-h-[520px] flex-col">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ background: "rgba(59, 130, 246, 0.15)" }}
          >
            <CalendarDays size={16} className="text-blue-400" />
          </div>
          <span className="text-lg font-semibold tracking-wide text-white">
            {monthLabel}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToday}
            disabled={!canGoToday || isOnTodayMonth}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              canGoToday && !isOnTodayMonth
                ? "text-slate-300 hover:text-white"
                : "cursor-not-allowed text-slate-600 opacity-40"
            }`}
            style={{
              border: "1px solid rgba(255, 255, 255, 0.1)",
              background: "rgba(15, 23, 42, 0.5)",
            }}
          >
            Today
          </button>
          <div
            className="flex items-center overflow-hidden rounded-lg"
            style={{ border: "1px solid rgba(255, 255, 255, 0.1)" }}
          >
            <button
              type="button"
              onClick={() => goToMonthByIndex(currentMonthIndex - 1)}
              disabled={!canGoPrev}
              className={navButtonClass(canGoPrev)}
              aria-label="Previous month with data"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="h-6 w-px bg-white/10" />
            <button
              type="button"
              onClick={() => goToMonthByIndex(currentMonthIndex + 1)}
              disabled={!canGoNext}
              className={navButtonClass(canGoNext)}
              aria-label="Next month with data"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="mb-1 grid grid-cols-7 border-b border-white/[0.06] pb-2 text-xs font-semibold uppercase tracking-widest text-slate-500 sm:text-[13px]">
        {WEEKDAYS.map((day) => (
          <div key={day} className="text-center">
            {day}
          </div>
        ))}
      </div>

      {monthsWithData.length === 0 && !isLoading ? (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-white/[0.06] bg-[#0d1219]/60 p-6 text-center text-base text-slate-500">
          No attendance records yet. Log your first day to see the calendar.
        </div>
      ) : (
        <div className="grid flex-1 grid-cols-7 auto-rows-fr gap-px overflow-hidden rounded-lg border border-white/[0.06] bg-white/[0.04]">
          {cells.map((date, index) => {
            if (!date) {
              return (
                <div
                  key={`empty-${index}`}
                  className="min-h-[88px] bg-[#0d1219]/60"
                />
              );
            }

            const dateKey = toDateKey(date);
            const record = recordMap.get(dateKey);
            const statusMeta = getStatusMeta(record?.status);
            const hoursText = formatHours(record?.totalHours);
            const isToday = todayKey === dateKey;
            const isFuture =
              todayDate &&
              date.getTime() >
                new Date(
                  todayDate.getFullYear(),
                  todayDate.getMonth(),
                  todayDate.getDate(),
                ).getTime();

            const statusColor = statusMeta?.color ?? "#64748b";
            const statusLabel = statusMeta?.label ?? (isFuture ? "" : "No Entry");

            return (
              <div
                key={dateKey}
                className="flex min-h-[88px] flex-col justify-between bg-[#0d1219]/80 p-2.5"
              >
                <div className="flex items-start">
                  {isToday ? (
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white"
                      style={{ background: "#3b82f6" }}
                    >
                      {date.getDate()}
                    </span>
                  ) : (
                    <span className="text-sm font-medium text-slate-400">
                      {date.getDate()}
                    </span>
                  )}
                </div>

                {hoursText ? (
                  <span className="text-[15px] font-semibold text-white/90">
                    {hoursText}
                  </span>
                ) : (
                  <span className="text-[15px] text-transparent select-none">—</span>
                )}

                <div className="flex items-center gap-1 truncate">
                  {!isFuture && (
                    <>
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ background: statusColor }}
                      />
                      <span
                        className="truncate text-xs font-medium sm:text-[13px]"
                        style={{ color: statusColor }}
                      >
                        {statusLabel}
                      </span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400 sm:text-[13px]">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          Regular Day
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
          Half Day
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          Leave
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
          Absent
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
          No Entry
        </span>
      </div>

      {isLoading ? (
        <p className="mt-2 text-sm text-slate-500">Loading calendar…</p>
      ) : null}
    </GlassCard>
  );
}
