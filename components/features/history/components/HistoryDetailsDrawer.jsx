"use client";

import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { formatHistoryDate } from "@/lib/dtr-formatters";

export default function HistoryDetailsDrawer({
  isOpen,
  onClose,
  record,
  rangeLabel,
  dateDay,
  dateMonth,
  statusColors,
}) {
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 px-3 pb-3 sm:px-4 sm:pb-4"
      role="dialog"
      aria-modal="true"
      aria-label="History entry details"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl rounded-3xl border px-4 pb-4 pt-3 sm:px-6 sm:pb-6"
        style={{
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderColor: "rgba(6,148,148,0.15)",
          boxShadow: "0 20px 52px rgba(15,23,42,0.25)",
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-xl px-2.5 py-1.5"
            style={{
              color: "#1E293B",
              fontSize: "16px",
              fontWeight: 700,
              fontFamily: "'Inter',sans-serif",
            }}
          >
            <ArrowLeft size={20} strokeWidth={2.2} />
            Details
          </button>
        </div>

        <div
          className="rounded-2xl border p-4 sm:p-5"
          style={{
            background: "rgba(255,255,255,0.82)",
            borderColor: "rgba(148,163,184,0.18)",
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl"
                style={{
                  background: "rgba(6,148,148,0.1)",
                  border: "1px solid rgba(6,148,148,0.16)",
                }}
              >
                <div
                  style={{
                    color: "#334155",
                    fontSize: "24px",
                    fontWeight: 800,
                    fontFamily: "'Inter',sans-serif",
                    lineHeight: 1,
                  }}
                >
                  {dateDay}
                </div>
                <div
                  style={{
                    color: "#64748B",
                    fontSize: "10px",
                    fontWeight: 700,
                    fontFamily: "'Inter',sans-serif",
                    letterSpacing: "0.06em",
                  }}
                >
                  {dateMonth}
                </div>
              </div>

              <div>
                <div
                  style={{
                    color: "#1E293B",
                    fontSize: "clamp(20px, 2.2vw, 30px)",
                    fontWeight: 700,
                    fontFamily: "'Inter',sans-serif",
                    lineHeight: 1.1,
                  }}
                >
                  {formatHistoryDate(record.date)}
                </div>
                <div
                  style={{
                    color: "#334155",
                    fontSize: "clamp(18px, 2vw, 28px)",
                    fontWeight: 500,
                    fontFamily: "'Inter',sans-serif",
                    marginTop: "2px",
                  }}
                >
                  {rangeLabel}
                </div>
              </div>
            </div>

            <div
              style={{
                color: "#0E7A7A",
                fontSize: "clamp(26px, 2.5vw, 40px)",
                fontWeight: 700,
                fontFamily: "'Inter',sans-serif",
                lineHeight: 1,
              }}
            >
              {record.totalHours}h
            </div>
          </div>

          <div className="my-3 h-px bg-slate-200" />

          <div>
            <div
              style={{
                color: "#1E293B",
                fontSize: "16px",
                fontWeight: 700,
                fontFamily: "'Inter',sans-serif",
              }}
            >
              Note
            </div>
            <div
              style={{
                color: "#475569",
                fontSize: "14px",
                fontWeight: 500,
                fontFamily: "'Inter',sans-serif",
                marginTop: "4px",
              }}
            >
              {record.note?.trim() || "No note"}
            </div>
          </div>

          <div className="my-3 h-px bg-slate-200" />

          <div>
            <div
              style={{
                color: "#1E293B",
                fontSize: "16px",
                fontWeight: 700,
                fontFamily: "'Inter',sans-serif",
              }}
            >
              AM
            </div>
            <div
              style={{
                color: "#1E293B",
                fontSize: "clamp(16px, 2vw, 20px)",
                fontWeight: 500,
                fontFamily: "'Inter',sans-serif",
                marginTop: "4px",
              }}
            >
              {record.amIn || "--"} {"->"} {record.amOut || "--"}
            </div>
          </div>

          <div className="my-3 h-px bg-slate-200" />

          <div>
            <div
              style={{
                color: "#1E293B",
                fontSize: "16px",
                fontWeight: 700,
                fontFamily: "'Inter',sans-serif",
              }}
            >
              PM
            </div>
            <div
              style={{
                color: "#1E293B",
                fontSize: "clamp(16px, 2vw, 20px)",
                fontWeight: 500,
                fontFamily: "'Inter',sans-serif",
                marginTop: "4px",
              }}
            >
              {record.pmIn || "--"} {"->"} {record.pmOut || "--"}
            </div>
          </div>

          <div className="my-3 h-px bg-slate-200" />

          <div className="flex items-center justify-between gap-3">
            <div
              style={{
                color: "#475569",
                fontSize: "14px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                fontFamily: "'Inter',sans-serif",
              }}
            >
              HRS
            </div>

            <div
              style={{
                color: record.totalHours > 0 ? "#0E7A7A" : "#94A3B8",
                fontSize: "clamp(24px, 3vw, 34px)",
                fontWeight: 700,
                fontFamily: "'Inter',sans-serif",
                lineHeight: 1,
              }}
            >
              {record.totalHours}h
            </div>
          </div>

          <div className="my-3 h-px bg-slate-200" />

          <div className="flex items-center justify-between gap-3">
            <div
              style={{
                color: "#475569",
                fontSize: "14px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                fontFamily: "'Inter',sans-serif",
              }}
            >
              STATUS
            </div>

            <span
              className="rounded-full px-4 py-1.5"
              style={{
                background: statusColors.bg,
                color: statusColors.color,
                fontSize: "14px",
                fontWeight: 600,
                fontFamily: "'Inter',sans-serif",
                lineHeight: 1,
              }}
            >
              {record.status}
            </span>
          </div>

          <div className="my-3 h-px bg-slate-200" />

          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-2xl px-4 py-3"
            style={{
              background: "rgba(239,68,68,0.12)",
              border: "1px solid rgba(239,68,68,0.22)",
              color: "#BE123C",
              fontSize: "15px",
              fontWeight: 700,
              fontFamily: "'Inter',sans-serif",
              lineHeight: 1.1,
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
