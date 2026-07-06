import { PrismaClient } from '@prisma/client'

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL or PRISMA_DATABASE_URL is required')

const prisma = new PrismaClient({ accelerateUrl: databaseUrl, log: ['error'] })

// New 1024x1024 studio set. Old /images/Second/brush.jpg is kept — it is still
// used by the training pages/mobile training as the scalp-brush thumbnail.
const NEW_MAIN = '/images/brush/main.jpg'
const NEW_GALLERY = [
  '/images/brush/s1.jpg',
  '/images/brush/s2.jpg',
  '/images/brush/s3.jpg',
  '/images/brush/s4.jpg',
]

async function main() {
  const p = await prisma.product.findFirst({
    where: { OR: [{ productNumber: '61' }, { id: '61' }] },
    select: { id: true, productNumber: true, name: true, image: true, images: true },
  })
  if (!p) throw new Error('Product 61 not found')
  console.log('BEFORE:', JSON.stringify(p, null, 2))

  const updated = await prisma.product.update({
    where: { id: p.id },
    data: { image: NEW_MAIN, images: JSON.stringify(NEW_GALLERY) },
    select: { id: true, name: true, image: true, images: true },
  })
  console.log('AFTER:', JSON.stringify(updated, null, 2))
}

main().finally(() => prisma.$disconnect())
