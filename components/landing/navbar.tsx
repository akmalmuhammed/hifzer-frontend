"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "@/context/theme-context";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export function LandingNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/70 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Moon size={20} className="text-teal-700" />
          <span className="text-lg font-semibold text-slate-900">Hifz OS</span>
        </Link>

        <div className="hidden items-center gap-5 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              {link.label}
            </a>
          ))}
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-md p-1.5 text-slate-700 hover:bg-slate-100"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link href="/login" className="text-sm font-medium text-slate-700">
            Login
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-teal-700 px-3 py-1.5 text-sm font-medium text-white"
          >
            Start Free
          </Link>
        </div>

        <button
          type="button"
          className="rounded-md p-1 text-slate-700 md:hidden"
          onClick={() => setMobileOpen((current) => !current)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden"
          >
            <div className="space-y-2 border-t border-slate-200 px-4 py-3">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-md px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
                >
                  {link.label}
                </a>
              ))}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                >
                  {isDark ? "Light" : "Dark"}
                </button>
                <Link
                  href="/login"
                  className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-center text-sm"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="flex-1 rounded-md bg-teal-700 px-3 py-2 text-center text-sm font-medium text-white"
                >
                  Start Free
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
