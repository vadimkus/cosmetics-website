import { PrismaClient } from '@prisma/client'

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL or PRISMA_DATABASE_URL is required')

const prisma = new PrismaClient({ accelerateUrl: databaseUrl, log: ['error'] })

// New 1024x1024 studio shot (box + 8 stamp heads); replaces /images/BStamp1.png
const NEW_MAIN = '/images/needles/main.jpg'

async function main() {
  const p = await prisma.product.findFirst({
    where: { OR: [{ productNumber: '64' }, { id: '64' }] },
    select: { id: true, productNumber: true, name: true, image: true, images: true },
  })
  if (!p) throw new Error('Product 64 not found')
  console.log('BEFORE:', JSON.stringify(p, null, 2))

  const updated = await prisma.product.update({
    where: { id: p.id },
    data: { image: NEW_MAIN },
    select: { id: true, name: true, image: true, images: true },
  })
  console.log('AFTER:', JSON.stringify(updated, null, 2))
}

main().finally(() => prisma.$disconnect())
