export default function SessionCard({
  title,
  icon: Icon,
  iconColor,
  session,
  onTimeIn,
  onTimeOut,
  inLabel,
  outLabel,
  inGrad,
  inShadow,
}) {
  const done = session.timeIn && session.timeOut;
  const inProgress = session.timeIn && !session.timeOut;

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: "rgba(255,255,255,0.75)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: done
          ? "1.5px solid rgba(6,148,148,0.25)"
          : "1px solid rgba(6,148,148,0.13)",
        boxShadow:
          "0 4px 24px rgba(6,148,148,0.08), inset 0 1px 0 rgba(255,255,255,0.95)",
      }}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-lg"
            style={{ background: `${iconColor}18` }}
          >
            <Icon size={14} color={iconColor} />
          </div>
          <span
            style={{
              color: "#1E293B",
              fontSize: "13px",
              fontWeight: 700,
              fontFamily: "'Inter',sans-serif",
            }}
          >
            {title}
          </span>
        </div>

        <span
          className="rounded-full px-2.5 py-0.5"
          style={{
            background: done
              ? "rgba(34,197,94,0.12)"
              : inProgress
                ? "rgba(6,148,148,0.1)"
                : "rgba(148,163,184,0.12)",
            color: done ? "#16A34A" : inProgress ? "#069494" : "#94A3B8",
            fontSize: "10px",
            fontWeight: 700,
            fontFamily: "'Inter',sans-serif",
            letterSpacing: "0.06em",
            border: `1px solid ${
              done
                ? "rgba(34,197,94,0.2)"
                : inProgress
                  ? "rgba(6,148,148,0.2)"
                  : "rgba(148,163,184,0.2)"
            }`,
          }}
        >
          {done ? "COMPLETED" : inProgress ? "IN SESSION" : "PENDING"}
        </span>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2">
        {[
          { label: "TIME IN", value: session.timeIn },
          { label: "TIME OUT", value: session.timeOut },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="rounded-xl p-3"
            style={{
              background: "rgba(240,253,253,0.6)",
              border: "1px solid rgba(6,148,148,0.12)",
            }}
          >
            <div
              style={{
                color: "#069494",
                fontSize: "8px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                fontFamily: "'Inter',sans-serif",
                marginBottom: "4px",
              }}
            >
              {label}
            </div>
            <div
              style={{
                color: value ? "#1E293B" : "#CBD5E1",
                fontSize: "15px",
                fontWeight: 700,
                fontFamily: "'Inter',sans-serif",
              }}
            >
              {value || "--:-- --"}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onTimeIn}
          disabled={Boolean(session.timeIn)}
          style={{
            padding: "9px 0",
            borderRadius: "10px",
            background: session.timeIn ? "rgba(148,163,184,0.15)" : inGrad,
            color: session.timeIn ? "#CBD5E1" : "#fff",
            border: "none",
            fontFamily: "'Inter',sans-serif",
            fontSize: "12px",
            fontWeight: 700,
            cursor: session.timeIn ? "not-allowed" : "pointer",
            boxShadow: session.timeIn ? "none" : `0 3px 12px ${inShadow}`,
            letterSpacing: "0.03em",
            transition: "all 0.15s",
          }}
        >
          {inLabel}
        </button>

        <button
          onClick={onTimeOut}
          disabled={!session.timeIn || Boolean(session.timeOut)}
          style={{
            padding: "9px 0",
            borderRadius: "10px",
            background:
              !session.timeIn || session.timeOut
                ? "rgba(148,163,184,0.15)"
                : "linear-gradient(135deg,#1E293B,#334155)",
            color: !session.timeIn || session.timeOut ? "#CBD5E1" : "#fff",
            border: "none",
            fontFamily: "'Inter',sans-serif",
            fontSize: "12px",
            fontWeight: 700,
            cursor:
              !session.timeIn || session.timeOut ? "not-allowed" : "pointer",
            boxShadow:
              !session.timeIn || session.timeOut
                ? "none"
                : "0 3px 10px rgba(30,41,59,0.3)",
            letterSpacing: "0.03em",
            transition: "all 0.15s",
          }}
        >
          {outLabel}
        </button>
      </div>
    </div>
  );
}
