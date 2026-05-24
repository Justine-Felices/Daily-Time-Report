"use client";

import { PAGE_BACKGROUND_STYLE } from "@/lib/dtr-constants";
import OnboardingSidebar from "@/components/features/onboarding/OnboardingSidebar";

export default function OnboardingPageLayout({ currentStep, children }) {
  return (
    <div className="min-h-screen" style={PAGE_BACKGROUND_STYLE}>
      <div className="grid min-h-screen lg:grid-cols-[minmax(280px,38%)_1fr]">
        <div className="hidden lg:block">
          <OnboardingSidebar currentStep={currentStep} />
        </div>

        <div
          className="min-h-screen"
          style={{
            background: "var(--surface-card)",
            backdropFilter: "blur(16px)",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
