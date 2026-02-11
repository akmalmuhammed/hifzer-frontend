"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";

const STEPS = [
  {
    title: "Welcome to Hifz OS",
    desc: "This is your memorization operating system built for retention, not short-term streaks.",
    icon: "Moon",
  },
  {
    title: "Today screen is your command center",
    desc: "You will see queue mode, debt pressure, warmup requirements, and what is allowed right now.",
    icon: "Plan",
  },
  {
    title: "3x3 linking is the core protocol",
    desc: "Exposure, guided recall, blind recall, then link attempts. Link phase is mandatory.",
    icon: "Link",
  },
  {
    title: "Queue safety blocks protect you",
    desc: "If review debt or retention risk is high, new memorization is paused until your state stabilizes.",
    icon: "Shield",
  },
  {
    title: "Ready to begin",
    desc: "Start with today plan and follow the server-guided sequence one attempt at a time.",
    icon: "Start",
  },
];

export default function TutorialPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const total = STEPS.length;
  const current = STEPS[step];

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <motion.section
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass relative w-full max-w-md rounded-3xl p-8 text-center"
      >
        <button
          type="button"
          onClick={() => router.push("/today")}
          className="absolute right-4 top-4 text-xs text-slate-600 hover:text-slate-900"
        >
          Skip
        </button>

        <div className="mb-6 flex justify-center gap-1.5">
          {STEPS.map((_, index) => (
            <div
              key={`dot-${index}`}
              className={`h-2 w-2 rounded-full ${
                index === step
                  ? "bg-teal-700"
                  : index < step
                    ? "bg-teal-400"
                    : "bg-slate-300"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`step-${step}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.22 }}
          >
            <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full gradient-primary text-sm font-semibold text-white">
              {current.icon}
            </div>
            <h2 className="text-2xl font-semibold text-slate-900">{current.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{current.desc}</p>
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex gap-3">
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep((value) => value - 1)}
              className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700"
            >
              Back
            </button>
          )}
          {step < total - 1 ? (
            <button
              type="button"
              onClick={() => setStep((value) => value + 1)}
              className="flex-1 rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={() => router.push("/today")}
              className="flex-1 rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white"
            >
              Go to Today
            </button>
          )}
        </div>
        <p className="mt-4 text-xs text-slate-600">
          {step + 1} of {total}
        </p>
      </motion.section>
    </div>
  );
}
