import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl items-center px-4">
      <div className="w-full rounded-xl border border-slate-200 bg-white p-6 text-center">
        <h1 className="text-3xl font-semibold text-slate-900">Page not found</h1>
        <p className="mt-2 text-sm text-slate-600">
          The page you requested does not exist.
        </p>
        <Link
          href="/"
          className="mt-4 inline-block rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
