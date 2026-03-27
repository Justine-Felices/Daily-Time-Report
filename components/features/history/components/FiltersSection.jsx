import { ChevronDown, Filter, Search, TrendingUp } from "lucide-react";
import GlassCard from "@/components/ui/cards/GlassCard";

const FIELD_STYLE = {
  background: "rgba(240,253,253,0.6)",
  border: "1.5px solid rgba(6,148,148,0.15)",
  borderRadius: "12px",
  color: "#1E293B",
  fontFamily: "'Inter',sans-serif",
  fontSize: "13px",
};

const SORT_BUTTON_STYLE = {
  padding: "9px 14px",
  background: "rgba(6,148,148,0.08)",
  border: "1.5px solid rgba(6,148,148,0.2)",
  color: "#069494",
  fontFamily: "'Inter',sans-serif",
  fontSize: "13px",
  fontWeight: 600,
  cursor: "pointer",
  borderRadius: "12px",
};

export default function FiltersSection({
  search,
  filterStatus,
  sortDir,
  statuses,
  onSearchChange,
  onFilterStatusChange,
  onToggleSort,
}) {
  return (
    <GlassCard padding="16px">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={14}
            color="rgba(6,148,148,0.5)"
            className="absolute top-1/2 left-3 -translate-y-1/2"
          />
          <input
            type="text"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by date, status, notes..."
            className="w-full outline-none"
            style={{ ...FIELD_STYLE, padding: "9px 12px 9px 34px" }}
          />
        </div>

        <div className="relative sm:w-48">
          <Filter
            size={13}
            color="rgba(6,148,148,0.5)"
            className="absolute top-1/2 left-3 -translate-y-1/2"
          />
          <select
            value={filterStatus}
            onChange={(event) => onFilterStatusChange(event.target.value)}
            className="w-full appearance-none outline-none"
            style={{ ...FIELD_STYLE, padding: "9px 36px 9px 32px", cursor: "pointer" }}
          >
            {statuses.map((statusValue) => (
              <option key={statusValue} value={statusValue}>
                {statusValue}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            color="#069494"
            className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2"
          />
        </div>

        <button
          onClick={onToggleSort}
          className="flex items-center gap-2 rounded-xl transition-all"
          style={SORT_BUTTON_STYLE}
        >
          <TrendingUp size={13} />
          {sortDir === "desc" ? "Newest" : "Oldest"}
        </button>
      </div>
    </GlassCard>
  );
}
