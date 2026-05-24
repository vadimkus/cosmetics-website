import * as Sentry from '@sentry/nextjs'
import { errorLog, debugLog, warnLog } from '@/lib/logger'

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

  // Prisma error codes (PrismaClientKnownRequestError.code) that indicate a
  // transient transport/engine problem, not a data problem. Safe to retry on
  // idempotent reads.
  //   P1001 — Can't reach database server
  //   P1002 — Database server timed out
  //   P1008 — Operations timed out after Nms
  //   P1017 — Server has closed the connection
  'P1001',
  'P1002',
  'P1008',
  'P1017',
  //   P5000 — Generic server error from Accelerate
  //   P5008 — Accelerate healthcheck failed / unhealthy server
  //   P5009 — Accelerate request timeout
  //   P5011 — Request timed out (Accelerate proxy → engine)
  //   P6000 — Accelerate proxy/engine transport failure
  //   P6004 — Accelerate query timeout
  //   P6008 — Connection / engine start error in Accelerate
  'P5000',
  'P5008',
  'P5009',
  'P5011',
  'P6000',
  'P6004',
  'P6008',
])

/**
 * Patterns that appear in the `.message` of Prisma / undici errors when the
 * underlying cause is network-level OR a Prisma engine panic that is safe to
 * retry on an idempotent read. Used when `.code` is missing or buried inside
 * a PrismaClientKnownRequestError / PrismaClientUnknownRequestError.
 *
 * Two groups:
 * 1. Socket / transport (undici, pg driver, Prisma Accelerate HTTP transport)
 * 2. Prisma query engine panics (Rust binary state corruption on serverless
 *    cold starts or connection reuse — next attempt with a fresh engine
 *    almost always succeeds)
 */
const TRANSIENT_MESSAGE_PATTERNS = [
  // 1. Socket / transport layer
  /fetch failed/i,
  /ETIMEDOUT/,
  /ECONNRESET/,
  /socket hang up/i,
  /connection terminated unexpectedly/i,
  /connection terminated due to connection timeout/i,
  /timeout exceeded when trying to connect/i,
  /client has encountered a connection error/i,

  // 2. Prisma query engine panics — observed in prod via Sentry
  //    (JAVASCRIPT-NEXTJS-4, 2026-04-18, `getProductById`)
  /null pointer passed to rust/i,
  /Rust panic/i,

  // 3. Prisma Accelerate proxy ↔ query engine transport failures —
  //    observed in prod via Sentry (2026-04-20, `getProductById`).
  //    Accelerate's HTTP proxy could not reach the remote Rust engine for
  //    this request; the DB itself was never touched, so retrying an
  //    idempotent read is safe.
  /Accelerate experienced an error communicating with your Query Engine/i,
  /Error in Prisma Client request/i,
  /Engine is not yet connected/i,
  /Response from the Engine was empty/i,

  // 4. Prisma known error codes that map to transient conditions
  //    P1001 = Can't reach database server
  //    P1002 = Database server timeout
  //    P1008 = Operations timed out after Nms
  //    P1017 = Server has closed the connection
  /Can't reach database server/i,
  /Server has closed the connection/i,
  /Operations timed out/i,
]

export function isPrismaTransientError(error: unknown): boolean {
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

function errorText(error: unknown, depth = 0): string {
  if (!error || depth > 2) return ''
  if (typeof error !== 'object') return String(error)

  const err = error as { code?: string; message?: string; cause?: unknown }
  return [
    err.code,
    err.message,
    errorText(err.cause, depth + 1),
  ].filter(Boolean).join('\n')
}

export function isAccelerateResourceLimitError(error: unknown): boolean {
  const text = errorText(error)
  return (
    /accelerate\.prisma-data\.net|Prisma Accelerate/i.test(text) &&
    /Error 1102|worker_exceeded_resources|Worker exceeded resource limits/i.test(text)
  )
}

interface RetryOpts<T> {
  /** Label included in Sentry tag + debug logs. */
  label: string
  /** Max retries (default 2 → up to 3 attempts total). */
  retries?: number
  /** Set false when the caller has a graceful fallback and will handle reporting. */
  capture?: boolean
  /** Optional recovery path that runs before Sentry capture on final failure. */
  recover?: (error: unknown, context: {
    retriesPerformed: number
    maxRetries: number
    transient: boolean
  }) => Promise<T>
  /** Limit recovery to specific final errors. */
  shouldRecover?: (error: unknown) => boolean
  /** Suppress expected recovery failures, e.g. a direct DB fallback timeout. */
  shouldCaptureRecoveryFailure?: (error: unknown, context: {
    retriesPerformed: number
    maxRetries: number
    primaryTransient: boolean
  }) => boolean
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
  opts: RetryOpts<T>
): Promise<T> {
  const retries = opts.retries ?? 2
  const delays = [100, 500, 1500] as const

  let lastError: unknown
  let retriesPerformed = 0
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      if (!isPrismaTransientError(error) || attempt === retries) break
      retriesPerformed++
      const delay = delays[attempt] ?? 2000
      debugLog(
        `[prismaRetry:${opts.label}] transient error, retrying in ${delay}ms`,
        `(attempt ${attempt + 1}/${retries})`
      )
      await new Promise((r) => setTimeout(r, delay))
    }
  }

  const wasTransient = isPrismaTransientError(lastError)
  if (opts.recover && (!opts.shouldRecover || opts.shouldRecover(lastError))) {
    debugLog(`[prismaRetry:${opts.label}] attempting recovery after primary read failure`)
    try {
      return await opts.recover(lastError, {
        retriesPerformed,
        maxRetries: retries,
        transient: wasTransient,
      })
    } catch (recoveryError) {
      const recoveryTransient = isPrismaTransientError(recoveryError)
      const shouldCaptureRecoveryFailure =
        opts.capture !== false &&
        (opts.shouldCaptureRecoveryFailure?.(recoveryError, {
          retriesPerformed,
          maxRetries: retries,
          primaryTransient: wasTransient,
        }) ?? true)
      if (shouldCaptureRecoveryFailure) {
        Sentry.captureException(recoveryError, {
          tags: {
            area: 'prisma-retry',
            op: opts.label,
            recovery: 'failed',
            transient: String(wasTransient),
          },
          extra: {
            retriesPerformed,
            maxRetries: retries,
            primaryError: errorText(lastError),
          },
        })
      }
      const recoveryLog = shouldCaptureRecoveryFailure || !recoveryTransient ? errorLog : warnLog
      recoveryLog(`[prismaRetry:${opts.label}] recovery failed:`, recoveryError)
      throw recoveryError
    }
  }

  if (opts.capture !== false) {
    Sentry.captureException(lastError, {
      tags: {
        area: 'prisma-retry',
        op: opts.label,
        transient: String(wasTransient),
      },
      extra: { retriesPerformed, maxRetries: retries },
    })
  }
  const finalLog = opts.capture === false && wasTransient ? warnLog : errorLog
  finalLog(
    `[prismaRetry:${opts.label}] failed after ${retriesPerformed} retr${retriesPerformed === 1 ? 'y' : 'ies'}`,
    `(transient=${wasTransient}):`,
    lastError
  )
  throw lastError
}
