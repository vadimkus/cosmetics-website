/**
 * Product 61 (HR³ MATRIX SCALP BRUSH) — point the record at the Aug 2026 studio set in
 * `/images/brush_o/`.
 *
 * MAIN  /images/brush_o/Main.jpeg — the brush alone on white, no overlaid text.
 *
 * GALLERY (main excluded; web and mobile both prepend `product.image` themselves):
 *   s1  Soft on scalp. Serious about care.   also inline: the how-to section
 *   s2  Healthy hair starts with the scalp.  also inline: the effects section
 *   s3  Three actions. One scalp tool.       gallery only — prints an absorption benefit
 *   s4  Engineered for the scalp.            gallery only — prints an absorption benefit
 *   s5  Make scalp care a daily ritual.      gallery only — absorption + tonic + 2-3 min
 *   s6  HR³ MATRIX SCALP BRUSH spec card.    gallery only — absorption + tonic
 *   s7  Designed to move with your scalp.    also inline: the design section
 *
 * WHY THE CLAIM-BEARING SLIDES STILL SHIP. Every one of them is milder than the slide it
 * replaces: the previous set printed an invented "+50% Product Absorption" figure and a
 * "KFDA-Approved for Hair Loss" badge that belongs to product 44. Holding this set back
 * would leave those live. They stay out of the inline sections, so the page never
 * headlines a claim the DTS MG deck does not make. See scalpBrushCopy.ts.
 *
 * ORDER OF OPERATIONS. The files were committed, pushed and confirmed serving 200 on
 * genosys.ae BEFORE this script ran, because the database is shared with production and
 * writing these paths makes the swap live everywhere at once.
 *
 * The previous set in `/images/brush/` stays on disk: order emails already sent reference
 * the old main image, and per .cursor/rules/product-gallery-images.mdc it only comes off
 * after scripts/repair-dead-order-item-images.ts runs clean.
 *
 * Run: npx tsx --env-file=.env.local scripts/update-product-61-brush-slides-20260820.ts
 */

import { prisma } from '../lib/prisma'

const MAIN = '/images/brush_o/Main.jpeg'

const GALLERY = [
  '/images/brush_o/s1.jpeg',
  '/images/brush_o/s2.jpeg',
  '/images/brush_o/s3.jpeg',
  '/images/brush_o/s4.jpeg',
  '/images/brush_o/s5.jpeg',
  '/images/brush_o/s6.jpeg',
  '/images/brush_o/s7.jpeg',
]

async function main() {
  const p = await prisma.product.findFirst({
    where: { OR: [{ productNumber: '61' }, { id: '61' }] },
  })
  if (!p) throw new Error('Product 61 not found')

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
