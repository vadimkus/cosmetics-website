/* eslint-disable no-console */
import { prisma } from '../lib/prisma'
import {
  PRODUCT_57_AR_DESCRIPTION,
  PRODUCT_57_AR_NAME,
  PRODUCT_57_RU_DESCRIPTION,
  PRODUCT_57_RU_NAME,
} from '../data/product57LocalizedCopy'

const DESCRIPTION_EN =
  'Five full-size products and six physical pieces: SNOW O₂ 180 ml, SNOW BOOSTER 200 ml, SKIN CARING BB Cushion SPF 50+ PA++++ 15 g with a separate 15 g refill, SKIN DEFENDER Lip & Eye Makeup Remover 200 ml and SKIN RESCUE Overnight Cream Mask 100 g. Choose Ivory, Beige or Camel before adding the box to the bag. In the morning, cleanse, apply toner and finish with the cushion. In the evening, use remover first only when makeup was worn, then cleanse; use the leave-on mask last once or twice weekly. The bundle price and comparison with separate purchase are calculated from current prices.'

const PRODUCT_DETAILS = {
  form: 'Five-product beauty box · six physical pieces',
  contents:
    'SNOW O₂ 180 ml × 1 · SNOW BOOSTER 200 ml × 1 · BB Cushion 15 g × 1 · cushion refill 15 g × 1 · lip and eye remover 200 ml × 1 · overnight cream mask 100 g × 1',
  shade: '#01 Ivory · #02 Beige · #03 Camel; one selected with the box',
  morning: 'Cleanse → toner → BB cushion last',
  evening: 'When makeup was worn: lip and eye remover → cleanse',
  weekly: 'Leave-on overnight cream mask last, 1–2 times weekly',
  cushion: 'SPF 50+ PA++++ · five UV filters · niacinamide 2% · adenosine 0.04%',
  origin: 'Products made in Korea; box assembled in the UAE',
  pricing: 'Bundle value is calculated from current component prices',
}

const KEY_FEATURES = [
  {
    title: 'Five products, six pieces',
    description: 'The cushion compact and its separate 15 g refill make six physical pieces.',
  },
  {
    title: 'Three cushion shades',
    description: 'Choose #01 Ivory, #02 Beige or #03 Camel before adding the box to the bag.',
  },
  {
    title: 'Licensed three-function cushion',
    description: 'Every shade carries SPF 50+ PA++++, five UV filters, niacinamide 2% and adenosine 0.04%.',
  },
  {
    title: 'Clear AM and PM order',
    description: 'Cushion finishes the morning; remover starts the evening only when makeup was worn.',
  },
  {
    title: 'Live price comparison',
    description: 'The product page calculates the separate total and saving from current component records.',
  },
]

const BENEFITS = [
  'Five full-size products covering morning complexion and evening cleansing',
  'Cushion compact 15 g plus a separate 15 g refill',
  'Choice of Ivory, Beige or Camel with identical sun-protection and skincare declarations',
  'Cushion with five UV filters, niacinamide 2% and adenosine 0.04%',
  'Biphasic remover reserved for lip and eye makeup',
  'Leave-on overnight cream mask used once or twice weekly',
]

const HOW_TO_USE = [
  {
    step: 'Morning · cleanse',
    instruction:
      'Apply SNOW O₂ to a dry face, avoiding the eyes. Let the air foam form, massage gently in circles and rinse thoroughly with tepid water.',
  },
  {
    step: 'Morning and evening · toner',
    instruction: 'Apply SNOW BOOSTER with the hands or spray it on after cleansing.',
  },
  {
    step: 'Morning · cushion last',
    instruction:
      'Choose Ivory, Beige or Camel. Press the puff into the cushion and pat on in thin layers. Apply 15 minutes before sun exposure and reapply at least every two hours outdoors and after swimming, sweating or towelling. The waterproof film belongs to the puff; the formula does not claim water resistance.',
  },
  {
    step: 'Evening · remover when needed',
    instruction:
      'When makeup was worn, shake the biphasic remover well, saturate a cotton pad, hold it briefly against the lips or closed eyelid and wipe gently. Cleanse the face afterwards.',
  },
  {
    step: '1–2 times weekly · overnight mask',
    instruction:
      'Apply the leave-on cream mask as the final evening step and leave it on overnight.',
  },
]

