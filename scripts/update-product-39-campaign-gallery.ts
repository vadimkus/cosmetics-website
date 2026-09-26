/**
 * Replace the product 39 (ULTRA SHIELD SUN CREAM SPF 50+) gallery with the
 * 12-slide "Healthy Boundaries" campaign in public/images/ultra_campaign/.
 * The main image (/images/ultra/main-v3.jpeg) is left untouched.
 *
 * Dry run:
 *   npx tsx --env-file=.env.local scripts/update-product-39-campaign-gallery.ts
 * Apply:
 *   npx tsx --env-file=.env.local scripts/update-product-39-campaign-gallery.ts --apply
 */
import { PrismaClient } from '@prisma/client'

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL or PRISMA_DATABASE_URL is required')

const prisma = new PrismaClient(
  databaseUrl.includes('prisma.io') || databaseUrl.includes('accelerate')
    ? { accelerateUrl: databaseUrl, log: ['error'] }
    : { datasourceUrl: databaseUrl, log: ['error'] } as never,
)

const NEW_GALLERY = Array.from({ length: 12 }, (_, i) => `/images/ultra_campaign/s${i + 1}.jpg`)

async function main() {
  const p = await prisma.product.findFirst({
    where: { productNumber: '39' },
    select: { id: true, productNumber: true, name: true, image: true, images: true },
  })
  if (!p) throw new Error('Product 39 not found')
  console.log('BEFORE:', JSON.stringify(p, null, 2))

  if (!process.argv.includes('--apply')) {
    console.log('DRY RUN — pass --apply to write')
    console.log('Would set gallery:', NEW_GALLERY)
    return
  }

  const updated = await prisma.product.update({
    where: { id: p.id },
    data: { images: JSON.stringify(NEW_GALLERY) },
    select: { id: true, name: true, image: true, images: true },
  })
  console.log('AFTER:', JSON.stringify(updated, null, 2))
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
