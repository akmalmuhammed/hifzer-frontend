"use client";

import { motion } from "framer-motion";
import { Crown, Flame, Sprout, Wind } from "lucide-react";

const stages = [
  {
    icon: Sprout,
    title: "Foundation",
    period: "Days 0-20",
    desc: "Build stable recitation and daily rhythm.",
    gradient: "gradient-dawn",
  },
  {
    icon: Flame,
    title: "Habit Formation",
    period: "Days 21-65",
    desc: "Lock consistency with strict review safety.",
    gradient: "gradient-day",
  },
  {
    icon: Wind,
    title: "Autonomy",
    period: "Day 66+",
    desc: "Scaffolding lightens while linking remains mandatory.",
    gradient: "gradient-dusk",
  },
  {
    icon: Crown,
    title: "Post-Hifz",
    period: "Completion",
    desc: "Shift to lifelong maintenance and retention audits.",
    gradient: "gradient-night",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24">
      <div className="mx-auto w-full max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45 }}
          className="mb-14 text-center"
        >
          <span className="mb-2 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Journey
          </span>
          <h2 className="text-3xl font-semibold text-slate-900 md:text-4xl">
            Four-stage progression
          </h2>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-2">
          {stages.map((stage, index) => (
            <motion.article
              key={stage.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -24 : 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
              className="glass rounded-2xl p-6"
            >
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${stage.gradient}`}
              >
                <stage.icon className="text-slate-900" size={21} />
              </div>
              <h3 className="text-xl font-semibold text-slate-900">{stage.title}</h3>
              <p className="text-sm font-medium text-slate-600">{stage.period}</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {stage.desc}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
