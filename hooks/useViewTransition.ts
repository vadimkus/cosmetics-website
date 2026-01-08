'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { debugLog } from '@/lib/logger'

// Type for View Transitions API (not yet in TypeScript DOM lib)
interface ViewTransition {
  finished: Promise<void>
  ready: Promise<void>
  updateCallbackDone: Promise<void>
  skipTransition: () => void
}

// Type-safe way to access startViewTransition
function getViewTransition(): ((callback: () => void | Promise<void>) => ViewTransition) | undefined {
  if (typeof document !== 'undefined' && 'startViewTransition' in document) {
    return (document as unknown as { startViewTransition: (callback: () => void | Promise<void>) => ViewTransition }).startViewTransition.bind(document)
  }
  return undefined
}

interface UseViewTransitionOptions {
  /** Fallback duration when View Transitions API is not supported */
  fallbackDuration?: number
}

/**
 * Hook for smooth page transitions using the View Transitions API
 * Falls back gracefully on unsupported browsers
 * 
 * @see https://developer.chrome.com/docs/web-platform/view-transitions/
 */
export function useViewTransition(options: UseViewTransitionOptions = {}) {
  const { fallbackDuration = 150 } = options
  const router = useRouter()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    // Check if View Transitions API is supported
    setIsSupported(getViewTransition() !== undefined)
  }, [])

  /**
   * Navigate with a smooth view transition
   */
  const navigateWithTransition = useCallback(async (
    href: string,
    options?: { replace?: boolean }
  ) => {
    const startViewTransition = getViewTransition()
    
    if (!isSupported || !startViewTransition) {
      // Fallback: simple navigation without transition
      if (options?.replace) {
        router.replace(href)
      } else {
        router.push(href)
      }
      return
    }

    setIsTransitioning(true)
    debugLog('Starting view transition to:', href)

    try {
      const transition = startViewTransition(() => {
        if (options?.replace) {
          router.replace(href)
        } else {
          router.push(href)
        }
      })

      await transition.finished
    } catch (error) {
      // View transition failed, navigation still happened
      debugLog('View transition failed:', error)
    } finally {
      setIsTransitioning(false)
    }
  }, [router, isSupported])

  /**
   * Execute a callback with view transition (for non-navigation updates)
   */
  const withTransition = useCallback(async <T>(callback: () => T | Promise<T>): Promise<T> => {
    const startViewTransition = getViewTransition()
    
    if (!isSupported || !startViewTransition) {
      return callback()
    }

    setIsTransitioning(true)

    try {
      let result: T
      const transition = startViewTransition(async () => {
        result = await callback()
      })

      await transition.finished
      return result!
    } catch (error) {
      debugLog('View transition failed:', error)
      return callback()
    } finally {
      setIsTransitioning(false)
    }
  }, [isSupported])

  /**
   * Skip the current transition (useful for fast interactions)
   */
  const skipTransition = useCallback(() => {
    // No-op if not transitioning - API handles this internally
    setIsTransitioning(false)
  }, [])

  return {
    /** Whether View Transitions API is supported */
    isSupported,
    /** Whether a transition is currently in progress */
    isTransitioning,
    /** Navigate to a URL with smooth transition */
    navigateWithTransition,
    /** Execute a callback with view transition animation */
    withTransition,
    /** Skip the current transition */
    skipTransition,
    /** Fallback duration for unsupported browsers */
    fallbackDuration,
  }
}

export default useViewTransition
