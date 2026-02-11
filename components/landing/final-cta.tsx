"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="absolute inset-0 gradient-dusk animate-gradient-shift opacity-25" />
      <div className="relative z-10 mx-auto w-full max-w-5xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-semibold text-slate-900 md:text-5xl">
            Ready to start your hifz journey?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-700">
            Create your profile, pass the fluency gate, and begin a retention-first
            plan.
          </p>
          <Link
            href="/signup"
            className="mt-8 inline-block animate-glow-pulse rounded-xl bg-teal-700 px-10 py-4 text-lg font-semibold text-white shadow-glow"
          >
            Create Free Account
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
