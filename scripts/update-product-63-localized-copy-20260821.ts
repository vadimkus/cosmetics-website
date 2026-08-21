import { prisma } from '../lib/prisma'
import {
  PRODUCT_63_AR_DESCRIPTION,
  PRODUCT_63_AR_NAME,
  PRODUCT_63_AR_TRANSLATION,
  PRODUCT_63_FULL_INCI,
  PRODUCT_63_RU_DESCRIPTION,
  PRODUCT_63_RU_NAME,
  PRODUCT_63_RU_TRANSLATION,
} from '../data/product63LocalizedCopy'

const expected = {
  productNumber: '63',
  name: 'REVITA GLOW BLEMISH BALM CREAM [SPF 38 PA+++]',
  nameRu: PRODUCT_63_RU_NAME,
  nameAr: PRODUCT_63_AR_NAME,
  description:
    'A 50 g tinted BB cream with natural, softly radiant coverage in #01 Bright and #02 Natural. Korean triple-functional registration covers UV protection (SPF 38 PA+++), brightening with niacinamide 2.000010%, and wrinkle care with adenosine 0.040000%. SPF primarily concerns UVB; PA+++ is high UVA protection in the PA system (PFA 8 to less than 16). No water-resistance claim is made. Use adequate dedicated sunscreen underneath for dependable full-face protection.',
  descriptionRu: PRODUCT_63_RU_DESCRIPTION,
  descriptionAr: PRODUCT_63_AR_DESCRIPTION,
  productDetails: JSON.stringify({
    form: 'Tinted BB cream',
    size: '50 g',
    shades: '#01 Bright · #02 Natural',
    registration: 'Korea: UV protection · brightening · wrinkle care',
    uvRating: 'SPF 38 PA+++',
    uvaMeaning: 'PA+++ = high UVA protection; PFA 8 to less than 16',
    filtersBright: '4 UV filters · 21.5895% total',
    filtersNatural: '4 UV filters · 20.6389% total',
    functionalIngredients: 'Niacinamide 2.000010% · adenosine 0.040000%',
    waterResistance: 'Not claimed',
    tested: 'Dermatologically tested',
    afterOpening: '12 months',
    origin: 'Made in Korea',
  }),
  keyFeatures: JSON.stringify([
    {
      title: 'SPF 38 PA+++',
      description: 'SPF primarily describes UVB protection; PA+++ is high UVA protection in the PA system.',
    },
    {
      title: 'Four UV filters',
      description:
        'Ethylhexyl Methoxycinnamate 7.5%, Ethylhexyl Salicylate 5%, Zinc Oxide 1.96%, and Titanium Dioxide 7.1295% / 6.1789%.',
    },
    {
      title: 'Two functional ingredients',
      description: 'Niacinamide 2.000010% for the registered brightening function and adenosine 0.040000% for wrinkle care.',
    },
    {
      title: 'Two genuinely different shades',
      description:
        '#01 Bright is lighter; #02 Natural is deeper and warmer. Pigments, mica, titanium dioxide and related aluminium hydroxide differ.',
    },
  ]),
  benefits: JSON.stringify([
    'Natural complexion coverage with a softly radiant finish',
    'SPF 38 PA+++ supported by four UV filters',
    'Niacinamide 2.000010% for the registered brightening function',
    'Adenosine 0.040000% for the registered wrinkle-care function',
    'Two shades: #01 Bright and #02 Natural',
    'Dermatologically tested',
  ]),
  ingredients: JSON.stringify([
    {
      name: 'UV filters · #01 Bright',
      description:
        'Ethylhexyl Methoxycinnamate 7.5% · Titanium Dioxide 7.1295% · Ethylhexyl Salicylate 5% · Zinc Oxide 1.96%. Total 21.5895%.',
    },
    {
      name: 'UV filters · #02 Natural',
      description:
        'Ethylhexyl Methoxycinnamate 7.5% · Titanium Dioxide 6.1789% · Ethylhexyl Salicylate 5% · Zinc Oxide 1.96%. Total 20.6389%.',
    },
    {
      name: 'Niacinamide · 2.000010%',
      description: 'Functional ingredient associated with the registered brightening claim.',
    },
    {
      name: 'Adenosine · 0.040000%',
      description: 'Functional ingredient associated with the registered wrinkle-care claim.',
    },
    { name: 'Tocopheryl Acetate · 0.100000%', description: 'Antioxidant in the quantitative formula.' },
    {
      name: '10 vitamin types',
      description:
        'A, B1, B2, B3, B4, B5, B7, B9, C and E are present. Eight types other than B3 and the principal E form are each at 0.000001%; no separate benefit is assigned.',
    },
    {
      name: 'Eight botanical extracts · 0.036% total',
      description:
        'Green tea, rosemary, centella, tremella, chamomile, Japanese knotweed, skullcap and licorice. Seven are at 0.005% each and Tremella at 0.001%; no separate benefit is assigned.',
    },
    {
      name: 'Fragrance disclosure',
      description:
        'Parfum, lemon and bitter-orange peel oils, linalool, linalyl acetate, limonene, citronellol, tetramethyl acetyloctahydronaphthalenes and hydroxycitronellal.',
    },
    { name: 'Full ingredient list (INCI)', description: PRODUCT_63_FULL_INCI },
  ]),
  howToUse: JSON.stringify([
    { step: 'Finish skincare', instruction: 'Use as the final cosmetic step after the morning skincare routine.' },
    { step: 'Blend evenly', instruction: 'Apply an appropriate amount and spread it evenly over the face.' },
    {
      step: 'Pat lightly',
      instruction: 'Finish with light patting. Use fingertips, a clean sponge or a brush; no dedicated puff is included.',
    },
    {
      step: 'Keep sun protection separate',
      instruction:
        'For dependable full-face protection, apply adequate dedicated sunscreen underneath and reapply it according to its label.',
    },
  ]),
  directions:
    'For external use only. Avoid the eyes, mucous membranes and damaged skin; rinse thoroughly with cool water after contact. Stop use and seek medical advice for persistent redness, swelling, itching or irritation. Store in a cool, dry place away from direct sunlight and children. Contains fragrance, lemon and bitter-orange peel oils, linalool, linalyl acetate, limonene, citronellol and hydroxycitronellal. No water-resistance claim is made; use dedicated water-resistant sunscreen for swimming or sweating.',
  size: '50 g',
  skinType: null,
  targetConcerns: JSON.stringify(['coverage', 'brightening', 'anti-aging', 'sun-protection']),
  usage: 'morning',
  ageGroup: 'adult',
} as const

