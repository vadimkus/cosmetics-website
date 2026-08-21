import { prisma } from '../lib/prisma'
import {
  PRODUCT_52_AR_NAME,
  PRODUCT_52_AR_TRANSLATION,
  PRODUCT_52_FULL_INCI,
  PRODUCT_52_RU_NAME,
  PRODUCT_52_RU_TRANSLATION,
} from '../data/product52LocalizedCopy'

const expected = {
  productNumber: '52',
  nameRu: PRODUCT_52_RU_NAME,
  nameAr: PRODUCT_52_AR_NAME,
  description:
    'Thirty ultra-thin lyocell sheet masks in a 350g tub with built-in tweezers. Niacinamide 2% and adenosine 0.04% support the functional brightening and wrinkle-care claims; Sodium DNA (PDRN) is present at 0.1% / 1,000 ppm. Panthenol 1% and allantoin 0.1% complete the moisture-focused formula. Wear for 10–20 minutes.',
  descriptionRu: PRODUCT_52_RU_TRANSLATION.description,
  descriptionAr: PRODUCT_52_AR_TRANSLATION.description,
  productDetails: JSON.stringify({
    form: 'Ultra-thin lyocell sheet masks in a tub with built-in tweezers',
    netWeight: '350g / 30 sheets',
    functionalClaims: 'Helps brighten the skin and improve the appearance of wrinkles',
    functionalIngredients: 'Niacinamide 2% and adenosine 0.04%',
    sodiumDna: 'Sodium DNA (PDRN) 0.1% / 1,000 ppm; the official deck identifies salmon milt as its source',
    formulaBase:
      'Glycerin 5.094076%, dipropylene glycol 3%, propanediol 3%, butylene glycol 2.000004%, 1,2-hexanediol 1.504002%, Glycereth-26 1% and xylitol 1%',
    supportingIngredients: 'Panthenol 1% and allantoin 0.1%',
    wearTime: '10–20 minutes',
    frequency: 'Not specified on the carton',
    pH: '6.37 within the 5.00–7.00 specification',
    testing: 'Dermatologically tested; TEWL study after physical irritation',
    afterOpening: '6 months',
    origin: 'Made in Korea',
  }),
  keyFeatures: JSON.stringify([
    {
      title: 'Thirty-mask tub with tweezers',
      description: 'A 350g professional format with 30 individually drawn ultra-thin lyocell sheets.',
    },
    {
      title: 'Two registered cosmetic functions',
      description: 'Niacinamide 2% supports the brightening claim and adenosine 0.04% supports wrinkle care.',
    },
    {
      title: 'Sodium DNA at 1,000 ppm',
      description: 'The quantitative formula records 0.1%; the official DTS deck identifies salmon milt as the source.',
    },
    {
      title: 'Measured TEWL after one use',
      description:
        'After physical irritation, mean TEWL on the treated site fell from 13.445 to 8.735, or about 35%, in 20 women aged 20–60.',
    },
  ]),
  benefits: JSON.stringify([
    'A moisture-focused sheet-mask step for 10–20 minutes',
    'Niacinamide 2% for the functional brightening claim',
    'Adenosine 0.04% for the functional wrinkle-care claim',
    'Sodium DNA (PDRN) at 0.1% / 1,000 ppm',
    'Panthenol 1% and allantoin 0.1% as skin-conditioning ingredients',
    'Ultra-thin lyocell sheet and hygienic built-in tweezers',
  ]),
  ingredients: JSON.stringify([
    {
      name: 'Sodium DNA (PDRN) · 0.1% / 1,000 ppm',
      description: 'A skin-conditioning ingredient; the official deck identifies salmon milt as its source.',
    },
    { name: 'Niacinamide · 2%', description: 'The functional ingredient associated with the brightening claim.' },
    { name: 'Adenosine · 0.04%', description: 'The functional ingredient for wrinkle care.' },
    { name: 'Panthenol · 1%', description: 'A skin-conditioning ingredient in the formula.' },
    { name: 'Allantoin · 0.1%', description: 'A skin-conditioning ingredient in the formula.' },
    {
      name: 'Multi-humectant base',
      description:
        'Glycerin 5.094076%, dipropylene glycol 3%, propanediol 3%, butylene glycol 2.000004%, 1,2-hexanediol 1.504002%, Glycereth-26 1% and xylitol 1%.',
    },
    {
      name: 'Full INCI',
      description: `${PRODUCT_52_FULL_INCI} Contains lavender oil at 0.002% as an aromatic ingredient.`,
    },
  ]),
  howToUse: JSON.stringify([
    {
      step: 'Take one sheet',
      instruction: 'Use the built-in tweezers. Do not touch the remaining masks with your hands.',
    },
    {
      step: 'Apply',
      instruction: 'Place on clean skin and smooth from the centre out, avoiding the eyes and mucous membranes.',
    },
    {
      step: 'Leave for 10–20 minutes',
      instruction: 'Follow the application time printed on the carton.',
    },
    {
      step: 'Remove',
      instruction: 'Lift off the sheet and gently pat in the remaining essence. Do not rinse.',
    },
    {
      step: 'Reseal',
      instruction: 'Close the inner cover and lid tightly after every use to prevent drying.',
    },
  ]),
  directions:
    'The carton does not set a weekly frequency. For external use only. Avoid the eyes and mucous membranes. Do not use if you have an allergy to patches or compresses. Stop use and seek medical advice for redness, swelling, itching or irritation. Use the tweezers, close the inner cover and lid tightly, and store in a cool, dry place away from direct sunlight and children. Use within 6 months of opening. The carton does not claim post-procedure use.',
  size: '350 g / 30 sheets',
  skinType: null,
  targetConcerns: null,
  usage: null,
  ageGroup: null,
} as const

async function main() {
  const product = await prisma.product.findFirst({
    where: {
      OR: [
        { productNumber: '52' },
        { id: '52' },
        { name: { contains: 'SKIN REBOOT PDRN MASK PACK', mode: 'insensitive' } },
      ],
    },
  })
  if (!product) throw new Error('Product 52 SKIN REBOOT PDRN MASK PACK not found')

  const numberOwner = await prisma.product.findUnique({
    where: { productNumber: '52' },
    select: { id: true, name: true },
  })
  if (numberOwner && numberOwner.id !== product.id) {
    throw new Error(`productNumber 52 already belongs to ${numberOwner.id} (${numberOwner.name})`)
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
  if (mismatches.length) throw new Error(`Product 52 parity check failed: ${mismatches.join(', ')}`)

  // eslint-disable-next-line no-console
  console.log(JSON.stringify({ id: product.id, previousProductNumber: product.productNumber, changed, parity: 'verified' }, null, 2))
}

main()
  .catch(error => {
    // eslint-disable-next-line no-console
    console.error(error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
