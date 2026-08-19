/**
 * Product 63 (REVITA GLOW BB CREAM) — point the record at the Aug 2026 studio set in
 * `/images/revita_o/`.
 *
 * MAIN  /images/revita_o/main.jpg — both tubes, no overlaid text.
 *
 * GALLERY (main excluded; web and mobile both prepend `product.image` themselves):
 *   s1  Cover. Glow. Revitalize.            gallery only
 *   s2  SPF 38 PA+++                         also inline: the filter section
 *   s3  More than makeup.                    also inline: the layering section
 *   s4  Beauty with skincare inside.         also inline: the actives section
 *   s5  Two shades. Two kinds of glow.       also inline: the shade section / video poster
 *   s6  Your final skincare step.            also inline: the ritual
 *   s7  Clean skin. Intact barrier.          gallery only
 *   closing  Spec card - SPF 38, 50 g, two shades, made in Korea
 *
 * ORDER OF OPERATIONS. The files were committed, pushed and confirmed serving 200 on
 * genosys.ae BEFORE this script ran, because the database is shared with production and
 * writing these paths makes the swap live everywhere at once.
 *
 * The previous set in `/images/revita/` stays on disk: order emails already sent reference
 * the old main image, and per .cursor/rules/product-gallery-images.mdc it only comes off
 * after scripts/repair-dead-order-item-images.ts runs clean.
 *
 * Run: npx tsx --env-file=.env.local scripts/update-product-63-revita-slides-20260819.ts
 */

import { prisma } from '../lib/prisma'

const MAIN = '/images/revita_o/main.jpg'

const GALLERY = [
  '/images/revita_o/s1.jpg',
  '/images/revita_o/s2.jpg',
  '/images/revita_o/s3.jpg',
  '/images/revita_o/s4.jpg',
  '/images/revita_o/s5.jpg',
  '/images/revita_o/s6.jpg',
  '/images/revita_o/s7.jpg',
  '/images/revita_o/closing.jpg',
]

async function main() {
  const p = await prisma.product.findFirst({
    where: { OR: [{ productNumber: '63' }, { id: '63' }] },
  })
  if (!p) throw new Error('Product 63 not found')

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
