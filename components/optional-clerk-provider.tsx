"use client";

import { ClerkProvider } from "@clerk/nextjs";

function hasConfiguredClerkKey(): boolean {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  return Boolean(key && key.startsWith("pk_") && !key.includes("replace_me"));
}

export function OptionalClerkProvider({ children }: { children: React.ReactNode }) {
  if (!hasConfiguredClerkKey()) {
    return <>{children}</>;
  }
  return <ClerkProvider>{children}</ClerkProvider>;
}
