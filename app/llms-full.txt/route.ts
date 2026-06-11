import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAllProducts } from '@/lib/productsDb'
import { errorLog } from '@/lib/logger'
import { buildUrl } from '@/lib/siteConfig'
import { CONCERN_PAGES } from '@/lib/concernsData'
import { SEO_LANDING_PAGES } from '@/lib/seoLandingPages'
import {
  getCanonicalProductSlug,
  getLocalizedProductDescription,
  getLocalizedProductName,
  parseStringArray,
  stripHtml,
  truncateText,
} from '@/lib/seo'

export const revalidate = 3600

type LlmBlogPost = {
  title: string
  titleAr: string | null
  titleRu: string | null
  slug: string
  excerpt: string | null
  excerptAr: string | null
  excerptRu: string | null
  content: string
  publishedAt: Date | null
  updatedAt: Date
}

async function getBlogPosts(): Promise<LlmBlogPost[]> {
  type PrismaWithBlogPost = typeof prisma & {
    blogPost?: {
      findMany: (args: {
        where: { published: boolean }
        orderBy: { publishedAt: 'desc' }
        take: number
        select: {
          title: true
          titleAr: true
          titleRu: true
          slug: true
          excerpt: true
          excerptAr: true
          excerptRu: true
          content: true
          publishedAt: true
          updatedAt: true
        }
      }) => Promise<LlmBlogPost[]>
    }
  }

  const typedPrisma = prisma as PrismaWithBlogPost
  return typedPrisma.blogPost?.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
    take: 30,
    select: {
      title: true,
      titleAr: true,
      titleRu: true,
      slug: true,
      excerpt: true,
      excerptAr: true,
      excerptRu: true,
      content: true,
      publishedAt: true,
      updatedAt: true,
    },
  }) || []
}

export async function GET() {
  try {
    const [products, posts] = await Promise.all([
      getAllProducts(),
      getBlogPosts(),
    ])

    const visibleProducts = products.filter(product => !product.isHidden)
    const categories = Array.from(new Set(visibleProducts.map(product => product.category).filter(Boolean))).sort()

    const productIndex = visibleProducts.map(product => {
      const concerns = parseStringArray(product.targetConcerns)
      const price = product.isPriceOnRequest || !product.price
        ? 'price on request'
        : `${product.price} AED`

      return [
        `- [${getLocalizedProductName(product, 'en')}](${buildUrl(`/products/${getCanonicalProductSlug(product)}`)})`,
        `  Category: ${product.category}. Price: ${price}. Availability: ${product.inStock ? 'in stock' : 'out of stock'}.`,
        `  Summary: ${truncateText(getLocalizedProductDescription(product, 'en'), 350)}`,
        product.nameAr ? `  Arabic: ${getLocalizedProductName(product, 'ar')}` : null,
        product.nameRu ? `  Russian: ${getLocalizedProductName(product, 'ru')}` : null,
        concerns.length > 0 ? `  Concerns: ${concerns.join(', ')}` : null,
      ].filter(Boolean).join('\n')
    })

    const blogIndex = posts.map(post => {
      const summary = truncateText(stripHtml(post.excerpt || post.content), 350)
      return [
        `- [${post.title}](${buildUrl(`/blog/${post.slug}`)})`,
        `  Summary: ${summary}`,
        post.titleAr ? `  Arabic title: ${post.titleAr}` : null,
        post.titleRu ? `  Russian title: ${post.titleRu}` : null,
      ].filter(Boolean).join('\n')
    })

    const body = `# GENOSYS Full LLM Index

This file is an expanded AI-readable index for GENOSYS Middle East.

## Official Facts

- Brand: GENOSYS
- UAE operator: Genosys Middle East FZ-LLC
- Role: Official UAE distributor of GENOSYS professional Korean dermacosmetics
- Manufacturer / brand origin: DTS MG Co., Ltd., Seoul, South Korea
- UAE certification: Dubai Municipality certified through the Montaji System
- VAT: VAT-registered in the United Arab Emirates
- Operating in the UAE since: 2019
- Market: Dubai, Abu Dhabi, Sharjah, Ajman, Ras Al Khaimah, Fujairah, Umm Al Quwain
- Currency: AED
- Payment methods: Visa, Mastercard, Apple Pay, Google Pay via Stripe
- Shipping: UAE delivery, free shipping on orders over 1000 AED
- Languages: English, Arabic, Russian
- Contact: ${buildUrl('/contact')}

## Canonical Entry Points

- English homepage: ${buildUrl('/')}
- Arabic homepage: ${buildUrl('/ar')}
- Russian homepage: ${buildUrl('/ru')}
- Products: ${buildUrl('/products')}
- Blog: ${buildUrl('/blog')}
- Training: ${buildUrl('/training')}
- Partner program: ${buildUrl('/partners')}
- Product XML feed: ${buildUrl('/feed/products.xml')}
- AI product index: ${buildUrl('/ai-products.txt')}
- Blog RSS: ${buildUrl('/feed/blog.xml')}
- Blog Atom: ${buildUrl('/feed/blog.atom')}
- XML sitemap: ${buildUrl('/sitemap.xml')}

## Product Categories

${categories.map(category => `- ${category}: ${buildUrl(`/products?categories=${encodeURIComponent(category)}`)}`).join('\n')}

## Skin Concern Pages

${CONCERN_PAGES.map(concern => `- ${concern.seo.en.h1}: ${buildUrl(`/products/concern/${concern.slug}`)} — ${concern.seo.en.intro}`).join('\n')}

## Commercial Guides

${SEO_LANDING_PAGES.map(page => `- [${page.h1}](${buildUrl(`/guides/${page.slug}`)}): ${page.description}`).join('\n')}

## Product Index

${productIndex.join('\n\n')}

## Blog Index

${blogIndex.join('\n\n')}
`

    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    errorLog('Error generating full LLM index:', error)
    return new NextResponse('Error generating full LLM index', { status: 500 })
  }
}
