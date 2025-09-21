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

# Allow important pages
Allow: /products/
Allow: /about
Allow: /brand
Allow: /training
Allow: /contact
Allow: /delivery
Allow: /genosys

# Crawl delay (optional)
Crawl-delay: 1`

  return new NextResponse(robotsTxt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, s-maxage=86400',
    },
  })
}
