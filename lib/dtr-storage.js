import { HISTORY_STORAGE_KEY, SAMPLE_HISTORY } from "@/lib/dtr-constants";

const MAX_LOCAL_HISTORY_RECORDS = 120;

function parseHistoryArray(rawValue) {
  const parsed = JSON.parse(rawValue || "[]");
  return Array.isArray(parsed) ? parsed : [];
}

export function normalizeHistoryRecord(raw, index) {
  if (!raw || typeof raw !== "object") return null;
  if (typeof raw.date !== "string" || raw.date.trim().length === 0) return null;

  return {
    id: raw.id ? String(raw.id) : `record-${index}`,
    date: raw.date,
    amIn: raw.amIn || null,
    amOut: raw.amOut || null,
    pmIn: raw.pmIn || null,
    pmOut: raw.pmOut || null,
    status: raw.status || "Regular Duty Day",
    note: raw.note || "",
    totalHours: Number(raw.totalHours) || 0,
  };
}

export function loadHistoryRecords() {
  if (typeof window === "undefined") {
    return SAMPLE_HISTORY;
  }

  try {
    const parsed = parseHistoryArray(window.localStorage.getItem(HISTORY_STORAGE_KEY));
    const source =
      Array.isArray(parsed) && parsed.length > 0 ? parsed : SAMPLE_HISTORY;

    const normalized = source
      .map((record, index) => normalizeHistoryRecord(record, index))
      .filter(Boolean)
      .slice(0, MAX_LOCAL_HISTORY_RECORDS);

    if (source !== SAMPLE_HISTORY) {
      window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(normalized));
    }

    return normalized;
  } catch {
    window.localStorage.removeItem(HISTORY_STORAGE_KEY);
    return SAMPLE_HISTORY;
  }
}

export function prependHistoryRecord(record) {
  if (typeof window === "undefined") return;

  try {
    const existing = parseHistoryArray(window.localStorage.getItem(HISTORY_STORAGE_KEY));
    const next = [record, ...existing]
      .map((item, index) => normalizeHistoryRecord(item, index))
      .filter(Boolean)
      .slice(0, MAX_LOCAL_HISTORY_RECORDS);

    window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Ignore localStorage failures in private/restricted contexts.
  }
}
