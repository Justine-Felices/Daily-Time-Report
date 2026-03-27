import { Bell } from "lucide-react";
import GlassCard from "@/components/ui/cards/GlassCard";
import ToggleSwitch from "@/components/features/profile/components/ToggleSwitch";

const SECTION_TITLE_STYLE = {
  color: "#1E293B",
  fontSize: "12px",
  fontWeight: 700,
  letterSpacing: "0.06em",
  fontFamily: "'Inter',sans-serif",
};

const LABEL_STYLE = {
  color: "#1E293B",
  fontSize: "13px",
  fontWeight: 600,
  fontFamily: "'Inter',sans-serif",
};

const DESC_STYLE = {
  color: "#64748B",
  fontSize: "11px",
  fontFamily: "'Inter',sans-serif",
  marginTop: "1px",
};

export default function PreferencesSection({ notif, onToggleNotif }) {
  return (
    <GlassCard padding="20px">
      <div className="mb-4 flex items-center gap-2">
        <Bell size={13} color="#FF69B4" />
        <span style={SECTION_TITLE_STYLE}>PREFERENCES</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <div style={LABEL_STYLE}>Reminder Notifications</div>
          <div style={DESC_STYLE}>Daily reminders to log your attendance</div>
        </div>

        <ToggleSwitch checked={notif} onToggle={onToggleNotif} />
      </div>
    </GlassCard>
  );
}
