import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Research notes and product updates from the Hifz OS team.",
};

const POSTS = [
  {
    slug: "why-review-debt-destroys-hifz",
    title: "Why Review Debt Destroys Hifz",
    excerpt:
      "How backlog pressure triggers memorization collapse and how to prevent it.",
  },
  {
    slug: "3x3-linking-protocol",
    title: "The 3x3 Linking Protocol",
    excerpt:
      "Why transition practice is the missing layer in most memorization apps.",
  },
  {
    slug: "fluency-gate-prerequisite",
    title: "Fluency Gate as a Prerequisite",
    excerpt: "Block failure early by validating reading fluency before Sabaq.",
  },
];

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-4xl font-semibold text-slate-900">Blog</h1>
      <p className="mt-3 text-slate-700">
        Research notes and product updates behind Hifz OS.
      </p>
      <div className="mt-8 space-y-4">
        {POSTS.map((post) => (
          <article
            key={post.slug}
            className="rounded-xl border border-slate-200 bg-white p-5"
          >
            <h2 className="text-xl font-semibold text-slate-900">{post.title}</h2>
            <p className="mt-2 text-slate-600">{post.excerpt}</p>
            <Link
              href={`/blog/${post.slug}`}
              className="mt-3 inline-block text-sm font-medium text-teal-700"
            >
              Read article
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
