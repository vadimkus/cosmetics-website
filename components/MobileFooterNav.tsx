'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Home, Package, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/lib/cartStore'
import { getLocalizedPath, getLocaleFromPath } from '@/lib/i18n'
import { useTranslation } from '@/hooks/useTranslation'
import { usePWAMode } from '@/hooks/usePWAMode'
import { useMemo } from 'react'

/**
 * Mobile Footer Navigation - PWA Only
 * 
 * This sticky footer navigation appears only when the app is running
 * in PWA/standalone mode (installed on device). It does NOT appear
 * when accessing the website from a mobile browser.
 * 
 * Features:
 * - 3 tabs: Home (Products), Orders, Bag (Cart)
 * - Cart icon turns GREEN when items in cart
 * - Cart badge with item count
 * - Active state highlighting
 * - RTL support for Arabic
 * - Safe area insets for iPhone notch
 */
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
    if (path.includes('/profile') || path.includes('/orders')) return 'orders'
    if (path.includes('/products') || path === '/' || path === '/en' || path === '/ar' || path === '/ru') return 'home'
    
    return 'home'
  }, [pathname])
  
  const cartCount = isClient ? getTotalItems() : 0
  const hasItemsInCart = cartCount > 0
  
  // Only render in PWA mode on mobile
  if (!isClient || !isPWA) {
    return null
  }
  
  const navItems = [
    {
      key: 'home',
      href: getLocalizedPath('/products', locale),
      icon: Home,
      label: t('navigation.products') || 'Products',
    },
    {
      key: 'orders',
      href: getLocalizedPath('/orders', locale),
      icon: Package,
      label: t('navigation.orders') || 'Orders',
    },
    {
      key: 'bag',
      href: getLocalizedPath('/cart', locale),
      icon: ShoppingBag,
      label: t('common.cart') || 'Bag',
      badge: cartCount,
      isCart: true,
    },
  ]
  
  return (
    <>
      {/* Spacer to prevent content from being hidden behind fixed footer (5% bigger: 68px) */}
      <div className="h-[68px] md:hidden" aria-hidden="true" />
      
      {/* Mobile Footer Navigation - PWA Only (5% bigger: 68px) */}
      <nav 
        className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] md:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        dir={dir}
        role="navigation"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-around h-[68px]">
          {navItems.map((item) => {
            const isActive = activeTab === item.key
            const Icon = item.icon
            // Cart icon turns green when there are items
            const isCartWithItems = item.isCart && hasItemsInCart
            
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`flex flex-col items-center justify-center flex-1 h-full px-2 transition-colors touch-manipulation ${
                  isCartWithItems
                    ? 'text-green-600'
                    : isActive 
                      ? 'text-primary-600' 
                      : 'text-gray-500 hover:text-gray-700 active:text-gray-900'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className="relative">
                  <Icon 
                    className={`w-6 h-6 transition-all ${
                      isCartWithItems 
                        ? 'stroke-[2.5] text-green-600' 
                        : isActive 
                          ? 'stroke-[2.5]' 
                          : 'stroke-[1.5]'
                    }`} 
                  />
                  {/* Badge for cart count */}
                  {item.badge !== undefined && item.badge > 0 && (
                    <span 
                      className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-sm"
                      aria-label={`${item.badge} items in cart`}
                    >
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </div>
                <span className={`text-xs mt-1 transition-all ${
                  isCartWithItems 
                    ? 'font-semibold text-green-600' 
                    : isActive 
                      ? 'font-semibold' 
                      : 'font-medium'
                }`}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
