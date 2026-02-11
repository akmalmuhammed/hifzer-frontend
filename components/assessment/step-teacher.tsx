"use client";

import { motion } from "framer-motion";
import { User, Users } from "lucide-react";

export function StepTeacher({
  value,
  onChange,
}: {
  value: boolean | null;
  onChange: (value: boolean) => void;
}) {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">
        Do you have a teacher?
      </h2>
      <p className="mt-2 text-slate-600">
        Teacher support helps us tailor pacing and scaffolding.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4">
        {[
          { value: true, label: "Yes", desc: "I have a teacher", icon: Users },
          { value: false, label: "No", desc: "I am learning solo", icon: User },
        ].map((option, index) => (
          <motion.button
            key={String(option.value)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onChange(option.value)}
            className={`rounded-2xl p-8 text-center transition-all ${
              value === option.value
                ? "glass ring-2 ring-teal-600 shadow-glow"
                : "glass hover:-translate-y-1 hover:shadow-lg"
            }`}
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
              <option.icon size={28} className="text-slate-700" />
            </div>
            <div className="mt-4 text-xl font-semibold text-slate-900">{option.label}</div>
            <div className="mt-1 text-sm text-slate-600">{option.desc}</div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
