import BrandLogo from "@/components/ui/BrandLogo";

export default function LoginBrandHeader({ mode }) {
  return (
    <>
      <BrandLogo className="mb-7" variant="light" />

      <div style={{ marginBottom: "22px" }}>
        <div
          style={{
            color: "#FFFFFF",
            fontSize: "20px",
            fontWeight: 800,
            letterSpacing: "-0.01em",
            lineHeight: 1.2,
          }}
        >
          {mode === "login" ? "Log in to your Account" : "Create your account"}
        </div>
      </div>
    </>
  );
}
