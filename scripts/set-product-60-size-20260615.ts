/**
 * One-off: correct the size of Bio Meso PDRN Ampoule 60000 (productNumber 60)
 * from "2ml x 5 ampoules" to "3ml x 4 ampoules".
 *
 * Updates both the top-level `size` field and the `size` key inside the
 * `productDetails` JSON blob.
 *
 * Usage: npx tsx scripts/set-product-60-size-20260615.ts
 */
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
if (!process.env.DATABASE_URL && !process.env.PRISMA_DATABASE_URL) {
  dotenv.config({ path: path.resolve(process.cwd(), '.env') })
}

const NEW_SIZE = '3ml x 4 ampoules'

async function main() {
  const { prisma } = await import('../lib/prisma')

  const before = await prisma.product.findFirst({
    where: { productNumber: '60' },
    select: { id: true, name: true, size: true, productDetails: true },
  })
  if (!before) throw new Error('Product 60 not found')
  console.log('BEFORE:', { id: before.id, name: before.name, size: before.size })

  // Update the size inside the productDetails JSON blob if present.
  let nextProductDetails = before.productDetails
  if (before.productDetails) {
    try {
      const details = JSON.parse(before.productDetails) as Record<string, unknown>
      if ('size' in details) {
        details.size = NEW_SIZE
        nextProductDetails = JSON.stringify(details)
      }
    } catch (e) {
      console.warn('Could not parse productDetails JSON; leaving it unchanged.', e)
    }
  }

  const after = await prisma.product.update({
    where: { id: before.id },
    data: { size: NEW_SIZE, productDetails: nextProductDetails },
    select: { id: true, name: true, size: true, productDetails: true },
  })
  console.log('AFTER:', { id: after.id, name: after.name, size: after.size })
  console.log('productDetails.size:', after.productDetails ? JSON.parse(after.productDetails).size : '(none)')
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
