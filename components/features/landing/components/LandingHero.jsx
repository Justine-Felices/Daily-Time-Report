"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock4 } from "lucide-react";
import GlassCard from "@/components/ui/cards/GlassCard";
import { LANDING_COPY } from "@/components/features/landing/constants/landing-content";

export default function LandingHero() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-76px)] max-w-7xl flex-col justify-center px-4 py-12 sm:px-6 lg:py-0">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span
            className="mb-4 inline-block rounded-full px-3 py-1 text-xs font-bold tracking-wide"
            style={{
              background: "rgba(59,130,246,0.12)",
              color: "#60a5fa",
              border: "1px solid rgba(59,130,246,0.2)",
            }}
          >
            BUILT FOR OJT & INTERNSHIP
          </span>

          <h1
            className="mb-5 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-[3.25rem]"
            style={{ color: "#FFFFFF" }}
          >
            {LANDING_COPY.heroHeadline}
          </h1>

          <p
            className="mb-8 max-w-lg text-lg leading-relaxed"
            style={{ color: "rgba(255, 255, 255, 0.6)" }}
          >
            {LANDING_COPY.heroSubheadline}
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/login?mode=signup"
              className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white no-underline transition-transform hover:scale-[1.02]"
              style={{
                background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
                boxShadow: "0 4px 20px rgba(37,99,235,0.4)",
              }}
            >
              {LANDING_COPY.heroPrimaryCta}
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center rounded-xl border px-6 py-3 text-sm font-semibold no-underline transition-colors hover:opacity-90"
              style={{
                borderColor: "var(--border-soft)",
                background: "var(--surface-muted)",
                color: "#60a5fa",
              }}
            >
              {LANDING_COPY.heroSecondaryCta}
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <GlassCard
            padding="28px"
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              backdropFilter: "blur(40px)",
              WebkitBackdropFilter: "blur(40px)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
            }}
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg shadow-lg shadow-blue-500/10">
                  <img
                    src="/logo.jpg"
                    alt="Logo"
                    className="h-full w-full object-contain"
                  />
                </span>
                <div>
                  <p className="text-sm font-bold" style={{ color: "#FFFFFF" }}>
                    Today&apos;s Attendance
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "rgba(255, 255, 255, 0.5)" }}
                  >
                    Regular Duty Day
                  </p>
                </div>
              </div>
              <span
                className="rounded-full px-2.5 py-1 text-[10px] font-bold"
                style={{
                  background: "rgba(34,197,94,0.15)",
                  color: "#4ade80",
                  border: "1px solid rgba(34,197,94,0.2)",
                }}
              >
                CLOCKED IN
              </span>
            </div>

            <div
              className="mb-8 rounded-2xl px-5 py-7 text-center ring-1 ring-inset ring-white/[0.05]"
              style={{ background: "rgba(0, 0, 0, 0.2)" }}
            >
              <p
                className="text-5xl font-extrabold tabular-nums tracking-tighter"
                style={{
                  background:
                    "linear-gradient(to right, #60a5fa, #3b82f6, #f472b6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                08:32:14
              </p>
              <p
                className="mt-2 text-xs font-medium"
                style={{ color: "rgba(255, 255, 255, 0.4)" }}
              >
                AM session · 3.5 hrs logged today
              </p>
            </div>

            <div className="space-y-4">
              {[
                { label: "Target hours", value: "486 / 600 hrs", pct: 81 },
                { label: "This week", value: "32.5 hrs", pct: 65 },
              ].map((row) => (
                <div key={row.label}>
                  <div className="mb-2 flex justify-between text-[11px] font-medium uppercase tracking-wider">
                    <span style={{ color: "rgba(255, 255, 255, 0.4)" }}>
                      {row.label}
                    </span>
                    <span style={{ color: "#FFFFFF" }}>{row.value}</span>
                  </div>
                  <div
                    className="h-1.5 overflow-hidden rounded-full"
                    style={{ background: "rgba(255, 255, 255, 0.05)" }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${row.pct}%`,
                        background:
                          "linear-gradient(90deg, #3b82f6, #60a5fa, #f472b6)",
                        boxShadow: "0 0 12px rgba(59,130,246,0.4)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
