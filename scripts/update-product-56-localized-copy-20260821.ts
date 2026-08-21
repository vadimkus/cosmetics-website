/* eslint-disable no-console */
import { prisma } from '../lib/prisma'
import {
  PRODUCT_56_AR_DESCRIPTION,
  PRODUCT_56_AR_NAME,
  PRODUCT_56_RU_DESCRIPTION,
  PRODUCT_56_RU_NAME,
} from '../data/product56LocalizedCopy'

const DESCRIPTION_EN =
  'Six products for dull, uneven-looking skin: SNOW O₂ 180 ml, SNOW BOOSTER 200 ml, MULTI VITA RADIANCE SERUM 30 ml, MULTI VITA RADIANCE CREAM 50 g, EPI TURNOVER BOOSTING PEELING GEL 100 g and one SOOTHING BOMB SEA ALGAE MASK 25 g. Use cleanser, booster, serum and cream morning and evening, finishing mornings with sunscreen. Use the peeling gel 1–2 times weekly on dry skin and leave the mask on for 15–20 minutes on a different evening. The bundle price and comparison with separate purchase are calculated from current prices.'

const PRODUCT_DETAILS = {
  form: 'Six-product beauty box · six retail units',
  contents:
    'SNOW O₂ 180 ml × 1 · SNOW BOOSTER 200 ml × 1 · serum 30 ml × 1 · cream 50 g × 1 · peeling gel 100 g × 1 · mask 25 g × 1',
  dailyRoutine: 'Cleanse → booster → serum → cream, morning and evening',
  weeklyRoutine: 'Peeling gel 1–2 times weekly; mask for 15–20 minutes on a different evening',
  serum: 'Niacinamide 2% · panthenol 1% · 3-O-Ethyl Ascorbic Acid 0.1%',
  cream: 'Niacinamide 2% · macadamia oil 13% · squalane 1%',
  peelingGel: 'Cellulose 3% · rinse-off gommage for dry skin',
  mask: 'Eucalace® · methylpropanediol 10% · glycerin 5.035% · allantoin and panthenol 0.1% each',
  origin: 'Products made in Korea; box assembled in the UAE',
  pricing: 'Bundle value is calculated from current component prices',
}

const KEY_FEATURES = [
  {
    title: 'Exact six-piece contents',
    description: 'Four daily products, one 100 g peeling gel and one 25 g sheet mask.',
  },
  {
    title: 'Niacinamide 2% in two steps',
    description: 'The serum and cream support a brighter, more even-looking tone in different textures.',
  },
  {
    title: 'Clear routine rhythm',
    description: 'The daily core stays consistent while peel and mask are used on different evenings.',
  },
  {
    title: 'Live price comparison',
    description: 'The product page calculates the separate total and saving from current component records.',
  },
]

const BENEFITS = [
  'A sequential cosmetic routine for dull, uneven-looking skin',
  'Serum with niacinamide 2%, panthenol 1% and a stable vitamin C derivative at 0.1%',
  'Cream with niacinamide 2%, macadamia oil 13% and squalane 1%',
  'Rinse-off gommage with cellulose 3% as a separate weekly step',
  'One moisturizing Eucalace® sheet mask for 15–20 minutes',
  'Morning care finishes with suitable sunscreen',
]

const HOW_TO_USE = [
  {
    step: 'Morning and evening · cleanse',
    instruction:
      'Apply SNOW O₂ to a dry face, avoiding the eyes. Let the air foam form, massage gently in circles and rinse thoroughly with tepid water.',
  },
  {
    step: 'Morning and evening · booster',
    instruction: 'Apply SNOW BOOSTER with the hands or spray it on after cleansing.',
  },
  {
    step: 'Morning and evening · serum and cream',
    instruction:
      'Pat in two or three drops of serum, avoiding the eye area, then apply a small amount of cream.',
  },
  {
    step: '1–2 times weekly · peel',
    instruction:
      'After cleansing, dry the face. Massage the peeling gel in circles for 30–60 seconds and rinse with tepid water. Do not use on damaged or inflamed skin.',
  },
  {
    step: 'Separate evening · mask',
    instruction:
      'After cleansing and booster, leave the mask on for 15–20 minutes. Remove and pat in the remaining essence without rinsing. Do not use it on the same evening as the peeling gel.',
  },
  {
    step: 'Morning · sunscreen',
    instruction: 'Finish the morning routine with suitable sunscreen.',
  },
]

const DIRECTIONS =
  'For external use only. Avoid the eyes and mucous membranes; do not apply to damaged or inflamed skin. Stop use if persistent stinging, redness, swelling, itching or irritation occurs. SNOW O₂ contains fragrance, limonene and Sodium Laureth Sulfate; the serum contains bergamot oil, limonene and linalool; the cream is fragranced; the peeling gel contains Alcohol Denat. 4.75%, fragrance 0.2% and Hexyl Cinnamal; the mask contains peppermint oil at 0.005%. Introduce products one at a time if sensitive. Use peel and mask on different evenings. During pregnancy or breastfeeding, discuss the routine with a doctor: warnings are printed on the SNOW O₂ and serum packs. Use the mask cautiously if sensitive to plasters or compresses and use immediately after opening.'

const EXPECTED = {
  productNumber: '56',
  name: 'SKIN BRIGHTENING BEAUTY BOX',
  nameRu: PRODUCT_56_RU_NAME,
  nameAr: PRODUCT_56_AR_NAME,
  description: DESCRIPTION_EN,
  descriptionRu: PRODUCT_56_RU_DESCRIPTION,
  descriptionAr: PRODUCT_56_AR_DESCRIPTION,
  size: '1 set · 6 pieces',
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
        { productNumber: '56' },
        { id: 'cmhoyg0r400008o7s4va63hsw' },
        { name: 'SKIN BRIGHTENING BEAUTY BOX' },
      ],
    },
  })
  if (!product) throw new Error('product 56 not found')
  if (product.productNumber && product.productNumber !== '56') {
    throw new Error(`refusing conflicting product owner ${product.id}: ${product.productNumber}`)
  }

  const changed = Object.fromEntries(
    Object.entries(EXPECTED).map(([key, value]) => [
      key,
      product[key as keyof typeof product] !== value,
    ]),
  )

  await prisma.product.update({
    where: { id: product.id },
    data: EXPECTED,
  })

  const verified = await prisma.product.findUniqueOrThrow({ where: { id: product.id } })
  const mismatches = Object.entries(EXPECTED).filter(
    ([key, value]) => verified[key as keyof typeof verified] !== value,
  )
  if (mismatches.length) {
    throw new Error(`product 56 parity failed: ${mismatches.map(([key]) => key).join(', ')}`)
  }

  const componentPrices = await prisma.product.findMany({
    where: { productNumber: { in: ['10', '12', '16', '21', '31', '36'] } },
    select: { productNumber: true, name: true, price: true },
  })
  const orderedPrices = ['10', '16', '21', '31', '12', '36'].map(productNumber => {
    const component = componentPrices.find(item => item.productNumber === productNumber)
    if (!component) throw new Error(`missing component ${productNumber}`)
    return component
  })
  const separateTotal = orderedPrices.reduce((sum, item) => sum + Number(item.price), 0)
  const bundlePrice = Number(verified.price)
  const saving = separateTotal - bundlePrice
  const savingPercent = separateTotal > 0 ? (saving / separateTotal) * 100 : 0

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

main()
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
