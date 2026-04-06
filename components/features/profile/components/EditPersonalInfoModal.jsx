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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 px-4">
      <div
        className="w-full max-w-md rounded-2xl border p-6"
        style={{
          background: "rgba(255,255,255,0.95)",
          border: "1px solid rgba(6, 148, 148, 0.2)",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2
            style={{
              color: "#1E293B",
              fontSize: "16px",
              fontWeight: 700,
              fontFamily: "'Inter',sans-serif",
            }}
          >
            Edit Personal Information
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Fields */}
        <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
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
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            style={{
              fontSize: "13px",
              fontWeight: 600,
              fontFamily: "'Inter',sans-serif",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 rounded-lg text-white hover:opacity-90 transition-opacity"
            style={{
              background: "linear-gradient(135deg, #069494 0%, #0a7a7a 100%)",
              fontSize: "13px",
              fontWeight: 600,
              fontFamily: "'Inter',sans-serif",
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
