# Hifz OS Frontend (Next.js App Router)

This is the in-progress Next.js migration from the Vite prototype.  
Backend remains the existing Express API in `../backend`.

## What is migrated now

- App Router scaffold with route groups
- Auth supports dual mode:
  - Legacy backend auth (`/api/v1/auth/*`)
  - Clerk (when `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is configured)
- Middleware guard uses Clerk `__session` cookie (and legacy fallback cookie)
- Animated landing page sections ported from Vite prototype
- SEO files: `sitemap.xml` and `robots.txt`
- Core API wiring for:
  - `login`, `signup`, `refresh`
  - `assessment submit`
  - `today queue`, `stats`
  - `session start`, `step-complete`, `session complete`
  - `fluency gate start/submit/status`
  - `transition event ingest`
- Protected app pages:
  - `/today`
  - `/assessment`
  - `/fluency-gate`
  - `/session/[sessionId]`
  - `/practice/transitions`
  - `/progress`
  - `/settings`
- Public pages:
  - `/`, `/about`, `/pricing`, `/blog`, `/careers`, `/privacy`, `/terms`, `/contact`

## Run locally

1. Start backend first (`d:/codex/backend`)
2. In this folder:

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Default frontend URL: `http://localhost:3000`  
Default backend URL expected: `http://localhost:4000`

## Notes

- This is phase-2 migration. Most primary routes are now ported to Next, but some advanced widgets still need parity work.
- Existing mock-local data is cleared once on first successful live sync.
- Display name remains frontend-local for now (backend has no `name` field yet).
- Clerk env vars:
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - `CLERK_SECRET_KEY`
