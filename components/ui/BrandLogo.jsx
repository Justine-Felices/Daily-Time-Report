import { Clock4 } from "lucide-react";

export default function BrandLogo({
  size = "md",
  showTagline = true,
  className = "",
  variant = "default",
  align = "center",
}) {
  const iconSize = size === "sm" ? 20 : size === "lg" ? 28 : 24;
  const boxSize = size === "sm" ? 40 : size === "lg" ? 56 : 52;
  const boxRadius = size === "sm" ? 12 : size === "lg" ? 18 : 16;
  const titleSize = size === "sm" ? 18 : size === "lg" ? 26 : 22;

  const titleColor =
    variant === "light" ? "#ffffff" : "var(--text-primary, #1E293B)";
  const taglineColor =
    variant === "light"
      ? "rgba(255,255,255,0.75)"
      : "var(--accent-strong, #3b82f6)";

  const alignClass =
    align === "left" ? "items-start" : "items-center text-center";

  return (
    <div className={`flex flex-col ${alignClass} ${className}`}>
      <div
        style={{
          width: `${boxSize}px`,
          height: `${boxSize}px`,
          position: "relative",
          marginBottom: showTagline ? "14px" : 0,
        }}
      >
        <img
          src="/logo_no_bg.png"
          alt="JustIn Time Report Logo"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      </div>
      <div
        style={{
          color: titleColor,
          fontSize: `${titleSize}px`,
          fontWeight: 800,
          letterSpacing: "-0.03em",
          lineHeight: 1.15,
        }}
      >
        JustIn Time Report
      </div>
      {showTagline && (
        <div
          style={{
            color: taglineColor,
            fontSize: size === "sm" ? "9px" : "10px",
            fontWeight: 700,
            letterSpacing: "0.12em",
            marginTop: "2px",
          }}
        >
          DAILY TIME REPORT
        </div>
      )}
    </div>
  );
}
