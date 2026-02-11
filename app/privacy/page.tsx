import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Privacy commitments for Hifz OS learners and teachers.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-4xl font-semibold text-slate-900">Privacy</h1>
      <p className="mt-4 text-slate-700">
        Privacy policy draft for migration phase. Production legal copy will be
        inserted before launch.
      </p>
      <ul className="mt-6 list-disc space-y-2 pl-6 text-slate-700">
        <li>Session and event data are used to compute learning state.</li>
        <li>Authentication tokens are used only for session continuity.</li>
        <li>You can request data export and account deletion.</li>
      </ul>
    </div>
  );
}
