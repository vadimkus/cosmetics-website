/**
 * Product 61 (HR³ MATRIX SCALP BRUSH) — swap the main image and attach the video.
 *
 * MAIN  /images/brush_o/Main.jpeg -> /images/brush_o/Main2.jpeg
 *       Same brush, shot square and evenly lit, with the HR³ MATRIX mark legible.
 *       The first packshot was portrait, so the square grid on listing pages was
 *       letterboxing it.
 *
 * VIDEO /videos/brush.mp4 — a 10 second 720x1280 clip of the head and the tips.
 *       Product 61 has no `videoUrl` override in data/productConfig.ts, so the
 *       record is the only source and pricingEngine's `configVideoUrl || db`
 *       merge resolves to this value. That means the website AND the mobile app
 *       pick it up from the API with no release and no OTA:
 *         app/api/mobile/products/[id]/route.ts  selects videoUrl
 *         app/api/mobile/products/route.ts       selects videoUrl
 *         lib/pricingEngine.ts                   merges and returns it
 *
 * The gallery is untouched: `images` still holds the seven slides written by
 * scripts/update-product-61-brush-slides-20260820.ts.
 *
 * ORDER OF OPERATIONS. Main2.jpeg and brush.mp4 were committed, pushed and
 * confirmed serving 200 on genosys.ae BEFORE this script ran, because the
 * database is shared with production and writing these paths makes the swap live
 * everywhere at once.
 *
 * Main.jpeg stays on disk. It shipped as the main image earlier today, so any
 * order email sent in between references it; per
 * .cursor/rules/product-gallery-images.mdc it only comes off after
 * scripts/repair-dead-order-item-images.ts runs clean.
 *
 * Run: npx tsx --env-file=.env.local scripts/update-product-61-main-and-video-20260820.ts
 */

import { prisma } from '../lib/prisma'

const MAIN = '/images/brush_o/Main2.jpeg'
const VIDEO = '/videos/brush.mp4'

async function main() {
  const p = await prisma.product.findFirst({
    where: { OR: [{ productNumber: '61' }, { id: '61' }] },
  })
  if (!p) throw new Error('Product 61 not found')

  console.log('before: image =', p.image, '· video =', p.videoUrl)

  await prisma.product.update({
    where: { id: p.id },
    data: { image: MAIN, videoUrl: VIDEO },
  })

  const after = await prisma.product.findUnique({ where: { id: p.id } })
  const gallery = JSON.parse(after?.images || '[]') as string[]
  console.log('after : image =', after?.image, '· video =', after?.videoUrl)
  console.log('gallery still', gallery.length, 'slides')

  if (gallery.includes(after?.image ?? '')) {
    throw new Error('main image must not appear inside the gallery array')
  }
  if (gallery.length !== 7) {
    throw new Error(`expected the 7 slides to be untouched, found ${gallery.length}`)
  }
  console.log('gallery intact and main not duplicated: ok')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
