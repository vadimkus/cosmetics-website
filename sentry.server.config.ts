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
  // TS can't narrow indexed access under `noUncheckedIndexedAccess` — guard exc.
  const exc = values[0]
  if (!exc) return false
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

/**
 * User-Agent signatures we treat as non-human traffic. Their failures still
 * happen — we just don't want them in the alert pipe, because:
 *  - SentryUptimeBot / Pingdom / UptimeRobot probe constantly; one transport
 *    blip on Prisma Accelerate becomes 50+ alerts.
 *  - Search crawlers (Googlebot, Bingbot, etc.) re-crawl quickly; transient
 *    failures get retried by the crawler itself.
 *  - Scrapers/CLI clients (`got`, `curl`, generic `bot`/`crawler`) have no
 *    human waiting on the response.
 *
 * Real users on the same flake still page us (the Prisma retry wrapper
 * captures with `area: prisma-retry` and the request UA on the event).
 *
 * Anchored substrings, case-insensitive — narrow enough to avoid false
 * positives in legit browser UAs.
 */
const BOT_UA_PATTERNS = [
  /SentryUptimeBot/i,
  /UptimeRobot/i,
  /Pingdom/i,
  /StatusCake/i,
  /BetterUptime/i,
  /HeadlessChrome/i,
  /Googlebot/i,
  /Bingbot/i,
  /YandexBot/i,
  /AhrefsBot/i,
  /SemrushBot/i,
  /DuckDuckBot/i,
  /facebookexternalhit/i,
  /Twitterbot/i,
  /LinkedInBot/i,
  /WhatsApp/i,
  /\bgot\b/i, // node `got` HTTP client default UA
  /\bcurl\//i,
  /\bwget\//i,
  /\bcrawler\b/i,
  /\bspider\b/i,
] as const

function eventUserAgent(event: Sentry.ErrorEvent): string | null {
  const headers = event.request?.headers as Record<string, string> | undefined
  if (headers) {
    for (const k of Object.keys(headers)) {
      if (k.toLowerCase() === 'user-agent') return headers[k] ?? null
    }
  }
  // Fallback: Sentry's SDK populates a `browser` tag from the UA when the
  // request scope is active (e.g. `SentryUptimeBot 1.0`).
  const tags = event.tags as Record<string, unknown> | undefined
  const browser = tags?.['browser']
  return typeof browser === 'string' ? browser : null
}

function isBotTraffic(event: Sentry.ErrorEvent): boolean {
  const ua = eventUserAgent(event)
  if (!ua) return false
  return BOT_UA_PATTERNS.some((re) => re.test(ua))
}

/**
 * Drop bot/crawler-triggered Prisma retry exhaustions.
 *
 * Context: in the 2026-04-25 weekly report, JAVASCRIPT-NEXTJS-9 had 84
 * events of which 58 were SentryUptimeBot, ~12 were other bots/crawlers
 * with no UA, and only ~5 were real users. We don't want a Prisma
 * Accelerate transport blip during a probe storm to look like a customer
 * outage in the alert stream. Real-user events on the same root cause
 * still flow through.
 */
function isBotPrismaRetry(event: Sentry.ErrorEvent): boolean {
  const tags = event.tags as Record<string, unknown> | undefined
  if (tags?.['area'] !== 'prisma-retry') return false
  return isBotTraffic(event)
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
      if (isBotPrismaRetry(event)) return null
      return event
    },
  })
}
