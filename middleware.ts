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
  if (pathname !== '/' && !pathnameHasLocale && !pathname.startsWith('/api') && !pathname.startsWith('/_next')) {
    // Get locale from Accept-Language header or default to 'en'
    const acceptLanguage = request.headers.get('accept-language') || ''
    const preferredLocale = acceptLanguage.includes('ar') ? 'ar' : defaultLocale
    
    // For non-root paths without locale, add locale prefix
    // But for English (default), don't add prefix - just let it through
    if (preferredLocale === 'ar') {
      const newPath = `/ar${pathname}`
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
     * - favicon.ico (favicon file)
     * - sitemap.xml (sitemap)
     * - robots.txt (robots file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
