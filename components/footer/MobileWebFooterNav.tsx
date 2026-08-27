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
  MOBILE_WEB_NAV_COLORS,
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

  const { active: INK, inactive: MUTED, badge: ROSE } = MOBILE_WEB_NAV_COLORS

  const getColor = (tab: string) => (activeTab === tab ? INK : MUTED)

  const buttonStyle: React.CSSProperties = {
    position: 'relative',
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
    WebkitTapHighlightColor: 'transparent',
  }

  const labelStyle = (tab: string): React.CSSProperties => ({
    marginTop: 5,
    fontSize: 9.5,
    fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: getColor(tab),
  })

  /**
   * A rule above the active tab. Colour alone was the only cue before, which WCAG 1.4.1
   * does not accept and which disappears for anyone with a red-green deficiency - the old
   * palette leaned on exactly that pair.
   */
  const marker = (tab: string) =>
    activeTab === tab ? (
      <span
        aria-hidden="true"
        style={{ position: 'absolute', top: 0, width: 26, height: 2, borderRadius: 2, backgroundColor: INK }}
      />
    ) : null

  return (
    <nav 
      className="mobile-web-footer-nav"
      dir={dir}
      aria-label="Mobile navigation"
    >
      <button
        style={buttonStyle}
        aria-current={activeTab === 'home' ? 'page' : undefined}
        onClick={() => handleNavigation(getLocalizedPath('/products', locale))}
      >
        {marker('home')}
        <HomeIcon filled={activeTab === 'home'} color={getColor('home')} />
        <span style={labelStyle('home')}>{t('tabs.home') || 'Home'}</span>
      </button>

      <button
        style={buttonStyle}
        aria-current={activeTab === 'orders' ? 'page' : undefined}
        onClick={() => handleNavigation(getLocalizedPath('/orders', locale))}
      >
        {marker('orders')}
        <ListIcon filled={activeTab === 'orders'} color={getColor('orders')} />
        <span style={labelStyle('orders')}>{t('tabs.orders') || 'Orders'}</span>
      </button>

      <button
        style={buttonStyle}
        aria-current={activeTab === 'bag' ? 'page' : undefined}
        onClick={() => handleNavigation(getLocalizedPath('/cart', locale))}
      >
        {marker('bag')}
        <div style={{ position: 'relative' }}>
          <BagIcon filled={activeTab === 'bag'} color={getColor('bag')} />
          {hasItems && (
            <span style={{
              position: 'absolute',
              top: -5,
              right: -9,
              backgroundColor: ROSE,
              color: '#fff',
              fontSize: 10,
              fontWeight: 700,
              borderRadius: '50%',
              minWidth: 17,
              height: 17,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #faf8f7',
            }}>
              {cartCount > 99 ? '99+' : cartCount}
            </span>
          )}
        </div>
        <span style={labelStyle('bag')}>{t('tabs.bag') || 'Bag'}</span>
      </button>
    </nav>
  )
}
