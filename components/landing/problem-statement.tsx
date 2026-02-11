"use client";

import { motion } from "framer-motion";
import { Clock, RefreshCw, TrendingDown } from "lucide-react";

const problems = [
  {
    icon: TrendingDown,
    title: "Forgetting older portions while adding new",
    desc: "Without protected review cycles, recall decays fast and learners restart repeatedly.",
  },
  {
    icon: RefreshCw,
    title: "No system for transition weak points",
    desc: "Many can recite isolated ayahs but break at verse-to-verse joins.",
  },
  {
    icon: Clock,
    title: "Rigid schedules with no adaptation",
    desc: "Fixed pace ignores workload, retention, and real-life interruptions.",
  },
];

export function ProblemStatement() {
  return (
    <section className="relative py-24">
      <div className="mx-auto w-full max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45 }}
          className="mb-14 text-center"
        >
          <span className="mb-2 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            The Problem
          </span>
          <h2 className="text-3xl font-semibold text-slate-900 md:text-4xl">
            Why memorization systems collapse
          </h2>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-3">
          {problems.map((problem, index) => (
            <motion.article
              key={problem.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="glass rounded-2xl p-6 shadow-glow-dawn"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl gradient-dawn">
                <problem.icon size={22} className="text-slate-900" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                {problem.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {problem.desc}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
