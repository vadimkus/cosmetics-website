import { PrismaClient } from '@prisma/client'

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL or PRISMA_DATABASE_URL is required')

const prisma = new PrismaClient({ accelerateUrl: databaseUrl, log: ['error'] })

const NEW_MAIN = '/images/meso_5000/main.jpg'

async function main() {
  const p = await prisma.product.findFirst({
    where: { OR: [{ productNumber: '65' }, { id: '65' }] },
    select: { id: true, productNumber: true, name: true, image: true, images: true },
  })
  if (!p) throw new Error('Product 65 not found')
  console.log('BEFORE:', JSON.stringify(p, null, 2))

  const oldMain = p.image
  // Drop the previous main from the gallery too, if it appears there
  let gallery: string[] = []
  try {
    gallery = p.images ? JSON.parse(p.images) : []
  } catch {
    gallery = []
  }
  const newGallery = gallery.filter((img) => img !== oldMain && img !== NEW_MAIN)

  const updated = await prisma.product.update({
    where: { id: p.id },
    data: {
      image: NEW_MAIN,
      ...(JSON.stringify(newGallery) !== JSON.stringify(gallery)
        ? { images: JSON.stringify(newGallery) }
        : {}),
    },
    select: { id: true, name: true, image: true, images: true },
  })
  console.log('AFTER:', JSON.stringify(updated, null, 2))
}

main().finally(() => prisma.$disconnect())
