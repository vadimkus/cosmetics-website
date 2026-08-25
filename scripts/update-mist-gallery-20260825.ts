/**
 * Product 14, MICROBIOME ENERGY INFUSING MIST: new hero and claim slides.
 *
 * The set is the one supplied in `mist_0`, renamed into the running order.
 * S1 — the opening title slide — was not in the folder: the WhatsApp export
 * skipped two files, and neither is anywhere on disk. The gallery is published
 * without it and S1 can be dropped in later without touching anything else.
 *
 * S7_alt ("SHAKE. SPRAY. GLOW.") is the second of two shake slides and is not
 * in the requested order, so it stays in the folder unpublished rather than
 * repeating S7's point.
 *
 * The main image is deliberately absent from `images`: both the web gallery and
 * the mobile app prepend `product.image` themselves.
 *
 * Run: npx tsx --env-file=.env.local scripts/update-mist-gallery-20260825.ts
 */

import { prisma } from '../lib/prisma'

const MAIN = '/images/mist_0/Main.jpeg'

const GALLERY = [
  '/images/mist_0/S2.jpeg', // NOT A WATER TONER. A SPRAYABLE EMULSION.
  '/images/mist_0/S3.jpeg', // 1.2% SHEA BUTTER
  '/images/mist_0/S4.jpeg', // SHEA + FOUR SEED OILS.
  '/images/mist_0/S5.jpeg', // MICROBIOME + HYALURONIC ACID.
  '/images/mist_0/S6.jpeg', // TIGHT. DRY. FLAT.
  '/images/mist_0/S7.jpeg', // SHAKE. THEN SPRAY.
  '/images/mist_0/S8.jpeg', // MAKEUP. STAYS PUT.
  '/images/mist_0/Closing.jpeg', // MICROBIOME ENERGY INFUSING MIST — shop
]

async function main() {
  const before = await prisma.product.findFirst({
    where: { productNumber: '14' },
    select: { id: true, name: true, image: true, images: true },
  })
  if (!before) throw new Error('Product 14 not found')

  console.log('before:')
  console.log('  image :', before.image)
  console.log('  images:', before.images)

  await prisma.product.update({
    where: { id: before.id },
    data: { image: MAIN, images: JSON.stringify(GALLERY) },
  })

  const after = await prisma.product.findFirst({
    where: { productNumber: '14' },
    select: { image: true, images: true },
  })
  console.log('\nafter:')
  console.log('  image :', after?.image)
  console.log('  images:', after?.images)
  await prisma.$disconnect()
}

main()
