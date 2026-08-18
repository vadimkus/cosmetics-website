import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { locales, defaultLocale } from './i18n'
import { SEO_LANDING_PAGES } from './lib/seoLandingPages'

// Guide slugs are a small build-time list shared by EN/AR/RU routes.
const GUIDE_SLUGS = new Set(SEO_LANDING_PAGES.map(page => page.slug))
// Concern + category slugs — inlined (not imported) so the 3000-line
// concernsData module isn't pulled into the edge-middleware bundle. Keep in
// sync with CONCERN_PAGES / CATEGORY_PAGES in lib/concernsData.ts.
const CONCERN_SLUGS = new Set([
  'sun-protection', 'acne-treatment', 'pigmentation', 'scars-treatment',
  'hair-loss', 'anti-aging', 'hydration', 'sensitivity',
])
const CATEGORY_SLUGS = new Set([
  'microneedling', 'pro-solution', 'cleanser', 'peeling', 'toner-mist',
  'serum', 'cream', 'mask', 'sun', 'cushion-bb', 'scalp-hair', 'eye-care',
  'device', 'bio-meso',
])

// Generate a unique request ID for correlation/debugging
function generateRequestId(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).slice(2, 10)
  return `req_${timestamp}_${random}`
}

// Apply security headers to a response
function withSecurityHeaders(response: NextResponse, requestId: string): NextResponse {
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Permissions-Policy',
    'camera=(self), microphone=(self), geolocation=(), payment=(self "https://js.stripe.com")'
  )
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  // Force HTTPS for a year (incl. subdomains). Safe: the site is HTTPS-only on
  // Vercel. Not adding `preload` (that's a stronger, irreversible commitment).
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  response.headers.set('X-Request-Id', requestId)
  return response
}

