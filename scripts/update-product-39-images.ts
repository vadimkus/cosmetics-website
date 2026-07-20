/**
 * Update product 39 (ULTRA SHIELD SUN CREAM SPF 50+) to the new
 * public/images/ultra/ set (main + s1–s6).
 *
 * Dry run:
 *   npx tsx --env-file=.env.local scripts/update-product-39-images.ts
 * Apply:
 *   npx tsx --env-file=.env.local scripts/update-product-39-images.ts --apply
 */
import { PrismaClient } from '@prisma/client'

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL or PRISMA_DATABASE_URL is required')

const prisma = new PrismaClient(
  databaseUrl.includes('prisma.io') || databaseUrl.includes('accelerate')
    ? { accelerateUrl: databaseUrl, log: ['error'] }
    : { datasourceUrl: databaseUrl, log: ['error'] } as never,
)

const NEW_MAIN = '/images/ultra/main.jpeg'
const NEW_GALLERY = [
  '/images/ultra/s1.jpeg',
  '/images/ultra/s2.jpeg',
  '/images/ultra/s3.jpeg',
  '/images/ultra/s4.jpeg',
  '/images/ultra/s5.jpeg',
  '/images/ultra/s6.jpeg',
]

const OLD_IMAGES = [
  '/images/SPF50.jpg',
  'https://genosys.ae/images/SPF50.jpg',
  'https://www.genosys.ae/images/SPF50.jpg',
  '/images/Second/50big.jpg',
  'https://genosys.ae/images/Second/50big.jpg',
  'https://www.genosys.ae/images/Second/50big.jpg',
]

const SUMMER_SLUG = 'uae-summer-skincare-survival-guide-2026'

async function main() {
  const p = await prisma.product.findFirst({
    where: { OR: [{ id: '39' }, { productNumber: '39' }] },
    select: { id: true, productNumber: true, name: true, image: true, images: true },
  })
  if (!p) throw new Error('Product 39 not found')
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
    console.log('orderItems for product 39 total:', byProduct)
    const summer = await prisma.blogPost.findUnique({
      where: { slug: SUMMER_SLUG },
      select: { id: true, slug: true },
    })
    console.log('Summer blog post:', summer ? summer.slug : 'not found')
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

  const summer = await prisma.blogPost.findUnique({
    where: { slug: SUMMER_SLUG },
    select: { content: true, contentAr: true, contentRu: true },
  })
  if (summer) {
    const replaceSpf = (html: string | null) =>
      html
        ?.replaceAll('/images/SPF50.jpg', NEW_MAIN)
        .replaceAll('https://genosys.ae/images/SPF50.jpg', NEW_MAIN)
        .replaceAll('https://www.genosys.ae/images/SPF50.jpg', NEW_MAIN) ?? null

    await prisma.blogPost.update({
      where: { slug: SUMMER_SLUG },
      data: {
        content: replaceSpf(summer.content) ?? summer.content,
        contentAr: replaceSpf(summer.contentAr),
        contentRu: replaceSpf(summer.contentRu),
      },
    })
    console.log(`Repointed ${SUMMER_SLUG} EN/AR/RU content SPF50 → ${NEW_MAIN}`)
  } else {
    console.log(`Blog ${SUMMER_SLUG} not found — skipped`)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
