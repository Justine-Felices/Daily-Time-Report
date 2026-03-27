import { useEffect, useState } from "react";

export default function useLiveClock(tickMs = 1000) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), tickMs);
    return () => clearInterval(timer);
  }, [tickMs]);

  return now;
}
