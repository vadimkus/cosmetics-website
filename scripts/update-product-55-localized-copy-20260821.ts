import { prisma } from '../lib/prisma'
import {
  PRODUCT_55_AR_DESCRIPTION,
  PRODUCT_55_AR_NAME,
  PRODUCT_55_RU_DESCRIPTION,
  PRODUCT_55_RU_NAME,
} from '../data/product55LocalizedCopy'

const DESCRIPTION_EN =
  'A complete routine for oily, combination and blemish-prone skin: SNOW O₂ 180 ml, INTENSIVE PROBLEM CONTROL TONER 200 ml, PROBLEM CONTROL SERUM 30 ml, INTENSIVE PROBLEM CONTROL CREAM 50 g and three SOOTHING BOMB SEA ALGAE masks at 25 g each. Use cleanser, toner, serum and cream morning and evening. On a mask evening, leave the sheet on for 15–20 minutes after toner, then continue with serum and cream. The bundle price and comparison with separate purchase are calculated from current prices.'

const PRODUCT_DETAILS = {
  form: 'Five-product beauty box · seven retail units',
  contents:
    'SNOW O₂ 180 ml × 1 · toner 200 ml × 1 · serum 30 ml × 1 · cream 50 g × 1 · mask 25 g × 3',
  skinType: 'Oily, combination and blemish-prone skin',
  dailyRoutine: 'Cleanse → toner → serum → cream, morning and evening',
  maskRoutine: 'After toner for 15–20 minutes, then serum and cream',
  warnings:
    'Fragranced cleanser and cream; toner contains salicylic acid and tea tree oil; mask contains peppermint oil',
  origin: 'Products made in Korea; box assembled in the UAE',
  pricing: 'Bundle value is calculated from current component prices',
}

const KEY_FEATURES = [
  {
    title: 'Exact seven-piece contents',
    description: 'Four full-size daily products plus three individually packed 25 g sheet masks.',
  },
  {
    title: 'Clear AM and PM order',
    description: 'Cleanser, toner, serum and cream form the daily sequence; a mask sits after toner when used.',
  },
  {
    title: 'Formula-led positioning',
    description: 'Zinc PCA is 0.5% in the toner and 0.05% in both the serum and cream.',
  },
  {
    title: 'Live price comparison',
    description: 'The product page calculates the separate total and saving from current component records.',
  },
]

const BENEFITS = [
  'A practical cosmetic routine for oily, combination and blemish-prone skin',
  'SNOW O₂ dry-face cleansing followed by a tepid-water rinse',
  'Toner with zinc PCA 0.5% and a 13.398% moisturizing base',
  'Light leave-on serum with zinc PCA 0.05%',
  'Gel cream without a traditional oil phase, with trehalose 1.5% and xylitol 0.5%',
  'Three moisturizing Eucalace® sheet masks for optional evening use',
]

const HOW_TO_USE = [
  {
    step: 'Morning and evening · cleanse',
    instruction:
      'Apply SNOW O₂ to a dry face, avoiding the eyes. Let the air foam form, massage gently in circles and rinse thoroughly with tepid water.',
  },
  {
    step: 'Morning and evening · toner',
    instruction: 'Apply with a cotton pad or spray onto the skin. The 200 ml bottle works in any direction.',
  },
  {
    step: 'Morning and evening · serum and cream',
    instruction:
      'Pat in two or three drops of serum after toner, then finish with a thin layer of cream using gentle massage movements.',
  },
  {
    step: 'Mask evening',
    instruction:
      'After cleansing and toner, leave one sheet on for 15–20 minutes. Remove it, pat in the remaining essence without rinsing, then apply serum and cream.',
  },
  {
    step: 'Morning · sunscreen',
    instruction: 'Finish the morning routine with suitable sunscreen. The toner contains salicylic acid.',
  },
]

const DIRECTIONS =
  'For external use only. Do not apply to damaged skin; avoid the eyes and mucous membranes. Stop use and seek medical advice if redness, swelling, itching or irritation occurs. SNOW O₂ contains fragrance, limonene and Sodium Laureth Sulfate; the cream is also fragranced. The toner contains salicylic acid and tea tree oil, and the mask contains peppermint oil at 0.005%. Introduce products one at a time if sensitive to fragrance, essential oils, cooling agents or salicylates. During pregnancy or breastfeeding, discuss the salicylic-acid toner and the printed SNOW O₂ warning with a doctor. Use the mask cautiously if sensitive to plasters or compresses and use immediately after opening.'

async function main() {
  const product = await prisma.product.findFirst({
    where: { OR: [{ productNumber: '55' }, { id: '55' }] },
  })
  if (!product) throw new Error('product 55 not found')

  await prisma.product.update({
    where: { id: product.id },
    data: {
      productNumber: '55',
      name: 'PROBLEM SKIN CARE BEAUTY BOX',
      nameRu: PRODUCT_55_RU_NAME,
      nameAr: PRODUCT_55_AR_NAME,
      description: DESCRIPTION_EN,
      descriptionRu: PRODUCT_55_RU_DESCRIPTION,
      descriptionAr: PRODUCT_55_AR_DESCRIPTION,
      size: '1 set · 7 pieces',
      productDetails: JSON.stringify(PRODUCT_DETAILS),
      keyFeatures: JSON.stringify(KEY_FEATURES),
      benefits: JSON.stringify(BENEFITS),
      ingredients: null,
      howToUse: JSON.stringify(HOW_TO_USE),
      directions: DIRECTIONS,
      skinType: null,
      targetConcerns: null,
      usage: 'morning-evening',
    },
  })

  console.log(`Product 55 updated: ${product.id}`)
}

main()
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
