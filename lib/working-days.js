import { PHILIPPINE_HOLIDAYS_2026 } from "@/lib/dtr-constants";
import { getPhilippineDateString, getPhilippineParts } from "@/lib/dtr-formatters";

const HOLIDAY_SET = new Set(PHILIPPINE_HOLIDAYS_2026);

export function isPhilippineHoliday(dateString) {
  return HOLIDAY_SET.has(dateString);
}

export function isWeekday(date) {
  const dayOfWeek = date.getDay();
  return dayOfWeek !== 0 && dayOfWeek !== 6;
}

export function isWorkingDay(date) {
  return isWeekday(date) && !isPhilippineHoliday(getPhilippineDateString(date));
}

export function parseDateKey(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function getNextWorkingDayStartDate(now = new Date()) {
  const { year, month, day, hour } = getPhilippineParts(now);
  const startDate = new Date(year, month - 1, day);

  if (hour >= 17) {
    startDate.setDate(startDate.getDate() + 1);
  }

  return startDate;
}

export function countWorkingDaysBetween(startDate, endDate) {
  if (endDate < startDate) return 0;

  let count = 0;
  const current = new Date(startDate);

  while (current <= endDate) {
    if (isWorkingDay(current)) {
      count += 1;
    }
    current.setDate(current.getDate() + 1);
  }

  return count;
}

export function countWorkingDaysUntil(endDateKey, now = new Date()) {
  if (!endDateKey) return 0;

  const startDate = getNextWorkingDayStartDate(now);
  const endDate = parseDateKey(endDateKey);

  return countWorkingDaysBetween(startDate, endDate);
}

export function calculateHoursPerDayNeeded({
  remaining,
  ojtEndDate,
  now = new Date(),
}) {
  if (remaining <= 0 || !ojtEndDate) return null;

  const workingDaysLeft = countWorkingDaysUntil(ojtEndDate, now);
  if (workingDaysLeft <= 0) return null;

  return remaining / workingDaysLeft;
}

export function addWorkingDays(startDate, daysNeeded) {
  if (daysNeeded <= 0) return getPhilippineDateString(startDate);

  let workDaysCount = 0;
  const currentDate = new Date(startDate);

  while (workDaysCount < daysNeeded) {
    if (isWorkingDay(currentDate)) {
      workDaysCount += 1;
    }

    if (workDaysCount < daysNeeded) {
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  return getPhilippineDateString(currentDate);
}
