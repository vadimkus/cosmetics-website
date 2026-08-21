import { prisma } from '../lib/prisma'
import {
  PRODUCT_64_AR_NAME,
  PRODUCT_64_AR_TRANSLATION,
  PRODUCT_64_EN_DB_COPY,
  PRODUCT_64_RU_NAME,
  PRODUCT_64_RU_TRANSLATION,
} from '../data/product64LocalizedCopy'

const expected = {
  productNumber: '64',
  name: 'Hair Stamp For HAIRGEN BOOSTER',
  nameRu: PRODUCT_64_RU_NAME,
  nameAr: PRODUCT_64_AR_NAME,
  description: PRODUCT_64_EN_DB_COPY.description,
  descriptionRu: PRODUCT_64_RU_TRANSLATION.description,
  descriptionAr: PRODUCT_64_AR_TRANSLATION.description,
  productDetails: PRODUCT_64_EN_DB_COPY.productDetails,
  keyFeatures: PRODUCT_64_EN_DB_COPY.keyFeatures,
  benefits: PRODUCT_64_EN_DB_COPY.benefits,
  ingredients: PRODUCT_64_EN_DB_COPY.ingredients,
  howToUse: PRODUCT_64_EN_DB_COPY.howToUse,
  directions: PRODUCT_64_EN_DB_COPY.directions,
  size: '1 box · 8 stamps',
  skinType: null,
  targetConcerns: null,
  usage: null,
  ageGroup: null,
} as const

async function main() {
  const product = await prisma.product.findFirst({
    where: {
      OR: [
        { productNumber: '64' },
        { id: '64' },
        { name: { contains: 'Hair Stamp', mode: 'insensitive' } },
      ],
    },
  })
  if (!product) throw new Error('Product 64 Hair Stamp not found')

  const numberOwner = await prisma.product.findUnique({
    where: { productNumber: '64' },
    select: { id: true, name: true },
  })
  if (numberOwner && numberOwner.id !== product.id) {
    throw new Error(`productNumber 64 already belongs to ${numberOwner.id} (${numberOwner.name})`)
  }

  const preserved = {
    image: product.image,
    images: product.images,
    videoUrl: product.videoUrl,
  }
  const changed = Object.fromEntries(
    Object.entries(expected).map(([key, value]) => [
      key,
      product[key as keyof typeof product] !== value,
    ]),
  )

  await prisma.product.update({ where: { id: product.id }, data: expected })

  const verified = await prisma.product.findUniqueOrThrow({ where: { id: product.id } })
  const mismatches = Object.entries(expected)
    .filter(([key, value]) => verified[key as keyof typeof verified] !== value)
    .map(([key]) => key)
  if (mismatches.length) throw new Error(`Product 64 parity check failed: ${mismatches.join(', ')}`)

  for (const [key, value] of Object.entries(preserved)) {
    if (verified[key as keyof typeof verified] !== value) {
      throw new Error(`Product 64 asset preservation failed: ${key}`)
    }
  }
  if (verified.descriptionRu !== PRODUCT_64_RU_TRANSLATION.description) {
    throw new Error('Product 64 RU canonical parity failed')
  }
  if (verified.descriptionAr !== PRODUCT_64_AR_TRANSLATION.description) {
    throw new Error('Product 64 AR canonical parity failed')
  }

  // eslint-disable-next-line no-console
  console.log(JSON.stringify({
    id: product.id,
    changed,
    preserved,
    parity: 'verified',
  }, null, 2))
}

main()
  .catch(error => {
    // eslint-disable-next-line no-console
    console.error(error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
