/**
 * Product 13 — SKIN RENEWAL PEELING SYSTEM (SRS) — new studio image set.
 *
 * Points the record at `/images/srs_new/`, which replaces the old
 * `/images/SRS.jpg` main plus the two `/images/Second/sss*.jpg` gallery slides.
 *
 * Gallery order follows the slide narrative:
 *   main  packshot, carton and vial, ×10          (prepended automatically)
 *   s1    "A REAL PEEL" title, 2 ml × 10
 *   s2    "Not a home roll", the positioning slide
 *   s3    the formula in numbers: 15 / 13.5 / 2, glycerin 25%, pH 3.02
 *   s4    multi-acid callouts into the dish
 *   s5    designed for professional peeling, apply / sit / cold rinse
 *   s6    model, "when tone looks tired", 15-20 minutes
 *   s7    ten vials, one system, closing CTA
 *
 * Per the product-gallery-images rule the main image is NOT included in `images`
 * — both the web gallery and the mobile pricing engine prepend `product.image`.
 *
 * The old files are left on disk deliberately. Historical order rows may still
 * reference `/images/SRS.jpg`, and nothing here deletes an asset, so there is no
 * dead-image repair to run.
 *
 * NOTE ON s4: the slide as first delivered carried fabricated figures — lactic
 * 10%, SALICYLIC 2%, mandelic 5%, glycerin 20% — with no glycolic acid at all,
 * and SRS contains no salicylic acid. It was regenerated from the slide script,
 * which draws the audited figures (glycolic 15%, lactic 13.5%, mandelic 2%,
 * glycerin 25%). The bad version is at /tmp/srs_hold/s4-WRONG-ACIDS.jpeg and was
 * never published.
 *
 * Run: npx tsx --env-file=.env.local scripts/update-product-13-srs-new-images-20260817.ts
 */

import { prisma } from '../lib/prisma'

const MAIN = '/images/srs_new/main.jpeg'

const GALLERY = [
  '/images/srs_new/s1.jpeg',
  '/images/srs_new/s2.jpeg',
  '/images/srs_new/s3.jpeg',
  '/images/srs_new/s4.jpeg',
  '/images/srs_new/s5.jpeg',
  '/images/srs_new/s6.jpeg',
  '/images/srs_new/s7.jpeg',
]

async function main() {
  const product = await prisma.product.findFirst({
    where: { OR: [{ productNumber: '13' }, { id: '13' }] },
  })
  if (!product) throw new Error('product 13 not found')

  console.log('before:')
  console.log('  image :', product.image)
  console.log('  images:', product.images)

  await prisma.product.update({
    where: { id: product.id },
    data: { image: MAIN, images: JSON.stringify(GALLERY) },
  })

  const after = await prisma.product.findUnique({ where: { id: product.id } })
  console.log('\nafter:')
  console.log('  image :', after?.image)
  console.log('  images:', after?.images)
  console.log(`\n${GALLERY.length + 1} images total (main is prepended by the gallery component)`)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
