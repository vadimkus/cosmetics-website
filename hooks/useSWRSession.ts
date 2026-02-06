/**
 * SWR hook for session/auth state with automatic refresh.
 *
 * Usage:
 *   const { session, user, isAuthenticated, isLoading, refresh } = useSession()
 */

import useSWR from 'swr'
import { fetcher } from '@/lib/swr'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SessionUser {
  id: string
  email: string
  name?: string
  role?: string
  image?: string
  phone?: string
  discountPercent?: number
}

interface SessionData {
  user: SessionUser | null
  authenticated: boolean
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useSWRSession() {
  const { data, error, isLoading, mutate } = useSWR<SessionData>(
    '/api/auth/session',
    fetcher,
    {
      revalidateOnFocus: true,       // Re-check session when tab becomes active
      dedupingInterval: 5_000,       // Deduplicate within 5s
      refreshInterval: 5 * 60_000,   // Auto-refresh every 5 minutes
      errorRetryCount: 1,            // Only retry once on failure
    }
  )

  return {
    session: data ?? null,
    user: data?.user ?? null,
    isAuthenticated: data?.authenticated ?? false,
    isLoading,
    error: error as Error | undefined,
    refresh: mutate,
  }
}
