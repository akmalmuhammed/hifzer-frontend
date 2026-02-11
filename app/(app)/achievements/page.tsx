"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Crosshair,
  Flame,
  Gem,
  Link2,
  Lock,
  Star,
  Target,
  Trophy,
} from "lucide-react";
import { FloatingParticles } from "@/components/shared/floating-particles";
import {
  getUserAchievements,
  type AchievementBadge,
  type UserAchievementsResponse,
} from "@/lib/api";

type BadgeIcon = React.ComponentType<{ size?: number; className?: string }>;

const badgeIconById: Record<string, BadgeIcon> = {
  streak_master: Flame,
  first_ayah: Star,
  juz_done: BookOpen,
  perfect_week: Target,
  rare_gem: Gem,
  chain_builder: Link2,
  streak_30: Lock,
  half_quran: Lock,
  full_quran: Lock,
};

const rarityColors: Record<AchievementBadge["rarity"], string> = {
  Common: "text-slate-700",
  Rare: "text-blue-700",
  Epic: "text-purple-700",
  Legendary: "text-amber-700",
};

const rarityBg: Record<AchievementBadge["rarity"], string> = {
  Common: "bg-slate-100",
  Rare: "bg-blue-100",
  Epic: "bg-purple-100",
  Legendary: "bg-amber-100",
};

function badgeDate(value: string | null): string | null {
  if (!value) {
    return null;
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function AchievementsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payload, setPayload] = useState<UserAchievementsResponse | null>(null);
  const [selectedBadge, setSelectedBadge] = useState<AchievementBadge | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const response = await getUserAchievements();
        if (mounted) {
          setPayload(response);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Could not load achievements.");
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

  const unlocked = useMemo(
    () => payload?.badges.filter((badge) => badge.unlocked) ?? [],
    [payload?.badges],
  );
  const locked = useMemo(
    () => payload?.badges.filter((badge) => !badge.unlocked) ?? [],
    [payload?.badges],
  );

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 gradient-dusk animate-gradient-shift opacity-10" />
      <FloatingParticles />

      <div className="relative z-10 mx-auto max-w-2xl space-y-6 pb-24 pt-4">
        <header className="flex items-center gap-2">
          <Trophy size={20} className="text-amber-600" />
          <h1 className="text-3xl font-semibold text-slate-900">Achievements</h1>
        </header>

        {loading ? (
          <div className="space-y-3">
            <div className="h-28 animate-pulse rounded-2xl bg-slate-200" />
            <div className="h-24 animate-pulse rounded-2xl bg-slate-200" />
          </div>
        ) : error ? (
          <div className="rounded-xl border border-rose-300 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        ) : (
          <>
            <section className="glass rounded-2xl p-6 text-center">
              <p className="text-sm text-slate-600">Level {payload?.level ?? 0}</p>
              <h2 className="mt-1 text-xl font-semibold text-slate-900">
                {payload?.title ?? "Dawn Novice"}
              </h2>
              <div className="mx-auto mt-3 h-3 max-w-xs overflow-hidden rounded-full bg-slate-200">
                <motion.div
                  className="h-full gradient-primary"
                  initial={{ width: 0 }}
                  animate={{
                    width: payload
                      ? `${Math.min(
                          100,
                          Math.round((payload.xp / Math.max(payload.xp_next, 1)) * 100),
                        )}%`
                      : "0%",
                  }}
                  transition={{ duration: 0.9 }}
                />
              </div>
              <p className="mt-2 text-xs text-slate-600">
                {(payload?.xp ?? 0).toLocaleString()} /{" "}
                {(payload?.xp_next ?? 0).toLocaleString()} XP
              </p>
            </section>

            <section>
              <h3 className="mb-3 font-semibold text-slate-900">
                Unlocked ({unlocked.length}/{payload?.total_badges ?? 0})
              </h3>
              <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
                {unlocked.map((badge) => {
                  const Icon = badgeIconById[badge.id] ?? Star;
                  return (
                    <motion.button
                      key={badge.id}
                      whileHover={{ scale: 1.08 }}
                      type="button"
                      onClick={() => setSelectedBadge(badge)}
                      className={`aspect-square rounded-2xl ${rarityBg[badge.rarity]} flex items-center justify-center`}
                    >
                      <Icon size={28} className={rarityColors[badge.rarity]} />
                    </motion.button>
                  );
                })}
              </div>
            </section>

            <section>
              <h3 className="mb-3 font-semibold text-slate-900">Locked ({locked.length})</h3>
              <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
                {locked.map((badge) => (
                  <button
                    key={badge.id}
                    type="button"
                    onClick={() => setSelectedBadge(badge)}
                    className="aspect-square rounded-2xl bg-slate-200/80 opacity-70"
                  >
                    <span className="flex h-full items-center justify-center">
                      <Lock size={22} className="text-slate-500" />
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {selectedBadge && (
              <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl p-5"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${rarityBg[selectedBadge.rarity]}`}
                  >
                    {(() => {
                      const Icon = badgeIconById[selectedBadge.id] ?? Star;
                      return (
                        <Icon size={24} className={rarityColors[selectedBadge.rarity]} />
                      );
                    })()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{selectedBadge.name}</h3>
                    <p className="text-sm text-slate-600">{selectedBadge.description}</p>
                    <p className={`text-xs font-medium ${rarityColors[selectedBadge.rarity]}`}>
                      {selectedBadge.rarity}
                    </p>
                  </div>
                </div>
                {badgeDate(selectedBadge.unlocked_at) && (
                  <p className="mt-3 text-xs text-slate-600">
                    Earned: {badgeDate(selectedBadge.unlocked_at)}
                  </p>
                )}
                {!selectedBadge.unlocked && selectedBadge.requirement && (
                  <p className="mt-3 text-xs text-slate-600">
                    Requirement: {selectedBadge.requirement}
                  </p>
                )}
                <p className="mt-3 text-xs text-slate-600">
                  Progress: {selectedBadge.current} / {selectedBadge.target}
                </p>
                <button
                  type="button"
                  className="mt-3 text-xs text-slate-600"
                  onClick={() => setSelectedBadge(null)}
                >
                  Close
                </button>
              </motion.section>
            )}

            <section className="glass flex items-center justify-center gap-2 rounded-2xl p-5 text-center">
              <Crosshair size={16} className="text-teal-700" />
              <div>
                <p className="text-sm font-medium text-slate-900">Next Milestone</p>
                <p className="text-sm text-slate-600">
                  {payload?.next_milestone
                    ? `${payload.next_milestone.name} (${payload.next_milestone.requirement ?? "pending"})`
                    : "All milestones completed"}
                </p>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
