import { unstable_cache } from 'next/cache'
import { getAllProducts } from '@/lib/productsDb'
import type { Product } from '@/types'

/**
 * Recommended products shown in the empty-state Favorites view.
 *
 * Strategy:
 *   - Pull all visible products
 *   - Prefer high-rated, in-stock, non-hidden ones
 *   - Cap at 6 (a clean 2x3 grid on mobile, 3x2 on tablet)
 *
 * Cached with the existing `products` tag so admin stock/price changes
 * invalidate this list the moment they invalidate any other product cache.
 */
const TOP_N = 6

async function fetchRecommendedProducts(): Promise<Product[]> {
  try {
    const all = await getAllProducts()

    return all
      .filter((p) => !p.isHidden && p.inStock !== false)
      .sort((a, b) => {
        const ratingDelta = (b.rating ?? 0) - (a.rating ?? 0)
        if (ratingDelta !== 0) return ratingDelta
        // Tie-break: alphabetical for stable ordering
        return (a.name ?? '').localeCompare(b.name ?? '')
      })
      .slice(0, TOP_N)
  } catch {
    // Empty state must never break the page — degrade gracefully
    return []
  }
}

export const getRecommendedForEmptyFavorites = unstable_cache(
  fetchRecommendedProducts,
  ['favorites-empty-recommended'],
  { revalidate: 300, tags: ['products'] }
)
