/**
 * One-off: set retail price for Bio Meso PDRN Ampoule 60000 (productNumber 60)
 * and make it orderable (it was created with price 0 + isPriceOnRequest).
 *
 * Usage: npx tsx scripts/set-product-60-price.ts
 */
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
if (!process.env.DATABASE_URL && !process.env.PRISMA_DATABASE_URL) {
  dotenv.config({ path: path.resolve(process.cwd(), '.env') })
}

async function main() {
  const { prisma } = await import('../lib/prisma')

  const before = await prisma.product.findFirst({
    where: { productNumber: '60' },
    select: { id: true, name: true, price: true, isPriceOnRequest: true, inStock: true, isHidden: true },
  })
  if (!before) throw new Error('Product 60 not found')
  console.log('BEFORE:', before)

  const after = await prisma.product.update({
    where: { id: before.id },
    data: { price: 600, isPriceOnRequest: false, inStock: true },
    select: { id: true, name: true, price: true, isPriceOnRequest: true, inStock: true, isHidden: true },
  })
  console.log('AFTER:', after)
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
