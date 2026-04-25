"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clock4, History, Home, PenLine, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { SkeletonBlock } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";
import {
  Navbar as ResizableNavbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/ResizableNavbar";

const NAV_LINKS = [
  { to: "/", label: "Home", icon: Home },
  { to: "/encode-past", label: "Encode Past", icon: PenLine },
  { to: "/history", label: "Activity Logs", icon: History },
  { to: "/profile", label: "Profile", icon: User },
];

function toInitials(name) {
  if (!name) return "--";
  const tokens = name.trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return "--";
  return tokens.slice(0, 2).map((token) => token.charAt(0).toUpperCase()).join("");
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

  const supabase = useMemo(() => {
    const hasConfig = typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
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
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user ?? null;
        if (!mounted || !user) return;

        const { data: profile } = await supabase
          .from("user_profiles")
          .select("full_name, position")
          .eq("user_id", user.id)
          .maybeSingle();

        if (!mounted) return;

        const resolvedName = profile?.full_name?.trim() || user.user_metadata?.full_name?.trim() || user.email?.split("@")[0] || "User";
        const resolvedRole = profile?.position?.trim() || user.user_metadata?.role?.trim() || "Intern";

        setViewer({
          name: resolvedName,
          role: resolvedRole,
          initials: toInitials(resolvedName),
        });
      } finally {
        if (mounted) setIsViewerLoading(false);
      }
    };
    loadViewer();
    return () => { mounted = false; };
  }, [supabase]);

  return (
    <ResizableNavbar className="no-print">
      {/* Desktop Navigation */}
      <NavBody>
        <Link href="/" className="flex items-center gap-3 no-underline z-20">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-700 via-teal-600 to-pink-500 shadow-lg shadow-teal-900/20">
            <Clock4 size={16} color="#fff" />
          </span>
          <span className="text-xl font-bold tracking-tight text-white">TimeTrack</span>
        </Link>

        <NavItems items={NAV_LINKS} pathname={pathname} />

        <div className="flex items-center gap-2 z-20">
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5 text-left">
            <span className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-semibold text-white bg-gradient-to-br from-teal-800 to-teal-500">
              {viewer.initials}
            </span>
            <div className="hidden sm:block leading-tight">
              {isViewerLoading ? (
                <SkeletonBlock className="h-4 w-24 rounded-md" />
              ) : (
                <>
                  <p className="text-sm font-semibold text-white">{viewer.name}</p>
                  <p className="text-[10px] text-white/50">{viewer.role}</p>
                </>
              )}
            </div>
          </div>
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav>
        <MobileNavHeader>
          <Link href="/" className="flex items-center gap-2 no-underline">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-teal-700 to-teal-500">
              <Clock4 size={12} color="#fff" />
            </span>
            <span className="text-lg font-bold text-white">TimeTrack</span>
          </Link>
          <MobileNavToggle isOpen={mobileOpen} onClick={() => setMobileOpen(!mobileOpen)} />
        </MobileNavHeader>

        <MobileNavMenu isOpen={mobileOpen}>
          <div className="flex flex-col gap-2 w-full">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                href={link.to}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                  pathname === link.to 
                    ? "bg-teal-600 text-white" 
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
              >
                <link.icon size={18} />
                {link.label}
              </Link>
            ))}
            
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white bg-teal-600">
                {viewer.initials}
              </span>
              <div>
                <p className="text-sm font-bold text-white">{viewer.name}</p>
                <p className="text-xs text-white/50">{viewer.role}</p>
              </div>
            </div>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </ResizableNavbar>
  );
}
