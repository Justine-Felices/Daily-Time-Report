"use client";

import { useState } from "react";
import {
  Bell,
  Building,
  CheckCircle2,
  GraduationCap,
  LogOut,
  Mail,
  Phone,
  Save,
  Shield,
  User,
} from "lucide-react";
import useTimedFlag from "@/hooks/useTimedFlag";
import PageShell from "@/components/layout/PageShell";
import GlassCard from "@/components/ui/cards/GlassCard";
import ProfileInputField from "@/components/features/dtr/profile/ProfileInputField";

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

const OJT_DETAILS = [
  { label: "Start Date", value: "Jan 15, 2026" },
  { label: "End Date", value: "May 30, 2026" },
  { label: "Target Hours", value: "500 hours" },
  { label: "Company", value: "TechCorp Inc." },
];

export default function ProfileContent() {
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

  return (
    <PageShell width="narrow">
      <div>
        <div className="mb-1 flex items-center gap-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-xl"
            style={{
              background: "linear-gradient(135deg,#FF69B4,#069494)",
              boxShadow: "0 4px 12px rgba(255,105,180,0.35)",
            }}
          >
            <User size={15} color="#fff" />
          </div>
          <h1
            style={{
              color: "#1E293B",
              fontFamily: "'Inter',sans-serif",
              margin: 0,
            }}
          >
            My Profile
          </h1>
        </div>
        <p
          style={{
            color: "#64748B",
            fontSize: "13px",
            fontFamily: "'Inter',sans-serif",
            margin: 0,
          }}
        >
          Manage your personal information and preferences
        </p>
      </div>

      <GlassCard padding={0} style={{ overflow: "hidden" }}>
        <div
          style={{
            height: "96px",
            background:
              "linear-gradient(135deg, #046060 0%, #069494 45%, #FF69B4 100%)",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: "24px",
              top: "12px",
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "rgba(0,240,255,0.2)",
              filter: "blur(20px)",
            }}
          />
        </div>

        <div style={{ padding: "0 24px 20px", position: "relative" }}>
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "18px",
              background: "linear-gradient(135deg,#FF69B4,#069494)",
              border: "3px solid #fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              top: "-36px",
              left: "24px",
              boxShadow: "0 8px 24px rgba(255,105,180,0.4)",
            }}
          >
            <span
              style={{
                color: "#fff",
                fontSize: "24px",
                fontWeight: 800,
                fontFamily: "'Inter',sans-serif",
              }}
            >
              AR
            </span>
          </div>

          <div style={{ paddingTop: "46px" }}>
            <div
              style={{
                color: "#1E293B",
                fontSize: "18px",
                fontWeight: 700,
                fontFamily: "'Inter',sans-serif",
                letterSpacing: "-0.02em",
              }}
            >
              {profile.name}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span
                style={{
                  background: "rgba(6,148,148,0.1)",
                  color: "#069494",
                  fontSize: "11px",
                  fontWeight: 600,
                  fontFamily: "'Inter',sans-serif",
                  border: "1px solid rgba(6,148,148,0.2)",
                  padding: "2px 10px",
                  borderRadius: "999px",
                }}
              >
                {profile.position}
              </span>
              <span
                style={{
                  color: "#64748B",
                  fontSize: "12px",
                  fontFamily: "'Inter',sans-serif",
                }}
              >
                {profile.department}
              </span>
            </div>
          </div>
        </div>
      </GlassCard>

      <GlassCard padding="20px">
        <div className="mb-5 flex items-center gap-2">
          <Shield size={13} color="#069494" />
          <span
            style={{
              color: "#1E293B",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.06em",
              fontFamily: "'Inter',sans-serif",
            }}
          >
            PERSONAL INFORMATION
          </span>
        </div>

        <div className="space-y-4">
          {PERSONAL_FIELDS.map((field) => (
            <ProfileInputField
              key={field.key}
              label={field.label}
              icon={field.icon}
              type={field.type}
              value={profile[field.key]}
              onChange={(value) => updateField(field.key, value)}
            />
          ))}
        </div>

        <button
          onClick={() => triggerSaved()}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 transition-all duration-200"
          style={{
            background: saved
              ? "linear-gradient(135deg,#22C55E,#16A34A)"
              : "linear-gradient(135deg,#069494,#0aacac)",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontFamily: "'Inter',sans-serif",
            fontSize: "13px",
            fontWeight: 600,
            boxShadow: saved
              ? "0 4px 12px rgba(34,197,94,0.35)"
              : "0 4px 14px rgba(6,148,148,0.35)",
          }}
        >
          {saved ? (
            <>
              <CheckCircle2 size={14} /> Changes Saved!
            </>
          ) : (
            <>
              <Save size={14} /> Save Changes
            </>
          )}
        </button>
      </GlassCard>

      <GlassCard padding="20px">
        <div className="mb-4 flex items-center gap-2">
          <Bell size={13} color="#FF69B4" />
          <span
            style={{
              color: "#1E293B",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.06em",
              fontFamily: "'Inter',sans-serif",
            }}
          >
            PREFERENCES
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div
              style={{
                color: "#1E293B",
                fontSize: "13px",
                fontWeight: 600,
                fontFamily: "'Inter',sans-serif",
              }}
            >
              Reminder Notifications
            </div>
            <div
              style={{
                color: "#64748B",
                fontSize: "11px",
                fontFamily: "'Inter',sans-serif",
                marginTop: "1px",
              }}
            >
              Daily reminders to log your attendance
            </div>
          </div>

          <button
            onClick={() => setNotif((value) => !value)}
            className="shrink-0 rounded-full transition-all duration-200"
            style={{
              width: "46px",
              height: "26px",
              padding: "3px",
              background: notif
                ? "linear-gradient(135deg,#FF69B4,#069494)"
                : "rgba(148,163,184,0.2)",
              border: notif
                ? "1px solid rgba(255,105,180,0.35)"
                : "1px solid rgba(148,163,184,0.3)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: notif ? "flex-end" : "flex-start",
              boxShadow: notif ? "0 2px 8px rgba(255,105,180,0.38)" : "none",
            }}
          >
            <div
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                background: "#fff",
                boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
              }}
            />
          </button>
        </div>
      </GlassCard>

      <div
        style={{
          borderRadius: "20px",
          padding: "20px",
          background:
            "linear-gradient(135deg, rgba(6,148,148,0.1), rgba(0,240,255,0.08))",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(6,148,148,0.2)",
          boxShadow: "0 4px 20px rgba(6,148,148,0.08)",
        }}
      >
        <div className="mb-3 flex items-center gap-2">
          <GraduationCap size={14} color="#069494" />
          <span
            style={{
              color: "#046060",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.06em",
              fontFamily: "'Inter',sans-serif",
            }}
          >
            OJT DETAILS
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {OJT_DETAILS.map(({ label, value }) => (
            <div key={label}>
              <div
                style={{
                  color: "#FF69B4",
                  fontSize: "9px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  fontFamily: "'Inter',sans-serif",
                  marginBottom: "2px",
                }}
              >
                {label.toUpperCase()}
              </div>
              <div
                style={{
                  color: "#046060",
                  fontSize: "13px",
                  fontWeight: 600,
                  fontFamily: "'Inter',sans-serif",
                }}
              >
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 transition-all"
        style={{
          background: "rgba(255,105,180,0.08)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1.5px solid rgba(255,105,180,0.22)",
          color: "#CC2277",
          fontFamily: "'Inter',sans-serif",
          fontSize: "13px",
          fontWeight: 600,
          cursor: "pointer",
          borderRadius: "12px",
        }}
        onMouseEnter={(event) => {
          event.currentTarget.style.background = "rgba(255,105,180,0.16)";
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.background = "rgba(255,105,180,0.08)";
        }}
      >
        <LogOut size={14} /> Sign Out
      </button>
    </PageShell>
  );
}
