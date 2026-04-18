/**
 * Next.js Instrumentation file — runs once per runtime on server startup.
 * Wires up Sentry for Node.js and Edge runtimes.
 *
 * Client-side Sentry init lives in `instrumentation-client.ts` (Next.js 16 convention).
 *
 * See docs/SENTRY_SETUP.md for configuration instructions.
 */
import * as Sentry from '@sentry/nextjs'

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config')
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config')
  }
}

// Captures errors from Server Components, middleware/proxy, and route handlers.
// Requires @sentry/nextjs >= 8.28.0 and Next.js >= 15.
export const onRequestError = Sentry.captureRequestError
