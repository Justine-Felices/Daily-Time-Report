"use client";

import { useEffect, useMemo, useState } from "react";
import EncodePastForm from "@/components/dtr/EncodePastForm";
import EncodePastRecordsTable from "@/components/dtr/EncodePastRecordsTable";
import Header from "@/components/dtr/Header";
import ProgressSection from "@/components/dtr/ProgressSection";
import StatusSection from "@/components/dtr/StatusSection";
import SummarySection from "@/components/dtr/SummarySection";
import TimeSection from "@/components/dtr/TimeSection";
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

export default function Home() {
  const [activeTab, setActiveTab] = useState("today");
  const [now, setNow] = useState(new Date());

  const [amIn, setAmIn] = useState(null);
  const [amOut, setAmOut] = useState(null);
  const [pmIn, setPmIn] = useState(null);
  const [pmOut, setPmOut] = useState(null);

  const [dutyStatus, setDutyStatus] = useState("Regular Duty Day");
  const [note, setNote] = useState("");
  const [savedStatusNote, setSavedStatusNote] = useState(null);

  const [pastForm, setPastForm] = useState(INITIAL_PAST_FORM);
  const [pastErrors, setPastErrors] = useState({});
  const [encodedRecords, setEncodedRecords] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const status = useMemo(() => {
    const amActive = amIn && !amOut;
    const pmActive = pmIn && !pmOut;
    return amActive || pmActive ? "IN" : "OUT";
  }, [amIn, amOut, pmIn, pmOut]);

  const todayHours = useMemo(() => {
    return getHours(amIn, amOut) + getHours(pmIn, pmOut);
  }, [amIn, amOut, pmIn, pmOut]);

  const monthHours = 126.0;
  const totalHours = 274.0;
  const targetHours = 500;
  const progressPercent = 60;
  const remainingHours = targetHours - totalHours;
  const finishDate = "Apr 8, 2026";
  const maxDate = useMemo(() => getTodayInputValue(now), [now]);

  const saveStatusAndNote = () => {
    setSavedStatusNote({ dutyStatus, note, savedAt: new Date() });
  };

  const onPastFieldChange = (field, value) => {
    setPastForm((current) => ({ ...current, [field]: value }));
    setPastErrors((current) => ({ ...current, [field]: undefined, form: undefined }));
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

    if (!nextErrors.amIn && !nextErrors.amOut && !nextErrors.pmIn && !nextErrors.pmOut) {
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

    const totalRecordHours = getHours(amInAt, amOutAt) + getHours(pmInAt, pmOutAt);

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
      <div className="mx-auto w-full max-w-200 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
        <Header now={now} status={status} />

        <div className="mt-6 flex rounded-lg bg-gray-100 p-1">
          <button
            onClick={() => setActiveTab("today")}
            className={`w-1/2 rounded-md px-4 py-2 text-sm font-semibold transition ${
              activeTab === "today"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Today (Quick Log)
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`w-1/2 rounded-md px-4 py-2 text-sm font-semibold transition ${
              activeTab === "past"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Encode Past
          </button>
        </div>

        {activeTab === "today" ? (
          <>
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <TimeSection
                title="AM Session"
                timeIn={amIn}
                timeOut={amOut}
                onIn={() => setAmIn(new Date())}
                onOut={() => setAmOut(new Date())}
              />
              <TimeSection
                title="PM Session"
                timeIn={pmIn}
                timeOut={pmOut}
                onIn={() => setPmIn(new Date())}
                onOut={() => setPmOut(new Date())}
                outHighlighted
              />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4">
              <StatusSection
                dutyStatus={dutyStatus}
                note={note}
                onDutyChange={setDutyStatus}
                onNoteChange={setNote}
                onSave={saveStatusAndNote}
              />

              {savedStatusNote && (
                <p className="text-xs text-gray-500">
                  Saved locally: {savedStatusNote.dutyStatus}
                  {savedStatusNote.note ? ` - ${savedStatusNote.note}` : ""}
                </p>
              )}

              <SummarySection
                todayHours={todayHours}
                monthHours={monthHours}
                totalHours={totalHours}
              />

              <ProgressSection
                progressPercent={progressPercent}
                remainingHours={remainingHours}
                targetHours={targetHours}
                finishDate={finishDate}
              />
            </div>
          </>
        ) : (
          <div className="mt-6 space-y-4">
            <EncodePastForm
              formData={pastForm}
              errors={pastErrors}
              maxDate={maxDate}
              onFieldChange={onPastFieldChange}
              onSave={savePastRecord}
            />
            <EncodePastRecordsTable records={encodedRecords} />
          </div>
        )}
      </div>
    </main>
  );
}
