import { createClient } from "@/lib/supabase/client";

export async function fetchOverallInternHoursByUserId({ supabase, userId }) {
  if (!supabase || !userId) return null;

  const { data, error } = await supabase
    .from("overall_intern_hours")
    .select("total_rendered_hours")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) return null;

  const parsedHours = Number(data?.total_rendered_hours);
  return Number.isFinite(parsedHours) ? parsedHours : 0;
}

export async function fetchCurrentUserOverallInternHours() {
  const hasSupabaseConfig =
    typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
    /^https?:\/\//.test(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

  if (!hasSupabaseConfig) return null;

  const supabase = createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) return null;

  return fetchOverallInternHoursByUserId({
    supabase,
    userId: user.id,
  });
}
