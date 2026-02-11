"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { initializing, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!initializing && !isAuthenticated) {
      const next = encodeURIComponent(pathname || "/today");
      router.replace(`/sign-in?next=${next}`);
    }
  }, [initializing, isAuthenticated, pathname, router]);

  if (initializing || !isAuthenticated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-slate-600">
        Checking your session...
      </div>
    );
  }

  return <>{children}</>;
}