const DIRECTIONS =
  'For external use only. Avoid direct eye contact; rinse thoroughly with water if contact occurs. Do not apply to damaged or inflamed skin. Stop use if persistent redness, swelling, itching or irritation occurs. SNOW O₂ contains fragrance and limonene. SNOW BOOSTER and the three cushion formulas contain no added fragrance. Parfum is absent from the current SKIN DEFENDER INCI, but its botanical extracts may give it a natural scent; use only on lips and closed eyelids. The overnight mask contains aromatic plant oils, citral, geraniol and limonene and is not for the eye area. The cushion is not declared water-resistant: the waterproof statement applies only to the puff film. Sunscreen is one part of sun protection; reapply at least every two hours outdoors and after water, sweating or towelling.'

export const PRODUCT_57_DB_EXPECTED = {
  productNumber: '57',
  name: 'CHARMING LOOK BEAUTY BOX',
  nameRu: PRODUCT_57_RU_NAME,
  nameAr: PRODUCT_57_AR_NAME,
  description: DESCRIPTION_EN,
  descriptionRu: PRODUCT_57_RU_DESCRIPTION,
  descriptionAr: PRODUCT_57_AR_DESCRIPTION,
  size: '1 set · 5 products · 6 pieces',
  productDetails: JSON.stringify(PRODUCT_DETAILS),
  keyFeatures: JSON.stringify(KEY_FEATURES),
  benefits: JSON.stringify(BENEFITS),
  ingredients: null,
  howToUse: JSON.stringify(HOW_TO_USE),
  directions: DIRECTIONS,
  skinType: null,
  targetConcerns: null,
  usage: null,
  ageGroup: null,
} as const

async function main() {
  const product = await prisma.product.findFirst({
    where: {
      OR: [
        { productNumber: '57' },
        { id: '57' },
        { name: 'CHARMING LOOK BEAUTY BOX' },
      ],
    },
  })
  if (!product) throw new Error('product 57 not found')
  if (product.productNumber && product.productNumber !== '57') {
    throw new Error(`refusing conflicting product owner ${product.id}: ${product.productNumber}`)
  }

  const changed = Object.fromEntries(
    Object.entries(PRODUCT_57_DB_EXPECTED).map(([key, value]) => [
      key,
      product[key as keyof typeof product] !== value,
    ]),
  )

  await prisma.product.update({
    where: { id: product.id },
    data: PRODUCT_57_DB_EXPECTED,
  })

  const verified = await prisma.product.findUniqueOrThrow({ where: { id: product.id } })
  const mismatches = Object.entries(PRODUCT_57_DB_EXPECTED).filter(
    ([key, value]) => verified[key as keyof typeof verified] !== value,
  )
  if (mismatches.length) {
    throw new Error(`product 57 parity failed: ${mismatches.map(([key]) => key).join(', ')}`)
  }

  const componentNumbers = ['10', '16', '41', '11', '34']
  const componentPrices = await prisma.product.findMany({
    where: { productNumber: { in: componentNumbers } },
    select: { productNumber: true, name: true, price: true },
  })
  const orderedPrices = componentNumbers.map(productNumber => {
    const component = componentPrices.find(item => item.productNumber === productNumber)
    if (!component) throw new Error(`missing component ${productNumber}`)
    return component
  })
  const separateTotal = orderedPrices.reduce((sum, item) => sum + Number(item.price), 0)
  const bundlePrice = Number(verified.price)
  const saving = separateTotal - bundlePrice
  const savingPercent = separateTotal > 0 ? (saving / separateTotal) * 100 : 0

  if (separateTotal !== 1520 || bundlePrice !== 1292 || saving !== 228 || savingPercent !== 15) {
    throw new Error(
      `product 57 price parity failed: separate=${separateTotal}, bundle=${bundlePrice}, saving=${saving}, percent=${savingPercent}`,
    )
  }

  console.log(JSON.stringify({
    id: verified.id,
    changed,
    parity: 'verified',
    size: verified.size,
    components: orderedPrices,
    separateTotal,
    bundlePrice,
    saving,
    savingPercent,
  }, null, 2))
}

if (process.env.NODE_ENV !== 'test') {
  main()
    .catch(error => {
      console.error(error)
      process.exit(1)
    })
    .finally(() => prisma.$disconnect())
}
