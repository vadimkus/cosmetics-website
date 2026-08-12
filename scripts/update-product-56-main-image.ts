/**
 * Update only product 56's main image while preserving its existing gallery
 * string byte-for-byte. Also repoint historical order and blog references.
 *
 * Dry run:
 *   npx tsx --env-file=.env.local scripts/update-product-56-main-image.ts
 * Apply:
 *   npx tsx --env-file=.env.local scripts/update-product-56-main-image.ts --apply
 */
/* eslint-disable no-console */
import { prisma } from '../lib/prisma'

const PRODUCT_NUMBER = '56'
const OLD_MAIN = '/images/bbbox_brightening/main.jpeg'
const NEW_MAIN = '/images/bbbox_brightening/main2.png'
const OWN_HOSTS = ['', 'https://genosys.ae', 'https://www.genosys.ae']

function variants(image: string): string[] {
  return OWN_HOSTS.map((host) => `${host}${image}`)
}

function replaceOldMain(value: string | null): string | null {
  if (!value) return value
  let result = value
  for (const oldImage of variants(OLD_MAIN).sort((a, b) => b.length - a.length)) {
    result = result.replaceAll(oldImage, NEW_MAIN)
  }
  return result
}

async function main() {
  const apply = process.argv.includes('--apply')
  const product = await prisma.product.findFirst({
    where: { productNumber: PRODUCT_NUMBER },
    select: { id: true, productNumber: true, name: true, image: true, images: true },
  })
  if (!product) throw new Error(`Product ${PRODUCT_NUMBER} not found`)
  if (product.image !== OLD_MAIN && product.image !== NEW_MAIN) {
    throw new Error(`Unexpected product ${PRODUCT_NUMBER} main image: ${product.image}`)
  }

  const galleryBefore = product.images
  const oldVariants = variants(OLD_MAIN)
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
      (value) => value && oldVariants.some((oldImage) => value.includes(oldImage)),
    ),
  )

  console.log('BEFORE:', JSON.stringify(product, null, 2))
  console.log('Gallery to preserve exactly:', JSON.stringify(galleryBefore))
  console.log('Order references to repoint:', JSON.stringify(orderGroups, null, 2))
  console.log('Blog references to repoint:', affectedBlogs.map(({ slug }) => slug))

  if (!apply) {
    console.log('DRY RUN — pass --apply to write')
    return
  }

  const updated = await prisma.product.update({
    where: { id: product.id },
    data: { image: NEW_MAIN },
    select: { id: true, productNumber: true, name: true, image: true, images: true },
  })
  if (updated.images !== galleryBefore) {
    throw new Error(`Product ${PRODUCT_NUMBER} gallery changed unexpectedly`)
  }

  const orderItems = await prisma.orderItem.updateMany({
    where: { image: { in: oldVariants } },
    data: { image: NEW_MAIN },
  })

  for (const blog of affectedBlogs) {
    await prisma.blogPost.update({
      where: { id: blog.id },
      data: {
        featuredImage: replaceOldMain(blog.featuredImage),
        content: replaceOldMain(blog.content),
        contentAr: replaceOldMain(blog.contentAr),
        contentRu: replaceOldMain(blog.contentRu),
      },
    })
  }

  console.log('AFTER:', JSON.stringify(updated, null, 2))
  console.log(`Repointed ${orderItems.count} historical order items`)
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
