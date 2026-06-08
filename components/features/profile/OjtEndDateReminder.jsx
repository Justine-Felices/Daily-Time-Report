"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import OjtEndDateReminderModal from "@/components/features/profile/components/OjtEndDateReminderModal";
import {
  fetchUserProfileByUserId,
  isMissingOjtEndDate,
  isUserProfileOnboarded,
  updateUserOjtEndDateByUserId,
} from "@/lib/supabase-user-profiles";

const DISMISS_STORAGE_KEY = "dtr-ojt-end-date-dismissed";

function isDismissedThisSession() {
  if (typeof window === "undefined") return false;
  return window.sessionStorage.getItem(DISMISS_STORAGE_KEY) === "1";
}

export default function OjtEndDateReminder() {
  const [isOpen, setIsOpen] = useState(false);
  const [ojtStartDate, setOjtStartDate] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    let mounted = true;

    const loadProfile = async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (!mounted || authError || !user) return;

      const { data: profile, error: profileError } =
        await fetchUserProfileByUserId({
          supabase,
          userId: user.id,
        });

      if (!mounted || profileError || !profile) return;

      if (
        isUserProfileOnboarded(profile) &&
        isMissingOjtEndDate(profile) &&
        !isDismissedThisSession()
      ) {
        setUserId(user.id);
        setOjtStartDate(profile.ojt_start_date || "");
        setIsOpen(true);
      }
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  const handleDismiss = () => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(DISMISS_STORAGE_KEY, "1");
    }
    setIsOpen(false);
  };

  const handleSave = async (endDate) => {
    const supabase = createClient();
    if (!supabase || !userId) {
      setError("Unable to save right now. Please try again.");
      return;
    }

    setIsSaving(true);
    setError("");

    const { error: saveError } = await updateUserOjtEndDateByUserId({
      supabase,
      userId,
      endDate,
    });

    setIsSaving(false);

    if (saveError) {
      setError(saveError.message || "Failed to save your end date.");
      return;
    }

    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(DISMISS_STORAGE_KEY);
    }
    setIsOpen(false);
  };

  return (
    <OjtEndDateReminderModal
      isOpen={isOpen}
      ojtStartDate={ojtStartDate}
      onSave={handleSave}
      onDismiss={handleDismiss}
      isSaving={isSaving}
      error={error}
    />
  );
}
