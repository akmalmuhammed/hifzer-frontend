import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact the Hifz OS team for support or partnership.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-4xl font-semibold text-slate-900">Contact</h1>
      <p className="mt-4 text-slate-700">
        Reach our team for product support, teacher onboarding, or enterprise
        inquiries.
      </p>
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
        <p className="text-sm text-slate-700">Email: support@hifzos.com</p>
        <p className="mt-2 text-sm text-slate-700">
          For madrasah deployment, include expected student count and region.
        </p>
      </div>
    </div>
  );
}
