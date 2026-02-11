"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Calendar,
  Lightbulb,
  Link2,
  TrendingUp,
} from "lucide-react";
import { getUserProgress, type UserProgressResponse } from "@/lib/api";
import { FloatingParticles } from "@/components/shared/floating-particles";

const TABS = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "activity", label: "Activity", icon: Calendar },
  { id: "transitions", label: "Transitions", icon: Link2 },
  { id: "retention", label: "Retention", icon: TrendingUp },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function ProgressPage() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<UserProgressResponse | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const payload = await getUserProgress();
        if (mounted) {
          setProgress(payload);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Could not load progress.");
        }
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

  const activityRows = useMemo(
    () => progress?.activity.days.slice().reverse().slice(0, 10) ?? [],
    [progress?.activity.days],
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
        <div className="h-40 w-full animate-pulse rounded bg-slate-200" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-rose-300 bg-rose-50 p-4 text-sm text-rose-700">
        {error}
      </div>
    );
  }

  if (!progress) {
    return null;
  }

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 gradient-day animate-gradient-shift opacity-10" />
      <FloatingParticles />

      <div className="relative z-10 mx-auto max-w-2xl space-y-6 pb-24 pt-4">
        <header className="flex items-center gap-2">
          <BarChart3 size={20} className="text-teal-700" />
          <h1 className="text-3xl font-semibold text-slate-900">Your Journey</h1>
        </header>

        <div className="flex gap-1 overflow-x-auto pb-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium ${
                activeTab === tab.id
                  ? "glass text-slate-900"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        <motion.section
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-5"
        >
          {activeTab === "overview" && (
            <>
              <div className="glass rounded-2xl p-6 text-center">
                <p className="text-sm text-slate-600">Retention score</p>
                <p className="mt-1 text-4xl font-semibold text-slate-900">
                  {progress.overview.retention_percent}%
                </p>
                <p className="mt-2 text-xs text-slate-600">
                  Based on recent completed daily sessions
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="glass rounded-xl p-3 text-center">
                  <p className="text-2xl font-semibold text-slate-900">
                    {progress.overview.total_items_tracked}
                  </p>
                  <p className="text-xs text-slate-600">Tracked</p>
                </div>
                <div className="glass rounded-xl p-3 text-center">
                  <p className="text-2xl font-semibold text-slate-900">
                    {progress.overview.due_items}
                  </p>
                  <p className="text-xs text-slate-600">Due</p>
                </div>
                <div className="glass rounded-xl p-3 text-center">
                  <p className="text-2xl font-semibold text-slate-900">
                    {progress.overview.completed_sessions}
                  </p>
                  <p className="text-xs text-slate-600">Sessions</p>
                </div>
              </div>
            </>
          )}

          {activeTab === "activity" && (
            <div className="space-y-4">
              <div className="glass rounded-2xl p-5">
                <h2 className="font-semibold text-slate-900">Activity Heatmap (30 days)</h2>
                <div className="mt-3 grid grid-cols-7 gap-1">
                  {progress.activity.days.map((day) => {
                    const intensity =
                      day.minutes_total === 0
                        ? "bg-slate-200"
                        : day.minutes_total < 20
                          ? "bg-emerald-200"
                          : day.minutes_total < 40
                            ? "bg-emerald-400"
                            : "bg-emerald-600";
                    return (
                      <div
                        key={day.date}
                        className={`group relative aspect-square rounded-sm ${intensity}`}
                      >
                        <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 hidden -translate-x-1/2 whitespace-nowrap rounded bg-slate-900 px-2 py-1 text-[10px] text-white group-hover:block">
                          {day.date}: {day.minutes_total}m, {day.ayahs_memorized} ayahs
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
                  <span>Active days: {progress.activity.active_days}</span>
                  <span>Avg: {progress.activity.average_minutes}m/day</span>
                </div>
              </div>

              <div className="glass rounded-2xl p-5">
                <h2 className="font-semibold text-slate-900">Daily Breakdown</h2>
                <div className="mt-3 space-y-2">
                  {activityRows.map((row) => (
                    <div
                      key={row.date}
                      className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${
                        row.completed ? "bg-white/70" : "bg-rose-50"
                      }`}
                    >
                      <span>{row.date}</span>
                      <span>{row.minutes_total}m</span>
                      <span>{row.ayahs_memorized} ayahs</span>
                      <span>{row.xp} XP</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "transitions" && (
            <div className="space-y-4">
              <div className="glass rounded-2xl p-5">
                <h2 className="font-semibold text-slate-900">Overall Transition Strength</h2>
                <p className="mt-1 text-3xl font-semibold text-slate-900">
                  {progress.transitions.overall_strength}%
                </p>
                {progress.transitions.link_repair_recommended && (
                  <p className="mt-1 text-xs text-amber-700">
                    Link Repair recommended: you have multiple weak connections.
                  </p>
                )}
              </div>

              <div className="glass rounded-2xl p-5">
                <h3 className="font-semibold text-slate-900">Weakest Transitions</h3>
                {progress.transitions.weak.length > 0 ? (
                  <div className="mt-3 space-y-3">
                    {progress.transitions.weak.map((item) => (
                      <article
                        key={`${item.from_ayah_id}-${item.to_ayah_id}`}
                        className="rounded-xl border border-slate-200 bg-white/70 p-4"
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-slate-900">
                            {item.from_label} to {item.to_label}
                          </p>
                          <p
                            className={`font-semibold ${
                              item.success_rate < 70 ? "text-rose-700" : "text-amber-700"
                            }`}
                          >
                            {item.success_rate}%
                          </p>
                        </div>
                        <p className="mt-1 text-xs text-slate-600">
                          {item.attempt_count} attempts
                        </p>
                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                          <div
                            className={`h-full ${
                              item.success_rate < 70 ? "bg-rose-500" : "bg-amber-500"
                            }`}
                            style={{ width: `${item.success_rate}%` }}
                          />
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-slate-600">
                    No weak transitions detected yet.
                  </p>
                )}
              </div>

              <div className="glass rounded-2xl p-5">
                <h3 className="font-semibold text-slate-900">Strongest Transitions</h3>
                {progress.transitions.strong.length > 0 ? (
                  <div className="mt-3 space-y-2">
                    {progress.transitions.strong.map((item) => (
                      <div
                        key={`${item.from_ayah_id}-${item.to_ayah_id}`}
                        className="flex items-center justify-between text-sm"
                      >
                        <span>
                          {item.from_label} to {item.to_label}
                        </span>
                        <span className="font-semibold text-emerald-700">
                          {item.success_rate}%
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-slate-600">
                    Strong transitions will appear once attempts are tracked.
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === "retention" && (
            <div className="space-y-4">
              <div className="glass rounded-2xl p-5">
                <h2 className="font-semibold text-slate-900">
                  Retention by SRS checkpoint
                </h2>
                <div className="mt-4 space-y-3">
                  {progress.retention.checkpoints.map((row) => (
                    <div key={row.checkpoint}>
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-700">{row.checkpoint}</span>
                        <span className="text-slate-600">
                          {row.success_rate === null
                            ? "No data yet"
                            : `${row.success_rate}% from ${row.items_count} items`}
                        </span>
                      </div>
                      <div className="relative h-3 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className={`absolute h-full ${
                            row.success_rate === null
                              ? "bg-slate-300"
                              : row.success_rate >= 85
                                ? "bg-teal-600"
                                : "bg-amber-500"
                          }`}
                          style={{
                            width: `${row.success_rate === null ? 0 : row.success_rate}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass rounded-2xl p-4 text-sm text-slate-700">
                <p className="flex items-center gap-2 font-medium">
                  <Lightbulb size={15} className="text-blue-600" />
                  Recommendation
                </p>
                <p className="mt-1">{progress.retention.recommendation}</p>
              </div>
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
}
