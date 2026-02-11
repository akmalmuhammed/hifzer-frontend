"use client";

import { motion } from "framer-motion";
import { BookOpen, Sprout, Zap } from "lucide-react";
import type { ScaffoldingLevel } from "@/lib/api";

const levels: Record<
  ScaffoldingLevel,
  {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    title: string;
    protocol: string;
    desc: string;
  }
> = {
  BEGINNER: {
    icon: Sprout,
    title: "Beginner - Full Guidance",
    protocol: "3x3x3x3 protocol",
    desc: "All four phases with three repetitions each. Maximum support.",
  },
  STANDARD: {
    icon: BookOpen,
    title: "Standard - Balanced Support",
    protocol: "3x1x3x3 protocol",
    desc: "Full exposure, streamlined guided phase, complete blind and linking.",
  },
  MINIMAL: {
    icon: Zap,
    title: "Minimal - Expert Mode",
    protocol: "0x0x3x3 protocol",
    desc: "Skip exposure and guided phases. Jump straight to blind and linking.",
  },
};

export function StepScaffolding({ level }: { level: ScaffoldingLevel }) {
  const current = levels[level] || levels.STANDARD;

  return (
    <div>
      <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">
        Your recommended level
      </h2>
      <p className="mt-2 text-slate-600">
        We assigned scaffolding intensity from your assessment inputs.
      </p>

      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 20 }}
        className="glass mt-8 rounded-2xl p-8 text-center shadow-glow"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary">
          <current.icon size={32} className="text-white" />
        </div>
        <h3 className="mt-4 text-2xl font-semibold text-slate-900">{current.title}</h3>
        <p className="mt-2 text-sm font-medium text-teal-700">{current.protocol}</p>
        <p className="mt-4 text-slate-600">{current.desc}</p>
        <p className="mt-6 text-xs text-slate-600">
          You can change this later in settings.
        </p>
      </motion.div>
    </div>
  );
}
