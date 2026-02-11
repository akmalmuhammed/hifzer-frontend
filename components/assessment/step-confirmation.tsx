"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PartyPopper, Sparkles, Star } from "lucide-react";
import type { AssessmentData } from "@/components/assessment/types";

function summaryRows(data: AssessmentData) {
  return [
    {
      label: "Daily Time",
      value: data.timeBudget ? `${data.timeBudget} minutes` : "-",
    },
    {
      label: "Prior Experience",
      value:
        data.experience === "ZERO"
          ? "Starting fresh"
          : data.experience === "ONE_TO_FIVE"
            ? "1-5 Juz"
            : "5+ Juz",
    },
    { label: "Reading Fluency", value: `${data.fluency}%` },
    { label: "Tajweed Level", value: data.tajweed || "-" },
    {
      label: "Goal",
      value:
        data.goal === "FULL_QURAN"
          ? "Full Quran"
          : data.goal === "JUZ"
            ? "Specific Juz"
            : "Specific Surah",
    },
    { label: "Teacher", value: data.hasTeacher ? "Yes" : "No" },
    { label: "Scaffolding", value: data.scaffolding },
  ];
}

export function StepConfirmation({
  data,
  onFinish,
  isSubmitting,
}: {
  data: AssessmentData;
  onFinish: () => void;
  isSubmitting: boolean;
}) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="text-center">
      {showConfetti && (
        <div className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center">
          {Array.from({ length: 20 }).map((_, index) => (
            <motion.div
              key={`confetti-${index}`}
              initial={{ opacity: 1, x: 0, y: 0, scale: 0 }}
              animate={{
                opacity: 0,
                x: ((index * 73) % 360) - 180,
                y: ((index * 91) % 360) - 180,
                scale: 0.5 + (((index * 17) % 100) / 100),
                rotate: (index * 137) % 720,
              }}
              transition={{ duration: 1.4, ease: "easeOut" }}
              className="absolute"
            >
              {index % 3 === 0 ? (
                <Star size={16} className="text-amber-500" />
              ) : index % 3 === 1 ? (
                <Sparkles size={16} className="text-teal-600" />
              ) : (
                <div className="h-2 w-2 rounded-full bg-blue-500" />
              )}
            </motion.div>
          ))}
        </div>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow">
          <PartyPopper size={32} className="text-white" />
        </div>
        <h2 className="mt-4 text-3xl font-semibold text-slate-900">
          Your Journey Profile
        </h2>
        <p className="mt-2 text-slate-600">Everything looks ready. Let&apos;s begin.</p>

        <div className="glass mx-auto mt-8 max-w-md rounded-2xl p-6 text-left">
          {summaryRows(data).map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between border-b border-slate-200 py-3 last:border-0"
            >
              <span className="text-sm text-slate-600">{row.label}</span>
              <span className="text-sm font-semibold text-slate-900">{row.value}</span>
            </div>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onFinish}
          disabled={isSubmitting}
          className="mt-10 rounded-xl gradient-primary px-10 py-4 text-lg font-semibold text-white shadow-glow disabled:opacity-70"
        >
          {isSubmitting ? "Saving..." : "Start My Hifz Journey"}
        </motion.button>
      </motion.div>
    </div>
  );
}
