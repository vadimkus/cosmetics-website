import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl


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

  if (redirects[pathname]) {
    return NextResponse.redirect(new URL(redirects[pathname], request.url))
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
