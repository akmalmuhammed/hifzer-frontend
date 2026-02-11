"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

export function LandingHero() {
  return (
    <section className="relative flex min-h-[86vh] items-center justify-center overflow-hidden">
      <div className="absolute inset-0 gradient-dawn animate-gradient-shift opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#fbfaf4]" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/60 px-4 py-1.5 text-sm backdrop-blur-sm">
            <ShieldCheck size={16} className="text-emerald-600" />
            <span className="text-slate-600">
              Trusted by memorizers in 100+ countries
            </span>
          </div>

          <h1 className="mx-auto max-w-5xl text-4xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-7xl">
            Memorize Qur&apos;an.
            <br />
            <span className="text-gradient-dawn">Protect It For Life.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-600 md:text-xl">
            Hifz OS enforces active recall, protects against review debt, and
            tracks weak transitions so your memorization stays strong.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="animate-glow-pulse rounded-xl bg-teal-700 px-8 py-4 text-lg font-semibold text-white shadow-glow"
            >
              Start Your Journey
            </Link>
            <a
              href="#features"
              className="rounded-xl border border-slate-300 bg-white/60 px-8 py-4 text-lg font-medium text-slate-700"
            >
              See How It Works
            </a>
          </div>
        </motion.div>

        <div className="pointer-events-none absolute -top-16 left-8 h-72 w-72 rounded-full bg-orange-300/20 blur-3xl animate-float" />
        <div className="pointer-events-none absolute -bottom-10 right-8 h-96 w-96 rounded-full bg-blue-400/15 blur-3xl animate-float [animation-delay:2.5s]" />
      </div>
    </section>
  );
}
