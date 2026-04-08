"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import useTimedFlag from "@/hooks/useTimedFlag";
import { createClient } from "@/lib/supabase/client";
import PageShell from "@/components/layout/PageShell";
import useLocalAuth from "@/components/features/login/hooks/useLocalAuth";
import HeaderSection from "@/components/features/profile/components/HeaderSection";
import LogoutButton from "@/components/features/profile/components/LogoutButton";
import OJTDetailsSection from "@/components/features/profile/components/OJTDetailsSection";
import PersonalInfoSection from "@/components/features/profile/components/PersonalInfoSection";
import ProfileHeaderCard from "@/components/features/profile/components/ProfileHeaderCard";
import EditPersonalInfoModal from "@/components/features/profile/components/EditPersonalInfoModal";
import ThemeModeCard from "@/components/features/profile/components/ThemeModeCard";
import useThemeMode from "@/hooks/useThemeMode";

const EMPTY_PROFILE = {
  name: "",
  email: "",
  department: "",
  position: "",
  supervisor: "",
  company: "",
  ojt_start_date: "",
  ojt_end_date: "",
  target_hours: "",
};

function toDisplayDate(value) {
  if (!value) return "Not set";
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return "Not set";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function toInitials(name) {
  if (!name) return "--";

  const tokens = name.trim().split(/\s+/).filter(Boolean);

  if (tokens.length === 0) return "--";

  return tokens
    .slice(0, 2)
    .map((token) => token.charAt(0).toUpperCase())
    .join("");
}

export default function ProfileContent() {
  const router = useRouter();
  const { logout } = useLocalAuth();
  const hasSupabaseConfig =
    typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
    /^https?:\/\//.test(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

  const supabase = useMemo(() => {
    if (!hasSupabaseConfig) return null;
    return createClient();
  }, [hasSupabaseConfig]);

  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [, triggerSaved] = useTimedFlag(2500);
  const { mode, resolvedMode, setMode } = useThemeMode();

  useEffect(() => {
    if (!supabase) return;

    let mounted = true;

    const loadProfile = async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (!mounted || authError || !user) return;

      const { data, error } = await supabase
        .from("user_profiles")
        .select(
          "full_name, department, position, supervisor, company, ojt_start_date, ojt_end_date, target_hours",
        )
        .eq("user_id", user.id)
        .maybeSingle();

      if (!mounted || error || !data) return;

      setProfile((current) => ({
        ...current,
        name: data.full_name || "",
        email: user.email || "",
        department: data.department || "",
        position: data.position || "",
        supervisor: data.supervisor || "",
        company: data.company || "",
        ojt_start_date: data.ojt_start_date || "",
        ojt_end_date: data.ojt_end_date || "",
        target_hours:
          data.target_hours === null || typeof data.target_hours === "undefined"
            ? ""
            : String(data.target_hours),
      }));
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  const ojtDetails = [
    { label: "Start Date", value: toDisplayDate(profile.ojt_start_date) },
    { label: "End Date", value: toDisplayDate(profile.ojt_end_date) },
    {
      label: "Target Hours",
      value: profile.target_hours ? `${profile.target_hours} hours` : "Not set",
    },
    { label: "Company", value: profile.company || "Not set" },
  ];

  const handleSaveProfile = (updatedProfile) => {
    setProfile(updatedProfile);
    triggerSaved();
  };

  const handleLogout = async () => {
    const result = await logout();

    if (!result.error) {
      router.push("/login");
    }
  };

  return (
    <PageShell width="narrow">
      <HeaderSection
        title="My Profile"
        subtitle="Manage your personal information"
      />

      <ProfileHeaderCard
        name={profile.name}
        position={profile.position}
        department={profile.department}
        initials={toInitials(profile.name)}
      />

      <PersonalInfoSection
        profile={profile}
        onEditClick={() => setIsEditModalOpen(true)}
      />

      <OJTDetailsSection details={ojtDetails} />

      <ThemeModeCard
        mode={mode}
        resolvedMode={resolvedMode}
        onModeChange={setMode}
      />

      <LogoutButton onClick={handleLogout} />

      <EditPersonalInfoModal
        isOpen={isEditModalOpen}
        profile={profile}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveProfile}
      />
    </PageShell>
  );
}
