/**
 * Update product 29 (MOISTURE REPLENISHING HYALURON CREAM) to the new
 * public/images/hyaluron/ set (main + s1–s6).
 *
 * Dry run:
 *   npx tsx --env-file=.env.local scripts/update-product-29-images.ts
 * Apply:
 *   npx tsx --env-file=.env.local scripts/update-product-29-images.ts --apply
 */
import { PrismaClient } from '@prisma/client'

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL or PRISMA_DATABASE_URL is required')

const prisma = new PrismaClient(
  databaseUrl.includes('prisma.io') || databaseUrl.includes('accelerate')
    ? { accelerateUrl: databaseUrl, log: ['error'] }
    : { datasourceUrl: databaseUrl, log: ['error'] } as never,
)

const NEW_MAIN = '/images/hyaluron/main.jpeg'
const NEW_GALLERY = [
  '/images/hyaluron/s1.jpeg',
  '/images/hyaluron/s2.jpeg',
  '/images/hyaluron/s3.jpeg',
  '/images/hyaluron/s4.jpeg',
  '/images/hyaluron/s5.jpeg',
  '/images/hyaluron/s6.jpeg',
]

const OLD_IMAGES = [
  '/images/HER.jpg',
  'https://genosys.ae/images/HER.jpg',
  'https://www.genosys.ae/images/HER.jpg',
  '/images/Second/hyabig.jpg',
  'https://genosys.ae/images/Second/hyabig.jpg',
  'https://www.genosys.ae/images/Second/hyabig.jpg',
]

function replaceOldPaths(html: string | null): string | null {
  if (!html) return html
  let out = html
  for (const old of OLD_IMAGES) {
    out = out.replaceAll(old, NEW_MAIN)
  }
  // Typo folder name if any content ever pointed there
  out = out.replaceAll('/images/hayluron/', '/images/hyaluron/')
  return out
}

async function main() {
  const p = await prisma.product.findFirst({
    where: { OR: [{ id: '29' }, { productNumber: '29' }] },
    select: { id: true, productNumber: true, name: true, image: true, images: true },
  })
  if (!p) throw new Error('Product 29 not found')
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
    console.log('orderItems for product 29 total:', byProduct)

    const blogs = await prisma.blogPost.findMany({
      select: { slug: true, content: true, contentAr: true, contentRu: true },
    })
    const hit = blogs.filter((b) =>
      [b.content, b.contentAr, b.contentRu].some((c) =>
        Boolean(c && (c.includes('HER.jpg') || c.includes('hyabig') || c.includes('/images/hayluron/'))),
      ),
    )
    console.log('Blog posts with old cream image paths:', hit.map((b) => b.slug))
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
      console.log(`Repointed blog ${b.slug} cream image paths → ${NEW_MAIN}`)
    }
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
