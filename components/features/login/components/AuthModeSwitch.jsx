export default function AuthModeSwitch({ mode, switchMode }) {
  return (
    <div
      style={{
        marginTop: "22px",
        textAlign: "center",
        fontSize: "13px",
        color: "#64748B",
        fontFamily: "'Inter',sans-serif",
      }}
    >
      {mode === "login" ? (
        <>
          Don&apos;t have an account?{" "}
          <button
            onClick={() => switchMode("signup")}
            style={{
              background: "none",
              border: "none",
              color: "#069494",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "'Inter',sans-serif",
              fontSize: "13px",
              padding: 0,
            }}
          >
            Sign up free
          </button>
        </>
      ) : (
        <>
          Already have an account?{" "}
          <button
            onClick={() => switchMode("login")}
            style={{
              background: "none",
              border: "none",
              color: "#069494",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "'Inter',sans-serif",
              fontSize: "13px",
              padding: 0,
            }}
          >
            Log in
          </button>
        </>
      )}
    </div>
  );
}
