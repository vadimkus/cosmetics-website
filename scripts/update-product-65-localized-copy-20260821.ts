import { prisma } from '../lib/prisma'
import {
  PRODUCT_65_AR_NAME,
  PRODUCT_65_AR_TRANSLATION,
  PRODUCT_65_FULL_INCI,
  PRODUCT_65_RU_NAME,
  PRODUCT_65_RU_TRANSLATION,
} from '../data/product65LocalizedCopy'

const expected = {
  productNumber: '65',
  nameRu: PRODUCT_65_RU_NAME,
  nameAr: PRODUCT_65_AR_NAME,
  description:
    'A 50 ml weekly homecare ampoule with the complete BIO-MESO™ PDRN complex at 5,000 ppm. The number 5000 is not the Sodium DNA dose: Sodium DNA from salmon milt is 0.101% / 1,010 ppm. The quantitative formula also confirms Hydrolyzed Sponge 0.476685%, niacinamide 2%, panthenol 1% / 10,000 ppm and adenosine 0.04%. The product is registered in Korea as a functional cosmetic for brightening and wrinkle care. There is no product-specific efficacy study for this ampoule, so trace peptides, EGF, collagen, elastin and five ceramides are not presented as proven standalone benefits.',
  descriptionRu: PRODUCT_65_RU_TRANSLATION.description,
  descriptionAr: PRODUCT_65_AR_TRANSLATION.description,
  productDetails: JSON.stringify({
    format: 'Homecare ampoule',
    size: '50 ml',
    refCode: 'GCAP01',
    bioMesoComplex: 'BIO-MESO™ PDRN 5,000 ppm; the number applies to the complete complex, not Sodium DNA alone',
    hydrolyzedSponge: 'Hydrolyzed Sponge 0.476685%, sourced from freshwater sponge',
    sodiumDna: 'Sodium DNA (PDRN) 0.101% / 1,010 ppm, sourced from salmon milt',
    functionalIngredients: 'Niacinamide 2% and adenosine 0.04%',
    panthenol: 'Panthenol 1% / 10,000 ppm',
    use: 'Around 3 ml; spread, press gently, then roll for around 30 seconds',
    pH: '6.77 within the 5.60–7.60 specification',
    afterOpening: '12 months',
    origin: 'Made in Korea',
  }),
  keyFeatures: JSON.stringify([
    {
      title: '5000 identifies the complete complex',
      description: '5,000 ppm applies to BIO-MESO™ PDRN as a whole. Sodium DNA is stated separately at 1,010 ppm.',
    },
    {
      title: 'Hydrolyzed Sponge · 0.476685%',
      description: 'Freshwater-sponge material at the exact level in the quantitative formula.',
    },
    {
      title: 'Two functional ingredients',
      description: 'Niacinamide 2% supports the brightening function and adenosine 0.04% supports wrinkle care.',
    },
    {
      title: 'Documented homecare method',
      description: 'Around 3 ml, even application, gentle pressing, and rolling for around 30 seconds.',
    },
  ]),
  benefits: JSON.stringify([
    'Helps improve the appearance of uneven tone with niacinamide 2%',
    'Supports wrinkle care with adenosine 0.04%',
    'Contains salmon-milt Sodium DNA (PDRN) at 0.101% / 1,010 ppm',
    'Contains panthenol at 1% / 10,000 ppm',
    'Contains Hydrolyzed Sponge at 0.476685%',
  ]),
  ingredients: JSON.stringify([
    {
      name: 'Hydrolyzed Sponge · 0.476685%',
      description: 'Freshwater-sponge spicule material. No separate finished-product result is assigned to this ingredient.',
    },
    {
      name: 'Sodium DNA (PDRN) · 0.101% / 1,010 ppm',
      description: 'A skin-conditioning ingredient sourced from salmon milt.',
    },
    { name: 'Niacinamide · 2%', description: 'The functional ingredient associated with the brightening claim.' },
    { name: 'Panthenol · 1% / 10,000 ppm', description: 'A skin-conditioning ingredient in the quantitative formula.' },
    { name: 'Adenosine · 0.04%', description: 'The functional ingredient for wrinkle care.' },
    {
      name: '9 peptides, 5 ceramides, collagen and elastin',
      description: 'Present in the INCI at trace concentrations; no separate working dose or product-specific effect is assigned to them.',
    },
    { name: 'Full ingredient list (INCI)', description: PRODUCT_65_FULL_INCI },
  ]),
  howToUse: JSON.stringify([
    { step: 'Prepare', instruction: 'Use in the evening on clean skin. Avoid the eye and lip areas.' },
    { step: 'Apply', instruction: 'Spread around 3 ml of ampoule evenly over the face.' },
    { step: 'Press and roll', instruction: 'Press gently with palms or fingers, then massage with a rolling motion for around 30 seconds.' },
    { step: 'Apply the mask', instruction: 'Immediately apply Skin Reboot PDRN Mask for 10–15 minutes, then finish with gentle care.' },
  ]),
  directions:
    'The training protocol recommends use once weekly in the evening. Temporary prickling, redness, dryness or flaking may occur and varies by person. Do not pick flaking skin or combine the ampoule with a microneedle roller, acids, retinoids, peels, or irritating devices before the skin has settled. Finish the next morning with sunscreen; no fixed one-week sunscreen course is established for this homecare ampoule. For external use only. Avoid the eye and lip areas and rinse thoroughly with cool water after contact. Do not use with pustular acne, active rosacea, infection, open wounds, pronounced hypersensitivity, autoimmune skin disease, a recent skin procedure, sunburn or recent tanning. Seek medical advice before use during pregnancy or breastfeeding. Stop use and seek medical advice for severe or persistent redness, swelling or irritation.',
  size: '50 ml',
  skinType: null,
  targetConcerns: null,
  usage: null,
  ageGroup: null,
} as const

async function main() {
  const product = await prisma.product.findFirst({
    where: {
      OR: [
        { productNumber: '65' },
        { id: '65' },
        { name: { contains: 'PDRN HOMECARE AMPOULE 5000', mode: 'insensitive' } },
      ],
    },
  })
  if (!product) throw new Error('Product 65 BIO-MESO PDRN HOMECARE AMPOULE 5000 not found')

  const numberOwner = await prisma.product.findUnique({
    where: { productNumber: '65' },
    select: { id: true, name: true },
  })
  if (numberOwner && numberOwner.id !== product.id) {
    throw new Error(`productNumber 65 already belongs to ${numberOwner.id} (${numberOwner.name})`)
  }

  const preservedMedia = {
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
  if (mismatches.length) throw new Error(`Product 65 parity check failed: ${mismatches.join(', ')}`)
  for (const [key, value] of Object.entries(preservedMedia)) {
    if (verified[key as keyof typeof verified] !== value) {
      throw new Error(`Product 65 media preservation failed: ${key}`)
    }
  }

  // eslint-disable-next-line no-console
  console.log(JSON.stringify({
    id: product.id,
    previousProductNumber: product.productNumber,
    changed,
    preservedMedia,
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
