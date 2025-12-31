'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useCartStore } from '@/lib/cartStore'
import { getLocalizedPath, getLocaleFromPath } from '@/lib/i18n'
import { useTranslation } from '@/hooks/useTranslation'
import { usePWAMode } from '@/hooks/usePWAMode'
import { useMemo } from 'react'

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
  const { getTotalItems } = useCartStore()
  const { t, dir } = useTranslation()
  const { isPWA, isClient } = usePWAMode()
  
  // Get locale from pathname
  const locale = useMemo(() => getLocaleFromPath(pathname || '/'), [pathname])
  
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
  
  // Only render in PWA mode on mobile
  if (!isClient || !isPWA) {
    return null
  }
  
  // Colors matching mobile app
  const activeColor = 'text-[#dc2626]' // red
  const inactiveColor = 'text-[#8E8E93]' // gray
  const greenColor = 'text-[#10b981]' // green when items exist
  
  return (
    <>
      {/* Spacer to prevent content from being hidden behind fixed footer */}
      <div className="h-[88px] md:hidden" aria-hidden="true" />
      
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
        <div className="flex items-center justify-around h-[56px] pt-2">
          {/* Home Tab */}
          <Link
            href={getLocalizedPath('/products', locale)}
            className={`flex flex-col items-center justify-center flex-1 h-full px-2 transition-colors touch-manipulation ${
              activeTab === 'home' ? activeColor : inactiveColor
            }`}
            aria-current={activeTab === 'home' ? 'page' : undefined}
          >
            <HomeIcon 
              filled={activeTab === 'home'} 
              className="w-6 h-6"
            />
            <span className={`text-[10px] mt-1 font-medium`}>
              {t('tabs.home') || 'Home'}
            </span>
          </Link>

          {/* Orders Tab */}
          <Link
            href={getLocalizedPath('/orders', locale)}
            className={`flex flex-col items-center justify-center flex-1 h-full px-2 transition-colors touch-manipulation ${
              activeTab === 'orders' ? activeColor : inactiveColor
            }`}
            aria-current={activeTab === 'orders' ? 'page' : undefined}
          >
            <ListIcon 
              filled={activeTab === 'orders'} 
              className="w-6 h-6"
            />
            <span className={`text-[10px] mt-1 font-medium`}>
              {t('tabs.orders') || 'Orders'}
            </span>
          </Link>

          {/* Bag Tab */}
          <Link
            href={getLocalizedPath('/cart', locale)}
            className={`flex flex-col items-center justify-center flex-1 h-full px-2 transition-colors touch-manipulation ${
              hasItemsInCart 
                ? greenColor 
                : activeTab === 'bag' 
                  ? activeColor 
                  : inactiveColor
            }`}
            aria-current={activeTab === 'bag' ? 'page' : undefined}
          >
            <div className="relative">
              <BagIcon 
                filled={activeTab === 'bag' || hasItemsInCart} 
                className="w-6 h-6"
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
            <span className={`text-[10px] mt-1 font-medium`}>
              {t('tabs.bag') || 'Bag'}
            </span>
          </Link>
        </div>
      </nav>
    </>
  )
}
