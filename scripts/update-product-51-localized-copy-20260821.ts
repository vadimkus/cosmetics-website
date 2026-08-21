import { prisma } from '../lib/prisma'
import {
  PRODUCT_51_AR_NAME,
  PRODUCT_51_AR_TRANSLATION,
  PRODUCT_51_RU_NAME,
  PRODUCT_51_RU_TRANSLATION,
} from '../data/product51LocalizedCopy'
import { FULL_INCI } from '../components/product/bioferment/bioFermentCopy'

const expected = {
  productNumber: '51',
  nameRu: PRODUCT_51_RU_NAME,
  nameAr: PRODUCT_51_AR_NAME,
  description:
    '300g professional powder modeling mask. Mix 40g, or three scoops, with four and a half scoops of water (powder 1 : water 1.5). It sets in 5–10 minutes and peels off in one piece after 15–20 minutes. About seven full treatments. Dermatologically tested.',
  descriptionRu: PRODUCT_51_RU_TRANSLATION.description,
  descriptionAr: PRODUCT_51_AR_TRANSLATION.description,
  productDetails: JSON.stringify({
    form: 'Powder modeling mask, mixed with water immediately before application',
    netWeight: '300g',
    treatmentAmount: '40g powder per treatment',
    scoopConversion: '3 scoops powder + 4.5 scoops water',
    mixRatio: 'Powder 1 : water 1.5',
    setTime: '5–10 minutes',
    wearTime: '15–20 minutes, then peel off in one piece',
    yield: 'About 7 complete 40g treatments',
    frequency: 'Once or twice a week',
    afterOpening: '6 months',
    testing: 'Dermatologically tested',
    origin: 'Made in Korea',
  }),
  keyFeatures: JSON.stringify([
    {
      title: 'Fresh mix for every treatment',
      description: 'Mix three scoops of powder with four and a half scoops of water immediately before application.',
    },
    {
      title: 'Peels off in one piece',
      description: 'Algin 15% and calcium sulfate 6% form the modeling base, which sets in 5–10 minutes.',
    },
    {
      title: 'Professional 300g jar',
      description: 'At 40g per treatment, one jar provides about seven complete applications.',
    },
    {
      title: 'Exact formula concentrations',
      description: 'Diatomaceous earth 41.79%, glucose 35%, algin 15% and calcium sulfate 6% form the powder base.',
    },
  ]),
  benefits: JSON.stringify([
    'Turns from powder into a set modeling mask when mixed with water',
    'Sets in 5–10 minutes and peels off in one piece after 15–20 minutes',
    'The exact 1 : 1.5 ratio supports a consistent mix each time',
    '40g per treatment · about 7 treatments in the 300g jar',
    'Contains hydrolyzed collagen 0.2% and allantoin 0.1% as skin-conditioning ingredients',
    'Dermatologically tested',
  ]),
  ingredients: JSON.stringify([
    { name: 'Diatomaceous Earth · 41.79%', description: 'The largest component in the mineral modeling-powder base.' },
    { name: 'Glucose · 35%', description: 'The second-largest component, identified as a humectant in the quantitative formula.' },
    { name: 'Algin 15% + Calcium Sulfate 6%', description: 'The pair that turns the water mix into a peelable sheet.' },
    { name: 'Hydrolyzed Collagen 0.2% + Allantoin 0.1%', description: 'Two skin-conditioning ingredients in the finished formula.' },
    {
      name: 'Menthol 0.02% + Cypress Water 0.093%',
      description: 'Both appear in the quantitative formula. The available INCI lists do not name Parfum or separate fragrance allergens.',
    },
    {
      name: 'Four fermented ingredients',
      description:
        'Bacillus/Soybean Ferment Extract, Galactomyces Ferment Filtrate and Bifida Ferment Lysate at 0.001% each; Lactobacillus/Punica Granatum Fruit Ferment Extract at 0.00001%.',
    },
    { name: 'Full INCI', description: FULL_INCI },
  ]),
  howToUse: JSON.stringify([
    {
      step: 'Mix',
      instruction: 'Measure three scoops, or 40g, of powder and add four and a half scoops of water. Stir until smooth.',
    },
    {
      step: 'Apply',
      instruction: 'Spread immediately in an even layer on clean skin, avoiding the eyes and eyebrows.',
    },
    {
      step: 'Leave for 15–20 minutes',
      instruction: 'The mask sets in 5–10 minutes. Keep it on for the complete treatment time.',
    },
    {
      step: 'Peel',
      instruction: 'Lift off gently in one piece and remove small remnants with toner.',
    },
    {
      step: 'Close the jar',
      instruction: 'Seal tightly and store the powder in a cool, dry place away from light and moisture.',
    },
  ]),
  directions:
    'Use once or twice a week. For external use only. Avoid the eyes and eyebrows; rinse thoroughly with cool water after eye contact. Stop use and seek medical advice for redness, swelling, itching or irritation. Store cool and dry, away from direct sunlight and children, with the lid tightly closed. Mix with water only. Use within 6 months of opening.',
  size: '300 g',
  skinType: null,
  targetConcerns: null,
  usage: null,
  ageGroup: null,
} as const

async function main() {
  const product = await prisma.product.findFirst({
    where: {
      OR: [
        { productNumber: '51' },
        { id: '51' },
        { name: { contains: 'BIO-FERMENT AGE DEFYING POWDER MASK', mode: 'insensitive' } },
      ],
    },
  })
  if (!product) throw new Error('Product 51 BIO-FERMENT AGE DEFYING POWDER MASK not found')

  const numberOwner = await prisma.product.findUnique({
    where: { productNumber: '51' },
    select: { id: true, name: true },
  })
  if (numberOwner && numberOwner.id !== product.id) {
    throw new Error(`productNumber 51 already belongs to ${numberOwner.id} (${numberOwner.name})`)
  }

  const changed = Object.fromEntries(
    Object.entries(expected).map(([key, value]) => [
      key,
      product[key as keyof typeof product] !== value,
    ]),
  )

  await prisma.product.update({ where: { id: product.id }, data: expected })

  const verified = await prisma.product.findUniqueOrThrow({
    where: { id: product.id },
  })
  const mismatches = Object.entries(expected)
    .filter(([key, value]) => verified[key as keyof typeof verified] !== value)
    .map(([key]) => key)
  if (mismatches.length) throw new Error(`Product 51 parity check failed: ${mismatches.join(', ')}`)

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
