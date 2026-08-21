import { prisma } from '../lib/prisma'
import {
  PRODUCT_37_AR_DESCRIPTION,
  PRODUCT_37_AR_NAME,
  PRODUCT_37_RU_DESCRIPTION,
  PRODUCT_37_RU_NAME,
} from '../data/product37LocalizedCopy'

async function main() {
  const product = await prisma.product.findFirst({
    where: {
      OR: [
        { productNumber: '37' },
        { id: '37' },
        { name: { contains: 'PEPTIDE GEL MASK' } },
      ],
    },
    select: { id: true, productNumber: true, name: true },
  })

  if (!product) throw new Error('Product 37 PEPTIDE GEL MASK not found')

  await prisma.product.update({
    where: { id: product.id },
    data: {
      productNumber: '37',
      nameRu: PRODUCT_37_RU_NAME,
      descriptionRu: PRODUCT_37_RU_DESCRIPTION,
      nameAr: PRODUCT_37_AR_NAME,
      descriptionAr: PRODUCT_37_AR_DESCRIPTION,
    },
  })

  console.log(`Updated localized DB fields for ${product.productNumber ?? product.id}: ${product.name}`)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
