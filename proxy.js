import { NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

function copyCookies(fromResponse, toResponse) {
  fromResponse.cookies.getAll().forEach((cookie) => {
    toResponse.cookies.set(cookie);
  });
}

function redirectWithCookies(request, response, path) {
  const redirectResponse = NextResponse.redirect(new URL(path, request.url));
  copyCookies(response, redirectResponse);
  return redirectResponse;
}

function isUserOnboarded(profile) {
  return Boolean(profile?.user_id && Number(profile?.target_hours) > 0);
}

export async function proxy(request) {
  const { response, user, supabase } = await updateSession(request);
  const pathname = request.nextUrl.pathname;

  const isLoginRoute = pathname === "/login";
  const isOnboardingRoute = pathname === "/onboarding";

  if (!user && !isLoginRoute) {
    return redirectWithCookies(request, response, "/login");
  }

  if (!user) {
    return response;
  }

  if (!supabase) {
    if (isLoginRoute) {
      return redirectWithCookies(request, response, "/");
    }

    return response;
  }

  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("user_id,target_hours")
    .eq("user_id", user.id)
    .maybeSingle();

  const onboarded = !profileError && isUserOnboarded(profile);

  if (!onboarded && !isOnboardingRoute) {
    return redirectWithCookies(request, response, "/onboarding");
  }

  if (onboarded && (isLoginRoute || isOnboardingRoute)) {
    return redirectWithCookies(request, response, "/");
  }

  if (isLoginRoute) {
    return redirectWithCookies(request, response, "/");
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
