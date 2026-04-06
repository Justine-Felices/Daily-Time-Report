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

function mapStatusFromDatabase(value) {
  if (!value) return "Regular Duty Day";
  return STATUS_FROM_ENUM[value] || value;
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
      "id, user_id, work_date, status, note, am_in, am_out, pm_in, pm_out, total_hours, source, created_at, updated_at",
    )
    .eq("user_id", user.id)
    .order("work_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error || !Array.isArray(data)) return [];

  return data.map(mapAttendanceEntryToHistoryRecord);
}
