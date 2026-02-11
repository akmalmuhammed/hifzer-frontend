import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Compare Hifz OS plans for individual memorizers, families, and teacher-supported learning.",
};

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-4xl font-semibold text-slate-900">Pricing</h1>
      <p className="mt-3 text-slate-700">
        Simple plans for individuals, families, and classes.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          { name: "Free", price: "$0", note: "Up to 5 Juz tracking" },
          { name: "Premium", price: "$9.99/mo", note: "Unlimited + analytics" },
          { name: "Family", price: "$24.99/mo", note: "Up to 5 learners" },
        ].map((plan) => (
          <div key={plan.name} className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="text-xl font-semibold">{plan.name}</h2>
            <p className="mt-2 text-3xl font-semibold text-teal-800">
              {plan.price}
            </p>
            <p className="mt-2 text-sm text-slate-600">{plan.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
