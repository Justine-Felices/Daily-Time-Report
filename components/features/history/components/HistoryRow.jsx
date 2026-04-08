"use client";

import { useState } from "react";
import { formatHistoryDate } from "@/lib/dtr-formatters";
import HistoryDetailsDrawer from "@/components/features/history/components/HistoryDetailsDrawer";
import { SkeletonBlock } from "@/components/ui/Skeleton";

function toMinutesFromDisplayTime(value) {
  if (!value || typeof value !== "string") return null;
  const match = value.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;

  let hours = Number.parseInt(match[1], 10);
  const minutes = Number.parseInt(match[2], 10);
  const period = match[3].toUpperCase();

  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
  if (hours < 1 || hours > 12 || minutes < 0 || minutes > 59) return null;

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

function toCompactDisplay(minutes) {
  if (minutes === null || typeof minutes !== "number") return "--";
  const safeMinutes = Math.max(0, Math.min(minutes, 23 * 60 + 59));
  const hour24 = Math.floor(safeMinutes / 60);
  const minute = safeMinutes % 60;
  const period = hour24 >= 12 ? "pm" : "am";
  const hour12 = hour24 % 12 || 12;
  return `${hour12}:${minute.toString().padStart(2, "0")} ${period}`;
}

function computeRange(record) {
  const allTimes = [record.amIn, record.amOut, record.pmIn, record.pmOut]
    .map(toMinutesFromDisplayTime)
    .filter((value) => value !== null);

  if (allTimes.length === 0) {
    return "No time logs";
  }

  const startCandidates = [record.amIn, record.pmIn]
    .map(toMinutesFromDisplayTime)
    .filter((value) => value !== null);

  const endCandidates = [record.pmOut, record.amOut]
    .map(toMinutesFromDisplayTime)
    .filter((value) => value !== null);

  const firstIn =
    startCandidates.length > 0
      ? Math.min(...startCandidates)
      : Math.min(...allTimes);
  const lastOut =
    endCandidates.length > 0
      ? Math.max(...endCandidates)
      : Math.max(...allTimes);

  if (lastOut < firstIn) {
    return toCompactDisplay(firstIn);
  }

  return `${toCompactDisplay(firstIn)} - ${toCompactDisplay(lastOut)}`;
}

export default function HistoryRow({
  record,
  isLoading = false,
  isPending = false,
  onSaveRecord,
  onDeleteRecord,
}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const rangeLabel = isLoading ? "" : computeRange(record);
  const dateObject = !isLoading
    ? new Date(`${record.date}T12:00:00`)
    : new Date();
  const dateDay = !isLoading ? dateObject.getDate() : "--";
  const dateMonth = !isLoading
    ? dateObject.toLocaleDateString("en-US", { month: "short" }).toUpperCase()
    : "---";

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <>
      <button
        type="button"
        className="rounded-2xl p-4 transition-all"
        style={{
          background: "rgba(255,255,255,0.68)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          border: "1.5px solid rgba(6,148,148,0.16)",
          boxShadow:
            "0 4px 16px rgba(6,148,148,0.08), inset 0 1px 0 rgba(255,255,255,0.92)",
          cursor: "pointer",
          width: "100%",
          textAlign: "left",
        }}
        onClick={isLoading || isPending ? undefined : openDrawer}
        onMouseEnter={(event) => {
          if (isLoading) return;
          event.currentTarget.style.background = "rgba(255,255,255,0.86)";
          event.currentTarget.style.borderColor = "rgba(6,148,148,0.24)";
          event.currentTarget.style.boxShadow =
            "0 8px 26px rgba(6,148,148,0.12), inset 0 1px 0 rgba(255,255,255,1)";
        }}
        onMouseLeave={(event) => {
          if (isLoading) return;
          event.currentTarget.style.background = "rgba(255,255,255,0.68)";
          event.currentTarget.style.borderColor = "rgba(6,148,148,0.16)";
          event.currentTarget.style.boxShadow =
            "0 4px 16px rgba(6,148,148,0.08), inset 0 1px 0 rgba(255,255,255,0.92)";
        }}
        disabled={isLoading || isPending}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-md sm:h-12 sm:w-12 bg-[#27A5AA]">
              <div
                style={{
                  color: "#ECFEFF",
                  fontSize: "20px",
                  fontWeight: 800,
                  fontFamily: "'Inter',sans-serif",
                  lineHeight: 1.3,
                }}
              >
                {dateDay}
              </div>
              <div
                style={{
                  color: "rgba(236,254,255,0.92)",
                  fontSize: "10px",
                  fontWeight: 700,
                  fontFamily: "'Inter',sans-serif",
                  lineHeight: 1,
                  letterSpacing: "0.08em",
                }}
              >
                {dateMonth}
              </div>
            </div>

            <div className="min-w-0">
              {isLoading ? (
                <div className="space-y-1">
                  <SkeletonBlock className="h-3.5 w-36 rounded-md" />
                  <SkeletonBlock className="h-3 w-28 rounded-md" />
                </div>
              ) : (
                <>
                  <div
                    style={{
                      color: "#334155",
                      fontSize: "clamp(14px, 1.8vw, 14px)",
                      fontWeight: 700,
                      fontFamily: "'Inter',sans-serif",
                      lineHeight: 1.08,
                    }}
                  >
                    {formatHistoryDate(record.date)}
                  </div>
                  <div
                    style={{
                      color: "#475569",
                      fontSize: "clamp(13px, 1.6vw, 13px)",
                      fontWeight: 500,
                      fontFamily: "'Inter',sans-serif",
                      marginTop: "2px",
                      lineHeight: 1.15,
                    }}
                  >
                    {rangeLabel}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {isLoading ? (
              <SkeletonBlock className="h-6 w-14 rounded-full" />
            ) : (
              <div
                className="text-right"
                style={{
                  color: record.totalHours > 0 ? "#0E7A7A" : "#94A3B8",
                  fontSize: "clamp(18px, 2.2vw, 18px)",
                  fontWeight: 600,
                  fontFamily: "'Inter',sans-serif",
                  lineHeight: 1,
                }}
              >
                {record.totalHours}hrs
              </div>
            )}
          </div>
        </div>
      </button>

      {!isLoading ? (
        <HistoryDetailsDrawer
          isOpen={isDrawerOpen}
          onClose={closeDrawer}
          record={record}
          isPending={isPending}
          onSave={onSaveRecord}
          onDelete={onDeleteRecord}
        />
      ) : null}
    </>
  );
}
