"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const configured = Boolean(key && key.startsWith("pk_") && !key.includes("replace_me"));

  if (!configured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 text-center">
        <div className="max-w-md rounded-xl border border-amber-300 bg-amber-50 p-5 text-amber-900">
          Clerk is not configured in this environment. Set
          <code className="mx-1 rounded bg-amber-100 px-1.5 py-0.5 text-xs">
            NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
          </code>
          and redeploy.
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        fallbackRedirectUrl="/assessment"
      />
    </div>
  );
}
