import { NextRequest, NextResponse } from 'next/server'
import { getAllProducts } from '@/lib/productsDb'

export async function GET(request: NextRequest) {
  try {
    const baseUrl = 'https://genosys.ae'
    const currentDate = new Date().toISOString()
    
    // Static pages
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
        url: '/cart',
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: '0.5'
      },
      {
        url: '/favorites',
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: '0.5'
      },
      {
        url: '/checkout',
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: '0.6'
      },
      {
        url: '/success',
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: '0.4'
      },
      {
        url: '/login',
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: '0.3'
      },
      {
        url: '/profile',
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: '0.4'
      },
      {
        url: '/genosys',
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: '0.7'
      },
      {
        url: '/offline',
        lastmod: currentDate,
        changefreq: 'yearly',
        priority: '0.2'
      }
    ]

    // Get all products for dynamic URLs
    let products: any[] = []
    try {
      products = await getAllProducts()
    } catch (error) {
      console.error('Error fetching products for sitemap:', error)
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

    // Add product pages
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
    console.error('Error generating sitemap:', error)
    return new NextResponse('Error generating sitemap', { status: 500 })
  }
}
