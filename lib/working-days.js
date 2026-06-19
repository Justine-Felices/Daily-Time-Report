import { PHILIPPINE_HOLIDAYS_2026 } from "@/lib/dtr-constants";
import { getPhilippineDateString, getPhilippineParts } from "@/lib/dtr-formatters";

const HOLIDAY_SET = new Set(PHILIPPINE_HOLIDAYS_2026);

export function isPhilippineHoliday(dateKey) {
  return HOLIDAY_SET.has(dateKey);
}

export function getWeekdayFromDateKey(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

export function isWeekdayKey(dateKey) {
  const weekday = getWeekdayFromDateKey(dateKey);
  return weekday !== 0 && weekday !== 6;
}

export function isWorkingDayKey(dateKey) {
  return isWeekdayKey(dateKey) && !isPhilippineHoliday(dateKey);
}

export function addDaysToDateKey(dateKey, days) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + days);

  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function advanceToNextWorkingDayKey(dateKey) {
  let currentKey = dateKey;
  while (!isWorkingDayKey(currentKey)) {
    currentKey = addDaysToDateKey(currentKey, 1);
  }
  return currentKey;
}

function getProjectionStartKey({ now, hoursPerDay, todayHours, remaining }) {
  const todayKey = getPhilippineDateString(now);
  const { hour } = getPhilippineParts(now);
  let futureRemaining = remaining;

  if (hour >= 17) {
    return {
      startKey: advanceToNextWorkingDayKey(addDaysToDateKey(todayKey, 1)),
      futureRemaining,
    };
  }

  if (todayHours >= hoursPerDay) {
    return {
      startKey: advanceToNextWorkingDayKey(addDaysToDateKey(todayKey, 1)),
      futureRemaining,
    };
  }

  if (todayHours > 0) {
    const hoursLeftToday = Math.min(futureRemaining, hoursPerDay - todayHours);
    futureRemaining -= hoursLeftToday;

    if (futureRemaining <= 0) {
      return { startKey: todayKey, futureRemaining: 0 };
    }

    return {
      startKey: advanceToNextWorkingDayKey(addDaysToDateKey(todayKey, 1)),
      futureRemaining,
    };
  }

  return {
    startKey: advanceToNextWorkingDayKey(todayKey),
    futureRemaining,
  };
}

export function addWorkingDaysFromKey(startKey, daysNeeded) {
  if (daysNeeded <= 0) return startKey;

  let currentKey = startKey;
  let workDaysCount = 0;

  while (workDaysCount < daysNeeded) {
    if (isWorkingDayKey(currentKey)) {
      workDaysCount += 1;
    }

    if (workDaysCount < daysNeeded) {
      currentKey = addDaysToDateKey(currentKey, 1);
    }
  }

  return currentKey;
}

export function countWorkingDaysBetweenKeys(startKey, endKey) {
  if (endKey < startKey) return 0;

  let count = 0;
  let currentKey = startKey;

  while (currentKey <= endKey) {
    if (isWorkingDayKey(currentKey)) {
      count += 1;
    }
    currentKey = addDaysToDateKey(currentKey, 1);
  }

  return count;
}

export function countWorkingDaysUntil(endDateKey, now = new Date(), todayHours = 0) {
  if (!endDateKey) return 0;

  const { startKey } = getProjectionStartKey({
    now,
    hoursPerDay: 8,
    todayHours,
    remaining: 1,
  });

  return countWorkingDaysBetweenKeys(startKey, endDateKey);
}

export function calculateHoursPerDayNeeded({
  remaining,
  ojtEndDate,
  todayHours = 0,
  now = new Date(),
}) {
  if (remaining <= 0 || !ojtEndDate) return null;

  const workingDaysLeft = countWorkingDaysUntil(ojtEndDate, now, todayHours);
  if (workingDaysLeft <= 0) return null;

  return remaining / workingDaysLeft;
}

export function calculateEstimatedFinishDate({
  remaining,
  hoursPerDay = 8,
  todayHours = 0,
  now = new Date(),
}) {
  if (remaining <= 0) return null;

  const { startKey, futureRemaining } = getProjectionStartKey({
    now,
    hoursPerDay,
    todayHours,
    remaining,
  });

  if (futureRemaining <= 0) {
    return getPhilippineDateString(now);
  }

  const daysNeeded = Math.ceil(futureRemaining / hoursPerDay);
  return addWorkingDaysFromKey(startKey, daysNeeded);
}
