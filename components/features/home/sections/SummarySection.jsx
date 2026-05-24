import { PieChart } from "lucide-react";
import StatCard from "@/components/features/home/components/StatCard";

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
    },
    {
      label: "WEEK HOURS",
      value: `${weekHours.toFixed(1)}h`,
      sub: "this week",
    },
    {
      label: "MONTH HOURS",
      value: `${monthHours.toFixed(0)}h`,
      sub: "this month",
    },
    {
      label: "TOTAL HOURS",
      value: `${totalHours.toFixed(0)}h`,
      sub: "all-time",
    },
  ];

  return (
    <div>
      <div className="mb-3 flex items-center gap-2 px-0.5">
        <PieChart size={17} className="text-[#3b82f6]" strokeWidth={2.25} />
        <span
          className="text-[17px] font-bold text-white"
          style={{ fontFamily: "var(--font-geist-sans), Inter, sans-serif" }}
        >
          Summary
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
        {summaryItems.map((item) => (
          <StatCard
            key={item.label}
            isLoading={isLoading}
            label={item.label}
            value={item.value}
            sub={item.sub}
          />
        ))}
      </div>
    </div>
  );
}