// Build a NextResponse.next() that also forwards an `x-pathname`
// request header to downstream server components. This is the only
// reliable way to read the current URL inside the root Server
// Layout in Next.js App Router (it's not available via props).
function nextWithPathname(request: NextRequest): NextResponse {
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', request.nextUrl.pathname)
  return NextResponse.next({ request: { headers: requestHeaders } })
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const requestId = generateRequestId()

  // Redirect /en to root (English is default, no prefix needed).
  // 308 permanent: /en URLs are never canonical, so let Google consolidate.
  if (pathname === '/en' || pathname.startsWith('/en/')) {
    const newPath = pathname === '/en' ? '/' : pathname.replace('/en', '')
    const response = NextResponse.redirect(new URL(newPath, request.url), 308)
    // Set cookie to 'en' when accessing English version
    response.cookies.set('NEXT_LOCALE', 'en', { path: '/', maxAge: 31536000, sameSite: 'lax' })
    return withSecurityHeaders(response, requestId)
  }
  
  // If user visits root path (English homepage), set cookie to 'en' to ensure consistency
  if (pathname === '/') {
    const localeCookie = request.cookies.get('NEXT_LOCALE')?.value
    if (localeCookie !== 'en') {
      const response = nextWithPathname(request)
      response.cookies.set('NEXT_LOCALE', 'en', { path: '/', maxAge: 31536000, sameSite: 'lax' })
      return withSecurityHeaders(response, requestId)
    }
  }
  
  // Redirect /ru to /ru (Russian needs prefix)
  // This is just to ensure consistency, no actual redirect needed

  // Check if pathname starts with a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  // English-only canonical pages. If stale localized URLs are requested,
  // send crawlers/users back to the real indexable URL instead of serving 404s.
  // NOTE: guides are no longer English-only — /ar/guides and /ru/guides exist.
  const localizedEnglishOnlyMatch = pathname.match(/^\/(?:ar|ru)(\/(?:genosys|documents)(?:\/.*)?)$/)
  if (localizedEnglishOnlyMatch) {
    const canonicalPath = localizedEnglishOnlyMatch[1] ?? '/'
    return withSecurityHeaders(
      NextResponse.redirect(new URL(canonicalPath, request.url), 308),
      requestId
    )
  }

  // Unknown guide slugs must return a real HTTP 404. The guide pages render
  // dynamically (root layout), so a page-level notFound() only streams the
  // 404 UI with a 200 status (soft 404). Rewriting to an unrouteable path
  // makes Next's global not-found handler respond with a genuine 404.
  const guideSlug = pathname.match(/^\/(?:(?:ar|ru)\/)?guides\/([^/]+)\/?$/)?.[1]
  if (guideSlug && !GUIDE_SLUGS.has(guideSlug)) {
    return withSecurityHeaders(
      NextResponse.rewrite(new URL('/__not-found', request.url)),
      requestId
    )
  }

  // Same real-404 treatment for unknown concern / category slugs. These pages
  // render via the root layout, so a page-level notFound() only yields a soft
  // 404 (HTTP 200 + 404 UI). dynamicParams=false alone isn't enough because the
  // layout still streams first; rewriting to an unrouteable path forces a true 404.
  const concernSlug = pathname.match(/^\/(?:(?:ar|ru)\/)?products\/concern\/([^/]+)\/?$/)?.[1]
  if (concernSlug && !CONCERN_SLUGS.has(concernSlug)) {
    return withSecurityHeaders(
      NextResponse.rewrite(new URL('/__not-found', request.url)),
      requestId
    )
  }
  const categorySlug = pathname.match(/^\/(?:(?:ar|ru)\/)?products\/category\/([^/]+)\/?$/)?.[1]
  if (categorySlug && !CATEGORY_SLUGS.has(categorySlug)) {
    return withSecurityHeaders(
      NextResponse.rewrite(new URL('/__not-found', request.url)),
      requestId
    )
  }

  // These pages don't have AR/RU versions and should serve English to all crawlers,
  // regardless of Accept-Language or NEXT_LOCALE.
  const englishOnlyPaths = ['/genosys', '/documents', '/guides']
  const isEnglishOnlyPath = englishOnlyPaths.some(path => pathname === path || pathname.startsWith(`${path}/`))

  // If it's an English-only path, skip locale detection entirely
  if (isEnglishOnlyPath) {
    return withSecurityHeaders(nextWithPathname(request), requestId)
  }

  // Redirect new optimized URLs to existing pages (for SEO benefits)
  const redirects: Record<string, string> = {
    '/about-genosys-middle-east': '/about',
    '/genosys-brand-story': '/brand',
    '/korean-dermacosmetics-products': '/products',
    '/professional-skincare-training': '/training',
    '/contact-genosys-uae': '/contact',
    '/delivery-shipping-uae': '/delivery',
    '/login-account': '/login',
    '/my-account': '/profile',
    '/shopping-cart': '/cart',
    '/my-favorites': '/favorites',
    '/secure-checkout': '/checkout',
    '/order-success': '/success',
    '/genosys-official': '/genosys',
    '/offline-mode': '/offline',
    '/professional-documents': '/documents',
    '/proff': '/prof',
    '/korean-skincare-dubai': '/guides/korean-skincare-dubai',
    '/microneedling-devices-uae': '/guides/microneedling-devices-uae',
    '/professional-skincare-training-dubai': '/guides/professional-skincare-training-dubai',
    '/genosys-distributor-uae': '/guides/genosys-distributor-uae',
    '/dermacosmetics-for-clinics-uae': '/guides/dermacosmetics-for-clinics-uae',
    '/korean-sunscreen-uae': '/guides/korean-sunscreen-uae',
    '/acne-treatment-products-uae': '/guides/acne-treatment-products-uae',
    '/pigmentation-serum-dubai': '/guides/pigmentation-serum-dubai',
  }

  // Handle redirects first (before locale handling).
  // 308 permanent (not the 307 default): these aliases are stable, and a
  // temporary redirect keeps Google re-crawling them and reporting
  // "Page with redirect" instead of consolidating onto the target URL.
  if (redirects[pathname]) {
    return withSecurityHeaders(
      NextResponse.redirect(new URL(redirects[pathname], request.url), 308),
      requestId
    )
  }

  // Legacy product URLs: CUID/UUID product ids that search engines indexed
  // before product canonicals were unified on the numeric productNumber.
  // Redirecting here gives crawlers a real HTTP 301; the page-level
  // permanentRedirect in app/products/[id] only produces a streamed 200 +
  // meta refresh because the root loading boundary starts the stream first.
  const legacyProductIdMap: Record<string, string> = {
    'cmgj9ifoi00008o07p4eqmfb7': '53', // INTENSIVE REPAIR COLLAGEN MASK
    'cmhf1a6p400000xfa0iu3bw42': '54', // Holiday Kit
    'cmhowxw4x00008ofct2ivnq2j': '55', // PROBLEM SKIN CARE BEAUTY BOX
    'cmhoyg0r400008o7s4va63hsw': '56', // SKIN BRIGHTENING BEAUTY BOX
    'cmhoyw7d500008o9tdprqkkhb': '57', // CHARMING LOOK BEAUTY BOX
    'cmhozfrep00008oxxizeqk8a0': '58', // ANTI-AGING BEAUTY BOX
    'cmhp0jfrq00008odr033fg0ly': '59', // DEEP MOISTURIZING BEAUTY BOX
    'cmk449na90077e9k5anpfqz4o': '60', // Bio Meso PDRN Ampoule 60000
    'cf2af89b-2cec-465a-8f00-7c65d82e931b': '61', // HR³ MATRIX SCALP BRUSH
    'cml3twwvk0000ua8o9qiqwkie': '62', // SENSITIVE SKIN BEAUTY BOX
    'cmljaahes0017e9ex5yfv76en': '63', // REVITA GLOW BLEMISH BALM CREAM
  }
  const legacyProductMatch = pathname.match(/^\/((?:ar|ru)\/)?products\/([^/]+)$/)
  if (legacyProductMatch?.[2]) {
    const numericSlug = legacyProductIdMap[legacyProductMatch[2]]
    if (numericSlug) {
      const newPath = `/${legacyProductMatch[1] ?? ''}products/${numericSlug}`
      return withSecurityHeaders(
        NextResponse.redirect(new URL(newPath, request.url), 301),
        requestId
      )
    }
  }

  // Don't redirect root path - it's already English (default)
  // Only redirect if path doesn't have locale and is not root
  // Exclude static assets (videos, images, icons, service worker, etc.) from locale routing
  const staticAssets = [
    '/manifest.json',
    '/ar/manifest.json',
    '/ru/manifest.json',
    '/apple-touch-icon.png',
    '/favicon.ico',
    '/favicon-16x16.png',
    '/favicon-32x32.png',
    '/icon-192x192.png',
    '/icon-512x512.png',
    '/sw.js',
    '/llms.txt',
    '/llms-full.txt',
    '/ai-products.txt',
    '/sitemap.xml',
    '/sitemap-index.xml',
    '/opensearch.xml',
  ]
  if (pathname !== '/' && !pathnameHasLocale && !pathname.startsWith('/api') && !pathname.startsWith('/_next') && !pathname.startsWith('/videos') && !pathname.startsWith('/images') && !pathname.startsWith('/Logo') && !pathname.startsWith('/guides') && !staticAssets.includes(pathname)) {
    // Check for user's language preference cookie first (set by language switcher)
    const localeCookie = request.cookies.get('NEXT_LOCALE')?.value
    
    // Check the referer to see if user is navigating from an English page
    const referer = request.headers.get('referer') || ''
    const isFromEnglishPage = referer && !referer.includes('/ar/') && !referer.includes('/ru/') && (referer.endsWith('/') || referer.includes('genosys.ae/') && !referer.includes('/ar') && !referer.includes('/ru'))
    
    let preferredLocale = defaultLocale
    
    // If user is navigating from an English page (no locale prefix), keep them in English
    // This prevents redirecting when clicking links from the English homepage
    if (isFromEnglishPage && pathname !== '/') {
      // User is on English page, let them stay in English
      return withSecurityHeaders(nextWithPathname(request), requestId)
    }
    
    // If cookie is set to 'en', don't redirect - let English pages through
    if (localeCookie === 'en') {
      return withSecurityHeaders(nextWithPathname(request), requestId)
    }
    
    // If cookie exists and is valid, use it
    if (localeCookie && (localeCookie === 'ar' || localeCookie === 'ru')) {
      preferredLocale = localeCookie as typeof defaultLocale
    } else {
      // Fall back to Accept-Language header if no cookie
      const acceptLanguage = request.headers.get('accept-language') || ''
      if (acceptLanguage.includes('ar')) {
        preferredLocale = 'ar'
      } else if (acceptLanguage.includes('ru')) {
        preferredLocale = 'ru'
      }
    }
    
    // For non-root paths without locale, add locale prefix
    // But for English (default), don't add prefix - just let it through
    if (preferredLocale === 'ar') {
      const newPath = `/ar${pathname}`
      return withSecurityHeaders(NextResponse.redirect(new URL(newPath, request.url)), requestId)
    }
    if (preferredLocale === 'ru') {
      const newPath = `/ru${pathname}`
      return withSecurityHeaders(NextResponse.redirect(new URL(newPath, request.url)), requestId)
    }
    // For English, just let it through without prefix
  }

  return withSecurityHeaders(nextWithPathname(request), requestId)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - videos (video files)
     * - images (image files)
     * - Logo (logo files)
     * - favicon.ico (favicon file)
     * - sitemap.xml / sitemap-index.xml (sitemaps)
     * - robots.txt (robots file)
     * - llms.txt / llms-full.txt / ai-products.txt (AI indexes)
     * - feed/* and opensearch.xml (machine-readable discovery files)
     */
    '/((?!api|_next/static|_next/image|videos|images|Logo|feed|favicon.ico|favicon-16x16.png|favicon-32x32.png|icon-192x192.png|icon-512x512.png|apple-touch-icon.png|sitemap.xml|sitemap-index.xml|robots.txt|llms.txt|llms-full.txt|ai-products.txt|opensearch.xml|manifest.json|ar/manifest.json|ru/manifest.json|sw.js).*)',
  ],
}
