import { NextRequest, NextResponse } from 'next/server'
import { getAllProducts } from '@/lib/productsDb'
import { errorLog } from '@/lib/logger'
import { Product } from '@/types/index'
import { prisma } from '@/lib/prisma'
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
        url: '/blog',
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: '0.8'
      },
      {
        url: '/faq',
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: '0.7'
      },
      {
        url: '/locations',
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: '0.7'
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

    // Helper function to add URL with hreflang tags
    const addUrlWithHreflang = (url: string, lastmod: string, changefreq: string, priority: string) => {
      // Handle home page (empty URL)
      const enUrl = url === '' ? `${baseUrl}/` : `${baseUrl}${url}`
      const arUrl = url === '' ? `${baseUrl}/ar` : `${baseUrl}/ar${url}`
      const ruUrl = url === '' ? `${baseUrl}/ru` : `${baseUrl}/ru${url}`
      
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
  </url>
  <url>
    <loc>${arUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}" />
    <xhtml:link rel="alternate" hreflang="ar" href="${arUrl}" />
    <xhtml:link rel="alternate" hreflang="ru" href="${ruUrl}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${enUrl}" />
  </url>
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

    // Add optimized URLs (English only - these are redirect URLs)
    optimizedUrls.forEach(page => {
      sitemap += `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    })

    // Add product pages with multilingual support
    products.forEach(product => {
      const productPath = `/products/${product.id}`
      addUrlWithHreflang(productPath, currentDate, 'weekly', '0.8')
    })

    // Add location pages with multilingual support
    const locations = ['dubai', 'abu-dhabi', 'sharjah', 'ras-al-khaimah', 'ajman', 'fujairah', 'umm-al-quwain']
    locations.forEach(location => {
      const locationPath = `/locations/${location}`
      addUrlWithHreflang(locationPath, currentDate, 'monthly', '0.6')
    })

    // Add blog posts (if table exists)
    try {
      // Check if blog_posts table exists by attempting to query it
      // Using type assertion for Prisma client that may not have updated types
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
        take: 100,
      }) || []
      
      if (Array.isArray(blogPosts)) {
        blogPosts.forEach((post: { slug: string; updatedAt: Date }) => {
          const blogPath = `/blog/${post.slug}`
          addUrlWithHreflang(blogPath, post.updatedAt.toISOString(), 'weekly', '0.7')
        })
      }
    } catch (error) {
      // Table might not exist yet - that's okay, sitemap will still work
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
