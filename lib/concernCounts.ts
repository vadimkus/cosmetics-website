import { unstable_cache } from 'next/cache'
import { getAllProducts, filterProductsByConcern } from '@/lib/productsDb'
import { CONCERN_PAGES } from '@/lib/concernsData'
import type { Product } from '@/types'

/**
 * Product counts for the concern tiles.
 *
 * One implementation, because the homepage and /products render the same
 * showcase and would otherwise print different numbers for the same concern -
 * which is exactly what happened when /products fell back to the hardcoded
 * defaults on the cards.
 *
 * The matching is the same one the concern landing pages use, so the number on
 * the tile equals what the visitor finds after clicking through.
 */
export function countProductsByConcern(visible: Product[]): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const concern of CONCERN_PAGES) {
    counts[concern.slug] = filterProductsByConcern(
      visible,
      concern.concernKeys,
      concern.categoryFallbacks
    ).length
  }
  return counts
}

/**
 * Cached variant for routes that do not already hold the product list.
 * getHomeData calls countProductsByConcern directly against the list it has.
 */
export const getConcernCounts = unstable_cache(
  async (): Promise<Record<string, number>> => {
    const all = await getAllProducts()
    return countProductsByConcern(all.filter(p => p.inStock && !p.isHidden))
  },
  ['concern-counts-v1'],
  { revalidate: 300, tags: ['products'] }
)
