"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clock4, History, Home, Menu, PenLine, User, X } from "lucide-react";

const NAV_LINKS = [
  { to: "/", label: "Home", icon: Home },
  { to: "/encode-past", label: "Encode Past", icon: PenLine },
  { to: "/history", label: "History", icon: History },
  { to: "/profile", label: "Profile", icon: User },
];

function isActiveRoute(pathname, to) {
  if (to === "/") {
    return pathname === "/";
  }
  return pathname === to || pathname.startsWith(`${to}/`);
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav
      className="no-print sticky top-0 z-50 w-full"
      style={{
        background: "rgba(255,255,255,0.88)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(6,148,148,0.12)",
        boxShadow: "0 2px 20px rgba(6,148,148,0.07)",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{
                background:
                  "linear-gradient(135deg, #046060 0%, #069494 55%, #FF69B4 100%)",
                boxShadow: "0 4px 14px rgba(6,148,148,0.38)",
              }}
            >
              <Clock4 size={16} color="#fff" />
            </div>
            <div>
              <div
                style={{
                  color: "#1E293B",
                  fontSize: "15px",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                }}
              >
                TimeTrack
              </div>
              <div
                style={{
                  color: "#069494",
                  fontSize: "9px",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                }}
              >
                DAILY TIME REPORT
              </div>
            </div>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map(({ to, label, icon: Icon }) => {
              const isActive = isActiveRoute(pathname, to);

              return (
                <Link
                  key={to}
                  href={to}
                  className="no-underline"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "7px 14px",
                    borderRadius: "10px",
                    fontSize: "13px",
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? "#fff" : "#64748B",
                    background: isActive
                      ? "linear-gradient(135deg, #069494 0%, #0aacac 100%)"
                      : "transparent",
                    border: isActive
                      ? "1px solid rgba(6,148,148,0.3)"
                      : "1px solid transparent",
                    transition: "all 0.18s ease",
                    boxShadow: isActive
                      ? "0 3px 10px rgba(6,148,148,0.3)"
                      : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      const el = e.currentTarget;
                      el.style.background = "rgba(6,148,148,0.07)";
                      el.style.color = "#069494";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      const el = e.currentTarget;
                      el.style.background = "transparent";
                      el.style.color = "#64748B";
                    }
                  }}
                >
                  <Icon size={14} />
                  {label}
                </Link>
              );
            })}
          </div>

          <button
            className="flex h-9 w-9 items-center justify-center rounded-xl transition-all md:hidden"
            style={{
              background: mobileOpen ? "rgba(6,148,148,0.08)" : "transparent",
              border: "1px solid rgba(6,148,148,0.18)",
              cursor: "pointer",
              color: "#069494",
            }}
            onClick={() => setMobileOpen((value) => !value)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div
          className="space-y-1 border-t px-4 py-3 md:hidden"
          style={{
            borderColor: "rgba(6,148,148,0.12)",
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          {NAV_LINKS.map(({ to, label, icon: Icon }) => {
            const isActive = isActiveRoute(pathname, to);

            return (
              <Link
                key={to}
                href={to}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 no-underline transition-all"
                style={{
                  background: isActive ? "rgba(6,148,148,0.08)" : "transparent",
                  color: isActive ? "#069494" : "#64748B",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "14px",
                  fontWeight: isActive ? 600 : 500,
                  borderLeft: isActive
                    ? "3px solid #069494"
                    : "3px solid transparent",
                }}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
