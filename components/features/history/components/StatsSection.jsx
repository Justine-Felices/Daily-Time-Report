import { CheckCircle, Clock, History as HistoryIcon } from "lucide-react";
import GlassCard from "@/components/ui/cards/GlassCard";

const LABEL_STYLE = {
  color: "#94A3B8",
  fontSize: "8px",
  fontWeight: 700,
  letterSpacing: "0.1em",
  fontFamily: "'Inter',sans-serif",
};

const VALUE_STYLE = {
  color: "#1E293B",
  fontSize: "20px",
  fontWeight: 800,
  fontFamily: "'Inter',sans-serif",
  letterSpacing: "-0.02em",
};

export default function StatsSection({ totalRecords, presentDays, hoursLogged }) {
  const cards = [
    {
      label: "TOTAL RECORDS",
      value: totalRecords,
      icon: HistoryIcon,
      color: "#069494",
    },
    {
      label: "PRESENT DAYS",
      value: presentDays,
      icon: CheckCircle,
      color: "#16A34A",
    },
    {
      label: "HOURS LOGGED",
      value: `${hoursLogged.toFixed(1)}h`,
      icon: Clock,
      color: "#FF69B4",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {cards.map(({ label, value, icon: Icon, color }) => (
        <GlassCard key={label} padding="16px">
          <div className="mb-2 flex items-center gap-1.5">
            <Icon size={12} color={color} />
            <span style={LABEL_STYLE}>{label}</span>
          </div>
          <div style={VALUE_STYLE}>{value}</div>
        </GlassCard>
      ))}
    </div>
  );
}
