"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How is this different from other Qur'an apps?",
    a: "Hifz OS enforces active recall and transition training with strict review debt controls instead of passive tracking.",
  },
  {
    q: "Do I need a teacher to use Hifz OS?",
    a: "No. Teacher-supported and self-paced paths are both supported, with scaffolding adjusted per profile.",
  },
  {
    q: "What if I miss several days?",
    a: "The queue enters catch-up behavior and freezes new material until review debt returns to safe limits.",
  },
  {
    q: "Can I export my progress?",
    a: "Yes. Progress and session outcomes are exportable, and state is reconstructed from append-only events.",
  },
  {
    q: "Is there offline support?",
    a: "Yes. The architecture is offline-first with idempotent event ingest and deterministic server reduction.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-24">
      <div className="mx-auto w-full max-w-4xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45 }}
          className="mb-12 text-center"
        >
          <span className="mb-2 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            FAQ
          </span>
          <h2 className="text-3xl font-semibold text-slate-900 md:text-4xl">
            Common questions
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <article key={faq.q} className="glass rounded-xl px-5 py-4">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 text-left"
                  onClick={() =>
                    setOpenIndex((current) => (current === index ? null : index))
                  }
                >
                  <span className="text-base font-medium text-slate-900">{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-slate-600 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{faq.a}</p>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
