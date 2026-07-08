import { unstable_cache } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { errorLog } from '@/lib/logger'

/**
 * Total units sold for a product across all non-cancelled orders.
 * Powers the "N+ sold" social proof on PDPs — real numbers only, cached 1h.
 */
export const getUnitsSold = unstable_cache(
  async (productId: string): Promise<number> => {
    try {
      const agg = await prisma.orderItem.aggregate({
        where: { productId, order: { status: { notIn: ['CANCELLED'] } } },
        _sum: { quantity: true },
      })
      return agg._sum.quantity ?? 0
    } catch (error) {
      errorLog('[salesStats] units-sold query failed:', error)
      return 0
    }
  },
  ['product-units-sold'],
  { revalidate: 3600, tags: ['products'] }
)

// Display helpers live in lib/salesDisplay.ts (client-safe — this module
// imports prisma and must stay server-only).
