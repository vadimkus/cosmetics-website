import * as Sentry from '@sentry/nextjs'
import { errorLog, debugLog } from '@/lib/logger'

/**
 * Transient error codes from the Node.js / libuv layer that Prisma Accelerate
 * (HTTP-based) and the pg driver can surface during ephemeral network issues.
 * A retry is safe because these occur *before* the query lands in Postgres —
 * the DB has not processed anything.
 */
const TRANSIENT_ERROR_CODES = new Set([
  'ETIMEDOUT',   // socket write/read timeout
  'ECONNRESET',  // peer closed connection mid-request
  'ECONNREFUSED',
  'EPIPE',       // broken pipe
  'EAI_AGAIN',   // DNS temporary failure
  'UND_ERR_SOCKET', // undici socket error
])

/**
 * Patterns that appear in the `.message` of Prisma / undici errors when the
 * underlying cause is network-level and retry-safe. Used as a fallback when
 * `.code` is missing or buried inside a PrismaClientKnownRequestError.
 */
const TRANSIENT_MESSAGE_PATTERNS = [
  /fetch failed/i,
  /ETIMEDOUT/,
  /ECONNRESET/,
  /socket hang up/i,
  /connection terminated unexpectedly/i,
  /client has encountered a connection error/i,
]

function isTransient(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false

  const err = error as { code?: string; message?: string; cause?: unknown }

  if (err.code && TRANSIENT_ERROR_CODES.has(err.code)) return true

  if (err.cause && typeof err.cause === 'object') {
    const cause = err.cause as { code?: string; message?: string }
    if (cause.code && TRANSIENT_ERROR_CODES.has(cause.code)) return true
    if (cause.message && TRANSIENT_MESSAGE_PATTERNS.some((p) => p.test(cause.message!))) {
      return true
    }
  }

  if (err.message && TRANSIENT_MESSAGE_PATTERNS.some((p) => p.test(err.message!))) {
    return true
  }

  return false
}

interface RetryOpts {
  /** Label included in Sentry tag + debug logs. */
  label: string
  /** Max retries (default 2 → up to 3 attempts total). */
  retries?: number
}

/**
 * Wraps a Prisma read with bounded retries for transient network errors.
 *
 * Suitable for **idempotent** operations only — reads, and writes that
 * tolerate re-execution (upserts with natural keys). Do NOT wrap multi-step
 * transactions or non-idempotent writes without careful review.
 *
 * On final failure:
 * - Reports to Sentry with `{ area: 'prisma-retry', op: <label> }` tags.
 * - Preserves the original error (including cause chain) and re-throws.
 */
export async function withPrismaRetry<T>(
  fn: () => Promise<T>,
  opts: RetryOpts
): Promise<T> {
  const retries = opts.retries ?? 2
  const delays = [100, 500, 1500] as const

  let lastError: unknown
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      if (!isTransient(error) || attempt === retries) break
      const delay = delays[attempt] ?? 2000
      debugLog(
        `[prismaRetry:${opts.label}] transient error, retrying in ${delay}ms`,
        `(attempt ${attempt + 1}/${retries})`
      )
      await new Promise((r) => setTimeout(r, delay))
    }
  }

  Sentry.captureException(lastError, {
    tags: { area: 'prisma-retry', op: opts.label },
    extra: { retriesAttempted: retries, transient: isTransient(lastError) },
  })
  errorLog(`[prismaRetry:${opts.label}] failed after ${retries} retries:`, lastError)
  throw lastError
}
