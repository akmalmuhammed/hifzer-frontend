"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Moon, Sun, UserCircle2 } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useTheme } from "@/context/theme-context";
import { getDisplayName, setDisplayName } from "@/lib/api";

export default function SettingsPage() {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [displayName, setDisplayNameState] = useState(getDisplayName() ?? "");
  const [saved, setSaved] = useState(false);

  const fallbackName = useMemo(() => {
    return user?.email?.split("@")[0] || "Learner";
  }, [user?.email]);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header className="flex items-center gap-2">
        <UserCircle2 className="h-6 w-6 text-teal-700" />
        <h1 className="text-3xl font-semibold">Settings</h1>
      </header>

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl p-5"
      >
        <h2 className="font-semibold">Profile</h2>
        <p className="mt-1 text-sm text-slate-600">Email: {user?.email}</p>
        <div className="mt-4">
          <label className="mb-1 block text-sm text-slate-700">
            Display name (local-only for now)
          </label>
          <input
            value={displayName}
            onChange={(event) => setDisplayNameState(event.target.value)}
            placeholder={fallbackName}
            className="w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </div>
        <button
          type="button"
          className="mt-3 rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white"
          onClick={() => {
            setDisplayName(displayName);
            setSaved(true);
            setTimeout(() => setSaved(false), 1800);
          }}
        >
          Save
        </button>
        {saved && <p className="mt-2 text-sm text-emerald-700">Saved.</p>}
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06 }}
        className="glass rounded-xl p-5"
      >
        <h2 className="font-semibold">Appearance</h2>
        <p className="mt-1 text-sm text-slate-600">
          Choose your preferred interface mode.
        </p>
        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={() => {
              if (isDark) toggleTheme();
            }}
            className={`rounded-lg border px-4 py-2 text-sm ${
              !isDark
                ? "border-teal-600 bg-teal-50 text-teal-900"
                : "border-slate-300 text-slate-700"
            }`}
          >
            <span className="inline-flex items-center gap-2">
              <Sun size={16} /> Light
            </span>
          </button>
          <button
            type="button"
            onClick={() => {
              if (!isDark) toggleTheme();
            }}
            className={`rounded-lg border px-4 py-2 text-sm ${
              isDark
                ? "border-teal-600 bg-teal-50 text-teal-900"
                : "border-slate-300 text-slate-700"
            }`}
          >
            <span className="inline-flex items-center gap-2">
              <Moon size={16} /> Dark
            </span>
          </button>
        </div>
      </motion.section>
    </div>
  );
}
