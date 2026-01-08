'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useRef } from 'react'
import { debugLog } from '@/lib/logger'

interface PrefetchOptions {
  /** Delay in ms before prefetching (debounce) */
  delay?: number
  /** Whether to prefetch on touch start for mobile */
  prefetchOnTouchStart?: boolean
}

/**
 * Hook for prefetching routes on hover/focus for faster navigation
 * Uses Next.js router prefetching with intelligent debouncing
 */
export function usePrefetch(options: PrefetchOptions = {}) {
  const { delay = 100, prefetchOnTouchStart = true } = options
  const router = useRouter()
  const prefetchedRoutes = useRef<Set<string>>(new Set())
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const prefetch = useCallback((href: string) => {
    // Avoid prefetching the same route multiple times
    if (prefetchedRoutes.current.has(href)) return

    // Clear any pending prefetch
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      debugLog('Prefetching route:', href)
      router.prefetch(href)
      prefetchedRoutes.current.add(href)
    }, delay)
  }, [router, delay])

  const cancelPrefetch = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  /**
   * Event handlers to attach to links/elements
   */
  const getPrefetchProps = useCallback((href: string) => ({
    onMouseEnter: () => prefetch(href),
    onMouseLeave: cancelPrefetch,
    onFocus: () => prefetch(href),
    onBlur: cancelPrefetch,
    ...(prefetchOnTouchStart && {
      onTouchStart: () => prefetch(href),
    }),
  }), [prefetch, cancelPrefetch, prefetchOnTouchStart])

  return {
    prefetch,
    cancelPrefetch,
    getPrefetchProps,
  }
}

/**
 * Prefetch a single product page
 */
export function usePrefetchProduct() {
  const { prefetch, getPrefetchProps } = usePrefetch({ delay: 50 })
  
  const prefetchProduct = useCallback((productId: string, locale: string = 'en') => {
    const path = locale === 'en' 
      ? `/products/${productId}`
      : `/${locale}/products/${productId}`
    prefetch(path)
  }, [prefetch])

  const getProductPrefetchProps = useCallback((productId: string, locale: string = 'en') => {
    const path = locale === 'en' 
      ? `/products/${productId}`
      : `/${locale}/products/${productId}`
    return getPrefetchProps(path)
  }, [getPrefetchProps])

  return {
    prefetchProduct,
    getProductPrefetchProps,
  }
}

export default usePrefetch
