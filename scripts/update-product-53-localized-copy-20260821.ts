import { prisma } from '../lib/prisma'
import {
  PRODUCT_53_AR_NAME,
  PRODUCT_53_AR_TRANSLATION,
  PRODUCT_53_FULL_INCI,
  PRODUCT_53_RU_NAME,
  PRODUCT_53_RU_TRANSLATION,
} from '../data/product53LocalizedCopy'

const expected = {
  productNumber: '53',
  nameRu: PRODUCT_53_RU_NAME,
  nameAr: PRODUCT_53_AR_NAME,
  description:
    'One 23g non-woven sheet saturated with a moisture-focused essence. Glycerin 10.052% and butylene glycol 8.010% form an 18.062% humectant base, supported by betaine 0.8%, sodium hyaluronate 0.5% and allantoin 0.2%. Leave on for 15–20 minutes, remove and gently pat in the remaining essence. Dermatologically tested.',
  descriptionRu: PRODUCT_53_RU_TRANSLATION.description,
  descriptionAr: PRODUCT_53_AR_TRANSLATION.description,
  productDetails: JSON.stringify({
    form: 'Single-use non-woven sheet mask',
    netWeight: '23 g / 1 sheet',
    wearTime: '15–20 minutes',
    frequency: 'Not specified on the pack',
    formulaBase: 'Glycerin 10.052% + butylene glycol 8.010% = 18.062%',
    supportingIngredients: 'Betaine 0.8%, sodium hyaluronate 0.5% and allantoin 0.2%',
    collagen: 'Hydrolyzed collagen 0.0001% / 1 ppm',
    botanicals:
      'Grapefruit 0.475%, centella 0.285%, witch hazel 0.1%, pomegranate 0.0942% and soybean 0.0942%',
    pH: '6.67 and 6.96 in two COAs; specification 5.50–7.50',
    testing: 'Dermatologically tested',
    opening: 'Use immediately after opening; single use',
    origin: 'Made in Korea',
  }),
  keyFeatures: JSON.stringify([
    {
      title: '18.062% humectant base',
      description: 'Glycerin 10.052% plus butylene glycol 8.010% form the largest part of the essence after water.',
    },
    {
      title: 'One sheet · 23 g',
      description: 'An individually sealed single-use non-woven sheet.',
    },
    {
      title: '15–20 minutes',
      description: 'The exact wear time in the current English and Korean pack directions.',
    },
    {
      title: 'Dermatologically tested',
      description: 'The exact testing statement for this single-use sheet mask.',
    },
  ]),
  benefits: JSON.stringify([
    'A moisture-rich 15–20-minute sheet-mask step',
    'A softer, more comfortable skin feel from a multi-humectant essence',
    'Glycerin 10.052% and butylene glycol 8.010% as the formula base',
    'Betaine 0.8%, sodium hyaluronate 0.5% and allantoin 0.2%',
    'One individually sealed sheet for one use',
    'Dermatologically tested',
  ]),
  ingredients: JSON.stringify([
    {
      name: 'Glycerin 10.052% + butylene glycol 8.010%',
      description: 'The 18.062% humectant base of the essence.',
    },
    {
      name: 'Betaine 0.8% + sodium hyaluronate 0.5% + allantoin 0.2%',
      description: 'Supporting humectant and skin-conditioning ingredients.',
    },
    {
      name: 'Hydrolyzed collagen · 0.0001% / 1 ppm',
      description: 'The namesake skin-conditioning ingredient at its exact documented concentration.',
    },
    {
      name: 'Five botanical extracts',
      description:
        'Grapefruit 0.475%, centella 0.285%, witch hazel 0.1%, pomegranate 0.0942% and soybean 0.0942%.',
    },
    {
      name: 'Fragrance and alcohol',
      description:
        'Contains Alcohol 0.1% and Parfum (Fragrance) 0.01%. The INCI does not list separate fragrance allergens; soybean extract is also present.',
    },
    { name: 'Full INCI', description: PRODUCT_53_FULL_INCI },
  ]),
  howToUse: JSON.stringify([
    {
      step: 'Open',
      instruction: 'Remove and unfold the sheet. Use immediately after opening.',
    },
    {
      step: 'Apply',
      instruction: 'Place on clean skin, avoiding the eyes and mouth.',
    },
    {
      step: 'Leave for 15–20 minutes',
      instruction: 'Follow the application time printed on the pack.',
    },
    {
      step: 'Remove',
      instruction: 'Lift off and gently pat in the essence left on the skin. Do not rinse.',
    },
    {
      step: 'Discard',
      instruction: 'The sheet is single-use. Do not store the opened sachet or reuse the mask.',
    },
  ]),
  directions:
    'For external use only. Avoid the eyes and mucous membranes; rinse thoroughly with cool water after contact. Do not apply to damaged skin. Stop use and seek medical advice for redness, swelling, itching or irritation. Use cautiously if you react to patches or compresses. Contains Alcohol 0.1%, Parfum (Fragrance) 0.01% and soybean extract. Store in a cool, dry place away from direct sunlight and children. Use immediately after opening. The pack does not set a weekly frequency.',
  size: '23 g / 1 sheet',
  skinType: null,
  targetConcerns: null,
  usage: null,
  ageGroup: null,
} as const

async function main() {
  const product = await prisma.product.findFirst({
    where: {
      OR: [
        { productNumber: '53' },
        { id: '53' },
        { name: { contains: 'INTENSIVE REPAIR COLLAGEN MASK', mode: 'insensitive' } },
      ],
    },
  })
  if (!product) throw new Error('Product 53 INTENSIVE REPAIR COLLAGEN MASK not found')

  const numberOwner = await prisma.product.findUnique({
    where: { productNumber: '53' },
    select: { id: true, name: true },
  })
  if (numberOwner && numberOwner.id !== product.id) {
    throw new Error(`productNumber 53 already belongs to ${numberOwner.id} (${numberOwner.name})`)
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
  if (mismatches.length) throw new Error(`Product 53 parity check failed: ${mismatches.join(', ')}`)

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
