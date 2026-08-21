import { prisma } from '../lib/prisma'
import {
  PRODUCT_54_AR_NAME,
  PRODUCT_54_AR_TRANSLATION,
  PRODUCT_54_RU_NAME,
  PRODUCT_54_RU_TRANSLATION,
} from '../data/product54LocalizedCopy'

const expected = {
  productNumber: '54',
  name: 'Holiday Kit',
  nameRu: PRODUCT_54_RU_NAME,
  nameAr: PRODUCT_54_AR_NAME,
  description:
    'A discontinued seasonal GENOSYS gift box with Snow O₂ Cleanser 180 ml, Multi Vita Radiance Serum 30 ml, Multi Vita Radiance Cream 50 g and a GENOSYS mirror. Use the three full-size skincare products in this order: cleanser, serum, cream. The cleanser uses Methyl Perfluoroisobutyl Ether 8% to form its bubbles; the serum contains niacinamide 2%, panthenol 1% and a stable vitamin C derivative 0.1%; the cream contains niacinamide 2%, macadamia oil 13% and squalane 1%. All three skincare products are individually dermatologically tested; the mirror is an accessory. The kit is currently out of stock and is retained in the catalog for reference.',
  descriptionRu: PRODUCT_54_RU_TRANSLATION.description,
  descriptionAr: PRODUCT_54_AR_TRANSLATION.description,
  productDetails: JSON.stringify({
    format: 'Discontinued seasonal gift set in a presentation box',
    size: '1 box',
    availability: 'Discontinued and currently out of stock',
    contents:
      'Snow O₂ Cleanser 180 ml + Multi Vita Radiance Serum 30 ml + Multi Vita Radiance Cream 50 g + GENOSYS mirror',
    useOrder: 'Cleanser → serum → cream; mirror as accessory',
    testing: 'All three skincare products are individually dermatologically tested',
    origin: 'Skincare products made in Korea',
  }),
  keyFeatures: JSON.stringify([
    {
      title: 'Three full-size products',
      description:
        'Snow O₂ Cleanser 180 ml, Multi Vita Radiance Serum 30 ml and Multi Vita Radiance Cream 50 g.',
    },
    {
      title: 'A clear three-step order',
      description:
        'Apply the cleanser to a dry face and rinse, follow with the serum, then finish with the cream.',
    },
    {
      title: 'GENOSYS mirror',
      description:
        'A compact accessory completes the presentation box. It is not a skincare step.',
    },
    {
      title: 'Archived seasonal edition',
      description:
        'The set remains public for reference but is discontinued and currently out of stock.',
    },
  ]),
  benefits: JSON.stringify([
    'Premium presentation box with three full-size skincare products and a GENOSYS mirror',
    'Snow O₂ Cleanser uses Methyl Perfluoroisobutyl Ether 8% to create its dry-face bubbles',
    'Multi Vita Radiance Serum contains niacinamide 2%, panthenol 1% and a stable vitamin C derivative 0.1%',
    'Multi Vita Radiance Cream combines niacinamide 2% with macadamia oil 13% and squalane 1%',
    'All three skincare products are individually dermatologically tested',
  ]),
  ingredients: JSON.stringify([
    {
      name: 'Snow O₂ Cleanser · 180 ml',
      description:
        'Dry-face bubble cleanser. Methyl Perfluoroisobutyl Ether 8% creates the foam; massage gently in circles and rinse with tepid water.',
    },
    {
      name: 'Multi Vita Radiance Serum · 30 ml',
      description:
        'Niacinamide 2%, panthenol 1% and a stable vitamin C derivative 0.1% for brighter, more even-looking tone.',
    },
    {
      name: 'Multi Vita Radiance Cream · 50 g',
      description:
        'Niacinamide 2% in a nourishing base with macadamia oil 13% and squalane 1% for normal to dry skin.',
    },
    {
      name: 'GENOSYS mirror',
      description: 'An accessory included in the box, not a cosmetic product.',
    },
  ]),
  howToUse: JSON.stringify([
    {
      step: '1. Cleanse',
      instruction:
        'Apply Snow O₂ Cleanser to a dry face away from the eyes. Let the bubbles form, massage gently in circles and rinse thoroughly with tepid water.',
    },
    {
      step: '2. Serum',
      instruction:
        'Pat two or three drops of Multi Vita Radiance Serum into the face, avoiding the eye area. Finish with sunscreen in the morning.',
    },
    {
      step: '3. Cream',
      instruction:
        'Apply a small amount of Multi Vita Radiance Cream after the serum, morning and night. Wear sunscreen over it by day.',
    },
    {
      step: 'Mirror',
      instruction:
        'Use the GENOSYS mirror as an application accessory. It does not add another skincare step.',
    },
  ]),
  directions:
    'For external use only. Keep all three products away from the eyes, mucous membranes and damaged skin; rinse thoroughly with cool water after eye contact. Apply the cleanser only to a dry face and rinse it off completely. Introduce the serum gradually if skin is prone to stinging, and stop if irritation persists. Do not use the serum during pregnancy; do not use the cleanser or cream during pregnancy or breastfeeding. The serum and cream contain bergamot oil, limonene and linalool. Keep products tightly closed in a cool, dry place away from direct sunlight and children. This discontinued kit is currently out of stock.',
  size: '1 box',
  category: 'kits',
  inStock: false,
  isHidden: false,
  skinType: null,
  targetConcerns: null,
  usage: null,
  ageGroup: null,
} as const

async function main() {
  const product = await prisma.product.findFirst({
    where: {
      OR: [
        { productNumber: '54' },
        { id: 'cmhf1a6p400000xfa0iu3bw42' },
        { name: { equals: 'Holiday Kit', mode: 'insensitive' } },
      ],
    },
  })
  if (!product) throw new Error('Product 54 Holiday Kit not found')

  const numberOwner = await prisma.product.findUnique({
    where: { productNumber: '54' },
    select: { id: true, name: true },
  })
  if (numberOwner && numberOwner.id !== product.id) {
    throw new Error(`productNumber 54 already belongs to ${numberOwner.id} (${numberOwner.name})`)
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
  if (mismatches.length) throw new Error(`Product 54 parity check failed: ${mismatches.join(', ')}`)

  // eslint-disable-next-line no-console
  console.log(JSON.stringify({
    id: product.id,
    previousProductNumber: product.productNumber,
    changed,
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
