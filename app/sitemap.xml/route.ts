import { NextRequest, NextResponse } from 'next/server'
import { getAllProducts } from '@/lib/productsDb'
import { errorLog } from '@/lib/logger'
// import { getOptimizedUrl } from '@/lib/urlUtils' // Unused for now

export async function GET(_request: NextRequest) {
  try {
    const baseUrl = 'https://genosys.ae'
    const currentDate = new Date().toISOString()
    
    // Static pages (existing URLs)
    const staticPages = [
      {
        url: '',
        lastmod: currentDate,
        changefreq: 'daily',
        priority: '1.0'
      },
      {
        url: '/about',
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: '0.8'
      },
      {
        url: '/brand',
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: '0.8'
      },
      {
        url: '/products',
        lastmod: currentDate,
        changefreq: 'daily',
        priority: '0.9'
      },
      {
        url: '/training',
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: '0.7'
      },
      {
        url: '/contact',
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: '0.8'
      },
      {
        url: '/delivery',
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: '0.6'
      },
      {
        url: '/genosys',
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: '0.7'
      },
      {
        url: '/documents',
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: '0.6'
      }
    ]

    // Get all products for dynamic URLs
    let products: any[] = []
    try {
      products = await getAllProducts()
    } catch (error) {
      errorLog('Error fetching products for sitemap:', error)
    }

    // Generate XML sitemap
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`

    // Add static pages
    staticPages.forEach(page => {
      sitemap += `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    })

    // Add optimized URLs (these redirect to the static pages above)
    const optimizedUrls = [
      { url: '/about-genosys-middle-east', priority: '0.8' },
      { url: '/genosys-brand-story', priority: '0.8' },
      { url: '/korean-dermacosmetics-products', priority: '0.9' },
      { url: '/professional-skincare-training', priority: '0.7' },
      { url: '/contact-genosys-uae', priority: '0.8' },
      { url: '/delivery-shipping-uae', priority: '0.6' },
      { url: '/genosys-official', priority: '0.7' },
      { url: '/professional-documents', priority: '0.6' }
    ]

    optimizedUrls.forEach(page => {
      sitemap += `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    })

    // Add product pages (existing URLs)
    products.forEach(product => {
      sitemap += `
  <url>
    <loc>${baseUrl}/products/${product.id}</loc>
    <lastmod>${new Date(product.updatedAt || product.createdAt).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    })

    sitemap += `
</urlset>`

    return new NextResponse(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    errorLog('Error generating sitemap:', error)
    return new NextResponse('Error generating sitemap', { status: 500 })
  }
}
