import {
  Building,
  GraduationCap,
  Mail,
  Shield,
  User,
  Edit3,
} from "lucide-react";
import GlassCard from "@/components/ui/cards/GlassCard";

const TITLE_STYLE = {
  color: "var(--text-primary)",
  fontSize: "12px",
  fontWeight: 800,
  letterSpacing: "0.06em",
  fontFamily: "'Inter',sans-serif",
};

const PERSONAL_FIELDS = [
  { key: "name", label: "FULL NAME", icon: User },
  { key: "email", label: "EMAIL ADDRESS", icon: Mail },
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
          <Shield size={13} className="text-blue-500" />
          <span style={TITLE_STYLE}>PERSONAL INFORMATION</span>
        </div>
        <button
          onClick={onEditClick}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-surface-muted transition-colors border border-soft"
          style={{
            color: "var(--accent-strong)",
            fontSize: "11px",
            fontWeight: 700,
            fontFamily: "'Inter',sans-serif",
          }}
        >
          <Edit3 size={13} />
          EDIT INFO
        </button>
      </div>

      <div className="space-y-5">
        {PERSONAL_FIELDS.map((field) => {
          const Icon = field.icon;
          return (
            <div key={field.key}>
              <label
                style={{
                  color: "var(--text-muted)",
                  fontSize: "9px",
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  fontFamily: "'Inter',sans-serif",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  marginBottom: "6px",
                }}
              >
                <Icon size={11} className="text-blue-500" /> {field.label}
              </label>
              <div
                style={{
                  padding: "12px 16px",
                  borderRadius: "14px",
                  background: "var(--surface-muted)",
                  border: "1px solid var(--border-soft)",
                  color: "var(--text-secondary)",
                  fontSize: "14px",
                  fontWeight: 500,
                  fontFamily: "'Inter',sans-serif",
                  wordBreak: "break-word",
                }}
              >
                {profile[field.key] || "---"}
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
