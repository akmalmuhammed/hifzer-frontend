import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms and use policy for Hifz OS.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-4xl font-semibold text-slate-900">Terms</h1>
      <p className="mt-4 text-slate-700">
        Terms draft for migration phase. Final legal content will be added
        during pre-launch review.
      </p>
      <ul className="mt-6 list-disc space-y-2 pl-6 text-slate-700">
        <li>Use the platform respectfully and lawfully.</li>
        <li>Do not attempt unauthorized access or abuse the API.</li>
        <li>Subscription features depend on your selected plan.</li>
      </ul>
    </div>
  );
}
