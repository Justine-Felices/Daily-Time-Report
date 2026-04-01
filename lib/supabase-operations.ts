import { createClient } from "./supabase/client";

const supabase = createClient();

/**
 * Map display status values to database enum values
 */
function mapStatusToEnum(status) {
  const statusMap = {
    "Regular Duty Day": "REGULAR_DUTY_DAY",
    "Sick Leave": "SICK_LEAVE",
    "Vacation Leave": "VACATION_LEAVE",
    Absent: "ABSENT",
    Holiday: "HOLIDAY",
    "Half Day": "HALF_DAY",
    "Work From Home": "WORK_FROM_HOME",
    "On Field": "ON_FIELD",
  };
  return statusMap[status] || status;
}

/**
 * Create a new attendance record in Supabase
 */
export async function createAttendanceRecord({
  date,
  am_in,
  am_out,
  pm_in,
  pm_out,
  status,
  note,
  total_hours,
}) {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error(
        "You must be logged in to save attendance. Please log in and try again.",
      );
    }

    const { data, error } = await supabase
      .from("attendance_entries")
      .insert({
        work_date: date,
        am_in: am_in || null,
        am_out: am_out || null,
        pm_in: pm_in || null,
        pm_out: pm_out || null,
        status: mapStatusToEnum(status),
        note: note || null,
        total_hours,
        source: "ENCODE_PAST",
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error details:", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });

      // Handle common error cases
      if (error.code === "PGRST204") {
        // Column not found error - extract details from message
        const extractedError = error.hint || error.message || "Unknown column";
        throw new Error(
          `Database schema mismatch: ${extractedError}. Please check that all columns exist (work_date, am_in, am_out, pm_in, pm_out, status, note, total_hours, entry_source, user_id).`,
        );
      }

      // Check for other Postgres errors
      if (error.code === "23505") {
        throw new Error(
          "A record for this date already exists. Please update the existing record instead.",
        );
      }

      throw new Error(
        error.message || "Failed to save attendance record. Please try again.",
      );
    }

    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error creating attendance record:", message);
    throw error;
  }
}
