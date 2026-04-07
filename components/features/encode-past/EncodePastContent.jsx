"use client";

import { useState, useCallback } from "react";
import useTimedFlag from "@/hooks/useTimedFlag";
import useLocalStorageDraft from "@/hooks/useLocalStorageDraft";
import { STATUS_OPTIONS } from "@/lib/dtr-constants";
import { getTodayInputDate, toDisplayTime } from "@/lib/dtr-formatters";
import { prependHistoryRecord } from "@/lib/dtr-storage";
import {
  isResetStatus,
  isHalfDayStatus,
  validateRequiredTimeEntry,
} from "@/lib/dtr-time-validation";
import { createAttendanceRecord } from "@/lib/supabase-operations";
import PageShell from "@/components/layout/PageShell";
import HeaderSection from "@/components/features/encode-past/components/HeaderSection";
import DateSection from "@/components/features/encode-past/components/DateSection";
import TimeSessionsSection from "@/components/features/encode-past/components/TimeSessionsSection";
import StatusNoteSection from "@/components/features/encode-past/components/StatusNoteSection";
import ErrorMessage from "@/components/features/encode-past/components/ErrorMessage";
import SaveButton from "@/components/features/encode-past/components/SaveButton";

const INITIAL_FORM = {
  date: "2026-03-02",
  amIn: "09:30",
  amOut: "12:00",
  pmIn: "13:00",
  pmOut: "18:30",
  status: "Regular Duty Day",
  note: "",
};

const ENCODE_PAST_DRAFT_STORAGE_KEY = "dtr-encode-past-form-draft";

function isFormDifferentFromInitial(form) {
  return Object.keys(INITIAL_FORM).some(
    (key) => form[key] !== INITIAL_FORM[key],
  );
}

function calculateTotalHours({ amIn, amOut, pmIn, pmOut }) {
  const toMinutes = (time) => {
    if (!time || typeof time !== "string") return null;
    const [hourString, minuteString] = time.split(":");
    const hour = Number.parseInt(hourString, 10);
    const minute = Number.parseInt(minuteString, 10);

    if (Number.isNaN(hour) || Number.isNaN(minute)) return null;

    return hour * 60 + minute;
  };

  const getSessionHours = (timeIn, timeOut) => {
    const startMinutes = toMinutes(timeIn);
    const endMinutes = toMinutes(timeOut);

    if (startMinutes === null || endMinutes === null) return 0;

    return Math.max(0, (endMinutes - startMinutes) / 60);
  };

  const amHours = getSessionHours(amIn, amOut);
  const pmHours = getSessionHours(pmIn, pmOut);

  const amInMinutes = toMinutes(amIn);
  const amOutMinutes = toMinutes(amOut);
  const pmInMinutes = toMinutes(pmIn);
  const pmOutMinutes = toMinutes(pmOut);

  const hasCompleteAM = amInMinutes !== null && amOutMinutes !== null;
  const hasCompletePM = pmInMinutes !== null && pmOutMinutes !== null;

  let rawHours = amHours + pmHours;

  // Auto-deduct lunch only for a single continuous shift that spans 12:00-13:00.
  if (!hasCompleteAM && hasCompletePM) {
    if (pmInMinutes < 12 * 60 && pmOutMinutes > 13 * 60) {
      rawHours = Math.max(0, rawHours - 1);
    }
  } else if (hasCompleteAM && !hasCompletePM) {
    if (amInMinutes < 12 * 60 && amOutMinutes > 13 * 60) {
      rawHours = Math.max(0, rawHours - 1);
    }
  }

  return Number(rawHours.toFixed(2));
}

