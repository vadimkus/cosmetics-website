import { prisma } from '../lib/prisma'
import { AUDITED_PRODUCT_LOCALIZED_COPY } from '../data/productLocalizedCopyAudit'

async function main() {
  const productNumbers = Array.from(
    new Set([
      ...Object.keys(AUDITED_PRODUCT_LOCALIZED_COPY.ru),
      ...Object.keys(AUDITED_PRODUCT_LOCALIZED_COPY.ar),
    ])
  )

  for (const productNumber of productNumbers) {
    const product = await prisma.product.findFirst({
      where: { OR: [{ productNumber }, { id: productNumber }] },
      select: { id: true },
    })
    if (!product) throw new Error(`Product ${productNumber} not found`)

    const ru =
      AUDITED_PRODUCT_LOCALIZED_COPY.ru[
        productNumber as keyof typeof AUDITED_PRODUCT_LOCALIZED_COPY.ru
      ]
    const ar =
      AUDITED_PRODUCT_LOCALIZED_COPY.ar[
        productNumber as keyof typeof AUDITED_PRODUCT_LOCALIZED_COPY.ar
      ]

    const updated = await prisma.product.update({
      where: { id: product.id },
      data: {
        productNumber,
        nameRu: ru?.name,
        descriptionRu: ru?.description,
        nameAr: ar?.name,
        descriptionAr: ar?.description,
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
}

main()
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
