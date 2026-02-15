import { NextRequest, NextResponse } from 'next/server'
import { getAllProducts } from '@/lib/productsDb'
import { errorLog } from '@/lib/logger'
import { Product } from '@/types/index'
import { prisma } from '@/lib/prisma'

/**
 * Dynamic XML Sitemap with multilingual support (EN/AR/RU)
 * 
 * Features:
 * - All public pages with hreflang tags for 3 languages
 * - x-default pointing to English version
 * - Product pages from database
 * - Blog posts from database (with real lastmod dates)
 * - Location pages for all UAE emirates
 * - Additional SEO-friendly pages (partners, skin-recommendation, etc.)
 * - Proper lastmod based on content type
 */

export async function GET(_request: NextRequest) {
  try {
    const baseUrl = 'https://genosys.ae'
    const currentDate = new Date().toISOString()
    
    // Use a fixed date for truly static pages (update when content actually changes)
    // This is more honest than using currentDate which misleads crawlers
    const staticContentDate = '2026-02-12T00:00:00.000Z'
    
    // Static pages with their actual update frequencies
    const staticPages = [
      {
        url: '',
        lastmod: currentDate, // Homepage changes frequently (new products, promotions)
        changefreq: 'daily',
        priority: '1.0'
      },
      {
        url: '/about',
        lastmod: staticContentDate,
        changefreq: 'monthly',
        priority: '0.8'
      },
      {
        url: '/brand',
        lastmod: staticContentDate,
        changefreq: 'monthly',
        priority: '0.8'
      },
      {
        url: '/products',
        lastmod: currentDate, // Products list changes as inventory updates
        changefreq: 'daily',
        priority: '0.9'
      },
      {
        url: '/blog',
        lastmod: currentDate, // Blog updates regularly
        changefreq: 'weekly',
        priority: '0.8'
      },
      {
        url: '/faq',
        lastmod: staticContentDate,
        changefreq: 'monthly',
        priority: '0.7'
      },
      {
        url: '/locations',
        lastmod: staticContentDate,
        changefreq: 'monthly',
        priority: '0.7'
      },
      {
        url: '/training',
        lastmod: staticContentDate,
        changefreq: 'monthly',
        priority: '0.7'
      },
      {
        url: '/contact',
        lastmod: staticContentDate,
        changefreq: 'monthly',
        priority: '0.8'
      },
      {
        url: '/delivery',
        lastmod: staticContentDate,
        changefreq: 'monthly',
        priority: '0.6'
      },
      // NOTE: /genosys and /documents are English-only (no AR/RU versions exist).
      // They are added below as single-language URLs to avoid 404s on /ar/genosys, /ar/documents, etc.
      // Additional pages that exist in AR/RU
      {
        url: '/partners',
        lastmod: staticContentDate,
        changefreq: 'monthly',
        priority: '0.6'
      },
      {
        url: '/skin-recommendation',
        lastmod: staticContentDate,
        changefreq: 'monthly',
        priority: '0.6'
      },
      {
        url: '/privacy-policy',
        lastmod: staticContentDate,
        changefreq: 'yearly',
        priority: '0.3'
      },
      {
        url: '/bundle-builder',
        lastmod: staticContentDate,
        changefreq: 'monthly',
        priority: '0.5'
      },
    ]

    // Get all products for dynamic URLs
    let products: Product[] = []
    try {
      products = await getAllProducts()
    } catch (error) {
      errorLog('Error fetching products for sitemap:', error)
    }

    // Generate XML sitemap with multilingual support
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">`

    // Helper function to add URL with hreflang tags for all 3 languages + x-default
    const addUrlWithHreflang = (url: string, lastmod: string, changefreq: string, priority: string) => {
      // Handle home page (empty URL)
      const enUrl = url === '' ? `${baseUrl}/` : `${baseUrl}${url}`
      const arUrl = url === '' ? `${baseUrl}/ar` : `${baseUrl}/ar${url}`
      const ruUrl = url === '' ? `${baseUrl}/ru` : `${baseUrl}/ru${url}`
      
      // English version
      sitemap += `
  <url>
    <loc>${enUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}" />
    <xhtml:link rel="alternate" hreflang="ar" href="${arUrl}" />
    <xhtml:link rel="alternate" hreflang="ru" href="${ruUrl}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${enUrl}" />
  </url>`
      
      // Arabic version
      sitemap += `
  <url>
    <loc>${arUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}" />
    <xhtml:link rel="alternate" hreflang="ar" href="${arUrl}" />
    <xhtml:link rel="alternate" hreflang="ru" href="${ruUrl}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${enUrl}" />
  </url>`
      
      // Russian version
      sitemap += `
  <url>
    <loc>${ruUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}" />
    <xhtml:link rel="alternate" hreflang="ar" href="${arUrl}" />
    <xhtml:link rel="alternate" hreflang="ru" href="${ruUrl}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${enUrl}" />
  </url>`
    }

    // Add static pages with multilingual support
    staticPages.forEach(page => {
      addUrlWithHreflang(page.url, page.lastmod, page.changefreq, page.priority)
    })

    // Add optimized SEO URLs (English only - these are redirect URLs)
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
    <lastmod>${staticContentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    })

    // English-only pages (no AR/RU versions exist — would 404)
    const englishOnlyPages = [
      { url: '/genosys', priority: '0.7' },
      { url: '/documents', priority: '0.6' },
    ]
    englishOnlyPages.forEach(page => {
      sitemap += `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${staticContentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    })

    // Add product pages with multilingual support
    products.forEach(product => {
      const productPath = `/products/${product.id}`
      // Use product's updatedAt if available, otherwise current date
      const productLastmod = product.updatedAt 
        ? new Date(product.updatedAt).toISOString() 
        : currentDate
      addUrlWithHreflang(productPath, productLastmod, 'weekly', '0.8')
    })

    // Add concern-based SEO landing pages with multilingual support
    const concerns = ['sun-protection', 'acne-treatment', 'pigmentation', 'scars-treatment', 'hair-loss', 'anti-aging', 'hydration', 'sensitivity']
    concerns.forEach(concern => {
      addUrlWithHreflang(`/products/concern/${concern}`, currentDate, 'weekly', '0.8')
    })

    // Add category SEO landing pages with multilingual support
    const categoryPages = ['microneedling', 'pro-solution', 'cleanser', 'peeling', 'toner-mist', 'serum', 'cream', 'mask', 'sun', 'cushion-bb', 'scalp-hair', 'eye-care', 'device', 'bio-meso']
    categoryPages.forEach(cat => {
      addUrlWithHreflang(`/products/category/${cat}`, currentDate, 'weekly', '0.7')
    })

    // Add location pages with multilingual support
    const locations = ['dubai', 'abu-dhabi', 'sharjah', 'ras-al-khaimah', 'ajman', 'fujairah', 'umm-al-quwain']
    locations.forEach(location => {
      const locationPath = `/locations/${location}`
      addUrlWithHreflang(locationPath, staticContentDate, 'monthly', '0.6')
    })

    // Add blog posts (if table exists)
    try {
      type PrismaWithBlogPost = typeof prisma & {
        blogPost?: {
          findMany: (args: {
            where: { published: boolean }
            select: { slug: true; updatedAt: true }
            take: number
          }) => Promise<Array<{ slug: string; updatedAt: Date }>>
        }
      }
      const prismaWithBlogPost = prisma as PrismaWithBlogPost
      const blogPosts = await prismaWithBlogPost.blogPost?.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
        take: 500, // Increased limit for growing blog
      }) || []
      
      if (Array.isArray(blogPosts)) {
        blogPosts.forEach((post: { slug: string; updatedAt: Date }) => {
          const blogPath = `/blog/${post.slug}`
          addUrlWithHreflang(blogPath, post.updatedAt.toISOString(), 'weekly', '0.7')
        })
      }
    } catch (error) {
      errorLog('Error fetching blog posts for sitemap (table may not exist yet):', error)
    }

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
