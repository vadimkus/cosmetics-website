/**
 * Dumps the live product list (and audit-relevant copy fields) to JSON for
 * the Intertek-vs-website audit.
 *
 * Run: npx tsx --env-file=.env.local scripts/audit-dump-products.ts
 */
import { prisma } from '../lib/prisma'
import { writeFileSync } from 'fs'

async function main() {
  const products = await prisma.product.findMany({
    orderBy: { productNumber: 'asc' },
    select: {
      id: true,
      productNumber: true,
      name: true,
      category: true,
      size: true,
      price: true,
      isHidden: true,
      inStock: true,
      description: true,
      keyFeatures: true,
      ingredients: true,
      howToUse: true,
      directions: true,
      usage: true,
      benefits: true,
      skinType: true,
      targetConcerns: true,
    },
  })
  writeFileSync(
    'scripts/audit-products-dump.json',
    JSON.stringify(products, null, 2)
  )
  console.log('Dumped', products.length, 'products -> scripts/audit-products-dump.json')
  for (const p of products) {
    console.log(
      `${p.productNumber ?? '?'} | ${p.name} | ${p.size ?? '-'} | ${p.category ?? '-'} | hidden=${p.isHidden} stock=${p.inStock}`
    )
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
