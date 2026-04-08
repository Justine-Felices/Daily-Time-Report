import { createClient } from "./supabase/client";

const supabase = createClient();

function toUserSafeErrorMessage(error) {
  if (!error || typeof error !== "object") {
    return "Failed to save attendance record. Please try again.";
  }

  if (error.code === "23505") {
    return "A record for this date already exists. Please update the existing record instead.";
  }

  if (error.code === "PGRST204") {
    return "Unable to save attendance right now due to a temporary database configuration issue.";
  }

  return "Failed to save attendance record. Please try again.";
}

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
      if (process.env.NODE_ENV !== "production") {
        console.error("Supabase write error", {
          code: error.code,
          message: error.message,
        });
      }

      throw new Error(toUserSafeErrorMessage(error));
    }

    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error creating attendance record:", message);
    throw error;
  }
}
