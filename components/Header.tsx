'use client'

import { useState, useEffect, memo } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { usePWAMode } from '@/hooks/usePWAMode'
import { usePathname, useRouter } from 'next/navigation'
import LoginModal from './LoginModal'
import HeaderRussianMobile, { HeaderRussianMobileMenu } from './HeaderRussianMobile'
import HeaderRussianDesktop from './HeaderRussianDesktop'
import HeaderMobileIcons from './header/HeaderMobileIcons'
import HeaderDesktopNav from './header/HeaderDesktopNav'
import HeaderDesktopIcons from './header/HeaderDesktopIcons'
import HeaderDesktopBranding from './header/HeaderDesktopBranding'
import HeaderMobileMenu from './header/HeaderMobileMenu'

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
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [isHeartBeating, setIsHeartBeating] = useState(false)

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
  
  // Check if we're on pages that have their own simple/light header in PWA mode
  const isProductDetailPage = pathname ? /\/products\/[a-zA-Z0-9_-]+$/.test(pathname) : false
  const isOnPWALightHeaderPage = pathname?.includes('/profile') || 
                                  pathname?.includes('/cart') || 
                                  pathname?.includes('/checkout') ||
                                  pathname?.includes('/orders') ||
                                  pathname?.includes('/privacy-policy') ||
                                  pathname?.includes('/terms') ||
                                  pathname?.includes('/faq') ||
                                  pathname?.includes('/contact') ||
                                  pathname?.includes('/about') ||
                                  pathname?.includes('/pwa-login') ||
                                  pathname?.includes('/success') ||
                                  pathname?.includes('/delivery') ||
                                  pathname?.includes('/brand') ||
                                  pathname?.includes('/favorites') ||
                                  pathname?.includes('/locations') ||
                                  pathname?.includes('/skin-recommendation') ||
                                  isProductDetailPage
  
  // In PWA mode, hide header completely on pages with their own light header
  const showPWAMobileHeader = isPWAClient && isPWA
  const hidePWAHeader = isPWAClient && isPWA && isOnPWALightHeaderPage

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Heartbeat animation every 16 seconds
  useEffect(() => {
    if (!isClient) return

    const startHeartbeat = () => {
      setIsHeartBeating(true)
      setTimeout(() => setIsHeartBeating(false), 600)
    }

    startHeartbeat()
    const interval = setInterval(startHeartbeat, 16000)

    return () => clearInterval(interval)
  }, [isClient])

  // Hide header completely on PWA pages with their own light header
  if (hidePWAHeader) {
    return null
  }
  
  return (
    <header 
      className={`main-header sticky top-0 z-50 bg-white shadow-sm border-b ${showPWAMobileHeader ? 'hidden md:block' : ''}`} 
      suppressHydrationWarning
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-2 md:py-4 header-main-flex">
          
          {/* Mobile Header - Russian (separate component) */}
          {isRussian && !showPWAMobileHeader && (
            <HeaderRussianMobile 
              showMobileMenu={showMobileMenu}
              setShowMobileMenu={setShowMobileMenu}
            />
          )}
          
          {/* Mobile Header - English & Arabic (shared component) */}
          {!isRussian && !showPWAMobileHeader && (
            <HeaderMobileIcons
              isRTL={isRTL}
              isClient={isClient}
              isPWA={isPWA}
              showMobileMenu={showMobileMenu}
              setShowMobileMenu={setShowMobileMenu}
              handleLoginClick={handleLoginClick}
            />
          )}
          
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

      {/* Mobile Navigation Menu - Russian (separate component) */}
      {isRussian && (
        <HeaderRussianMobileMenu 
          showMobileMenu={showMobileMenu}
          setShowMobileMenu={setShowMobileMenu}
        />
      )}

      {/* Mobile Navigation Menu - English & Arabic */}
      {!isRussian && (
        <HeaderMobileMenu
          showMobileMenu={showMobileMenu}
          setShowMobileMenu={setShowMobileMenu}
          isClient={isClient}
        />
      )}

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
