import { HISTORY_STORAGE_KEY, SAMPLE_HISTORY } from "@/lib/dtr-constants";

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
    const parsed = JSON.parse(
      window.localStorage.getItem(HISTORY_STORAGE_KEY) || "[]",
    );
    const source =
      Array.isArray(parsed) && parsed.length > 0 ? parsed : SAMPLE_HISTORY;

    return source
      .map((record, index) => normalizeHistoryRecord(record, index))
      .filter(Boolean);
  } catch {
    return SAMPLE_HISTORY;
  }
}

export function prependHistoryRecord(record) {
  if (typeof window === "undefined") return;

  try {
    const existing = JSON.parse(
      window.localStorage.getItem(HISTORY_STORAGE_KEY) || "[]",
    );

    window.localStorage.setItem(
      HISTORY_STORAGE_KEY,
      JSON.stringify([record, ...existing]),
    );
  } catch {
    // Ignore localStorage failures in private/restricted contexts.
  }
}
