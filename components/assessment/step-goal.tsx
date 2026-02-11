"use client";

import { motion } from "framer-motion";
import { BookOpen, Layers, Settings2 } from "lucide-react";
import type { GoalType } from "@/lib/api";

const options = [
  {
    value: "FULL_QURAN",
    label: "Full Quran",
    desc: "Complete Quran (30 Juz)",
    icon: BookOpen,
  },
  {
    value: "JUZ",
    label: "Specific Juz",
    desc: "Memorize one or more ajza",
    icon: Layers,
  },
  {
    value: "SURAH",
    label: "Specific Surah",
    desc: "Memorize selected surahs",
    icon: Settings2,
  },
] as const;

export function StepGoal({
  value,
  onChange,
}: {
  value: GoalType | null;
  onChange: (value: GoalType) => void;
}) {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">
        What is your memorization goal?
      </h2>
      <p className="mt-2 text-slate-600">
        You can always adjust this later in settings.
      </p>

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
