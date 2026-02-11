"use client";

import { motion } from "framer-motion";
import { Brain, Clock3, Link2, Lock, Target } from "lucide-react";

const features = [
  {
    icon: Lock,
    title: "Fluency Gate",
    short: "Never learn past reading readiness",
    desc: "A prerequisite gate blocks memorization when reading fluency is below threshold.",
  },
  {
    icon: Link2,
    title: "3x3 Linking Protocol",
    short: "Exposure, guided, blind, and link",
    desc: "Every ayah follows strict attempts, and link practice is mandatory for completion.",
  },
  {
    icon: Target,
    title: "Adaptive Scaffolding",
    short: "Beginner, standard, and minimal",
    desc: "Support intensity adapts without changing the core retrieval workflow.",
  },
  {
    icon: Clock3,
    title: "Hour-Level SRS",
    short: "4h to 90d checkpoints",
    desc: "Intervals are timestamp-based, not day-only, so early forgetting is handled properly.",
  },
  {
    icon: Brain,
    title: "Transition Intelligence",
    short: "Track weak links and repair",
    desc: "Verse-to-verse transition scores drive targeted link repair sessions.",
  },
];

export function SolutionShowcase() {
  return (
    <section id="features" className="relative py-24">
      <div className="mx-auto w-full max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45 }}
          className="mb-14 text-center"
        >
          <span className="mb-2 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            The System
          </span>
          <h2 className="text-3xl font-semibold text-slate-900 md:text-4xl">
            What makes Hifz OS different
          </h2>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.article
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
              className="group glass rounded-2xl p-6 transition-transform hover:-translate-y-1"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl gradient-primary">
                <feature.icon size={21} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                {feature.title}
              </h3>
              <p className="mt-1 text-sm font-medium text-slate-700">
                {feature.short}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {feature.desc}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
