"use client";

import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

export function StepWelcome({ onNext }: { onNext: () => void }) {
  return (
    <div className="py-10 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 190, damping: 16 }}
        className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl gradient-primary shadow-glow"
      >
        <BookOpen size={38} className="text-white" />
      </motion.div>

      <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">
        Let&apos;s personalize your journey
      </h1>
      <p className="mx-auto mt-4 max-w-md text-slate-600">
        Answer a few short questions so we can set your pacing, scaffolding, and
        daily workload correctly.
      </p>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onNext}
        className="mt-10 rounded-xl gradient-primary px-10 py-4 text-lg font-semibold text-white shadow-glow"
      >
        Get Started
      </motion.button>
    </div>
  );
}
