import { prisma } from '../lib/prisma'
import {
  PRODUCT_46_AR_NAME,
  PRODUCT_46_AR_TRANSLATION,
  PRODUCT_46_FULL_INCI,
  PRODUCT_46_RU_NAME,
  PRODUCT_46_RU_TRANSLATION,
} from '../data/product46LocalizedCopy'

const description =
  '100 ml professional leave-on scalp cleanser and refresher. Alcohol Denat. 33.600% and propylene glycol 11.994% help lift sebum, surface flakes and styling residue; menthol 0.900% plus menthyl lactate 0.800% gives a strong cooling sensation. Apply about 5 ml with a cotton swab, massage, leave for 5 minutes before Hair Solution if used, and do not rinse. Salicylic acid is present at 99 ppm, botanicals at 0.1–0.5 ppm and Copper Tripeptide-1 at 5 ppb, so no treatment function is attributed to them. Use only on intact scalp, never after microneedling. Not an antiseptic.'

const productDetails = JSON.stringify({
  form: 'Professional leave-on liquid scalp cleanser and refresher',
  size: '100 ml · 3.38 fl. oz.',
  registeredFunction: 'Scalp refresher',
  cleansingBase: 'Alcohol Denat. 33.600% · propylene glycol 11.994%',
  cooling: 'Menthol 0.900% · menthyl lactate 0.800%',
  salicylicAcid: '0.00990% · 99 ppm · not positioned as a working-strength BHA peel',
  traceIngredients: 'Green tea 0.5 ppm · fifteen other botanicals 0.1 ppm each · Copper Tripeptide-1 5 ppb',
  pH: 'Measured 4.31 · specification 4.00–5.00',
  application: 'About 5 ml; soak a cotton swab, work over the scalp, massage and leave for 5 minutes',
  rinsing: 'Do not rinse',
  frequency: 'Not specified on the carton or in the safety assessment',
  followOn: 'The carton places Hair Solution after 5 minutes; this is not an instruction to apply on needled skin',
  periodAfterOpening: '6 months',
  shelfLife: 'Three years unopened',
  testing: 'Dermatologically tested; satisfactory non-irritant patch test',
  targetGroup: 'Adults',
  origin: 'Made in Korea',
})

const keyFeatures = JSON.stringify([
  {
    title: 'Concentrated leave-on cleansing',
    description:
      'Alcohol Denat. 33.600% and propylene glycol 11.994% help lift sebum and styling residue without a heavy film.',
  },
  {
    title: '1.700% cooling pair',
    description:
      'Menthol 0.900% plus menthyl lactate 0.800% gives the highest combined cooling-agent total in the HR³ range.',
  },
  {
    title: 'Five minutes, no rinse',
    description:
      'Apply with a cotton swab, massage the scalp and leave for five minutes before the next cosmetic step.',
  },
  {
    title: 'Trace ingredients kept in proportion',
    description:
      'Salicylic acid is 99 ppm, fifteen other botanicals are 0.1 ppm each and Copper Tripeptide-1 is 5 ppb.',
  },
])

const benefits = JSON.stringify([
  'Helps remove sebum, surface flakes and styling residue from the scalp',
  'Leaves a clean, fresh sensation without rinsing',
  'Gives pronounced cooling from menthol 0.900% and menthyl lactate 0.800%',
  'Applies precisely along partings with a cotton swab',
  'Works as a standalone cosmetic cleanse before Hair Solution',
  'Dermatologically tested and made in Korea',
])

const ingredients = JSON.stringify([
  {
    name: 'Alcohol Denat. · 33.600%',
    description: 'The fast-drying cleansing base that helps lift sebum and styling residue.',
  },
  {
    name: 'Propylene Glycol · 11.994%',
    description: 'Supports even distribution and complements the cleansing base.',
  },
  {
    name: 'PEG-60 Hydrogenated Castor Oil · 2.000%',
    description: 'Solubiliser that keeps the water-and-alcohol formula uniform.',
  },
  {
    name: 'Menthol 0.900% · Menthyl Lactate 0.800%',
    description: 'A 1.700% cooling pair for a pronounced fresh sensation.',
  },
  {
    name: 'Betaine · 0.100%',
    description: 'A conditioning ingredient that balances the feel of the concentrated alcohol base.',
  },
  {
    name: 'Salicylic Acid · 0.00990%',
    description: '99 ppm. Disclosed in proportion to its dose, without a working-strength BHA claim.',
  },
  {
    name: 'Botanicals and peptide · trace levels',
    description:
      'Green tea 0.5 ppm, fifteen other botanicals 0.1 ppm each and Copper Tripeptide-1 5 ppb. No hair-loss, growth, follicle, circulation or anti-inflammatory function is attributed to them.',
  },
  { name: 'Full INCI', description: PRODUCT_46_FULL_INCI },
])

const howToUse = JSON.stringify([
  {
    step: 'Decant about 5 ml',
    instruction: 'Pour a small amount into a clean glass vessel.',
  },
  {
    step: 'Soak a cotton swab',
    instruction: 'Wet the swab head thoroughly with the solution.',
  },
  {
    step: 'Work over the scalp',
    instruction: 'Hold close to the swab head, work through the partings and massage the scalp.',
  },
  {
    step: 'Leave for 5 minutes',
    instruction: 'Do not rinse. Follow with Hair Solution if it is part of your routine.',
  },
])

const directions =
  'For external use by adults on intact scalp only. Do not use on children under three years of age. Avoid the eye area, eyes and mucous membranes; rinse thoroughly with cool water on contact. Do not apply after microneedling or to skin already punctured by needles. Do not use as an antiseptic or disinfectant. Stop use and seek medical advice if redness, swelling, itching or irritation occurs. Keep away from flame and heat because of the high alcohol content. Store in a cool, dry place away from direct sunlight and children. Use within 6 months of opening.'

async function main() {
  const product = await prisma.product.findFirst({
    where: {
      OR: [
        { productNumber: '46' },
        { id: '46' },
        { name: { contains: 'MATRIX SCALP PEELING', mode: 'insensitive' } },
      ],
    },
  })

  if (!product) throw new Error('Product 46 HR³ MATRIX SCALP PEELING α not found')

  const numberOwner = await prisma.product.findUnique({
    where: { productNumber: '46' },
    select: { id: true, name: true },
  })
  if (numberOwner && numberOwner.id !== product.id) {
    throw new Error(`productNumber 46 already belongs to ${numberOwner.id} (${numberOwner.name})`)
  }

  const expected = {
    productNumber: '46',
    nameRu: PRODUCT_46_RU_NAME,
    nameAr: PRODUCT_46_AR_NAME,
    description,
    descriptionRu: PRODUCT_46_RU_TRANSLATION.description,
    descriptionAr: PRODUCT_46_AR_TRANSLATION.description,
    productDetails,
    keyFeatures,
    benefits,
    ingredients,
    howToUse,
    directions,
    size: '100 ml',
    usage: null,
    targetConcerns: JSON.stringify(['scalp cleansing', 'surface buildup', 'excess sebum']),
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
    throw new Error(`Product 46 parity check failed: ${mismatches.join(', ')}`)
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
