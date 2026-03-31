"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useTimedFlag from "@/hooks/useTimedFlag";
import PageShell from "@/components/layout/PageShell";
import useLocalAuth from "@/components/features/login/hooks/useLocalAuth";
import HeaderSection from "@/components/features/profile/components/HeaderSection";
import LogoutButton from "@/components/features/profile/components/LogoutButton";
import OJTDetailsSection from "@/components/features/profile/components/OJTDetailsSection";
import PersonalInfoSection from "@/components/features/profile/components/PersonalInfoSection";
import PreferencesSection from "@/components/features/profile/components/PreferencesSection";
import ProfileHeaderCard from "@/components/features/profile/components/ProfileHeaderCard";
import SaveButton from "@/components/features/profile/components/SaveButton";

const OJT_DETAILS = [
  { label: "Start Date", value: "Jan 15, 2026" },
  { label: "End Date", value: "May 30, 2026" },
  { label: "Target Hours", value: "500 hours" },
  { label: "Company", value: "TechCorp Inc." },
];

export default function ProfileContent() {
  const router = useRouter();
  const { logout } = useLocalAuth();
  const [profile, setProfile] = useState({
    name: "Alex Rivera",
    email: "alex.rivera@company.com",
    department: "Information Technology",
    position: "OJT Trainee",
    phone: "+63 912 345 6789",
    supervisor: "Ms. Maria Santos",
  });
  const [notif, setNotif] = useState(true);
  const [saved, triggerSaved] = useTimedFlag(2500);

  const updateField = (field, value) => {
    setProfile((current) => ({ ...current, [field]: value }));
  };

  const handleSave = () => {
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
        subtitle="Manage your personal information and preferences"
      />

      <ProfileHeaderCard
        name={profile.name}
        position={profile.position}
        department={profile.department}
        initials="AR"
      />

      <PersonalInfoSection
        profile={profile}
        onFieldChange={updateField}
        saveButton={<SaveButton saved={saved} onSave={handleSave} />}
      />

      <PreferencesSection
        notif={notif}
        onToggleNotif={() => setNotif((value) => !value)}
      />

      <OJTDetailsSection details={OJT_DETAILS} />

      <LogoutButton onClick={handleLogout} />
    </PageShell>
  );
}
