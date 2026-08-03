/**
 * Update product 32 (MULTI FUNCTIONAL ANTI-WRINKLE CREAM) to the
 * public/images/multifunc_cream/ set (main + s1–s6).
 *
 * Dry run:
 *   npx tsx --env-file=.env.local scripts/update-product-32-images.ts
 * Apply:
 *   npx tsx --env-file=.env.local scripts/update-product-32-images.ts --apply
 */
import { prisma } from '../lib/prisma'

const NEW_MAIN = '/images/multifunc_cream/main.jpeg'
const NEW_GALLERY = [
  '/images/multifunc_cream/s1.jpeg',
  '/images/multifunc_cream/s2.jpeg',
  '/images/multifunc_cream/s3.jpeg',
  '/images/multifunc_cream/s4.jpeg',
  '/images/multifunc_cream/s5.jpeg',
  '/images/multifunc_cream/s6.jpeg',
]
const OLD_MAIN = '/images/ANT.jpg'

function variants(image: string): string[] {
  return [image, `https://genosys.ae${image}`, `https://www.genosys.ae${image}`]
}

function replaceOldPaths(html: string | null): string | null {
  if (!html) return html
  let out = html
  for (const old of variants(OLD_MAIN)) out = out.replaceAll(old, NEW_MAIN)
  return out
}

async function main() {
  const product = await prisma.product.findFirst({
    where: { OR: [{ id: '32' }, { productNumber: '32' }] },
    select: { id: true, productNumber: true, name: true, image: true, images: true },
  })
  if (!product) throw new Error('Product 32 not found')

  console.log('BEFORE:', JSON.stringify(product, null, 2))
  const oldVariants = variants(OLD_MAIN)
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
