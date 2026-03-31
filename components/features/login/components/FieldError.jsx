import { AlertCircle } from "lucide-react";

export default function FieldError({ msg }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "5px",
        marginTop: "5px",
        color: "#CC2277",
        fontSize: "11px",
        fontFamily: "'Inter',sans-serif",
      }}
    >
      <AlertCircle size={11} />
      {msg}
    </div>
  );
}
