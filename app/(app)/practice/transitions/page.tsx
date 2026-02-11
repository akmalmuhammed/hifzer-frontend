"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Link2, RefreshCcw, Target } from "lucide-react";
import { getTodayQueue, ingestReviewEvent, type WeakTransition } from "@/lib/api";
import { FloatingParticles } from "@/components/shared/floating-particles";

type PracticeResult = {
  fromAyahId: number;
  toAyahId: number;
  success: boolean;
};

export default function TransitionPracticePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [weakTransitions, setWeakTransitions] = useState<WeakTransition[]>([]);
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<PracticeResult[]>([]);

  const active = weakTransitions[index] ?? null;

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const queue = await getTodayQueue();
        if (mounted && queue.mode !== "FLUENCY_GATE_REQUIRED") {
          setWeakTransitions(queue.weak_transitions);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load transitions.");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }
    void load();
    return () => {
      mounted = false;
    };
  }, []);

  const accuracy = useMemo(() => {
    if (results.length === 0) {
      return null;
    }
    const successCount = results.filter((item) => item.success).length;
    return Math.round((successCount / results.length) * 100);
  }, [results]);

  async function submit(success: boolean) {
    if (!active || submitting) {
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await ingestReviewEvent({
        client_event_id: crypto.randomUUID(),
        event_type: "TRANSITION_ATTEMPTED",
        session_type: "SABQI",
        occurred_at: new Date().toISOString(),
        from_ayah_id: active.from_ayah_id,
        to_ayah_id: active.to_ayah_id,
        success,
      });

      setResults((current) => [
        ...current,
        {
          fromAyahId: active.from_ayah_id,
          toAyahId: active.to_ayah_id,
          success,
        },
      ]);

      setIndex((current) =>
        current + 1 >= weakTransitions.length ? 0 : current + 1,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not record transition.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-56 animate-pulse rounded bg-slate-200" />
        <div className="h-48 w-full animate-pulse rounded bg-slate-200" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 gradient-day animate-gradient-shift opacity-10" />
      <FloatingParticles />

      <div className="relative z-10 space-y-6">
        <header className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/today")}
            className="text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-semibold">Transition Practice</h1>
            <p className="text-sm text-slate-600">
              Recite A to B from memory, then self-assess.
            </p>
          </div>
        </header>

        {error && (
          <div className="rounded-md border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </div>
        )}

        {accuracy !== null && (
          <div className="glass rounded-xl p-4 text-sm">
            Session accuracy: <strong>{accuracy}%</strong> (
            {results.filter((item) => item.success).length}/{results.length})
          </div>
        )}

        {weakTransitions.length === 0 || !active ? (
          <div className="glass rounded-xl p-6 text-sm text-slate-600">
            No weak transitions detected right now. Keep reviewing and come back
            later.
          </div>
        ) : (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass space-y-4 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Transition {index + 1} of {weakTransitions.length}
              </p>
              <p className="text-sm">
                Current success rate:{" "}
                <strong>{Math.round(active.success_rate * 100)}%</strong>
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs text-slate-500">Recite this link smoothly:</p>
              <p className="mt-2 text-lg font-semibold">
                Ayah {active.from_ayah_id} <Link2 className="mx-1 inline h-4 w-4" />{" "}
                Ayah {active.to_ayah_id}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Attempts: {active.attempt_count} - Successes: {active.success_count}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700"
                onClick={() => void submit(false)}
                disabled={submitting}
              >
                <span className="inline-flex items-center gap-2">
                  <RefreshCcw className="h-4 w-4" /> I struggled
                </span>
              </button>
              <button
                type="button"
                className="rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white"
                onClick={() => void submit(true)}
                disabled={submitting}
              >
                <span className="inline-flex items-center gap-2">
                  <Target className="h-4 w-4" /> I linked smoothly
                </span>
              </button>
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}
