/* eslint-disable no-console */
import { prisma } from '../lib/prisma'
import {
  PRODUCT_62_AR_DESCRIPTION,
  PRODUCT_62_AR_NAME,
  PRODUCT_62_RU_DESCRIPTION,
  PRODUCT_62_RU_NAME,
} from '../data/product62LocalizedCopy'

const DESCRIPTION_EN =
  'Six full-size products: SNOW O₂ 180 ml, SNOW BOOSTER 200 ml, ALL FOR SENSITIVE SERUM 30 ml, SKIN BARRIER PROTECTING CREAM 100 g, SKIN RESCUE OVERNIGHT CREAM MASK 100 g and one SOOTHING BOMB SEA ALGAE sheet mask 25 g. Use cleanser, booster, serum and cream morning and evening, finishing mornings with sunscreen. Use the overnight mask instead of cream as the last step once or twice weekly. On a separate mask evening, place the sheet mask after booster for 15–20 minutes, then continue with serum and cream; its pack sets no weekly frequency. Component value and saving are calculated from current prices.'

const EXPECTED = {
  productNumber: '62',
  name: 'SENSITIVE SKIN BEAUTY BOX',
  nameRu: PRODUCT_62_RU_NAME,
  nameAr: PRODUCT_62_AR_NAME,
  description: DESCRIPTION_EN,
  descriptionRu: PRODUCT_62_RU_DESCRIPTION,
  descriptionAr: PRODUCT_62_AR_DESCRIPTION,
  size: '1 set · 6 pieces',
  image: '/images/bb_box_sensitive/main.jpeg',
  productDetails: JSON.stringify({
    form: 'One set · six full-size products',
    contents:
      'SNOW O₂ 180 ml × 1 · SNOW BOOSTER 200 ml × 1 · serum 30 ml × 1 · cream 100 g × 1 · overnight mask 100 g × 1 · sheet mask 25 g × 1',
    dailyRoutine: 'Cleanser → booster → serum → cream, morning and evening',
    overnightRoutine: 'Overnight mask instead of cream as the last step, once or twice weekly',
    sheetMaskRoutine: 'After booster for 15–20 minutes, then serum and cream; no weekly frequency stated',
    serum: 'MultiEx BSASM® Plus 1% · betaine 0.5% · allantoin 0.1% · sodium hyaluronate 0.01%',
    cream: 'Ceramide NP 0.5% (5,000 ppm) · glycerin 17.49% · shea butter 3%',
    overnightMask: 'Niacinamide 2% · adenosine 0.04% · glycerin 6% · trehalose 2%',
    study: 'Overnight mask only: TEWL −15% and redness appearance −26% after four weeks',
    origin: 'Products made in Korea; box assembled in the UAE',
    pricing: 'Component value and saving are calculated from current prices',
  }),
  keyFeatures: JSON.stringify([
    { title: 'Six exact products', description: 'Five full-size bottles or jars plus one single-use 25 g sheet mask.' },
    { title: 'Serum and cream facts', description: 'Serum has MultiEx BSASM® Plus 1%; cream has Ceramide NP 0.5%, glycerin 17.49% and shea butter 3%.' },
    { title: 'Overnight-mask result only', description: 'After four weeks, TEWL measured 15% lower and redness appearance 26% lower with the overnight mask.' },
    { title: 'Live price comparison', description: 'The page calculates component value and saving from current prices.' },
  ]),
  benefits: JSON.stringify([
    'Clear four-step morning and evening order',
    'MultiEx BSASM® Plus 1%, betaine 0.5% and allantoin 0.1% in the serum',
    'Ceramide NP 5,000 ppm and glycerin 17.49% in the cream',
    'Overnight mask with niacinamide 2% and adenosine 0.04%',
    'One Eucalace® sheet mask for 15–20 minutes',
    'Morning care finishes with suitable sunscreen',
  ]),
  ingredients: null,
  howToUse: JSON.stringify([
    { step: 'AM/PM · cleanse', instruction: 'Apply SNOW O₂ to a dry face, avoiding the eyes. Let the foam form, massage gently in circles and rinse with tepid water.' },
    { step: 'AM/PM · booster', instruction: 'Apply SNOW BOOSTER with the hands or spray onto clean skin. Do not rinse.' },
    { step: 'AM/PM · serum', instruction: 'Apply ALL FOR SENSITIVE SERUM to the face and pat gently with the fingertips.' },
    { step: 'AM/PM · cream', instruction: 'Apply SKIN BARRIER PROTECTING CREAM after serum and pat gently. Finish mornings with suitable sunscreen.' },
    { step: 'Once or twice weekly · overnight mask', instruction: 'Use SKIN RESCUE instead of cream as the last step, avoiding the eye area. Leave overnight and do not rinse.' },
    { step: 'Separate evening · sheet mask', instruction: 'After booster, wear SOOTHING BOMB for 15–20 minutes, remove, pat in the remaining essence, then apply serum and cream. Use immediately after opening.' },
  ]),
  directions:
    'For external use only. Patch test each item separately and introduce products one at a time. Do not apply to damaged skin; stop use and seek medical advice if burning, redness, swelling or irritation persists. SNOW O₂ contains Parfum 0.15%, limonene 0.108%, hinoki water and Sodium Laureth Sulfate 2.4%; its pack says to avoid use during pregnancy and breastfeeding. SNOW BOOSTER has no Parfum or essential oils, but its INCI includes grapefruit seed extract. The serum contains orange peel oil and limonene. The cream contains Parfum, linalool and coumarin. The overnight mask contains several essential oils plus citral, geraniol and limonene. The sheet mask contains peppermint oil; use cautiously if sensitive to plasters or compresses. Use suitable sunscreen in the morning.',
  skinType: null,
  targetConcerns: null,
  usage: null,
  ageGroup: null,
} as const

