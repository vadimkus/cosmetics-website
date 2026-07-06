/**
 * One-shot: swap product 63 (REVITA GLOW BB CREAM) to the new /images/revita/
 * gallery (main + s1..s4). Run: npx tsx scripts/update-product-63-revita-images.ts
 */
import { prisma } from '../lib/prisma'

const NEW_MAIN = '/images/revita/main.jpg'
const NEW_GALLERY = [
  '/images/revita/main.jpg',
  '/images/revita/s1.jpg',
  '/images/revita/s2.jpg',
  '/images/revita/s3.jpg',
  '/images/revita/s4.jpg',
]

async function main() {
  const product = await prisma.product.findFirst({
    where: { OR: [{ id: '63' }, { productNumber: '63' }] },
    select: { id: true, name: true, image: true, images: true },
  })
  if (!product) {
    console.log('Product 63 not found — aborting')
    return
  }
  console.log('Before:', JSON.stringify({ image: product.image, images: product.images }))

  await prisma.product.update({
    where: { id: product.id },
    data: {
      image: NEW_MAIN,
      images: JSON.stringify(NEW_GALLERY),
    },
  })

  const after = await prisma.product.findUnique({
    where: { id: product.id },
    select: { image: true, images: true },
  })
  console.log('After: ', JSON.stringify(after))
}

main().finally(() => prisma.$disconnect())
