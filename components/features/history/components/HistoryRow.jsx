"use client";

import { useState } from "react";
import HistoryDetailsDrawer from "@/components/features/history/components/HistoryDetailsDrawer";
import { SkeletonBlock } from "@/components/ui/Skeleton";
import { CheckCircle2, XCircle, AlertCircle, Clock } from "lucide-react";

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

function getDisplayTimes(record) {
  const startCandidates = [record.amIn, record.pmIn]
    .map(toMinutesFromDisplayTime)
    .filter((value) => value !== null);

  const endCandidates = [record.pmOut, record.amOut]
    .map(toMinutesFromDisplayTime)
    .filter((value) => value !== null);

  const firstIn = startCandidates.length > 0 ? Math.min(...startCandidates) : null;
  const lastOut = endCandidates.length > 0 ? Math.max(...endCandidates) : null;

  return {
    firstIn: firstIn !== null ? toCompactDisplay(firstIn) : "--",
    lastOut: lastOut !== null ? toCompactDisplay(lastOut) : "--",
  };
}

export default function HistoryRow({
  record,
  isLoading = false,
  isPending = false,
  onSaveRecord,
  onDeleteRecord,
}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const dateObject = !isLoading
    ? new Date(`${record.date}T12:00:00`)
    : new Date();
  const dateDay = !isLoading ? dateObject.getDate() : "--";
  const dateMonth = !isLoading
    ? dateObject.toLocaleDateString("en-US", { month: "short" }).toUpperCase()
    : "---";
  const dateYear = !isLoading ? dateObject.getFullYear() : "";
  const dayName = !isLoading
    ? dateObject.toLocaleDateString("en-US", { weekday: "short" })
    : "---";

  const { firstIn, lastOut } = !isLoading
    ? getDisplayTimes(record)
    : { firstIn: "--", lastOut: "--" };

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <>
      <tr
        onClick={isLoading || isPending ? undefined : openDrawer}
        className="group transition-colors cursor-pointer border-b border-white/10 last:border-b-0 hover:bg-white/5"
      >
        <td className="pl-4 py-4">
          <div className="flex items-center gap-3">
            {/* Date Indicator Group */}
            <div 
              className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl text-center border border-white/5"
              style={{
                background: "#0891B2",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
              }}
            >
              <div style={{ color: "#FFFFFF", fontSize: "20px", fontWeight: 800, lineHeight: 1, letterSpacing: "-0.02em" }}>
                {dateDay}
              </div>
              <div style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "9px", fontWeight: 800, lineHeight: 1, letterSpacing: "0.12em", marginTop: "2px", textTransform: "uppercase" }}>
                {dateMonth}
              </div>
            </div>

            {/* Combined Details Group */}
            <div className="flex flex-col items-start text-left ml-1">
              {isLoading ? (
                <div className="space-y-2">
                  <SkeletonBlock className="h-5 w-48 rounded-md" />
                  <SkeletonBlock className="h-4 w-32 rounded-md opacity-40" />
                </div>
              ) : (
                <>
                  <div 
                    className="text-[18px] font-bold text-slate-100 tracking-tight leading-tight"
                    style={{ fontFamily: "var(--font-geist-sans), Inter, sans-serif" }}
                  >
                    {dayName}, {dateMonth.charAt(0) + dateMonth.slice(1).toLowerCase()} {dateDay}, {dateYear}
                  </div>
                  <div 
                    className="text-[14px] font-medium text-slate-500 mt-1"
                    style={{ fontFamily: "var(--font-geist-sans), Inter, sans-serif" }}
                  >
                    {firstIn.toLowerCase()} - {lastOut.toLowerCase()}
                  </div>
                </>
              )}
            </div>
          </div>
        </td>

        {/* Total Hours Cell - Sibling */}
        <td className="py-4 pr-6 text-right w-[120px]">
          <div className="flex flex-col items-end">
            {isLoading ? (
              <SkeletonBlock className="h-8 w-20 rounded-md opacity-40" />
            ) : (
              <div 
                className="text-[24px] font-semibold text-cyan-400 tracking-tighter leading-none"
                style={{ fontFamily: "var(--font-geist-sans), Inter, sans-serif" }}
              >
                {Number(parseFloat(record.totalHours || 0).toFixed(2))}hrs
              </div>
            )}
          </div>
        </td>
      </tr>

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
