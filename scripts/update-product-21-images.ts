/**
 * Update product 21 (MULTI VITA RADIANCE SERUM) to the new
 * public/images/radiance_serum/ set (main + s1–s5).
 *
 * Dry run:
 *   npx tsx --env-file=.env.local scripts/update-product-21-images.ts
 * Apply:
 *   npx tsx --env-file=.env.local scripts/update-product-21-images.ts --apply
 */
import { PrismaClient } from '@prisma/client'

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL or PRISMA_DATABASE_URL is required')

const prisma = new PrismaClient(
  databaseUrl.includes('prisma.io') || databaseUrl.includes('accelerate')
    ? { accelerateUrl: databaseUrl, log: ['error'] }
    : { datasourceUrl: databaseUrl, log: ['error'] } as never,
)

const NEW_MAIN = '/images/radiance_serum/main.jpeg'
const NEW_GALLERY = [
  '/images/radiance_serum/s1.jpeg',
  '/images/radiance_serum/s2.jpeg',
  '/images/radiance_serum/s3.jpeg',
  '/images/radiance_serum/s4.jpeg',
  '/images/radiance_serum/s5.jpeg',
]

const OLD_IMAGES = [
  '/images/RADS.jpg',
  'https://genosys.ae/images/RADS.jpg',
  'https://www.genosys.ae/images/RADS.jpg',
  '/images/Second/rd_big.jpg',
  'https://genosys.ae/images/Second/rd_big.jpg',
  'https://www.genosys.ae/images/Second/rd_big.jpg',
]

function replaceOldPaths(html: string | null): string | null {
  if (!html) return html
  let out = html
  for (const old of OLD_IMAGES) {
    out = out.replaceAll(old, NEW_MAIN)
  }
  return out
}

async function main() {
  const p = await prisma.product.findFirst({
    where: { OR: [{ id: '21' }, { productNumber: '21' }] },
    select: { id: true, productNumber: true, name: true, image: true, images: true },
  })
  if (!p) throw new Error('Product 21 not found')
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
    console.log('orderItems for product 21 total:', byProduct)

    const blogs = await prisma.blogPost.findMany({
      select: { slug: true, content: true, contentAr: true, contentRu: true },
    })
    const hit = blogs.filter((b) =>
      [b.content, b.contentAr, b.contentRu].some((c) =>
        Boolean(c && (c.includes('RADS.jpg') || c.includes('rd_big'))),
      ),
    )
    console.log('Blog posts with old serum image paths:', hit.map((b) => b.slug))
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

  const blogs = await prisma.blogPost.findMany({
    select: { id: true, slug: true, content: true, contentAr: true, contentRu: true },
  })
  for (const b of blogs) {
    const next = {
      content: replaceOldPaths(b.content),
      contentAr: replaceOldPaths(b.contentAr),
      contentRu: replaceOldPaths(b.contentRu),
    }
    if (
      next.content !== b.content ||
      next.contentAr !== b.contentAr ||
      next.contentRu !== b.contentRu
    ) {
      await prisma.blogPost.update({
        where: { id: b.id },
        data: next,
      })
      console.log(`Repointed blog ${b.slug} serum image paths → ${NEW_MAIN}`)
    }
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
