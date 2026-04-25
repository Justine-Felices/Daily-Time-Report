export const PAGE_BACKGROUND_STYLE = {
  background: "var(--page-bg)",
};

export const GLASS_STYLE = {
  background: "var(--surface-card)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1px solid var(--border-soft)",
  borderRadius: "24px",
  boxShadow: "inset 1px 0 0 rgba(255,255,255,0.1), inset -1px 0 0 rgba(255,255,255,0.1), var(--shadow-soft)",
};

export const GLASS_INPUT_STYLE = {
  background: "var(--surface-muted)",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
  border: "1.5px solid var(--border-soft)",
  borderRadius: "12px",
  color: "var(--text-primary)",
  fontFamily: "'Inter',sans-serif",
  fontSize: "14px",
  outline: "none",
};

export const STATUS_OPTIONS = [
  "Regular Duty Day",
  "Sick Leave",
  "Vacation Leave",
  "Absent",
  "Holiday",
  "Half Day",
  "Work From Home",
  "On Field",
];

export const HISTORY_STORAGE_KEY = "dtr-history-records";

export const STATUS_COLORS = {
  "Regular Duty Day": { bg: "rgba(34,197,94,0.1)", color: "#16A34A" },
  "Sick Leave": { bg: "rgba(249,115,22,0.1)", color: "#EA580C" },
  "Vacation Leave": { bg: "rgba(139,92,246,0.1)", color: "#7C3AED" },
  Absent: { bg: "rgba(239,68,68,0.12)", color: "#DC2626" },
  Holiday: { bg: "rgba(6,148,148,0.1)", color: "#069494" },
  "Half Day": { bg: "rgba(245,158,11,0.1)", color: "#D97706" },
  "Work From Home": { bg: "rgba(16,185,129,0.1)", color: "#059669" },
  "On Field": { bg: "rgba(255,105,180,0.12)", color: "#CC3388" },
  Weekend: { bg: "rgba(148,163,184,0.1)", color: "#94A3B8" },
};

export const SAMPLE_HISTORY = [
  {
    id: "h-1",
    date: "2026-03-24",
    amIn: "08:00 AM",
    amOut: "12:00 PM",
    pmIn: "01:00 PM",
    pmOut: "05:00 PM",
    status: "Regular Duty Day",
    note: "Completed documentation tasks",
    totalHours: 8,
  },
  {
    id: "h-2",
    date: "2026-03-23",
    amIn: "08:15 AM",
    amOut: "12:00 PM",
    pmIn: "01:15 PM",
    pmOut: "04:45 PM",
    status: "Regular Duty Day",
    note: "Frontend implementation",
    totalHours: 7.5,
  },
  {
    id: "h-3",
    date: "2026-03-22",
    amIn: "08:00 AM",
    amOut: "12:00 PM",
    pmIn: null,
    pmOut: null,
    status: "Sick Leave",
    note: "Half-day leave",
    totalHours: 4,
  },
];

export const PRINT_CSS = `
@media print {
  @page { size: A4; margin: 18mm 16mm; }
  nav, .no-print { display: none !important; }
  .screen-content { display: none !important; }
  .print-dtr { display: block !important; }
  body {
    background: #fff !important;
    font-family: 'Times New Roman', Times, serif !important;
    color: #000 !important;
    font-size: 11pt !important;
  }
  * {
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    box-shadow: none !important;
    text-shadow: none !important;
  }
  .print-dtr table { border-collapse: collapse; width: 100%; }
  .print-dtr th, .print-dtr td { border: 1px solid #000; padding: 4px 6px; font-size: 9pt; }
  .print-dtr th { background: #f0f0f0 !important; font-weight: bold; text-align: center; }
  .print-dtr td { text-align: center; }
}
.print-dtr { display: none; }
`;
