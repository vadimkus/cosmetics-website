/**
 * Product 10 SNOW O2 CLEANSER: swap gallery slides 2 and 8 for s2b / s8b, luxury stills that replace
 * the Dubai terrace and the sink splash. RU / AR versions swap in through lib/localizedProductImages.ts.
 *
 * Run: npx tsx --env-file=.env.local scripts/update-product-10-luxury-slides-20261001.ts
 */
import { prisma } from '../lib/prisma'

const SWAP: Record<string, string> = {
  '/images/snowo2_campaign/s2.jpg': '/images/snowo2_campaign/s2b.jpg',
  '/images/snowo2_campaign/s8.jpg': '/images/snowo2_campaign/s8b.jpg',
}

async function main() {
  const product = await prisma.product.findFirst({ where: { productNumber: '10' } })
  if (!product) throw new Error('product 10 not found')
  const gallery: string[] = JSON.parse(product.images || '[]')
  const swapped = gallery.filter(p => SWAP[p]).length
  if (swapped !== 2) throw new Error(`expected 2 slides to swap, found ${swapped}`)
  const next = gallery.map(p => SWAP[p] ?? p)
  await prisma.product.update({ where: { id: product.id }, data: { images: JSON.stringify(next) } })
  console.log('product 10 gallery:', next.join(', '))
}

main().finally(() => prisma.$disconnect())
