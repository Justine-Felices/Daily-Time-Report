import { Calendar } from "lucide-react";
import GlassCard from "@/components/ui/cards/GlassCard";
import { GLASS_INPUT_STYLE } from "@/lib/dtr-constants";
import { formatReadableDate } from "@/lib/dtr-formatters";

const LABEL_STYLE = {
  color: "var(--text-primary)",
  fontSize: "12px",
  fontWeight: 700,
  letterSpacing: "0.06em",
  fontFamily: "'Inter',sans-serif",
  display: "flex",
  alignItems: "center",
  gap: "6px",
  marginBottom: "8px",
};

export default function DateSection({ date, maxDate, onDateChange }) {
  return (
    <GlassCard padding="20px">
      <label style={LABEL_STYLE}>
        <Calendar size={13} color="#3b82f6" /> SELECT DATE
      </label>

      <div className="relative">
        <input
          type="date"
          value={date}
          onChange={(event) => onDateChange(event.target.value)}
          max={maxDate}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div
          style={{
            ...GLASS_INPUT_STYLE,
            padding: "10px 14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "14px",
            fontWeight: 600,
            color: "var(--text-primary)",
          }}
        >
          <span>{formatReadableDate(date)}</span>
          <Calendar size={14} className="text-muted-foreground opacity-50" />
        </div>
      </div>
    </GlassCard>
  );
}
