import { NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 240;
const LOGIN_RATE_LIMIT_MAX_REQUESTS = 20;
const ONBOARDING_CACHE_TTL_MS = 60 * 1000;

const rateLimitStore = globalThis.__dtrRateLimitStore || new Map();
const onboardingStateStore = globalThis.__dtrOnboardingStateStore || new Map();

globalThis.__dtrRateLimitStore = rateLimitStore;
globalThis.__dtrOnboardingStateStore = onboardingStateStore;

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

function getClientIp(request) {
  const xForwardedFor = request.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    const [first] = xForwardedFor.split(",");
    if (first?.trim()) {
      return first.trim();
    }
  }

  return request.headers.get("x-real-ip") || "unknown";
}

function getRateLimitConfig(pathname) {
  const isLoginRoute = pathname === "/login";

  return {
    bucket: isLoginRoute ? "login" : "default",
    maxRequests: isLoginRoute
      ? LOGIN_RATE_LIMIT_MAX_REQUESTS
      : RATE_LIMIT_MAX_REQUESTS,
  };
}

function checkRateLimit({ key, maxRequests, windowMs }) {
  const now = Date.now();
  const existing = rateLimitStore.get(key);

  if (!existing || now >= existing.resetAt) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });

    return {
      allowed: true,
      limit: maxRequests,
      remaining: maxRequests - 1,
      resetAt: now + windowMs,
    };
  }

  if (existing.count >= maxRequests) {
    return {
      allowed: false,
      limit: maxRequests,
      remaining: 0,
      resetAt: existing.resetAt,
    };
  }

  existing.count += 1;
  rateLimitStore.set(key, existing);

  return {
    allowed: true,
    limit: maxRequests,
    remaining: Math.max(0, maxRequests - existing.count),
    resetAt: existing.resetAt,
  };
}

function buildRateLimitedResponse({ limit, resetAt }) {
  const retryAfterSeconds = Math.max(1, Math.ceil((resetAt - Date.now()) / 1000));

  const response = new NextResponse("Too Many Requests", {
    status: 429,
    headers: {
      "Retry-After": String(retryAfterSeconds),
      "X-RateLimit-Limit": String(limit),
      "X-RateLimit-Remaining": "0",
      "X-RateLimit-Reset": String(Math.floor(resetAt / 1000)),
    },
  });

  return response;
}

function getCachedOnboardingState(userId) {
  const cached = onboardingStateStore.get(userId);
  if (!cached) return null;

  if (Date.now() >= cached.expiresAt) {
    onboardingStateStore.delete(userId);
    return null;
  }

  return cached.onboarded;
}

function setCachedOnboardingState(userId, onboarded) {
  onboardingStateStore.set(userId, {
    onboarded,
    expiresAt: Date.now() + ONBOARDING_CACHE_TTL_MS,
  });
}

export async function proxy(request) {
  const pathname = request.nextUrl.pathname;
  const ip = getClientIp(request);
  const { bucket, maxRequests } = getRateLimitConfig(pathname);
  const rateLimit = checkRateLimit({
    key: `${bucket}:${ip}`,
    maxRequests,
    windowMs: RATE_LIMIT_WINDOW_MS,
  });

  if (!rateLimit.allowed) {
    return buildRateLimitedResponse(rateLimit);
  }

  const { response, user, supabase } = await updateSession(request);

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

  const canUseCache = !isOnboardingRoute;
  const cachedOnboardingState = canUseCache
    ? getCachedOnboardingState(user.id)
    : null;

  let onboarded = cachedOnboardingState;

  if (typeof onboarded !== "boolean") {
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("user_id,target_hours")
      .eq("user_id", user.id)
      .maybeSingle();

    onboarded = !profileError && isUserOnboarded(profile);

    if (!profileError) {
      setCachedOnboardingState(user.id, onboarded);
    }
  }

  if (!onboarded && !isOnboardingRoute) {
    return redirectWithCookies(request, response, "/onboarding");
  }

  if (onboarded && (isLoginRoute || isOnboardingRoute)) {
    return redirectWithCookies(request, response, "/");
  }

  if (isLoginRoute) {
    return redirectWithCookies(request, response, "/");
  }

  response.headers.set("X-RateLimit-Limit", String(rateLimit.limit));
  response.headers.set("X-RateLimit-Remaining", String(rateLimit.remaining));
  response.headers.set(
    "X-RateLimit-Reset",
    String(Math.floor(rateLimit.resetAt / 1000)),
  );

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
