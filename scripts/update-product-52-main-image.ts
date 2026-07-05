/**
 * Product 52 (SKIN REBOOT PDRN MASK PACK) — gallery rework 2026-07-05:
 *  - main image: /images/PDRN.png → /images/pdrn_mask/main.jpeg (new studio shot)
 *  - drop the two old box renders (/images/PDRN.png was the prepended main;
 *    /images/Second/pdrnnn.jpg removed from the gallery array)
 */
import { PrismaClient } from '@prisma/client'

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL or PRISMA_DATABASE_URL is required')

const prisma = new PrismaClient({ accelerateUrl: databaseUrl, log: ['error'] })

const NEW_MAIN = '/images/pdrn_mask/main.jpeg'
const NEW_GALLERY = [
  '/images/Second/pdrn_big2.jpg',
  '/images/Second/pdrn22.jpg',
  '/images/pdrn_mask/s1.jpeg',
  '/images/pdrn_mask/s2.jpeg',
]

async function main() {
  const product = await prisma.product.findFirst({ where: { productNumber: '52' } })
  if (!product) throw new Error('Product 52 not found')

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
