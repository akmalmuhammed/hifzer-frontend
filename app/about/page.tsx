import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn the methodology behind Hifz OS: active recall, review debt protection, and transition intelligence.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-4xl font-semibold text-slate-900">About Hifz OS</h1>
      <p className="mt-4 text-slate-700">
        Hifz OS applies one universal workflow: active recall, spaced intervals,
        and mandatory link practice. The system adapts scaffolding intensity by
        learner profile while keeping linking non-negotiable.
      </p>
      <ul className="mt-6 list-disc space-y-2 pl-6 text-slate-700">
        <li>Fluency gate before memorization begins</li>
        <li>3-tier daily loop: Sabaq, Sabqi, Manzil</li>
        <li>Review-debt freeze to prevent collapse</li>
        <li>Append-only offline-first state sync</li>
      </ul>
    </div>
  );
}
