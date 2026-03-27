"use client";

import { useState } from "react";
import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  PenLine,
  Save,
} from "lucide-react";
import useTimedFlag from "@/hooks/useTimedFlag";
import { GLASS_INPUT_STYLE, STATUS_OPTIONS } from "@/lib/dtr-constants";
import { getTodayInputDate, toDisplayTime } from "@/lib/dtr-formatters";
import { prependHistoryRecord } from "@/lib/dtr-storage";
import PageShell from "@/components/dtr/shared/PageShell";
import GlassCard from "@/components/dtr/shared/GlassCard";
import TimeSessionCard from "@/components/dtr/encode-past/TimeSessionCard";

const INITIAL_FORM = {
  date: "",
  amIn: "",
  amOut: "",
  pmIn: "",
  pmOut: "",
  status: "Regular Duty Day",
  note: "",
};

export default function EncodePastContent() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState("");
  const [saved, triggerSaved] = useTimedFlag(2500);

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

    const totalHours =
      (form.amIn && form.amOut ? 4 : form.amIn ? 2 : 0) +
      (form.pmIn && form.pmOut ? 4 : form.pmIn ? 2 : 0);

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
      <div>
        <div className="mb-1 flex items-center gap-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-xl"
            style={{
              background: "linear-gradient(135deg,#069494,#FF69B4)",
              boxShadow: "0 4px 12px rgba(6,148,148,0.35)",
            }}
          >
            <PenLine size={15} color="#fff" />
          </div>
          <h1
            style={{
              color: "#1E293B",
              fontFamily: "'Inter',sans-serif",
              margin: 0,
            }}
          >
            Encode Past Attendance
          </h1>
        </div>

        <p
          style={{
            color: "#64748B",
            fontSize: "13px",
            fontFamily: "'Inter',sans-serif",
            margin: 0,
          }}
        >
          Manually enter time records for a previous date
        </p>
      </div>

      <GlassCard padding="20px">
        <label
          style={{
            color: "#1E293B",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.06em",
            fontFamily: "'Inter',sans-serif",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginBottom: "8px",
          }}
        >
          <Calendar size={13} color="#069494" /> SELECT DATE
        </label>

        <input
          type="date"
          value={form.date}
          onChange={(event) =>
            setForm((current) => ({ ...current, date: event.target.value }))
          }
          max={getTodayInputDate()}
          className="w-full"
          style={{ ...GLASS_INPUT_STYLE, padding: "10px 14px" }}
        />
      </GlassCard>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TimeSessionCard
          title="AM Session"
          color="#FF69B4"
          inValue={form.amIn}
          outValue={form.amOut}
          onInChange={(value) =>
            setForm((current) => ({ ...current, amIn: value }))
          }
          onOutChange={(value) =>
            setForm((current) => ({ ...current, amOut: value }))
          }
        />

        <TimeSessionCard
          title="PM Session"
          color="#069494"
          inValue={form.pmIn}
          outValue={form.pmOut}
          onInChange={(value) =>
            setForm((current) => ({ ...current, pmIn: value }))
          }
          onOutChange={(value) =>
            setForm((current) => ({ ...current, pmOut: value }))
          }
        />
      </div>

      <GlassCard padding="20px">
        <label
          style={{
            color: "#1E293B",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.06em",
            fontFamily: "'Inter',sans-serif",
            display: "block",
            marginBottom: "8px",
          }}
        >
          STATUS
        </label>

        <div className="relative mb-4">
          <select
            value={form.status}
            onChange={(event) =>
              setForm((current) => ({ ...current, status: event.target.value }))
            }
            className="w-full appearance-none"
            style={{
              ...GLASS_INPUT_STYLE,
              padding: "10px 40px 10px 14px",
              cursor: "pointer",
            }}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <ChevronDown
            size={15}
            color="#069494"
            className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2"
          />
        </div>

        <label
          style={{
            color: "#1E293B",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.06em",
            fontFamily: "'Inter',sans-serif",
            display: "block",
            marginBottom: "8px",
          }}
        >
          NOTE (OPTIONAL)
        </label>

        <textarea
          rows={2}
          value={form.note}
          onChange={(event) =>
            setForm((current) => ({ ...current, note: event.target.value }))
          }
          placeholder="Add any notes or remarks..."
          className="w-full resize-none"
          style={{ ...GLASS_INPUT_STYLE, padding: "10px 14px" }}
        />
      </GlassCard>

      {error && (
        <div
          style={{
            padding: "12px 16px",
            background: "rgba(255,105,180,0.1)",
            border: "1px solid rgba(255,105,180,0.25)",
            borderRadius: "12px",
            color: "#CC2277",
            fontSize: "13px",
            fontFamily: "'Inter',sans-serif",
          }}
        >
          {error}
        </div>
      )}

      <button
        onClick={handleSave}
        className="flex w-full items-center justify-center gap-2 rounded-xl py-3 transition-all duration-200"
        style={{
          background: saved
            ? "linear-gradient(135deg,#22C55E,#16A34A)"
            : "linear-gradient(135deg,#069494,#0aacac)",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          fontFamily: "'Inter',sans-serif",
          fontSize: "14px",
          fontWeight: 600,
          boxShadow: saved
            ? "0 4px 14px rgba(34,197,94,0.4)"
            : "0 4px 16px rgba(6,148,148,0.38)",
          letterSpacing: "0.02em",
        }}
      >
        {saved ? (
          <>
            <CheckCircle2 size={16} /> Record Saved!
          </>
        ) : (
          <>
            <Save size={15} /> Save Attendance Record
          </>
        )}
      </button>
    </PageShell>
  );
}
