"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Clock3,
  Link2,
  RefreshCcw,
  ShieldAlert,
} from "lucide-react";
import {
  ApiError,
  clearLegacyMockState,
  getDisplayName,
  getTodayQueue,
  getUserStats,
  isLiveMigrationDone,
  markLiveMigrationDone,
  startSession,
  type TodayQueueResponse,
} from "@/lib/api";
import { useAuth } from "@/context/auth-context";
import { FloatingParticles } from "@/components/shared/floating-particles";

type SessionKind = "sabaq" | "sabqi" | "manzil";

function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

function getFriendlyError(error: unknown): string {
  if (!(error instanceof ApiError)) {
    return "Could not load today's plan.";
  }
  if (error.status === 429) {
    return `Rate limited. Try again in ${error.retryAfterSeconds ?? 30}s.`;
  }
  if (error.status === 403) {
    return "Access blocked by policy. Complete required steps first.";
  }
  if (error.status >= 500) {
    return "Server issue. Please retry in a moment.";
  }
  if (error.code === "NETWORK_ERROR" || error.code === "TIMEOUT") {
    return "Network issue detected. Retrying may help.";
  }
  return error.message;
}

export default function TodayPage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [queue, setQueue] = useState<TodayQueueResponse | null>(null);
  const [stats, setStats] = useState<Awaited<ReturnType<typeof getUserStats>> | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [migrationNotice, setMigrationNotice] = useState(false);
  const [startingKind, setStartingKind] = useState<SessionKind | null>(null);

  const displayName = useMemo(() => {
    const localName = getDisplayName();
    if (localName) {
      return localName;
    }
    if (!user?.email) {
      return "Learner";
    }
    return user.email.split("@")[0];
  }, [user?.email]);

  const load = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const [queuePayload, statsPayload] = await Promise.all([
        getTodayQueue(),
        getUserStats(),
      ]);
      setQueue(queuePayload);
      setStats(statsPayload);

      if (!isLiveMigrationDone()) {
        clearLegacyMockState();
        markLiveMigrationDone();
        setMigrationNotice(true);
      }
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        logout();
        router.replace("/sign-in");
        return;
      }
      setErrorMessage(getFriendlyError(error));
    } finally {
      setLoading(false);
    }
  }, [logout, router]);

  useEffect(() => {
    void load();
  }, [load]);

  async function startPlanSession(kind: SessionKind) {
    if (!queue || queue.mode === "FLUENCY_GATE_REQUIRED") {
      return;
    }

    setStartingKind(kind);
    try {
      const session = await startSession({
        mode: queue.mode,
        warmup_passed: queue.warmup_test.passed,
      });

      const sabqiIds = queue.sabqi_queue.map((item) => item.ayah_id);
      const manzilIds = queue.manzil_queue.map((item) => item.ayah_id);
      const merged = Array.from(new Set([...sabqiIds, ...manzilIds]));

      let ayahIds: number[] = [];
      if (kind === "sabqi") {
        ayahIds = sabqiIds.slice(0, 5);
      } else if (kind === "manzil") {
        ayahIds = manzilIds.slice(0, 5);
      } else {
        const target = Math.max(1, Math.min(queue.sabaq_task.target_ayahs || 3, 5));
        ayahIds = merged.slice(0, target);
      }

      if (ayahIds.length === 0) {
        ayahIds = [1, 2, 3];
      }

      localStorage.setItem(
        `hifz_session_payload_${session.session_id}`,
        JSON.stringify({ kind, ayah_ids: ayahIds }),
      );

      router.push(`/session/${session.session_id}?kind=${kind}`);
    } catch (error) {
      setErrorMessage(getFriendlyError(error));
    } finally {
      setStartingKind(null);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-64 animate-pulse rounded bg-slate-200" />
        <div className="h-28 w-full animate-pulse rounded bg-slate-200" />
        <div className="h-28 w-full animate-pulse rounded bg-slate-200" />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="max-w-2xl">
        <div className="rounded-xl border border-rose-300 bg-rose-50 p-4">
          <p className="font-medium text-rose-700">{errorMessage}</p>
          <button
            type="button"
            className="mt-3 rounded-md border border-slate-300 px-3 py-1.5 text-sm"
            onClick={() => void load()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!queue) {
    return null;
  }

  if (queue.mode === "FLUENCY_GATE_REQUIRED") {
    return (
      <div className="relative min-h-screen">
        <div className="absolute inset-0 gradient-day animate-gradient-shift opacity-10" />
        <FloatingParticles />
        <div className="relative z-10 max-w-2xl space-y-4">
          <h1 className="text-3xl font-semibold">Assalamu alaikum, {displayName}</h1>
          {migrationNotice && (
            <div className="rounded-xl border border-teal-200 bg-teal-50 p-3 text-sm">
              Starting fresh with live data.
            </div>
          )}
          <div className="rounded-xl border border-amber-300 bg-amber-50 p-6">
            <div className="flex items-start gap-3">
              <ShieldAlert className="mt-0.5 text-amber-700" />
              <div>
                <h2 className="font-semibold text-amber-900">Fluency Gate required</h2>
                <p className="mt-1 text-sm text-amber-800">{queue.message}</p>
                <button
                  type="button"
                  className="mt-4 rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white"
                  onClick={() => router.push("/fluency-gate")}
                >
                  Complete Fluency Gate
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 gradient-day animate-gradient-shift opacity-10" />
      <FloatingParticles />

      <div className="relative z-10 space-y-6">
        <header className="space-y-1">
          <h1 className="text-3xl font-semibold">Assalamu alaikum, {displayName}</h1>
          <p className="text-sm text-slate-600">Your plan for today is ready.</p>
        </header>

        {migrationNotice && (
          <div className="rounded-xl border border-teal-200 bg-teal-50 p-3 text-sm">
            Starting fresh with live data.
          </div>
        )}

        <section className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Mode",
              value: queue.mode,
              sub: null,
            },
            {
              title: "Backlog",
              value: `${queue.debt.backlogMinutesEstimate} min`,
              sub: `Threshold: ${queue.debt.freezeThresholdMinutes} min`,
            },
            {
              title: "Retention (7d)",
              value: formatPercent(queue.retentionRolling7d),
              sub: null,
            },
          ].map((card, index) => (
            <motion.article
              key={card.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.07 }}
              className="glass rounded-xl p-4"
            >
              <p className="text-xs text-slate-500">{card.title}</p>
              <p className="mt-1 text-lg font-semibold">{card.value}</p>
              {card.sub && <p className="text-xs text-slate-500">{card.sub}</p>}
            </motion.article>
          ))}
        </section>

        <section className="glass rounded-xl p-4">
          <h2 className="font-semibold">Warmup Check</h2>
          <p className="mt-1 text-sm text-slate-600">
            {queue.warmup_test.passed
              ? "Passed"
              : queue.warmup_test.failed
                ? "Failed"
                : queue.warmup_test.pending
                  ? "Pending"
                  : "No warmup required"}
          </p>
        </section>

        <section className="space-y-3">
          <button
            type="button"
            onClick={() => void startPlanSession("sabaq")}
            disabled={!queue.sabaq_task.allowed || Boolean(startingKind)}
            className="glass w-full rounded-xl p-4 text-left disabled:opacity-60"
          >
            <div className="flex items-start gap-3">
              <BookOpen className="mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">Sabaq (New)</p>
                <p className="text-sm text-slate-600">
                  Target: {queue.sabaq_task.target_ayahs} ayahs - Allowed:{" "}
                  {String(queue.sabaq_task.allowed)}
                </p>
              </div>
              <ArrowRight className="h-5 w-5" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => void startPlanSession("sabqi")}
            disabled={queue.sabqi_queue.length === 0 || Boolean(startingKind)}
            className="glass w-full rounded-xl p-4 text-left disabled:opacity-60"
          >
            <div className="flex items-start gap-3">
              <RefreshCcw className="mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">Sabqi (Recent Review)</p>
                <p className="text-sm text-slate-600">
                  {queue.sabqi_queue.length} items due
                </p>
              </div>
              <ArrowRight className="h-5 w-5" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => void startPlanSession("manzil")}
            disabled={queue.manzil_queue.length === 0 || Boolean(startingKind)}
            className="glass w-full rounded-xl p-4 text-left disabled:opacity-60"
          >
            <div className="flex items-start gap-3">
              <Clock3 className="mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">Manzil (Long-term)</p>
                <p className="text-sm text-slate-600">
                  {queue.manzil_queue.length} items in rotation
                </p>
              </div>
              <ArrowRight className="h-5 w-5" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => router.push("/practice/transitions")}
            className="glass w-full rounded-xl p-4 text-left"
          >
            <div className="flex items-start gap-3">
              <Link2 className="mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">Weak Transitions</p>
                <p className="text-sm text-slate-600">
                  {queue.weak_transitions.length} weak links detected
                </p>
              </div>
              <ArrowRight className="h-5 w-5" />
            </div>
          </button>
        </section>

        {queue.debt.overdueDaysMax > 2 && (
          <div className="rounded-xl border border-rose-300 bg-rose-50 p-4 text-sm text-rose-700">
            <p className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Overdue reviews exceed 2 days. New memorization is restricted.
            </p>
          </div>
        )}

        {stats && (
          <section className="glass rounded-xl p-4 text-sm text-slate-600">
            Tracked items: {stats.total_items_tracked} - Due now: {stats.due_items} -
            Completed sessions: {stats.completed_sessions}
          </section>
        )}
      </div>
    </div>
  );
}
