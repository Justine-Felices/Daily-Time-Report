"use client";

import { useState } from "react";
import useTimedFlag from "@/hooks/useTimedFlag";
import { STATUS_OPTIONS } from "@/lib/dtr-constants";
import { getTodayInputDate, toDisplayTime } from "@/lib/dtr-formatters";
import { prependHistoryRecord } from "@/lib/dtr-storage";
import PageShell from "@/components/layout/PageShell";
import HeaderSection from "@/components/features/encode-past/components/HeaderSection";
import DateSection from "@/components/features/encode-past/components/DateSection";
import TimeSessionsSection from "@/components/features/encode-past/components/TimeSessionsSection";
import StatusNoteSection from "@/components/features/encode-past/components/StatusNoteSection";
import ErrorMessage from "@/components/features/encode-past/components/ErrorMessage";
import SaveButton from "@/components/features/encode-past/components/SaveButton";

const INITIAL_FORM = {
  date: "",
  amIn: "",
  amOut: "",
  pmIn: "",
  pmOut: "",
  status: "Regular Duty Day",
  note: "",
};

function calculateTotalHours({ amIn, amOut, pmIn, pmOut }) {
  return (
    (amIn && amOut ? 4 : amIn ? 2 : 0) + (pmIn && pmOut ? 4 : pmIn ? 2 : 0)
  );
}

export default function EncodePastContent() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState("");
  const [saved, triggerSaved] = useTimedFlag(2500);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSave = () => {
    if (!form.date) {
      setError("Please select a date.");
      return;
    }

    if (!form.amIn && !form.pmIn) {
      setError("Please fill in at least one time entry.");
      return;
    }

    setError("");

    const totalHours = calculateTotalHours(form);

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
      />

      <StatusNoteSection
        status={form.status}
        note={form.note}
        statusOptions={STATUS_OPTIONS}
        onStatusChange={(value) => updateField("status", value)}
        onNoteChange={(value) => updateField("note", value)}
      />

      <ErrorMessage error={error} />

      <SaveButton saved={saved} onSave={handleSave} />
    </PageShell>
  );
}
