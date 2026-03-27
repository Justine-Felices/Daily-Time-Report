import { Building, GraduationCap, Mail, Phone, Shield, User } from "lucide-react";
import GlassCard from "@/components/ui/cards/GlassCard";
import ProfileInputField from "@/components/features/profile/components/ProfileInputField";

const TITLE_STYLE = {
  color: "#1E293B",
  fontSize: "12px",
  fontWeight: 700,
  letterSpacing: "0.06em",
  fontFamily: "'Inter',sans-serif",
};

const PERSONAL_FIELDS = [
  { key: "name", label: "FULL NAME", icon: User, type: "text" },
  { key: "email", label: "EMAIL ADDRESS", icon: Mail, type: "email" },
  { key: "phone", label: "PHONE NUMBER", icon: Phone, type: "tel" },
  { key: "department", label: "DEPARTMENT", icon: Building, type: "text" },
  {
    key: "position",
    label: "POSITION / ROLE",
    icon: GraduationCap,
    type: "text",
  },
  { key: "supervisor", label: "SUPERVISOR", icon: User, type: "text" },
];

export default function PersonalInfoSection({ profile, onFieldChange, saveButton }) {
  return (
    <GlassCard padding="20px">
      <div className="mb-5 flex items-center gap-2">
        <Shield size={13} color="#069494" />
        <span style={TITLE_STYLE}>PERSONAL INFORMATION</span>
      </div>

      <div className="space-y-4">
        {PERSONAL_FIELDS.map((field) => (
          <ProfileInputField
            key={field.key}
            label={field.label}
            icon={field.icon}
            type={field.type}
            value={profile[field.key]}
            onChange={(value) => onFieldChange(field.key, value)}
          />
        ))}
      </div>

      {saveButton}
    </GlassCard>
  );
}
