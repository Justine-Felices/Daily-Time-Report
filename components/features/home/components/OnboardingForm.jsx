"use client";

import { useMemo, useRef, useState } from "react";
import {
  Briefcase,
  Building,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  Target,
  User,
  UserCheck,
} from "lucide-react";
import GlassCard from "@/components/ui/cards/GlassCard";
import FieldError from "@/components/features/login/components/FieldError";
import ProfileInputField from "@/components/features/profile/components/ProfileInputField";
import useOnboardingFormLogic from "@/components/features/home/hooks/useOnboardingFormLogic";

const STEP_ONE_FIELDS = [
  {
    key: "full_name",
    label: "FULL NAME",
    icon: User,
    type: "text",
    required: true,
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
];

const STEP_TWO_FIELDS = [
  {
    key: "start_date",
    label: "START OF OJT",
    icon: Calendar,
    type: "date",
    required: false,
  },
  {
    key: "end_date",
    label: "EXPECTED COMPLETION",
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
  const [step, setStep] = useState(1);
  const [stepError, setStepError] = useState("");

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

  const activeFields = useMemo(
    () => (step === 1 ? STEP_ONE_FIELDS : STEP_TWO_FIELDS),
    [step],
  );

  const handleNextStep = () => {
    if (!values.full_name.trim()) {
      setStepError("Full name is required to continue.");
      return;
    }

    setStepError("");
    setStep(2);
  };

  const handleBackStep = () => {
    setStepError("");
    setStep(1);
  };

  const handleFinalSubmit = async () => {
    setStepError("");
    await handleSubmit();
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:py-10">
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
          <div
            className="mb-6 rounded-2xl px-5 py-5 sm:px-8"
            style={{
              background:
                "linear-gradient(125deg, rgba(224,247,249,0.55), rgba(255,255,255,0.42))",
              border: "1px solid rgba(255,255,255,0.55)",
            }}
          >
            <div className="mb-3 flex flex-col items-center gap-2">
              <span
                style={{
                  color: "#64748B",
                  fontSize: "12px",
                  fontWeight: 700,
                  fontFamily: "'Inter',sans-serif",
                  letterSpacing: "0.06em",
                }}
              >
                Step {step} of 2
              </span>
              <div className="flex items-center gap-1.5">
                {[1, 2].map((item) => (
                  <div
                    key={item}
                    className="h-2 rounded-full transition-all duration-200"
                    style={{
                      width: item === step ? "28px" : "14px",
                      background:
                        item <= step
                          ? "linear-gradient(135deg,#069494,#0ea5a5)"
                          : "rgba(148,163,184,0.28)",
                    }}
                  />
                ))}
              </div>
            </div>

            <h1
              style={{
                color: "#0F172A",
                fontSize: "clamp(24px, 4vw, 32px)",
                fontWeight: 700,
                fontFamily: "'Inter',sans-serif",
                marginBottom: "8px",
                lineHeight: 1.05,
                textAlign: "center",
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
                textAlign: "center",
              }}
            >
              Set up your details to start tracking your OJT hours.
            </p>
          </div>

          <div className="flex flex-col">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2
                id="onboarding-title"
                className="flex items-center gap-2"
                style={{
                  color: "#0F172A",
                  fontSize: "16px",
                  fontWeight: 700,
                  fontFamily: "'Inter',sans-serif",
                }}
              >
                {step === 1 ? (
                  <CircleUserRound size={15} color="#069494" />
                ) : (
                  <Calendar size={15} color="#069494" />
                )}
                {step === 1 ? "Personal Information" : "OJT Details"}
              </h2>

              <span
                className="rounded-full px-2.5 py-1"
                style={{
                  background: "rgba(6,148,148,0.12)",
                  border: "1px solid rgba(6,148,148,0.2)",
                  color: "#0F766E",
                  fontSize: "10px",
                  fontWeight: 700,
                  fontFamily: "'Inter',sans-serif",
                  letterSpacing: "0.05em",
                }}
              >
                {step === 1 ? "PROFILE" : "SCHEDULE"}
              </span>
            </div>

            <div className="pr-1">
              <div className="grid grid-cols-1 gap-4">
                {activeFields.map((field) => (
                  <div key={field.key}>
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

              {stepError && <FieldError msg={stepError} />}
              {formError && <FieldError msg={formError} />}
            </div>

            <div className="mt-6 flex flex-wrap justify-between gap-2">
            <button
              type="button"
              onClick={handleBackStep}
              disabled={step === 1 || isSubmitting}
              className="rounded-xl px-4 py-2.5"
              style={{
                background: "rgba(148,163,184,0.16)",
                border: "1px solid rgba(148,163,184,0.28)",
                color: step === 1 || isSubmitting ? "#94A3B8" : "#475569",
                fontSize: "12px",
                fontWeight: 700,
                fontFamily: "'Inter',sans-serif",
                cursor:
                  step === 1 || isSubmitting ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <ChevronLeft size={14} /> Back
            </button>

            {step === 1 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="rounded-xl px-4 py-2.5"
                style={{
                  background: "linear-gradient(135deg,#069494,#0aacac)",
                  border: "none",
                  color: "#fff",
                  fontSize: "12px",
                  fontWeight: 700,
                  fontFamily: "'Inter',sans-serif",
                  boxShadow: "0 4px 16px rgba(6,148,148,0.38)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                Next Step <ChevronRight size={14} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinalSubmit}
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
            )}
            </div>
          </div>
        </section>
      </GlassCard>
    </div>
  );
}
