"use client";

import Link from "next/link";
import { Clock4, Moon, Sun } from "lucide-react";
import useThemeMode from "@/hooks/useThemeMode";
import { GLASS_STYLE } from "@/lib/dtr-constants";

export default function LandingNavbar() {
  const { resolvedMode, toggleTheme } = useThemeMode();

  return (
    <header className="sticky top-0 z-50 px-4 py-4 sm:px-6">
      <nav className="flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl">
            <img
              src="/logo.jpg"
              alt="Logo"
              className="h-full w-full object-contain"
            />
          </span>
          <span
            className="text-lg font-extrabold tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            JustIn Time Report
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-9 w-9 items-center justify-center rounded-xl border transition-colors"
            style={{
              borderColor: "var(--border-soft)",
              background: "var(--surface-muted)",
              color: "var(--text-secondary)",
            }}
          >
            {resolvedMode === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <Link
            href="/login"
            className="hidden text-sm font-semibold no-underline sm:inline"
            style={{ color: "#60a5fa" }}
          >
            Log in
          </Link>

          <Link
            href="/login?mode=signup"
            className="hidden sm:inline-block rounded-xl px-4 py-2 text-sm font-bold text-white no-underline transition-transform hover:scale-[1.02]"
            style={{
              background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
              boxShadow: "0 4px 16px rgba(37,99,235,0.38)",
            }}
          >
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  );
}
