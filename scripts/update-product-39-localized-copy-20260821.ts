import { prisma } from '../lib/prisma'
import {
  PRODUCT_39_AR_DESCRIPTION,
  PRODUCT_39_AR_NAME,
  PRODUCT_39_RU_DESCRIPTION,
  PRODUCT_39_RU_NAME,
} from '../data/product39LocalizedCopy'

async function main() {
  const product = await prisma.product.findFirst({
    where: {
      OR: [
        { productNumber: '39' },
        { id: '39' },
        { name: { contains: 'ULTRA SHIELD SUN CREAM' } },
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

  if (!product) throw new Error('Product 39 ULTRA SHIELD SUN CREAM not found')

  await prisma.product.update({
    where: { id: product.id },
    data: {
      productNumber: '39',
      nameRu: PRODUCT_39_RU_NAME,
      descriptionRu: PRODUCT_39_RU_DESCRIPTION,
      nameAr: PRODUCT_39_AR_NAME,
      descriptionAr: PRODUCT_39_AR_DESCRIPTION,
    },
  })

  console.log(JSON.stringify({
    product: {
      id: product.id,
      productNumber: product.productNumber,
      name: product.name,
    },
    changed: {
      nameRu: product.nameRu !== PRODUCT_39_RU_NAME,
      descriptionRu: product.descriptionRu !== PRODUCT_39_RU_DESCRIPTION,
      nameAr: product.nameAr !== PRODUCT_39_AR_NAME,
      descriptionAr: product.descriptionAr !== PRODUCT_39_AR_DESCRIPTION,
    },
    localized: {
      nameRu: PRODUCT_39_RU_NAME,
      nameAr: PRODUCT_39_AR_NAME,
    },
  }, null, 2))
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
