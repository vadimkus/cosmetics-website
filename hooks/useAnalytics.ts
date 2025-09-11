import { useCallback } from 'react'
import { useAuth } from '@/components/AuthProvider'

export function useAnalytics() {
  const { user } = useAuth()

  const trackPageView = useCallback(async (page: string) => {
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'pageview',
          page,
          userId: user?.id,
          userEmail: user?.email
        })
      })
    } catch (error) {
      console.error('Error tracking page view:', error)
    }
  }, [user])

  const trackAction = useCallback(async (action: string, details?: string) => {
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'action',
          action,
          details,
          userId: user?.id,
          userEmail: user?.email
        })
      })
    } catch (error) {
      console.error('Error tracking action:', error)
    }
  }, [user])

  return {
    trackPageView,
    trackAction
  }
}
