/**
 * Product 66 (CERABARRIER BIOME GEL CLEANSER) — attach the 10-second product
 * video after `/videos/cerab.mp4` has been deployed and confirmed serving 200.
 *
 * The record is the source for both surfaces:
 * - the bespoke website page renders `product.videoUrl`
 * - the mobile product APIs select `videoUrl`, and the app resolves the relative
 *   path against https://genosys.ae before rendering ProductVideo
 *
 * Product 66 has no videoUrl override in data/productConfig.ts, so the database
 * value cannot be shadowed by static configuration. No app release or OTA is
 * required.
 *
 * Run:
 * npx tsx --env-file=.env.local scripts/update-product-66-video-20260820.ts
 */

import { prisma } from '../lib/prisma'

const VIDEO = '/videos/cerab.mp4'

async function main() {
  const product = await prisma.product.findFirst({
    where: { OR: [{ productNumber: '66' }, { id: '66' }] },
  })
  if (!product) throw new Error('Product 66 not found')

  console.log('before:', product.videoUrl)

  await prisma.product.update({
    where: { id: product.id },
    data: { videoUrl: VIDEO },
  })

  const after = await prisma.product.findUnique({ where: { id: product.id } })
  if (after?.videoUrl !== VIDEO) {
    throw new Error(`video update failed: expected ${VIDEO}, got ${after?.videoUrl}`)
  }

  console.log('after :', after.videoUrl)
}

main()
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
