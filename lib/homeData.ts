import { unstable_cache } from 'next/cache'
import { getAllProducts, filterProductsByConcern } from '@/lib/productsDb'
import { prisma } from '@/lib/prisma'
import { warnLog } from '@/lib/logger'
import { CONCERN_PAGES, CATEGORY_PAGES } from '@/lib/concernsData'
import type { Product } from '@/types'

/**
 * Homepage data — bestsellers + category tile imagery + tile product counts.
 *
 * Used by all three locale homepages (/, /ar, /ru) so the tile art and the
 * bestsellers rail stay in lockstep across languages and everyone hits the
 * same cached payload (one DB read for the whole site every 5 minutes).
 */

// How far back to look when computing real bestsellers from order history.
const BESTSELLER_WINDOW_DAYS = 180

// A product counts as a "new arrival" if it was added within this window.
// Keeps the rail genuinely fresh and self-expiring — no manual curation.
const NEW_ARRIVAL_WINDOW_DAYS = 120
const NEW_ARRIVAL_MAX = 4

// Fallback featured-product IDs if the order-history query fails or returns
// too few products (e.g. right after a DB restore). The rail must never be
// empty, so we top up from the visible catalog as a last resort.
const FEATURED_FALLBACK_IDS = ['36', '41', '39', '21']

// Category slugs shown on the homepage rail. Keep in sync with
// FEATURED_CATEGORY_SLUGS in components/home/HomeDesktopSections.tsx.
//
// Exported so the JSON-LD ItemList schema on the homepage can mirror the
// exact set of tiles that are visible to the user.
export const HOME_CATEGORY_SLUGS = [
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
  microneedling: '1', // Microneedle Roller
  'pro-solution': '4', // POWER SOLUTION HES — has a large "hes_big1" shot
  serum: '21', // MULTI VITA RADIANCE SERUM — large "rd_big" shot
  cream: '32', // MULTI FUNCTIONAL ANTI-WRINKLE CREAM — clearer Cream tile product
  mask: '36', // SOOTHING BOMB SEA ALGAE MASK — has a large shot
  sun: '39', // ULTRA SHIELD SUN CREAM SPF 50+ — has large shot
}

/**
 * Hard overrides for category-tile imagery. Use when the "second hero shot"
 * we want to show on the rail lives in /public/images/Second/ but is NOT in
 * the product's `images[]` gallery in the DB. This keeps the home rail
 * looking premium without requiring a product-data migration.
 */
const CATEGORY_IMAGE_OVERRIDES: Record<string, string> = {
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

/**
 * Does a product belong to a homepage category tile? Mirrors the matching
 * used for tile imagery: exact slug, exact categoryKey, or substring for
 * multi-category products like "Cushion BB, Sun, Cream".
 */
function matchesCategory(product: Product, slug: string, categoryKey: string): boolean {
  const productCat = (product.category ?? '').toLowerCase()
  const key = categoryKey.toLowerCase()
  return (
    normalizeCategory(product.category) === slug ||
    productCat === key ||
    productCat.includes(key)
  )
}

/**
 * Real bestsellers: units sold across paid/delivered orders in the last
 * BESTSELLER_WINDOW_DAYS, mapped back to visible in-stock products.
 * (Paid Stripe orders + delivered COD orders both count as real sales.)
 */
async function computeBestsellers(visible: Product[]): Promise<Product[]> {
  const since = new Date(Date.now() - BESTSELLER_WINDOW_DAYS * 24 * 3600 * 1000)
  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gte: since },
      OR: [{ paymentStatus: 'paid' }, { status: 'DELIVERED' }],
    },
    select: { items: { select: { productId: true, quantity: true } } },
  })

  const unitsByProductId = new Map<string, number>()
  for (const order of orders) {
    for (const item of order.items) {
      unitsByProductId.set(
        item.productId,
        (unitsByProductId.get(item.productId) ?? 0) + item.quantity
      )
    }
  }

  // Order items store either the product id or the productNumber, so match both.
  const productByKey = new Map<string, Product>()
  for (const p of visible) {
    productByKey.set(p.id, p)
    if (p.productNumber) productByKey.set(p.productNumber, p)
  }

  const ranked: { product: Product; units: number }[] = []
  const seen = new Set<string>()
  for (const [productId, units] of unitsByProductId) {
    const product = productByKey.get(productId)
    if (!product || seen.has(product.id)) continue
    seen.add(product.id)
    ranked.push({ product, units })
  }
  ranked.sort((a, b) => b.units - a.units)
  return ranked.map(r => r.product)
}

