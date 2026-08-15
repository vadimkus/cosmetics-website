/**
 * Point product 66 at the new two-bottle Cerabarrier packshot.
 *
 * Live /images/cera/main2.jpeg stays on disk for emails already sent.
 * The new shot ships as main3.jpeg because /images/* is immutable for a year.
 * The gallery stays S1–S5 exactly. Do not put the new main into `images`.
 *
 * The database is shared with production, so this script HEADs the live asset
 * and refuses to write while it 404s.
 *
 *   npx tsx --env-file=.env.local scripts/update-product-66-main-image-20260815.ts
 *   npx tsx --env-file=.env.local scripts/update-product-66-main-image-20260815.ts --apply
 */
import { prisma } from '../lib/prisma'

const PRODUCT_ID = '66'
const OLD_MAIN = '/images/cera/main2.jpeg'
const NEW_MAIN = '/images/cera/main3.jpeg'
const LIVE_ORIGIN = 'https://genosys.ae'
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

async function assetIsLive(path: string): Promise<boolean> {
  try {
    const res = await fetch(`${LIVE_ORIGIN}${path}`, { method: 'HEAD' })
    return res.ok
  } catch {
    return false
  }
}

async function main() {
  const apply = process.argv.includes('--apply')
  const skipLiveCheck = process.argv.includes('--skip-live-check')

  const product = await prisma.product.findFirst({
    where: { OR: [{ id: PRODUCT_ID }, { productNumber: PRODUCT_ID }] },
    select: { id: true, productNumber: true, name: true, image: true, images: true },
  })
  if (!product) throw new Error('product 66 not found')
  if (product.image !== OLD_MAIN && product.image !== NEW_MAIN) {
    throw new Error(`unexpected product 66 main image: ${product.image}`)
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
  console.log('Gallery to preserve exactly:', galleryBefore)
  console.log('Order references to repoint:', JSON.stringify(orderGroups))
  console.log('Blog references to repoint:', affectedBlogs.map(({ slug }) => slug))

  if (product.image === NEW_MAIN && orderGroups.length === 0 && affectedBlogs.length === 0) {
    console.log('Already on the new main. Nothing to do.')
    return
  }

  if (!skipLiveCheck) {
    const live = await assetIsLive(NEW_MAIN)
    console.log(`${LIVE_ORIGIN}${NEW_MAIN} → ${live ? '200' : 'not live yet'}`)
    if (!live) {
      console.log('Refusing to write. Wait for the Vercel deploy, then run again.')
      return
    }
  }

  if (!apply) {
    console.log('Dry run. Re-run with --apply to write.')
    return
  }

  const updated = await prisma.product.update({
    where: { id: product.id },
    data: { image: NEW_MAIN },
    select: { id: true, productNumber: true, name: true, image: true, images: true },
  })
  if (updated.images !== galleryBefore) {
    throw new Error('product 66 gallery changed unexpectedly')
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
