/**
 * Product 63 listed /images/revita/main.jpg as both the main image and the
 * first gallery entry. Web and mobile both prepend product.image to the
 * gallery, so the thumbnail strip opened on the same shot twice.
 */
import { PrismaClient } from '@prisma/client'

const url = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL || ''
const prisma = new PrismaClient({ accelerateUrl: url } as never)

const IMAGES = [
  '/images/revita/s1.jpg',
  '/images/revita/s2.jpg',
  '/images/revita/s3.jpg',
  '/images/revita/s4.jpg',
]

async function main() {
  const p = await prisma.product.findFirst({
    where: { productNumber: '63' },
    select: { id: true, name: true, image: true, images: true },
  })
  if (!p) throw new Error('product 63 not found')

  console.log('before:', p.image, p.images)
  await prisma.product.update({
    where: { id: p.id },
    data: { images: JSON.stringify(IMAGES) },
  })
  const after = await prisma.product.findFirst({
    where: { productNumber: '63' },
    select: { image: true, images: true },
  })
  console.log('after: ', after?.image, after?.images)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
