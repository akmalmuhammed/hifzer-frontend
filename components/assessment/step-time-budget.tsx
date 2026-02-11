"use client";

import { motion } from "framer-motion";
import { BookOpen, Briefcase, Clock, GraduationCap } from "lucide-react";

const options = [
  { value: 15, label: "15 min", desc: "Busy Professional", icon: Briefcase },
  { value: 30, label: "30 min", desc: "Balanced Learner", icon: Clock },
  { value: 60, label: "60 min", desc: "Dedicated Student", icon: BookOpen },
  { value: 90, label: "90+ min", desc: "Intensive Hifz", icon: GraduationCap },
] as const;

export function StepTimeBudget({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (value: 15 | 30 | 60 | 90) => void;
}) {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">
        How much time can you dedicate daily?
      </h2>
      <p className="mt-2 text-slate-600">Choose what works for your schedule.</p>

      <div className="mt-8 grid grid-cols-2 gap-4">
        {options.map((option, index) => (
          <motion.button
            key={option.value}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            onClick={() => onChange(option.value)}
            className={`glass rounded-2xl p-6 text-left transition-all hover:-translate-y-1 ${
              value === option.value ? "ring-2 ring-teal-600 shadow-glow" : "hover:shadow-lg"
            }`}
          >
            <option.icon className="mb-3 h-8 w-8 text-slate-700" />
            <div className="text-xl font-semibold text-slate-900">{option.label}</div>
            <div className="text-sm text-slate-600">{option.desc}</div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
