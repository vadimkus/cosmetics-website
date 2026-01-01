'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import { usePWAMode } from '@/hooks/usePWAMode'
import { useAuth } from './AuthProvider'

const COMPANY_NAME = 'Genosys Middle East FZ-LLC'
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

/**
 * PWA Splash Screen - Shows branded loading screen when PWA starts
 * 
 * CRITICAL: This component BLOCKS rendering until auth is verified.
 * In PWA mode, users MUST be logged in to see any content.
 * Unauthenticated users are redirected to /pwa-login.
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

  // For non-client (SSR), return minimal loading state
  if (!isClient) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-red-600 rounded-full animate-spin" />
      </div>
    )
  }

  // Non-PWA mode: just render children
  if (!isPWA) {
    return <>{children}</>
  }

  // PWA mode: show splash until auth is checked and content should be shown
  if (!authChecked || !shouldShowContent) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
        <div className="flex flex-col items-center px-6">
          {/* Logo */}
          <Image
            src="/Logo/Full.png"
            alt="Genosys"
            width={260}
            height={90}
            priority
            className="w-[260px] h-auto"
          />
          
          {/* Company Name */}
          <p className="mt-5 text-lg font-semibold text-red-600 text-center">
            {COMPANY_NAME}
          </p>
          
          {/* Loading indicator */}
          <div className="mt-8">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-red-600 rounded-full animate-spin" />
          </div>
        </div>
      </div>
    )
  }

  // Smooth transition from splash to content
  return (
    <>
      {/* Splash overlay that fades out */}
      {showSplash && (
        <div 
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white transition-opacity duration-300 opacity-0 pointer-events-none"
        >
          <div className="flex flex-col items-center px-6">
            <Image
              src="/Logo/Full.png"
              alt="Genosys"
              width={260}
              height={90}
              priority
              className="w-[260px] h-auto"
            />
            <p className="mt-5 text-lg font-semibold text-red-600 text-center">
              {COMPANY_NAME}
            </p>
          </div>
        </div>
      )}
      
      {/* Main content */}
      {children}
    </>
  )
}
