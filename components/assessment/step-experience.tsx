"use client";

import { motion } from "framer-motion";
import { BookOpen, Library, Sprout } from "lucide-react";
import type { PriorJuzBand } from "@/lib/api";

const options = [
  { value: "ZERO", label: "0 Juz", desc: "Starting fresh", icon: Sprout },
  {
    value: "ONE_TO_FIVE",
    label: "1-5 Juz",
    desc: "Some foundation",
    icon: BookOpen,
  },
  { value: "FIVE_PLUS", label: "5+ Juz", desc: "Experienced", icon: Library },
] as const;

export function StepExperience({
  value,
  onChange,
}: {
  value: PriorJuzBand | null;
  onChange: (value: PriorJuzBand) => void;
}) {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">
        How many Juz have you memorized?
      </h2>
      <p className="mt-2 text-slate-600">This sets your starting level.</p>

      <div className="mt-8 space-y-4">
        {options.map((option, index) => (
          <motion.button
            key={option.value}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onChange(option.value)}
            className={`flex w-full items-center gap-4 rounded-2xl p-5 text-left transition-all ${
              value === option.value
                ? "glass ring-2 ring-teal-600 shadow-glow"
                : "glass hover:-translate-y-0.5 hover:shadow-lg"
            }`}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
              <option.icon size={24} className="text-slate-700" />
            </div>
            <div>
              <div className="text-lg font-semibold text-slate-900">{option.label}</div>
              <div className="text-sm text-slate-600">{option.desc}</div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
