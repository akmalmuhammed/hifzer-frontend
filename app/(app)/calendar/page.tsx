"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FloatingParticles } from "@/components/shared/floating-particles";
import { getUserCalendar, type UserCalendarResponse } from "@/lib/api";

function toMonthKey(date: Date): string {
  return `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1).toString().padStart(2, "0")}`;
}

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [calendar, setCalendar] = useState<UserCalendarResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const monthKey = useMemo(() => toMonthKey(currentMonth), [currentMonth]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const payload = await getUserCalendar(monthKey);
        if (mounted) {
          setCalendar(payload);
          setSelectedDay(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Could not load calendar.");
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
  }, [monthKey]);

  const year = currentMonth.getUTCFullYear();
  const month = currentMonth.getUTCMonth();
  const firstDay = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const todayKey = new Date().toISOString().slice(0, 10);

  const cells = useMemo(() => {
    const list: Array<number | null> = [];
    for (let index = 0; index < firstDay; index += 1) {
      list.push(null);
    }
    for (let day = 1; day <= daysInMonth; day += 1) {
      list.push(day);
    }
    return list;
  }, [daysInMonth, firstDay]);

  const dayMap = useMemo(() => {
    const map = new Map<string, UserCalendarResponse["days"][number]>();
    for (const day of calendar?.days ?? []) {
      map.set(day.date, day);
    }
    return map;
  }, [calendar?.days]);

  const selectedData = selectedDay ? dayMap.get(selectedDay) ?? null : null;

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 gradient-day animate-gradient-shift opacity-10" />
      <FloatingParticles />
      <div className="relative z-10 mx-auto max-w-2xl space-y-5 pb-24 pt-4">
        <header>
          <h1 className="text-3xl font-semibold text-slate-900">Calendar</h1>
          <p className="text-sm text-slate-600">
            View consistency, missed days, and daily outcomes.
          </p>
        </header>

        <section className="grid grid-cols-4 gap-3">
          <article className="glass rounded-xl p-3 text-center">
            <p className="text-lg font-semibold text-slate-900">
              {calendar?.summary.active_days ?? 0}
            </p>
            <p className="text-xs text-slate-600">Active days</p>
          </article>
          <article className="glass rounded-xl p-3 text-center">
            <p className="text-lg font-semibold text-slate-900">
              {calendar?.summary.current_streak ?? 0}
            </p>
            <p className="text-xs text-slate-600">Current streak</p>
          </article>
          <article className="glass rounded-xl p-3 text-center">
            <p className="text-lg font-semibold text-slate-900">
              {calendar?.summary.total_minutes ?? 0}m
            </p>
            <p className="text-xs text-slate-600">Minutes</p>
          </article>
          <article className="glass rounded-xl p-3 text-center">
            <p className="text-lg font-semibold text-slate-900">
              {calendar?.summary.total_ayahs ?? 0}
            </p>
            <p className="text-xs text-slate-600">Ayahs</p>
          </article>
        </section>

        <section className="glass rounded-2xl p-4">
          <div className="mb-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() =>
                setCurrentMonth(
                  new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0)),
                )
              }
              className="rounded-lg p-2 hover:bg-slate-100"
            >
              <ChevronLeft size={20} />
            </button>
            <h2 className="font-semibold text-slate-900">
              {new Date(Date.UTC(year, month, 1)).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
                timeZone: "UTC",
              })}
            </h2>
            <button
              type="button"
              onClick={() =>
                setCurrentMonth(
                  new Date(Date.UTC(year, month + 1, 1, 0, 0, 0, 0)),
                )
              }
              className="rounded-lg p-2 hover:bg-slate-100"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs text-slate-500">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((label) => (
              <span key={label} className="py-1">
                {label}
              </span>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 35 }).map((_, index) => (
                <div
                  key={`calendar-skeleton-${index}`}
                  className="aspect-square animate-pulse rounded-xl bg-slate-200"
                />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-lg border border-rose-300 bg-rose-50 p-3 text-sm text-rose-700">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-1">
              {cells.map((day, index) => {
                if (!day) {
                  return <div key={`empty-${index}`} />;
                }

                const key = `${year}-${(month + 1)
                  .toString()
                  .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
                const data = dayMap.get(key);
                const isSelected = selectedDay === key;
                const isToday = key === todayKey;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedDay(key)}
                    className={`aspect-square rounded-xl text-sm transition-colors ${
                      isSelected ? "ring-2 ring-teal-500" : ""
                    } ${
                      data?.completed
                        ? "bg-emerald-100 hover:bg-emerald-200"
                        : "bg-rose-50 hover:bg-rose-100"
                    }`}
                  >
                    <div className="flex h-full flex-col items-center justify-center gap-0.5">
                      <span className={isToday ? "font-semibold text-slate-900" : ""}>
                        {day}
                      </span>
                      {data?.completed ? (
                        <span className="text-[10px] text-emerald-700">ok</span>
                      ) : key <= todayKey ? (
                        <span className="text-[10px] text-rose-700">miss</span>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {selectedDay && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-5"
          >
            <h3 className="font-semibold text-slate-900">
              {new Date(`${selectedDay}T00:00:00.000Z`).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                timeZone: "UTC",
              })}
            </h3>
            {selectedData?.completed ? (
              <div className="mt-3 grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-xl font-semibold">{selectedData.minutes_total}m</p>
                  <p className="text-xs text-slate-600">Time</p>
                </div>
                <div>
                  <p className="text-xl font-semibold">{selectedData.ayahs_memorized}</p>
                  <p className="text-xs text-slate-600">Ayahs</p>
                </div>
                <div>
                  <p className="text-xl font-semibold">{selectedData.xp}</p>
                  <p className="text-xs text-slate-600">XP</p>
                </div>
              </div>
            ) : (
              <p className="mt-2 text-sm text-rose-700">No session recorded.</p>
            )}
          </motion.section>
        )}
      </div>
    </div>
  );
}
