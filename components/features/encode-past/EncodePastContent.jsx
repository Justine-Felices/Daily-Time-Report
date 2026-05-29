"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import {
  CalendarRange,
  ClipboardList,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import useTimedFlag from "@/hooks/useTimedFlag";
import useLocalStorageDraft from "@/hooks/useLocalStorageDraft";
import { STATUS_OPTIONS } from "@/lib/dtr-constants";
import { getTodayInputDate, toDisplayTime } from "@/lib/dtr-formatters";
import { prependHistoryRecord } from "@/lib/dtr-storage";
import {
  isResetStatus,
  isHalfDayStatus,
  validateRequiredTimeEntry,
  calculateTotalHours,
} from "@/lib/dtr-time-validation";
import { createClient } from "@/lib/supabase/client";
import { createAttendanceRecord } from "@/lib/supabase-operations";
import {
  fetchUserProfileByUserId,
  normalizeAttendanceMode,
} from "@/lib/supabase-user-profiles";
import PageShell from "@/components/layout/PageShell";
import HeaderSection from "@/components/features/encode-past/components/HeaderSection";
import BulkAddDtrModal from "@/components/features/encode-past/components/BulkAddDtrModal";
import TimeSessionsSection from "@/components/features/encode-past/components/TimeSessionsSection";
import TimeSessionsSkeleton from "@/components/features/encode-past/components/TimeSessionsSkeleton";
import ErrorMessage from "@/components/features/encode-past/components/ErrorMessage";
import SaveButton from "@/components/features/encode-past/components/SaveButton";

const INITIAL_FORM = {
  date: getTodayInputDate(),
  mode: "session",
  amIn: "08:00",
  amOut: "11:00",
  pmIn: "12:00",
  pmOut: "17:00",
  otIn: "",
  otOut: "",
  simpleIn: "",
  simpleOut: "",
  status: "Regular Duty Day",
  note: "",
};

const ENCODE_PAST_DRAFT_STORAGE_KEY = "dtr-encode-past-form-draft";

function isFormDifferentFromInitial(form) {
  return Object.keys(INITIAL_FORM).some(
    (key) => form[key] !== INITIAL_FORM[key],
  );
}

