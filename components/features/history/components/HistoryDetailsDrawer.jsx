"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, X, Calendar, Clock, Info } from "lucide-react";
import { STATUS_OPTIONS } from "@/lib/dtr-constants";
import { calculateTotalHours } from "@/lib/dtr-time-validation";
import GlassCard from "@/components/ui/cards/GlassCard";

const INPUT_STYLE = {
  width: "100%",
  padding: "14px 18px",
  borderRadius: "16px",
  background: "rgba(255, 255, 255, 0.03)",
  border: "1px solid var(--border-soft)",
  color: "var(--text-primary)",
  fontSize: "14px",
  fontWeight: "600",
  fontFamily: "'Inter', sans-serif",
  outline: "none",
  transition: "all 0.2s ease",
};

const LABEL_STYLE = {
  color: "var(--text-muted)",
  fontSize: "10px",
  fontWeight: 900,
  fontFamily: "'Inter', sans-serif",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  marginBottom: "4px",
  display: "block",
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
  const [otIn, setOtIn] = useState("");
  const [otOut, setOtOut] = useState("");
  const [status, setStatus] = useState(STATUS_OPTIONS[0]);
  const [totalHours, setTotalHours] = useState("0");
  const [note, setNote] = useState("");
  const [errorText, setErrorText] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!isOpen || !record) return;

    setWorkDate(record.date || "");
    setAmIn(displayTimeToInputTime(record.amIn));
    setAmOut(displayTimeToInputTime(record.amOut));
    setPmIn(displayTimeToInputTime(record.pmIn));
    setPmOut(displayTimeToInputTime(record.pmOut));
    setOtIn(displayTimeToInputTime(record.otIn));
    setOtOut(displayTimeToInputTime(record.otOut));
    setStatus(record.status || STATUS_OPTIONS[0]);
    setTotalHours(String(Number(record.totalHours || 0)));
    setNote(record.note || "");
    setErrorText("");
    setShowDeleteConfirm(false);
  }, [isOpen, record]);

  // Auto-calculate hours when time fields change
  useEffect(() => {
    if (!isOpen) return;

    const calculated = calculateTotalHours({
      amIn: amIn || null,
      amOut: amOut || null,
      pmIn: pmIn || null,
      pmOut: pmOut || null,
      otIn: otIn || null,
      otOut: otOut || null,
    });

    setTotalHours(String(calculated));
  }, [isOpen, amIn, amOut, pmIn, pmOut, otIn, otOut]);

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
    const otInMinutes = toMinutes(otIn);
    const otOutMinutes = toMinutes(otOut);

    if (
      amInMinutes !== null &&
      amOutMinutes !== null &&
      amOutMinutes <= amInMinutes
    ) {
      return "AM Out must be later than AM In.";
    }

    if (
      pmInMinutes !== null &&
      pmOutMinutes !== null &&
      pmOutMinutes <= pmInMinutes
    ) {
      return "PM Out must be later than PM In.";
    }

    if (
      amOutMinutes !== null &&
      pmInMinutes !== null &&
      pmInMinutes < amOutMinutes
    ) {
      return "PM In cannot be earlier than AM Out.";
    }

    if (
      otInMinutes !== null &&
      otOutMinutes !== null &&
      otOutMinutes <= otInMinutes
    ) {
      return "OT Out must be later than OT In.";
    }

    if (
      pmOutMinutes !== null &&
      otInMinutes !== null &&
      otInMinutes < pmOutMinutes
    ) {
      return "OT In cannot be earlier than PM Out.";
    }

    const parsedTotal = Number(totalHours);
    if (!Number.isFinite(parsedTotal) || parsedTotal < 0) {
      return "Total hours must be a valid non-negative number.";
    }

    return "";
  }, [workDate, amIn, amOut, pmIn, pmOut, otIn, otOut, totalHours]);

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
      otIn: otIn || null,
      otOut: otOut || null,
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

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 px-3 pb-3 sm:items-center sm:px-4 sm:pb-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label="History entry details"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-[32px] border px-6 pb-6 pt-5 sm:px-7 sm:pb-7 max-h-[92vh] overflow-y-auto custom-scrollbar animate-in zoom-in-95 duration-200"
        style={{
          background: "var(--surface-card)",
          backdropFilter: "blur(40px) saturate(180%)",
          WebkitBackdropFilter: "blur(40px) saturate(180%)",
          borderColor: "var(--border-soft)",
          boxShadow: "0 25px 80px -12px rgba(0, 0, 0, 0.6)",
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onClose}
              aria-label="Back"
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl transition-all active:scale-90 hover:bg-white/5"
              style={{
                color: "var(--text-primary)",
                background: "var(--surface-muted)",
                border: "1px solid var(--border-soft)",
              }}
            >
              <ArrowLeft size={20} strokeWidth={2.5} />
            </button>
            <div>
              <div
                style={{
                  color: "var(--text-primary)",
                  fontSize: "18px",
                  fontWeight: 800,
                  fontFamily: "'Inter', sans-serif",
                  lineHeight: 1.1,
                }}
              >
                Edit Attendance
              </div>
              <div
                style={{
                  color: "var(--text-muted)",
                  fontSize: "11px",
                  fontWeight: 500,
                  marginTop: "3px",
                }}
              >
                Update record manual entries
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <button
              type="button"
              onClick={handleSave}
              disabled={isActionDisabled}
              className="rounded-xl px-5 py-2.5 transition-all active:scale-95 hover:brightness-110"
              style={{
                background: isActionDisabled
                  ? "rgba(148,163,184,0.1)"
                  : "var(--accent-strong)",
                color: isActionDisabled ? "var(--text-muted)" : "#FFFFFF",
                fontSize: "13px",
                fontWeight: 700,
                fontFamily: "'Inter', sans-serif",
                boxShadow: isActionDisabled
                  ? "none"
                  : "0 8px 24px rgba(59, 130, 246, 0.3)",
              }}
            >
              {isPending ? "SAVING..." : "SAVE CHANGES"}
            </button>

            {errorText && (
              <div
                className="flex items-center gap-1.5 text-right"
                style={{
                  color: "#ef4444",
                  fontSize: "10px",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.02em",
                }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                {errorText}
              </div>
            )}
          </div>
        </div>

        <div
          className="rounded-[24px] border p-6 sm:p-7"
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            borderColor: "var(--border-soft)",
          }}
        >
          <div className="flex items-start justify-between gap-5">
            <div className="flex items-center gap-5">
              <div
                className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-[20px]"
                style={{
                  background: "rgba(59, 130, 246, 0.15)",
                  border: "1.5px solid rgba(59, 130, 246, 0.25)",
                }}
              >
                <div
                  style={{
                    color: "var(--accent-strong)",
                    fontSize: "24px",
                    fontWeight: 900,
                    fontFamily: "'Inter', sans-serif",
                    lineHeight: 1,
                  }}
                >
                  {renderedDate.day}
                </div>
                <div
                  style={{
                    color: "var(--accent-strong)",
                    fontSize: "11px",
                    fontWeight: 800,
                    fontFamily: "'Inter', sans-serif",
                    letterSpacing: "0.08em",
                    opacity: 0.85,
                  }}
                >
                  {renderedDate.month}
                </div>
              </div>

              <div>
                <div
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "10px",
                    fontWeight: 900,
                    letterSpacing: "0.12em",
                    fontFamily: "'Inter', sans-serif",
                    textTransform: "uppercase",
                  }}
                >
                  RECORD DATE
                </div>
                <div
                  style={{
                    color: "var(--text-primary)",
                    fontSize: "18px",
                    fontWeight: 700,
                    fontFamily: "'Inter', sans-serif",
                    lineHeight: 1.25,
                    marginTop: "4px",
                  }}
                >
                  {formattedDateLabel}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div
                style={{
                  color: "var(--text-muted)",
                  fontSize: "10px",
                  fontWeight: 900,
                  letterSpacing: "0.12em",
                  fontFamily: "'Inter', sans-serif",
                  textTransform: "uppercase",
                  marginBottom: "6px",
                }}
              >
                TOTAL
              </div>
              <div
                style={{
                  color:
                    Number(totalHours) > 0
                      ? "var(--accent-strong)"
                      : "var(--text-muted)",
                  fontSize: "36px",
                  fontWeight: 900,
                  fontFamily: "'Inter', sans-serif",
                  lineHeight: 1,
                  letterSpacing: "-0.04em",
                }}
              >
                {totalHours}
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: 700,
                    marginLeft: "4px",
                    opacity: 0.5,
                  }}
                >
                  hrs
                </span>
              </div>
            </div>
          </div>

          <div
            className="my-6 h-px w-full"
            style={{ background: "var(--border-soft)" }}
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <label>
              <span style={LABEL_STYLE}>Date</span>
              <input
                type="date"
                value={workDate}
                onChange={(event) => setWorkDate(event.target.value)}
                style={INPUT_STYLE}
                className="focus:border-blue-500/50"
              />
            </label>

            <label>
              <span style={LABEL_STYLE}>Status</span>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                style={INPUT_STYLE}
                className="focus:border-blue-500/50 cursor-pointer"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option} className="bg-slate-900">
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span style={LABEL_STYLE}>AM In</span>
              <input
                type="time"
                value={amIn}
                onChange={(event) => setAmIn(event.target.value)}
                style={INPUT_STYLE}
                className="focus:border-blue-500/50"
              />
            </label>

            <label>
              <span style={LABEL_STYLE}>AM Out</span>
              <input
                type="time"
                value={amOut}
                onChange={(event) => setAmOut(event.target.value)}
                style={INPUT_STYLE}
                className="focus:border-blue-500/50"
              />
            </label>

            <label>
              <span style={LABEL_STYLE}>PM In</span>
              <input
                type="time"
                value={pmIn}
                onChange={(event) => setPmIn(event.target.value)}
                style={INPUT_STYLE}
                className="focus:border-blue-500/50"
              />
            </label>

            <label>
              <span style={LABEL_STYLE}>PM Out</span>
              <input
                type="time"
                value={pmOut}
                onChange={(event) => setPmOut(event.target.value)}
                style={INPUT_STYLE}
                className="focus:border-blue-500/50"
              />
            </label>

            <label>
              <span style={LABEL_STYLE}>OT In</span>
              <input
                type="time"
                value={otIn}
                onChange={(event) => setOtIn(event.target.value)}
                style={INPUT_STYLE}
                className="focus:border-blue-500/50"
              />
            </label>

            <label>
              <span style={LABEL_STYLE}>OT Out</span>
              <input
                type="time"
                value={otOut}
                onChange={(event) => setOtOut(event.target.value)}
                style={INPUT_STYLE}
                className="focus:border-blue-500/50"
              />
            </label>

            <label className="sm:col-span-2">
              <span style={LABEL_STYLE}>Note</span>
              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                rows={3}
                style={{ ...INPUT_STYLE, resize: "none" }}
                className="focus:border-blue-500/50"
                placeholder="Optional remarks..."
              />
            </label>
          </div>

          <div
            className="my-6 h-px w-full"
            style={{ background: "var(--border-soft)" }}
          />

          {!showDeleteConfirm ? (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isPending}
              className="w-full rounded-2xl px-4 py-4 transition-all active:scale-[0.98] group"
              style={{
                background: "rgba(239, 68, 68, 0.05)",
                border: "1.5px dashed rgba(239, 68, 68, 0.2)",
                color: "#ef4444",
                fontSize: "14px",
                fontWeight: 800,
                letterSpacing: "0.04em",
                fontFamily: "'Inter', sans-serif",
                textTransform: "uppercase",
              }}
            >
              {isPending ? "PROCESSING..." : "Delete Entry"}
            </button>
          ) : (
            <div
              className="rounded-2xl p-6 border animate-in zoom-in-95 duration-200"
              style={{
                background: "rgba(239, 68, 68, 0.08)",
                borderColor: "rgba(239, 68, 68, 0.2)",
              }}
            >
              <p
                style={{
                  color: "var(--text-primary)",
                  fontSize: "14px",
                  fontWeight: 700,
                  fontFamily: "'Inter', sans-serif",
                  marginBottom: "16px",
                  textAlign: "center",
                }}
              >
                Delete record permanently?
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 rounded-xl px-4 py-3 border transition-all active:scale-95"
                  style={{
                    background: "var(--surface-muted)",
                    borderColor: "var(--border-soft)",
                    color: "var(--text-secondary)",
                    fontSize: "13px",
                    fontWeight: 700,
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  KEEP IT
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isPending}
                  className="flex-1 rounded-xl px-4 py-3 text-white transition-all active:scale-95"
                  style={{
                    background: "linear-gradient(135deg,#ef4444,#b91c1c)",
                    fontSize: "13px",
                    fontWeight: 700,
                    fontFamily: "'Inter', sans-serif",
                    boxShadow: "0 8px 20px rgba(239, 68, 68, 0.3)",
                  }}
                >
                  {isPending ? "DELETING..." : "YES, DELETE"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
