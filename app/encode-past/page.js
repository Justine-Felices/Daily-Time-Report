"use client";

import { useMemo, useState } from "react";
import EncodePastForm from "@/components/dtr/EncodePastForm";
import EncodePastRecordsTable from "@/components/dtr/EncodePastRecordsTable";
import { getHours } from "@/lib/dtr-utils";

const INITIAL_PAST_FORM = {
  date: "",
  amIn: "",
  amOut: "",
  pmIn: "",
  pmOut: "",
};

function toDateTime(dateValue, timeValue) {
  return new Date(`${dateValue}T${timeValue}:00`);
}

function getTodayInputValue(date) {
  const tzOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - tzOffset).toISOString().split("T")[0];
}

export default function EncodePastPage() {
  const [pastForm, setPastForm] = useState(INITIAL_PAST_FORM);
  const [pastErrors, setPastErrors] = useState({});
  const [encodedRecords, setEncodedRecords] = useState([]);
  const maxDate = useMemo(() => getTodayInputValue(new Date()), []);

  const onPastFieldChange = (field, value) => {
    setPastForm((current) => ({ ...current, [field]: value }));
    setPastErrors((current) => ({
      ...current,
      [field]: undefined,
      form: undefined,
    }));
  };

  const savePastRecord = () => {
    const nextErrors = {};
    const requiredFields = ["date", "amIn", "amOut", "pmIn", "pmOut"];

    requiredFields.forEach((field) => {
      if (!pastForm[field]) {
        nextErrors[field] = "This field is required.";
      }
    });

    if (pastForm.date && pastForm.date > maxDate) {
      nextErrors.date = "Date cannot be in the future.";
    }

    if (
      !nextErrors.amIn &&
      !nextErrors.amOut &&
      !nextErrors.pmIn &&
      !nextErrors.pmOut
    ) {
      const amInAt = toDateTime(pastForm.date, pastForm.amIn);
      const amOutAt = toDateTime(pastForm.date, pastForm.amOut);
      const pmInAt = toDateTime(pastForm.date, pastForm.pmIn);
      const pmOutAt = toDateTime(pastForm.date, pastForm.pmOut);

      if (!(amInAt < amOutAt && amOutAt < pmInAt && pmInAt < pmOutAt)) {
        nextErrors.form = "Time order must be AM IN < AM OUT < PM IN < PM OUT.";
      }
    }

    if (Object.keys(nextErrors).length > 0) {
      setPastErrors(nextErrors);
      return;
    }

    const amInAt = toDateTime(pastForm.date, pastForm.amIn);
    const amOutAt = toDateTime(pastForm.date, pastForm.amOut);
    const pmInAt = toDateTime(pastForm.date, pastForm.pmIn);
    const pmOutAt = toDateTime(pastForm.date, pastForm.pmOut);

    const totalRecordHours =
      getHours(amInAt, amOutAt) + getHours(pmInAt, pmOutAt);

    const nextRecord = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      date: pastForm.date,
      amIn: pastForm.amIn,
      amOut: pastForm.amOut,
      pmIn: pastForm.pmIn,
      pmOut: pastForm.pmOut,
      totalHours: totalRecordHours,
      createdAt: Date.now(),
    };

    setEncodedRecords((current) =>
      [...current, nextRecord].sort((a, b) => {
        const byDate = new Date(b.date) - new Date(a.date);
        if (byDate !== 0) return byDate;
        return b.createdAt - a.createdAt;
      }),
    );

    setPastForm(INITIAL_PAST_FORM);
    setPastErrors({});
  };

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto w-full max-w-200 space-y-4 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
        <header className="space-y-1 border-b border-gray-100 pb-4">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Encode Past Records
          </h1>
          <p className="text-sm text-gray-500">
            Add and review previous attendance logs.
          </p>
        </header>

        <EncodePastForm
          formData={pastForm}
          errors={pastErrors}
          maxDate={maxDate}
          onFieldChange={onPastFieldChange}
          onSave={savePastRecord}
        />

        <EncodePastRecordsTable records={encodedRecords} />
      </div>
    </main>
  );
}