export default function EncodePastContent() {
  const hasSupabaseConfig =
    typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
    /^https?:\/\//.test(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

  const supabase = useMemo(() => {
    if (!hasSupabaseConfig) return null;
    return createClient();
  }, [hasSupabaseConfig]);

  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const [saved, triggerSaved] = useTimedFlag(2500);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [isModeLoading, setIsModeLoading] = useState(true);
  const [fieldErrors, setFieldErrors] = useState({
    am: false,
    pm: false,
    ot: false,
    simple: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleRestoreDraft = useCallback((draft) => {
    if (!draft || typeof draft !== "object") return;

    setForm((current) => ({
      ...current,
      date: typeof draft.date === "string" ? draft.date : current.date,
      mode: current.mode,
      amIn: typeof draft.amIn === "string" ? draft.amIn : current.amIn,
      amOut: typeof draft.amOut === "string" ? draft.amOut : current.amOut,
      pmIn: typeof draft.pmIn === "string" ? draft.pmIn : current.pmIn,
      pmOut: typeof draft.pmOut === "string" ? draft.pmOut : current.pmOut,
      otIn: typeof draft.otIn === "string" ? draft.otIn : current.otIn,
      otOut: typeof draft.otOut === "string" ? draft.otOut : current.otOut,
      simpleIn:
        typeof draft.simpleIn === "string" ? draft.simpleIn : current.simpleIn,
      simpleOut:
        typeof draft.simpleOut === "string"
          ? draft.simpleOut
          : current.simpleOut,
      status:
        typeof draft.status === "string" &&
        STATUS_OPTIONS.includes(draft.status)
          ? draft.status
          : current.status,
      note: typeof draft.note === "string" ? draft.note : current.note,
    }));
  }, []);

  useEffect(() => {
    if (!supabase) {
      setIsModeLoading(false);
      return;
    }

    let mounted = true;

    const loadAttendanceMode = async () => {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (!mounted || authError || !user) return;

        const { data } = await fetchUserProfileByUserId({
          supabase,
          userId: user.id,
        });

        if (!mounted) return;

        const attendanceMode = normalizeAttendanceMode(data?.attendance_mode);
        const modeFromProfile =
          attendanceMode === "single" ? "simple" : "session";

        setForm((current) => ({
          ...current,
          mode: modeFromProfile,
        }));
      } finally {
        if (!mounted) return;
        setIsModeLoading(false);
      }
    };

    loadAttendanceMode();

    return () => {
      mounted = false;
    };
  }, [supabase]);

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
        otIn: "",
        otOut: "",
        simpleIn: "",
        simpleOut: "",
      }));
      setFieldErrors({ am: false, pm: false, ot: false, simple: false });
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

  const hasTimeValidationErrors =
    fieldErrors.am || fieldErrors.pm || fieldErrors.ot || fieldErrors.simple;
  const disableSave = hasTimeValidationErrors || isLoading || isModeLoading;
  const sessionsLocked = isResetStatus(form.status);

  const handleSave = async () => {
    if (!form.date) {
      setError("Please select a date.");
      return;
    }

    const timeEntryError = validateRequiredTimeEntry({
      status: form.status,
      amIn: form.mode === "simple" ? form.simpleIn : form.amIn,
      pmIn: form.mode === "simple" ? "" : form.pmIn,
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
    setWarning("");

    const today = getTodayInputDate();
    if (form.date > today) {
      setError("Attendance records cannot be added for future dates.");
      return;
    }

    setIsLoading(true);

    try {
      const savePayload =
        form.mode === "simple"
          ? {
              amIn: form.simpleIn || "",
              amOut: "",
              pmIn: "",
              pmOut: form.simpleOut || "",
              otIn: "",
              otOut: "",
            }
          : {
              amIn: form.amIn || "",
              amOut: form.amOut || "",
              pmIn: form.pmIn || "",
              pmOut: form.pmOut || "",
              otIn: form.otIn || "",
              otOut: form.otOut || "",
            };

      const totalHours = calculateTotalHours(savePayload);

      // Save to Supabase
      const savedRecord = await createAttendanceRecord({
        date: form.date,
        am_in: savePayload.amIn || null,
        am_out: savePayload.amOut || null,
        pm_in: savePayload.pmIn || null,
        pm_out: savePayload.pmOut || null,
        ot_in: savePayload.otIn || null,
        ot_out: savePayload.otOut || null,
        mode: form.mode,
        status: form.status,
        note: form.note || null,
        total_hours: totalHours,
      });

      const otSent = Boolean(savePayload.otIn || savePayload.otOut);
      const otSaved = Boolean(savedRecord?.ot_in || savedRecord?.ot_out);
      if (otSent && !otSaved) {
        setWarning(
          "Note: Overtime (OT) times were not saved because your database does not currently support OT or has constraints preventing it.",
        );
      }

      // Also save to localStorage for backup/history
      prependHistoryRecord({
        id: Date.now().toString(),
        date: form.date,
        amIn: toDisplayTime(savePayload.amIn),
        amOut: toDisplayTime(savePayload.amOut),
        pmIn: toDisplayTime(savePayload.pmIn),
        pmOut: toDisplayTime(savePayload.pmOut),
        otIn: toDisplayTime(savePayload.otIn),
        otOut: toDisplayTime(savePayload.otOut),
        mode: form.mode,
        status: form.status,
        note: form.note,
        totalHours,
      });

      triggerSaved(() => {
        setForm((current) => ({ ...INITIAL_FORM, mode: current.mode }));
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to save attendance. Please try again.";
      setError(errorMessage);
      if (process.env.NODE_ENV !== "production") {
        console.warn("Save warning:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageShell width="wide">
      <HeaderSection
        title="Encode Past Attendance"
        subtitle="Manually enter time records for a previous date"
        onBulkAdd={() => setShowBulkModal(true)}
      />

      <BulkAddDtrModal
        open={showBulkModal}
        onClose={() => setShowBulkModal(false)}
      />

      {isModeLoading ? (
        <TimeSessionsSkeleton />
      ) : (
        <TimeSessionsSection
          mode={form.mode}
          amIn={form.amIn}
          amOut={form.amOut}
          pmIn={form.pmIn}
          pmOut={form.pmOut}
          otIn={form.otIn}
          otOut={form.otOut}
          simpleIn={form.simpleIn}
          simpleOut={form.simpleOut}
          onAmInChange={(value) => updateField("amIn", value)}
          onAmOutChange={(value) => updateField("amOut", value)}
          onPmInChange={(value) => updateField("pmIn", value)}
          onPmOutChange={(value) => updateField("pmOut", value)}
          onOtInChange={(value) => updateField("otIn", value)}
          onOtOutChange={(value) => updateField("otOut", value)}
          onSimpleInChange={(value) => updateField("simpleIn", value)}
          onSimpleOutChange={(value) => updateField("simpleOut", value)}
          onValidationChange={handleTimeValidation}
          onStatusChange={handleStatusChange}
          onSave={handleSave}
          status={form.status}
          date={form.date}
          maxDate={getTodayInputDate()}
          onDateChange={(value) => updateField("date", value)}
          isLoading={isModeLoading}
          isSaving={isLoading}
          sessionsLocked={sessionsLocked}
        />
      )}

      <div className="mt-8 px-1">
        <div
          className="rounded-2xl p-5"
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            backdropFilter: "blur(40px)",
            WebkitBackdropFilter: "blur(40px)",
            border: "1px solid var(--border-soft)",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10">
              <ClipboardList size={14} className="text-blue-500" />
            </div>
            <span className="text-[13px] font-bold text-white uppercase tracking-wider">
              Notes & Remarks
            </span>
          </div>

          <textarea
            value={form.note}
            onChange={(e) => updateField("note", e.target.value)}
            placeholder="Add any additional details about this record..."
            className="w-full bg-slate-900/40 border border-white/5 rounded-xl p-4 text-[14px] text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/30 transition-all min-h-[100px] resize-none"
          />
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <SaveButton
          onSave={handleSave}
          isLoading={isLoading}
          disabled={disableSave}
          saved={saved}
        />

        {(error || saved) && (
          <div className="flex justify-center animate-in fade-in slide-in-from-top-1 duration-300">
            {error ? (
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                style={{
                  background: "rgba(220, 38, 38, 0.08)",
                  border: "1px solid rgba(220, 38, 38, 0.15)",
                  color: "#ef4444",
                  fontSize: "11px",
                  fontWeight: 800,
                  letterSpacing: "0.02em",
                  textTransform: "uppercase",
                }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                {error}
              </div>
            ) : (
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                style={{
                  background: "rgba(16, 185, 129, 0.08)",
                  border: "1px solid rgba(16, 185, 129, 0.15)",
                  color: "#10b981",
                  fontSize: "11px",
                  fontWeight: 800,
                  letterSpacing: "0.02em",
                  textTransform: "uppercase",
                }}
              >
                <CheckCircle2 size={12} />
                RECORD SAVED SUCCESSFULLY
              </div>
            )}
          </div>
        )}
      </div>

      {warning && (
        <div
          className="mt-4 rounded-xl px-4 py-3 flex items-start gap-3"
          style={{
            background: "rgba(245,158,11,0.1)",
            border: "1px solid rgba(245,158,11,0.25)",
            color: "#FB923C",
            fontSize: "13px",
            fontWeight: 500,
          }}
        >
          <svg
            className="w-5 h-5 text-amber-500 shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>{warning}</span>
        </div>
      )}
    </PageShell>
  );
}