async function main() {
  const product = await prisma.product.findFirst({
    where: {
      OR: [
        { productNumber: '63' },
        { id: '63' },
        { name: { contains: 'REVITA GLOW BLEMISH BALM', mode: 'insensitive' } },
      ],
    },
  })
  if (!product) throw new Error('Product 63 REVITA GLOW BLEMISH BALM CREAM not found')

  const numberOwner = await prisma.product.findUnique({
    where: { productNumber: '63' },
    select: { id: true, name: true },
  })
  if (numberOwner && numberOwner.id !== product.id) {
    throw new Error(`productNumber 63 already belongs to ${numberOwner.id} (${numberOwner.name})`)
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
  if (mismatches.length) throw new Error(`Product 63 parity check failed: ${mismatches.join(', ')}`)

  for (const [key, value] of Object.entries(preserved)) {
    if (verified[key as keyof typeof verified] !== value) {
      throw new Error(`Product 63 asset preservation failed: ${key}`)
    }
  }
  if (verified.descriptionRu !== PRODUCT_63_RU_TRANSLATION.description) {
    throw new Error('Product 63 RU canonical parity failed')
  }
  if (verified.descriptionAr !== PRODUCT_63_AR_TRANSLATION.description) {
    throw new Error('Product 63 AR canonical parity failed')
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
