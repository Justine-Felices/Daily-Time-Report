import GlassCard from "@/components/ui/cards/GlassCard";

const NAME_STYLE = {
  color: "#1E293B",
  fontSize: "18px",
  fontWeight: 700,
  fontFamily: "'Inter',sans-serif",
  letterSpacing: "-0.02em",
};

const POSITION_STYLE = {
  background: "rgba(6,148,148,0.1)",
  color: "#069494",
  fontSize: "11px",
  fontWeight: 600,
  fontFamily: "'Inter',sans-serif",
  border: "1px solid rgba(6,148,148,0.2)",
  padding: "2px 10px",
  borderRadius: "999px",
};

const DEPARTMENT_STYLE = {
  color: "#64748B",
  fontSize: "12px",
  fontFamily: "'Inter',sans-serif",
};

export default function ProfileHeaderCard({ name, position, department, initials }) {
  return (
    <GlassCard padding={0} style={{ overflow: "hidden" }}>
      <div
        style={{
          height: "96px",
          background:
            "linear-gradient(135deg, #046060 0%, #069494 45%, #FF69B4 100%)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: "24px",
            top: "12px",
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "rgba(0,240,255,0.2)",
            filter: "blur(20px)",
          }}
        />
      </div>

      <div style={{ padding: "0 24px 20px", position: "relative" }}>
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "18px",
            background: "linear-gradient(135deg,#FF69B4,#069494)",
            border: "3px solid #fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            top: "-36px",
            left: "24px",
            boxShadow: "0 8px 24px rgba(255,105,180,0.4)",
          }}
        >
          <span
            style={{
              color: "#fff",
              fontSize: "24px",
              fontWeight: 800,
              fontFamily: "'Inter',sans-serif",
            }}
          >
            {initials}
          </span>
        </div>

        <div style={{ paddingTop: "46px" }}>
          <div style={NAME_STYLE}>{name}</div>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span style={POSITION_STYLE}>{position}</span>
            <span style={DEPARTMENT_STYLE}>{department}</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
