"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  Building,
  Calendar,
  Target,
  User,
  UserCheck,
} from "lucide-react";
import GlassCard from "@/components/ui/cards/GlassCard";
import FieldError from "@/components/features/login/components/FieldError";
import ProfileInputField from "@/components/features/profile/components/ProfileInputField";
import { saveUserOnboardingProfile } from "@/lib/supabase-user-profiles";

const FIELD_DEFS = [
  {
    key: "full_name",
    label: "FULL NAME",
    icon: User,
    type: "text",
    required: true,
  },
  {
    key: "department",
    label: "DEPARTMENT",
    icon: Building,
    type: "text",
    required: false,
  },
  {
    key: "position",
    label: "POSITION / ROLE",
    icon: Briefcase,
    type: "text",
    required: false,
  },
  {
    key: "supervisor",
    label: "SUPERVISOR",
    icon: UserCheck,
    type: "text",
    required: false,
  },
  {
    key: "company",
    label: "COMPANY",
    icon: Building,
    type: "text",
    required: false,
  },
  {
    key: "start_date",
    label: "START DATE",
    icon: Calendar,
    type: "date",
    required: false,
  },
  {
    key: "end_date",
    label: "END DATE",
    icon: Calendar,
    type: "date",
    required: false,
  },
  {
    key: "target_hours",
    label: "TARGET HOURS",
    icon: Target,
    type: "number",
    required: true,
  },
];

const FIELD_ERROR_MAP = {
  full_name: "Full name is required.",
  target_hours: "Target hours is required.",
};

function normalizeInitialValues(initialValues) {
  return {
    full_name: initialValues?.full_name || "",
    department: initialValues?.department || "",
    position: initialValues?.position || "",
    supervisor: initialValues?.supervisor || "",
    company: initialValues?.company || "",
    start_date: initialValues?.start_date || "",
    end_date: initialValues?.end_date || "",
    target_hours:
      initialValues?.target_hours === null ||
      typeof initialValues?.target_hours === "undefined"
        ? ""
        : String(initialValues.target_hours),
  };
}

export default function OnboardingModal({
  isOpen,
  supabase,
  userId,
  initialValues,
  onComplete,
  onCancel,
  allowCancel = true,
}) {
  const router = useRouter();
  const modalRef = useRef(null);
  const [values, setValues] = useState(() =>
    normalizeInitialValues(initialValues),
  );
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    Promise.resolve().then(() => {
      setValues(normalizeInitialValues(initialValues));
      setErrors({});
      setFormError("");
    });
  }, [isOpen, initialValues]);

  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusables = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    if (focusables.length > 0) {
      focusables[0].focus();
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && allowCancel && !isSubmitting) {
        onCancel?.();
        return;
      }

      if (event.key !== "Tab") return;

      const tabbableElements = Array.from(
        modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => !element.hasAttribute("disabled"));

      if (tabbableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = tabbableElements[0];
      const lastElement = tabbableElements[tabbableElements.length - 1];
      const isShiftTab = event.shiftKey;
      const activeElement = document.activeElement;

      if (!isShiftTab && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      } else if (isShiftTab && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [allowCancel, isOpen, isSubmitting, onCancel]);

  if (!isOpen) return null;

  const requiredMissing =
    !values.full_name.trim() ||
    !values.target_hours ||
    Number(values.target_hours) <= 0;

  const validate = () => {
    const nextErrors = {};

    if (!values.full_name.trim()) {
      nextErrors.full_name = FIELD_ERROR_MAP.full_name;
    }

    if (!values.target_hours || Number(values.target_hours) <= 0) {
      nextErrors.target_hours = FIELD_ERROR_MAP.target_hours;
    }

    if (
      values.start_date &&
      values.end_date &&
      new Date(values.end_date) < new Date(values.start_date)
    ) {
      nextErrors.end_date = "End date must be on or after start date.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleFieldChange = (key, value) => {
    setValues((current) => ({ ...current, [key]: value }));
    if (!errors[key]) return;

    setErrors((current) => ({ ...current, [key]: "" }));
  };

  const handleSubmit = async () => {
    setFormError("");

    if (!validate()) {
      return;
    }

    if (!supabase || !userId) {
      setFormError(
        "Unable to save profile right now. Please check your connection and try again.",
      );
      return;
    }

    setIsSubmitting(true);

    const { data, error } = await saveUserOnboardingProfile({
      supabase,
      userId,
      values,
    });

    setIsSubmitting(false);

    if (error) {
      setFormError(error.message || "Failed to save your profile details.");
      return;
    }

    onComplete?.(data);
    router.replace("/");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/42 px-4 backdrop-blur-md"
      style={{
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      <GlassCard
        className="w-full max-w-2xl"
        padding="24px"
        style={{
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.72), rgba(240,253,253,0.58))",
          border: "1px solid rgba(255,255,255,0.45)",
          boxShadow:
            "0 12px 34px rgba(15,23,42,0.22), inset 0 1px 0 rgba(255,255,255,0.72)",
        }}
      >
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="onboarding-title"
        >
          <div className="mb-5">
            <h2
              id="onboarding-title"
              style={{
                color: "#0F172A",
                fontSize: "18px",
                fontWeight: 800,
                fontFamily: "'Inter',sans-serif",
                marginBottom: "6px",
              }}
            >
              Complete Your Profile
            </h2>
            <p
              style={{
                color: "#475569",
                fontSize: "13px",
                lineHeight: 1.5,
                fontFamily: "'Inter',sans-serif",
              }}
            >
              Set up your details to start tracking your OJT hours
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {FIELD_DEFS.map((field) => (
              <div
                key={field.key}
                className={field.key === "full_name" ? "md:col-span-2" : ""}
              >
                <ProfileInputField
                  label={field.label}
                  icon={field.icon}
                  type={field.type}
                  value={values[field.key]}
                  onChange={(value) => handleFieldChange(field.key, value)}
                />
                {errors[field.key] && <FieldError msg={errors[field.key]} />}
              </div>
            ))}
          </div>

          {formError && <FieldError msg={formError} />}

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            {allowCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
                className="rounded-xl px-4 py-2.5"
                style={{
                  background: "rgba(148,163,184,0.16)",
                  border: "1px solid rgba(148,163,184,0.28)",
                  color: "#334155",
                  fontSize: "12px",
                  fontWeight: 700,
                  fontFamily: "'Inter',sans-serif",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  opacity: isSubmitting ? 0.7 : 1,
                }}
              >
                Cancel
              </button>
            )}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={requiredMissing || isSubmitting}
              className="rounded-xl px-4 py-2.5"
              style={{
                background:
                  requiredMissing || isSubmitting
                    ? "rgba(148,163,184,0.22)"
                    : "linear-gradient(135deg,#069494,#0aacac)",
                border: "none",
                color: requiredMissing || isSubmitting ? "#94A3B8" : "#fff",
                fontSize: "12px",
                fontWeight: 700,
                fontFamily: "'Inter',sans-serif",
                boxShadow:
                  requiredMissing || isSubmitting
                    ? "none"
                    : "0 4px 16px rgba(6,148,148,0.38)",
                cursor:
                  requiredMissing || isSubmitting ? "not-allowed" : "pointer",
              }}
            >
              {isSubmitting ? "Saving..." : "Save & Continue"}
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
