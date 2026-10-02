/**
 * Product 53 INTENSIVE REPAIR COLLAGEN MASK: the main is re-shot clean (same sachet position, no gel drops,
 * pure white canvas): collagen_campaign/main.jpg -> main-v2.jpg. The gallery is unchanged.
 * Refuses to write until the new file answers 200 on the live site.
 *
 * Run: npx tsx --env-file=.env.local scripts/update-product-53-main-clean-20261002.ts
 */
import { prisma } from '../lib/prisma'

const MAIN = '/images/collagen_campaign/main-v2.jpg'

async function main() {
  const r = await fetch(`https://genosys.ae${MAIN}`, { method: 'HEAD' })
  if (r.status !== 200) throw new Error(`${MAIN} returned ${r.status}; deploy first`)
  const p = await prisma.product.findFirst({ where: { productNumber: '53' } })
  if (!p) throw new Error('product 53 not found')
  await prisma.product.update({ where: { id: p.id }, data: { image: MAIN } })
  console.log(`product 53 main ${MAIN}`)
}

main().finally(() => prisma.$disconnect())
