"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "/mo",
    cta: "Start Free",
    popular: false,
    features: [
      "Core queue planning",
      "Basic analytics",
      "Manual self-assessment",
      "Community support",
    ],
  },
  {
    name: "Premium",
    price: "$10",
    period: "/mo",
    cta: "Start 14-Day Trial",
    popular: true,
    features: [
      "Unlimited memorization",
      "Adaptive scaffolding",
      "Weak transition alerts",
      "Priority support",
      "Advanced analytics",
    ],
  },
  {
    name: "Teacher",
    price: "$25",
    period: "/user/mo",
    cta: "Request Demo",
    popular: false,
    features: [
      "All premium features",
      "Teacher dashboard",
      "Student submissions",
      "Class-level analytics",
    ],
  },
];

export function PricingPreview() {
  return (
    <section id="pricing" className="relative py-24">
      <div className="mx-auto w-full max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45 }}
          className="mb-14 text-center"
        >
          <span className="mb-2 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Pricing
          </span>
          <h2 className="text-3xl font-semibold text-slate-900 md:text-4xl">
            Start free and scale when ready
          </h2>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-3">
          {tiers.map((tier, index) => (
            <motion.article
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
              className={`relative rounded-2xl border p-6 ${
                tier.popular
                  ? "border-teal-300 bg-teal-50 shadow-glow"
                  : "border-slate-200 bg-white"
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-teal-700 px-3 py-1 text-xs font-semibold text-white">
                  Most Popular
                </span>
              )}
              <h3 className="text-xl font-semibold text-slate-900">{tier.name}</h3>
              <p className="mt-2">
                <span className="text-4xl font-semibold text-slate-900">
                  {tier.price}
                </span>{" "}
                <span className="text-sm text-slate-600">{tier.period}</span>
              </p>

              <ul className="mt-5 space-y-2">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-slate-700">
                    <Check size={16} className="mt-0.5 text-emerald-600" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={tier.name === "Teacher" ? "/contact" : "/signup"}
                className={`mt-6 inline-block w-full rounded-lg px-4 py-2 text-center text-sm font-semibold ${
                  tier.popular
                    ? "bg-teal-700 text-white"
                    : "border border-slate-300 text-slate-700"
                }`}
              >
                {tier.cta}
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
