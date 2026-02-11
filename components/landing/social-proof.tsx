"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Ahmad K.",
    country: "Saudi Arabia",
    quote:
      "Transition tracking changed my retention. I no longer collapse at ayah joins.",
    stars: 5,
  },
  {
    name: "Fatima M.",
    country: "United Kingdom",
    quote:
      "With 30 minutes daily I still progressed because queue priorities stay realistic.",
    stars: 5,
  },
  {
    name: "Omar S.",
    country: "United States",
    quote:
      "The warmup gate was strict, but it stopped me from stacking weak memorization.",
    stars: 5,
  },
  {
    name: "Aisha L.",
    country: "Malaysia",
    quote:
      "My teacher reviews became faster since weak transitions were already identified.",
    stars: 5,
  },
];

const stats = [
  { value: "746,492", label: "Ayahs Memorized" },
  { value: "50,127", label: "Active Learners" },
  { value: "127", label: "Countries" },
];

export function SocialProof() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((previous) => (previous + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative py-24">
      <div className="mx-auto w-full max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45 }}
          className="mb-14 text-center"
        >
          <span className="mb-2 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Social Proof
          </span>
          <h2 className="text-3xl font-semibold text-slate-900 md:text-4xl">
            Trusted by teachers and learners
          </h2>
        </motion.div>

        <div className="mx-auto mb-14 max-w-3xl">
          <div className="glass min-h-[220px] rounded-2xl p-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={false}
                animate={{
                  opacity: index === active ? 1 : 0,
                  y: index === active ? 0 : 8,
                  position: index === active ? "relative" : "absolute",
                }}
                transition={{ duration: 0.35 }}
                className={index === active ? "" : "pointer-events-none"}
              >
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: testimonial.stars }).map((_, starIndex) => (
                    <Star
                      key={`${testimonial.name}-${starIndex}`}
                      className="h-5 w-5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-lg text-slate-800">&quot;{testimonial.quote}&quot;</p>
                <div className="mt-5">
                  <p className="font-semibold text-slate-900">{testimonial.name}</p>
                  <p className="text-sm text-slate-600">{testimonial.country}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-4 flex justify-center gap-2">
            {testimonials.map((testimonial, index) => (
              <button
                key={testimonial.name}
                type="button"
                onClick={() => setActive(index)}
                className={`h-2.5 rounded-full transition-all ${
                  index === active ? "w-7 bg-teal-700" : "w-2.5 bg-slate-300"
                }`}
                aria-label={`Show testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <article key={stat.label} className="glass rounded-2xl p-5 text-center">
              <p className="text-3xl font-semibold text-gradient-primary">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-slate-600">{stat.label}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
