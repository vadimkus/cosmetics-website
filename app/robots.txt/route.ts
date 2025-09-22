import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const robotsTxt = `User-agent: *
Allow: /

# Sitemap
Sitemap: https://genosys.ae/sitemap.xml

# Disallow admin and API routes
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /profile/
Disallow: /cart/
Disallow: /favorites/
Disallow: /checkout/
Disallow: /success/
Disallow: /login/

# Allow optimized pages
Allow: /korean-dermacosmetics-products/
Allow: /products/category/
Allow: /products/
Allow: /about-genosys-middle-east
Allow: /genosys-brand-story
Allow: /professional-skincare-training
Allow: /contact-genosys-uae
Allow: /delivery-shipping-uae
Allow: /genosys-official
Allow: /professional-documents
Allow: /documents/

# Allow legacy pages (will redirect)
Allow: /about
Allow: /brand
Allow: /training
Allow: /contact
Allow: /delivery
Allow: /genosys

# Crawl delay (optimized for better SEO)
Crawl-delay: 0.5`

  return new NextResponse(robotsTxt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, s-maxage=86400',
    },
  })
}
