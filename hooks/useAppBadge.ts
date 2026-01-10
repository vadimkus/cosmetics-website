'use client'

import { useEffect, useCallback } from 'react'
import { debugLog, warnLog } from '@/lib/logger'

// Extend Navigator interface for App Badge API (experimental)
interface NavigatorWithBadge extends Navigator {
  setAppBadge: (contents?: number) => Promise<void>
  clearAppBadge: () => Promise<void>
}

interface UseAppBadgeReturn {
  setBadge: (count: number) => void
  clearBadge: () => void
  isSupported: boolean
}

// Type guard to check if navigator supports App Badge API
function hasAppBadgeSupport(nav: Navigator): nav is NavigatorWithBadge {
  return 'setAppBadge' in nav && 'clearAppBadge' in nav
}

export const useAppBadge = (): UseAppBadgeReturn => {
  const isSupported = typeof navigator !== 'undefined' && hasAppBadgeSupport(navigator)

  const setBadge = useCallback((count: number) => {
    if (!isSupported || !hasAppBadgeSupport(navigator)) {
      debugLog('App Badge API not supported')
      return
    }

    try {
      if (count <= 0) {
        // Clear badge if count is 0 or negative
        navigator.clearAppBadge()
        debugLog('App badge cleared')
      } else {
        // Set badge with count
        navigator.setAppBadge(count)
        debugLog(`App badge set to: ${count}`)
      }
    } catch (error) {
      warnLog('Failed to set app badge:', error)
    }
  }, [isSupported])

  const clearBadge = useCallback(() => {
    if (!isSupported || !hasAppBadgeSupport(navigator)) {
      debugLog('App Badge API not supported')
      return
    }

    try {
      navigator.clearAppBadge()
      debugLog('App badge cleared')
    } catch (error) {
      warnLog('Failed to clear app badge:', error)
    }
  }, [isSupported])

  // Clear badge when component unmounts or app is closed
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Optionally clear badge when app goes to background
        // Uncomment if you want this behavior
        // clearBadge()
      }
    }

    const handleBeforeUnload = () => {
      // Clear badge when app is closed
      clearBadge()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [clearBadge])

  return {
    setBadge,
    clearBadge,
    isSupported
  }
}

/**
 * Hook to automatically update app badge based on cart items
 */
export const useCartBadge = (cartItemCount: number) => {
  const { setBadge, clearBadge, isSupported } = useAppBadge()

  useEffect(() => {
    if (cartItemCount > 0) {
      setBadge(cartItemCount)
    } else {
      clearBadge()
    }
  }, [cartItemCount, setBadge, clearBadge])

  return { isSupported }
}

/**
 * Hook for notification badge management
 */
export const useNotificationBadge = () => {
  const { setBadge, clearBadge, isSupported } = useAppBadge()

  const setNotificationCount = useCallback((count: number) => {
    setBadge(count)
  }, [setBadge])

  const clearNotifications = useCallback(() => {
    clearBadge()
  }, [clearBadge])

  const incrementNotification = useCallback((currentCount: number) => {
    setBadge(currentCount + 1)
  }, [setBadge])

  return {
    setNotificationCount,
    clearNotifications,
    incrementNotification,
    isSupported
  }
}