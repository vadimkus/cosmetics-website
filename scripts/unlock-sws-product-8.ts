/**
 * Unlock POWER SOLUTION SWS (productNumber 8) — back in stock.
 *
 * Usage: npx tsx --env-file=.env.local scripts/unlock-sws-product-8.ts
 */
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
if (!process.env.DATABASE_URL && !process.env.PRISMA_DATABASE_URL) {
  dotenv.config({ path: path.resolve(process.cwd(), '.env') })
}

async function main() {
  const { prisma } = await import('../lib/prisma')

  const matches = await prisma.product.findMany({
    where: {
      OR: [
        { productNumber: '8' },
        { id: '8' },
        { name: { contains: 'SWS', mode: 'insensitive' } },
      ],
    },
    select: {
      id: true,
      productNumber: true,
      name: true,
      inStock: true,
      isHidden: true,
      price: true,
    },
  })
  console.log('MATCHES:', matches)

  const before =
    matches.find((p) => p.productNumber === '8' || p.id === '8') ||
    matches.find((p) => /POWER SOLUTION SWS/i.test(p.name) && !/BOX/i.test(p.name)) ||
    matches[0]

  if (!before) throw new Error('Product 8 (SWS) not found')
  console.log('BEFORE:', before)

  const after = await prisma.product.update({
    where: { id: before.id },
    data: { inStock: true, isHidden: false },
    select: {
      id: true,
      productNumber: true,
      name: true,
      inStock: true,
      isHidden: true,
      price: true,
    },
  })
  console.log('AFTER:', after)
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
