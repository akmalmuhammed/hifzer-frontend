"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900">
        <div className="mx-auto flex min-h-screen max-w-xl items-center px-4">
          <div className="w-full rounded-xl border border-rose-200 bg-white p-6 text-center">
            <h1 className="text-2xl font-semibold">Something went wrong</h1>
            <p className="mt-2 text-sm text-slate-600">
              We logged this issue and will investigate it.
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