async function main() {
  const product = await prisma.product.findFirst({
    where: {
      OR: [
        { productNumber: '62' },
        { id: 'cml3twwvk0000ua8o9qiqwkie' },
        { name: 'SENSITIVE SKIN BEAUTY BOX' },
      ],
    },
  })
  if (!product) throw new Error('product 62 not found')
  if (product.productNumber && product.productNumber !== '62') {
    throw new Error(`refusing conflicting product owner ${product.id}: ${product.productNumber}`)
  }

  const changed = Object.fromEntries(
    Object.entries(EXPECTED).map(([key, value]) => [key, product[key as keyof typeof product] !== value]),
  )
  await prisma.product.update({ where: { id: product.id }, data: EXPECTED })

  const verified = await prisma.product.findUniqueOrThrow({ where: { id: product.id } })
  const mismatches = Object.entries(EXPECTED).filter(
    ([key, value]) => verified[key as keyof typeof verified] !== value,
  )
  if (mismatches.length) {
    throw new Error(`product 62 parity failed: ${mismatches.map(([key]) => key).join(', ')}`)
  }

  const quantities: Record<string, number> = { '10': 1, '16': 1, '19': 1, '27': 1, '34': 1, '36': 1 }
  const productNumbers = Object.keys(quantities)
  const components = await prisma.product.findMany({
    where: { productNumber: { in: productNumbers } },
    select: { productNumber: true, name: true, price: true },
  })
  const ordered = productNumbers.map(productNumber => {
    const component = components.find(item => item.productNumber === productNumber)
    if (!component) throw new Error(`missing component ${productNumber}`)
    return { ...component, quantity: quantities[productNumber]! }
  })
  const separateTotal = ordered.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)
  const bundlePrice = Number(verified.price)
  const saving = Number((separateTotal - bundlePrice).toFixed(2))
  const savingPercent = separateTotal > 0 ? Number(((saving / separateTotal) * 100).toFixed(2)) : 0
  if (separateTotal !== 1746 || bundlePrice !== 1442 || saving !== 304 || savingPercent !== 17.41) {
    throw new Error(`product 62 pricing parity failed: ${JSON.stringify({ separateTotal, bundlePrice, saving, savingPercent })}`)
  }

  console.log(JSON.stringify({
    id: verified.id,
    changed,
    parity: 'verified',
    size: verified.size,
    components: ordered,
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
