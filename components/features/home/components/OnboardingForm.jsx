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
import useOnboardingFormLogic from "@/components/features/home/hooks/useOnboardingFormLogic";

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

export default function OnboardingForm({
  supabase,
  userId,
  initialValues,
  onComplete,
}) {
  const formRef = useRef(null);
  const {
    values,
    errors,
    formError,
    isSubmitting,
    handleFieldChange,
    handleSubmit,
  } = useOnboardingFormLogic({
    isOpen: true,
    supabase,
    userId,
    initialValues,
    onComplete,
    allowCancel: false,
    modalRef: formRef,
    trapFocus: false,
  });

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:py-10">
      <div className="mb-6 sm:mb-8">
        <h1
          style={{
            color: "#0F172A",
            fontSize: "24px",
            fontWeight: 800,
            fontFamily: "'Inter',sans-serif",
            marginBottom: "8px",
          }}
        >
          Complete Your Profile
        </h1>
        <p
          style={{
            color: "#475569",
            fontSize: "14px",
            lineHeight: 1.55,
            fontFamily: "'Inter',sans-serif",
          }}
        >
          Set up your details to start tracking your OJT hours.
        </p>
      </div>

      <GlassCard
        className="w-full"
        padding="24px"
        style={{
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.72), rgba(240,253,253,0.58))",
          border: "1px solid rgba(255,255,255,0.45)",
          boxShadow:
            "0 12px 34px rgba(15,23,42,0.16), inset 0 1px 0 rgba(255,255,255,0.72)",
        }}
      >
        <section ref={formRef} aria-labelledby="onboarding-title">
          <h2
            id="onboarding-title"
            style={{
              color: "#0F172A",
              fontSize: "16px",
              fontWeight: 800,
              fontFamily: "'Inter',sans-serif",
              marginBottom: "14px",
            }}
          >
            Onboarding Details
          </h2>

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

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              aria-disabled={isSubmitting}
              className="rounded-xl px-4 py-2.5"
              style={{
                background: isSubmitting
                  ? "rgba(148,163,184,0.22)"
                  : "linear-gradient(135deg,#069494,#0aacac)",
                border: "none",
                color: isSubmitting ? "#94A3B8" : "#fff",
                fontSize: "12px",
                fontWeight: 700,
                fontFamily: "'Inter',sans-serif",
                boxShadow: isSubmitting
                  ? "none"
                  : "0 4px 16px rgba(6,148,148,0.38)",
                cursor: isSubmitting ? "not-allowed" : "pointer",
              }}
            >
              {isSubmitting ? "Saving..." : "Save & Continue"}
            </button>
          </div>
        </section>
      </GlassCard>
    </div>
  );
}
