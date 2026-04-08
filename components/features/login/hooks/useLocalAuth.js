import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  fetchUserProfileByUserId,
  isUserProfileOnboarded,
} from "@/lib/supabase-user-profiles";
import { HISTORY_STORAGE_KEY } from "@/lib/dtr-constants";

const ENCODE_PAST_DRAFT_STORAGE_KEY = "dtr-encode-past-form-draft";
const HOME_STATUS_SAVE_LOCK_KEY = "dtr-home-status-save-lock";

function clearLocalAttendanceCache() {
  if (typeof window === "undefined") return;

  [HISTORY_STORAGE_KEY, ENCODE_PAST_DRAFT_STORAGE_KEY, HOME_STATUS_SAVE_LOCK_KEY].forEach(
    (key) => {
      try {
        window.localStorage.removeItem(key);
      } catch {
        // Ignore restricted storage contexts.
      }
    },
  );
}

async function resolvePostAuthRoute({ supabase, userId }) {
  if (!supabase || !userId) return "/";

  const { data: profile, error } = await fetchUserProfileByUserId({
    supabase,
    userId,
  });

  if (error) return "/";

  return isUserProfileOnboarded(profile) ? "/" : "/onboarding";
}

export default function useLocalAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const hasSupabaseConfig =
    typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
    /^https?:\/\//.test(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

  const supabase = useMemo(() => {
    if (!hasSupabaseConfig) return null;
    return createClient();
  }, [hasSupabaseConfig]);

  useEffect(() => {
    if (!supabase) {
      setIsLoggedIn(false);
      return;
    }

    let isMounted = true;

    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (!isMounted) return;
      if (error) {
        setIsLoggedIn(false);
        return;
      }

      setIsLoggedIn(Boolean(data.session));
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(Boolean(session));

      if (!session) {
        clearLocalAttendanceCache();
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const login = async (email, password) => {
    if (!supabase) {
      return {
        error:
          "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
      };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: error.message };
    }

    const userId = data?.user?.id || data?.session?.user?.id || null;
    const redirectTo = await resolvePostAuthRoute({ supabase, userId });

    return { error: null, redirectTo };
  };

  const signup = async (email, password, name) => {
    if (!supabase) {
      return {
        error:
          "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
        needsEmailConfirmation: false,
      };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      return { error: error.message, needsEmailConfirmation: false };
    }

    const needsEmailConfirmation = !data.session;
    let redirectTo = "/";

    if (!needsEmailConfirmation) {
      const userId = data?.user?.id || data?.session?.user?.id || null;
      redirectTo = await resolvePostAuthRoute({ supabase, userId });
    }

    return {
      error: null,
      needsEmailConfirmation,
      redirectTo,
    };
  };

  const logout = async () => {
    if (!supabase) {
      return {
        error:
          "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
      };
    }

    const { error } = await supabase.auth.signOut();

    if (error) {
      return { error: error.message };
    }

    clearLocalAttendanceCache();

    return { error: null };
  };

  return { isLoggedIn, login, signup, logout };
}
