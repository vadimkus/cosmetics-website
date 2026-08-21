import { prisma } from '../lib/prisma'
import {
  PRODUCT_38_AR_DESCRIPTION,
  PRODUCT_38_AR_NAME,
  PRODUCT_38_RU_DESCRIPTION,
  PRODUCT_38_RU_NAME,
} from '../data/product38LocalizedCopy'

async function main() {
  const product = await prisma.product.findFirst({
    where: {
      OR: [
        { productNumber: '38' },
        { id: '38' },
        { name: { contains: 'EZ CO' } },
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

  if (!product) throw new Error('Product 38 EZ CO₂ MASK KIT not found')

  await prisma.product.update({
    where: { id: product.id },
    data: {
      productNumber: '38',
      nameRu: PRODUCT_38_RU_NAME,
      descriptionRu: PRODUCT_38_RU_DESCRIPTION,
      nameAr: PRODUCT_38_AR_NAME,
      descriptionAr: PRODUCT_38_AR_DESCRIPTION,
    },
  })

  console.log(JSON.stringify({
    product: {
      id: product.id,
      productNumber: product.productNumber,
      name: product.name,
    },
    changed: {
      nameRu: product.nameRu !== PRODUCT_38_RU_NAME,
      descriptionRu: product.descriptionRu !== PRODUCT_38_RU_DESCRIPTION,
      nameAr: product.nameAr !== PRODUCT_38_AR_NAME,
      descriptionAr: product.descriptionAr !== PRODUCT_38_AR_DESCRIPTION,
    },
    localized: {
      nameRu: PRODUCT_38_RU_NAME,
      nameAr: PRODUCT_38_AR_NAME,
    },
  }, null, 2))
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
