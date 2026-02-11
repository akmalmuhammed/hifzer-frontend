import * as Sentry from "@sentry/nextjs";

const tracesSampleRateRaw = Number(
  process.env.SENTRY_TRACES_SAMPLE_RATE ??
    process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE ??
    "0.1"
);
const tracesSampleRate = Number.isFinite(tracesSampleRateRaw) ? tracesSampleRateRaw : 0.1;

Sentry.init({
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.SENTRY_ENVIRONMENT || process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT,
  tracesSampleRate
});
