'use client'

/**
 * Shared primitives for the mobile bottom navigation.
 *
 * The PWA version (MobileFooterNav) and the mobile-web version
 * (MobileWebFooterNav) both render the same 3-tab bar (Home / Orders / Bag)
 * but live in different display modes. This module unifies:
 *
 *   1. SVG icons (HomeIcon / ListIcon / BagIcon)
 *   2. Cart-count state subscription hook
 *   3. Active-tab detection from the current pathname
 *   4. Route-based hide logic
 *   5. Canonical colors (red / gray / green)
 *
 * Each shell still owns positioning + haptics, because those legitimately
 * differ between PWA and mobile web.
 */

import { useEffect, useMemo, useState } from 'react'
import { useCartStore } from '@/lib/cartStore'
import { isProductDetailPage } from '@/lib/simpleHeaderPages'

/**
 * Tab bar colours, shared by the mobile web bar and the installed app's.
 *
 * Ink rather than red for the active tab, matching how the editorial system marks selection
 * everywhere else (the products filter pills, the account sidebar). Rose is reserved for the
 * cart count, which leaves the bar with two tones instead of three: the previous scheme also
 * turned the bag icon green whenever the cart had items, which the count badge already says.
 *
 * Literal hex rather than var(--cera-*) because these are passed to an SVG `stroke`
 * attribute, not a CSS property, so a custom property would not resolve.
 */
export const MOBILE_WEB_NAV_COLORS = {
  active: '#17140f', // --cera-ink
  inactive: '#6a625d', // --cera-muted
  badge: '#c0392f', // --cera-rose
} as const

/**
 * Active tab derived from pathname. "home" covers /products and the three
 * locale roots - matching the prior (duplicated) behavior in both footers.
 */
export type MobileBottomNavTab = 'home' | 'orders' | 'bag'

export function getActiveTab(pathname: string | null | undefined): MobileBottomNavTab {
  if (!pathname) return 'home'
  const path = pathname.toLowerCase()
  if (path.includes('/cart') || path.includes('/checkout')) return 'bag'
  if (path.includes('/orders')) return 'orders'
  return 'home'
}

/**
 * Subscribes to the cart store and returns the total item count.
 * Keeps both footers reactive without re-implementing the pattern twice.
 */
export function useCartCount(): number {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const updateCount = () => {
      const state = useCartStore.getState()
      setCount(state.items.reduce((total, item) => total + item.quantity, 0))
    }
    updateCount()
    const unsubscribe = useCartStore.subscribe(updateCount)
    // Hydration safety net - pick up post-hydration cart
    const timer = setTimeout(updateCount, 100)
    return () => {
      unsubscribe()
      clearTimeout(timer)
    }
  }, [])

  return count
}

/**
 * Decides whether the bottom nav should be hidden on the current route.
 *
 * PWA and mobile-web hide on slightly different sets of routes:
 *   - PWA hides on: product detail, pwa-login, pdf-viewer, concern pages
 *   - Web hides on: the above + login/signup flows + success + bundle-builder
 *     + checkout + cart-with-items (the cart CTA handles checkout inline)
 */
export interface UseHideBottomNavOptions {
  variant: 'pwa' | 'web'
  /** When variant === 'web' and cart has items, the cart page hides the nav. */
  cartCount?: number
}

