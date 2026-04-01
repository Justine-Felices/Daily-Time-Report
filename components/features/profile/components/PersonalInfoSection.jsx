import {
  Building,
  GraduationCap,
  Mail,
  Phone,
  Shield,
  User,
  Edit3,
} from "lucide-react";
import GlassCard from "@/components/ui/cards/GlassCard";

const TITLE_STYLE = {
  color: "#1E293B",
  fontSize: "12px",
  fontWeight: 700,
  letterSpacing: "0.06em",
  fontFamily: "'Inter',sans-serif",
};

const PERSONAL_FIELDS = [
  { key: "name", label: "FULL NAME", icon: User },
  { key: "email", label: "EMAIL ADDRESS", icon: Mail },
  { key: "phone", label: "PHONE NUMBER", icon: Phone },
  { key: "department", label: "DEPARTMENT", icon: Building },
  {
    key: "position",
    label: "POSITION / ROLE",
    icon: GraduationCap,
  },
  { key: "supervisor", label: "SUPERVISOR", icon: User },
];

export default function PersonalInfoSection({ profile, onEditClick }) {
  return (
    <GlassCard padding="20px">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield size={13} color="#069494" />
          <span style={TITLE_STYLE}>PERSONAL INFORMATION</span>
        </div>
        <button
          onClick={onEditClick}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
          style={{
            color: "#069494",
            fontSize: "12px",
            fontWeight: 600,
            fontFamily: "'Inter',sans-serif",
          }}
        >
          <Edit3 size={14} />
          EDIT INFO
        </button>
      </div>

      <div className="space-y-4">
        {PERSONAL_FIELDS.map((field) => {
          const Icon = field.icon;
          return (
            <div key={field.key}>
              <label
                style={{
                  color: "#64748B",
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  fontFamily: "'Inter',sans-serif",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  marginBottom: "5px",
                }}
              >
                <Icon size={10} color="#069494" /> {field.label}
              </label>
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.7)",
                  border: "1px solid rgba(6, 148, 148, 0.18)",
                  color: "#1E293B",
                  fontSize: "14px",
                  fontFamily: "'Inter',sans-serif",
                  wordBreak: "break-word",
                }}
              >
                {profile[field.key]}
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
