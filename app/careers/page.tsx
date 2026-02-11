import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join the team building retention-first technology for Qur'an memorization.",
};

export default function CareersPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-4xl font-semibold text-slate-900">Careers</h1>
      <p className="mt-4 text-slate-700">
        We are building infrastructure for lifelong Qur&apos;an retention. Hiring
        updates will be posted here.
      </p>
    </div>
  );
}
