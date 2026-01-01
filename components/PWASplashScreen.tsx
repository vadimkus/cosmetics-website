'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import { usePWAMode } from '@/hooks/usePWAMode'
import { useAuth } from './AuthProvider'

const COMPANY_NAME = 'Genosys Middle East FZ-LLC'
const MINIMUM_DISPLAY_MS = 800 // Minimum time to show splash screen

/**
 * PWA Splash Screen - Shows branded loading screen when PWA starts
 * 
 * Only displays in PWA/standalone mode on initial load.
 * Shows while auth and initial data loads in background.
 * Redirects ALL unauthenticated users to PWA login page (PWA requires login).
 * Matches mobile app design exactly.
 */
export default function PWASplashScreen({ children }: { children: React.ReactNode }) {
  const { isPWA, isClient } = usePWAMode()
  const { isLoading: authLoading, user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [showSplash, setShowSplash] = useState(true)
  const [hasShownSplash, setHasShownSplash] = useState(false)
  const [minTimeElapsed, setMinTimeElapsed] = useState(false)
  
  // Track if auth check has been done this render cycle
  const authCheckDone = useRef(false)

  // Track if we've already shown splash in this session
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const alreadyShown = sessionStorage.getItem('pwa_splash_shown')
      if (alreadyShown === 'true') {
        setHasShownSplash(true)
        setShowSplash(false)
      }
    }
  }, [])

  // Set minimum display time
  useEffect(() => {
    if (!isPWA || hasShownSplash) return

    const timer = setTimeout(() => {
      setMinTimeElapsed(true)
    }, MINIMUM_DISPLAY_MS)

    return () => clearTimeout(timer)
  }, [isPWA, hasShownSplash])

  // Hide splash when both min time has passed AND auth is loaded
  // Redirect to PWA login if not authenticated (PWA requires login to use)
  useEffect(() => {
    if (!isPWA || hasShownSplash) return undefined

    if (minTimeElapsed && !authLoading) {
      const normalizedPath = pathname?.replace(/^\/(ar|ru)/, '') || '/'
      
      // Don't redirect if already on login page or public auth pages
      const isAuthPage = normalizedPath.includes('/pwa-login') || 
                         normalizedPath.includes('/login') ||
                         normalizedPath.includes('/signup') ||
                         normalizedPath.includes('/forgot-password')
      
      // PWA requires login - redirect all unauthenticated users to login
      if (!user && !isAuthPage) {
        // Redirect to PWA login
        const locale = pathname?.startsWith('/ar') ? 'ar' : pathname?.startsWith('/ru') ? 'ru' : 'en'
        const loginPath = locale === 'en' ? '/pwa-login' : `/${locale}/pwa-login`
        router.replace(loginPath)
        
        // Still hide splash after redirect
        setShowSplash(false)
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('pwa_splash_shown', 'true')
        }
        return undefined
      }

      // Small delay for smooth transition
      const hideTimer = setTimeout(() => {
        setShowSplash(false)
        // Mark as shown for this session
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('pwa_splash_shown', 'true')
        }
      }, 100)

      return () => clearTimeout(hideTimer)
    }
    
    return undefined
  }, [isPWA, hasShownSplash, minTimeElapsed, authLoading, user, pathname, router])

  // CRITICAL FIX: Aggressive auth check that runs EVERY time auth state changes
  // This handles iOS PWA where sessionStorage persists across app restarts
  // even after logout clears it (iOS suspends/resumes PWA without clearing sessionStorage)
  useEffect(() => {
    // Skip if not in PWA mode or if auth is still loading
    if (!isPWA || !isClient || authLoading) return
    
    // Skip if user is authenticated
    if (user) {
      authCheckDone.current = true
      return
    }
    
    // User is NOT authenticated - check if we need to redirect
    const normalizedPath = pathname?.replace(/^\/(ar|ru)/, '') || '/'
    
    // Don't redirect if already on auth pages
    const isAuthPage = normalizedPath.includes('/pwa-login') || 
                       normalizedPath.includes('/login') ||
                       normalizedPath.includes('/signup') ||
                       normalizedPath.includes('/forgot-password')
    
    if (!isAuthPage) {
      // Not authenticated and not on auth page - redirect to login
      const locale = pathname?.startsWith('/ar') ? 'ar' : pathname?.startsWith('/ru') ? 'ru' : 'en'
      const loginPath = locale === 'en' ? '/pwa-login' : `/${locale}/pwa-login`
      
      // Use a small timeout to avoid React state update issues
      setTimeout(() => {
        router.replace(loginPath)
      }, 50)
    }
    
    authCheckDone.current = true
  }, [isPWA, isClient, authLoading, user, pathname, router])

  // Don't show splash for non-PWA or if already shown this session
  if (!isClient || !isPWA || hasShownSplash || !showSplash) {
    return <>{children}</>
  }

  return (
    <>
      {/* Splash Screen Overlay */}
      <div 
        className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white transition-opacity duration-300 ${
          !showSplash ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
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

      {/* Children render in background but are hidden */}
      <div className={showSplash ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}>
        {children}
      </div>
    </>
  )
}

