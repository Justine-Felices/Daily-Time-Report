"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { STATUS_OPTIONS } from "@/lib/dtr-constants";

const INPUT_STYLE = {
  width: "100%",
  border: "1px solid rgba(148,163,184,0.35)",
  background: "rgba(255,255,255,0.9)",
  borderRadius: "12px",
  padding: "10px 12px",
  color: "#1E293B",
  fontSize: "14px",
  fontWeight: 500,
  fontFamily: "'Inter',sans-serif",
  outline: "none",
};

function displayTimeToInputTime(value) {
  if (!value || typeof value !== "string") return "";
  const match = value.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return "";

  let hour = Number.parseInt(match[1], 10);
  const minute = match[2];
  const period = match[3].toUpperCase();

  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;

  return `${String(hour).padStart(2, "0")}:${minute}`;
}

function toMinutes(timeValue) {
  if (!timeValue) return null;
  const [hours, minutes] = timeValue.split(":").map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
  return hours * 60 + minutes;
}

export default function HistoryDetailsDrawer({
  isOpen,
  onClose,
  record,
  isPending = false,
  onSave,
  onDelete,
}) {
  const [workDate, setWorkDate] = useState("");
  const [amIn, setAmIn] = useState("");
  const [amOut, setAmOut] = useState("");
  const [pmIn, setPmIn] = useState("");
  const [pmOut, setPmOut] = useState("");
  const [status, setStatus] = useState(STATUS_OPTIONS[0]);
  const [totalHours, setTotalHours] = useState("0");
  const [note, setNote] = useState("");
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    if (!isOpen || !record) return;

    setWorkDate(record.date || "");
    setAmIn(displayTimeToInputTime(record.amIn));
    setAmOut(displayTimeToInputTime(record.amOut));
    setPmIn(displayTimeToInputTime(record.pmIn));
    setPmOut(displayTimeToInputTime(record.pmOut));
    setStatus(record.status || STATUS_OPTIONS[0]);
    setTotalHours(String(Number(record.totalHours || 0)));
    setNote(record.note || "");
    setErrorText("");
  }, [isOpen, record]);

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

  const validationMessage = useMemo(() => {
    if (!workDate) return "Date is required.";

    const amInMinutes = toMinutes(amIn);
    const amOutMinutes = toMinutes(amOut);
    const pmInMinutes = toMinutes(pmIn);
    const pmOutMinutes = toMinutes(pmOut);

    if (amInMinutes !== null && amOutMinutes !== null && amOutMinutes <= amInMinutes) {
      return "AM Out must be later than AM In.";
    }

    if (pmInMinutes !== null && pmOutMinutes !== null && pmOutMinutes <= pmInMinutes) {
      return "PM Out must be later than PM In.";
    }

    if (amOutMinutes !== null && pmInMinutes !== null && pmInMinutes < amOutMinutes) {
      return "PM In cannot be earlier than AM Out.";
    }

    const parsedTotal = Number(totalHours);
    if (!Number.isFinite(parsedTotal) || parsedTotal < 0) {
      return "Total hours must be a valid non-negative number.";
    }

    return "";
  }, [workDate, amIn, amOut, pmIn, pmOut, totalHours]);

  const isActionDisabled = Boolean(validationMessage) || isPending;

  const handleSave = async () => {
    if (!onSave || !record?.id) return;
    if (validationMessage) {
      setErrorText(validationMessage);
      return;
    }

    setErrorText("");

    const result = await onSave({
      id: record.id,
      workDate,
      amIn: amIn || null,
      amOut: amOut || null,
      pmIn: pmIn || null,
      pmOut: pmOut || null,
      status,
      note,
      totalHours: Number(totalHours) || 0,
    });

    if (result?.ok) {
      onClose();
      return;
    }

    setErrorText(result?.message || "Failed to save changes.");
  };

  const handleDelete = async () => {
    if (!onDelete || !record?.id || isPending) return;

    const confirmed = window.confirm(
      "Delete this entry permanently? This action cannot be undone.",
    );
    if (!confirmed) return;

    setErrorText("");
    const result = await onDelete(record.id);

    if (result?.ok) {
      onClose();
      return;
    }

    setErrorText(result?.message || "Failed to delete entry.");
  };

  const renderedDate = useMemo(() => {
    if (!workDate) return { day: "--", month: "---" };
    const dateObject = new Date(`${workDate}T12:00:00`);
    return {
      day: dateObject.getDate(),
      month: dateObject
        .toLocaleDateString("en-US", { month: "short" })
        .toUpperCase(),
    };
  }, [workDate]);

  const formattedDateLabel = useMemo(() => {
    if (!workDate) return "Set date";
    const dateObject = new Date(`${workDate}T12:00:00`);
    return dateObject.toLocaleDateString("en-US", {
      weekday: "short",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }, [workDate]);

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
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              aria-label="Back"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl sm:hidden"
              style={{
                color: "#1E293B",
                background: "rgba(148,163,184,0.12)",
                border: "1px solid rgba(148,163,184,0.2)",
              }}
            >
              <ArrowLeft size={18} strokeWidth={2.2} />
            </button>
            <div
              style={{
                color: "#1E293B",
                fontSize: "14px",
                fontWeight: 600,
                letterSpacing: "0.01em",
                fontFamily: "'Inter',sans-serif",
              }}
            >
              Edit Details
            </div>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={isActionDisabled}
            className="rounded-xl px-3 py-2"
            style={{
              background: isActionDisabled
                ? "rgba(148,163,184,0.2)"
                : "linear-gradient(135deg,#069494,#00B4B4)",
              border: "1px solid rgba(6,148,148,0.2)",
              color: isActionDisabled ? "#64748B" : "#FFFFFF",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.01em",
              fontFamily: "'Inter',sans-serif",
            }}
          >
            {isPending ? "Saving..." : "Save Changes"}
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
                className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl"
                style={{
                  background: "rgba(6,148,148,0.1)",
                  border: "1px solid rgba(6,148,148,0.16)",
                }}
              >
                <div
                  style={{
                    color: "#334155",
                    fontSize: "18px",
                    fontWeight: 700,
                    fontFamily: "'Inter',sans-serif",
                    lineHeight: 1,
                  }}
                >
                  {renderedDate.day}
                </div>
                <div
                  style={{
                    color: "#64748B",
                    fontSize: "9px",
                    fontWeight: 700,
                    fontFamily: "'Inter',sans-serif",
                    letterSpacing: "0.06em",
                  }}
                >
                  {renderedDate.month}
                </div>
              </div>

              <div>
                <div
                  style={{
                    color: "#64748B",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    fontFamily: "'Inter',sans-serif",
                    textTransform: "uppercase",
                  }}
                >
                  Entry Date
                </div>
                <div
                  style={{
                    color: "#1E293B",
                    fontSize: "clamp(14px, 1.8vw, 16px)",
                    fontWeight: 600,
                    fontFamily: "'Inter',sans-serif",
                    lineHeight: 1.25,
                    marginTop: "4px",
                  }}
                >
                  {formattedDateLabel}
                </div>
              </div>
            </div>

            <div
              style={{
                color: Number(totalHours) > 0 ? "#0E7A7A" : "#94A3B8",
                fontSize: "clamp(22px, 2.2vw, 30px)",
                fontWeight: 600,
                fontFamily: "'Inter',sans-serif",
                lineHeight: 1,
              }}
            >
              {Number(totalHours || 0)}h
            </div>
          </div>

          <div className="my-3 h-px bg-slate-200" />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label>
              <div
                style={{
                  color: "#334155",
                  fontSize: "12px",
                  fontWeight: 700,
                  fontFamily: "'Inter',sans-serif",
                  marginBottom: "6px",
                }}
              >
                Date
              </div>
              <input
                type="date"
                value={workDate}
                onChange={(event) => setWorkDate(event.target.value)}
                style={INPUT_STYLE}
              />
            </label>

            <label>
              <div
                style={{
                  color: "#334155",
                  fontSize: "12px",
                  fontWeight: 700,
                  fontFamily: "'Inter',sans-serif",
                  marginBottom: "6px",
                }}
              >
                Status
              </div>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                style={INPUT_STYLE}
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <div
                style={{
                  color: "#334155",
                  fontSize: "12px",
                  fontWeight: 700,
                  fontFamily: "'Inter',sans-serif",
                  marginBottom: "6px",
                }}
              >
                AM In
              </div>
              <input
                type="time"
                value={amIn}
                onChange={(event) => setAmIn(event.target.value)}
                style={INPUT_STYLE}
              />
            </label>

            <label>
              <div
                style={{
                  color: "#334155",
                  fontSize: "12px",
                  fontWeight: 700,
                  fontFamily: "'Inter',sans-serif",
                  marginBottom: "6px",
                }}
              >
                AM Out
              </div>
              <input
                type="time"
                value={amOut}
                onChange={(event) => setAmOut(event.target.value)}
                style={INPUT_STYLE}
              />
            </label>

            <label>
              <div
                style={{
                  color: "#334155",
                  fontSize: "12px",
                  fontWeight: 700,
                  fontFamily: "'Inter',sans-serif",
                  marginBottom: "6px",
                }}
              >
                PM In
              </div>
              <input
                type="time"
                value={pmIn}
                onChange={(event) => setPmIn(event.target.value)}
                style={INPUT_STYLE}
              />
            </label>

            <label>
              <div
                style={{
                  color: "#334155",
                  fontSize: "12px",
                  fontWeight: 700,
                  fontFamily: "'Inter',sans-serif",
                  marginBottom: "6px",
                }}
              >
                PM Out
              </div>
              <input
                type="time"
                value={pmOut}
                onChange={(event) => setPmOut(event.target.value)}
                style={INPUT_STYLE}
              />
            </label>

            <label className="sm:col-span-2">
              <div
                style={{
                  color: "#334155",
                  fontSize: "12px",
                  fontWeight: 700,
                  fontFamily: "'Inter',sans-serif",
                  marginBottom: "6px",
                }}
              >
                Total Hours
              </div>
              <input
                type="number"
                min="0"
                step="0.5"
                value={totalHours}
                onChange={(event) => setTotalHours(event.target.value)}
                style={INPUT_STYLE}
              />
            </label>

            <label className="sm:col-span-2">
              <div
                style={{
                  color: "#334155",
                  fontSize: "12px",
                  fontWeight: 700,
                  fontFamily: "'Inter',sans-serif",
                  marginBottom: "6px",
                }}
              >
                Note
              </div>
              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                rows={3}
                style={{ ...INPUT_STYLE, resize: "vertical" }}
              />
            </label>
          </div>

          {validationMessage ? (
            <div
              className="mt-3 rounded-xl px-3 py-2"
              style={{
                background: "rgba(245,158,11,0.12)",
                border: "1px solid rgba(245,158,11,0.24)",
                color: "#92400E",
                fontSize: "12px",
                fontWeight: 600,
                fontFamily: "'Inter',sans-serif",
              }}
            >
              {validationMessage}
            </div>
          ) : null}

          {errorText ? (
            <div
              className="mt-3 rounded-xl px-3 py-2"
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.25)",
                color: "#B91C1C",
                fontSize: "12px",
                fontWeight: 600,
                fontFamily: "'Inter',sans-serif",
              }}
            >
              {errorText}
            </div>
          ) : null}

          <div className="my-3 h-px bg-slate-200" />

          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="w-full rounded-2xl px-4 py-3"
            style={{
              background: isPending
                ? "rgba(148,163,184,0.14)"
                : "rgba(239,68,68,0.12)",
              border: isPending
                ? "1px solid rgba(148,163,184,0.22)"
                : "1px solid rgba(239,68,68,0.22)",
              color: isPending ? "#64748B" : "#BE123C",
              fontSize: "15px",
              fontWeight: 700,
              fontFamily: "'Inter',sans-serif",
              lineHeight: 1.1,
            }}
          >
            {isPending ? "Working..." : "Delete Entry"}
          </button>
        </div>
      </div>
    </div>
  );
}
