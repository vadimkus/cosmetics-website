/**
 * Product 59 (DEEP MOISTURIZING BEAUTY BOX) — new main image.
 *
 * `/images/beauty_boxes/Deep_moisturizing.jpeg` → `/images/bb_box_deep/main.jpeg`
 *
 * The gallery array is untouched: it holds the three component packshots, and the main
 * image is prepended by the layout rather than stored in the array.
 *
 * ORDER OF OPERATIONS. The file was committed, pushed and confirmed serving 200 on
 * genosys.ae BEFORE this script ran. The database is shared between local and production,
 * so writing the path here makes the swap live everywhere at once — if the asset is not
 * deployed yet, every visitor gets a broken image until it is. Product 66 was broken for
 * about two hours on 18 Aug for exactly this reason.
 *
 * The old file stays on disk. Order emails already sent reference it, and per
 * .cursor/rules/product-gallery-images.mdc an old main image only comes off after
 * scripts/repair-dead-order-item-images.ts runs clean.
 *
 * Run: npx tsx --env-file=.env.local scripts/update-product-59-main-image-20260818.ts
 */

import { prisma } from '../lib/prisma'

const MAIN = '/images/bb_box_deep/main.jpeg'

async function main() {
  const p = await prisma.product.findFirst({ where: { productNumber: '59' } })
  if (!p) throw new Error('Product 59 not found')

  console.log('before:', p.image)

  await prisma.product.update({ where: { id: p.id }, data: { image: MAIN } })

  const after = await prisma.product.findUnique({ where: { id: p.id } })
  console.log('after :', after?.image)

  const gallery = JSON.parse(after?.images || '[]') as string[]
  console.log('gallery unchanged:', gallery.length, 'images')
  if (gallery.includes(MAIN)) throw new Error('main image must not appear inside the gallery array')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
