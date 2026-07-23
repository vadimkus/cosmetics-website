/**
 * Update product 41 (SKIN CARING BLEMISH BALM CUSHION) to the new
 * public/images/cushion/ set (main + s1,s2,s4,s5,s6 — no s3 in source set).
 *
 * Dry run:
 *   npx tsx --env-file=.env.local scripts/update-product-41-images.ts
 * Apply:
 *   npx tsx --env-file=.env.local scripts/update-product-41-images.ts --apply
 */
import { PrismaClient } from '@prisma/client'

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL or PRISMA_DATABASE_URL is required')

const prisma = new PrismaClient(
  databaseUrl.includes('prisma.io') || databaseUrl.includes('accelerate')
    ? { accelerateUrl: databaseUrl, log: ['error'] }
    : { datasourceUrl: databaseUrl, log: ['error'] } as never,
)

const NEW_MAIN = '/images/cushion/main.jpeg'
const NEW_GALLERY = [
  '/images/cushion/s1.jpeg',
  '/images/cushion/s2.jpeg',
  '/images/cushion/s4.jpeg',
  '/images/cushion/s5.jpeg',
  '/images/cushion/s6.jpeg',
]

const OLD_IMAGES = [
  '/images/BBC.jpg',
  'https://genosys.ae/images/BBC.jpg',
  'https://www.genosys.ae/images/BBC.jpg',
  '/images/Second/full_C.jpg',
  'https://genosys.ae/images/Second/full_C.jpg',
  'https://www.genosys.ae/images/Second/full_C.jpg',
  '/images/Second/Shades.jpg',
  '/images/Second/Cushion_Container_Spare.jpg',
  '/images/Second/Cushion_Container2.jpg',
  '/images/Second/Cushion_Container.jpg',
]

async function main() {
  const p = await prisma.product.findFirst({
    where: { OR: [{ id: '41' }, { productNumber: '41' }] },
    select: { id: true, productNumber: true, name: true, image: true, images: true },
  })
  if (!p) throw new Error('Product 41 not found')
  console.log('BEFORE:', JSON.stringify(p, null, 2))

  const dryRun = !process.argv.includes('--apply')
  if (dryRun) {
    console.log('DRY RUN — pass --apply to write')
    console.log('Would set image:', NEW_MAIN)
    console.log('Would set gallery:', NEW_GALLERY)
    for (const img of OLD_IMAGES) {
      const c = await prisma.orderItem.count({ where: { image: img } })
      console.log(`orderItems with ${img}:`, c)
    }
    const byProduct = await prisma.orderItem.count({ where: { productId: p.id } })
    console.log('orderItems for product 41 total:', byProduct)
    return
  }

  const updated = await prisma.product.update({
    where: { id: p.id },
    data: { image: NEW_MAIN, images: JSON.stringify(NEW_GALLERY) },
    select: { id: true, name: true, image: true, images: true },
  })
  console.log('AFTER:', JSON.stringify(updated, null, 2))

  for (const img of OLD_IMAGES) {
    const result = await prisma.orderItem.updateMany({
      where: { image: img },
      data: { image: NEW_MAIN },
    })
    if (result.count > 0) {
      console.log(`Repointed ${result.count} orderItems from ${img} → ${NEW_MAIN}`)
    }
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
