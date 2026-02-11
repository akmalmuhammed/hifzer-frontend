"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import {
  submitAssessment,
  type GoalType,
  type PriorJuzBand,
  type ScaffoldingLevel,
  type TajwidConfidence,
} from "@/lib/api";
import { StepConfirmation } from "@/components/assessment/step-confirmation";
import { StepExperience } from "@/components/assessment/step-experience";
import { StepFluency } from "@/components/assessment/step-fluency";
import { StepGoal } from "@/components/assessment/step-goal";
import { StepScaffolding } from "@/components/assessment/step-scaffolding";
import { StepTajweed } from "@/components/assessment/step-tajweed";
import { StepTeacher } from "@/components/assessment/step-teacher";
import { StepTimeBudget } from "@/components/assessment/step-time-budget";
import { StepWelcome } from "@/components/assessment/step-welcome";
import type { AssessmentData } from "@/components/assessment/types";
import { useRouter } from "next/navigation";

const TOTAL_STEPS = 9;

function predictedScaffolding(data: AssessmentData): ScaffoldingLevel {
  if (data.fluency < 75 || data.experience === "ZERO") {
    return "BEGINNER";
  }
  if (data.fluency > 85 && data.experience === "FIVE_PLUS" && data.hasTeacher) {
    return "MINIMAL";
  }
  return "STANDARD";
}

export default function AssessmentPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AssessmentData>({
    timeBudget: null,
    experience: null,
    fluency: 50,
    tajweed: null,
    goal: null,
    hasTeacher: null,
    scaffolding: "STANDARD",
  });

  function update(partial: Partial<AssessmentData>) {
    setData((current) => ({ ...current, ...partial }));
  }

  function next() {
    if (step === 7) {
      update({ scaffolding: predictedScaffolding(data) });
    }
    setStep((current) => Math.min(current + 1, TOTAL_STEPS - 1));
  }

  function previous() {
    setStep((current) => Math.max(current - 1, 0));
  }

  const canProceed = useMemo(() => {
    if (step === 0) return true;
    if (step === 1) return data.timeBudget !== null;
    if (step === 2) return data.experience !== null;
    if (step === 3) return true;
    if (step === 4) return data.tajweed !== null;
    if (step === 5) return data.goal !== null;
    if (step === 6) return data.hasTeacher !== null;
    return true;
  }, [
    data.experience,
    data.goal,
    data.hasTeacher,
    data.tajweed,
    data.timeBudget,
    step,
  ]);

  async function finish() {
    if (
      data.timeBudget === null ||
      data.experience === null ||
      data.tajweed === null ||
      data.goal === null ||
      data.hasTeacher === null
    ) {
      setError("Assessment incomplete. Please complete every step.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const response = await submitAssessment({
        time_budget_minutes: data.timeBudget,
        fluency_score: data.fluency,
        tajwid_confidence: data.tajweed,
        goal: data.goal,
        has_teacher: data.hasTeacher,
        prior_juz_band: data.experience,
      });

      const defaults = response.defaults;
      localStorage.setItem(
        "hifz_profile",
        JSON.stringify({
          time_budget_minutes: data.timeBudget,
          prior_juz_band: data.experience,
          scaffolding_level: defaults.scaffolding_level,
          daily_new_target_ayahs: defaults.daily_new_target_ayahs,
          review_ratio_target: defaults.review_ratio_target,
          recommended_minutes: defaults.recommended_minutes,
        }),
      );

      update({ scaffolding: defaults.scaffolding_level });
      router.replace("/fluency-gate");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save assessment.");
    } finally {
      setSubmitting(false);
    }
  }

  const steps = [
    <StepWelcome key="welcome" onNext={next} />,
    (
      <StepTimeBudget
        key="time"
        value={data.timeBudget}
        onChange={(value) => update({ timeBudget: value })}
      />
    ),
    (
      <StepExperience
        key="experience"
        value={data.experience}
        onChange={(value) => update({ experience: value as PriorJuzBand })}
      />
    ),
    (
      <StepFluency
        key="fluency"
        value={data.fluency}
        onChange={(value) => update({ fluency: value })}
      />
    ),
    (
      <StepTajweed
        key="tajweed"
        value={data.tajweed}
        onChange={(value) => update({ tajweed: value as TajwidConfidence })}
      />
    ),
    (
      <StepGoal
        key="goal"
        value={data.goal}
        onChange={(value) => update({ goal: value as GoalType })}
      />
    ),
    (
      <StepTeacher
        key="teacher"
        value={data.hasTeacher}
        onChange={(value) => update({ hasTeacher: value })}
      />
    ),
    <StepScaffolding key="scaffolding" level={data.scaffolding} />,
    (
      <StepConfirmation
        key="confirm"
        data={data}
        onFinish={() => void finish()}
        isSubmitting={submitting}
      />
    ),
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 gradient-dawn animate-gradient-shift opacity-20" />
      <div className="relative z-10 mx-auto max-w-2xl px-4 py-8">
        <div className="mb-8 flex items-center gap-4">
          {step > 0 && (
            <button
              type="button"
              onClick={previous}
              className="text-slate-600 transition-colors hover:text-slate-900"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div className="flex-1">
            <div className="mb-2 flex justify-between text-xs text-slate-600">
              <span>
                Step {step + 1} of {TOTAL_STEPS}
              </span>
              <span>{Math.round(((step + 1) / TOTAL_STEPS) * 100)}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full gradient-primary transition-all duration-300"
                style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`assessment-step-${step}`}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.28 }}
          >
            {steps[step]}
          </motion.div>
        </AnimatePresence>

        {step > 0 && step < TOTAL_STEPS - 1 && (
          <div className="mt-10 flex justify-end">
            <button
              type="button"
              onClick={next}
              disabled={!canProceed}
              className="rounded-xl gradient-primary px-8 py-3 text-base font-semibold text-white shadow-glow disabled:opacity-60"
            >
              Continue
            </button>
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-xl border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
