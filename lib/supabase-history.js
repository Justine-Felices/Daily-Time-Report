import { toDisplayTime } from "@/lib/dtr-formatters";
import { createClient } from "@/lib/supabase/client";

const STATUS_FROM_ENUM = {
  REGULAR_DUTY_DAY: "Regular Duty Day",
  SICK_LEAVE: "Sick Leave",
  VACATION_LEAVE: "Vacation Leave",
  ABSENT: "Absent",
  HOLIDAY: "Holiday",
  HALF_DAY: "Half Day",
  WORK_FROM_HOME: "Work From Home",
  ON_FIELD: "On Field",
};

const STATUS_TO_ENUM = {
  "Regular Duty Day": "REGULAR_DUTY_DAY",
  "Sick Leave": "SICK_LEAVE",
  "Vacation Leave": "VACATION_LEAVE",
  Absent: "ABSENT",
  Holiday: "HOLIDAY",
  "Half Day": "HALF_DAY",
  "Work From Home": "WORK_FROM_HOME",
  "On Field": "ON_FIELD",
};

function mapStatusFromDatabase(value) {
  if (!value) return "Regular Duty Day";
  return STATUS_FROM_ENUM[value] || value;
}

function mapStatusToDatabase(value) {
  if (!value) return "REGULAR_DUTY_DAY";
  return STATUS_TO_ENUM[value] || value;
}

function mapDatabaseTimeToDisplay(value) {
  if (!value) return null;

  const compactValue = typeof value === "string" ? value.slice(0, 5) : value;
  return toDisplayTime(compactValue) || null;
}

function mapAttendanceEntryToHistoryRecord(entry) {
  return {
    id: entry.id,
    date: entry.work_date,
    amIn: mapDatabaseTimeToDisplay(entry.am_in),
    amOut: mapDatabaseTimeToDisplay(entry.am_out),
    pmIn: mapDatabaseTimeToDisplay(entry.pm_in),
    pmOut: mapDatabaseTimeToDisplay(entry.pm_out),
    otIn: mapDatabaseTimeToDisplay(entry.ot_in),
    otOut: mapDatabaseTimeToDisplay(entry.ot_out),
    status: mapStatusFromDatabase(entry.status),
    note: entry.note || "",
    totalHours: Number(entry.total_hours) || 0,
  };
}

export async function fetchAttendanceHistoryRecords() {
  const hasSupabaseConfig =
    typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
    /^https?:\/\//.test(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

  if (!hasSupabaseConfig) return [];

  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) return [];

  const { data, error } = await supabase
    .from("attendance_entries")
    .select(
      "id, user_id, work_date, status, note, am_in, am_out, pm_in, pm_out, ot_in, ot_out, total_hours, source, created_at, updated_at",
    )
    .eq("user_id", user.id)
    .order("work_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error || !Array.isArray(data)) return [];

  return data.map(mapAttendanceEntryToHistoryRecord);
}

export async function fetchAttendanceRecordsByDateRange({
  supabase,
  userId,
  startDate,
  endDate,
}) {
  if (!supabase || !userId || !startDate || !endDate) return [];

  const { data, error } = await supabase
    .from("attendance_entries")
    .select(
      "id, user_id, work_date, status, note, am_in, am_out, pm_in, pm_out, ot_in, ot_out, total_hours, source, created_at, updated_at",
    )
    .eq("user_id", userId)
    .gte("work_date", startDate)
    .lte("work_date", endDate)
    .order("work_date", { ascending: true })
    .order("created_at", { ascending: false });

  if (error || !Array.isArray(data)) return [];

  return data.map(mapAttendanceEntryToHistoryRecord);
}

/** Sorted YYYY-MM keys for months that have at least one attendance entry */
export async function fetchAttendanceMonthsWithData({ supabase, userId }) {
  if (!supabase || !userId) return [];

  const { data, error } = await supabase
    .from("attendance_entries")
    .select("work_date")
    .eq("user_id", userId)
    .order("work_date", { ascending: true });

  if (error || !Array.isArray(data)) return [];

  const months = new Set();
  data.forEach((entry) => {
    if (typeof entry?.work_date === "string" && entry.work_date.length >= 7) {
      months.add(entry.work_date.slice(0, 7));
    }
  });

  return Array.from(months).sort();
}

export async function updateAttendanceHistoryRecord({
  id,
  workDate,
  amIn,
  amOut,
  pmIn,
  pmOut,
  otIn,
  otOut,
  status,
  note,
  totalHours,
}) {
  const hasSupabaseConfig =
    typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
    /^https?:\/\//.test(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

  if (!hasSupabaseConfig) {
    throw new Error("Supabase is not configured.");
  }

  const supabase = createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("You must be logged in to update records.");
  }

  const payload = {
    work_date: workDate,
    am_in: amIn || null,
    am_out: amOut || null,
    pm_in: pmIn || null,
    pm_out: pmOut || null,
    ot_in: otIn || null,
    ot_out: otOut || null,
    status: mapStatusToDatabase(status),
    note: note?.trim() || null,
    total_hours: Number(totalHours) || 0,
  };

  const { data, error } = await supabase
    .from("attendance_entries")
    .update(payload)
    .eq("id", id)
    .eq("user_id", user.id)
    .select(
      "id, user_id, work_date, status, note, am_in, am_out, pm_in, pm_out, ot_in, ot_out, total_hours, source, created_at, updated_at",
    )
    .single();

  if (error || !data) {
    throw new Error("Failed to save changes.");
  }

  return mapAttendanceEntryToHistoryRecord(data);
}

export async function deleteAttendanceHistoryRecord({ id }) {
  const hasSupabaseConfig =
    typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
    /^https?:\/\//.test(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

  if (!hasSupabaseConfig) {
    throw new Error("Supabase is not configured.");
  }

  const supabase = createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("You must be logged in to delete records.");
  }

  const { error } = await supabase
    .from("attendance_entries")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    throw new Error("Failed to delete entry.");
  }
}

export async function fetchAttendanceRecordByDate({ supabase, userId, dateKey }) {
  if (!supabase || !userId || !dateKey) return null;

  const { data, error } = await supabase
    .from("attendance_entries")
    .select(
      "id, user_id, work_date, status, note, am_in, am_out, pm_in, pm_out, ot_in, ot_out, total_hours, source, created_at, updated_at",
    )
    .eq("user_id", userId)
    .eq("work_date", dateKey)
    .maybeSingle();

  if (error || !data) return null;

  return mapAttendanceEntryToHistoryRecord(data);
}
