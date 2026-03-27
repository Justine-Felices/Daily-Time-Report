import { STATUS_COLORS } from "@/lib/dtr-constants";
import { formatHistoryDate } from "@/lib/dtr-formatters";

export default function HistoryRow({ record }) {
  const statusColors = STATUS_COLORS[record.status] || {
    bg: "rgba(148,163,184,0.1)",
    color: "#64748B",
  };
  const hasAM = record.amIn || record.amOut;
  const hasPM = record.pmIn || record.pmOut;

  return (
    <div
      className="rounded-2xl p-4 transition-all"
      style={{
        background: "rgba(255,255,255,0.7)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        border: "1.5px solid rgba(6,148,148,0.12)",
        boxShadow:
          "0 2px 14px rgba(6,148,148,0.06), inset 0 1px 0 rgba(255,255,255,0.95)",
        cursor: "default",
      }}
      onMouseEnter={(event) => {
        event.currentTarget.style.background = "rgba(255,255,255,0.9)";
        event.currentTarget.style.borderColor = "rgba(6,148,148,0.25)";
        event.currentTarget.style.boxShadow =
          "0 6px 24px rgba(6,148,148,0.12), inset 0 1px 0 rgba(255,255,255,1)";
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.background = "rgba(255,255,255,0.7)";
        event.currentTarget.style.borderColor = "rgba(6,148,148,0.12)";
        event.currentTarget.style.boxShadow =
          "0 2px 14px rgba(6,148,148,0.06), inset 0 1px 0 rgba(255,255,255,0.95)";
      }}
    >
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div
            className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl"
            style={{
              background: "rgba(6,148,148,0.08)",
              border: "1px solid rgba(6,148,148,0.15)",
            }}
          >
            <div
              style={{
                color: "#069494",
                fontSize: "16px",
                fontWeight: 800,
                fontFamily: "'Inter',sans-serif",
                lineHeight: 1,
              }}
            >
              {new Date(`${record.date}T12:00:00`).getDate()}
            </div>
            <div
              style={{
                color: "#FF69B4",
                fontSize: "9px",
                fontWeight: 600,
                fontFamily: "'Inter',sans-serif",
                letterSpacing: "0.05em",
              }}
            >
              {new Date(`${record.date}T12:00:00`)
                .toLocaleDateString("en-US", { month: "short" })
                .toUpperCase()}
            </div>
          </div>

          <div>
            <div
              style={{
                color: "#1E293B",
                fontSize: "13px",
                fontWeight: 600,
                fontFamily: "'Inter',sans-serif",
              }}
            >
              {formatHistoryDate(record.date)}
            </div>
            {record.note && (
              <div
                style={{
                  color: "#94A3B8",
                  fontSize: "11px",
                  fontFamily: "'Inter',sans-serif",
                  marginTop: "1px",
                }}
              >
                Note: {record.note}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {hasAM && (
            <div
              className="flex flex-col rounded-xl px-3 py-1.5"
              style={{
                background: "rgba(255,105,180,0.08)",
                border: "1px solid rgba(255,105,180,0.2)",
              }}
            >
              <div
                style={{
                  color: "#FF69B4",
                  fontSize: "8px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  fontFamily: "'Inter',sans-serif",
                }}
              >
                AM
              </div>
              <div
                style={{
                  color: "#99004D",
                  fontSize: "11px",
                  fontWeight: 600,
                  fontFamily: "'Inter',sans-serif",
                }}
              >
                {record.amIn || "-"}
                {" -> "}
                {record.amOut || "-"}
              </div>
            </div>
          )}

          {hasPM && (
            <div
              className="flex flex-col rounded-xl px-3 py-1.5"
              style={{
                background: "rgba(6,148,148,0.08)",
                border: "1px solid rgba(6,148,148,0.18)",
              }}
            >
              <div
                style={{
                  color: "#069494",
                  fontSize: "8px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  fontFamily: "'Inter',sans-serif",
                }}
              >
                PM
              </div>
              <div
                style={{
                  color: "#046060",
                  fontSize: "11px",
                  fontWeight: 600,
                  fontFamily: "'Inter',sans-serif",
                }}
              >
                {record.pmIn || "-"}
                {" -> "}
                {record.pmOut || "-"}
              </div>
            </div>
          )}

          <div
            className="rounded-xl px-3 py-1.5 text-center"
            style={{
              background:
                record.totalHours > 0
                  ? "rgba(34,197,94,0.1)"
                  : "rgba(148,163,184,0.1)",
              border: `1px solid ${
                record.totalHours > 0
                  ? "rgba(34,197,94,0.2)"
                  : "rgba(148,163,184,0.2)"
              }`,
            }}
          >
            <div
              style={{
                color: "#94A3B8",
                fontSize: "8px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                fontFamily: "'Inter',sans-serif",
              }}
            >
              HRS
            </div>
            <div
              style={{
                color: record.totalHours > 0 ? "#16A34A" : "#94A3B8",
                fontSize: "13px",
                fontWeight: 700,
                fontFamily: "'Inter',sans-serif",
              }}
            >
              {record.totalHours}h
            </div>
          </div>

          <span
            className="rounded-full px-3 py-1"
            style={{
              background: statusColors.bg,
              color: statusColors.color,
              fontSize: "11px",
              fontWeight: 600,
              fontFamily: "'Inter',sans-serif",
              letterSpacing: "0.02em",
              whiteSpace: "nowrap",
            }}
          >
            {record.status}
          </span>
        </div>
      </div>
    </div>
  );
}