export default function EncodePastContent() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState("");
  const [saved, triggerSaved] = useTimedFlag(2500);
  const [fieldErrors, setFieldErrors] = useState({ am: false, pm: false });
  const [isLoading, setIsLoading] = useState(false);

  const handleRestoreDraft = useCallback((draft) => {
    if (!draft || typeof draft !== "object") return;

    setForm((current) => ({
      ...current,
      date: typeof draft.date === "string" ? draft.date : current.date,
      amIn: typeof draft.amIn === "string" ? draft.amIn : current.amIn,
      amOut: typeof draft.amOut === "string" ? draft.amOut : current.amOut,
      pmIn: typeof draft.pmIn === "string" ? draft.pmIn : current.pmIn,
      pmOut: typeof draft.pmOut === "string" ? draft.pmOut : current.pmOut,
      status:
        typeof draft.status === "string" &&
        STATUS_OPTIONS.includes(draft.status)
          ? draft.status
          : current.status,
      note: typeof draft.note === "string" ? draft.note : current.note,
    }));
  }, []);

  useLocalStorageDraft({
    storageKey: ENCODE_PAST_DRAFT_STORAGE_KEY,
    draftValue: form,
    hasDraft: isFormDifferentFromInitial(form),
    onRestore: handleRestoreDraft,
  });

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleTimeValidation = useCallback((errors) => {
    setFieldErrors(errors);
  }, []);

  const handleStatusChange = useCallback((nextStatus) => {
    if (isResetStatus(nextStatus)) {
      // If status is a non-working status, reset ALL time fields and errors
      setForm((current) => ({
        ...current,
        status: nextStatus,
        amIn: "",
        amOut: "",
        pmIn: "",
        pmOut: "",
      }));
      setFieldErrors({ am: false, pm: false });
      return;
    }

    if (isHalfDayStatus(nextStatus)) {
      // If status is half day, clear only PM times
      setForm((current) => ({
        ...current,
        status: nextStatus,
        pmIn: "",
        pmOut: "",
      }));
      setFieldErrors((current) => ({ ...current, pm: false }));
      return;
    }

    // Otherwise just update status
    setForm((current) => ({ ...current, status: nextStatus }));
  }, []);

  const hasTimeValidationErrors = fieldErrors.am || fieldErrors.pm;
  const disableSave = hasTimeValidationErrors || isLoading;
  const sessionsLocked = isResetStatus(form.status);

  const handleSave = async () => {
    if (!form.date) {
      setError("Please select a date.");
      return;
    }

    const timeEntryError = validateRequiredTimeEntry({
      status: form.status,
      amIn: form.amIn,
      pmIn: form.pmIn,
    });
    if (timeEntryError) {
      setError(timeEntryError);
      return;
    }

    if (hasTimeValidationErrors) {
      setError("Please fix validation errors before saving.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const totalHours = calculateTotalHours(form);

      // Save to Supabase
      await createAttendanceRecord({
        date: form.date,
        am_in: form.amIn || null,
        am_out: form.amOut || null,
        pm_in: form.pmIn || null,
        pm_out: form.pmOut || null,
        status: form.status,
        note: form.note || null,
        total_hours: totalHours,
      });

      // Also save to localStorage for backup/history
      prependHistoryRecord({
        id: Date.now().toString(),
        date: form.date,
        amIn: toDisplayTime(form.amIn),
        amOut: toDisplayTime(form.amOut),
        pmIn: toDisplayTime(form.pmIn),
        pmOut: toDisplayTime(form.pmOut),
        status: form.status,
        note: form.note,
        totalHours,
      });

      triggerSaved(() => {
        setForm(INITIAL_FORM);
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to save attendance. Please try again.";
      setError(errorMessage);
      console.error("Save error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageShell width="narrow">
      <HeaderSection
        title="Encode Past Attendance"
        subtitle="Manually enter time records for a previous date"
      />

      <DateSection
        date={form.date}
        maxDate={getTodayInputDate()}
        onDateChange={(value) => updateField("date", value)}
      />

      <TimeSessionsSection
        amIn={form.amIn}
        amOut={form.amOut}
        pmIn={form.pmIn}
        pmOut={form.pmOut}
        onAmInChange={(value) => updateField("amIn", value)}
        onAmOutChange={(value) => updateField("amOut", value)}
        onPmInChange={(value) => updateField("pmIn", value)}
        onPmOutChange={(value) => updateField("pmOut", value)}
        onValidationChange={handleTimeValidation}
        status={form.status}
        sessionsLocked={sessionsLocked}
      />

      <StatusNoteSection
        status={form.status}
        note={form.note}
        statusOptions={STATUS_OPTIONS}
        onStatusChange={handleStatusChange}
        onNoteChange={(value) => updateField("note", value)}
      />

      <ErrorMessage error={error} />

      <SaveButton
        saved={saved}
        onSave={handleSave}
        disabled={disableSave}
        isLoading={isLoading}
      />
    </PageShell>
  );
}
