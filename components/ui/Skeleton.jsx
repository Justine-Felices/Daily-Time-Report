export function SkeletonBlock({ className = "", style }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-slate-200/75 ${className}`}
      style={style}
    />
  );
}

export function SkeletonCircle({ size = 24, className = "", style }) {
  return (
    <div
      className={`animate-pulse rounded-full bg-slate-200/75 ${className}`}
      style={{ width: size, height: size, ...style }}
    />
  );
}