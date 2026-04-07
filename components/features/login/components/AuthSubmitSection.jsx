import { ArrowRight, CheckCircle2 } from "lucide-react";
import { BTN_PRIMARY } from "@/components/features/login/constants/styles";
import FieldError from "@/components/features/login/components/FieldError";
import Spinner from "@/components/features/login/components/Spinner";

export default function AuthSubmitSection({
  submit,
  submitting,
  success,
  mode,
  formError,
  infoMessage,
}) {
  return (
    <div
      style={{
        marginTop: "22px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <button
        onClick={submit}
        disabled={submitting || success}
        style={{
          ...BTN_PRIMARY,
          opacity: submitting ? 0.85 : 1,
          background: success
            ? "linear-gradient(135deg,#22C55E,#16A34A)"
            : BTN_PRIMARY.background,
          boxShadow: success
            ? "0 4px 16px rgba(34,197,94,0.38)"
            : "0 4px 16px rgba(6,148,148,0.38)",
        }}
        onMouseEnter={(event) => {
          if (!submitting && !success) {
            event.currentTarget.style.transform = "translateY(-1px)";
          }
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.transform = "translateY(0)";
        }}
      >
        {success ? (
          <>
            <CheckCircle2 size={16} /> {mode === "login" ? "Signed in" : "Account created!"}
          </>
        ) : submitting ? (
          <>
            <Spinner /> {mode === "login" ? "Signing in..." : "Creating account..."}
          </>
        ) : mode === "login" ? (
          <>
            Log In <ArrowRight size={15} />
          </>
        ) : (
          <>Create Account</>
        )}
      </button>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          margin: "2px 0",
        }}
      >
        <div
          style={{
            flex: 1,
            height: "1px",
            background: "rgba(6,148,148,0.12)",
          }}
        />
        <span
          style={{
            color: "#94A3B8",
            fontSize: "11px",
            fontFamily: "'Inter',sans-serif",
            fontWeight: 500,
          }}
        >
          or
        </span>
        <div
          style={{
            flex: 1,
            height: "1px",
            background: "rgba(6,148,148,0.12)",
          }}
        />
      </div>

      {formError && <FieldError msg={formError} />}

      {infoMessage && (
        <div
          style={{
            color: "#069494",
            fontSize: "12px",
            fontWeight: 600,
            fontFamily: "'Inter',sans-serif",
            textAlign: "center",
          }}
        >
          {infoMessage}
        </div>
      )}
    </div>
  );
}
