import { MetadataRoute } from 'next'
import { getAllProducts } from '@/lib/productsDb'
import { errorLog } from '@/lib/logger'
import { Product } from '@/types/index'
import { prisma } from '@/lib/prisma'
import { getCanonicalProductSlug } from '@/lib/seo'
import { SEO_LANDING_PAGES } from '@/lib/seoLandingPages'

const BASE_URL = 'https://genosys.ae'

function localizedUrls(path: string, lastModified: Date, priority: number, changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']): MetadataRoute.Sitemap {
  const enPath = path === '' ? '/' : path
  const arPath = path === '' ? '/ar' : `/ar${path}`
  const ruPath = path === '' ? '/ru' : `/ru${path}`

  const alternates = {
    languages: {
      en: `${BASE_URL}${enPath}`,
      ar: `${BASE_URL}${arPath}`,
      ru: `${BASE_URL}${ruPath}`,
      'x-default': `${BASE_URL}${enPath}`,
    },
  }

  return [
    { url: `${BASE_URL}${enPath}`, lastModified, changeFrequency, priority, alternates },
    { url: `${BASE_URL}${arPath}`, lastModified, changeFrequency, priority, alternates },
    { url: `${BASE_URL}${ruPath}`, lastModified, changeFrequency, priority, alternates },
  ]
}

function singleLocaleUrl(path: string, lastModified: Date, priority: number, changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']): MetadataRoute.Sitemap[number] {
  return { url: `${BASE_URL}${path}`, lastModified, changeFrequency, priority }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const staticDate = new Date('2026-02-12T00:00:00.000Z')

  const staticPages: Array<{ path: string; lastModified: Date; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }> = [
    { path: '', lastModified: now, priority: 1.0, changeFrequency: 'daily' },
    { path: '/about', lastModified: staticDate, priority: 0.8, changeFrequency: 'monthly' },
    { path: '/brand', lastModified: staticDate, priority: 0.8, changeFrequency: 'monthly' },
    { path: '/products', lastModified: now, priority: 0.9, changeFrequency: 'daily' },
    { path: '/blog', lastModified: now, priority: 0.8, changeFrequency: 'weekly' },
    { path: '/faq', lastModified: staticDate, priority: 0.7, changeFrequency: 'monthly' },
    { path: '/locations', lastModified: staticDate, priority: 0.7, changeFrequency: 'monthly' },
    { path: '/training', lastModified: staticDate, priority: 0.7, changeFrequency: 'monthly' },
    { path: '/contact', lastModified: staticDate, priority: 0.8, changeFrequency: 'monthly' },
    { path: '/delivery', lastModified: staticDate, priority: 0.6, changeFrequency: 'monthly' },
    { path: '/partners', lastModified: staticDate, priority: 0.6, changeFrequency: 'monthly' },
    { path: '/skin-recommendation', lastModified: staticDate, priority: 0.6, changeFrequency: 'monthly' },
    { path: '/privacy-policy', lastModified: staticDate, priority: 0.3, changeFrequency: 'yearly' },
    { path: '/bundle-builder', lastModified: staticDate, priority: 0.5, changeFrequency: 'monthly' },
  ]

  const entries: MetadataRoute.Sitemap = []

  for (const page of staticPages) {
    entries.push(...localizedUrls(page.path, page.lastModified, page.priority, page.changeFrequency))
  }

  // English-only pages (no AR/RU versions). Keep these out of localizedUrls()
  // so the sitemap does not advertise localized variants that do not exist.
  const englishOnlyPages = [
    { path: '/genosys', lastModified: staticDate, priority: 0.7 },
    { path: '/documents', lastModified: staticDate, priority: 0.6 },
    { path: '/guides', lastModified: now, priority: 0.7 },
    ...SEO_LANDING_PAGES.map(page => ({ path: `/guides/${page.slug}`, lastModified: now, priority: 0.8 })),
  ]

  for (const page of englishOnlyPages) {
    entries.push(singleLocaleUrl(page.path, page.lastModified, page.priority, 'monthly'))
  }

  // Product pages
  let products: Product[] = []
  try {
    products = await getAllProducts()
  } catch (error) {
    errorLog('Error fetching products for sitemap:', error)
  }

  for (const product of products) {
    const lastMod = product.updatedAt ? new Date(product.updatedAt) : now
    entries.push(...localizedUrls(`/products/${getCanonicalProductSlug(product)}`, lastMod, 0.8, 'weekly'))
  }

  // Concern-based landing pages
  const concerns = ['sun-protection', 'acne-treatment', 'pigmentation', 'scars-treatment', 'hair-loss', 'anti-aging', 'hydration', 'sensitivity']
  for (const concern of concerns) {
    entries.push(...localizedUrls(`/products/concern/${concern}`, now, 0.8, 'weekly'))
  }

  // Category landing pages
  const categories = ['microneedling', 'pro-solution', 'cleanser', 'peeling', 'toner-mist', 'serum', 'cream', 'mask', 'sun', 'cushion-bb', 'scalp-hair', 'eye-care', 'device', 'bio-meso']
  for (const cat of categories) {
    entries.push(...localizedUrls(`/products/category/${cat}`, now, 0.7, 'weekly'))
  }

  // Location pages
  const locations = ['dubai', 'abu-dhabi', 'sharjah', 'ras-al-khaimah', 'ajman', 'fujairah', 'umm-al-quwain']
  for (const location of locations) {
    entries.push(...localizedUrls(`/locations/${location}`, staticDate, 0.6, 'monthly'))
  }

  // Blog posts
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
      take: 500,
    }) || []

    if (Array.isArray(blogPosts)) {
      for (const post of blogPosts) {
        entries.push(...localizedUrls(`/blog/${post.slug}`, post.updatedAt, 0.7, 'weekly'))
      }
    }
  } catch (error) {
    errorLog('Error fetching blog posts for sitemap (table may not exist yet):', error)
  }

  return entries
}
