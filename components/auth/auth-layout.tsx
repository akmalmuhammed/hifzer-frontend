"use client";

import { Moon } from "lucide-react";
import { useTheme } from "@/context/theme-context";
import { Sun } from "lucide-react";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-1/2 overflow-hidden lg:block">
        <div className="absolute inset-0 gradient-dawn animate-gradient-shift" />
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center p-12 text-center">
          <Moon size={56} className="mb-6 text-slate-900" />
          <h1 className="text-4xl font-semibold text-slate-900">Hifz OS</h1>
          <p className="mt-4 max-w-sm text-lg text-slate-700">
            Your journey through the Quran begins with a single ayah.
          </p>
        </div>
        <div className="absolute left-10 top-20 h-40 w-40 rounded-full bg-blue-300/20 blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 h-60 w-60 rounded-full bg-orange-300/20 blur-3xl animate-float [animation-delay:2s]" />
      </div>

      <div className="flex flex-1 items-center justify-center p-6 md:p-12">
        <button
          type="button"
          onClick={toggleTheme}
          className="absolute right-4 top-4 rounded-md border border-slate-300 bg-white/70 p-2 text-slate-700 backdrop-blur"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
