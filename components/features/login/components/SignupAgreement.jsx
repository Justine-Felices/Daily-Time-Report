import { CheckCircle2 } from "lucide-react";
import FieldError from "@/components/features/login/components/FieldError";

export default function SignupAgreement({ agree, error, onToggle }) {
  return (
    <div>
      <label
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "10px",
          cursor: "pointer",
        }}
      >
        <div
          onClick={onToggle}
          style={{
            width: "18px",
            height: "18px",
            borderRadius: "6px",
            flexShrink: 0,
            marginTop: "1px",
            border: `1.5px solid ${agree ? "rgba(6,148,148,0.7)" : error ? "rgba(255,105,180,0.6)" : "rgba(6,148,148,0.3)"}`,
            background: agree
              ? "linear-gradient(135deg,#069494,#0aacac)"
              : "rgba(240,253,253,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.15s",
            boxShadow: agree ? "0 2px 8px rgba(6,148,148,0.3)" : "none",
          }}
        >
          {agree && <CheckCircle2 size={11} color="#fff" strokeWidth={2.5} />}
        </div>
        <span
          style={{
            color: "#475569",
            fontSize: "12px",
            fontFamily: "'Inter',sans-serif",
            lineHeight: 1.5,
          }}
        >
          I agree to the{" "}
          <span
            style={{
              color: "#069494",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Terms of Service
          </span>{" "}
          and{" "}
          <span
            style={{
              color: "#FF69B4",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Privacy Policy
          </span>
        </span>
      </label>
      {error && <FieldError msg={error} />}
    </div>
  );
}
