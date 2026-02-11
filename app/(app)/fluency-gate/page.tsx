"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Shield,
  ShieldCheck,
  ShieldX,
} from "lucide-react";
import {
  getFluencyGateStatus,
  startFluencyGateTest,
  submitFluencyGateTest,
  type FluencyGateStartResponse,
  type FluencyGateSubmitResponse,
} from "@/lib/api";
import { FloatingParticles } from "@/components/shared/floating-particles";

type ViewState = "STATUS" | "ACTIVE_TEST" | "RESULT";

export default function FluencyGatePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [state, setState] = useState<ViewState>("STATUS");
  const [status, setStatus] = useState<Awaited<
    ReturnType<typeof getFluencyGateStatus>
  > | null>(null);
  const [test, setTest] = useState<FluencyGateStartResponse | null>(null);
  const [result, setResult] = useState<FluencyGateSubmitResponse | null>(null);
  const [durationSeconds, setDurationSeconds] = useState(180);
  const [errorCount, setErrorCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const passed = useMemo(
    () => status?.fluency_gate_passed || result?.passed || false,
    [result?.passed, status?.fluency_gate_passed],
  );

  const loadStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = await getFluencyGateStatus();
      setStatus(payload);
      setState("STATUS");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load status.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStatus();
  }, [loadStatus]);

  async function start() {
    setError(null);
    try {
      const started = await startFluencyGateTest();
      setTest(started);
      setDurationSeconds(180);
      setErrorCount(0);
      setState("ACTIVE_TEST");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start test.");
    }
  }

  async function submit() {
    if (!test || submitting) {
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const response = await submitFluencyGateTest({
        test_id: test.test_id,
        duration_seconds: durationSeconds,
        error_count: errorCount,
      });
      setResult(response);
      setState("RESULT");
      await loadStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit test.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
        <div className="h-48 w-full animate-pulse rounded bg-slate-200" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 gradient-day animate-gradient-shift opacity-10" />
      <FloatingParticles />

      <div className="relative z-10 mx-auto max-w-3xl space-y-5">
        {error && (
          <div className="rounded-md border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </div>
        )}

        {state === "ACTIVE_TEST" && test ? (
          <>
            <header>
              <h1 className="text-3xl font-semibold">Fluency Gate Test</h1>
              <p className="text-sm text-slate-600">
                Recite page {test.page} aloud, then submit timing and errors.
              </p>
            </header>
            <section className="glass rounded-xl p-4">
              <p className="text-sm">{test.instructions}</p>
              <div className="mt-3 max-h-64 space-y-3 overflow-y-auto rounded-lg border border-slate-200 p-3">
                {test.ayahs.slice(0, 10).map((ayah) => (
                  <div key={ayah.id}>
                    <p className="text-xs text-slate-500">
                      {ayah.surah_number}:{ayah.ayah_number}
                    </p>
                    <p className="font-arabic text-right text-xl" dir="rtl">
                      {ayah.text_uthmani ?? "(text unavailable)"}
                    </p>
                  </div>
                ))}
              </div>
            </section>
            <section className="grid gap-4 sm:grid-cols-2">
              <div className="glass rounded-xl p-4">
                <label className="mb-1 block text-sm text-slate-700">
                  Duration (seconds)
                </label>
                <input
                  type="number"
                  min={1}
                  value={durationSeconds}
                  onChange={(event) =>
                    setDurationSeconds(Number(event.target.value || 0))
                  }
                  className="w-full rounded-md border border-slate-300 px-3 py-2"
                />
                <p className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                  <Clock3 className="h-3.5 w-3.5" /> Target under 180 seconds
                </p>
              </div>
              <div className="glass rounded-xl p-4">
                <label className="mb-1 block text-sm text-slate-700">Major errors</label>
                <input
                  type="number"
                  min={0}
                  value={errorCount}
                  onChange={(event) => setErrorCount(Number(event.target.value || 0))}
                  className="w-full rounded-md border border-slate-300 px-3 py-2"
                />
                <p className="mt-2 text-xs text-slate-500">Target fewer than 5 errors</p>
              </div>
            </section>
            <div className="flex gap-3">
              <button
                type="button"
                className="rounded-md border border-slate-300 px-4 py-2 text-sm"
                onClick={() => setState("STATUS")}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white"
                onClick={() => void submit()}
                disabled={submitting || durationSeconds <= 0 || errorCount < 0}
              >
                {submitting ? "Submitting..." : "Submit Result"}
              </button>
            </div>
          </>
        ) : state === "RESULT" && result ? (
          <>
            <header className="space-y-2">
              {result.passed ? (
                <ShieldCheck className="h-10 w-10 text-emerald-600" />
              ) : (
                <ShieldX className="h-10 w-10 text-rose-600" />
              )}
              <h1 className="text-3xl font-semibold">
                {result.passed ? "Fluency Gate Passed" : "Fluency Gate Not Passed"}
              </h1>
              <p className="text-sm text-slate-600">{result.message}</p>
            </header>
            <section className="glass rounded-xl p-4 text-sm">
              <p>
                Fluency score: <strong>{result.fluency_score}</strong>/100
              </p>
              <p>Time score: {result.time_score}/50</p>
              <p>Accuracy score: {result.accuracy_score}/50</p>
            </section>
            <div className="flex gap-3">
              {result.passed ? (
                <button
                  type="button"
                  className="rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white"
                  onClick={() => router.push("/today")}
                >
                  Continue to Today
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className="rounded-md border border-slate-300 px-4 py-2 text-sm"
                    onClick={() => setState("STATUS")}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    className="rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white"
                    onClick={() => void start()}
                  >
                    Retake Test
                  </button>
                </>
              )}
            </div>
          </>
        ) : (
          <>
            <header className="space-y-2">
              <Shield className="h-10 w-10 text-teal-700" />
              <h1 className="text-3xl font-semibold">Fluency Gate</h1>
              <p className="text-sm text-slate-600">
                You must pass this prerequisite before new memorization is unlocked.
              </p>
            </header>
            <section className="glass rounded-xl p-4 text-sm">
              <p className="flex items-center gap-2">
                {passed ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                )}
                Status: {passed ? "Passed" : "Not passed"}
              </p>
              <p>Latest fluency score: {status?.fluency_score ?? "N/A"}</p>
            </section>
            <div className="flex gap-3">
              <button
                type="button"
                className="rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white"
                onClick={() => void start()}
              >
                Start Test
              </button>
              <button
                type="button"
                className="rounded-md border border-slate-300 px-4 py-2 text-sm"
                onClick={() => router.push("/today")}
              >
                Back to Today
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
