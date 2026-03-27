import { GLASS_STYLE } from "@/lib/dtr-constants";

export default function GlassCard({
  children,
  padding = "20px",
  style,
  className,
}) {
  return (
    <div className={className} style={{ ...GLASS_STYLE, padding, ...style }}>
      {children}
    </div>
  );
}
