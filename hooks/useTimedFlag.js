import { useCallback, useEffect, useRef, useState } from "react";

export default function useTimedFlag(durationMs = 2500) {
  const [value, setValue] = useState(false);
  const timerRef = useRef(null);

  const trigger = useCallback(
    (onExpire) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      setValue(true);
      timerRef.current = setTimeout(() => {
        setValue(false);
        if (typeof onExpire === "function") {
          onExpire();
        }
      }, durationMs);
    },
    [durationMs],
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return [value, trigger];
}
