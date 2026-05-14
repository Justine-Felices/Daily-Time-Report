import StatCard from "@/components/features/home/components/StatCard";

export default function StatsSection({
  totalRecords,
  presentDays,
  hoursLogged,
  isLoading = false,
}) {
  const hoursLoggedText =
    typeof hoursLogged === "number" ? `${hoursLogged.toFixed(1)}h` : "0.0h";

  const stats = [
    {
      label: "TOTAL RECORDS",
      value: totalRecords,
      sub: "entries found",
    },
    {
      label: "PRESENT DAYS",
      value: presentDays,
      sub: "days worked",
    },
    {
      label: "HOURS LOGGED",
      value: hoursLoggedText,
      sub: "total time",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4">
      {stats.map((stat) => (
        <StatCard
          key={stat.label}
          isLoading={isLoading}
          label={stat.label}
          value={stat.value}
          sub={stat.sub}
        />
      ))}
    </div>
  );
}