export function useHideBottomNav(
  pathname: string | null | undefined,
  { variant, cartCount = 0 }: UseHideBottomNavOptions
): boolean {
  return useMemo(() => {
    if (!pathname) return false

    // Common hides: PDP, PDF viewer, pwa-login, concern pages (both variants)
    if (isProductDetailPage(pathname)) return true
    if (pathname.includes('/pwa-login')) return true
    if (pathname.includes('/pdf-viewer')) return true
    if (pathname.includes('/products/concern/')) return true
    if (pathname.includes('/admin')) return true

    if (variant === 'pwa') {
      // PWA variant is driven by PWAPageWrapper for most cases; this hook
      // just matches the hides the previous implementation did directly.
      return false
    }

    // Web-only hides
    const isLoginPage =
      pathname === '/login' ||
      pathname === '/ru/login' ||
      pathname === '/ar/login' ||
      pathname.endsWith('/login')
    if (isLoginPage) return true

    if (
      pathname.includes('/signup') ||
      pathname.includes('/forgot-password') ||
      pathname.includes('/reset-password') ||
      pathname.includes('/checkout') ||
      pathname.includes('/success') ||
      pathname.includes('/bundle-builder') ||
      pathname.includes('/skin-recommendation') ||
      pathname.includes('/blog')
    ) {
      return true
    }

    // Cart page: show when empty, hide when it has items
    // (the cart body shows its own checkout CTA).
    if (pathname.includes('/cart')) {
      return cartCount > 0
    }

    return false
  }, [pathname, variant, cartCount])
}

/*
 * --------------------------------------------------------------------------
 * SVG Icons - single source of truth (PWA + web footers share these)
 * --------------------------------------------------------------------------
 * Two rendering modes:
 *   - `mode="class"` returns a Tailwind-friendly icon that inherits
 *     `currentColor` from a className. Used by the PWA footer.
 *   - `mode="inline"` returns an icon with an explicit `color` prop so
 *     legacy inline-styled callers (MobileWebFooterNav) keep working.
 */

type IconBaseProps = {
  filled?: boolean
}

type IconClassProps = IconBaseProps & { className?: string; color?: never }
type IconColorProps = IconBaseProps & { color: string; className?: never }
type IconProps = IconClassProps | IconColorProps

const resolveIconProps = (props: IconProps) => {
  if ('color' in props && props.color !== undefined) {
    return { stroke: props.color, fill: props.filled ? props.color : 'none' }
  }
  return { stroke: 'currentColor', fill: props.filled ? 'currentColor' : 'none' }
}

export const HomeIcon = (props: IconProps) => {
  const { stroke, fill } = resolveIconProps(props)
  const className = 'className' in props ? props.className : undefined
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
      width={className ? undefined : 28}
      height={className ? undefined : 28}
      fill={fill}
      stroke={stroke}
      strokeWidth={props.filled ? 0 : 1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {props.filled ? (
        <path d="M3 9.5L12 2l9 7.5V20a2 2 0 01-2 2H5a2 2 0 01-2-2V9.5z" />
      ) : (
        <>
          <path d="M3 9.5L12 2l9 7.5V20a2 2 0 01-2 2H5a2 2 0 01-2-2V9.5z" />
          <path d="M9 22V12h6v10" />
        </>
      )}
    </svg>
  )
}

export const ListIcon = (props: IconProps) => {
  const { stroke } = resolveIconProps(props)
  const className = 'className' in props ? props.className : undefined
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
      width={className ? undefined : 28}
      height={className ? undefined : 28}
      fill="none"
      stroke={stroke}
      strokeWidth={props.filled ? 2.5 : 1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  )
}

export const BagIcon = (props: IconProps) => {
  const { stroke, fill } = resolveIconProps(props)
  const className = 'className' in props ? props.className : undefined
  // Bag's interior "handles" should be white when filled so they pop against
  // the red/green body - matching both previous implementations.
  const interiorStroke = 'color' in props && props.color !== undefined && props.filled ? '#ffffff' : stroke
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
      width={className ? undefined : 28}
      height={className ? undefined : 28}
      fill={fill}
      stroke={stroke}
      strokeWidth={props.filled ? 0 : 1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {props.filled ? (
        <>
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6z" />
          <path d="M3 6h18" stroke={interiorStroke} strokeWidth="1.5" />
          <path d="M16 10a4 4 0 01-8 0" stroke={interiorStroke} strokeWidth="1.5" fill="none" />
        </>
      ) : (
        <>
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 01-8 0" />
        </>
      )}
    </svg>
  )
}
