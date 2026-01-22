import { useState, useEffect } from 'react'

/**
 * useReducedMotion Hook
 * 
 * Detects user's preference for reduced motion and provides utilities
 * for respecting this preference across the application.
 * 
 * Features:
 * - Detects prefers-reduced-motion media query
 * - Listens for changes in user preference
 * - Provides boolean flag and utility functions
 * - Server-safe (returns false during SSR)
 * 
 * Usage:
 * const { prefersReducedMotion, getMotionProps } = useReducedMotion()
 * 
 * <motion.div {...getMotionProps({ animate: { y: 10 } })} />
 */
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    // Check if window.matchMedia is available
    if (typeof window === 'undefined' || !window.matchMedia) {
      return
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    
    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches)

    // Listen for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
    
    // Legacy browsers (Safari < 14)
    mediaQuery.addListener?.(handleChange)
    return () => {
      mediaQuery.removeListener?.(handleChange)
    }
  }, [])

  /**
   * Returns animation props that respect reduced motion preference
   * If user prefers reduced motion, returns empty object or instant animation
   */
  const getMotionProps = <T extends Record<string, unknown>>(
    animationProps: T,
    options?: { instant?: boolean }
  ): T | Record<string, unknown> => {
    if (prefersReducedMotion) {
      if (options?.instant) {
        // Return same animation but with instant duration
        return {
          ...animationProps,
          transition: { duration: 0 },
        }
      }
      // Return empty object to disable animation
      return {}
    }
    return animationProps
  }

  /**
   * Returns a CSS transition value that respects reduced motion
   */
  const getTransition = (defaultTransition: string): string => {
    if (prefersReducedMotion) {
      return 'none'
    }
    return defaultTransition
  }

  /**
   * Returns animation duration that respects reduced motion
   */
  const getDuration = (defaultDuration: number): number => {
    if (prefersReducedMotion) {
      return 0
    }
    return defaultDuration
  }

  /**
   * Conditionally returns a value based on motion preference
   */
  const withMotion = <T, F>(withMotionValue: T, withoutMotionValue: F): T | F => {
    return prefersReducedMotion ? withoutMotionValue : withMotionValue
  }

  return {
    prefersReducedMotion,
    isClient,
    getMotionProps,
    getTransition,
    getDuration,
    withMotion,
  }
}

/**
 * Check if user prefers reduced motion (non-hook version for use outside components)
 * Safe to call on server (returns false)
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return false
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default useReducedMotion
