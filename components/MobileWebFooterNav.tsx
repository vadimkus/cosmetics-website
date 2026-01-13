'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/cartStore'
import { getLocalizedPath, getLocaleFromPath } from '@/lib/i18n'
import { useTranslation } from '@/hooks/useTranslation'
import { usePWAMode } from '@/hooks/usePWAMode'
import { useMemo, useState, useEffect, useRef, useCallback } from 'react'

/**
 * Mobile Web Footer Navigation
 * Uses position: sticky for Chrome iOS compatibility
 */

const HomeIcon = ({ filled, color }: { filled?: boolean; color: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28"
    fill={filled ? color : 'none'} stroke={color} 
    strokeWidth={filled ? 0 : 1.5} strokeLinecap="round" strokeLinejoin="round">
    {filled ? (
      <path d="M3 9.5L12 2l9 7.5V20a2 2 0 01-2 2H5a2 2 0 01-2-2V9.5z"/>
    ) : (
      <><path d="M3 9.5L12 2l9 7.5V20a2 2 0 01-2 2H5a2 2 0 01-2-2V9.5z"/><path d="M9 22V12h6v10"/></>
    )}
  </svg>
)

const ListIcon = ({ filled, color }: { filled?: boolean; color: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28"
    fill="none" stroke={color} strokeWidth={filled ? 2.5 : 1.5} 
    strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
    <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
)

const BagIcon = ({ filled, color }: { filled?: boolean; color: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28"
    fill={filled ? color : 'none'} stroke={color} 
    strokeWidth={filled ? 0 : 1.5} strokeLinecap="round" strokeLinejoin="round">
    {filled ? (
      <>
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6z"/>
        <path d="M3 6h18" stroke="#fff" strokeWidth="1.5"/>
        <path d="M16 10a4 4 0 01-8 0" stroke="#fff" strokeWidth="1.5" fill="none"/>
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

function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false
  const ua = navigator.userAgent || ''
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua) || window.innerWidth <= 768
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
  
  useEffect(() => {
    setIsMobile(isMobileDevice())
    const handleResize = () => setIsMobile(isMobileDevice())
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
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
  
  const shouldHide = useMemo(() => {
    if (!pathname) return false
    return /\/products\/[a-zA-Z0-9_-]+$/.test(pathname) || 
           pathname.includes('/pdf-viewer') || pathname.includes('/pwa-login')
  }, [pathname])

  const activeTab = useMemo(() => {
    if (!pathname) return 'home'
    const p = pathname.toLowerCase()
    if (p.includes('/cart') || p.includes('/checkout')) return 'bag'
    if (p.includes('/orders')) return 'orders'
    return 'home'
  }, [pathname])
  
  const cartCount = isClient ? getTotalItems() : 0
  const hasItems = cartCount > 0
  
  if (!isClient || isPWA || !isMobile || shouldHide) return null
  
  const RED = '#dc2626'
  const GRAY = '#8E8E93'
  const GREEN = '#10b981'
  
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
    <div 
      style={{
        position: 'sticky',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: 80,
        backgroundColor: '#fff',
        borderTop: '1px solid #e5e7eb',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingBottom: 10,
        marginTop: 'auto',
      }}
      dir={dir}
      role="navigation"
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
    </div>
  )
}
