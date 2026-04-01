/**
 * Status values that indicate non-working days
 */
export const NON_WORKING_STATUSES = [
  "Sick Leave",
  "Vacation Leave",
  "Absent",
  "Holiday",
];

/**
 * Status values that indicate half day work (PM disabled)
 */
export const HALF_DAY_STATUSES = ["Half Day"];

/**
 * Check if a status is a non-working status that should reset time entries
 * @param {string} status - Status to check
 * @returns {boolean} True if status should trigger time field reset
 */
export function isResetStatus(status) {
  const normalizedStatus = status.toLowerCase();

  return (
    NON_WORKING_STATUSES.includes(status) ||
    normalizedStatus.includes("sick") ||
    normalizedStatus.includes("vacation") ||
    normalizedStatus.includes("absent") ||
    normalizedStatus.includes("holiday")
  );
}

/**
 * Check if a status is a half day status that should disable PM session
 * @param {string} status - Status to check
 * @returns {boolean} True if status should disable PM session
 */
export function isHalfDayStatus(status) {
  const normalizedStatus = status.toLowerCase();

  return (
    HALF_DAY_STATUSES.includes(status) ||
    normalizedStatus.includes("half day") ||
    normalizedStatus === "half-day"
  );
}

/**
 * Convert time string in HH:MM format to minutes since midnight
 * @param {string} timeString - Time in HH:MM format
 * @returns {number} Minutes since midnight
 */
export function toMinutes(timeString) {
  if (!timeString) return null;
  const [hour, minute] = timeString.split(":").map(Number);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return null;
  return hour * 60 + minute;
}

/**
 * Validate if time string is in valid HH:MM format
 * @param {string} timeString - Time to validate
 * @returns {boolean} True if valid HH:MM format and valid time values
 */
export function isValidClock(timeString) {
  const match = timeString.match(/^(\d{2}):(\d{2})$/);
  if (!match) return false;

  const hour = Number.parseInt(match[1], 10);
  const minute = Number.parseInt(match[2], 10);
  return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59;
}

/**
 * Validate a time input field with comprehensive validation rules
 * @param {string} field - Field name ('timeIn' or 'timeOut')
 * @param {string} value - Time value to validate
 * @param {string} relatedValue - Related time value (e.g., timeOut for timeIn validation)
 * @param {string} earliestTime - Earliest allowed time (optional)
 * @param {object} options - Configuration options
 * @param {string} options.earliestLabel - Label for earliest time reference (e.g., "AM session")
 * @returns {string} Error message, or empty string if valid
 */
export function validateTimeInput(
  field,
  value,
  relatedValue,
  earliestTime,
  options = {},
) {
  const { earliestLabel = "previous session" } = options;

  // If empty, no validation error (component will handle required validation)
  if (!value || !value.trim()) {
    return "";
  }

  const trimmed = value.trim();

  // Check format validity
  if (!isValidClock(trimmed)) {
    return "Use a valid time";
  }

  // Check against earliest time constraint
  if (earliestTime && isValidClock(earliestTime)) {
    if (toMinutes(trimmed) < toMinutes(earliestTime)) {
      return `${field === "timeIn" ? "Time in" : "Time out"} must be after ${earliestLabel}`;
    }
  }

  // Check against related value (timeIn/timeOut orderings)
  if (relatedValue && isValidClock(relatedValue)) {
    if (field === "timeOut" && toMinutes(trimmed) <= toMinutes(relatedValue)) {
      return "Time out must be after time in";
    }

    if (field === "timeIn" && toMinutes(trimmed) >= toMinutes(relatedValue)) {
      return "Time in must be before time out";
    }
  }

  return "";
}

/**
 * Convert from display format (HH:MM in 24-hour) to editor format
 * @param {string} value - Time value
 * @returns {string} Normalized HH:MM format or empty string
 */
export function toEditorClock(value) {
  if (!value) return "";
  if (/^\d{2}:\d{2}$/.test(value)) return value;

  const match = value.match(/^(\d{1,2}):(\d{2})\s(AM|PM)$/i);
  if (!match) return "";

  const hour12 = Number.parseInt(match[1], 10);
  const minute = match[2];
  const period = match[3].toUpperCase();
  const hour24 =
    period === "AM" ? hour12 % 12 : hour12 === 12 ? 12 : hour12 + 12;

  return `${hour24.toString().padStart(2, "0")}:${minute}`;
}
