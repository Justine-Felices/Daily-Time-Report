import { ChevronDown } from "lucide-react";
import { GLASS_INPUT_STYLE } from "@/lib/dtr-constants";
import GlassCard from "@/components/ui/cards/GlassCard";

const LABEL_STYLE = {
  color: "#1E293B",
  fontSize: "12px",
  fontWeight: 700,
  letterSpacing: "0.06em",
  fontFamily: "'Inter',sans-serif",
  display: "block",
  marginBottom: "8px",
};

export default function StatusNoteSection({
  status,
  note,
  statusOptions,
  onStatusChange,
  onNoteChange,
}) {
  return (
    <GlassCard padding="20px">
      <label style={LABEL_STYLE}>STATUS</label>

      <div className="relative mb-4">
        <select
          value={status}
          onChange={(event) => onStatusChange(event.target.value)}
          className="w-full appearance-none"
          style={{
            ...GLASS_INPUT_STYLE,
            padding: "10px 40px 10px 14px",
            cursor: "pointer",
          }}
        >
          {statusOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <ChevronDown
          size={15}
          color="#069494"
          className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2"
        />
      </div>

      <label style={LABEL_STYLE}>NOTE (OPTIONAL)</label>

      <textarea
        rows={2}
        value={note}
        onChange={(event) => onNoteChange(event.target.value)}
        placeholder="Add any notes or remarks..."
        className="w-full resize-none"
        style={{ ...GLASS_INPUT_STYLE, padding: "10px 14px" }}
      />
    </GlassCard>
  );
}
