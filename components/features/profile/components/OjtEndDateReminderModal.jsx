"use client";

import { useState } from "react";
import { Calendar } from "lucide-react";
import ProfileInputField from "@/components/features/profile/components/ProfileInputField";

function toDisplayDate(value) {
  if (!value) return null;
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return null;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function OjtEndDateReminderModal({
  isOpen,
  ojtStartDate,
  onSave,
  onDismiss,
  isSaving,
  error,
}) {
  const [endDate, setEndDate] = useState("");
  const [validationError, setValidationError] = useState("");

  const handleSave = () => {
    setValidationError("");

    if (!endDate) {
      setValidationError("Please select an expected completion date.");
      return;
    }

    if (
      ojtStartDate &&
      new Date(endDate) < new Date(ojtStartDate)
    ) {
      setValidationError("End date must be on or after start date.");
      return;
    }

    onSave(endDate);
  };

  if (!isOpen) return null;

  const startDateLabel = toDisplayDate(ojtStartDate);
  const displayError = validationError || error;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">
      <div
        className="w-full max-w-md rounded-[28px] border p-6 sm:p-7"
        style={{
          background: "var(--surface-card)",
          backdropFilter: "blur(32px)",
          WebkitBackdropFilter: "blur(32px)",
          borderColor: "var(--border-soft)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        }}
      >
        <div className="mb-6">
          <h2
            style={{
              color: "var(--text-primary)",
              fontSize: "18px",
              fontWeight: 800,
              fontFamily: "'Inter', sans-serif",
              lineHeight: 1.1,
            }}
          >
            Set your OJT end date
          </h2>
          <p
            className="mt-2 text-sm leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            Add an expected completion date for your OJT. This helps track your
            progress. If you are not sure yet, you can enter an estimated date.
          </p>
        </div>

        {startDateLabel && (
          <p
            className="mb-4 text-xs"
            style={{ color: "var(--text-secondary)" }}
          >
            Your OJT started on{" "}
            <span style={{ fontWeight: 700 }}>{startDateLabel}</span>.
          </p>
        )}

        <div className="mb-6">
          <ProfileInputField
            label="EXPECTED COMPLETION"
            icon={Calendar}
            type="date"
            value={endDate}
            onChange={(value) => {
              setEndDate(value);
              if (validationError) setValidationError("");
            }}
          />
        </div>

        {displayError && (
          <div
            className="mb-4 flex items-center gap-1.5 rounded-lg px-3 py-2"
            style={{
              background: "rgba(220, 38, 38, 0.08)",
              border: "1px solid rgba(220, 38, 38, 0.15)",
              color: "#ef4444",
              fontSize: "11px",
              fontWeight: 700,
            }}
          >
            {displayError}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="w-full rounded-xl px-4 py-3 text-white transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              background: "var(--accent-strong)",
              fontSize: "13px",
              fontWeight: 700,
              fontFamily: "'Inter', sans-serif",
              boxShadow: "0 8px 20px rgba(59, 130, 246, 0.25)",
            }}
          >
            {isSaving ? "Saving..." : "Save end date"}
          </button>
          <button
            type="button"
            onClick={onDismiss}
            disabled={isSaving}
            className="w-full rounded-xl border px-4 py-3 transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              borderColor: "var(--border-soft)",
              background: "var(--surface-muted)",
              color: "var(--text-secondary)",
              fontSize: "13px",
              fontWeight: 700,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Remind me later
          </button>
        </div>
      </div>
    </div>
  );
}
