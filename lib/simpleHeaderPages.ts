/**
 * Shared helper for deciding whether a given pathname hosts its own
 * "light" / simple header (so the main sticky header should hide).
 *
 * Before this module existed, `Header.tsx`, `MobileWebHeader.tsx`, and
 * `PWAHeader.tsx` each hard-coded their own list of pages. The three lists
 * had drifted out of sync (see docs/SESSION_CHANGES_2026-04-17_MOBILE_UNIFICATION.md),
 * which caused double-headers on some routes and missing headers on others.
 *
 * The list below is the UNION of every page that any header was previously
 * hiding, so this refactor cannot regress an existing route.
 *
 * Adding a new page that ships its own header?
 *   → Append it to SIMPLE_HEADER_PATH_SEGMENTS below.
 */

/**
 * Path segments that, when present anywhere in the pathname, mean the route
 * is rendering its own header and the site-wide sticky header should hide.
 *
 * Order is irrelevant but alphabetized for easy diffing.
 */
export const SIMPLE_HEADER_PATH_SEGMENTS = [
  '/about',
  '/blog',
  '/brand',
  '/cart',
  '/checkout',
  '/contact',
  '/delivery',
  '/faq',
  '/favorites',
  '/forgot-password',
  '/locations',
  '/login',
  '/orders',
  '/pdf-viewer',
  '/privacy-policy',
  '/profile',
  '/pwa-login',
  '/reset-password',
  '/signup',
  '/skin-recommendation',
  '/success',
  '/terms',
  '/track',
  '/training',
] as const

/**
 * Matches product detail pages: /products/[id], /ar/products/[id], /ru/products/[id]
 * but NOT the listing pages (/products, /ar/products, /products/category/...).
 */
const PRODUCT_DETAIL_PATTERN = /\/products\/[a-zA-Z0-9_-]+$/

/**
 * Returns true when the given pathname is a page that renders its own
 * simple/light header. Site-wide headers should hide on these routes.
 *
 * Accepts a nullable pathname (useRouter().pathname can be null during SSR)
 * and treats null as "not a simple header page" — same behavior the three
 * original components had individually.
 */
export function isSimpleHeaderPage(pathname: string | null | undefined): boolean {
  if (!pathname) return false
  if (PRODUCT_DETAIL_PATTERN.test(pathname)) return true
  return SIMPLE_HEADER_PATH_SEGMENTS.some(segment => pathname.includes(segment))
}

/**
 * Returns true when the given pathname is a product detail page
 * (`/products/[id]`). Useful when callers need to know that specific
 * subset (e.g. hiding the mobile bottom nav on PDP).
 */
export function isProductDetailPage(pathname: string | null | undefined): boolean {
  if (!pathname) return false
  return PRODUCT_DETAIL_PATTERN.test(pathname)
}
