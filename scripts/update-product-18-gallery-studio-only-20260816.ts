/**
 * Product 18 gallery: drop the Intertek carton packshots.
 * Hero stays the studio bottle. Claim slides s1-s6 stay on disk.
 */
import { PrismaClient } from '@prisma/client'

const url = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL || ''
const prisma = new PrismaClient({ accelerateUrl: url } as never)

async function main() {
  const product = await prisma.product.findFirst({
    where: {
      OR: [
        { id: '18' },
        { productNumber: '18' },
        { name: { contains: 'HYALURON SERUM' } },
      ],
    },
  })
  if (!product) throw new Error('product 18 not found')

  await prisma.product.update({
    where: { id: product.id },
    data: {
      image: '/images/hyaluron_serum/main.jpeg',
      images: null,
    },
  })

  console.log('cleared gallery', product.id, product.productNumber, product.name)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
