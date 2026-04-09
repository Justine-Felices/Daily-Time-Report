import { useState, useCallback, useEffect } from "react";
import TimeSessionCard from "@/components/features/encode-past/components/TimeSessionCard";
import { isHalfDayStatus } from "@/lib/dtr-time-validation";

export default function TimeSessionsSection({
  mode = "session",
  amIn,
  amOut,
  pmIn,
  pmOut,
  simpleIn,
  simpleOut,
  onAmInChange,
  onAmOutChange,
  onPmInChange,
  onPmOutChange,
  onSimpleInChange,
  onSimpleOutChange,
  onValidationChange,
  status = "Regular Duty Day",
  sessionsLocked = false,
}) {
  const [amHasError, setAmHasError] = useState(false);
  const [pmHasError, setPmHasError] = useState(false);
  const [simpleHasError, setSimpleHasError] = useState(false);
  const isSimpleMode = mode === "simple";

  // Notify parent of validation state changes
  useEffect(() => {
    onValidationChange?.({
      am: amHasError,
      pm: pmHasError,
      simple: simpleHasError,
    });
  }, [amHasError, pmHasError, simpleHasError, onValidationChange]);

  const handleAmValidation = useCallback((hasError) => {
    setAmHasError(hasError);
  }, []);

  const handlePmValidation = useCallback((hasError) => {
    setPmHasError(hasError);
  }, []);

  const handleSimpleValidation = useCallback((hasError) => {
    setSimpleHasError(hasError);
  }, []);

  const pmEarliestTime = amOut || amIn;
  const amDisabled = sessionsLocked;
  const pmDisabled = sessionsLocked || isHalfDayStatus(status);

  return (
    <div className="space-y-4">
      <div
        className="overflow-hidden transition-all duration-300 ease-out"
        style={{
          maxHeight: isSimpleMode ? 0 : 560,
          opacity: isSimpleMode ? 0 : 1,
          transform: isSimpleMode ? "translateY(-6px)" : "translateY(0)",
          pointerEvents: isSimpleMode ? "none" : "auto",
        }}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <TimeSessionCard
            title="Morning Session"
            color="#FF69B4"
            inValue={amIn}
            outValue={amOut}
            onInChange={onAmInChange}
            onOutChange={onAmOutChange}
            onValidationChange={handleAmValidation}
            disabled={amDisabled}
          />

          <TimeSessionCard
            title="Afternoon Session"
            color="#069494"
            inValue={pmIn}
            outValue={pmOut}
            onInChange={onPmInChange}
            onOutChange={onPmOutChange}
            onValidationChange={handlePmValidation}
            earliestTime={pmEarliestTime}
            earliestLabel="Morning session"
            disabled={pmDisabled}
          />
        </div>
      </div>

      <div
        className="overflow-hidden transition-all duration-300 ease-out"
        style={{
          maxHeight: isSimpleMode ? 320 : 0,
          opacity: isSimpleMode ? 1 : 0,
          transform: isSimpleMode ? "translateY(0)" : "translateY(6px)",
          pointerEvents: isSimpleMode ? "auto" : "none",
        }}
      >
        <TimeSessionCard
          title="Single Entry"
          color="#22C55E"
          inValue={simpleIn}
          outValue={simpleOut}
          onInChange={onSimpleInChange}
          onOutChange={onSimpleOutChange}
          onValidationChange={handleSimpleValidation}
          disabled={sessionsLocked}
        />
      </div>
    </div>
  );
}
