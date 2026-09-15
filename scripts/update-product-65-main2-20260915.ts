import { PrismaClient } from '@prisma/client'

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL or PRISMA_DATABASE_URL is required')
const prisma = new PrismaClient({ accelerateUrl: databaseUrl, log: ['error'] })

const NEW_MAIN = '/images/pdrn_5000_new/main2c.jpg'

async function main() {
  const p = await prisma.product.findFirst({
    where: { productNumber: '65' },
    select: { id: true, name: true, image: true, images: true },
  })
  if (!p) throw new Error('Product 65 not found')
  console.log('BEFORE:', p)
  const updated = await prisma.product.update({
    where: { id: p.id },
    data: { image: NEW_MAIN },
    select: { id: true, name: true, image: true },
  })
  console.log('AFTER:', updated)
}

main().finally(() => prisma.$disconnect())
