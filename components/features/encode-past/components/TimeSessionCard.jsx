import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { toEditorClock, validateTimeInput } from "@/lib/dtr-time-validation";
import { SkeletonBlock } from "@/components/ui/Skeleton";

export default function TimeSessionCard({
  title,
  icon: Icon,
  iconColor,
  session,
  isLoading = false,
  disabled = false,
  earliestTime,
  earliestLabel = "previous session",
  onValidationChange,
  onTimeInChange,
  onTimeOutChange,
  inLabel,
  outLabel,
  inGrad,
  inShadow,
}) {
  const [timeInDraft, setTimeInDraft] = useState(toEditorClock(session.timeIn));
  const [timeOutDraft, setTimeOutDraft] = useState(
    toEditorClock(session.timeOut),
  );
  const [fieldErrors, setFieldErrors] = useState({ timeIn: "", timeOut: "" });
  const hasFieldError = Boolean(fieldErrors.timeIn || fieldErrors.timeOut);

  useEffect(() => {
    onValidationChange?.(hasFieldError);
  }, [hasFieldError, onValidationChange]);

  useEffect(() => {
    setTimeInDraft(toEditorClock(session.timeIn));
  }, [session.timeIn]);

  useEffect(() => {
    setTimeOutDraft(toEditorClock(session.timeOut));
  }, [session.timeOut]);

  const done = session.timeIn && session.timeOut;
  const inProgress = session.timeIn && !session.timeOut;

  const commitTimeInput = (field, value, relatedValue, onChange) => {
    const trimmed = value?.trim();

    if (!trimmed) {
      onChange?.("");
      setFieldErrors((current) => ({ ...current, [field]: "" }));
      return;
    }

    const error = validateTimeInput(
      field,
      trimmed,
      relatedValue,
      earliestTime,
      {
        earliestLabel,
      },
    );

    if (error) {
      setFieldErrors((current) => ({ ...current, [field]: error }));
      return;
    }

    setFieldErrors((current) => ({ ...current, [field]: "" }));
    onChange?.(trimmed);
  };

  const handleTimeChange = (
    field,
    nextValue,
    setDraft,
    relatedValue,
    onChange,
  ) => {
    if (fieldErrors[field]) {
      setFieldErrors((current) => ({ ...current, [field]: "" }));
    }
    setDraft(nextValue);
    commitTimeInput(field, nextValue, relatedValue, onChange);
  };

  const fields = [
    {
      label: inLabel || "TIME IN",
      field: "timeIn",
      value: timeInDraft,
      setValue: setTimeInDraft,
      relatedValue: timeOutDraft,
      onChange: onTimeInChange,
    },
    {
      label: outLabel || "TIME OUT",
      field: "timeOut",
      value: timeOutDraft,
      setValue: setTimeOutDraft,
      relatedValue: timeInDraft,
      onChange: onTimeOutChange,
    },
  ];

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        opacity: disabled ? 0.5 : 1,
        pointerEvents: disabled ? "none" : "auto",
        background: "rgba(255, 255, 255, 0.03)",
        backdropFilter: "blur(40px)",
        WebkitBackdropFilter: "blur(40px)",
        border: done
          ? "1.5px solid rgba(34, 197, 94, 0.3)"
          : "1px solid rgba(255, 255, 255, 0.08)",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
      }}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-lg"
            style={{ background: `${iconColor}18` }}
          >
            <Icon size={14} color={iconColor} />
          </div>
          <span
            style={{
              color: "var(--text-primary)",
              fontSize: "13px",
              fontWeight: 700,
              fontFamily: "'Inter',sans-serif",
            }}
          >
            {title}
          </span>
        </div>

        <span
          className="rounded-full px-2.5 py-0.5"
          style={{
            background: done
              ? "rgba(34,197,94,0.12)"
              : inProgress
                ? "rgba(59,130,246,0.1)"
                : "rgba(148,163,184,0.12)",
            color: done ? "#16A34A" : inProgress ? "#3b82f6" : "#94A3B8",
            fontSize: "10px",
            fontWeight: 700,
            fontFamily: "'Inter',sans-serif",
            letterSpacing: "0.06em",
            border: `1px solid ${
              done
                ? "rgba(34,197,94,0.2)"
                : inProgress
                  ? "rgba(59,130,246,0.2)"
                  : "rgba(148,163,184,0.2)"
            }`,
          }}
        >
          {done ? "COMPLETED" : inProgress ? "IN SESSION" : "PENDING"}
        </span>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2">
        {fields.map(
          ({ label, field, value, setValue, relatedValue, onChange }) => (
            <div
              key={label}
              className="rounded-xl p-3"
              style={{
                background: "rgba(0, 0, 0, 0.2)",
                border: fieldErrors[field]
                  ? "1px solid rgba(244,63,94,0.45)"
                  : "1px solid rgba(255, 255, 255, 0.05)",
              }}
            >
              <div
                style={{
                  color: "#3b82f6",
                  fontSize: "8px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  fontFamily: "'Inter',sans-serif",
                  marginBottom: "4px",
                }}
              >
                {label}
              </div>

              <input
                type="time"
                step={60}
                disabled={disabled || isLoading}
                value={value}
                onChange={(event) => {
                  handleTimeChange(
                    field,
                    event.target.value,
                    setValue,
                    relatedValue,
                    onChange,
                  );
                }}
                onBlur={() =>
                  commitTimeInput(field, value, relatedValue, onChange)
                }
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  padding: 0,
                  color: disabled
                    ? "#94A3B8"
                    : fieldErrors[field]
                      ? "#E11D48"
                      : "var(--text-primary)",
                  fontSize: "15px",
                  fontWeight: 700,
                  fontFamily: "'Inter',sans-serif",
                  cursor: disabled ? "not-allowed" : "text",
                  display: isLoading ? "none" : "block",
                  colorScheme: "light",
                }}
              />

              {isLoading && <SkeletonBlock className="h-5 w-full rounded-md" />}

              {fieldErrors[field] && (
                <div
                  style={{
                    marginTop: "4px",
                    color: "#E11D48",
                    fontSize: "9px",
                    fontWeight: 600,
                    fontFamily: "'Inter',sans-serif",
                    letterSpacing: "0.03em",
                  }}
                >
                  {fieldErrors[field]}
                </div>
              )}
            </div>
          ),
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          disabled
          style={{
            padding: "9px 0",
            borderRadius: "10px",
            background: "rgba(148,163,184,0.15)",
            color: "#CBD5E1",
            border: "none",
            fontFamily: "'Inter',sans-serif",
            fontSize: "12px",
            fontWeight: 700,
            cursor: "not-allowed",
            letterSpacing: "0.03em",
            opacity: 0.8,
          }}
        >
          {inLabel}
        </button>

        <button
          disabled
          style={{
            padding: "9px 0",
            borderRadius: "10px",
            background: "rgba(148,163,184,0.15)",
            color: "#CBD5E1",
            border: "none",
            fontFamily: "'Inter',sans-serif",
            fontSize: "12px",
            fontWeight: 700,
            cursor: "not-allowed",
            letterSpacing: "0.03em",
            opacity: 0.8,
          }}
        >
          {outLabel}
        </button>
      </div>
    </div>
  );
}
