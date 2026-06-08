export function formatTime(date) {
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours.toString().padStart(2, "0")}:${minutes} ${period}`;
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

export function normalizeLogTime(value) {
  if (!value) return null;

  const compact = value.trim().replace(/\s+/g, " ").toUpperCase();
  const match = compact.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/);
  if (!match) return null;

  const hour = Number.parseInt(match[1], 10);
  const minute = Number.parseInt(match[2], 10);
  if (hour < 1 || hour > 12 || minute < 0 || minute > 59) return null;

  return `${hour.toString().padStart(2, "0")}:${match[2]} ${match[3]}`;
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

/**
 * Get date/time components for a given date in Asia/Manila (Philippine) timezone.
 * @param {Date} date - Date object to extract parts from (defaults to new Date())
 * @returns {object} { year, month, day, hour, minute, second }
 */
export function getPhilippineParts(date = new Date()) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const parts = formatter.formatToParts(date);
  const getVal = (type) => parts.find((p) => p.type === type).value;
  
  let hour = Number(getVal("hour"));
  if (hour === 24) hour = 0;

  return {
    year: Number(getVal("year")),
    month: Number(getVal("month")),
    day: Number(getVal("day")),
    hour,
    minute: Number(getVal("minute")),
    second: Number(getVal("second")),
  };
}

/**
 * Get YYYY-MM-DD formatted date string in Philippine Time.
 * @param {Date} date
 * @returns {string} YYYY-MM-DD
 */
export function getPhilippineDateString(date = new Date()) {
  const { year, month, day } = getPhilippineParts(date);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/**
 * Get HH:MM 24-hour formatted time string in Philippine Time.
 * @param {Date} date
 * @returns {string} HH:MM
 */
export function getPhilippineTimeString(date = new Date()) {
  const { hour, minute } = getPhilippineParts(date);
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

/**
 * Returns a local Date object representing the current year, month, and day in Philippine Time.
 * @returns {Date}
 */
export function getPhilippineToday() {
  const { year, month, day } = getPhilippineParts(new Date());
  return new Date(year, month - 1, day);
}

export function getTodayInputDate() {
  return getPhilippineDateString(new Date());
}


export function formatReadableDate(dateValue) {
  if (!dateValue) return "";
  const date = new Date(`${dateValue}T12:00:00`);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
