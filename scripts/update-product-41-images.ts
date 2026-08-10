/**
 * Update product 41 (SKIN CARING BLEMISH BALM CUSHION) to the
 * public/images/cushion_2/ set (main + s1–s6).
 *
 * Dry run:
 *   npx tsx --env-file=.env.local scripts/update-product-41-images.ts
 * Apply:
 *   npx tsx --env-file=.env.local scripts/update-product-41-images.ts --apply
 */
import { prisma } from '../lib/prisma'

const NEW_MAIN = '/images/cushion_2/main.jpeg'
const NEW_GALLERY = [
  '/images/cushion_2/s1.jpeg',
  '/images/cushion_2/s2.jpeg',
  '/images/cushion_2/s3.jpeg',
  '/images/cushion_2/s4.jpeg',
  '/images/cushion_2/s5.jpeg',
  '/images/cushion_2/s6.jpeg',
]

const REPLACEMENTS: Array<[string, string]> = [
  ['/images/cushion/main.jpeg', NEW_MAIN],
  ['/images/cushion/s1.jpeg', NEW_GALLERY[0]],
  ['/images/cushion/s2.jpeg', NEW_GALLERY[1]],
  ['/images/cushion/s4.jpeg', NEW_GALLERY[3]],
  ['/images/cushion/s5.jpeg', NEW_GALLERY[4]],
  ['/images/cushion/s6.jpeg', NEW_GALLERY[5]],
  ['/images/BBC.jpg', NEW_MAIN],
  ['/images/Second/full_C.jpg', NEW_MAIN],
  ['/images/Second/Shades.jpg', NEW_MAIN],
  ['/images/Second/Cushion_Container_Spare.jpg', NEW_MAIN],
  ['/images/Second/Cushion_Container2.jpg', NEW_MAIN],
  ['/images/Second/Cushion_Container.jpg', NEW_MAIN],
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
    where: { OR: [{ id: '41' }, { productNumber: '41' }] },
    select: { id: true, productNumber: true, name: true, image: true, images: true },
  })
  if (!product) throw new Error('Product 41 not found')

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
