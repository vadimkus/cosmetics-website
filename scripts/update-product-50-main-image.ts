/**
 * Update only product 50's main image while preserving its existing gallery
 * string byte-for-byte. Also repoint historical order and blog references.
 *
 * Dry run:
 *   npx tsx --env-file=.env.local scripts/update-product-50-main-image.ts
 * Apply:
 *   npx tsx --env-file=.env.local scripts/update-product-50-main-image.ts --apply
 *
 * Remove only the second legacy gallery item:
 *   npx tsx --env-file=.env.local scripts/update-product-50-main-image.ts --remove-second-gallery
 *   npx tsx --env-file=.env.local scripts/update-product-50-main-image.ts --remove-second-gallery --apply
 *
 * Clear the final legacy gallery item while preserving the current main:
 *   npx tsx --env-file=.env.local scripts/update-product-50-main-image.ts --clear-gallery
 *   npx tsx --env-file=.env.local scripts/update-product-50-main-image.ts --clear-gallery --apply
 */
import { prisma } from '../lib/prisma'

const OLD_MAIN = '/images/EYEZ.jpg'
const NEW_MAIN = '/images/eye_kit/main.jpeg'
const REMAINING_GALLERY = ['/images/EYEZ.jpg']
const REMOVED_GALLERY_IMAGE = '/images/Second/ekit_big.jpg'
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
  const removeSecondGallery = process.argv.includes('--remove-second-gallery')
  const clearGallery = process.argv.includes('--clear-gallery')
  const product = await prisma.product.findFirst({
    where: { OR: [{ productNumber: '50' }, { id: '50' }] },
    select: { id: true, productNumber: true, name: true, image: true, images: true },
  })
  if (!product) throw new Error('Product 50 not found')

  if (clearGallery) {
    if (product.image !== NEW_MAIN) {
      throw new Error(`Refusing to clear gallery while main is ${product.image}`)
    }

    const isExpectedBefore = product.images === JSON.stringify(REMAINING_GALLERY)
    const isAlreadyApplied = product.images === null
    if (!isExpectedBefore && !isAlreadyApplied) {
      throw new Error(`Unexpected product 50 gallery: ${product.images}`)
    }

    const [orderReferences, productReferences, blogs] = await Promise.all([
      prisma.orderItem.findMany({
        where: { image: { contains: OLD_MAIN } },
        select: { id: true, productId: true, productName: true, image: true },
      }),
      prisma.product.findMany({
        where: { OR: [{ image: { contains: OLD_MAIN } }, { images: { contains: OLD_MAIN } }] },
        select: { id: true, productNumber: true, name: true, image: true, images: true },
      }),
      prisma.blogPost.findMany({
        where: {
          OR: [
            { featuredImage: { contains: OLD_MAIN } },
            { content: { contains: OLD_MAIN } },
            { contentAr: { contains: OLD_MAIN } },
            { contentRu: { contains: OLD_MAIN } },
          ],
        },
        select: { id: true, slug: true },
      }),
    ])

    console.log('BEFORE:', JSON.stringify(product, null, 2))
    console.log('Gallery after: null')
    console.log('Order references to retained legacy asset:', JSON.stringify(orderReferences, null, 2))
    console.log('Product references:', JSON.stringify(productReferences, null, 2))
    console.log('Blog references:', blogs.map(({ slug }) => slug))

    if (!apply || isAlreadyApplied) {
      console.log(isAlreadyApplied ? 'ALREADY APPLIED — no write needed' : 'DRY RUN — pass --apply to write')
      return
    }

    const updated = await prisma.product.update({
      where: { id: product.id },
      data: { images: null },
      select: { id: true, productNumber: true, name: true, image: true, images: true },
    })
    if (updated.image !== NEW_MAIN) throw new Error('Product 50 main changed unexpectedly')
    console.log('AFTER:', JSON.stringify(updated, null, 2))
    return
  }

  if (removeSecondGallery) {
    if (product.image !== NEW_MAIN) {
      throw new Error(`Refusing to alter gallery while main is ${product.image}`)
    }

    const gallery = JSON.parse(product.images || '[]') as unknown
    if (!Array.isArray(gallery) || !gallery.every((image) => typeof image === 'string')) {
      throw new Error('Product 50 gallery is not a string array')
    }

    const expectedBefore = [...REMAINING_GALLERY, REMOVED_GALLERY_IMAGE]
    const isExpectedBefore = JSON.stringify(gallery) === JSON.stringify(expectedBefore)
    const isAlreadyApplied = JSON.stringify(gallery) === JSON.stringify(REMAINING_GALLERY)
    if (!isExpectedBefore && !isAlreadyApplied) {
      throw new Error(`Unexpected product 50 gallery: ${JSON.stringify(gallery)}`)
    }

    const [orderReferences, productReferences, blogs] = await Promise.all([
      prisma.orderItem.count({ where: { image: { contains: REMOVED_GALLERY_IMAGE } } }),
      prisma.product.findMany({
        where: {
          OR: [
            { image: { contains: REMOVED_GALLERY_IMAGE } },
            { images: { contains: REMOVED_GALLERY_IMAGE } },
          ],
        },
        select: { id: true, productNumber: true, name: true, image: true, images: true },
      }),
      prisma.blogPost.findMany({
        where: {
          OR: [
            { featuredImage: { contains: REMOVED_GALLERY_IMAGE } },
            { content: { contains: REMOVED_GALLERY_IMAGE } },
            { contentAr: { contains: REMOVED_GALLERY_IMAGE } },
            { contentRu: { contains: REMOVED_GALLERY_IMAGE } },
          ],
        },
        select: { id: true, slug: true },
      }),
    ])

    console.log('BEFORE:', JSON.stringify(product, null, 2))
    console.log('Gallery after:', JSON.stringify(REMAINING_GALLERY))
    console.log('Order references to removed gallery image:', orderReferences)
    console.log('Product references:', JSON.stringify(productReferences, null, 2))
    console.log('Blog references:', blogs.map(({ slug }) => slug))

    if (!apply || isAlreadyApplied) {
      console.log(isAlreadyApplied ? 'ALREADY APPLIED — no write needed' : 'DRY RUN — pass --apply to write')
      return
    }

    const updated = await prisma.product.update({
      where: { id: product.id },
      data: { images: JSON.stringify(REMAINING_GALLERY) },
      select: { id: true, productNumber: true, name: true, image: true, images: true },
    })
    if (updated.image !== NEW_MAIN) throw new Error('Product 50 main changed unexpectedly')
    console.log('AFTER:', JSON.stringify(updated, null, 2))
    return
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
    throw new Error('Product 50 gallery changed unexpectedly')
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
