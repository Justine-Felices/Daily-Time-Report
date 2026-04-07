export default function LoginDecorBackground() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-140px",
          right: "-120px",
          width: "520px",
          height: "520px",
          borderRadius: "50%",
          background: "rgba(255,105,180,0.13)",
          filter: "blur(90px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-100px",
          left: "-100px",
          width: "480px",
          height: "480px",
          borderRadius: "50%",
          background: "rgba(6,148,148,0.10)",
          filter: "blur(100px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "35%",
          width: "340px",
          height: "340px",
          borderRadius: "50%",
          background: "rgba(0,240,255,0.07)",
          filter: "blur(80px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "5%",
          width: "220px",
          height: "220px",
          borderRadius: "50%",
          background: "rgba(255,105,180,0.07)",
          filter: "blur(60px)",
        }}
      />
    </div>
  );
}
