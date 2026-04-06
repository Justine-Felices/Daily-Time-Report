"use client";

import { useRef } from "react";
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
import useOnboardingModalLogic from "@/components/features/home/hooks/useOnboardingModalLogic";

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

export default function OnboardingModal({
  isOpen,
  supabase,
  userId,
  initialValues,
  onComplete,
  onCancel,
  allowCancel = true,
}) {
  const modalRef = useRef(null);
  const {
    values,
    errors,
    formError,
    isSubmitting,
    requiredMissing,
    handleFieldChange,
    handleSubmit,
  } = useOnboardingModalLogic({
    isOpen,
    supabase,
    userId,
    initialValues,
    onComplete,
    onCancel,
    allowCancel,
    modalRef,
  });

  if (!isOpen) return null;

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
