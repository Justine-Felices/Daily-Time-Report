"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { History, Home, Menu, PenLine, User, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { SkeletonBlock } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";
import { APP_CONTAINER_CLASS } from "@/lib/layout-constants";

const NAV_LINKS = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/encode-past", label: "Encode Past", icon: PenLine },
  { to: "/history", label: "Activity Logs", icon: History },
  { to: "/profile", label: "Profile", icon: User },
];

function toInitials(name) {
  if (!name) return "--";
  const tokens = name.trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return "--";
  return tokens
    .slice(0, 2)
    .map((token) => token.charAt(0).toUpperCase())
    .join("");
}

function NavLink({ href, label, isActive, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "relative px-4 py-2 text-[14px] font-medium transition-colors",
        isActive ? "text-white" : "text-white/50 hover:text-white/80",
      )}
    >
      {label}
      {isActive && (
        <span
          className="absolute -bottom-0.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-blue-400"
          style={{ boxShadow: "0 0 10px rgba(59, 130, 246, 0.9)" }}
        />
      )}
    </Link>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const [isViewerLoading, setIsViewerLoading] = useState(true);
  const [viewer, setViewer] = useState({
    name: "---",
    initials: "JD",
  });

  const activePageLabel =
    NAV_LINKS.find((link) => link.to === pathname)?.label ?? "Home";

  const supabase = useMemo(() => {
    const hasConfig =
      typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
      Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
    return hasConfig ? createClient() : null;
  }, []);

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
        } = await supabase.auth.getSession();
        const user = session?.user ?? null;
        if (!mounted || !user) return;

        const { data: profile } = await supabase
          .from("user_profiles")
          .select("full_name")
          .eq("user_id", user.id)
          .maybeSingle();

        if (!mounted) return;

        const resolvedName =
          profile?.full_name?.trim() ||
          user.user_metadata?.full_name?.trim() ||
          user.email?.split("@")[0] ||
          "User";

        setViewer({
          name: resolvedName,
          initials: toInitials(resolvedName),
        });
      } finally {
        if (mounted) setIsViewerLoading(false);
      }
    };
    loadViewer();
    return () => {
      mounted = false;
    };
  }, [supabase]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 no-print pt-5 sm:pt-6">
      <div className={APP_CONTAINER_CLASS}>
        <div className="flex items-center justify-between gap-6">
          {/* Logo */}
          <Link
            href="/dashboard"
            className="flex shrink-0 items-center gap-3 no-underline"
          >
            <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl">
              <img
                src="/logo_no_bg.png"
                alt="Logo"
                className="h-full w-full object-contain"
              />
            </span>
            <span className="hidden text-[17px] font-bold tracking-tight text-white sm:inline">
              JustIn Time Report
            </span>
          </Link>

          {/* Desktop nav — centered */}
          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                href={link.to}
                label={link.label}
                isActive={pathname === link.to}
              />
            ))}
          </nav>

          {/* Profile pill */}
          <div className="flex items-center gap-3">
            <div
              className="hidden items-center gap-2.5 rounded-full border border-white/[0.08] px-2.5 py-1.5 sm:flex"
              style={{ background: "rgba(17, 24, 34, 0.85)" }}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-400 text-[11px] font-bold text-white">
                {viewer.initials}
              </span>
              <div className="min-w-0 leading-tight pr-1">
                {isViewerLoading ? (
                  <SkeletonBlock className="h-8 w-24 rounded-md" />
                ) : (
                  <>
                    <p className="truncate text-[13px] font-semibold text-white">
                      {viewer.name}
                    </p>
                    <p className="text-[10px] text-white/40">{activePageLabel}</p>
                  </>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded-lg p-2 text-white/70 transition-colors hover:text-white lg:hidden"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            className="mt-4 rounded-2xl border border-white/[0.08] p-4 lg:hidden"
            style={{ background: "rgba(17, 24, 34, 0.95)" }}
          >
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  href={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                    pathname === link.to
                      ? "bg-blue-600/20 text-white"
                      : "text-white/55 hover:bg-white/5 hover:text-white",
                  )}
                >
                  <link.icon size={17} />
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-3 border-t border-white/[0.06] pt-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-400 text-xs font-bold text-white">
                {viewer.initials}
              </span>
              <div>
                <p className="text-sm font-semibold text-white">{viewer.name}</p>
                <p className="text-xs text-white/40">{activePageLabel}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
