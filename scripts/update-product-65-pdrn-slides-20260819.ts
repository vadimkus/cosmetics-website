/**
 * Product 65 (Bio-Meso PDRN Homecare Ampoule 5000) — point the record at the Aug 2026
 * studio set in `/images/pdrn_5000_new/`.
 *
 * MAIN  /images/pdrn_5000_new/Main.jpeg — tube and carton, no overlaid text.
 *
 * GALLERY (main excluded; web and mobile both prepend `product.image` themselves):
 *   S1  Regeneration. Without classic needles.   gallery only
 *   S2  Micro-channels. Not needles. 0.25 mm      gallery only
 *   S3  Four things. Happen at once.              also inline: mechanism section
 *   S4  What the 5,000 is made of.                also inline: complex section
 *   S6  Six days. One renewal cycle.              also inline: timeline section
 *   S7  Once a week. In the evening.              also inline: ritual section
 *   S8  What your skin gets from it.              also inline: actives section
 *   Close  Spec card - 50 ml, 12M PAO, made in Korea
 *
 * Insta.jpeg is a portrait social export and is deliberately left out of the gallery.
 * There is no S5 in the delivered set.
 *
 * ORDER OF OPERATIONS. The files were committed, pushed and confirmed serving 200 on
 * genosys.ae BEFORE this script ran. The database is shared with production, so writing
 * these paths makes the swap live everywhere the moment it happens — product 66 spent two
 * hours serving broken images on 18 Aug for exactly that reason.
 *
 * The previous set in `/images/meso_5000/` stays on disk: order emails already sent
 * reference the old main image, and per .cursor/rules/product-gallery-images.mdc it only
 * comes off after scripts/repair-dead-order-item-images.ts runs clean.
 *
 * Run: npx tsx --env-file=.env.local scripts/update-product-65-pdrn-slides-20260819.ts
 */

import { prisma } from '../lib/prisma'

const MAIN = '/images/pdrn_5000_new/Main.jpeg'

const GALLERY = [
  '/images/pdrn_5000_new/S1.jpeg',
  '/images/pdrn_5000_new/S2.jpeg',
  '/images/pdrn_5000_new/S3.jpeg',
  '/images/pdrn_5000_new/S4.jpeg',
  '/images/pdrn_5000_new/S6.jpeg',
  '/images/pdrn_5000_new/S7.jpeg',
  '/images/pdrn_5000_new/S8.jpeg',
  '/images/pdrn_5000_new/Close.jpeg',
]

async function main() {
  const p = await prisma.product.findFirst({
    where: { OR: [{ productNumber: '65' }, { id: '65' }] },
  })
  if (!p) throw new Error('Product 65 not found')

  console.log('before:', p.image, '·', (JSON.parse(p.images || '[]') as string[]).length, 'gallery')

  await prisma.product.update({
    where: { id: p.id },
    data: { image: MAIN, images: JSON.stringify(GALLERY) },
  })

  const after = await prisma.product.findUnique({ where: { id: p.id } })
  const gallery = JSON.parse(after?.images || '[]') as string[]
  console.log('after :', after?.image, '·', gallery.length, 'gallery')

  if (gallery.includes(after?.image ?? '')) {
    throw new Error('main image must not appear inside the gallery array')
  }
  console.log('main not duplicated in gallery: ok')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
