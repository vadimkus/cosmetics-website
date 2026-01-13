'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/cartStore'
import { getLocalizedPath, getLocaleFromPath } from '@/lib/i18n'
import { useTranslation } from '@/hooks/useTranslation'
import { usePWAMode } from '@/hooks/usePWAMode'
import { useMemo, useState, useEffect, useRef, useCallback } from 'react'

/**
 * Mobile Web Footer Navigation - Mobile Browser Only (Not PWA)
 * 
 * Features:
 * - Fixed sticky footer with Home, Orders, Bag tabs
 * - Fixed height (70px) - no dynamic changes
 * 
 * Matches the native mobile app design
 */

// Custom SVG Icons
const HomeIcon = ({ filled, className }: { filled?: boolean; className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    className={className}
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor" 
    strokeWidth={filled ? 0 : 1.5}
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    {filled ? (
      <path d="M3 9.5L12 2l9 7.5V20a2 2 0 01-2 2H5a2 2 0 01-2-2V9.5z"/>
    ) : (
      <>
        <path d="M3 9.5L12 2l9 7.5V20a2 2 0 01-2 2H5a2 2 0 01-2-2V9.5z"/>
        <path d="M9 22V12h6v10"/>
      </>
    )}
  </svg>
)

const ListIcon = ({ filled, className }: { filled?: boolean; className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    className={className}
    fill="none"
    stroke="currentColor" 
    strokeWidth={filled ? 2.5 : 1.5}
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <line x1="8" y1="6" x2="21" y2="6"/>
    <line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/>
    <line x1="3" y1="12" x2="3.01" y2="12"/>
    <line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
)

const BagIcon = ({ filled, className }: { filled?: boolean; className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    className={className}
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor" 
    strokeWidth={filled ? 0 : 1.5}
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    {filled ? (
      <>
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6z"/>
        <path d="M3 6h18" stroke="white" strokeWidth="1.5"/>
        <path d="M16 10a4 4 0 01-8 0" stroke="white" strokeWidth="1.5" fill="none"/>
      </>
    ) : (
      <>
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </>
    )}
  </svg>
)

// Detect mobile device
function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false
  const userAgent = navigator.userAgent || ''
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
  return mobileRegex.test(userAgent) || window.innerWidth <= 768
}

export default function MobileWebFooterNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { getTotalItems } = useCartStore()
  const { t, dir } = useTranslation()
  const { isPWA, isClient } = usePWAMode()
  const [isReady, setIsReady] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const lastClickTime = useRef(0)
  
  // Check if mobile device
  useEffect(() => {
    setIsMobile(isMobileDevice())
    
    const handleResize = () => {
      setIsMobile(isMobileDevice())
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  // Mark component as ready after hydration
  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 100)
    return () => clearTimeout(timer)
  }, [])
  
  // Reset navigation state on route change
  useEffect(() => {
    setIsNavigating(false)
  }, [pathname])
  
  // Get locale from pathname
  const locale = useMemo(() => getLocaleFromPath(pathname || '/'), [pathname])
  
  // Navigation handler with debounce
  const handleNavigation = useCallback((path: string) => {
    const now = Date.now()
    if (now - lastClickTime.current < 300 || isNavigating || !isReady) return
    lastClickTime.current = now
    setIsNavigating(true)
    router.push(path)
  }, [router, isNavigating, isReady])
  
  // Check if we're on specific pages where footer should be hidden
  const shouldHideFooter = useMemo(() => {
    if (!pathname) return false
    // Hide on product detail pages, checkout, PDF viewer
    const productDetailPattern = /\/products\/[a-zA-Z0-9_-]+$/
    return productDetailPattern.test(pathname) || 
           pathname.includes('/checkout') ||
           pathname.includes('/pdf-viewer') ||
           pathname.includes('/pwa-login')
  }, [pathname])

  // Determine active tab
  const activeTab = useMemo(() => {
    if (!pathname) return 'home'
    const path = pathname.toLowerCase()
    
    if (path.includes('/cart') || path.includes('/checkout')) return 'bag'
    if (path.includes('/orders')) return 'orders'
    if (path.includes('/products') || path === '/' || path === '/en' || path === '/ar' || path === '/ru') return 'home'
    
    return 'home'
  }, [pathname])
  
  const cartCount = isClient ? getTotalItems() : 0
  const hasItemsInCart = cartCount > 0
  
  // Only render on mobile web (not PWA, not desktop)
  if (!isClient || isPWA || !isMobile || shouldHideFooter) {
    return null
  }
  
  // Colors matching mobile app
  const activeColor = 'text-[#dc2626]' // red
  const inactiveColor = 'text-[#8E8E93]' // gray
  const greenColor = 'text-[#10b981]' // green when items exist
  
  // Fixed footer height - NEVER changes
  const footerHeight = 70
  
  return (
    <>
      {/* Spacer to prevent content from being hidden behind fixed footer */}
      <div 
        className="md:hidden" 
        style={{ height: `${footerHeight + 44}px` }} // 70px footer + 44px safe area buffer
        aria-hidden="true" 
      />
      
      {/* Mobile Web Footer Navigation - Fixed height, solid background for Chrome compatibility */}
      <nav 
        className="fixed bottom-0 left-0 right-0 z-[9999] bg-white md:hidden"
        style={{ 
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          borderTop: '1px solid #e5e7eb',
          boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.08)',
          height: `${footerHeight}px`,
          // Chrome fix: force GPU layer and proper stacking
          transform: 'translate3d(0, 0, 0)',
          WebkitTransform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          isolation: 'isolate'
        }}
        dir={dir}
        role="navigation"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-around h-full px-2">
          {/* Home Tab */}
          <button
            type="button"
            onClick={() => handleNavigation(getLocalizedPath('/products', locale))}
            disabled={!isReady || isNavigating}
            className={`flex flex-col items-center justify-center flex-1 h-full px-2 select-none active:scale-95 ${
              activeTab === 'home' ? activeColor : inactiveColor
            } ${isNavigating ? 'opacity-70' : ''}`}
            style={{ 
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'manipulation'
            }}
            aria-current={activeTab === 'home' ? 'page' : undefined}
          >
            <HomeIcon 
              filled={activeTab === 'home'} 
              className="w-7 h-7"
            />
            <span className="text-xs mt-1 font-medium">
              {t('tabs.home') || 'Home'}
            </span>
          </button>

          {/* Orders Tab */}
          <button
            type="button"
            onClick={() => handleNavigation(getLocalizedPath('/orders', locale))}
            disabled={!isReady || isNavigating}
            className={`flex flex-col items-center justify-center flex-1 h-full px-2 select-none active:scale-95 ${
              activeTab === 'orders' ? activeColor : inactiveColor
            } ${isNavigating ? 'opacity-70' : ''}`}
            style={{ 
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'manipulation'
            }}
            aria-current={activeTab === 'orders' ? 'page' : undefined}
          >
            <ListIcon 
              filled={activeTab === 'orders'} 
              className="w-7 h-7"
            />
            <span className="text-xs mt-1 font-medium">
              {t('tabs.orders') || 'Orders'}
            </span>
          </button>

          {/* Bag Tab */}
          <button
            type="button"
            onClick={() => handleNavigation(getLocalizedPath('/cart', locale))}
            disabled={!isReady || isNavigating}
            className={`flex flex-col items-center justify-center flex-1 h-full px-2 select-none active:scale-95 ${
              hasItemsInCart 
                ? greenColor 
                : activeTab === 'bag' 
                  ? activeColor 
                  : inactiveColor
            } ${isNavigating ? 'opacity-70' : ''}`}
            style={{ 
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'manipulation'
            }}
            aria-current={activeTab === 'bag' ? 'page' : undefined}
          >
            <div className="relative">
              <BagIcon 
                filled={activeTab === 'bag' || hasItemsInCart} 
                className="w-7 h-7"
              />
              {/* Badge for cart count */}
              {hasItemsInCart && (
                <span 
                  className="absolute -top-1.5 -right-2.5 bg-[#dc2626] text-white text-[10px] font-semibold rounded-full min-w-[18px] h-[18px] flex items-center justify-center border-2 border-white"
                  aria-label={`${cartCount} items in cart`}
                >
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </div>
            <span className="text-xs mt-1 font-medium">
              {t('tabs.bag') || 'Bag'}
            </span>
          </button>
        </div>
      </nav>
    </>
  )
}
