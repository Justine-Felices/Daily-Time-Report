import { Timer } from "lucide-react";
import StatCard from "@/components/features/home/components/StatCard";

const TITLE_STYLE = {
  color: "#1E293B",
  fontSize: "14px",
  fontWeight: 700,
  fontFamily: "'Inter',sans-serif",
};

export default function SummarySection({
  isLoading = false,
  todayHours,
  weekHours,
  monthHours,
  totalHours,
}) {
  const summaryItems = [
    {
      label: "TODAY HOURS",
      value: `${todayHours.toFixed(1)}h`,
      sub: "logged today",
      accent: true,
    },
    {
      label: "WEEK HOURS",
      value: `${weekHours.toFixed(1)}h`,
      sub: "this week",
      accent: false,
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

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {summaryItems.map((item) => (
          <StatCard
            key={item.label}
            isLoading={isLoading}
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
