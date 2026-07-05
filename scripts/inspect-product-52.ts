import { PrismaClient } from '@prisma/client'

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL or PRISMA_DATABASE_URL is required')

const prisma = new PrismaClient({ accelerateUrl: databaseUrl, log: ['error'] })

async function main() {
  const p = await prisma.product.findFirst({
    where: { productNumber: '52' },
    select: { id: true, productNumber: true, name: true, image: true, images: true, videoUrl: true },
  })
  console.log(JSON.stringify(p, null, 2))
}

main().finally(() => prisma.$disconnect())
