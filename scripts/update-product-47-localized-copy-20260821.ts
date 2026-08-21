import { prisma } from '../lib/prisma'
import { PRODUCT_45_FULL_INCI } from '../data/product45LocalizedCopy'
import { PRODUCT_46_FULL_INCI } from '../data/product46LocalizedCopy'
import {
  PRODUCT_47_AR_NAME,
  PRODUCT_47_AR_TRANSLATION,
  PRODUCT_47_RU_NAME,
  PRODUCT_47_RU_TRANSLATION,
} from '../data/product47LocalizedCopy'

const description =
  'Three-piece professional cosmetic scalp-care kit: HR³ MATRIX SCALP PEELING α 100 ml, six single-use 4 ml vials of HR³ MATRIX HAIR SOLUTION α and one single-use GENOSYS drum roller. The roller depth is 0.5 mm on the carton’s Russian panel. Apply the peeling only to intact scalp, leave for five minutes without rinsing and dry fully before rolling. Open Hair Solution immediately before use, apply it with the dropper during slow straight roller passes, massage gently and discard any remainder. The registered functions are scalp refreshing for the peeling and nutrition supply with hair conditioning for the solution. The kit is not a hair-loss, regrowth, DHT, angiogenesis or growth-factor treatment.'

const productDetails = JSON.stringify({
  form: 'Three-piece professional cosmetic scalp-care kit',
  contents: 'Scalp Peeling α 100 ml · Hair Solution α 4 ml × 6 vials · GENOSYS roller',
  registeredFunctions: 'Peeling: scalp refresher · Hair Solution: nutrition supply and hair conditioning',
  applicator: 'Drum roller; the carton contents line also writes STAMP(ROLLER)',
  needleDepth: '0.5 mm · printed on the registered carton’s Russian panel',
  rollerHandling: 'Open new, use once, do not share and discard safely after use',
  peelingMethod: 'Intact scalp only; cotton swab, massage, leave five minutes without rinsing',
  drying: 'Dry the scalp fully after the five-minute contact time; the carton’s Arabic panel states 2–5 minutes',
  solutionMethod: 'Apply by dropper during slow straight roller passes along the partings, then massage gently',
  afterOpening: 'Use the vial immediately after opening and discard any remainder',
  frequency: 'The kit carton sets no treatment frequency, course length or session count',
  pregnancy: 'Avoid during pregnancy and breastfeeding because Hair Solution carries that warning',
  origin: 'Made in Korea',
})

const keyFeatures = JSON.stringify([
  {
    title: 'Exact three-piece contents',
    description: 'Scalp Peeling α 100 ml, six 4 ml Hair Solution α vials and one GENOSYS 0.5 mm roller.',
  },
  {
    title: 'Peeling always comes first',
    description:
      'Apply only to intact scalp, leave for five minutes without rinsing and dry the scalp fully before rolling.',
  },
  {
    title: 'Slow, straight roller passes',
    description:
      'Work along each parting without zigzagging, jumping or curving, applying Hair Solution with the dropper as you go.',
  },
  {
    title: 'Single-use roller and vial',
    description:
      'Open each immediately before use, do not share the roller, and discard the roller and any vial remainder afterwards.',
  },
])

const benefits = JSON.stringify([
  'Combines cosmetic scalp cleansing and refreshing with nutrition supply and hair conditioning',
  'Contains a full 100 ml bottle of Scalp Peeling α',
  'Contains six fresh 4 ml vials of Hair Solution α',
  'Includes a GENOSYS drum roller with 0.5 mm depth printed on the carton',
  'Keeps the documented order: intact-scalp peeling, five minutes, full drying, roller with solution, gentle massage',
  'Does not promise hair-loss treatment, regrowth, DHT inhibition, angiogenesis or growth-factor efficacy',
])

const ingredients = JSON.stringify([
  {
    name: 'HR³ MATRIX SCALP PEELING α · 100 ml',
    description:
      'Leave-on scalp cleanser and refresher: Alcohol Denat. 33.600%, propylene glycol 11.994%, menthol 0.900% and menthyl lactate 0.800%.',
  },
  {
    name: 'HR³ MATRIX HAIR SOLUTION α · 4 ml × 6',
    description:
      'Leave-in conditioning solution with menthol 0.200%, niacinamide and panthenol at 0.100% each. Copper Tripeptide-1 is 5 ppm and four recombinant peptides total 1.2 ppm, without a hair-growth claim.',
  },
  { name: 'Full INCI — Scalp Peeling α', description: PRODUCT_46_FULL_INCI },
  { name: 'Full INCI — Hair Solution α', description: PRODUCT_45_FULL_INCI },
])

