import { Calendar } from "lucide-react";
import { GLASS_INPUT_STYLE } from "@/lib/dtr-constants";
import GlassCard from "@/components/ui/cards/GlassCard";

const LABEL_STYLE = {
  color: "#1E293B",
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
        <Calendar size={13} color="#069494" /> SELECT DATE
      </label>

      <input
        type="date"
        value={date}
        onChange={(event) => onDateChange(event.target.value)}
        max={maxDate}
        className="w-full"
        style={{ ...GLASS_INPUT_STYLE, padding: "10px 14px" }}
      />
    </GlassCard>
  );
}
