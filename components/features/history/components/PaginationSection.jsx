import { ChevronLeft, ChevronRight } from "lucide-react";

const TEXT_STYLE = {
  color: "var(--text-muted)",
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

  // Pagination Window Logic
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, startPage + 4);

      if (endPage === totalPages) {
        startPage = Math.max(1, endPage - 4);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  const ButtonStyle = (isActive, isDisabled = false) => ({
    background: isActive
      ? "linear-gradient(135deg,#3b82f6,#2563eb)"
      : "var(--surface-muted)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    color: isActive ? "#fff" : isDisabled ? "rgba(255,255,255,0.1)" : "var(--text-muted)",
    border: isActive
      ? "1px solid rgba(59,130,246,0.3)"
      : "1px solid rgba(59,130,246,0.14)",
    cursor: isDisabled ? "not-allowed" : "pointer",
    fontFamily: "'Inter',sans-serif",
    fontSize: "13px",
    fontWeight: 600,
    boxShadow: isActive ? "0 2px 8px rgba(6,148,148,0.3)" : "none",
    opacity: isDisabled ? 0.5 : 1,
  });

  return (
    <div className="flex items-center justify-between mt-4">
      <span style={TEXT_STYLE}>
        {start}-{end} of {filteredCount}
      </span>
      <div className="flex items-center gap-1.5">
        {/* Previous Button */}
        <button
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex h-8 w-8 items-center justify-center rounded-lg transition-all"
          style={ButtonStyle(false, currentPage === 1)}
        >
          <ChevronLeft size={16} />
        </button>

        {/* Page Numbers */}
        {pageNumbers.map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-all"
            style={ButtonStyle(pageNum === currentPage)}
          >
            {pageNum}
          </button>
        ))}

        {/* Next Button */}
        <button
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex h-8 w-8 items-center justify-center rounded-lg transition-all"
          style={ButtonStyle(false, currentPage === totalPages)}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
