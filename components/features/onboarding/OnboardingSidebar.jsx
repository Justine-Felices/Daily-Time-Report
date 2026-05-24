"use client";

import { Check } from "lucide-react";
import BrandLogo from "@/components/ui/BrandLogo";
import { ONBOARDING_STEPS } from "@/components/features/onboarding/constants/onboarding-steps";

export default function OnboardingSidebar({ currentStep }) {
  const progressPct = Math.round((currentStep / ONBOARDING_STEPS.length) * 100);

  return (
    <aside
      className="flex flex-col justify-between px-6 py-8 sm:px-8 lg:px-10 lg:py-10"
      style={{
        background:
          "linear-gradient(160deg, #1e40af 0%, #3b82f6 55%, #1e3a8a 100%)",
        minHeight: "100%",
      }}
    >
      <div>
        <BrandLogo variant="light" align="left" className="mb-10 !items-start" />

        <p className="mb-6 text-xs font-bold tracking-widest text-white/60">
          SETUP · STEP {currentStep} OF {ONBOARDING_STEPS.length}
        </p>

        <div className="mb-8 h-1.5 overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${progressPct}%`,
              background: "linear-gradient(90deg, #ffffff, #f472b6)",
            }}
          />
        </div>

        <nav className="space-y-4" aria-label="Onboarding steps">
          {ONBOARDING_STEPS.map((step) => {
            const isComplete = step.id < currentStep;
            const isCurrent = step.id === currentStep;

            return (
              <div
                key={step.id}
                className="flex items-start gap-3"
                style={{ opacity: isComplete || isCurrent ? 1 : 0.55 }}
              >
                <span
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                  style={{
                    background: isComplete
                      ? "rgba(255,255,255,0.95)"
                      : isCurrent
                        ? "rgba(255,255,255,0.25)"
                        : "rgba(255,255,255,0.12)",
                    color: isComplete ? "#3b82f6" : "#ffffff",
                    border: isCurrent
                      ? "2px solid rgba(255,255,255,0.8)"
                      : "2px solid transparent",
                  }}
                >
                  {isComplete ? <Check size={12} strokeWidth={3} /> : step.id}
                </span>
                <div>
                  <p className="text-sm font-bold text-white">{step.title}</p>
                  <p className="text-xs text-white/70">{step.subtitle}</p>
                </div>
              </div>
            );
          })}
        </nav>
      </div>

      <p className="mt-8 hidden text-xs leading-relaxed text-white/60 lg:block">
        Your profile data is used to personalize your dashboard and generate
        official DTR exports.
      </p>
    </aside>
  );
}