export interface HomeData {
  featured: Product[]
  /** Newest visible products (added within NEW_ARRIVAL_WINDOW_DAYS), newest first. */
  newArrivals: Product[]
  categoryImages: Record<string, string>
  /** Visible product count per homepage category slug. */
  categoryCounts: Record<string, number>
  /** Visible product count per concern slug. */
  concernCounts: Record<string, number>
}

export const getHomeData = unstable_cache(
  async (): Promise<HomeData> => {
    const all = await getAllProducts()
    const visible = all.filter(p => p.inStock && !p.isHidden)

    // Bestsellers rail — real sales data first, curated fallback on failure.
    let featured: Product[] = []
    try {
      featured = (await computeBestsellers(visible)).slice(0, 4)
    } catch (error) {
      warnLog('[homeData] bestseller query failed; using curated fallback', error)
    }
    if (featured.length < 4) {
      const usedIds = new Set(featured.map(p => p.id))
      for (const id of FEATURED_FALLBACK_IDS) {
        if (featured.length >= 4) break
        const p = visible.find(v => v.id === id || v.productNumber === id)
        if (p && !usedIds.has(p.id)) {
          featured.push(p)
          usedIds.add(p.id)
        }
      }
      for (const p of visible) {
        if (featured.length >= 4) break
        if (!usedIds.has(p.id)) {
          featured.push(p)
          usedIds.add(p.id)
        }
      }
    }

    // Category backdrops — prefer the curated product for each slug, fall
    // back to the first visible product in that category. Explicit overrides
    // (CATEGORY_IMAGE_OVERRIDES) win over everything when set.
    const categoryImages: Record<string, string> = {}
    const categoryCounts: Record<string, number> = {}
    for (const slug of HOME_CATEGORY_SLUGS) {
      const page = CATEGORY_PAGES.find(c => c.slug === slug)
      const categoryKey = page?.categoryKey ?? slug
      categoryCounts[slug] = visible.filter(p => matchesCategory(p, slug, categoryKey)).length

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

    // Concern tile counts — same matching the concern landing pages use, so
    // the number on the homepage card equals what the visitor finds after
    // clicking through.
    const concernCounts: Record<string, number> = {}
    for (const concern of CONCERN_PAGES) {
      concernCounts[concern.slug] = filterProductsByConcern(
        visible,
        concern.concernKeys,
        concern.categoryFallbacks
      ).length
    }

    // New arrivals — newest products added in the last NEW_ARRIVAL_WINDOW_DAYS,
    // excluding anything already on the bestsellers rail. Doubles as internal
    // linking from the homepage so Google discovers/indexes new PDPs quickly.
    const featuredIds = new Set(featured.map(p => p.id))
    const arrivalCutoff = Date.now() - NEW_ARRIVAL_WINDOW_DAYS * 24 * 3600 * 1000
    const newArrivals = visible
      .filter(p => {
        if (featuredIds.has(p.id)) return false
        const created = p.createdAt ? new Date(p.createdAt).getTime() : 0
        return created >= arrivalCutoff
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
      )
      .slice(0, NEW_ARRIVAL_MAX)

    return { featured, newArrivals, categoryImages, categoryCounts, concernCounts }
  },
  ['home-data-v7'],
  { revalidate: 300, tags: ['products'] }
)
