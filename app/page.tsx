import Hero from '@/components/Hero'
import HomeDesktopSections from '@/components/home/HomeDesktopSections'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import SpeakableSchema from '@/components/schema/SpeakableSchema'
import ArticleDateSchema from '@/components/schema/ArticleDateSchema'
import GeoFaqSchema, { GENOSYS_FAQ_EN } from '@/components/schema/GeoFaqSchema'
import MobileRedirect from '@/components/MobileRedirect'
import { getAllProducts } from '@/lib/productsDb'
import { unstable_cache } from 'next/cache'
import type { Metadata } from 'next'
import type { Product } from '@/types'

// Revalidate homepage data every 5 minutes. Featured products rarely change
// and we do not want to hit the DB on every request.
export const revalidate = 300

// Curated featured-product slugs. If a slug does not match, we fall back to
// the first in-stock non-hidden products from the catalog so the rail is
// never empty.
const FEATURED_PRODUCT_IDS = ['1', '2', '4', '5']

// Category slugs shown on the homepage rail. Keep in sync with
// FEATURED_CATEGORY_SLUGS in HomeDesktopSections.tsx.
const HOME_CATEGORY_SLUGS = [
  'microneedling',
  'pro-solution',
  'serum',
  'cream',
  'mask',
  'sun',
] as const

// Hand-picked product IDs per category — chosen for the best possible tile
// imagery (big hero shots over small pack shots, and real category hero
// products, e.g. an actual cream jar for the Cream tile rather than a kit
// or duo). If a preferred ID is out of stock / hidden we fall back to the
// first visible product in that category.
const CATEGORY_PREFERRED_PRODUCT_IDS: Record<string, string> = {
  microneedling: '1',   // Microneedle Roller
  'pro-solution': '4',  // POWER SOLUTION HES — has a large "hes_big1" shot
  serum: '21',          // MULTI VITA RADIANCE SERUM — large "rd_big" shot
  cream: '23',          // ND Cell ANTI-WRINKLE CREAM — a real cream jar
  mask: '36',           // SOOTHING BOMB SEA ALGAE MASK — has a large shot
  sun: '39',            // ULTRA SHIELD SUN CREAM SPF 50+ — has large shot
}

/**
 * Hard overrides for category-tile imagery. Use when the "second hero shot"
 * we want to show on the rail lives in /public/images/Second/ but is NOT in
 * the product's `images[]` gallery in the DB. This keeps the home rail
 * looking premium without requiring a product-data migration.
 *
 *   cream → ND Cell ANTI-WRINKLE CREAM (product 23) has no gallery, so we
 *           point the tile at the canonical nd_big1 hero shot directly.
 */
const CATEGORY_IMAGE_OVERRIDES: Record<string, string> = {
  cream: '/images/Second/nd_big1.jpg',
}

/**
 * Prefer the SECOND image from the product gallery when available — those
 * are typically larger hero shots (see /public/images/Second/*). Fall back
 * to the first gallery image, then to the legacy `image` field.
 */
function pickCategoryImage(p: Product): string | undefined {
  if (p.images) {
    try {
      const arr = JSON.parse(p.images) as string[]
      if (Array.isArray(arr)) {
        if (arr[1]) return arr[1]
        if (arr[0]) return arr[0]
      }
    } catch {
      /* noop */
    }
  }
  return p.image || undefined
}

function normalizeCategory(raw?: string): string {
  return (raw ?? '').toLowerCase().replace(/\s+/g, '-')
}

