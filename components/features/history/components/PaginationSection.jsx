const TEXT_STYLE = {
  color: "#64748B",
  fontSize: "12px",
  fontFamily: "'Inter',sans-serif",
};

export default function PaginationSection({
  currentPage,
  totalPages,
  filteredCount,
  pageSize,
  onPageChange,
}) {
  if (totalPages <= 1) {
    return null;
  }

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, filteredCount);

  return (
    <div className="flex items-center justify-between">
      <span style={TEXT_STYLE}>
        {start}-{end} of {filteredCount}
      </span>
      <div className="flex gap-1.5">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (pageNum) => (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className="flex h-8 w-8 items-center justify-center rounded-lg transition-all"
              style={{
                background:
                  pageNum === currentPage
                    ? "linear-gradient(135deg,#069494,#0aacac)"
                    : "rgba(255,255,255,0.7)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                color: pageNum === currentPage ? "#fff" : "#64748B",
                border:
                  pageNum === currentPage
                    ? "1px solid rgba(6,148,148,0.3)"
                    : "1px solid rgba(6,148,148,0.14)",
                cursor: "pointer",
                fontFamily: "'Inter',sans-serif",
                fontSize: "13px",
                fontWeight: 600,
                boxShadow:
                  pageNum === currentPage
                    ? "0 2px 8px rgba(6,148,148,0.3)"
                    : "none",
              }}
            >
              {pageNum}
            </button>
          ),
        )}
      </div>
    </div>
  );
}
