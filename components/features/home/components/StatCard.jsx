import { SkeletonBlock } from "@/components/ui/Skeleton";

const BASE_CONTAINER_STYLE = {
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  boxShadow: "0 3px 16px rgba(6,148,148,0.07)",
};

const LABEL_STYLE = {
  color: "#94A3B8",
  fontSize: "9px",
  fontWeight: 700,
  letterSpacing: "0.1em",
  fontFamily: "'Inter',sans-serif",
  marginBottom: "6px",
};

const SUBTEXT_STYLE = {
  color: "#94A3B8",
  fontSize: "10px",
  fontFamily: "'Inter',sans-serif",
  marginTop: "4px",
};

export default function StatCard({ label, value, sub, accent, isLoading = false }) {
  return (
    <div
      className="flex flex-col items-center rounded-2xl p-4 text-center"
      style={{
        ...BASE_CONTAINER_STYLE,
        background: accent
          ? "linear-gradient(135deg,rgba(6,148,148,0.1),rgba(0,240,255,0.08))"
          : "rgba(255,255,255,0.75)",
        border: `1.5px solid ${
          accent ? "rgba(6,148,148,0.22)" : "rgba(6,148,148,0.1)"
        }`,
      }}
    >
      <div style={{ ...LABEL_STYLE, textAlign: "center", width: "100%" }}>
        {label}
      </div>
      {isLoading ? (
        <SkeletonBlock className="h-6 w-16 self-center rounded-md" />
      ) : (
        <div
          style={{
            color: accent ? "#069494" : "#1E293B",
            fontSize: "22px",
            fontWeight: 800,
            fontFamily: "'Inter',sans-serif",
            letterSpacing: "-0.03em",
            lineHeight: 1,
            textAlign: "center",
            width: "100%",
          }}
        >
          {value}
        </div>
      )}
      <div style={{ ...SUBTEXT_STYLE, textAlign: "center", width: "100%" }}>
        {sub}
      </div>
    </div>
  );
}
