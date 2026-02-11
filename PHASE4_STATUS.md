# Phase 4 Status (Next Migration)

## Completed in Phase 4

- Visual parity upgrades for remaining core app pages:
  - `app/(app)/fluency-gate/page.tsx`
  - `app/(app)/practice/transitions/page.tsx`
  - `app/(app)/settings/page.tsx`
- Persistent dark mode with explicit settings controls:
  - `context/theme-context.tsx`
  - toggles in app shell and landing navbar
  - global dark-mode style overrides in `app/globals.css`
- Production baseline hardening:
  - Security headers + CSP in `next.config.ts`

## Current Migration Coverage

- Public marketing routes migrated to App Router.
- Auth flows migrated and API-connected.
- Protected app flows migrated and API-connected:
  - Assessment, Today queue, Session protocol, Fluency Gate, Transition practice, Progress, Calendar, Achievements, Settings, Tutorial.
- SEO baseline in place:
  - `robots.ts`
  - `sitemap.ts`
  - per-page metadata for key public pages

## Still Pending After Phase 4

- Pixel-perfect UI parity against `hifz-celestial` (spacing, typography, animation timings).
- Replace remaining mock data in non-critical pages (`calendar`, `achievements`, parts of `progress`) with backend-driven data contracts.
- End-to-end browser tests (Playwright/Cypress) for critical flows.
- Final CSP tightening for production domains (remove localhost and unsafe-eval once finalized).
- Vercel environment finalization (`NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_SITE_URL`) and preview/prod configs.
- Optional: analytics/observability wiring and error tracking integration.
