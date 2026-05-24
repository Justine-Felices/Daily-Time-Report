import { useState } from "react";
import { Building, GraduationCap, Mail, X, User } from "lucide-react";
import ProfileInputField from "@/components/features/profile/components/ProfileInputField";

const PERSONAL_FIELDS = [
  { key: "name", label: "FULL NAME", icon: User, type: "text" },
  { key: "email", label: "EMAIL ADDRESS", icon: Mail, type: "email" },
  { key: "department", label: "DEPARTMENT", icon: Building, type: "text" },
  {
    key: "position",
    label: "POSITION / ROLE",
    icon: GraduationCap,
    type: "text",
  },
  { key: "supervisor", label: "SUPERVISOR", icon: User, type: "text" },
];

export default function EditPersonalInfoModal({
  isOpen,
  profile,
  onClose,
  onSave,
}) {
  const [editProfile, setEditProfile] = useState(profile);

  const updateField = (field, value) => {
    setEditProfile((current) => ({ ...current, [field]: value }));
  };

  const handleSave = () => {
    onSave(editProfile);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">
      <div
        className="w-full max-w-md rounded-[28px] border p-6 sm:p-7"
        style={{
          background: "var(--surface-card)",
          backdropFilter: "blur(32px)",
          WebkitBackdropFilter: "blur(32px)",
          borderColor: "var(--border-soft)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        }}
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2
              style={{
                color: "var(--text-primary)",
                fontSize: "18px",
                fontWeight: 800,
                fontFamily: "'Inter', sans-serif",
                lineHeight: 1.1,
              }}
            >
              Edit Profile
            </h2>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "11px",
                fontWeight: 500,
                marginTop: "2px",
              }}
            >
              Update your personal identification
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl transition-all active:scale-95"
            style={{
              background: "var(--surface-muted)",
              border: "1px solid var(--border-soft)",
              color: "var(--text-muted)",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Fields */}
        <div className="space-y-5 mb-7 max-h-[60vh] overflow-y-auto px-1 custom-scrollbar">
          {PERSONAL_FIELDS.map((field) => (
            <ProfileInputField
              key={field.key}
              label={field.label}
              icon={field.icon}
              type={field.type}
              value={editProfile[field.key]}
              onChange={(value) => updateField(field.key, value)}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl border transition-all active:scale-95"
            style={{
              borderColor: "var(--border-soft)",
              background: "var(--surface-muted)",
              color: "var(--text-secondary)",
              fontSize: "13px",
              fontWeight: 700,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            CANCEL
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-3 rounded-xl text-white transition-all active:scale-95"
            style={{
              background: "var(--accent-strong)",
              fontSize: "13px",
              fontWeight: 700,
              fontFamily: "'Inter', sans-serif",
              boxShadow: "0 8px 20px rgba(59, 130, 246, 0.25)",
            }}
          >
            SAVE CHANGES
          </button>
        </div>
      </div>
    </div>
  );
}
