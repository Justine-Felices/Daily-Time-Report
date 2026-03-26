export function formatFullDate(date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatClock(date) {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

export function formatLogTime(date) {
  if (!date) return "--:-- --";

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function getHours(start, end) {
  if (!start || !end) return 0;
  const diff = end.getTime() - start.getTime();
  return diff > 0 ? diff / (1000 * 60 * 60) : 0;
}
