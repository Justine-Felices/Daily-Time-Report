"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/cards/GlassCard";
import { LANDING_COPY } from "@/components/features/landing/constants/landing-content";

export default function LandingCta() {
  return (
    <section className="mx-auto flex flex-col items-center justify-center px-4 py-32 text-center sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl"
      >
        <h2
          className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl"
          style={{ color: "#FFFFFF" }}
        >
          {LANDING_COPY.ctaTitle}
        </h2>
        <p
          className="mx-auto mb-10 max-w-xl text-lg"
          style={{ color: "rgba(255, 255, 255, 0.6)" }}
        >
          {LANDING_COPY.ctaSubtitle}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/login?mode=signup"
            className="inline-flex items-center gap-2 rounded-2xl px-8 py-4 text-base font-bold text-white no-underline transition-all hover:scale-[1.05]"
            style={{
              background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
              boxShadow: "0 8px 30px rgba(37,99,235,0.4)",
            }}
          >
            {LANDING_COPY.ctaPrimary}
            <ArrowRight size={18} />
          </Link>

          <Link
            href="/login"
            className="inline-flex items-center rounded-2xl border px-8 py-4 text-base font-semibold no-underline transition-all hover:bg-white/5"
            style={{
              borderColor: "rgba(255, 255, 255, 0.1)",
              background: "rgba(255, 255, 255, 0.05)",
              color: "#60a5fa",
            }}
          >
            {LANDING_COPY.ctaSecondary}
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
