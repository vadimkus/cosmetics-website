/**
 * Idempotently aligns product 44 with the current MEDI SCALP SHAMPOO α dossier
 * and the canonical RU/AR customer copy.
 *
 * Run:
 * npx tsx --env-file=.env.local scripts/update-product-44-medi-shampoo-record-20260817.ts
 */
/* eslint-disable no-console */
import { prisma } from '../lib/prisma'
import {
  PRODUCT_44_AR_NAME,
  PRODUCT_44_AR_TRANSLATION,
  PRODUCT_44_FULL_INCI,
  PRODUCT_44_RU_NAME,
  PRODUCT_44_RU_TRANSLATION,
} from '../data/product44LocalizedCopy'

const description =
  'Professional 300 ml rinse-off shampoo registered outside Korea for scalp and hair cleansing. Caffeine 1.000% is paired with menthol 1.120% and menthyl lactate 0.080% for strong cooling freshness. The cleansing system combines sodium C14-16 olefin sulfonate 14.100%, coco-betaine 5.250%, coco-glucoside 0.240% and decyl glucoside 0.160%. There is no SLS or SLES; the main cleanser is a sulfonate rather than a sulfate, but the formula remains a thorough cleanser. Glycerin 2.753% and sorbitol 0.210% support comfort after rinsing. Measured pH is 5.6 within the 4.50–6.50 specification. Dermatologically tested. Use 3–5 ml on damp scalp, leave the lather for about three minutes, then rinse thoroughly. Not a hair-loss or dandruff treatment.'

const productDetails = JSON.stringify({
  form: 'Rinse-off scalp and hair shampoo',
  size: '300 ml / 10.14 fl. oz.',
  registeredFunction: 'Scalp and hair cleansing',
  caffeine: '1.000%',
  cooling: 'Menthol 1.120%, menthyl lactate 0.080%',
  cleansingSystem:
    'Sodium C14-16 olefin sulfonate 14.100%, coco-betaine 5.250%, coco-glucoside 0.240%, decyl glucoside 0.160%',
  slsSles:
    'No sodium lauryl sulfate (SLS) or sodium laureth sulfate (SLES); the primary cleanser is a sulfonate, not a sulfate',
  humectants: 'Glycerin 2.753%, sorbitol 0.210%',
  pH: 'Measured 5.6; specification 4.50–6.50',
  fragrance: 'Parfum 0.300%',
  piroctoneOlamine: '0.010%; no dandruff-treatment claim',
  traceIngredients: 'Panthenol 75 ppm, biotin 2 ppm, saw palmetto 1 ppm, copper tripeptide-1 10 ppb',
  usage: 'Use 3–5 ml on damp scalp, massage, leave lather about three minutes, rinse thoroughly',
  testing: 'Dermatologically tested',
  origin: 'Made in Korea',
})

const keyFeatures = JSON.stringify([
  {
    title: 'Caffeine 1.000%',
    description: 'A full one per cent in the rinse-off scalp shampoo.',
  },
  {
    title: 'Menthol 1.120% + Menthyl Lactate 0.080%',
    description: 'A strongly cooling pair for a fresh wash experience.',
  },
  {
    title: 'Four-part cleansing system',
    description:
      'Sodium C14-16 olefin sulfonate 14.100%, coco-betaine 5.250%, coco-glucoside 0.240% and decyl glucoside 0.160%.',
  },
  {
    title: 'Glycerin 2.753% + Sorbitol 0.210%',
    description: 'Humectants that support comfort after thorough rinsing.',
  },
])

const benefits = JSON.stringify([
  'Cleanses the scalp and hair, its registered function outside Korea',
  'Provides strong cooling freshness from menthol 1.120% and menthyl lactate 0.080%',
  'Contains caffeine at 1.000%',
  'Supports post-rinse comfort with glycerin 2.753% and sorbitol 0.210%',
  'Contains no SLS or SLES; the main cleanser is sodium C14-16 olefin sulfonate',
  'Dermatologically tested and made in Korea',
])

