import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/today(.*)",
  "/assessment(.*)",
  "/session(.*)",
  "/fluency-gate(.*)",
  "/progress(.*)",
  "/settings(.*)",
  "/calendar(.*)",
  "/achievements(.*)",
  "/practice(.*)",
  "/tutorial(.*)",
]);

function resolveApiOrigin(raw?: string): string | null {
  if (!raw) {
    return null;
  }
  try {
    return new URL(raw).origin;
  } catch {
    return null;
  }
}

const apiOrigin = resolveApiOrigin(process.env.NEXT_PUBLIC_API_BASE_URL);
const connectSrcValues = [
  "https://*.ingest.sentry.io",
  "https://*.ingest.us.sentry.io",
  "https://*.workers.dev",
  ...(apiOrigin ? [apiOrigin] : []),
];

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
}, {
  // Let Clerk inject compatible CSP directives for hosted auth components.
  contentSecurityPolicy: {
    directives: {
      "connect-src": connectSrcValues,
    },
  },
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
