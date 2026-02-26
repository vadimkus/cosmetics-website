'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/cartStore'
import { getLocalizedPath, getLocaleFromPath } from '@/lib/i18n'
import { useTranslation } from '@/hooks/useTranslation'
import { usePWAMode } from '@/hooks/usePWAMode'
import { useMemo, useState, useEffect, useRef, useCallback } from 'react'
import { useHapticFeedback } from '@/hooks/useHapticFeedback'

/**
 * Mobile Footer Navigation - PWA Only
 * 
 * Matches the native mobile app design with:
 * - Home (house icon)
 * - Orders (list icon)
 * - Bag (shopping bag icon)
 * 
 * Colors:
 * - Active: #dc2626 (red)
 * - Inactive: #8E8E93 (gray)
 * - Green highlight when cart/orders have items: #10b981
 */

// Custom SVG Icons matching Ionicons from mobile app
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
      // Filled home icon
      <path d="M3 9.5L12 2l9 7.5V20a2 2 0 01-2 2H5a2 2 0 01-2-2V9.5z"/>
    ) : (
      // Outline home icon
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
      // Filled bag icon
      <>
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6z"/>
        <path d="M3 6h18" stroke="white" strokeWidth="1.5"/>
        <path d="M16 10a4 4 0 01-8 0" stroke="white" strokeWidth="1.5" fill="none"/>
      </>
    ) : (
      // Outline bag icon
      <>
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </>
    )}
  </svg>
)

export default function MobileFooterNav() {
  const pathname = usePathname()
  const router = useRouter()
  // Using useCartStore.getState() directly for cart count subscription
  const { t, dir } = useTranslation()
  const { isPWA, isClient } = usePWAMode()
  const haptic = useHapticFeedback()
  const [isReady, setIsReady] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)
  const [cartCount, setCartCount] = useState(0) // Track cart count with state for reactivity
  const lastClickTime = useRef(0)
  
  // Mark component as ready after hydration
  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 100)
    return () => clearTimeout(timer)
  }, [])
  
  // Subscribe to cart store changes to update badge count reactively
  useEffect(() => {
    // Function to update cart count
    const updateCount = () => {
      const state = useCartStore.getState()
      const newCount = state.items.reduce((total, item) => total + item.quantity, 0)
      setCartCount(newCount)
    }
    
    // Initial count (may be 0 if not hydrated yet)
    updateCount()
    
    // Subscribe to store changes (handles both hydration and updates)
    const unsubscribe = useCartStore.subscribe(updateCount)
    
    // Also check after a short delay for hydration
    const timer = setTimeout(updateCount, 100)
    
    return () => {
      unsubscribe()
      clearTimeout(timer)
    }
  }, [])
  
  // Reset navigation state on route change
  useEffect(() => {
    setIsNavigating(false)
  }, [pathname])
  
  // Get locale from pathname
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
  
  // Check if we're on a product detail page (has /products/ followed by an ID)
  const isProductDetailPage = useMemo(() => {
    if (!pathname) return false
    // Match /products/[id] or /[locale]/products/[id] but NOT just /products
    const productDetailPattern = /\/products\/[a-zA-Z0-9_-]+$/
    return productDetailPattern.test(pathname)
  }, [pathname])
  
  // Check if we're on the PWA login page
  const isLoginPage = useMemo(() => {
    if (!pathname) return false
    return pathname.includes('/pwa-login')
  }, [pathname])
  
  // Check if we're on the PDF viewer page (should hide footer for fullscreen viewing)
  const isPDFViewerPage = useMemo(() => {
    if (!pathname) return false
    return pathname.includes('/pdf-viewer')
  }, [pathname])

  // Check if a fullscreen modal is open (e.g., camera)
  const [isFullscreenModalOpen, setIsFullscreenModalOpen] = useState(false)
  
  useEffect(() => {
    // Check if fullscreen modal class is on body
    const checkModal = () => {
      setIsFullscreenModalOpen(document.body.classList.contains('fullscreen-modal-open'))
    }
    
    // Initial check
    checkModal()
    
    // Use MutationObserver to watch for class changes on body
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          checkModal()
        }
      })
    })
    
    observer.observe(document.body, { attributes: true })
    
    return () => observer.disconnect()
  }, [])

  // Determine active tab
  const activeTab = useMemo(() => {
    if (!pathname) return 'home'
    const path = pathname.toLowerCase()
    
    if (path.includes('/cart') || path.includes('/checkout')) return 'bag'
    if (path.includes('/orders')) return 'orders'
    if (path.includes('/products') || path === '/' || path === '/en' || path === '/ar' || path === '/ru') return 'home'
    
    return 'home'
  }, [pathname])
  
  // cartCount is now managed by useState with subscription above
  const hasItemsInCart = cartCount > 0
  
  const isConcernPage = useMemo(() => {
    if (!pathname) return false
    return pathname.includes('/products/concern/')
  }, [pathname])

  if (!isClient || !isPWA || isProductDetailPage || isLoginPage || isPDFViewerPage || isFullscreenModalOpen || isConcernPage) {
    return null
  }
  
  // Colors matching mobile app
  const activeColor = 'text-[#dc2626]' // red
  const inactiveColor = 'text-[#8E8E93]' // gray
  const greenColor = 'text-[#10b981]' // green when items exist
  
  return (
    <>
      {/* Spacer to prevent content from being hidden behind fixed footer */}
      <div className="h-[117px] md:hidden" aria-hidden="true" />
      
      {/* Mobile Footer Navigation - PWA Only */}
      <nav 
        className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm md:hidden"
        style={{ 
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          borderTop: '0.5px solid rgba(0, 0, 0, 0.1)',
          boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1)'
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
            className={`flex flex-col items-center justify-center flex-1 h-full min-h-[44px] px-2 transition-colors select-none active:scale-95 touch-target-exempt ${
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
              className="w-8 h-8"
            />
            <span className={`text-xs mt-1 font-medium`}>
              {t('tabs.home') || 'Home'}
            </span>
          </button>

          {/* Orders Tab - min-height ensures 44pt touch target (Apple HIG) */}
          <button
            type="button"
            onClick={() => handleNavigation(getLocalizedPath('/orders', locale))}
            disabled={!isReady || isNavigating}
            className={`flex flex-col items-center justify-center flex-1 h-full min-h-[44px] px-2 transition-colors select-none active:scale-95 touch-target-exempt ${
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
              className="w-8 h-8"
            />
            <span className={`text-xs mt-1 font-medium`}>
              {t('tabs.orders') || 'Orders'}
            </span>
          </button>

          {/* Bag Tab - min-height ensures 44pt touch target (Apple HIG) */}
          <button
            type="button"
            onClick={() => handleNavigation(getLocalizedPath('/cart', locale))}
            disabled={!isReady || isNavigating}
            className={`flex flex-col items-center justify-center flex-1 h-full min-h-[44px] px-2 transition-colors select-none active:scale-95 touch-target-exempt ${
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
                className="w-8 h-8"
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
            <span className={`text-xs mt-1 font-medium`}>
              {t('tabs.bag') || 'Bag'}
            </span>
          </button>
        </div>
      </nav>
    </>
  )
}
