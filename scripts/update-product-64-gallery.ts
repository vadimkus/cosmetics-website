/**
 * One-shot: add the needles gallery (s1..s4) to product 64 (Hair Stamp),
 * keeping the existing main image. Run: npx tsx scripts/update-product-64-gallery.ts
 */
import { prisma } from '../lib/prisma'

const MAIN = '/images/needles/main.jpg'
const GALLERY = [
  '/images/needles/main.jpg',
  '/images/needles/s1.jpg',
  '/images/needles/s2.jpg',
  '/images/needles/s3.jpg',
  '/images/needles/s4.jpg',
]

async function main() {
  const product = await prisma.product.findFirst({
    where: { OR: [{ id: '64' }, { productNumber: '64' }] },
    select: { id: true, name: true, image: true, images: true },
  })
  if (!product) {
    console.log('Product 64 not found — aborting')
    return
  }
  console.log('Before:', JSON.stringify({ image: product.image, images: product.images }))

  await prisma.product.update({
    where: { id: product.id },
    data: {
      image: MAIN, // unchanged, kept explicit
      images: JSON.stringify(GALLERY),
    },
  })

  const after = await prisma.product.findUnique({
    where: { id: product.id },
    select: { image: true, images: true },
  })
  console.log('After: ', JSON.stringify(after))
}

main().finally(() => prisma.$disconnect())
