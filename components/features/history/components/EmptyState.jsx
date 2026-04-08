import { XCircle } from "lucide-react";
import GlassCard from "@/components/ui/cards/GlassCard";

const TEXT_STYLE = {
  color: "var(--text-muted)",
  fontFamily: "'Inter',sans-serif",
  fontSize: "14px",
  fontWeight: 500,
};

export default function EmptyState({ message }) {
  return (
    <GlassCard padding="40px" className="flex flex-col items-center">
      <XCircle
        size={36}
        color="rgba(6,148,148,0.25)"
        style={{ marginBottom: "12px" }}
      />
      <div style={TEXT_STYLE}>{message}</div>
    </GlassCard>
  );
}
