'use client'

import { usePathname, useRouter } from 'next/navigation'
import { getLocalizedPath, getLocaleFromPath } from '@/lib/i18n'
import { useTranslation } from '@/hooks/useTranslation'
import { usePWAMode } from '@/hooks/usePWAMode'
import { useMemo, useState, useEffect, useRef, useCallback } from 'react'
import { useHapticFeedback } from '@/hooks/useHapticFeedback'
import {
  HomeIcon,
  ListIcon,
  BagIcon,
  useCartCount,
  useHideBottomNav,
  getActiveTab,
} from './mobileBottomNavShared'

/**
 * Mobile Footer Navigation - PWA Only
 *
 * Matches the native mobile app design with 3 tabs (Home / Orders / Bag).
 * Icons, cart subscription, hide logic, and colors all come from
 * ./mobileBottomNavShared.tsx so this component stays ~100 LOC.
 *
 * Colors:
 * - Active: #dc2626 (red)
 * - Inactive: #8E8E93 (gray)
 * - Green highlight when cart has items: #10b981
 */
export default function MobileFooterNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { t, dir } = useTranslation()
  const { isPWA, isClient } = usePWAMode()
  const haptic = useHapticFeedback()
  const [isReady, setIsReady] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)
  const cartCount = useCartCount()
  const lastClickTime = useRef(0)

  // Mark component as ready after hydration
  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Reset navigation state on route change
  useEffect(() => {
    setIsNavigating(false)
  }, [pathname])

  const locale = useMemo(() => getLocaleFromPath(pathname || '/'), [pathname])

  // Navigation handler with debounce and haptic feedback
  const handleNavigation = useCallback((path: string) => {
    const now = Date.now()
    if (now - lastClickTime.current < 300 || isNavigating || !isReady) return
    lastClickTime.current = now
    haptic.light() // Haptic feedback on navigation tap
    setIsNavigating(true)
    router.push(path)
  }, [router, isNavigating, isReady, haptic])

  // Route-based hide logic (PDP, pwa-login, pdf-viewer, concern pages)
  const shouldHide = useHideBottomNav(pathname, { variant: 'pwa' })

  // Track fullscreen modal state (e.g. camera in skin-recommendation)
  const [isFullscreenModalOpen, setIsFullscreenModalOpen] = useState(false)
  useEffect(() => {
    const checkModal = () => {
      setIsFullscreenModalOpen(document.body.classList.contains('fullscreen-modal-open'))
    }
    checkModal()
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') checkModal()
      })
    })
    observer.observe(document.body, { attributes: true })
    return () => observer.disconnect()
  }, [])

  const activeTab = getActiveTab(pathname)
  const hasItemsInCart = cartCount > 0

  if (!isClient || !isPWA || shouldHide || isFullscreenModalOpen) {
    return null
  }

  const activeColor = 'text-[#191716]' // --cera-ink
  const inactiveColor = 'text-[#665e59]' // --cera-muted
  
  return (
    <>
      {/* Spacer to prevent content from being hidden behind fixed footer */}
      <div className="h-[117px] md:hidden" aria-hidden="true" />
      
      {/* Mobile Footer Navigation - PWA Only */}
      <nav 
        className="fixed bottom-0 left-0 right-0 z-50 bg-[#faf7f5]/95 backdrop-blur-sm md:hidden"
        style={{ 
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          borderTop: '1px solid #e8e0db'
        }}
        dir={dir}
        role="navigation"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-around h-[75px] pt-2">
          {/* Home Tab - min-height ensures 44pt touch target (Apple HIG) */}
          <button
            type="button"
            onClick={() => handleNavigation(getLocalizedPath('/products', locale))}
            disabled={!isReady || isNavigating}
            className={`relative flex flex-col items-center justify-center flex-1 h-full min-h-[44px] px-2 transition-colors select-none active:scale-95 touch-target-exempt ${
              activeTab === 'home' ? activeColor : inactiveColor
            } ${isNavigating ? 'opacity-70' : ''}`}
            style={{ 
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'manipulation'
            }}
            aria-current={activeTab === 'home' ? 'page' : undefined}
          >
            {activeTab === 'home' && (
              <span aria-hidden="true" className="absolute top-0 h-[2px] w-[26px] rounded-full bg-[#191716]" />
            )}
            <HomeIcon 
              filled={activeTab === 'home'} 
              className="w-8 h-8"
            />
            <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.1em]">
              {t('tabs.home') || 'Home'}
            </span>
          </button>

          {/* Orders Tab - min-height ensures 44pt touch target (Apple HIG) */}
          <button
            type="button"
            onClick={() => handleNavigation(getLocalizedPath('/orders', locale))}
            disabled={!isReady || isNavigating}
            className={`relative flex flex-col items-center justify-center flex-1 h-full min-h-[44px] px-2 transition-colors select-none active:scale-95 touch-target-exempt ${
              activeTab === 'orders' ? activeColor : inactiveColor
            } ${isNavigating ? 'opacity-70' : ''}`}
            style={{ 
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'manipulation'
            }}
            aria-current={activeTab === 'orders' ? 'page' : undefined}
          >
            {activeTab === 'orders' && (
              <span aria-hidden="true" className="absolute top-0 h-[2px] w-[26px] rounded-full bg-[#191716]" />
            )}
            <ListIcon 
              filled={activeTab === 'orders'} 
              className="w-8 h-8"
            />
            <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.1em]">
              {t('tabs.orders') || 'Orders'}
            </span>
          </button>

          {/* Bag Tab - min-height ensures 44pt touch target (Apple HIG) */}
          <button
            type="button"
            onClick={() => handleNavigation(getLocalizedPath('/cart', locale))}
            disabled={!isReady || isNavigating}
            className={`relative flex flex-col items-center justify-center flex-1 h-full min-h-[44px] px-2 transition-colors select-none active:scale-95 touch-target-exempt ${
              activeTab === 'bag' ? activeColor : inactiveColor
            } ${isNavigating ? 'opacity-70' : ''}`}
            style={{ 
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'manipulation'
            }}
            aria-current={activeTab === 'bag' ? 'page' : undefined}
          >
            {activeTab === 'bag' && (
              <span aria-hidden="true" className="absolute top-0 h-[2px] w-[26px] rounded-full bg-[#191716]" />
            )}
            <div className="relative">
              <BagIcon 
                filled={activeTab === 'bag'} 
                className="w-8 h-8"
              />
              {/* Badge for cart count */}
              {hasItemsInCart && (
                <span 
                  className="absolute -top-1.5 -right-2.5 bg-[var(--cera-rose-ink)] text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center border-2 border-[#faf7f5]"
                  aria-label={`${cartCount} items in cart`}
                >
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </div>
            <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.1em]">
              {t('tabs.bag') || 'Bag'}
            </span>
          </button>
        </div>
      </nav>
    </>
  )
}
