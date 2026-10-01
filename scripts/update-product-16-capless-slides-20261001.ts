/**
 * Product 16 SNOW BOOSTER: swap gallery slides 1 and 6 for the s1b / s6b renders, where the
 * 200 ml sprays with its clear cap off. RU / AR versions swap in through
 * lib/localizedProductImages.ts.
 *
 * Run: npx tsx --env-file=.env.local scripts/update-product-16-capless-slides-20261001.ts
 */
import { prisma } from '../lib/prisma'

const SWAP: Record<string, string> = {
  '/images/booster_campaign/s1.jpg': '/images/booster_campaign/s1b.jpg',
  '/images/booster_campaign/s6.jpg': '/images/booster_campaign/s6b.jpg',
}

async function main() {
  const product = await prisma.product.findFirst({ where: { productNumber: '16' } })
  if (!product) throw new Error('product 16 not found')
  const gallery: string[] = JSON.parse(product.images || '[]')
  const next = gallery.map(p => SWAP[p] ?? p)
  const swapped = gallery.filter(p => SWAP[p]).length
  if (swapped !== 2) throw new Error(`expected 2 slides to swap, found ${swapped}`)
  await prisma.product.update({ where: { id: product.id }, data: { images: JSON.stringify(next) } })
  console.log('product 16 gallery:', next.join(', '))
}

main().finally(() => prisma.$disconnect())
