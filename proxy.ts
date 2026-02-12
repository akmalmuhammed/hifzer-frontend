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

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
}, {
  // Let Clerk inject compatible CSP directives for hosted auth components.
  contentSecurityPolicy: {
    directives: {
      "connect-src": [
        "https://*.ingest.sentry.io",
        "https://*.ingest.us.sentry.io",
      ],
    },
  },
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
