type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolved = await params;
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-4xl font-semibold text-slate-900 capitalize">
        {resolved.slug.replaceAll("-", " ")}
      </h1>
      <p className="mt-4 text-slate-700">
        Content draft placeholder for the migration phase. Existing long-form
        content can be ported to MDX next.
      </p>
    </div>
  );
}
