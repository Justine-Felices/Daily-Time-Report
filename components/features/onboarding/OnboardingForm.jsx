"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  Building,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  LogOut,
  Sparkles,
  Target,
  User,
  UserCheck,
} from "lucide-react";
import FieldError from "@/components/features/login/components/FieldError";
import ProfileInputField from "@/components/features/profile/components/ProfileInputField";
import useOnboardingFormLogic from "@/components/features/home/hooks/useOnboardingFormLogic";
import useLocalAuth from "@/components/features/login/hooks/useLocalAuth";
import { ONBOARDING_STEPS } from "@/components/features/onboarding/constants/onboarding-steps";

const PROFILE_FIELDS = [
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

const SCHEDULE_FIELDS = [
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
  step,
  setStep,
}) {
  const router = useRouter();
  const { logout } = useLocalAuth();
  const [stepError, setStepError] = useState("");

  const {
    values,
    errors,
    formError,
    isSubmitting,
    handleFieldChange,
    handleSubmit,
  } = useOnboardingFormLogic({
    supabase,
    userId,
    initialValues,
    onComplete,
  });

  const currentStepMeta = ONBOARDING_STEPS[step - 1];

  const activeFields = useMemo(() => {
    if (step === 2) return PROFILE_FIELDS;
    if (step === 3) return SCHEDULE_FIELDS;
    return [];
  }, [step]);

  const handleSignOut = async () => {
    const { error } = await logout();
    if (!error) {
      router.replace("/login");
    }
  };

  const handleNextStep = () => {
    if (step === 1) {
      setStepError("");
      setStep(2);
      return;
    }

    if (step === 2) {
      if (!values.full_name.trim()) {
        setStepError("Full name is required to continue.");
        return;
      }

      setStepError("");
      setStep(3);
    }
  };

  const handleBackStep = () => {
    setStepError("");
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleFinalSubmit = async () => {
    setStepError("");
    await handleSubmit();
  };

  return (
    <div className="flex min-h-full flex-col px-6 py-8 sm:px-10 sm:py-10">
      <div className="mb-6 flex items-center justify-end">
        <button
          type="button"
          onClick={handleSignOut}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-opacity hover:opacity-80"
          style={{ color: "var(--text-muted)" }}
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>

      <div className="mx-auto w-full max-w-lg flex-1">
        <div className="mb-2 flex items-center gap-2 lg:hidden">
          {ONBOARDING_STEPS.map((item) => (
            <div
              key={item.id}
              className="h-1.5 flex-1 rounded-full transition-all"
              style={{
                background:
                  item.id <= step
                    ? "linear-gradient(90deg, #3b82f6, #60a5fa)"
                    : "rgba(148,163,184,0.28)",
              }}
            />
          ))}
        </div>

        <span
          className="mb-3 inline-block rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide"
          style={{
            background: "rgba(59,130,246,0.12)",
            color: "var(--accent-strong)",
            border: "1px solid rgba(59,130,246,0.2)",
          }}
        >
          {currentStepMeta.badge}
        </span>

        <h1
          className="mb-2 text-2xl font-bold tracking-tight sm:text-3xl"
          style={{ color: "var(--text-primary)" }}
        >
          {currentStepMeta.title}
        </h1>
        <p
          className="mb-8 text-sm leading-relaxed"
          style={{ color: "var(--text-muted)" }}
        >
          {currentStepMeta.description}
        </p>

        {step === 1 ? (
          <div
            className="mb-8 rounded-2xl p-6"
            style={{
              background: "var(--surface-muted)",
              border: "1px solid var(--border-soft)",
            }}
          >
            <div className="mb-4 flex items-center gap-3">
              <span
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{
                  background: "rgba(59,130,246,0.15)",
                  color: "var(--accent-strong)",
                }}
              >
                <Sparkles size={20} />
              </span>
              <div>
                <p
                  className="text-sm font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  Welcome to JustIn Time Report
                </p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Your OJT daily time record companion
                </p>
              </div>
            </div>
            <ul
              className="space-y-2 text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              <li>Clock in and out with live session tracking</li>
              <li>Encode past attendance and view activity logs</li>
              <li>Export CS Form 48 DTR and PDF reports</li>
            </ul>
          </div>
        ) : (
          <section aria-labelledby="onboarding-form-title">
            <h2
              id="onboarding-form-title"
              className="mb-4 flex items-center gap-2 text-base font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              {step === 2 ? (
                <CircleUserRound size={16} color="var(--accent-strong)" />
              ) : (
                <Calendar size={16} color="var(--accent-strong)" />
              )}
              {step === 2 ? "Personal Information" : "OJT Details"}
            </h2>

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
          </section>
        )}

        <div className="mt-8 flex flex-wrap justify-between gap-2">
          <button
            type="button"
            onClick={handleBackStep}
            disabled={step === 1 || isSubmitting}
            className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              background: "var(--surface-muted)",
              border: "1px solid var(--border-soft)",
              color: "var(--text-secondary)",
            }}
          >
            <ChevronLeft size={14} /> Back
          </button>

          {step < 3 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold text-white"
              style={{
                background: "linear-gradient(135deg,#3b82f6,#60a5fa)",
                boxShadow: "0 4px 16px rgba(59,130,246,0.38)",
              }}
            >
              Next Step <ChevronRight size={14} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinalSubmit}
              disabled={isSubmitting}
              className="rounded-xl px-4 py-2.5 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-60 transition-all active:scale-95"
              style={{
                background: isSubmitting
                  ? "rgba(148,163,184,0.22)"
                  : "linear-gradient(135deg,#3b82f6,#60a5fa)",
                boxShadow: isSubmitting
                  ? "none"
                  : "0 4px 16px rgba(59,130,246,0.38)",
              }}
            >
              {isSubmitting ? "Saving..." : "Save & Continue"}
            </button>
          )}
        </div>

        {(stepError || formError) && (
          <div className="mt-3 flex justify-end animate-in fade-in slide-in-from-top-1 duration-300">
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
              style={{
                background: "rgba(220, 38, 38, 0.08)",
                border: "1px solid rgba(220, 38, 38, 0.15)",
                color: "#ef4444",
                fontSize: "10px",
                fontWeight: 800,
                letterSpacing: "0.02em",
                textTransform: "uppercase",
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              {stepError || formError}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
