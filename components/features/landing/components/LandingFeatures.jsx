"use client";

import { motion } from "framer-motion";
import GlassCard from "@/components/ui/cards/GlassCard";
import {
  LANDING_COPY,
  LANDING_FEATURES,
} from "@/components/features/landing/constants/landing-content";

export default function LandingFeatures() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-12 text-center">
        <h2
          className="mb-3 text-3xl font-extrabold tracking-tight sm:text-4xl"
          style={{ color: "#FFFFFF" }}
        >
          {LANDING_COPY.featuresTitle}
        </h2>
        <p
          className="mx-auto max-w-2xl text-base"
          style={{ color: "rgba(255, 255, 255, 0.6)" }}
        >
          {LANDING_COPY.featuresSubtitle}
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {LANDING_FEATURES.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
          >
            <GlassCard
              padding="24px"
              className="h-full transition-all hover:scale-[1.02] hover:bg-white/[0.05]"
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                backdropFilter: "blur(40px)",
                WebkitBackdropFilter: "blur(40px)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
              }}
            >
              <span
                className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl shadow-lg shadow-blue-500/10"
                style={{
                  background: "rgba(59, 130, 246, 0.15)",
                  color: "#60a5fa",
                  border: "1px solid rgba(59, 130, 246, 0.2)",
                }}
              >
                <feature.icon size={22} />
              </span>
              <h3
                className="mb-2 text-base font-bold"
                style={{ color: "#FFFFFF" }}
              >
                {feature.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "rgba(255, 255, 255, 0.5)" }}
              >
                {feature.description}
              </p>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
