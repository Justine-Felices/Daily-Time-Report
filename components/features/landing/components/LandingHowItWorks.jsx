"use client";

import { motion } from "framer-motion";
import {
  LANDING_COPY,
  LANDING_STEPS,
} from "@/components/features/landing/constants/landing-content";

export default function LandingHowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-12 text-center">
        <h2
          className="mb-3 text-3xl font-extrabold tracking-tight sm:text-4xl"
          style={{ color: "#FFFFFF" }}
        >
          {LANDING_COPY.howItWorksTitle}
        </h2>
        <p className="text-base" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
          {LANDING_COPY.howItWorksSubtitle}
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {LANDING_STEPS.map((item, index) => (
          <motion.div
            key={item.step}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="relative text-center"
          >
            <div
              className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-extrabold text-white"
              style={{
                background: "linear-gradient(135deg, #2563eb, #3b82f6)",
                boxShadow: "0 4px 16px rgba(37,99,235,0.35)",
              }}
            >
              {item.step}
            </div>
            <h3 className="mb-2 text-lg font-bold" style={{ color: "#FFFFFF" }}>
              {item.title}
            </h3>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "rgba(255, 255, 255, 0.5)" }}
            >
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
