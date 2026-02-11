"use client";

import { motion } from "framer-motion";
import { BookOpen, PenLine, Star } from "lucide-react";
import type { TajwidConfidence } from "@/lib/api";

const options = [
  {
    value: "LOW",
    label: "Low",
    desc: "I am still learning the basics",
    icon: PenLine,
  },
  {
    value: "MED",
    label: "Medium",
    desc: "I know most rules but need practice",
    icon: BookOpen,
  },
  {
    value: "HIGH",
    label: "High",
    desc: "I apply tajweed correctly and consistently",
    icon: Star,
  },
] as const;

export function StepTajweed({
  value,
  onChange,
}: {
  value: TajwidConfidence | null;
  onChange: (value: TajwidConfidence) => void;
}) {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">
        How confident are you with tajweed?
      </h2>
      <p className="mt-2 text-slate-600">Tajweed for proper recitation.</p>

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
