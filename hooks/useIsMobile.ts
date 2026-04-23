'use client'

import { useState, useEffect } from 'react'
import { usePWAMode } from '@/hooks/usePWAMode'

/**
 * Returns whether the viewport is narrower than `breakpoint` (default 768px).
 *
 * SSR-safe: always returns `isMobile: false, isClient: false` on the server
 * and during the first client render, then updates after hydration.
 *
 * Re-runs on `resize` so components stay reactive to breakpoint changes
 * (useful when the user rotates their device or resizes the window).
 *
 * NOTE: If you want a one-shot check (e.g. "redirect once on mount") use
 * `window.innerWidth < 768` directly inside a mount-only `useEffect`.
 * Don't use this hook for that — it will re-trigger on every resize.
 */
export function useIsMobile(breakpoint: number = 768) {
  const [isMobile, setIsMobile] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [breakpoint])

  return { isMobile, isClient }
}

/**
 * Returns whether the user is on **mobile web** — i.e. a narrow viewport
 * AND NOT running as an installed PWA.
 *
 * This collapses the ~40 files that previously did:
 *
 *   const [isMobileWeb, setIsMobileWeb] = useState(false)
 *   useEffect(() => {
 *     const check = () => setIsMobileWeb(window.innerWidth < 768 && !isPWA)
 *     check()
 *     window.addEventListener('resize', check)
 *     return () => window.removeEventListener('resize', check)
 *   }, [isPWA])
 *
 * …into a single hook call.
 *
 * Returns:
 *   - `isMobileWeb`: true only when on mobile viewport AND NOT in PWA mode
 *   - `isMobile`:    raw mobile viewport flag
 *   - `isPWA`:       whether the app is running as an installed PWA
 *   - `isClient`:    whether we have hydrated and can trust the flags
 */
export function useIsMobileWeb(breakpoint: number = 768) {
  const { isMobile, isClient: isMobileClient } = useIsMobile(breakpoint)
  const { isPWA, isClient: isPWAClient } = usePWAMode()

  const isClient = isMobileClient && isPWAClient
  const isMobileWeb = isClient && isMobile && !isPWA

  return { isMobileWeb, isMobile, isPWA, isClient }
}
