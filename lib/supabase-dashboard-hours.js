export async function fetchDashboardInternHoursByUserId({ supabase, userId }) {
  if (!supabase || !userId) return null;

  const { data, error } = await supabase
    .from("dashboard_intern_hours")
    .select(
      "today_rendered_hours, week_rendered_hours, month_rendered_hours, total_rendered_hours, estimated_finish_date",
    )
    .eq("user_id", userId)
    .maybeSingle();

  if (error) return null;

  const todayHours = Number(data?.today_rendered_hours);
  const weekHours = Number(data?.week_rendered_hours);
  const monthHours = Number(data?.month_rendered_hours);
  const totalHours = Number(data?.total_rendered_hours);
  const estimatedFinishDate =
    typeof data?.estimated_finish_date === "string"
      ? data.estimated_finish_date
      : null;

  return {
    todayHours: Number.isFinite(todayHours) ? todayHours : 0,
    weekHours: Number.isFinite(weekHours) ? weekHours : 0,
    monthHours: Number.isFinite(monthHours) ? monthHours : 0,
    totalHours: Number.isFinite(totalHours) ? totalHours : 0,
    estimatedFinishDate,
  };
}
