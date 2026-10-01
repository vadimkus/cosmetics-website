/**
 * Product 18 MOISTURE REPLENISHING HYALURON SERUM: the English keyFeatures held audit notes
 * ("The carton stops here.", "Not +52%"). Replace them with selling copy. RU / AR come from
 * data/productLocalizedCopyAudit.ts and are already clean.
 *
 * Run: npx tsx --env-file=.env.local scripts/update-product-18-key-features-20261001.ts
 */
import { prisma } from '../lib/prisma'

const KEY_FEATURES = JSON.stringify([
  { title: 'Drink from drop one', description: 'Deep hydration rises from the very first use.' },
  { title: 'Hyaluronic acid 2,000 ppm', description: 'Hydrolyzed hyaluronic acid leads the formula and sinks straight in.' },
  { title: 'Hyaluronan 11 Multi-Complex', description: 'Hyaluronic acid in several forms and weights, for hydration at every level.' },
  { title: 'Pat it in', description: 'On clean skin, morning and evening. Seal with the Moisture Replenishing Hyaluron Cream.' },
])

async function main() {
  const p = await prisma.product.findFirst({ where: { productNumber: '18' } })
  if (!p) throw new Error('product 18 not found')
  await prisma.product.update({ where: { id: p.id }, data: { keyFeatures: KEY_FEATURES } })
  console.log('product 18 keyFeatures replaced')
}

main().finally(() => prisma.$disconnect())
