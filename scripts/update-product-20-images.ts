/**
 * Update product 20 (PROBLEM CONTROL SERUM) to the refreshed
 * public/images/problems_serum/ set (main + s1–s6).
 *
 * Dry run:
 *   npx tsx --env-file=.env.local scripts/update-product-20-images.ts
 * Apply:
 *   npx tsx --env-file=.env.local scripts/update-product-20-images.ts --apply
 */
import { prisma } from '../lib/prisma'

const NEW_MAIN = '/images/problems_serum/main.jpeg'
const NEW_GALLERY = [
  '/images/problems_serum/s1.jpeg',
  '/images/problems_serum/s2.jpeg',
  '/images/problems_serum/s3.jpeg',
  '/images/problems_serum/s4.jpeg',
  '/images/problems_serum/s5.jpeg',
  '/images/problems_serum/s6.jpeg',
]

const IMAGE_REPLACEMENTS: Array<[string, string]> = [
  ['/images/problem_serum/main.jpeg', NEW_MAIN],
  ...NEW_GALLERY.map(
    (newImage, index): [string, string] => [
      `/images/problem_serum/s${index + 1}.jpeg`,
      newImage,
    ],
  ),
  ['/images/PRSS.jpg', NEW_MAIN],
]

function variants(image: string): string[] {
  return [image, `https://genosys.ae${image}`, `https://www.genosys.ae${image}`]
}

function replaceOldPaths(html: string | null): string | null {
  if (!html) return html
  let out = html
  for (const [oldImage, newImage] of IMAGE_REPLACEMENTS) {
    for (const old of variants(oldImage)) {
      out = out.replaceAll(old, newImage)
    }
  }
  return out
}

async function main() {
  const p = await prisma.product.findFirst({
    where: { OR: [{ id: '20' }, { productNumber: '20' }] },
    select: { id: true, productNumber: true, name: true, image: true, images: true },
  })
  if (!p) throw new Error('Product 20 not found')
  console.log('BEFORE:', JSON.stringify(p, null, 2))

  const dryRun = !process.argv.includes('--apply')
  if (dryRun) {
    console.log('DRY RUN — pass --apply to write')
    console.log('Would set image:', NEW_MAIN)
    console.log('Would set gallery:', NEW_GALLERY)
    for (const [oldImage] of IMAGE_REPLACEMENTS) {
      const c = await prisma.orderItem.count({ where: { image: { in: variants(oldImage) } } })
      console.log(`orderItems with ${oldImage}:`, c)
    }
    const byProduct = await prisma.orderItem.count({ where: { productId: p.id } })
    console.log('orderItems for product 20 total:', byProduct)

    const blogs = await prisma.blogPost.findMany({
      select: { slug: true, featuredImage: true, content: true, contentAr: true, contentRu: true },
    })
    const hit = blogs.filter((b) =>
      [b.featuredImage, b.content, b.contentAr, b.contentRu].some((c) =>
        Boolean(c && IMAGE_REPLACEMENTS.some(([oldImage]) => c.includes(oldImage))),
      ),
    )
    console.log(
      'Blog posts with old product paths:',
      hit.map((b) => ({ slug: b.slug, featured: b.featuredImage })),
    )
    return
  }

  const updated = await prisma.product.update({
    where: { id: p.id },
    data: { image: NEW_MAIN, images: JSON.stringify(NEW_GALLERY) },
    select: { id: true, name: true, image: true, images: true },
  })
  console.log('AFTER:', JSON.stringify(updated, null, 2))

  for (const [oldImage, newImage] of IMAGE_REPLACEMENTS) {
    const result = await prisma.orderItem.updateMany({
      where: { image: { in: variants(oldImage) } },
      data: { image: newImage },
    })
    if (result.count > 0) {
      console.log(`Repointed ${result.count} orderItems from ${oldImage} → ${newImage}`)
    }
  }

  // Also repoint any remaining product-20 order items still on the old main
  const productRepoint = await prisma.orderItem.updateMany({
    where: {
      productId: p.id,
      image: { in: IMAGE_REPLACEMENTS.flatMap(([oldImage]) => variants(oldImage)) },
    },
    data: { image: NEW_MAIN },
  })
  if (productRepoint.count > 0) {
    console.log(`Repointed ${productRepoint.count} product-20 orderItems → ${NEW_MAIN}`)
  }

  const blogs = await prisma.blogPost.findMany({
    select: {
      id: true,
      slug: true,
      featuredImage: true,
      content: true,
      contentAr: true,
      contentRu: true,
    },
  })
  for (const b of blogs) {
    const next = {
      featuredImage: replaceOldPaths(b.featuredImage),
      content: replaceOldPaths(b.content),
      contentAr: replaceOldPaths(b.contentAr),
      contentRu: replaceOldPaths(b.contentRu),
    }
    if (
      next.featuredImage !== b.featuredImage ||
      next.content !== b.content ||
      next.contentAr !== b.contentAr ||
      next.contentRu !== b.contentRu
    ) {
      await prisma.blogPost.update({
        where: { id: b.id },
        data: next,
      })
      console.log(`Repointed blog ${b.slug} product image paths`)
    }
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
