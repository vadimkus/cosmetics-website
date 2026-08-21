import { prisma } from '../lib/prisma'
import {
  PRODUCT_1_AR_DESCRIPTION,
  PRODUCT_1_AR_NAME,
  PRODUCT_1_RU_DESCRIPTION,
  PRODUCT_1_RU_NAME,
} from '../data/product1LocalizedCopy'

async function main() {
  const product = await prisma.product.findFirst({
    where: { OR: [{ productNumber: '1' }, { id: '1' }] },
    select: { id: true },
  })
  if (!product) throw new Error('Product 1 not found')

  const updated = await prisma.product.update({
    where: { id: product.id },
    data: {
      productNumber: '1',
      nameRu: PRODUCT_1_RU_NAME,
      descriptionRu: PRODUCT_1_RU_DESCRIPTION,
      nameAr: PRODUCT_1_AR_NAME,
      descriptionAr: PRODUCT_1_AR_DESCRIPTION,
    },
    select: {
      id: true,
      productNumber: true,
      nameRu: true,
      nameAr: true,
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
