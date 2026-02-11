"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export default function AppSegmentError({
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
    <div className="mx-auto max-w-xl px-4 py-16">
      <div className="rounded-xl border border-rose-200 bg-white p-6 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">Unexpected app error</h1>
        <p className="mt-2 text-sm text-slate-600">
          We captured this error. Please retry your last action.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
