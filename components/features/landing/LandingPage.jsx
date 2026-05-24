"use client";

import LoginDecorBackground from "@/components/features/login/components/LoginDecorBackground";
import LandingNavbar from "@/components/features/landing/components/LandingNavbar";
import LandingHero from "@/components/features/landing/components/LandingHero";
import LandingFeatures from "@/components/features/landing/components/LandingFeatures";
import LandingHowItWorks from "@/components/features/landing/components/LandingHowItWorks";
import LandingCta from "@/components/features/landing/components/LandingCta";
import LandingFooter from "@/components/features/landing/components/LandingFooter";
import { PAGE_BACKGROUND_STYLE } from "@/lib/dtr-constants";

export default function LandingPage() {
  return (
    <div
      className="relative min-h-screen overflow-x-hidden"
      style={PAGE_BACKGROUND_STYLE}
    >
      <LoginDecorBackground />
      <div className="relative z-10">
        <LandingNavbar />
        <main>
          <LandingHero />
          <LandingFeatures />
          <LandingHowItWorks />
          <LandingCta />
        </main>
        <LandingFooter />
      </div>
    </div>
  );
}
