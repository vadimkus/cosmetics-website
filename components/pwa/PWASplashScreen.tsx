'use client'

import { useState, useEffect, useCallback, type ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import { usePWAMode } from '@/hooks/usePWAMode'
import { useAuth } from '@/components/auth/AuthProvider'

const COMPANY_NAME = 'GENOSYS'
const MINIMUM_DISPLAY_MS = 600 // Minimum time to show splash screen

// Auth-related pages that don't require login
const AUTH_PAGES = ['/pwa-login', '/login', '/signup', '/forgot-password', '/reset-password']

function isAuthPage(path: string): boolean {
  const normalizedPath = path?.replace(/^\/(ar|ru)/, '') || '/'
  return AUTH_PAGES.some(authPath => normalizedPath.includes(authPath))
}

function getLocale(pathname: string): 'en' | 'ar' | 'ru' {
  if (pathname?.startsWith('/ar')) return 'ar'
  if (pathname?.startsWith('/ru')) return 'ru'
  return 'en'
}

function getLoginPath(locale: string): string {
  return locale === 'en' ? '/pwa-login' : `/${locale}/pwa-login`
}

function SplashOverlay({ className = '', faded = false }: { className?: string; faded?: boolean }) {
  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white ${
        faded ? 'transition-opacity duration-300 opacity-0 pointer-events-none' : ''
      } ${className}`}
    >
      <div className="flex flex-col items-center px-6">
        <Image
          src="/Logo/Full.png"
          alt="Genosys"
          width={260}
          height={90}
          className="w-[260px] h-auto"
        />
        <p className="mt-5 text-lg font-semibold text-red-600 text-center">
          {COMPANY_NAME}
        </p>
        {!faded && (
          <div className="mt-8">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-red-600 rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * PWA Splash Screen - shows a branded loading screen while the PWA starts
 * and blocks PWA content until auth is verified (unauthenticated PWA users
 * are redirected to /pwa-login).
 *
 * CRITICAL FOR SEO: children must ALWAYS be present in the server-rendered
 * HTML. AI crawlers (GPTBot, ClaudeBot, PerplexityBot) do not execute
 * JavaScript - whatever the server sends is all they ever see. A previous
 * version of this component returned a bare spinner during SSR, which made
 * every page on the site invisible to non-JS crawlers (~11 words of HTML).
 *
 * How it works now:
 * - SSR / pre-hydration: children render normally. The splash overlay is
 *   also in the HTML but hidden by CSS (`pwa-boot-splash`) unless the app
 *   is running in a PWA display mode (standalone/fullscreen/minimal-ui),
 *   so PWA users still see the splash with no flash of content while
 *   browsers and crawlers never see it.
 * - After hydration in PWA mode: the original auth-gating logic applies.
 * - After hydration in browser mode: children render, no splash.
 *
 * The fragment structure below is intentionally stable (<>{overlay}{content}</>)
 * so React never remounts the page tree when hydration state flips.
 */
export default function PWASplashScreen({ children }: { children: React.ReactNode }) {
  const { isPWA, isClient } = usePWAMode()
  const { isLoading: authLoading, user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // State for splash screen
  const [showSplash, setShowSplash] = useState(true)
  const [minTimeElapsed, setMinTimeElapsed] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)
  const [shouldShowContent, setShouldShowContent] = useState(false)

  // Redirect to login
  const redirectToLogin = useCallback(() => {
    const locale = getLocale(pathname || '')
    const loginPath = getLoginPath(locale)
    router.replace(loginPath)
  }, [pathname, router])

  // Set minimum display time
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimeElapsed(true)
    }, MINIMUM_DISPLAY_MS)
    return () => clearTimeout(timer)
  }, [])

  // Main auth check logic
  useEffect(() => {
    // Wait for client-side and auth to load
    if (!isClient || authLoading) return

    // Mark auth as checked
    setAuthChecked(true)

    // If NOT in PWA mode, show content immediately (no PWA restrictions)
    if (!isPWA) {
      setShouldShowContent(true)
      setShowSplash(false)
      return
    }

    // PWA MODE: Check authentication
    const currentPath = pathname || '/'
    const onAuthPage = isAuthPage(currentPath)

    if (user) {
      // User is logged in - show content
      // Only show after minimum splash time
      if (minTimeElapsed) {
        setShouldShowContent(true)
        setShowSplash(false)
      }
    } else if (onAuthPage) {
      // Not logged in but on auth page - show content (login form)
      setShouldShowContent(true)
      setShowSplash(false)
    } else {
      // Not logged in and NOT on auth page - redirect to login
      // Clear any stale session flags
      if (typeof window !== 'undefined') {
        sessionStorage.clear()
      }
      redirectToLogin()
      // Keep splash showing during redirect
    }
  }, [isClient, authLoading, isPWA, user, pathname, minTimeElapsed, redirectToLogin])

  let overlay: ReactNode = null
  let showContent = true

  if (!isClient) {
    // SSR + first client paint: full content in the HTML for crawlers and
    // web users; CSS-gated splash overlay covers it only in PWA display mode.
    overlay = <SplashOverlay className="pwa-boot-splash" />
  } else if (isPWA) {
    if (!authChecked || !shouldShowContent) {
      // PWA auth gate: cover and unmount content until auth resolves
      overlay = <SplashOverlay />
      showContent = false
    } else if (showSplash) {
      // Smooth fade-out transition from splash to content
      overlay = <SplashOverlay faded />
    }
  }

  return (
    <>
      {overlay}
      {showContent ? children : null}
    </>
  )
}
