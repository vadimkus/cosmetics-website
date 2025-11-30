import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { locales, defaultLocale } from './i18n'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Redirect /en to root (English is default, no prefix needed)
  if (pathname === '/en' || pathname.startsWith('/en/')) {
    const newPath = pathname === '/en' ? '/' : pathname.replace('/en', '')
    return NextResponse.redirect(new URL(newPath, request.url))
  }
  
  // Redirect /ru to /ru (Russian needs prefix)
  // This is just to ensure consistency, no actual redirect needed

  // Check if pathname starts with a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

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
    '/professional-documents': '/documents'
  }

  // Handle redirects first (before locale handling)
  if (redirects[pathname]) {
    return NextResponse.redirect(new URL(redirects[pathname], request.url))
  }

  // Don't redirect root path - it's already English (default)
  // Only redirect if path doesn't have locale and is not root
  // Exclude static assets (videos, images, icons, service worker, etc.) from locale routing
  // Also exclude development/testing routes like /phone
  const staticAssets = ['/manifest.json', '/apple-touch-icon.png', '/favicon.ico', '/favicon-16x16.png', '/favicon-32x32.png', '/icon-192x192.png', '/icon-512x512.png', '/sw.js']
  const excludedRoutes = ['/phone']
  if (pathname !== '/' && !pathnameHasLocale && !pathname.startsWith('/api') && !pathname.startsWith('/_next') && !pathname.startsWith('/videos') && !pathname.startsWith('/images') && !pathname.startsWith('/Logo') && !staticAssets.includes(pathname) && !excludedRoutes.includes(pathname)) {
    // Check for user's language preference cookie first (set by language switcher)
    const localeCookie = request.cookies.get('NEXT_LOCALE')?.value
    
    let preferredLocale = defaultLocale
    
    // If cookie exists and is valid, use it
    if (localeCookie && (localeCookie === 'ar' || localeCookie === 'ru' || localeCookie === 'en')) {
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
      return NextResponse.redirect(new URL(newPath, request.url))
    }
    if (preferredLocale === 'ru') {
      const newPath = `/ru${pathname}`
      return NextResponse.redirect(new URL(newPath, request.url))
    }
    // For English, just let it through without prefix
  }

  return NextResponse.next()
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
     * - sitemap.xml (sitemap)
     * - robots.txt (robots file)
     */
    '/((?!api|_next/static|_next/image|videos|images|Logo|favicon.ico|favicon-16x16.png|favicon-32x32.png|icon-192x192.png|icon-512x512.png|apple-touch-icon.png|sitemap.xml|robots.txt|manifest.json|sw.js).*)',
  ],
}
