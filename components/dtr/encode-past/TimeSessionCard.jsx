import { Clock } from "lucide-react";
import GlassCard from "@/components/dtr/shared/GlassCard";
import { GLASS_INPUT_STYLE } from "@/lib/dtr-constants";

export default function TimeSessionCard({
  title,
  color,
  inValue,
  outValue,
  onInChange,
  onOutChange,
}) {
  return (
    <GlassCard padding="20px">
      <div className="mb-4 flex items-center gap-2">
        <div
          className="h-2.5 w-2.5 rounded-full"
          style={{
            background: color,
            boxShadow: `0 0 8px ${color}55`,
          }}
        />
        <span
          style={{
            color: "#1E293B",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.06em",
            fontFamily: "'Inter',sans-serif",
          }}
        >
          {title.toUpperCase()}
        </span>
      </div>

      <div className="space-y-3">
        {[
          {
            label: "TIME IN",
            value: inValue,
            setter: onInChange,
          },
          {
            label: "TIME OUT",
            value: outValue,
            setter: onOutChange,
          },
        ].map(({ label, value, setter }) => (
          <div key={label}>
            <div
              style={{
                color: "#069494",
                fontSize: "9px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                fontFamily: "'Inter',sans-serif",
                marginBottom: "4px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <Clock size={9} color="#069494" /> {label}
            </div>

            <input
              type="time"
              value={value}
              onChange={(event) => setter(event.target.value)}
              className="w-full"
              style={{ ...GLASS_INPUT_STYLE, padding: "9px 14px" }}
            />
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
