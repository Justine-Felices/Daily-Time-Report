import { Timer } from "lucide-react";
import StatCard from "@/components/features/home/components/StatCard";

const TITLE_STYLE = {
  color: "#1E293B",
  fontSize: "14px",
  fontWeight: 700,
  fontFamily: "'Inter',sans-serif",
};

export default function SummarySection({ todayHours, monthHours, totalHours }) {
  const summaryItems = [
    {
      label: "TODAY HOURS",
      value: `${todayHours.toFixed(1)}h`,
      sub: "logged today",
      accent: true,
    },
    {
      label: "MONTH HOURS",
      value: `${monthHours.toFixed(0)}h`,
      sub: "this month",
      accent: false,
    },
    {
      label: "TOTAL HOURS",
      value: `${totalHours.toFixed(0)}h`,
      sub: "all-time",
      accent: false,
    },
  ];

  return (
    <div>
      <div className="mb-3 flex items-center gap-2 px-1">
        <Timer size={15} color="#069494" />
        <span style={TITLE_STYLE}>Summary</span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {summaryItems.map((item) => (
          <StatCard
            key={item.label}
            label={item.label}
            value={item.value}
            sub={item.sub}
            accent={item.accent}
          />
        ))}
      </div>
    </div>
  );
}
