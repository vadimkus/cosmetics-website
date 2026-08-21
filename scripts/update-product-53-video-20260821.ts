/**
 * Product 53 (INTENSIVE REPAIR COLLAGEN MASK) — attach the supplied 10-second
 * vertical product video after `/videos/redmask.mp4` is deployed and serving.
 *
 * The database videoUrl feeds both the website PDP and the mobile product API.
 *
 * Run:
 * npx tsx --env-file=.env.local scripts/update-product-53-video-20260821.ts
 */

import { prisma } from '../lib/prisma'

const VIDEO = '/videos/redmask.mp4'

async function main() {
  const product = await prisma.product.findFirst({
    where: { productNumber: '53' },
    select: { id: true, productNumber: true, name: true, videoUrl: true },
  })
  if (!product) throw new Error('Product 53 not found')

  console.log('product:', product.name)
  console.log('before :', product.videoUrl)

  const updated = await prisma.product.update({
    where: { id: product.id },
    data: { videoUrl: VIDEO },
    select: { videoUrl: true },
  })

  if (updated.videoUrl !== VIDEO) {
    throw new Error(`Video update failed: expected ${VIDEO}, got ${updated.videoUrl}`)
  }

  console.log('after  :', updated.videoUrl)
}

main()
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
