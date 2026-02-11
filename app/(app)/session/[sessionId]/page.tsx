"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Link2,
  Mic,
  Timer,
} from "lucide-react";
import {
  ApiError,
  completeSession,
  stepComplete,
  type SessionCompleteResponse,
  type SessionStep,
  type SessionStepProtocol,
} from "@/lib/api";
import { FloatingParticles } from "@/components/shared/floating-particles";

type SessionPayload = {
  kind: "sabaq" | "sabqi" | "manzil";
  ayah_ids: number[];
};

function protocolFromScaffolding(scaffoldingLevel?: string): SessionStepProtocol[] {
  if (scaffoldingLevel === "BEGINNER") {
    return [
      { step: "EXPOSURE", attempts_required: 3, optional: false },
      { step: "GUIDED", attempts_required: 3, optional: false },
      { step: "BLIND", attempts_required: 3, optional: false },
      { step: "LINK", attempts_required: 3, optional: false },
    ];
  }

  if (scaffoldingLevel === "MINIMAL") {
    return [
      { step: "EXPOSURE", attempts_required: 3, optional: true },
      { step: "GUIDED", attempts_required: 3, optional: true },
      { step: "BLIND", attempts_required: 3, optional: false },
      { step: "LINK", attempts_required: 3, optional: false },
    ];
  }

  return [
    { step: "EXPOSURE", attempts_required: 3, optional: false },
    { step: "GUIDED", attempts_required: 1, optional: false },
    { step: "BLIND", attempts_required: 3, optional: false },
    { step: "LINK", attempts_required: 3, optional: false },
  ];
}

function firstRequiredStep(protocol: SessionStepProtocol[]): SessionStep {
  const required = protocol.find((step) => !step.optional);
  return (required?.step ?? "BLIND") as SessionStep;
}

function attemptsRequired(protocol: SessionStepProtocol[], step: SessionStep): number {
  const found = protocol.find((entry) => entry.step === step);
  return found?.attempts_required ?? 3;
}

function parseSessionPayload(sessionId: string): SessionPayload {
  const fallback: SessionPayload = {
    kind: "sabaq",
    ayah_ids: [1, 2, 3],
  };

  const raw = localStorage.getItem(`hifz_session_payload_${sessionId}`);
  if (!raw) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(raw) as SessionPayload;
    if (!Array.isArray(parsed.ayah_ids) || parsed.ayah_ids.length === 0) {
      return fallback;
    }
    return {
      kind: parsed.kind,
      ayah_ids: parsed.ayah_ids
        .map((value) => Number(value))
        .filter((value) => Number.isFinite(value) && value > 0),
    };
  } catch {
    return fallback;
  }
}

function instructionForStep(step: SessionStep): string {
  if (step === "EXPOSURE") {
    return "Read and listen with mushaf visible, then confirm completion.";
  }
  if (step === "GUIDED") {
    return "Recite with first-word cue, then self-assess.";
  }
  if (step === "BLIND") {
    return "Recite fully from memory before checking.";
  }
  return "Recite Ayah A + Ayah B together to train the transition.";
}

