"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import PageShell from "@/components/layout/PageShell";
import OnboardingModal from "@/components/features/home/components/OnboardingModal";
import { createClient } from "@/lib/supabase/client";
import {
  fetchUserProfileByUserId,
  isUserProfileOnboarded,
  mapUserProfileToOnboardingValues,
} from "@/lib/supabase-user-profiles";

export default function OnboardingPageContent() {
  const router = useRouter();
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
        router.replace("/");
        return;
      }

      setUserId(user.id);
      setInitialValues(profile ? mapUserProfileToOnboardingValues(profile) : null);
      setIsLoading(false);
    };

    load();

    return () => {
      mounted = false;
    };
  }, [router, supabase]);

  if (!supabase) {
    return (
      <PageShell width="narrow">
        <div className="rounded-2xl border border-white/45 bg-white/70 px-5 py-4 text-sm text-slate-600 shadow-sm backdrop-blur-md">
          Supabase is not configured. Please set environment variables and refresh.
        </div>
      </PageShell>
    );
  }

  if (isLoading || !userId) {
    return (
      <PageShell width="narrow">
        <div className="rounded-2xl border border-white/45 bg-white/70 px-5 py-4 text-sm text-slate-600 shadow-sm backdrop-blur-md">
          Loading onboarding...
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell width="wide">
      <OnboardingModal
        isOpen
        mode="page"
        supabase={supabase}
        userId={userId}
        initialValues={initialValues}
        allowCancel={false}
      />
    </PageShell>
  );
}
