"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import OnboardingForm from "@/components/features/onboarding/OnboardingForm";
import OnboardingPageLayout from "@/components/features/onboarding/OnboardingPageLayout";
import OnboardingPageSkeleton from "@/components/features/onboarding/OnboardingPageSkeleton";
import { createClient } from "@/lib/supabase/client";
import {
  fetchUserProfileByUserId,
  isUserProfileOnboarded,
  mapUserProfileToOnboardingValues,
} from "@/lib/supabase-user-profiles";
import { PAGE_BACKGROUND_STYLE } from "@/lib/dtr-constants";

export default function OnboardingPageContent() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const hasSupabaseConfig =
    typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
    /^https?:\/\//.test(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

  const supabase = useMemo(() => {
    if (!hasSupabaseConfig) return null;
    return createClient();
  }, [hasSupabaseConfig]);

  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    let mounted = true;

    const load = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (!mounted) return;

      if (userError || !user) {
        router.replace("/login");
        return;
      }

      const { data: profile } = await fetchUserProfileByUserId({
        supabase,
        userId: user.id,
      });

      if (!mounted) return;

      if (isUserProfileOnboarded(profile)) {
        router.replace("/dashboard");
        return;
      }

      setUserId(user.id);
      setInitialValues(
        profile ? mapUserProfileToOnboardingValues(profile) : null,
      );
      setIsLoading(false);
    };

    load();

    return () => {
      mounted = false;
    };
  }, [router, supabase]);

  if (!supabase) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4" style={PAGE_BACKGROUND_STYLE}>
        <div
          className="max-w-md rounded-2xl px-5 py-4 text-sm shadow-sm backdrop-blur-md"
          style={{
            background: "var(--surface-card)",
            border: "1px solid var(--border-soft)",
            color: "var(--text-muted)",
          }}
        >
          Supabase is not configured. Please set environment variables and
          refresh.
        </div>
      </div>
    );
  }

  if (isLoading || !userId) {
    return <OnboardingPageSkeleton />;
  }

  return (
    <OnboardingPageLayout currentStep={step}>
      <OnboardingForm
        supabase={supabase}
        userId={userId}
        initialValues={initialValues}
        step={step}
        setStep={setStep}
      />
    </OnboardingPageLayout>
  );
}
