import * as Sentry from '@sentry/nextjs'

const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN
const release = process.env.VERCEL_GIT_COMMIT_SHA
const environment =
  process.env.VERCEL_ENV || process.env.NODE_ENV || 'development'
const enabled =
  process.env.NODE_ENV === 'production' ||
  process.env.SENTRY_ENABLE_DEV === 'true'

// Silent no-op when DSN is absent (preview branches, local dev without opt-in).
if (dsn) {
  Sentry.init({
    dsn,
    environment,
    tracesSampleRate: process.env.NODE_ENV === 'development' ? 1.0 : 0.1,
    enabled,
    ...(release ? { release } : {}),
  })
}
