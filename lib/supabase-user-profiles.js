import { createClient } from "@/lib/supabase/client";

const USER_PROFILE_COLUMNS =
  "user_id, full_name, phone, department, position, supervisor, company, ojt_start_date, ojt_end_date, target_hours, notifications_enabled, created_at, updated_at";

export function mapUserProfileToOnboardingValues(profile) {
  return {
    full_name: profile?.full_name || "",
    department: profile?.department || "",
    position: profile?.position || "",
    supervisor: profile?.supervisor || "",
    company: profile?.company || "",
    start_date: profile?.ojt_start_date || "",
    end_date: profile?.ojt_end_date || "",
    target_hours:
      profile?.target_hours === null ||
      typeof profile?.target_hours === "undefined"
        ? ""
        : String(profile.target_hours),
  };
}

export async function fetchUserProfileByUserId({ supabase, userId }) {
  const { data, error } = await supabase
    .from("user_profiles")
    .select(USER_PROFILE_COLUMNS)
    .eq("user_id", userId)
    .maybeSingle();

  return { data, error };
}

export async function saveUserOnboardingProfile({ supabase, userId, values }) {
  const nowIso = new Date().toISOString();

  const payload = {
    user_id: userId,
    full_name: values.full_name.trim(),
    phone: null,
    department: values.department.trim() || null,
    position: values.position.trim() || null,
    supervisor: values.supervisor.trim() || null,
    company: values.company.trim() || null,
    ojt_start_date: values.start_date || null,
    ojt_end_date: values.end_date || null,
    target_hours: Number(values.target_hours),
    notifications_enabled: true,
    created_at: nowIso,
    updated_at: nowIso,
  };

  const { data, error } = await supabase
    .from("user_profiles")
    .upsert(payload, { onConflict: "user_id" })
    .select(USER_PROFILE_COLUMNS)
    .maybeSingle();

  return { data, error };
}

export function isUserProfileOnboarded(profile) {
  return Boolean(profile?.user_id && Number(profile?.target_hours) > 0);
}