const ingredients = JSON.stringify([
  { name: 'Caffeine 1.000%', description: 'A precise one-per-cent concentration in a rinse-off shampoo.' },
  {
    name: 'Menthol 1.120% + Menthyl Lactate 0.080%',
    description: 'The cooling pair responsible for the strong fresh sensation.',
  },
  {
    name: 'Cleansing system',
    description:
      'Sodium C14-16 olefin sulfonate 14.100%, coco-betaine 5.250%, coco-glucoside 0.240% and decyl glucoside 0.160%. No SLS or SLES; a sulfonate is not a sulfate.',
  },
  {
    name: 'Glycerin 2.753% + Sorbitol 0.210%',
    description: 'Humectants that support scalp comfort after thorough cleansing.',
  },
  {
    name: 'Piroctone Olamine 0.010%',
    description: 'Present without a dandruff-treatment claim.',
  },
  {
    name: 'Trace ingredients',
    description:
      'Panthenol 75 ppm, biotin 2 ppm, saw palmetto 1 ppm and copper tripeptide-1 10 ppb, without functional attribution.',
  },
  { name: 'Full INCI', description: PRODUCT_44_FULL_INCI },
])

const howToUse = JSON.stringify([
  { step: 'Wet', instruction: 'Wet the hair and scalp thoroughly with lukewarm water.' },
  { step: 'Lather 3–5 ml', instruction: 'Emulsify between wet palms and massage gently over the scalp.' },
  { step: 'Leave briefly', instruction: 'Leave the lather for about three minutes.' },
  { step: 'Rinse', instruction: 'Rinse thoroughly with water, including the hairline and nape.' },
])

const directions =
  'For external use only. Not for children under 3. Do not apply to damaged skin. Do not use near the eye area. Avoid contact with eyes and mucous membranes; if contact occurs, rinse immediately and thoroughly with cool water. Stop use and seek medical advice if redness, swelling, itching or irritation occurs. Store in a cool, dry place away from direct sunlight and children.'

async function main() {
  const matches = await prisma.product.findMany({
    where: {
      OR: [
        { productNumber: '44' },
        { id: '44' },
        { name: { contains: 'MEDI SCALP SHAMPOO', mode: 'insensitive' } },
      ],
    },
  })

  if (matches.length !== 1) {
    throw new Error(`Expected exactly one product 44 match, found ${matches.length}`)
  }

  const product = matches[0]
  await prisma.product.update({
    where: { id: product.id },
    data: {
      productNumber: '44',
      nameRu: PRODUCT_44_RU_NAME,
      nameAr: PRODUCT_44_AR_NAME,
      description,
      descriptionRu: PRODUCT_44_RU_TRANSLATION.description,
      descriptionAr: PRODUCT_44_AR_TRANSLATION.description,
      productDetails,
      keyFeatures,
      benefits,
      ingredients,
      howToUse,
      directions,
      usage: null,
      skinType: null,
      ageGroup: 'adult',
      targetConcerns: JSON.stringify(['hair', 'scalp-care']),
    },
  })

  const after = await prisma.product.findUniqueOrThrow({ where: { id: product.id } })
  const expected = {
    productNumber: '44',
    nameRu: PRODUCT_44_RU_NAME,
    nameAr: PRODUCT_44_AR_NAME,
    descriptionRu: PRODUCT_44_RU_TRANSLATION.description,
    descriptionAr: PRODUCT_44_AR_TRANSLATION.description,
    productDetails,
    keyFeatures,
    benefits,
    ingredients,
    howToUse,
    directions,
    usage: null,
    skinType: null,
    ageGroup: 'adult',
    targetConcerns: JSON.stringify(['hair', 'scalp-care']),
  }

  for (const [field, value] of Object.entries(expected)) {
    if (after[field as keyof typeof after] !== value) {
      throw new Error(`Database parity failed for ${field}`)
    }
  }

  console.log(`Product 44 updated with exact parity: id=${after.id}, productNumber=${after.productNumber}`)
}

main()
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
