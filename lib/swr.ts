/**
 * SWR configuration and shared fetcher.
 *
 * Usage:
 *   import { fetcher, swrConfig } from '@/lib/swr'
 *   const { data, error } = useSWR('/api/products', fetcher)
 *
 * Or wrap your app with <SWRConfig value={swrConfig}> to use default fetcher.
 */

import { errorLog } from '@/lib/logger'

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
    try {
      const body = await res.json()
      message = body?.error ?? body?.message ?? message
    } catch {
      // Non-JSON error body – use statusText
    }
    const error = new Error(message)
    ;(error as FetchError).status = res.status
    throw error
  }

  return res.json() as Promise<T>
}

interface FetchError extends Error {
  status?: number
}

// ---------------------------------------------------------------------------
// SWR global config
// ---------------------------------------------------------------------------

export const swrConfig = {
  fetcher,
  revalidateOnFocus: false,
  shouldRetryOnError: true,
  errorRetryCount: 2,
  dedupingInterval: 5000, // 5 seconds deduplication
  onError: (error: Error) => {
    errorLog('[SWR] Fetch error:', error.message)
  },
} as const
