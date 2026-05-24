import { ChevronDown, Filter, Search, TrendingUp } from "lucide-react";

const FIELD_STYLE = {
  background: "var(--surface-muted)",
  border: "1.5px solid var(--border-soft)",
  borderRadius: "12px",
  color: "var(--text-primary)",
  fontFamily: "'Inter',sans-serif",
  fontSize: "15px",
};

const SORT_BUTTON_STYLE = {
  padding: "11px 16px",
  background: "rgba(6,148,148,0.08)",
  border: "1.5px solid rgba(6,148,148,0.2)",
  color: "var(--accent-strong)",
  fontFamily: "'Inter',sans-serif",
  fontSize: "15px",
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
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={16}
            color="rgba(6,148,148,0.5)"
            className="absolute top-1/2 left-4 -translate-y-1/2"
          />
          <input
            type="text"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by date, status, notes..."
            className="w-full outline-none"
            style={{ ...FIELD_STYLE, padding: "11px 14px 11px 42px" }}
          />
        </div>

        <div className="relative sm:w-48">
          <Filter
            size={15}
            color="rgba(6,148,148,0.5)"
            className="absolute top-1/2 left-4 -translate-y-1/2"
          />
          <select
            value={filterStatus}
            onChange={(event) => onFilterStatusChange(event.target.value)}
            className="w-full appearance-none outline-none"
            style={{
              ...FIELD_STYLE,
              padding: "11px 36px 11px 38px",
              cursor: "pointer",
            }}
          >
            {statuses.map((statusValue) => (
              <option key={statusValue} value={statusValue}>
                {statusValue}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            color="#3b82f6"
            className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2"
          />
        </div>

        <button
          onClick={onToggleSort}
          className="flex items-center gap-2 rounded-xl transition-all"
          style={SORT_BUTTON_STYLE}
        >
          <TrendingUp size={15} />
          {sortDir === "desc" ? "Newest" : "Oldest"}
        </button>
      </div>
    );
}
