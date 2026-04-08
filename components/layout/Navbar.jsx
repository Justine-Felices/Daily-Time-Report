"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clock4, History, Home, Menu, PenLine, User, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { SkeletonBlock } from "@/components/ui/Skeleton";

const NAV_LINKS = [
  { to: "/", label: "Home", icon: Home },
  { to: "/encode-past", label: "Encode Past", icon: PenLine },
  { to: "/history", label: "Activity Logs", icon: History },
  { to: "/profile", label: "Profile", icon: User },
];

function isActiveRoute(pathname, to) {
  if (to === "/") {
    return pathname === "/";
  }
  return pathname === to || pathname.startsWith(`${to}/`);
}

function toInitials(name) {
  if (!name) return "--";

  const tokens = name.trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return "--";

  return tokens
    .slice(0, 2)
    .map((token) => token.charAt(0).toUpperCase())
    .join("");
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const [isViewerLoading, setIsViewerLoading] = useState(true);
  const [viewer, setViewer] = useState({
    name: "---",
    role: "Intern",
    initials: "JD",
  });

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
      setIsViewerLoading(false);
      return;
    }

    let mounted = true;

    const loadViewer = async () => {
      try {
        const {
          data: { session },
          error: authError,
        } = await supabase.auth.getSession();

        const user = session?.user ?? null;

        if (!mounted || authError || !user) return;

        const { data: profile } = await supabase
          .from("user_profiles")
          .select("full_name, position")
          .eq("user_id", user.id)
          .maybeSingle();

        if (!mounted) return;

        const metadataName =
          typeof user.user_metadata?.full_name === "string"
            ? user.user_metadata.full_name.trim()
            : "";
        const fallbackName = user.email ? user.email.split("@")[0] : "";
        const resolvedName =
          profile?.full_name?.trim() || metadataName || fallbackName || "User";

        const metadataRole =
          typeof user.user_metadata?.role === "string"
            ? user.user_metadata.role.trim()
            : "";
        const resolvedRole =
          profile?.position?.trim() || metadataRole || "Intern";

        setViewer({
          name: resolvedName,
          role: resolvedRole,
          initials: toInitials(resolvedName),
        });
      } finally {
        if (!mounted) return;
        setIsViewerLoading(false);
      }
    };

    loadViewer();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  return (
    <nav
      className="no-print sticky top-0 z-50 w-full"
      style={{
        background: "transparent",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        borderBottom: "1px solid var(--border-soft)",
        boxShadow: "var(--shadow-soft)",
      }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between md:hidden">
          <Link href="/" className="flex items-center gap-3 no-underline">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{
                background:
                  "linear-gradient(135deg, #046060 0%, #069494 55%, #FF69B4 100%)",
                boxShadow: "0 4px 14px rgba(6,148,148,0.34)",
              }}
            >
              <Clock4 size={16} color="#fff" />
            </span>
            <span
              className="text-lg font-semibold tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              TimeTrack
            </span>
          </Link>

          <button
            className="flex h-9 w-9 items-center justify-center rounded-xl border transition"
            style={{
              borderColor: "var(--border-soft)",
              background: "var(--surface-card)",
              color: "var(--text-secondary)",
            }}
            onClick={() => setMobileOpen((value) => !value)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <div className="hidden h-18 grid-cols-[1fr_auto_1fr] items-center gap-3 md:grid">
          <Link href="/" className="flex w-fit items-center gap-3 no-underline">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{
                background:
                  "linear-gradient(135deg, #046060 0%, #069494 55%, #FF69B4 100%)",
                boxShadow: "0 4px 14px rgba(6,148,148,0.34)",
              }}
            >
              <Clock4 size={16} color="#fff" />
            </span>
            <span
              className="text-[1.7rem] font-semibold leading-none tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              TimeTrack
            </span>
          </Link>

          <div
            className="flex items-center gap-1 rounded-full p-1"
            style={{
              border: "1px solid var(--border-soft)",
              background: "var(--surface-card)",
              boxShadow: "var(--shadow-soft)",
            }}
          >
            {NAV_LINKS.map(({ to, label }) => {
              const isActive = isActiveRoute(pathname, to);

              return (
                <Link
                  key={to}
                  href={to}
                  className={`rounded-full px-4 py-2 text-sm font-medium no-underline transition-all ${
                    isActive ? "text-white" : ""
                  }`}
                  style={
                    isActive
                      ? {
                          background:
                            "linear-gradient(135deg, #069494 0%, #0aacac 100%)",
                          boxShadow: "0 3px 10px rgba(6,148,148,0.28)",
                        }
                      : {
                          color: "var(--text-secondary)",
                        }
                  }
                  aria-current={isActive ? "page" : undefined}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              className="flex items-center gap-2 rounded-xl border px-2.5 py-1.5 text-left transition"
              style={{
                borderColor: "var(--border-soft)",
                background: "var(--surface-card)",
              }}
              aria-label="Open user profile"
            >
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-semibold text-white"
                style={{
                  background:
                    "linear-gradient(140deg, #046060 0%, #069494 70%, #14b8a6 100%)",
                }}
              >
                {viewer.initials}
              </span>
              <span className="leading-tight">
                {isViewerLoading ? (
                  <span className="block space-y-1">
                    <SkeletonBlock className="h-4 w-28 rounded-md" />
                    <SkeletonBlock className="h-3 w-20 rounded-md" />
                  </span>
                ) : (
                  <>
                    <span
                      className="block text-sm font-semibold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {viewer.name}
                    </span>
                    <span
                      className="block text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {viewer.role}
                    </span>
                  </>
                )}
              </span>
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div
          className="space-y-1 border-t px-4 py-3 md:hidden"
          style={{
            borderColor: "var(--border-soft)",
            background: "var(--page-bg)",
          }}
        >
          {NAV_LINKS.map(({ to, label, icon: Icon }) => {
            const isActive = isActiveRoute(pathname, to);

            return (
              <Link
                key={to}
                href={to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium no-underline transition-all ${
                  isActive ? "text-white" : "text-slate-700"
                }`}
                style={
                  isActive
                    ? {
                        borderColor: "rgba(6,148,148,0.22)",
                        background:
                          "linear-gradient(135deg, #069494 0%, #0aacac 100%)",
                      }
                    : {
                        borderColor: "var(--border-soft)",
                        background: "var(--surface-card)",
                        color: "var(--text-secondary)",
                      }
                }
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}

          <div
            className="mt-3 flex items-center gap-2 rounded-xl border px-3 py-2"
            style={{
              borderColor: "var(--border-soft)",
              background: "var(--surface-card)",
            }}
          >
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-semibold text-white"
              style={{
                background:
                  "linear-gradient(140deg, #046060 0%, #069494 70%, #14b8a6 100%)",
              }}
            >
              {viewer.initials}
            </span>
            <div className="leading-tight">
              <p
                className="text-sm font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                {viewer.name}
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {viewer.role}
              </p>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
