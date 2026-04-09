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
  mode,
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

    const basePayload = {
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
    };

    const payload =
      mode === "simple" || mode === "session"
        ? { ...basePayload, mode }
        : basePayload;

    const { data, error } = await supabase
      .from("attendance_entries")
      .insert(payload)
      .select()
      .single();

    if (error) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("Supabase write warning", {
          code: error.code,
          message: error.message,
        });
      }

      throw new Error(toUserSafeErrorMessage(error));
    }

    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    if (process.env.NODE_ENV !== "production") {
      console.warn("Attendance record save failed:", message);
    }
    throw error;
  }
}

/**
 * Create multiple attendance records at once.
 * onDuplicate="skip" inserts only dates that do not yet exist.
 * onDuplicate="replace" upserts records by (user_id, work_date).
 */
export async function createBulkAttendanceRecords({
  entries,
  onDuplicate = "skip",
}) {
  try {
    if (!Array.isArray(entries) || entries.length === 0) {
      return {
        insertedCount: 0,
        skippedCount: 0,
        replacedCount: 0,
        duplicates: [],
      };
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error(
        "You must be logged in to save attendance. Please log in and try again.",
      );
    }

    const normalizedDates = entries
      .map((entry) => entry?.date)
      .filter((date) => typeof date === "string");

    const { data: existingRows, error: existingError } = await supabase
      .from("attendance_entries")
      .select("work_date")
      .eq("user_id", user.id)
      .in("work_date", normalizedDates);

    if (existingError) {
      throw new Error(toUserSafeErrorMessage(existingError));
    }

    const existingSet = new Set(
      Array.isArray(existingRows)
        ? existingRows
            .map((row) => row?.work_date)
            .filter((date) => typeof date === "string")
        : [],
    );

    const duplicates = normalizedDates.filter((date) => existingSet.has(date));

    const payload = entries.map((entry) => {
      const basePayload = {
        work_date: entry.date,
        am_in: entry.am_in || null,
        am_out: entry.am_out || null,
        pm_in: entry.pm_in || null,
        pm_out: entry.pm_out || null,
        status: mapStatusToEnum(entry.status),
        note: entry.note || null,
        total_hours: Number(entry.total_hours) || 0,
        source: "ENCODE_PAST",
        user_id: user.id,
      };

      return entry.mode === "simple" || entry.mode === "session"
        ? { ...basePayload, mode: entry.mode }
        : basePayload;
    });

    if (onDuplicate === "replace") {
      const { error: upsertError } = await supabase
        .from("attendance_entries")
        .upsert(payload, { onConflict: "user_id,work_date" });

      if (upsertError) {
        throw new Error(toUserSafeErrorMessage(upsertError));
      }

      return {
        insertedCount: Math.max(0, payload.length - duplicates.length),
        skippedCount: 0,
        replacedCount: duplicates.length,
        duplicates,
      };
    }

    const rowsToInsert = payload.filter(
      (row) => !existingSet.has(row.work_date),
    );

    if (rowsToInsert.length > 0) {
      const { error: insertError } = await supabase
        .from("attendance_entries")
        .insert(rowsToInsert);

      if (insertError) {
        throw new Error(toUserSafeErrorMessage(insertError));
      }
    }

    return {
      insertedCount: rowsToInsert.length,
      skippedCount: duplicates.length,
      replacedCount: 0,
      duplicates,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    if (process.env.NODE_ENV !== "production") {
      console.warn("Bulk attendance save failed:", message);
    }
    throw error;
  }
}
