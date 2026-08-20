import { prisma } from '../lib/prisma'
import {
  PRODUCT_29_RU_DESCRIPTION,
  PRODUCT_29_RU_NAME,
} from '../data/product29RussianCopy'

async function main() {
  const product = await prisma.product.findFirst({
    where: { OR: [{ productNumber: '29' }, { id: '29' }] },
    select: { id: true },
  })
  if (!product) throw new Error('Product 29 not found')

  const updated = await prisma.product.update({
    where: { id: product.id },
    data: {
      nameRu: PRODUCT_29_RU_NAME,
      descriptionRu: PRODUCT_29_RU_DESCRIPTION,
    },
    select: {
      id: true,
      productNumber: true,
      nameRu: true,
      descriptionRu: true,
    },
  })

  console.log(updated)
}

main()
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