const getHomeData = unstable_cache(
  async (): Promise<{ featured: Product[]; categoryImages: Record<string, string> }> => {
    const all = await getAllProducts()
    const visible = all.filter(p => p.inStock && !p.isHidden)

    // Featured rail — curated IDs first, top up with any visible product.
    const curated = FEATURED_PRODUCT_IDS
      .map(id => visible.find(p => p.id === id))
      .filter((p): p is Product => Boolean(p))
    const curatedIds = new Set(curated.map(p => p.id))
    for (const p of visible) {
      if (curated.length >= 4) break
      if (!curatedIds.has(p.id)) {
        curated.push(p)
        curatedIds.add(p.id)
      }
    }
    const featured = curated.slice(0, 4)

    // Category backdrops — prefer the curated product for each slug, fall
    // back to the first visible product in that category. Explicit overrides
    // (CATEGORY_IMAGE_OVERRIDES) win over everything when set.
    const categoryImages: Record<string, string> = {}
    for (const slug of HOME_CATEGORY_SLUGS) {
      const override = CATEGORY_IMAGE_OVERRIDES[slug]
      if (override) {
        categoryImages[slug] = override
        continue
      }
      const preferredId = CATEGORY_PREFERRED_PRODUCT_IDS[slug]
      const preferred = preferredId ? visible.find(p => p.id === preferredId) : undefined
      const match =
        preferred ??
        visible.find(p => normalizeCategory(p.category) === slug)
      if (match) {
        const img = pickCategoryImage(match)
        if (img) categoryImages[slug] = img
      }
    }

    return { featured, categoryImages }
  },
  ['home-data-v4'],
  { revalidate: 300, tags: ['products'] }
)

export const metadata: Metadata = {
  title: 'GENOSYS Middle East FZ-LLC | Official Korean Dermacosmetics Distributor UAE',
  description: 'Official distributor of GENOSYS professional Korean dermacosmetics in UAE. Premium microneedling devices, skincare products & beauty treatments. Free shipping over 1000 AED. Dubai, Abu Dhabi, Sharjah.',
  keywords: [
    'GENOSYS UAE',
    'Korean dermacosmetics Dubai',
    'professional skincare UAE',
    'microneedling devices Dubai',
    'Korean beauty products UAE',
    'GENOSYS distributor UAE',
    'professional skincare Dubai',
    'Korean cosmetics Abu Dhabi',
    'dermacosmetics Sharjah',
    'beauty devices UAE',
    'GENOSYS Middle East',
    'Korean skincare UAE'
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'GENOSYS Middle East FZ-LLC | Official Korean Dermacosmetics Distributor UAE',
    description: 'Official distributor of GENOSYS professional Korean dermacosmetics in UAE. Premium microneedling devices, skincare products & beauty treatments. Free shipping over 1000 AED.',
    type: 'website',
    url: 'https://genosys.ae',
    siteName: 'GENOSYS Middle East FZ-LLC',
    images: [
      {
        url: 'https://genosys.ae/images/genosys-products.jpg',
        width: 1200,
        height: 630,
        alt: 'GENOSYS Premium Korean Dermacosmetics',
      },
    ],
    locale: 'en_AE',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@genosys_official',
    creator: '@genosys_official',
    title: 'GENOSYS Middle East FZ-LLC | Official Korean Dermacosmetics Distributor UAE',
    description: 'Official distributor of GENOSYS professional Korean dermacosmetics in UAE. Premium microneedling devices and skincare products.',
    images: ['https://genosys.ae/images/genosys-products.jpg'],
  },
  alternates: {
    canonical: 'https://genosys.ae',
    languages: {
      'en': 'https://genosys.ae',
      'ar': 'https://genosys.ae/ar',
      'ru': 'https://genosys.ae/ru',
    },
  },
}

export default async function Home() {
  // Fetch homepage data on the server (cached 5min). We intentionally keep
  // this outside MobileRedirect so crawlers still see a rich homepage even
  // when mobile browsers get bounced to /products.
  const { featured, categoryImages } = await getHomeData()

  return (
    <MobileRedirect to="/products">
      <div className="bg-gradient-to-b from-white to-gray-50 flex-1 flex flex-col" dir="ltr">
        <BreadcrumbSchema
          items={[
            { name: 'Home', url: '/' }
          ]}
        />
        <SpeakableSchema url="/" />
        <ArticleDateSchema
          datePublished="2024-01-01T00:00:00.000Z"
          dateModified={new Date().toISOString()}
          url="https://genosys.ae"
        />
        <GeoFaqSchema items={GENOSYS_FAQ_EN} pageUrl="/" language="en" />
        <Hero initialLocale="en" initialDir="ltr" />
        {/* Desktop-only homepage body — categories, concerns, featured, why
            GENOSYS, newsletter. Each section opts out of mobile via hidden
            md:block. See components/home/HomeDesktopSections.tsx. */}
        <HomeDesktopSections
          locale="en"
          dir="ltr"
          featuredProducts={featured}
          categoryImages={categoryImages}
        />
      </div>
    </MobileRedirect>
  )
}
