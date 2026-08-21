import { prisma } from '../lib/prisma'
import {
  PRODUCT_40_AR_DESCRIPTION,
  PRODUCT_40_AR_NAME,
  PRODUCT_40_RU_DESCRIPTION,
  PRODUCT_40_RU_NAME,
} from '../data/product40LocalizedCopy'

async function main() {
  const product = await prisma.product.findFirst({
    where: {
      OR: [
        { productNumber: '40' },
        { id: '40' },
        { name: { contains: 'MULTI SUN CREAM' } },
      ],
    },
    select: {
      id: true,
      productNumber: true,
      name: true,
      nameRu: true,
      descriptionRu: true,
      nameAr: true,
      descriptionAr: true,
    },
  })

  if (!product) throw new Error('Product 40 MULTI SUN CREAM not found')

  const localized = {
    productNumber: '40',
    nameRu: PRODUCT_40_RU_NAME,
    descriptionRu: PRODUCT_40_RU_DESCRIPTION,
    nameAr: PRODUCT_40_AR_NAME,
    descriptionAr: PRODUCT_40_AR_DESCRIPTION,
  }

  const changed = {
    productNumber: product.productNumber !== localized.productNumber,
    nameRu: product.nameRu !== localized.nameRu,
    descriptionRu: product.descriptionRu !== localized.descriptionRu,
    nameAr: product.nameAr !== localized.nameAr,
    descriptionAr: product.descriptionAr !== localized.descriptionAr,
  }

  const updated = await prisma.product.update({
    where: { id: product.id },
    data: localized,
    select: {
      id: true,
      productNumber: true,
      nameRu: true,
      descriptionRu: true,
      nameAr: true,
      descriptionAr: true,
    },
  })

  console.log(JSON.stringify({
    product: {
      id: product.id,
      previousProductNumber: product.productNumber,
      name: product.name,
    },
    changed,
    updated,
  }, null, 2))
}

main()
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
