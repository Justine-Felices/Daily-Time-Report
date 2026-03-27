"use client";

import {
  CalendarCheck,
  CheckCircle2,
  ChevronDown,
  Clock,
  Save,
  Sun,
  Sunset,
  Target,
  Timer,
  TrendingUp,
  Zap,
} from "lucide-react";
import useLiveClock from "@/hooks/useLiveClock";
import useTimedFlag from "@/hooks/useTimedFlag";
import { GLASS_INPUT_STYLE, STATUS_OPTIONS } from "@/lib/dtr-constants";
import {
  formatLogTime,
  formatLongDate,
  formatTime,
} from "@/lib/dtr-formatters";
import PageShell from "@/components/dtr/shared/PageShell";
import GlassCard from "@/components/dtr/shared/GlassCard";
import CircularProgress from "@/components/dtr/home/CircularProgress";
import SessionCard from "@/components/dtr/home/SessionCard";
import { useState } from "react";

const TARGET_HOURS = 500;
const BASE_MONTH_HOURS = 126;
const BASE_TOTAL_HOURS = 274;

const HOME_INPUT_STYLE = {
  ...GLASS_INPUT_STYLE,
  fontSize: "13px",
  transition: "all 0.15s",
};

export default function HomeDashboard() {
  const [amSession, setAmSession] = useState({ timeIn: null, timeOut: null });
  const [pmSession, setPmSession] = useState({ timeIn: null, timeOut: null });
  const [dailyStatus, setDailyStatus] = useState(STATUS_OPTIONS[0]);
  const [dailyNote, setDailyNote] = useState("");
  const [noteSaved, triggerNoteSaved] = useTimedFlag(2500);
  const now = useLiveClock();

  const todayHours =
    (amSession.timeIn && amSession.timeOut ? 4 : amSession.timeIn ? 2 : 0) +
    (pmSession.timeIn && pmSession.timeOut ? 4 : pmSession.timeIn ? 2 : 0);

  const monthHours = BASE_MONTH_HOURS + todayHours;
  const totalRenderedHours = BASE_TOTAL_HOURS + todayHours;
  const pct = Math.min(
    100,
    Math.round((totalRenderedHours / TARGET_HOURS) * 100),
  );
  const remaining = Math.max(0, TARGET_HOURS - totalRenderedHours);

  const estimatedFinish = new Date();
  estimatedFinish.setDate(estimatedFinish.getDate() + Math.ceil(remaining / 8));
  const estimatedFinishText = estimatedFinish.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const hasAnyLog = amSession.timeIn || pmSession.timeIn;
  const isClockIn =
    (amSession.timeIn && !amSession.timeOut) ||
    (pmSession.timeIn && !pmSession.timeOut);

  const statusLabel = isClockIn
    ? "CLOCKED IN"
    : hasAnyLog
      ? "CLOCKED OUT"
      : "NOT YET";

  return (
    <PageShell width="wide">
      <div
        className="flex flex-col gap-3 rounded-2xl px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
        style={{
          background:
            "linear-gradient(135deg, #046060 0%, #069494 50%, #FF69B4 100%)",
          boxShadow: "0 6px 28px rgba(6,148,148,0.28)",
          borderRadius: "20px",
        }}
      >
        <div>
          <div
            style={{
              color: "rgba(255,255,255,0.75)",
              fontSize: "12px",
              fontWeight: 500,
              fontFamily: "'Inter',sans-serif",
            }}
          >
            {formatLongDate(now)}
          </div>
          <div
            style={{
              color: "#fff",
              fontSize: "28px",
              fontWeight: 800,
              fontFamily: "'Inter',sans-serif",
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
            }}
          >
            {formatTime(now)}
          </div>
        </div>

        <div
          className="flex items-center gap-2 self-start rounded-full px-4 py-2 sm:self-auto"
          style={{
            background: "rgba(255,255,255,0.18)",
            border: "1px solid rgba(255,255,255,0.35)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
        >
          <div
            className="h-2 w-2 rounded-full"
            style={{
              background: isClockIn ? "#00F0FF" : "rgba(255,255,255,0.5)",
              boxShadow: isClockIn
                ? "0 0 8px #00F0FF, 0 0 18px rgba(0,240,255,0.5)"
                : "none",
            }}
          />
          <span
            style={{
              color: "#fff",
              fontSize: "12px",
              fontWeight: 600,
              fontFamily: "'Inter',sans-serif",
              letterSpacing: "0.06em",
            }}
          >
            {statusLabel}
          </span>
        </div>
      </div>

      <GlassCard padding="24px">
        <div className="mb-5 flex items-center gap-2">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-lg"
            style={{
              background: "linear-gradient(135deg,#069494,#00F0FF)",
              boxShadow: "0 3px 10px rgba(6,148,148,0.4)",
            }}
          >
            <TrendingUp size={14} color="#fff" />
          </div>
          <span
            style={{
              color: "#1E293B",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.05em",
              fontFamily: "'Inter',sans-serif",
            }}
          >
            OJT PROGRESS
          </span>
          <div
            className="ml-auto rounded-full px-3 py-0.5"
            style={{
              background: "rgba(6,148,148,0.1)",
              border: "1px solid rgba(6,148,148,0.2)",
              color: "#069494",
              fontSize: "12px",
              fontWeight: 600,
              fontFamily: "'Inter',sans-serif",
            }}
          >
            {pct}% Done
          </div>
        </div>

        <div className="mb-5 flex flex-col items-center">
          <CircularProgress pct={pct} />
        </div>

        <div
          className="mb-5 w-full rounded-full"
          style={{ height: "8px", background: "rgba(6,148,148,0.1)" }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${pct}%`,
              background: "linear-gradient(90deg, #046060, #069494, #00F0FF)",
              transition: "width 0.9s ease",
              boxShadow: "0 2px 10px rgba(0,240,255,0.4)",
            }}
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            {
              icon: Timer,
              label: "REMAINING",
              value: `${remaining.toFixed(0)}h`,
              color: "#FF69B4",
            },
            {
              icon: Target,
              label: "TARGET",
              value: `${TARGET_HOURS}h`,
              color: "#069494",
            },
            {
              icon: CalendarCheck,
              label: "EST. FINISH",
              value: estimatedFinishText,
              color: "#00B4B4",
            },
          ].map(({ icon: Icon, label, value, color }) => (
            <div
              key={label}
              className="flex flex-col items-center rounded-xl p-3 text-center"
              style={{
                background: "rgba(240,253,253,0.6)",
                border: "1px solid rgba(6,148,148,0.12)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
              }}
            >
              <div
                className="mb-2 flex h-7 w-7 items-center justify-center rounded-lg"
                style={{ background: `${color}18` }}
              >
                <Icon size={13} color={color} />
              </div>
              <div
                style={{
                  color: "#1E293B",
                  fontSize: "13px",
                  fontWeight: 700,
                  fontFamily: "'Inter',sans-serif",
                }}
              >
                {value}
              </div>
              <div
                style={{
                  color: "#94A3B8",
                  fontSize: "9px",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  fontFamily: "'Inter',sans-serif",
                  marginTop: "2px",
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      <div>
        <div className="mb-3 flex items-center gap-2 px-1">
          <Clock size={15} color="#069494" />
          <span
            style={{
              color: "#1E293B",
              fontSize: "14px",
              fontWeight: 700,
              fontFamily: "'Inter',sans-serif",
            }}
          >
            Today
          </span>
          <span
            style={{
              color: "#94A3B8",
              fontSize: "12px",
              fontFamily: "'Inter',sans-serif",
            }}
          >
            -{" "}
            {now.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SessionCard
            title="AM Session"
            icon={Sun}
            iconColor="#FF69B4"
            session={amSession}
            onTimeIn={() =>
              setAmSession({
                ...amSession,
                timeIn: formatLogTime(new Date()),
              })
            }
            onTimeOut={() =>
              setAmSession({
                ...amSession,
                timeOut: formatLogTime(new Date()),
              })
            }
            inLabel="AM IN"
            outLabel="AM OUT"
            inGrad="linear-gradient(135deg,#FF69B4,#ff8fca)"
            inShadow="rgba(255,105,180,0.4)"
          />

          <SessionCard
            title="PM Session"
            icon={Sunset}
            iconColor="#069494"
            session={pmSession}
            onTimeIn={() =>
              setPmSession({
                ...pmSession,
                timeIn: formatLogTime(new Date()),
              })
            }
            onTimeOut={() =>
              setPmSession({
                ...pmSession,
                timeOut: formatLogTime(new Date()),
              })
            }
            inLabel="PM IN"
            outLabel="PM OUT"
            inGrad="linear-gradient(135deg,#069494,#0aacac)"
            inShadow="rgba(6,148,148,0.38)"
          />
        </div>
      </div>

      <GlassCard padding="20px">
        <div className="mb-4 flex items-center gap-2">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-lg"
            style={{
              background: "linear-gradient(135deg,#FF69B4,#069494)",
              boxShadow: "0 3px 10px rgba(255,105,180,0.3)",
            }}
          >
            <Zap size={13} color="#fff" />
          </div>
          <span
            style={{
              color: "#1E293B",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.05em",
              fontFamily: "'Inter',sans-serif",
            }}
          >
            DAILY STATUS / NOTES
          </span>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <select
              value={dailyStatus}
              onChange={(event) => setDailyStatus(event.target.value)}
              className="w-full appearance-none"
              style={{
                ...HOME_INPUT_STYLE,
                padding: "10px 40px 10px 14px",
                cursor: "pointer",
              }}
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <ChevronDown
              size={15}
              color="#069494"
              className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2"
            />
          </div>

          <textarea
            rows={2}
            value={dailyNote}
            onChange={(event) => setDailyNote(event.target.value)}
            placeholder="Add a note (e.g. field work, running errand, etc.)"
            className="w-full resize-none"
            style={{ ...HOME_INPUT_STYLE, padding: "10px 14px" }}
          />

          <button
            onClick={() => triggerNoteSaved()}
            className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 transition-all duration-200"
            style={{
              background: noteSaved
                ? "linear-gradient(135deg,#22C55E,#16A34A)"
                : "linear-gradient(135deg,#069494,#0aacac)",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              fontFamily: "'Inter',sans-serif",
              fontSize: "13px",
              fontWeight: 600,
              boxShadow: noteSaved
                ? "0 4px 12px rgba(34,197,94,0.35)"
                : "0 4px 14px rgba(6,148,148,0.32)",
              letterSpacing: "0.02em",
              borderRadius: "12px",
            }}
          >
            {noteSaved ? (
              <>
                <CheckCircle2 size={14} /> Saved!
              </>
            ) : (
              <>
                <Save size={14} /> Save Status / Note
              </>
            )}
          </button>
        </div>
      </GlassCard>

      <div>
        <div className="mb-3 flex items-center gap-2 px-1">
          <Timer size={15} color="#069494" />
          <span
            style={{
              color: "#1E293B",
              fontSize: "14px",
              fontWeight: 700,
              fontFamily: "'Inter',sans-serif",
            }}
          >
            Summary
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            {
              label: "TODAY HOURS",
              value: `${todayHours.toFixed(1)}h`,
              sub: "logged today",
              accent: true,
            },
            {
              label: "MONTH HOURS",
              value: `${monthHours.toFixed(0)}h`,
              sub: "this month",
              accent: false,
            },
            {
              label: "TOTAL HOURS",
              value: `${totalRenderedHours.toFixed(0)}h`,
              sub: "all-time",
              accent: false,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="flex flex-col rounded-2xl p-4"
              style={{
                background: item.accent
                  ? "linear-gradient(135deg,rgba(6,148,148,0.1),rgba(0,240,255,0.08))"
                  : "rgba(255,255,255,0.75)",
                border: `1.5px solid ${
                  item.accent ? "rgba(6,148,148,0.22)" : "rgba(6,148,148,0.1)"
                }`,
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                boxShadow: "0 3px 16px rgba(6,148,148,0.07)",
              }}
            >
              <div
                style={{
                  color: "#94A3B8",
                  fontSize: "9px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  fontFamily: "'Inter',sans-serif",
                  marginBottom: "6px",
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  color: item.accent ? "#069494" : "#1E293B",
                  fontSize: "22px",
                  fontWeight: 800,
                  fontFamily: "'Inter',sans-serif",
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                }}
              >
                {item.value}
              </div>
              <div
                style={{
                  color: "#94A3B8",
                  fontSize: "10px",
                  fontFamily: "'Inter',sans-serif",
                  marginTop: "4px",
                }}
              >
                {item.sub}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