const howToUse = JSON.stringify([
  {
    step: 'Cleanse intact scalp',
    instruction:
      'Decant about 5 ml of Scalp Peeling α, soak a cotton swab, work through the partings and massage. Do not apply to damaged, infected or inflamed scalp.',
  },
  {
    step: 'Leave for five minutes',
    instruction: 'Do not rinse. The peeling is used only before the roller and never after rolling.',
  },
  {
    step: 'Dry fully',
    instruction:
      'After the five-minute contact time, dry the scalp and hair. The carton’s Arabic panel states 2–5 minutes. Keep heat away while the alcohol-based liquid remains wet.',
  },
  {
    step: 'Open a fresh vial',
    instruction: 'Open Hair Solution α immediately before use and fit the dropper.',
  },
  {
    step: 'Part and roll',
    instruction:
      'Make a parting with a comb. Roll a new roller slowly in a straight line along the parting while applying Hair Solution with the dropper. Do not zigzag, jump or curve.',
  },
  {
    step: 'Finish and discard',
    instruction:
      'Massage gently. Use the vial immediately after opening and discard any remainder. The roller is single-use; do not share or clean it for reuse.',
  },
])

const directions =
  'For external use by adults only. Do not use the roller with metal allergy, keloid tendency, eczema, dermatitis, or on damaged, infected or inflamed scalp. Avoid the kit during pregnancy and breastfeeding because Hair Solution carries that warning. Use Scalp Peeling only on intact scalp and before the roller, never after rolling. Avoid eyes and mucous membranes; rinse thoroughly with cool water on contact. Use an opened vial immediately and discard any remainder. Use the roller once, do not share it and discard it safely afterwards. The kit carton gives no treatment frequency, course length or session count. Seek medical assessment for noticeable or continuing hair loss.'

async function main() {
  const product = await prisma.product.findFirst({
    where: {
      OR: [
        { productNumber: '47' },
        { id: '47' },
        { name: { contains: 'MATRIX MESOPECIA KIT', mode: 'insensitive' } },
      ],
    },
  })

  if (!product) throw new Error('Product 47 HR³ MATRIX MESOPECIA KIT not found')

  const numberOwner = await prisma.product.findUnique({
    where: { productNumber: '47' },
    select: { id: true, name: true },
  })
  if (numberOwner && numberOwner.id !== product.id) {
    throw new Error(`productNumber 47 already belongs to ${numberOwner.id} (${numberOwner.name})`)
  }

  const expected = {
    productNumber: '47',
    nameRu: PRODUCT_47_RU_NAME,
    nameAr: PRODUCT_47_AR_NAME,
    description,
    descriptionRu: PRODUCT_47_RU_TRANSLATION.description,
    descriptionAr: PRODUCT_47_AR_TRANSLATION.description,
    productDetails,
    keyFeatures,
    benefits,
    ingredients,
    howToUse,
    directions,
    size: '1 kit',
    usage: null,
    targetConcerns: JSON.stringify(['scalp cleansing', 'scalp refreshing', 'hair conditioning']),
    ageGroup: 'adult',
  } as const

  const changed = Object.fromEntries(
    Object.entries(expected).map(([key, value]) => [
      key,
      product[key as keyof typeof product] !== value,
    ]),
  )

  await prisma.product.update({
    where: { id: product.id },
    data: expected,
  })

  const verified = await prisma.product.findUniqueOrThrow({
    where: { id: product.id },
    select: {
      id: true,
      productNumber: true,
      nameRu: true,
      nameAr: true,
      description: true,
      descriptionRu: true,
      descriptionAr: true,
      productDetails: true,
      keyFeatures: true,
      benefits: true,
      ingredients: true,
      howToUse: true,
      directions: true,
      size: true,
      usage: true,
      targetConcerns: true,
      ageGroup: true,
    },
  })

  const mismatches = Object.entries(expected)
    .filter(([key, value]) => verified[key as keyof typeof verified] !== value)
    .map(([key]) => key)

  if (mismatches.length) {
    throw new Error(`Product 47 parity check failed: ${mismatches.join(', ')}`)
  }

  console.log(JSON.stringify({
    id: product.id,
    previousProductNumber: product.productNumber,
    changed,
    parity: 'verified',
  }, null, 2))
}

main()
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
