export default function Spinner() {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      style={{ animation: "spin 0.75s linear infinite" }}
    >
      <style>{"@keyframes spin { to { transform: rotate(360deg); } }"}</style>
      <circle
        cx="8"
        cy="8"
        r="6"
        fill="none"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="2"
      />
      <path
        d="M8 2 A6 6 0 0 1 14 8"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
