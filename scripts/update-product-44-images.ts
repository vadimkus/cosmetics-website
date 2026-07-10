import { PrismaClient } from '@prisma/client'

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL or PRISMA_DATABASE_URL is required')

const prisma = new PrismaClient({ accelerateUrl: databaseUrl, log: ['error'] })

// New 1024x1024 set in /images/shampoo/ (lowercase per gallery rule).
// Main image is prepended automatically by web + mobile; gallery is S1-S6 only.
const NEW_MAIN = '/images/shampoo/Main.jpg'
const NEW_GALLERY = [
  '/images/shampoo/S1.jpg',
  '/images/shampoo/S2.jpg',
  '/images/shampoo/S3.jpg',
  '/images/shampoo/S4.jpg',
  '/images/shampoo/S5.jpg',
  '/images/shampoo/S6.jpg',
]

async function main() {
  const p = await prisma.product.findFirst({
    where: { OR: [{ productNumber: '44' }, { id: '44' }] },
    select: { id: true, productNumber: true, name: true, image: true, images: true },
  })
  if (!p) throw new Error('Product 44 not found')
  console.log('BEFORE:', JSON.stringify(p, null, 2))

  const dryRun = !process.argv.includes('--apply')
  if (dryRun) {
    console.log('DRY RUN — pass --apply to write')
    return
  }

  const updated = await prisma.product.update({
    where: { id: p.id },
    data: { image: NEW_MAIN, images: JSON.stringify(NEW_GALLERY) },
    select: { id: true, name: true, image: true, images: true },
  })
  console.log('AFTER:', JSON.stringify(updated, null, 2))
}

main().finally(() => prisma.$disconnect())
