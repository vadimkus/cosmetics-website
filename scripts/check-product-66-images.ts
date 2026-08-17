import { PrismaClient } from '@prisma/client'

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL or PRISMA_DATABASE_URL is required')

const prisma = new PrismaClient({ accelerateUrl: databaseUrl, log: ['error'] })

async function main() {
  const p = await prisma.product.findFirst({ where: { productNumber: '66' } })
  if (!p) { console.log('Product 66 not found'); return }
  console.log('id:', p.id)
  console.log('name:', p.name)
  console.log('image:', p.image)
  console.log('images:', p.images)
}

main().finally(() => prisma.$disconnect())
