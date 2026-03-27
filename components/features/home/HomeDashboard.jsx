"use client";

import { useState } from "react";
import useLiveClock from "@/hooks/useLiveClock";
import useTimedFlag from "@/hooks/useTimedFlag";
import { GLASS_INPUT_STYLE, STATUS_OPTIONS } from "@/lib/dtr-constants";
import { formatLogTime } from "@/lib/dtr-formatters";
import PageShell from "@/components/layout/PageShell";
import HeaderSection from "@/components/features/home/sections/HeaderSection";
import ProgressSection from "@/components/features/home/sections/ProgressSection";
import SessionSection from "@/components/features/home/sections/SessionSection";
import DailyStatusSection from "@/components/features/home/sections/DailyStatusSection";
import SummarySection from "@/components/features/home/sections/SummarySection";

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

  const handleAmTimeIn = () => {
    setAmSession((prev) => ({
      ...prev,
      timeIn: formatLogTime(new Date()),
    }));
  };

  const handleAmTimeOut = () => {
    setAmSession((prev) => ({
      ...prev,
      timeOut: formatLogTime(new Date()),
    }));
  };

  const handlePmTimeIn = () => {
    setPmSession((prev) => ({
      ...prev,
      timeIn: formatLogTime(new Date()),
    }));
  };

  const handlePmTimeOut = () => {
    setPmSession((prev) => ({
      ...prev,
      timeOut: formatLogTime(new Date()),
    }));
  };

  return (
    <PageShell width="wide">
      <HeaderSection
        now={now}
        isClockIn={isClockIn}
        statusLabel={statusLabel}
      />

      <ProgressSection
        pct={pct}
        remaining={remaining}
        targetHours={TARGET_HOURS}
        estimatedFinishText={estimatedFinishText}
      />

      <SessionSection
        now={now}
        amSession={amSession}
        pmSession={pmSession}
        onAmTimeIn={handleAmTimeIn}
        onAmTimeOut={handleAmTimeOut}
        onPmTimeIn={handlePmTimeIn}
        onPmTimeOut={handlePmTimeOut}
      />

      <DailyStatusSection
        dailyStatus={dailyStatus}
        dailyNote={dailyNote}
        onDailyStatusChange={(event) => setDailyStatus(event.target.value)}
        onDailyNoteChange={(event) => setDailyNote(event.target.value)}
        onSave={triggerNoteSaved}
        noteSaved={noteSaved}
        statusOptions={STATUS_OPTIONS}
        inputStyle={HOME_INPUT_STYLE}
      />

      <SummarySection
        todayHours={todayHours}
        monthHours={monthHours}
        totalHours={totalRenderedHours}
      />
    </PageShell>
  );
}
