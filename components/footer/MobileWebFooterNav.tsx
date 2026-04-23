'use client'

import { usePathname, useRouter } from 'next/navigation'
import { getLocalizedPath, getLocaleFromPath } from '@/lib/i18n'
import { useTranslation } from '@/hooks/useTranslation'
import { usePWAMode } from '@/hooks/usePWAMode'
import { useIsMobile } from '@/hooks/useIsMobile'
import { useMemo, useState, useEffect, useRef, useCallback } from 'react'
import {
  HomeIcon,
  ListIcon,
  BagIcon,
  MOBILE_BOTTOM_NAV_COLORS,
  useCartCount,
  useHideBottomNav,
  getActiveTab,
} from './mobileBottomNavShared'

/**
 * Mobile Web Footer Navigation
 *
 * Renders only on mobile web (not PWA, not desktop). Icons, cart
 * subscription, hide logic, and colors are shared with the PWA variant
 * via ./mobileBottomNavShared.tsx.
 *
 * Uses position: sticky via .mobile-web-footer-nav class in globals.css
 * for Chrome iOS compatibility.
 */
export default function MobileWebFooterNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { t, dir } = useTranslation()
  const { isPWA, isClient } = usePWAMode()
  const { isMobile } = useIsMobile()
  const [isReady, setIsReady] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)
  const cartCount = useCartCount()
  const lastClickTime = useRef(0)

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => { setIsNavigating(false) }, [pathname])

  const locale = useMemo(() => getLocaleFromPath(pathname || '/'), [pathname])

  const handleNavigation = useCallback((path: string) => {
    const now = Date.now()
    if (now - lastClickTime.current < 300 || isNavigating || !isReady) return
    lastClickTime.current = now
    setIsNavigating(true)
    router.push(path)
  }, [router, isNavigating, isReady])

  const shouldHide = useHideBottomNav(pathname, { variant: 'web', cartCount })
  const activeTab = getActiveTab(pathname)
  const hasItems = cartCount > 0

  if (!isClient || isPWA || !isMobile || shouldHide) return null

  const RED = MOBILE_BOTTOM_NAV_COLORS.active
  const GRAY = MOBILE_BOTTOM_NAV_COLORS.inactive
  const GREEN = MOBILE_BOTTOM_NAV_COLORS.withItems

  const getColor = (tab: string) => {
    if (tab === 'bag' && hasItems) return GREEN
    if (activeTab === tab) return RED
    return GRAY
  }

  const buttonStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: '100%',
    padding: 8,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  }

  return (
    <nav 
      className="mobile-web-footer-nav"
      dir={dir}
      aria-label="Mobile navigation"
    >
      <button style={buttonStyle} onClick={() => handleNavigation(getLocalizedPath('/products', locale))}>
        <HomeIcon filled={activeTab === 'home'} color={getColor('home')} />
        <span style={{ fontSize: 12, marginTop: 4, fontWeight: 500, color: getColor('home') }}>
          {t('tabs.home') || 'Home'}
        </span>
      </button>

      <button style={buttonStyle} onClick={() => handleNavigation(getLocalizedPath('/orders', locale))}>
        <ListIcon filled={activeTab === 'orders'} color={getColor('orders')} />
        <span style={{ fontSize: 12, marginTop: 4, fontWeight: 500, color: getColor('orders') }}>
          {t('tabs.orders') || 'Orders'}
        </span>
      </button>

      <button style={buttonStyle} onClick={() => handleNavigation(getLocalizedPath('/cart', locale))}>
        <div style={{ position: 'relative' }}>
          <BagIcon filled={activeTab === 'bag' || hasItems} color={getColor('bag')} />
          {hasItems && (
            <span style={{
              position: 'absolute',
              top: -6,
              right: -10,
              backgroundColor: RED,
              color: '#fff',
              fontSize: 10,
              fontWeight: 600,
              borderRadius: '50%',
              minWidth: 18,
              height: 18,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #fff',
            }}>
              {cartCount > 99 ? '99+' : cartCount}
            </span>
          )}
        </div>
        <span style={{ fontSize: 12, marginTop: 4, fontWeight: 500, color: getColor('bag') }}>
          {t('tabs.bag') || 'Bag'}
        </span>
      </button>
    </nav>
  )
}
