'use client'

import { useState, useEffect, useRef, memo } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { usePWAMode } from '@/hooks/usePWAMode'
import { usePathname, useRouter } from 'next/navigation'
import { isSimpleHeaderPage } from '@/lib/simpleHeaderPages'
import LoginModal from '@/components/LoginModal'
import HeaderRussianDesktop from './HeaderRussianDesktop'
import HeaderDesktopNav from './HeaderDesktopNav'
import HeaderDesktopIcons from './HeaderDesktopIcons'
import HeaderDesktopBranding from './HeaderDesktopBranding'

/**
 * Main Header Component
 * 
 * Refactored to use modular sub-components for better maintainability.
 * Supports English (LTR), Arabic (RTL), and Russian (separate components) layouts.
 */
const Header = memo(function Header() {
  const { locale } = useTranslation()
  const { isPWA, isClient: isPWAClient } = usePWAMode()
  const pathname = usePathname()
  const router = useRouter()
  
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [isClient, setIsClient] = useState(false)
  const [isHeartBeating, setIsHeartBeating] = useState(false)
  const heartbeatTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Determine layout direction
  const isRTL = locale === 'ar'
  const isRussian = locale === 'ru'

  // Handle login click - redirect to PWA login page if in PWA mode
  const handleLoginClick = () => {
    if (isPWA) {
      const loginPath = locale === 'en' ? '/pwa-login' : `/${locale}/pwa-login`
      router.push(loginPath)
    } else {
      setShowLoginModal(true)
    }
  }
  
  // Shared "simple header page" helper - see lib/simpleHeaderPages.ts.
  // Previously this component, MobileWebHeader, and PWAHeader each had
  // their own hardcoded list that had drifted out of sync.
  const isOnSimpleHeaderPage = isSimpleHeaderPage(pathname)
  
  // In PWA mode, hide header completely on pages with their own light header
  const hidePWAHeader = isPWAClient && isPWA && isOnSimpleHeaderPage

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Heartbeat animation every 16 seconds
  useEffect(() => {
    if (!isClient) return

    const startHeartbeat = () => {
      setIsHeartBeating(true)
      heartbeatTimerRef.current = setTimeout(() => setIsHeartBeating(false), 600)
    }

    startHeartbeat()
    const interval = setInterval(startHeartbeat, 16000)

    return () => {
      clearInterval(interval)
      if (heartbeatTimerRef.current) clearTimeout(heartbeatTimerRef.current)
    }
  }, [isClient])

  // Hide header completely on PWA pages with their own light header
  if (hidePWAHeader) {
    return null
  }
  
  return (
    <header 
      className="main-header sticky top-0 z-50 bg-[var(--cera-cream)] border-b border-[var(--cera-line)] hidden md:block"
      suppressHydrationWarning
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-2 md:py-4 header-main-flex">
          {/* Desktop Header - Russian (separate component) */}
          {isRussian && <HeaderRussianDesktop />}
          
          {/* Desktop Header - English & Arabic */}
          {!isRussian && (
            <>
              {/* Branding - appears first in LTR, last in RTL */}
              {!isRTL && <HeaderDesktopBranding isRTL={isRTL} isHeartBeating={isHeartBeating} />}
              
              {/* Desktop Icons - appears first in RTL */}
              {isRTL && (
                <HeaderDesktopIcons
                  isRTL={isRTL}
                  isClient={isClient}
                  handleLoginClick={handleLoginClick}
                />
              )}
              
              {/* Navigation */}
              <HeaderDesktopNav isRTL={isRTL} isClient={isClient} />
              
              {/* Desktop Icons - appears last in LTR */}
              {!isRTL && (
                <HeaderDesktopIcons
                  isRTL={isRTL}
                  isClient={isClient}
                  handleLoginClick={handleLoginClick}
                />
              )}
              
              {/* Branding - appears last in RTL */}
              {isRTL && <HeaderDesktopBranding isRTL={isRTL} isHeartBeating={isHeartBeating} />}
            </>
          )}
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal 
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          isLoginMode={isLoginMode}
          setIsLoginMode={setIsLoginMode}
        />
      )}
    </header>
  )
})

export default Header
