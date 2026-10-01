/**
 * Product 18 MOISTURE REPLENISHING HYALURON SERUM: slide 4 ("Drink from drop one.") moves from the
 * cracked clay tile (s4b) to the white orchid drinking a sky-blue drop (s4c).
 *
 * Run: npx tsx --env-file=.env.local scripts/update-product-18-orchid-slide-20261001.ts
 */
import { prisma } from '../lib/prisma'

const OLD_SLIDE = '/images/hsserum_v2/s4b.jpg'
const NEW_SLIDE = '/images/hsserum_v2/s4c.jpg'

async function main() {
  const p = await prisma.product.findFirst({ where: { productNumber: '18' } })
  if (!p) throw new Error('product 18 not found')
  const gallery: string[] = JSON.parse(p.images || '[]')
  if (gallery.filter(g => g === OLD_SLIDE).length !== 1) throw new Error('s4b not in the gallery exactly once')
  const next = gallery.map(g => (g === OLD_SLIDE ? NEW_SLIDE : g))
  await prisma.product.update({ where: { id: p.id }, data: { images: JSON.stringify(next) } })
  console.log(`product 18 gallery: ${next.join(', ')}`)
}

main().finally(() => prisma.$disconnect())
