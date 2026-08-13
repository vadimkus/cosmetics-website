/**
 * Point product 4 gallery S1 to /images/hes_power/s1new.jpeg
 * (cache-safe new filename; do not overwrite s1.jpeg in place).
 *
 * Dry run:
 *   npx tsx --env-file=.env.local scripts/update-product-4-s1-image.ts
 * Apply:
 *   npx tsx --env-file=.env.local scripts/update-product-4-s1-image.ts --apply
 */
import { prisma } from '../lib/prisma'

const NEW_GALLERY = [
  '/images/hes_power/s1new.jpeg',
  '/images/hes_power/s2.jpeg',
  '/images/hes_power/s3.jpeg',
  '/images/hes_power/s4.jpeg',
  '/images/hes_power/s5.jpeg',
  '/images/hes_power/s6.jpeg',
  '/images/hes_power/s7.jpeg',
]

async function main() {
  const product = await prisma.product.findFirst({
    where: { OR: [{ id: '4' }, { productNumber: '4' }] },
    select: { id: true, productNumber: true, name: true, image: true, images: true },
  })
  if (!product) throw new Error('Product 4 not found')

  console.log('BEFORE:', JSON.stringify(product, null, 2))

  if (!process.argv.includes('--apply')) {
    console.log('DRY RUN — pass --apply to write')
    console.log('Would set gallery:', NEW_GALLERY)
    return
  }

  const updated = await prisma.product.update({
    where: { id: product.id },
    data: { images: JSON.stringify(NEW_GALLERY) },
    select: { id: true, productNumber: true, name: true, image: true, images: true },
  })
  console.log('AFTER:', JSON.stringify(updated, null, 2))
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
