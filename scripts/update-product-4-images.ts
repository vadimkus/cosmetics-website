/**
 * Update product 4 (POWER SOLUTION HES) to the
 * public/images/hes_power/ set (main + s1–s7).
 *
 * Dry run:
 *   npx tsx --env-file=.env.local scripts/update-product-4-images.ts
 * Apply:
 *   npx tsx --env-file=.env.local scripts/update-product-4-images.ts --apply
 */
import { prisma } from '../lib/prisma'

const NEW_MAIN = '/images/hes_power/main.jpeg'
const NEW_GALLERY = [
  '/images/hes_power/s1new.jpeg',
  '/images/hes_power/s2.jpeg',
  '/images/hes_power/s3.jpeg',
  '/images/hes_power/s4.jpeg',
  '/images/hes_power/s5.jpeg',
  '/images/hes_power/s6.jpeg',
  '/images/hes_power/s7.jpeg',
]
const REPLACEMENTS: Array<[string, string]> = [
  ['/images/HES.jpg', NEW_MAIN],
  ['/images/Second/hes_big1.jpg', NEW_GALLERY[0]],
  ['/images/Second/hes_big2.jpg', NEW_GALLERY[1]],
]

function variants(image: string): string[] {
  return [image, `https://genosys.ae${image}`, `https://www.genosys.ae${image}`]
}

function replaceOldPaths(value: string | null): string | null {
  if (!value) return value
  let out = value
  for (const [oldImage, newImage] of REPLACEMENTS) {
    for (const old of variants(oldImage)) out = out.replaceAll(old, newImage)
  }
  return out
}

async function main() {
  const product = await prisma.product.findFirst({
    where: { OR: [{ id: '4' }, { productNumber: '4' }] },
    select: { id: true, productNumber: true, name: true, image: true, images: true },
  })
  if (!product) throw new Error('Product 4 not found')

  const oldVariants = REPLACEMENTS.flatMap(([oldImage]) => variants(oldImage))
  const orderGroups = await prisma.orderItem.groupBy({
    by: ['image'],
    where: { image: { in: oldVariants } },
    _count: { _all: true },
  })
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
  const affectedBlogs = blogs.filter((blog) =>
    [blog.featuredImage, blog.content, blog.contentAr, blog.contentRu].some(
      (value) => value && oldVariants.some((old) => value.includes(old)),
    ),
  )

  console.log('BEFORE:', JSON.stringify(product, null, 2))
  console.log('Order references:', JSON.stringify(orderGroups, null, 2))
  console.log('Blogs to repoint:', affectedBlogs.map(({ slug }) => slug))

  if (!process.argv.includes('--apply')) {
    console.log('DRY RUN — pass --apply to write')
    console.log('Would set image:', NEW_MAIN)
    console.log('Would set gallery:', NEW_GALLERY)
    return
  }

  const updated = await prisma.product.update({
    where: { id: product.id },
    data: { image: NEW_MAIN, images: JSON.stringify(NEW_GALLERY) },
    select: { id: true, productNumber: true, name: true, image: true, images: true },
  })
  console.log('AFTER:', JSON.stringify(updated, null, 2))

  const orderItems = await prisma.orderItem.updateMany({
    where: { image: { in: oldVariants } },
    data: { image: NEW_MAIN },
  })
  console.log(`Repointed ${orderItems.count} historical order items`)

  for (const blog of affectedBlogs) {
    await prisma.blogPost.update({
      where: { id: blog.id },
      data: {
        featuredImage: replaceOldPaths(blog.featuredImage),
        content: replaceOldPaths(blog.content),
        contentAr: replaceOldPaths(blog.contentAr),
        contentRu: replaceOldPaths(blog.contentRu),
      },
    })
    console.log(`Repointed blog ${blog.slug}`)
  }
  console.log(`Repointed ${affectedBlogs.length} blogs`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
