import { MetadataRoute } from 'next'
import { getAllProducts } from '@/lib/productsDb'
import { errorLog } from '@/lib/logger'
import { Product } from '@/types/index'
import { prisma } from '@/lib/prisma'
import { getCanonicalProductSlug, getProductImageUrls } from '@/lib/seo'
import { SEO_LANDING_PAGES } from '@/lib/seoLandingPages'
import { CATEGORY_PAGES, getAllConcernSlugs } from '@/lib/concernsData'
import { getConcernVisual } from '@/lib/concernVisuals'

const BASE_URL = 'https://genosys.ae'

function localizedUrls(path: string, lastModified: Date, priority: number, changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'], images?: string[]): MetadataRoute.Sitemap {
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
  // `images` emits <image:image> sub-entries (Google image sitemap) so product
  // photos are discoverable in Google Images without relying on HTML crawl.
  const imgProp = images && images.length > 0 ? { images } : {}

  return [
    { url: `${BASE_URL}${enPath}`, lastModified, changeFrequency, priority, alternates, ...imgProp },
    { url: `${BASE_URL}${arPath}`, lastModified, changeFrequency, priority, alternates, ...imgProp },
    { url: `${BASE_URL}${ruPath}`, lastModified, changeFrequency, priority, alternates, ...imgProp },
  ]
}

function singleLocaleUrl(path: string, lastModified: Date, priority: number, changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']): MetadataRoute.Sitemap[number] {
  return { url: `${BASE_URL}${path}`, lastModified, changeFrequency, priority }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const staticDate = new Date('2026-02-12T00:00:00.000Z')
  // Stable lastmod for editorial landing pages (guides, concern + category
  // pages). Their content is code-defined and rarely changes, so they must
  // NOT report `now` on every sitemap regeneration — a constantly-moving
  // lastmod trains Google to ignore the signal and deprioritise crawling
  // (a known driver of "Discovered – currently not indexed"). Bump this date
  // only when the landing-page copy actually changes.
  const contentDate = new Date('2026-07-13T00:00:00.000Z')

  const staticPages: Array<{ path: string; lastModified: Date; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }> = [
    // Home + /products use a stable date, not `now`: a lastmod that changes on
    // every ISR regeneration trains Google to ignore the signal. Product entries
    // below still carry their real per-row updatedAt.
    { path: '', lastModified: contentDate, priority: 1.0, changeFrequency: 'daily' },
    { path: '/about', lastModified: staticDate, priority: 0.8, changeFrequency: 'monthly' },
    { path: '/brand', lastModified: staticDate, priority: 0.8, changeFrequency: 'monthly' },
    { path: '/products', lastModified: contentDate, priority: 0.9, changeFrequency: 'daily' },
    { path: '/blog', lastModified: contentDate, priority: 0.8, changeFrequency: 'weekly' },
    { path: '/faq', lastModified: staticDate, priority: 0.7, changeFrequency: 'monthly' },
    { path: '/locations', lastModified: staticDate, priority: 0.7, changeFrequency: 'monthly' },
    { path: '/training', lastModified: staticDate, priority: 0.7, changeFrequency: 'monthly' },
    { path: '/contact', lastModified: staticDate, priority: 0.8, changeFrequency: 'monthly' },
    { path: '/delivery', lastModified: staticDate, priority: 0.6, changeFrequency: 'monthly' },
    { path: '/partners', lastModified: staticDate, priority: 0.6, changeFrequency: 'monthly' },
    { path: '/skin-recommendation', lastModified: staticDate, priority: 0.6, changeFrequency: 'monthly' },
    { path: '/privacy-policy', lastModified: staticDate, priority: 0.3, changeFrequency: 'yearly' },
    { path: '/terms', lastModified: staticDate, priority: 0.3, changeFrequency: 'yearly' },
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
  ]

  for (const page of englishOnlyPages) {
    entries.push(singleLocaleUrl(page.path, page.lastModified, page.priority, 'monthly'))
  }

  // Guides exist in EN, AR, and RU (same slugs under /ar/guides and /ru/guides)
  entries.push(...localizedUrls('/guides', contentDate, 0.7, 'monthly'))
  for (const page of SEO_LANDING_PAGES) {
    const guideImages = (page.featuredProducts || []).map(product => `${BASE_URL}${product.image}`)
    entries.push(...localizedUrls(`/guides/${page.slug}`, contentDate, 0.8, 'monthly', guideImages))
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
    // Cap at 5 images per product to keep the sitemap lean; the main image
    // comes first via getProductImageUrls.
    const images = getProductImageUrls(product).slice(0, 5)
    entries.push(...localizedUrls(`/products/${getCanonicalProductSlug(product)}`, lastMod, 0.8, 'weekly', images))
  }

  // Concern-based landing pages (static editorial content → stable lastmod)
  for (const concern of getAllConcernSlugs()) {
    const visual = getConcernVisual(concern)
    const images = visual ? [`${BASE_URL}${visual.image}`] : undefined
    entries.push(...localizedUrls(`/products/concern/${concern}`, contentDate, 0.8, 'weekly', images))
  }

  // Category landing pages (static editorial content → stable lastmod).
  // Only advertise categories that actually contain products — an empty
  // category page returns a 404 (see app/products/category/[slug]) and would
  // otherwise show up as a Soft 404 / "Not found" in Search Console. This is
  // data-driven so it self-heals: e.g. bio-meso reappears once a product is
  // tagged with that category.
  for (const category of CATEGORY_PAGES) {
    const hasProducts = products.some(p =>
      (p.category || '').toLowerCase().includes(category.categoryKey.toLowerCase())
    )
    if (!hasProducts) continue
    entries.push(...localizedUrls(`/products/category/${category.slug}`, contentDate, 0.7, 'weekly'))
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
