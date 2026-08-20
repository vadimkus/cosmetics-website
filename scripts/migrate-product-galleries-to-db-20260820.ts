/**
 * Move the remaining config-only or stale galleries discovered during the native-app
 * media audit into Product.images, the canonical gallery source.
 *
 * Main images are deliberately excluded: web and mobile prepend Product.image.
 *
 * Run:
 *   npx tsx --env-file=.env.local scripts/migrate-product-galleries-to-db-20260820.ts
 */

import { prisma } from '../lib/prisma'

const GALLERIES: Record<string, string[]> = {
  '1': ['/images/Second/roller1.jpg', '/images/Second/roller_stamp2.jpg'],
  '23': ['/images/Second/nd_big1.jpg'],
  '28': ['/images/Second/hydro_second.jpg'],
  // Preserve the DB source of truth; /images/Second/hair_alpha.jpg was the stale override.
  '45': ['/images/Second/hs.jpg'],
}

async function main() {
  for (const [productNumber, gallery] of Object.entries(GALLERIES)) {
    const product = await prisma.product.findFirst({
      where: { OR: [{ productNumber }, { id: productNumber }] },
      select: { id: true, productNumber: true, name: true, image: true, images: true },
    })

    if (!product) throw new Error(`Product ${productNumber} not found`)
    if (gallery.includes(product.image)) {
      throw new Error(`Product ${productNumber}: main image must not be inside images`)
    }

    const before = product.images ? JSON.parse(product.images) : []
    await prisma.product.update({
      where: { id: product.id },
      data: { images: JSON.stringify(gallery) },
    })

    const after = await prisma.product.findUnique({
      where: { id: product.id },
      select: { images: true },
    })
    const saved = JSON.parse(after?.images || '[]') as string[]
    if (JSON.stringify(saved) !== JSON.stringify(gallery)) {
      throw new Error(`Product ${productNumber}: gallery verification failed`)
    }

    console.log(productNumber, product.name, { before, after: saved })
  }
}

main()
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
