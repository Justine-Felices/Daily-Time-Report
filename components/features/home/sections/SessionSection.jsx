import { Clock, Sun, Sunset } from "lucide-react";
import SessionCard from "@/components/features/home/components/SessionCard";

const TITLE_STYLE = {
  color: "#1E293B",
  fontSize: "14px",
  fontWeight: 700,
  fontFamily: "'Inter',sans-serif",
};

const DATE_STYLE = {
  color: "#94A3B8",
  fontSize: "12px",
  fontFamily: "'Inter',sans-serif",
};

export default function SessionSection({
  now,
  amSession,
  pmSession,
  sessionsLocked,
  onAmTimeIn,
  onAmTimeOut,
  onPmTimeIn,
  onPmTimeOut,
  onAmTimeInChange,
  onAmTimeOutChange,
  onPmTimeInChange,
  onPmTimeOutChange,
  onAmValidationChange,
  onPmValidationChange,
}) {
  const pmEarliestTime = amSession.timeOut || amSession.timeIn || null;

  return (
    <div>
      <div className="mb-3 flex items-center gap-2 px-1">
        <Clock size={15} color="#069494" />
        <span style={TITLE_STYLE}>Today</span>
        <span style={DATE_STYLE}>
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
          onValidationChange={onAmValidationChange}
          onTimeIn={onAmTimeIn}
          onTimeOut={onAmTimeOut}
          onTimeInChange={onAmTimeInChange}
          onTimeOutChange={onAmTimeOutChange}
          disabled={sessionsLocked}
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
          onValidationChange={onPmValidationChange}
          earliestTime={pmEarliestTime}
          earliestLabel="AM session"
          onTimeIn={onPmTimeIn}
          onTimeOut={onPmTimeOut}
          onTimeInChange={onPmTimeInChange}
          onTimeOutChange={onPmTimeOutChange}
          disabled={sessionsLocked}
          inLabel="PM IN"
          outLabel="PM OUT"
          inGrad="linear-gradient(135deg,#069494,#0aacac)"
          inShadow="rgba(6,148,148,0.38)"
        />
      </div>
    </div>
  );
}
