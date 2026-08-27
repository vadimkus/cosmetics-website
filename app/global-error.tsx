'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'
import { isIgnorableBrowserNavigationError } from '@/lib/browserErrorNoise'

/**
 * Global error boundary - catches rendering errors that escape per-route
 * `error.tsx` boundaries (root layout crashes, errors in providers, etc.).
 *
 * Renders plain HTML without app providers because the root layout has failed
 * by the time this runs. Keep dependencies minimal; any import that reaches
 * into i18n/auth/cart providers will crash this fallback.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    if (isIgnorableBrowserNavigationError(error)) return

    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
          background: '#ffffff',
          color: '#111111',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
        }}
      >
        <div style={{ maxWidth: 480, textAlign: 'center' }}>
          <h1
            style={{
              fontSize: '1.75rem',
              fontWeight: 600,
              marginBottom: '0.75rem',
            }}
          >
            Something went wrong
          </h1>
          <p
            style={{
              color: '#4b5563',
              fontSize: '1rem',
              marginBottom: '2rem',
              lineHeight: 1.5,
            }}
          >
            An unexpected error occurred. Our team has been notified and is
            working on a fix.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={reset}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#111111',
                color: '#ffffff',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.95rem',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Try again
            </button>
            {/* Root layout may be broken here; keep this as a plain document fallback. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              style={{
                padding: '0.75rem 1.5rem',
                background: '#ffffff',
                color: '#111111',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '0.95rem',
                fontWeight: 500,
                textDecoration: 'none',
              }}
            >
              Go home
            </a>
          </div>
        </div>
      </body>
    </html>
  )
}
