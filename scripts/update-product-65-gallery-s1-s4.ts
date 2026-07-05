import { PrismaClient } from '@prisma/client'

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL or PRISMA_DATABASE_URL is required')

const prisma = new PrismaClient({ accelerateUrl: databaseUrl, log: ['error'] })

// New studio shots shown after the main image, in this order
const NEW_GALLERY = [
  '/images/meso_5000/s1.jpeg',
  '/images/meso_5000/s2.jpeg',
  '/images/meso_5000/s3.jpeg',
  '/images/meso_5000/s4.jpeg',
]

async function main() {
  const p = await prisma.product.findFirst({
    where: { OR: [{ productNumber: '65' }, { id: '65' }] },
    select: { id: true, productNumber: true, name: true, image: true, images: true },
  })
  if (!p) throw new Error('Product 65 not found')
  console.log('BEFORE:', JSON.stringify(p, null, 2))

  const updated = await prisma.product.update({
    where: { id: p.id },
    data: { images: JSON.stringify(NEW_GALLERY) },
    select: { id: true, name: true, image: true, images: true },
  })
  console.log('AFTER:', JSON.stringify(updated, null, 2))
}

main().finally(() => prisma.$disconnect())
