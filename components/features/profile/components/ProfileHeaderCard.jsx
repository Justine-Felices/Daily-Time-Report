import GlassCard from "@/components/ui/cards/GlassCard";

const NAME_STYLE = {
  color: "var(--text-primary)",
  fontSize: "20px",
  fontWeight: 800,
  fontFamily: "'Inter',sans-serif",
  letterSpacing: "-0.02em",
};

const POSITION_STYLE = {
  background: "rgba(59,130,246,0.1)",
  color: "var(--accent-strong)",
  fontSize: "10px",
  fontWeight: 700,
  fontFamily: "'Inter',sans-serif",
  border: "1px solid var(--border-soft)",
  padding: "2px 10px",
  borderRadius: "999px",
  textTransform: "uppercase",
  letterSpacing: "0.02em",
};

const DEPARTMENT_STYLE = {
  color: "var(--text-muted)",
  fontSize: "12px",
  fontWeight: 500,
  fontFamily: "'Inter',sans-serif",
};

export default function ProfileHeaderCard({
  name,
  position,
  department,
  initials,
}) {
  return (
    <GlassCard padding={0} style={{ overflow: "hidden" }}>
      <div
        style={{
          height: "100px",
          background:
            "linear-gradient(135deg, var(--accent-strong) 0%, var(--accent-pink) 100%)",
          position: "relative",
          opacity: 0.9,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 100%)",
          }}
        />
      </div>

      <div style={{ padding: "0 24px 20px", position: "relative" }}>
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "22px",
            background:
              "linear-gradient(135deg, var(--accent-strong), var(--accent-pink))",
            border: "4px solid var(--surface-card)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            top: "-40px",
            left: "24px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
          }}
        >
          <span
            style={{
              color: "#fff",
              fontSize: "28px",
              fontWeight: 900,
              fontFamily: "'Inter',sans-serif",
            }}
          >
            {initials}
          </span>
        </div>

        <div style={{ paddingTop: "50px" }}>
          <div style={NAME_STYLE}>{name}</div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span style={POSITION_STYLE}>{position}</span>
            <span style={DEPARTMENT_STYLE}>{department}</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
