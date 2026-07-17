/**
 * Update product 11 (SKIN DEFENDER LIP & EYE MAKEUP REMOVER) to the new
 * public/images/remover/ set (Main + S1–S6).
 *
 * Dry run:
 *   npx tsx --env-file=.env.local scripts/update-product-11-images.ts
 * Apply:
 *   npx tsx --env-file=.env.local scripts/update-product-11-images.ts --apply
 */
import { PrismaClient } from '@prisma/client'

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL or PRISMA_DATABASE_URL is required')

const prisma = new PrismaClient(
  databaseUrl.includes('prisma.io') || databaseUrl.includes('accelerate')
    ? { accelerateUrl: databaseUrl, log: ['error'] }
    : { datasourceUrl: databaseUrl, log: ['error'] } as never,
)

const NEW_MAIN = '/images/remover/Main.jpg'
const NEW_GALLERY = [
  '/images/remover/S1.jpg',
  '/images/remover/S2.jpg',
  '/images/remover/S3.jpg',
  '/images/remover/S4.jpg',
  '/images/remover/S5.jpg',
  '/images/remover/S6.jpg',
]

const OLD_IMAGES = [
  '/images/DEF.jpg',
  'https://genosys.ae/images/DEF.jpg',
  'https://www.genosys.ae/images/DEF.jpg',
  '/images/Second/def_big.jpg',
  'https://genosys.ae/images/Second/def_big.jpg',
]

async function main() {
  const p = await prisma.product.findFirst({
    where: { OR: [{ id: '11' }, { productNumber: '11' }] },
    select: { id: true, productNumber: true, name: true, image: true, images: true },
  })
  if (!p) throw new Error('Product 11 not found')
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
    console.log('orderItems for product 11 total:', byProduct)
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
    console.log(`Repointed ${result.count} orderItems from ${img} → ${NEW_MAIN}`)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
