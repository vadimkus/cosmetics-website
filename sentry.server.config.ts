import * as Sentry from '@sentry/nextjs'

const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN
const release = process.env.VERCEL_GIT_COMMIT_SHA
const environment =
  process.env.VERCEL_ENV || process.env.NODE_ENV || 'development'
const enabled =
  process.env.NODE_ENV === 'production' ||
  process.env.SENTRY_ENABLE_DEV === 'true'

/**
 * Drop unactionable Prisma Accelerate fetch-failed rejections that leak out of
 * undici's stream pipeline independently of the outer promise chain.
 *
 * Pattern (see Sentry JAVASCRIPT-NEXTJS-7, 2026-04-22):
 *   - mechanism: auto.node.onunhandledrejection
 *   - exception: TypeError: fetch failed
 *   - no stacktrace (undici emits a bare error with no frames)
 *   - breadcrumb contains Prisma clientVersion
 *
 * These events carry no URL, transaction, or frames — there's nothing to act
 * on. The actual user-facing query failure is caught and reported by
 * `lib/prismaRetry.ts` with `area: 'prisma-retry'` and the op label, which is
 * where real signal lives. Dropping the secondary rejection eliminates alert
 * noise without losing any information.
 *
 * If a `TypeError: fetch failed` ever arrives WITH a stacktrace, we let it
 * through — that would indicate a non-Prisma source worth investigating.
 */
function isUnactionablePrismaFetchReject(event: Sentry.ErrorEvent): boolean {
  const values = event.exception?.values
  if (!values || values.length !== 1) return false
  const exc = values[0]
  if (exc.type !== 'TypeError' || exc.value !== 'fetch failed') return false
  if (exc.mechanism?.type !== 'auto.node.onunhandledrejection') return false
  if (exc.stacktrace?.frames?.length) return false

  const breadcrumbs = event.breadcrumbs || []
  return breadcrumbs.some((b) => {
    const args = (b.data as { arguments?: unknown[] } | undefined)?.arguments
    if (!Array.isArray(args)) return false
    return args.some(
      (a) =>
        a != null &&
        typeof a === 'object' &&
        'clientVersion' in (a as object) &&
        (a as { message?: unknown }).message === 'fetch failed',
    )
  })
}

// Silent no-op when DSN is absent (preview branches, local dev without opt-in).
if (dsn) {
  Sentry.init({
    dsn,
    environment,
    tracesSampleRate: process.env.NODE_ENV === 'development' ? 1.0 : 0.1,
    enabled,
    ...(release ? { release } : {}),
    beforeSend(event) {
      if (isUnactionablePrismaFetchReject(event)) return null
      return event
    },
  })
}
