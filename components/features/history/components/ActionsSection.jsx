import { Printer, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BUTTON_STYLE = {
  padding: "10px 18px",
  background: "var(--surface-card)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1.5px solid var(--border-soft)",
  color: "var(--accent-strong)",
  fontFamily: "'Inter',sans-serif",
  fontSize: "13px",
  fontWeight: 600,
  cursor: "pointer",
  boxShadow: "var(--shadow-soft)",
  letterSpacing: "0.02em",
  whiteSpace: "nowrap",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  borderRadius: "12px",
  transition: "all 0.2s ease",
};

export default function ActionsSection({ onPrint, availableMonths = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={BUTTON_STYLE}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--surface-hover)";
          e.currentTarget.style.borderColor = "var(--border-medium)";
        }}
        onMouseLeave={(e) => {
          if (!isOpen) {
            e.currentTarget.style.background = "var(--surface-card)";
            e.currentTarget.style.borderColor = "var(--border-soft)";
          }
        }}
      >
        <Printer size={14} />
        <span>Print DTR</span>
        <ChevronDown
          size={14}
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            className="absolute left-0 right-0 z-50 overflow-hidden border border-[var(--border-soft)] bg-[var(--surface-card)] shadow-xl"
            style={{
              borderRadius: "12px",
              marginTop: "4px",
              minWidth: "200px",
              backdropFilter: "blur(16px)",
            }}
          >
            <div className="p-1.5 flex flex-col gap-1">
              <button
                onClick={() => {
                  onPrint("all");
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg transition-colors hover:bg-[var(--surface-hover)] text-[13px] font-medium text-[var(--foreground-main)]"
              >
                All Records (Full History)
              </button>

              {availableMonths.length > 0 && (
                <div className="h-px bg-[var(--border-soft)] my-1 mx-2" />
              )}

              {availableMonths.map((month) => (
                <button
                  key={month.key}
                  onClick={() => {
                    onPrint(month.key);
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg transition-colors hover:bg-[var(--surface-hover)] text-[13px] font-medium text-[var(--foreground-main)]"
                >
                  {month.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