export default function SessionPage() {
  const params = useParams<{ sessionId: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = params?.sessionId;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [payload, setPayload] = useState<SessionPayload | null>(null);
  const [protocol, setProtocol] = useState<SessionStepProtocol[]>([]);
  const [currentAyahIndex, setCurrentAyahIndex] = useState(0);
  const [step, setStep] = useState<SessionStep>("EXPOSURE");
  const [attempt, setAttempt] = useState(1);
  const [attemptStartedAt, setAttemptStartedAt] = useState<number>(Date.now());
  const [completedSummary, setCompletedSummary] =
    useState<SessionCompleteResponse | null>(null);

  useEffect(() => {
    if (!sessionId) {
      router.replace("/today");
      return;
    }

    const profileRaw = localStorage.getItem("hifz_profile");
    const profile = profileRaw
      ? (JSON.parse(profileRaw) as { scaffolding_level?: string })
      : null;
    const defaultProtocol = protocolFromScaffolding(profile?.scaffolding_level);
    const parsedPayload = parseSessionPayload(sessionId);

    setPayload(parsedPayload);
    setProtocol(defaultProtocol);
    setStep(firstRequiredStep(defaultProtocol));
    setAttempt(1);
    setAttemptStartedAt(Date.now());
    setLoading(false);
  }, [router, sessionId]);

  const currentAyahId = payload?.ayah_ids[currentAyahIndex] ?? null;
  const kind = (searchParams.get("kind") ?? payload?.kind ?? "sabaq").toUpperCase();
  const totalAyahs = payload?.ayah_ids.length ?? 0;
  const progressPercent = totalAyahs
    ? Math.round(((currentAyahIndex + (completedSummary ? 1 : 0)) / totalAyahs) * 100)
    : 0;

  async function handleAttempt(success: boolean) {
    if (!sessionId || !currentAyahId || submitting || completedSummary) {
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);
    const durationSeconds = Math.max(
      1,
      Math.round((Date.now() - attemptStartedAt) / 1000),
    );

    try {
      const response = await stepComplete({
        session_id: sessionId,
        ayah_id: currentAyahId,
        step_type: step,
        attempt_number: attempt,
        success,
        errors_count: success ? 0 : 2,
        duration_seconds: durationSeconds,
        linked_ayah_id:
          step === "LINK"
            ? payload?.ayah_ids[currentAyahIndex + 1] ?? currentAyahId + 1
            : undefined,
      });

      setProtocol(response.protocol);

      if (response.step_status === "AYAH_COMPLETE") {
        const nextAyah = currentAyahIndex + 1;
        if (payload && nextAyah < payload.ayah_ids.length) {
          setCurrentAyahIndex(nextAyah);
          setStep(firstRequiredStep(response.protocol));
          setAttempt(1);
          setAttemptStartedAt(Date.now());
        } else {
          const summary = await completeSession(sessionId);
          setCompletedSummary(summary);
        }
        return;
      }

      if (response.next_step && response.next_step !== "COMPLETE") {
        setStep(response.next_step as SessionStep);
      }
      if (response.next_attempt) {
        setAttempt(response.next_attempt);
      }
      setAttemptStartedAt(Date.now());
    } catch (error) {
      if (error instanceof ApiError && error.code === "INVALID_STEP_SEQUENCE") {
        const expectedStep = error.details?.expected_step as SessionStep | undefined;
        const expectedAttempt = error.details?.expected_attempt as number | undefined;
        const requiredProtocol = error.details?.required_protocol as
          | SessionStepProtocol[]
          | undefined;

        if (Array.isArray(requiredProtocol) && requiredProtocol.length > 0) {
          setProtocol(requiredProtocol);
        }
        if (expectedStep) {
          setStep(expectedStep);
        }
        if (typeof expectedAttempt === "number") {
          setAttempt(expectedAttempt);
        }
        setErrorMessage("Sequence corrected to server protocol.");
      } else {
        setErrorMessage(
          error instanceof Error ? error.message : "Could not record attempt.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-64 animate-pulse rounded bg-slate-200" />
        <div className="h-56 w-full animate-pulse rounded bg-slate-200" />
      </div>
    );
  }

  if (!sessionId || !payload || !currentAyahId) {
    return (
      <div>
        <div className="rounded-xl border border-rose-300 bg-rose-50 p-4 text-rose-700">
          Invalid session payload.
        </div>
        <button
          type="button"
          className="mt-3 rounded-md border border-slate-300 px-3 py-2 text-sm"
          onClick={() => router.push("/today")}
        >
          Back to Today
        </button>
      </div>
    );
  }

  if (completedSummary) {
    return (
      <div className="relative min-h-screen">
        <div className="absolute inset-0 gradient-day animate-gradient-shift opacity-10" />
        <FloatingParticles />
        <div className="relative z-10 mx-auto max-w-2xl space-y-5">
          <header className="space-y-2">
            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            <h1 className="text-3xl font-semibold">Session Complete</h1>
            <p className="text-sm text-slate-600">
              Your events were saved and reduced into authoritative state.
            </p>
          </header>

          <section className="glass space-y-2 rounded-xl p-4 text-sm">
            <p>
              Retention score:{" "}
              <strong>{Math.round(completedSummary.retention_score * 100)}%</strong>
            </p>
            <p>Backlog minutes: {completedSummary.backlog_minutes}</p>
            <p>Minutes total: {completedSummary.minutes_total}</p>
            <p>Final mode: {completedSummary.mode}</p>
          </section>

          <button
            type="button"
            className="rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white"
            onClick={() => router.push("/today")}
          >
            Back to Today
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 gradient-day animate-gradient-shift opacity-10" />
      <FloatingParticles />

      <div className="relative z-10 space-y-6">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push("/today")}
              className="text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold">{kind} Session</h1>
              <p className="text-sm text-slate-600">Session ID: {sessionId}</p>
            </div>
          </div>
          <div className="text-sm text-slate-500">{progressPercent}%</div>
        </header>

        {errorMessage && (
          <div className="rounded-md border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {errorMessage}
          </div>
        )}

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass space-y-3 rounded-xl p-4"
        >
          <p className="text-sm text-slate-500">
            Ayah {currentAyahIndex + 1} of {totalAyahs}
          </p>
          <h2 className="text-xl font-semibold">Ayah ID {currentAyahId}</h2>
          <p className="text-sm">
            Step: <strong>{step}</strong> - Attempt:{" "}
            <strong>
              {attempt}/{attemptsRequired(protocol, step)}
            </strong>
          </p>
          <p className="text-sm text-slate-600">{instructionForStep(step)}</p>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
          className="glass space-y-3 rounded-xl p-4"
        >
          <div className="flex items-start gap-2 text-sm text-slate-600">
            <Mic className="mt-0.5 h-4 w-4" />
            Recite from memory first, then self-assess. Server enforces sequence.
          </div>
          {step === "LINK" && (
            <div className="rounded-lg border border-teal-200 bg-teal-50 p-3 text-sm text-teal-900">
              <p className="flex items-start gap-2">
                <Link2 className="mt-0.5 h-4 w-4" />
                Link target: Ayah {currentAyahId} to Ayah{" "}
                {payload.ayah_ids[currentAyahIndex + 1] ?? currentAyahId + 1}
              </p>
            </div>
          )}
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => void handleAttempt(false)}
              disabled={submitting}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700"
            >
              <span className="inline-flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" /> I struggled
              </span>
            </button>
            <button
              type="button"
              onClick={() => void handleAttempt(true)}
              disabled={submitting}
              className="rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white"
            >
              <span className="inline-flex items-center gap-2">
                <Timer className="h-4 w-4" /> I got it
              </span>
            </button>
          </div>
        </motion.section>

        <section className="glass rounded-xl p-4">
          <p className="mb-2 text-sm font-medium">Protocol</p>
          <div className="flex flex-wrap gap-2">
            {protocol.map((entry) => (
              <span
                key={entry.step}
                className={`rounded-full border px-3 py-1 text-xs ${
                  entry.step === step
                    ? "border-teal-300 bg-teal-50 text-teal-900"
                    : "border-slate-300 text-slate-600"
                }`}
              >
                {entry.step} x{entry.attempts_required}
                {entry.optional ? " (optional)" : ""}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
