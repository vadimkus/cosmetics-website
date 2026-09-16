/**
 * Set Hair-GENTRON (product 48) public retail price to AED 6,600.
 *
 * Partner pricing is enforced separately in lib/discountUtils.ts at AED 3,300.
 *
 * Run:
 *   npx tsx --env-file=.env.local scripts/set-product-48-retail-price-6600.ts
 */
import { prisma } from '@/lib/prisma'

const PRODUCT_NUMBER = '48'
const RETAIL_PRICE = 6600

async function main() {
  const before = await prisma.product.findFirst({
    where: {
      OR: [
        { productNumber: PRODUCT_NUMBER },
        { name: { equals: 'Hair-GENTRON', mode: 'insensitive' } },
      ],
    },
    select: {
      id: true,
      productNumber: true,
      name: true,
      price: true,
      variants: {
        select: { id: true, price: true },
      },
    },
  })
  if (!before) throw new Error('Hair-GENTRON product 48 not found')

  await prisma.$transaction([
    prisma.product.update({
      where: { id: before.id },
      data: { price: RETAIL_PRICE },
    }),
    prisma.productVariant.updateMany({
      where: { productId: before.id },
      data: { price: RETAIL_PRICE },
    }),
  ])

  const after = await prisma.product.findUnique({
    where: { id: before.id },
    select: {
      productNumber: true,
      name: true,
      price: true,
      variants: {
        select: { id: true, price: true },
      },
    },
  })

  console.log(JSON.stringify({ before, after }, null, 2))
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
