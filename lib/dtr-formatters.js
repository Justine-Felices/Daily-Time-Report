export function formatTime(date) {
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours.toString().padStart(2, "0")}:${minutes}:${seconds} ${period}`;
}

export function formatLongDate(date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatLogTime(date) {
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours.toString().padStart(2, "0")}:${minutes} ${period}`;
}

export function toDisplayTime(timeValue) {
  if (!timeValue) return null;
  const [hourString, minuteString] = timeValue.split(":");
  let hour = Number.parseInt(hourString, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour.toString().padStart(2, "0")}:${minuteString} ${ampm}`;
}

export function formatHistoryDate(dateValue) {
  const date = new Date(`${dateValue}T12:00:00`);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDayName(dateValue) {
  return new Date(`${dateValue}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
  });
}

export function formatPrintDate(dateValue) {
  const date = new Date(`${dateValue}T12:00:00`);
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}

export function getTodayInputDate() {
  return new Date().toISOString().split("T")[0];
}
