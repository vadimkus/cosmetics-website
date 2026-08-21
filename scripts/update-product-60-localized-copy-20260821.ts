import { prisma } from '../lib/prisma'
import {
  PRODUCT_60_AR_NAME,
  PRODUCT_60_AR_TRANSLATION,
  PRODUCT_60_FULL_INCI,
  PRODUCT_60_RU_NAME,
  PRODUCT_60_RU_TRANSLATION,
} from '../data/product60LocalizedCopy'

const expected = {
  productNumber: '60',
  nameRu: PRODUCT_60_RU_NAME,
  nameAr: PRODUCT_60_AR_NAME,
  description:
    'Professional spicule cosmetic with Hydrolyzed Sponge at 5.72022%. The number 60000 means 60,000 ppm of the complete BIO-MESO™ PDRN complex, not a spicule count or the PDRN dose. Sodium DNA (PDRN) from salmon milt is 0.112% / 1,120 ppm; niacinamide is 2%, panthenol 1% and adenosine 0.04%. In an exact-product study after one application in 20 women aged 48 ± 8, four-week changes from baseline were -7.446% periorbital wrinkles, +19.858% elasticity and +52.247% moisture.',
  descriptionRu: PRODUCT_60_RU_TRANSLATION.description,
  descriptionAr: PRODUCT_60_AR_TRANSLATION.description,
  productDetails: JSON.stringify({
    format: 'Four 3 ml ampoules',
    professionalStatus: 'High-concentration professional cosmetic; use according to a trained-practitioner protocol',
    bioMesoComplex: 'BIO-MESO™ PDRN 60,000 ppm; this is the complete complex loading, not the PDRN concentration',
    hydrolyzedSponge: 'Hydrolyzed Sponge 5.72022%, sourced from freshwater sponge',
    sodiumDna: 'Sodium DNA (PDRN) 0.112% / 1,120 ppm, sourced from salmon milt',
    functionalIngredients: 'Niacinamide 2% and adenosine 0.04%',
    supportingIngredients: 'Panthenol 1% / 10,000 ppm; 17 peptides and 5 ceramides are present at trace concentrations',
    clinical: 'One application; 20 women aged 48 ± 8; measurements at weeks 1, 2 and 4',
    pH: '7.27 within the 5.70–7.70 specification',
    afterOpening: '12 months',
    origin: 'Made in Korea',
  }),
  keyFeatures: JSON.stringify([
    {
      title: '60000 identifies the complete complex',
      description: '60,000 ppm applies to BIO-MESO™ PDRN as a whole. Sodium DNA is stated separately at 1,120 ppm.',
    },
    {
      title: 'Hydrolyzed Sponge · 5.72022%',
      description: 'The second ingredient after water, sourced from freshwater sponge.',
    },
    {
      title: 'Two functional ingredients',
      description: 'Niacinamide 2% supports the brightening function and adenosine 0.04% supports wrinkle care.',
    },
    {
      title: 'Measurements through week four',
      description: 'After one application, the exact-product study measured 20 women at weeks 1, 2 and 4.',
    },
  ]),
  benefits: JSON.stringify([
    'Helps improve the appearance of uneven tone with niacinamide 2%',
    'Supports wrinkle care with adenosine 0.04%',
    'Contains salmon-milt Sodium DNA (PDRN) at 1,120 ppm',
    'Contains panthenol at 1% / 10,000 ppm',
    'Periorbital wrinkles changed -7.446% from baseline at week four in the studied group',
    'Elasticity changed +19.858% and moisture +52.247% from baseline at week four',
  ]),
  ingredients: JSON.stringify([
    {
      name: 'Hydrolyzed Sponge · 5.72022%',
      description: 'Freshwater-sponge spicule material. The quantitative formula does not state a separate spicule count.',
    },
    {
      name: 'Sodium DNA (PDRN) · 0.112% / 1,120 ppm',
      description: 'A skin-conditioning ingredient sourced from salmon milt.',
    },
    { name: 'Niacinamide · 2%', description: 'The functional ingredient associated with the brightening claim.' },
    { name: 'Panthenol · 1% / 10,000 ppm', description: 'A skin-conditioning ingredient in the quantitative formula.' },
    { name: 'Adenosine · 0.04%', description: 'The functional ingredient for wrinkle care.' },
    {
      name: '17 peptides and 5 ceramides',
      description: 'Present in the INCI at trace concentrations; no separate working dose or effect is assigned to them.',
    },
    { name: 'Full ingredient list (INCI)', description: PRODUCT_60_FULL_INCI },
  ]),
  howToUse: JSON.stringify([
    {
      step: 'Practitioner assessment',
      instruction: 'Use only within a professional protocol after assessing the condition of the skin.',
    },
    {
      step: 'Apply',
      instruction: 'Avoid the eye and lip area, spread evenly, and press the skin gently.',
    },
    { step: 'Roll', instruction: 'After gentle pressing, perform rolling according to the professional protocol.' },
    {
      step: 'Apply cream',
      instruction: 'Apply Intensive Hydro Soothing Cream, then roll again until the ampoule is absorbed.',
    },
    {
      step: 'Do not invent a timer',
      instruction: 'The carton does not state a contact time, rinse step, treatment interval, or course.',
    },
  ]),
  directions:
    'For external use only. Avoid the eye and lip area; rinse thoroughly with cool water after contact. Do not use on pustular acne, rosacea, open wounds, or recently treated facial skin. Stop use and seek medical advice for redness, swelling, or irritation. Store in a cool, dry place away from direct sunlight and children. The extended training material also excludes active infection, pronounced hypersensitivity, autoimmune skin disease, recent dermatological procedures, skin cancer or precancerous lesions, and recent sunburn or tanning. The carton gives no retinoid or isotretinoin washout periods; the treating clinician or practitioner must decide them.',
  size: '3 ml × 4 ampoules',
  skinType: null,
  targetConcerns: null,
  usage: null,
  ageGroup: null,
} as const

async function main() {
  const product = await prisma.product.findFirst({
    where: {
      OR: [
        { productNumber: '60' },
        { id: '60' },
        { name: { contains: 'PDRN EXPERT AMPOULE 60000', mode: 'insensitive' } },
      ],
    },
  })
  if (!product) throw new Error('Product 60 BIO-MESO PDRN EXPERT AMPOULE 60000 not found')

  const numberOwner = await prisma.product.findUnique({
    where: { productNumber: '60' },
    select: { id: true, name: true },
  })
  if (numberOwner && numberOwner.id !== product.id) {
    throw new Error(`productNumber 60 already belongs to ${numberOwner.id} (${numberOwner.name})`)
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
  if (mismatches.length) throw new Error(`Product 60 parity check failed: ${mismatches.join(', ')}`)

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
