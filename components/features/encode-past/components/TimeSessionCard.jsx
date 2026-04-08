import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import GlassCard from "@/components/ui/cards/GlassCard";
import { GLASS_INPUT_STYLE } from "@/lib/dtr-constants";
import {
  isValidClock,
  toMinutes,
  validateTimeInput,
} from "@/lib/dtr-time-validation";

export default function TimeSessionCard({
  title,
  color,
  inValue,
  outValue,
  onInChange,
  onOutChange,
  onValidationChange,
  earliestTime,
  earliestLabel = "previous session",
  disabled = false,
}) {
  const [fieldErrors, setFieldErrors] = useState({ in: "", out: "" });
  const hasFieldError = Boolean(fieldErrors.in || fieldErrors.out);

  useEffect(() => {
    onValidationChange?.(hasFieldError);
  }, [hasFieldError, onValidationChange]);

  const commitTimeInput = (field, value, relatedValue, onChange) => {
    if (!value) {
      onChange("");
      setFieldErrors((current) => ({ ...current, [field]: "" }));
      return;
    }

    const error = validateTimeInput(
      field === "in" ? "timeIn" : "timeOut",
      value,
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
    onChange(value);
  };

  const handleFieldChange = (field, value) => {
    if (fieldErrors[field]) {
      setFieldErrors((current) => ({ ...current, [field]: "" }));
    }
  };

  return (
    <div
      style={{
        opacity: disabled ? 0.5 : 1,
        pointerEvents: disabled ? "none" : "auto",
      }}
    >
      <GlassCard padding="20px">
        <div className="mb-4 flex items-center gap-2">
          <div
            className="h-2.5 w-2.5 rounded-full"
            style={{
              background: color,
              boxShadow: `0 0 8px ${color}55`,
            }}
          />
          <span
            style={{
              color: "var(--text-primary)",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.06em",
              fontFamily: "'Inter',sans-serif",
            }}
          >
            {title.toUpperCase()}
          </span>
        </div>

        <div className="space-y-3">
          {[
            {
              label: "TIME IN",
              field: "in",
              value: inValue,
              relatedValue: outValue,
              setter: onInChange,
            },
            {
              label: "TIME OUT",
              field: "out",
              value: outValue,
              relatedValue: inValue,
              setter: onOutChange,
            },
          ].map(({ label, field, value, relatedValue, setter }) => (
            <div key={label}>
              <div
                style={{
                  color: fieldErrors[field] ? "#DC2626" : "#069494",
                  fontSize: "9px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  fontFamily: "'Inter',sans-serif",
                  marginBottom: "4px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <Clock
                  size={9}
                  color={fieldErrors[field] ? "#DC2626" : "#069494"}
                />{" "}
                {label}
                {fieldErrors[field] && (
                  <span style={{ color: "#DC2626" }}>
                    — {fieldErrors[field]}
                  </span>
                )}
              </div>

              <input
                type="time"
                value={value}
                onChange={(event) => {
                  handleFieldChange(field, event.target.value);
                  setter(event.target.value);
                }}
                onBlur={() => {
                  commitTimeInput(field, value, relatedValue, setter);
                }}
                className="w-full text-sm sm:text-[14px]"
                style={{
                  ...GLASS_INPUT_STYLE,
                  minHeight: "42px",
                  padding: "9px 12px",
                  border: fieldErrors[field]
                    ? "1.5px solid #DC2626"
                    : "1.5px solid rgba(6,148,148,0.24)",
                  colorScheme: "light",
                }}
              />
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
