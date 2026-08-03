/**
 * Update product 43 (HR³ MATRIX HAIR TONIC α) to the
 * public/images/hair_tonic/ set (main + s1–s6).
 *
 * Dry run:
 *   npx tsx --env-file=.env.local scripts/update-product-43-images.ts
 * Apply:
 *   npx tsx --env-file=.env.local scripts/update-product-43-images.ts --apply
 */
import { prisma } from '../lib/prisma'

const NEW_MAIN = '/images/hair_tonic/main-v2.jpeg'
const NEW_GALLERY = [
  '/images/hair_tonic/s1.jpeg',
  '/images/hair_tonic/s2.jpeg',
  '/images/hair_tonic/s3.jpeg',
  '/images/hair_tonic/s4.jpeg',
  '/images/hair_tonic/s5.jpeg',
  '/images/hair_tonic/s6.jpeg',
]
const REPLACEMENTS: Array<[string, string]> = [
  ['/images/HT.jpg', NEW_MAIN],
  ['/images/hair_tonic/main.jpeg', NEW_MAIN],
  ['/images/Second/tonicc.jpg', NEW_GALLERY[0]],
]

function variants(image: string): string[] {
  return [image, `https://genosys.ae${image}`, `https://www.genosys.ae${image}`]
}

function replaceOldPaths(html: string | null): string | null {
  if (!html) return html
  let out = html
  for (const [oldImage, newImage] of REPLACEMENTS) {
    for (const old of variants(oldImage)) out = out.replaceAll(old, newImage)
  }
  return out
}

async function main() {
  const product = await prisma.product.findFirst({
    where: { OR: [{ id: '43' }, { productNumber: '43' }] },
    select: { id: true, productNumber: true, name: true, image: true, images: true },
  })
  if (!product) throw new Error('Product 43 not found')

  const oldVariants = REPLACEMENTS.flatMap(([oldImage]) => variants(oldImage))
  const orderItemCount = await prisma.orderItem.count({
    where: { image: { in: oldVariants } },
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
  if (!process.argv.includes('--apply')) {
    console.log('DRY RUN — pass --apply to write')
    console.log('Would set image:', NEW_MAIN)
    console.log('Would set gallery:', NEW_GALLERY)
    console.log('Order items to repoint:', orderItemCount)
    console.log('Blogs to repoint:', affectedBlogs.map(({ slug }) => slug))
    return
  }

  const updated = await prisma.product.update({
    where: { id: product.id },
    data: { image: NEW_MAIN, images: JSON.stringify(NEW_GALLERY) },
    select: { id: true, name: true, image: true, images: true },
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
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
