/**
 * Product 51 (BIO-FERMENT AGE DEFYING POWDER MASK) — gallery rework 2026-07-05:
 *  - main image: /images/BFAD.png → /images/bio_ferment/bferment_main.jpg (new studio shot)
 *  - BFAD.png (jar + bowl scene) stays in the gallery; drop the plain white
 *    jar render (/images/Second/ferment_big.jpg)
 *  - migrates the gallery from data/productConfig.ts to the DB `images`
 *    field (single source of truth)
 */
import { PrismaClient } from '@prisma/client'

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL or PRISMA_DATABASE_URL is required')

const prisma = new PrismaClient({ accelerateUrl: databaseUrl, log: ['error'] })

const NEW_MAIN = '/images/bio_ferment/bferment_main.jpg'
const NEW_GALLERY = [
  '/images/BFAD.png',
  '/images/Third/Ferment_3.jpeg',
  '/images/Third/ferment_high.jpeg',
]

async function main() {
  const product = await prisma.product.findFirst({
    where: { OR: [{ productNumber: '51' }, { id: '51' }] },
  })
  if (!product) throw new Error('Product 51 not found')

  console.log('Before:', { image: product.image, images: product.images })

  const updated = await prisma.product.update({
    where: { id: product.id },
    data: {
      image: NEW_MAIN,
      images: JSON.stringify(NEW_GALLERY),
    },
  })

  console.log('After:', { image: updated.image, images: updated.images })
}

main().finally(() => prisma.$disconnect())
