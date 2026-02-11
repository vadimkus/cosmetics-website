/**
 * SWR Configuration
 *
 * Global configuration for SWR data fetching:
 * - Deduplication: Prevents duplicate requests within 5 seconds
 * - Retry: Exponential backoff with max 3 retries
 * - Revalidation: On focus and reconnect for fresh data
 * - Error handling: Structured error objects with status codes
 *
 * Usage:
 *   import { fetcher, swrConfig } from '@/lib/swr'
 *   const { data, error } = useSWR('/api/products', fetcher)
 *
 * Or wrap your app with <SWRConfig value={swrConfig}> to use default fetcher.
 */

import { SWRConfiguration } from 'swr'
import { errorLog } from '@/lib/logger'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FetchError extends Error {
  status?: number
  info?: unknown
}

// ---------------------------------------------------------------------------
// Fetcher
// ---------------------------------------------------------------------------

/**
 * Default SWR fetcher that handles JSON responses and error states.
 */
export async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url)

  if (!res.ok) {
    let message = res.statusText
    let info: unknown
    try {
      const body = await res.json()
      message = body?.error ?? body?.message ?? message
      info = body
    } catch {
      // Non-JSON error body – use statusText
      info = { message: res.statusText }
    }
    const error = new Error(message) as FetchError
    error.status = res.status
    error.info = info
    throw error
  }

  return res.json() as Promise<T>
}

// ---------------------------------------------------------------------------
// Retry helpers
// ---------------------------------------------------------------------------

/**
 * Exponential backoff for retry delays
 */
function getRetryDelay(retryCount: number): number {
  return Math.min(1000 * Math.pow(2, retryCount), 30000) // Max 30 seconds
}

// ---------------------------------------------------------------------------
// SWR global config
// ---------------------------------------------------------------------------

export const swrConfig: SWRConfiguration = {
  fetcher,

  // Deduplication: prevent duplicate requests within 5 seconds
  dedupingInterval: 5000,

  // Revalidation settings
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  revalidateIfStale: true,

  // Keep showing previous data while revalidating (better UX)
  keepPreviousData: true,

  // Retry configuration with exponential backoff
  errorRetryCount: 3,
  errorRetryInterval: 1000,
  onErrorRetry: (error, _key, _config, revalidate, { retryCount }) => {
    // Don't retry on 4xx errors (client errors)
    if ((error as FetchError)?.status && (error as FetchError).status! >= 400 && (error as FetchError).status! < 500) return

    // Don't retry more than 3 times
    if (retryCount >= 3) return

    // Exponential backoff
    const delay = getRetryDelay(retryCount)
    setTimeout(() => revalidate({ retryCount }), delay)
  },

  // Focus throttle: don't revalidate more than once per 5 seconds on focus
  focusThrottleInterval: 5000,

  // Loading timeout: show loading state for at least 200ms to prevent flash
  loadingTimeout: 200,

  // Global error handler for logging
  onError: (error: Error) => {
    errorLog('[SWR] Fetch error:', error.message)
  },
}

export default swrConfig
