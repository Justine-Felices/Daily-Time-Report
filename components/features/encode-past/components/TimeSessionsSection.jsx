import { useState, useCallback, useEffect } from "react";
import TimeSessionCard from "@/components/features/encode-past/components/TimeSessionCard";
import { isHalfDayStatus, isResetStatus } from "@/lib/dtr-time-validation";

export default function TimeSessionsSection({
  amIn,
  amOut,
  pmIn,
  pmOut,
  onAmInChange,
  onAmOutChange,
  onPmInChange,
  onPmOutChange,
  onValidationChange,
  status = "Regular Duty Day",
  sessionsLocked = false,
}) {
  const [amHasError, setAmHasError] = useState(false);
  const [pmHasError, setPmHasError] = useState(false);

  // Notify parent of validation state changes
  useEffect(() => {
    onValidationChange?.({
      am: amHasError,
      pm: pmHasError,
    });
  }, [amHasError, pmHasError, onValidationChange]);

  const handleAmValidation = useCallback((hasError) => {
    setAmHasError(hasError);
  }, []);

  const handlePmValidation = useCallback((hasError) => {
    setPmHasError(hasError);
  }, []);

  const pmEarliestTime = amOut || amIn;
  const amDisabled = sessionsLocked;
  const pmDisabled = sessionsLocked || isHalfDayStatus(status);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <TimeSessionCard
        title="AM Session"
        color="#FF69B4"
        inValue={amIn}
        outValue={amOut}
        onInChange={onAmInChange}
        onOutChange={onAmOutChange}
        onValidationChange={handleAmValidation}
        disabled={amDisabled}
      />

      <TimeSessionCard
        title="PM Session"
        color="#069494"
        inValue={pmIn}
        outValue={pmOut}
        onInChange={onPmInChange}
        onOutChange={onPmOutChange}
        onValidationChange={handlePmValidation}
        earliestTime={pmEarliestTime}
        earliestLabel="AM session"
        disabled={pmDisabled}
      />
    </div>
  );
}
