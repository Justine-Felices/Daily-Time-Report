import { Clock4 } from "lucide-react";

export default function LoginBrandHeader({ mode }) {
  return (
    <>
      <div className="mb-7 flex flex-col items-center">
        <div
          style={{
            width: "52px",
            height: "52px",
            borderRadius: "16px",
            background:
              "linear-gradient(135deg, #046060 0%, #069494 55%, #FF69B4 100%)",
            boxShadow: "0 6px 20px rgba(6,148,148,0.40)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "14px",
          }}
        >
          <Clock4 size={24} color="#fff" />
        </div>
        <div
          style={{
            color: "#1E293B",
            fontSize: "22px",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.15,
          }}
        >
          TimeTrack
        </div>
        <div
          style={{
            color: "#069494",
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.12em",
            marginTop: "2px",
          }}
        >
          DAILY TIME REPORT
        </div>
      </div>

      <div style={{ marginBottom: "22px" }}>
        <div
          style={{
            color: "#1E293B",
            fontSize: "18px",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
          }}
        >
          {mode === "login" ? "Log in to your Account" : "Create your account"}
        </div>
      </div>
    </>
  );
}
