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
      <div className="flex flex-row items-center gap-2 sm:gap-3">
        <div className="relative flex-[2]">
          <Search
            size={14}
            color="rgba(6,148,148,0.5)"
            className="absolute top-1/2 left-3 sm:left-4 -translate-y-1/2"
          />
          <input
            type="text"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search..."
            className="w-full outline-none text-[11px] sm:text-[15px] pl-8 pr-2.5 py-2.5 sm:pl-10 sm:pr-3.5 sm:py-[11px]"
            style={FIELD_STYLE}
          />
        </div>

        <div className="relative flex-1 sm:w-48 sm:flex-none">
          <Filter
            size={13}
            color="rgba(6,148,148,0.5)"
            className="absolute top-1/2 left-2.5 sm:left-4 -translate-y-1/2"
          />
          <select
            value={filterStatus}
            onChange={(event) => onFilterStatusChange(event.target.value)}
            className="w-full appearance-none outline-none text-[11px] sm:text-[15px] truncate pl-7 pr-6 py-2.5 sm:pl-9 sm:pr-9 sm:py-[11px]"
            style={{
              ...FIELD_STYLE,
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
            size={14}
            color="#3b82f6"
            className="pointer-events-none absolute top-1/2 right-2 sm:right-4 -translate-y-1/2"
          />
        </div>

        <button
          onClick={onToggleSort}
          className="flex items-center justify-center gap-1.5 rounded-xl transition-all flex-none px-3 py-[9px] sm:px-4 sm:py-[11px] text-[11px] sm:text-[15px]"
          style={SORT_BUTTON_STYLE}
        >
          <TrendingUp size={14} className="sm:w-[15px] sm:h-[15px]" />
          <span className="whitespace-nowrap">
            {sortDir === "desc" ? "New" : "Old"}
          </span>
        </button>
      </div>
    );
}
