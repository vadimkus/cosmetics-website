/* eslint-disable no-console */
import { prisma } from '../lib/prisma'
import {
  PRODUCT_59_AR_DESCRIPTION,
  PRODUCT_59_AR_NAME,
  PRODUCT_59_RU_DESCRIPTION,
  PRODUCT_59_RU_NAME,
} from '../data/product59LocalizedCopy'

const DESCRIPTION_EN =
  'Seven pieces for dry, dehydrated skin: SNOW O₂ 180 ml, SNOW BOOSTER 200 ml, MOISTURE REPLENISHING HYALURON SERUM 30 ml, MOISTURE REPLENISHING HYALURON CREAM 50 g and three SOOTHING BOMB SEA ALGAE sheet masks of 25 g each. Use cleanser, booster, serum and cream morning and evening, finishing mornings with sunscreen. On a mask evening, leave one mask on for 15–20 minutes after booster, then continue with serum and cream. Use the mask immediately after opening; the pack sets no weekly frequency. Bundle value is calculated from current component prices.'

const EXPECTED = {
  productNumber: '59',
  name: 'DEEP MOISTURIZING BEAUTY BOX',
  nameRu: PRODUCT_59_RU_NAME,
  nameAr: PRODUCT_59_AR_NAME,
  description: DESCRIPTION_EN,
  descriptionRu: PRODUCT_59_RU_DESCRIPTION,
  descriptionAr: PRODUCT_59_AR_DESCRIPTION,
  size: '1 set · 7 pieces',
  productDetails: JSON.stringify({
    form: 'One set · seven pieces',
    contents:
      'SNOW O₂ 180 ml × 1 · SNOW BOOSTER 200 ml × 1 · serum 30 ml × 1 · cream 50 g × 1 · mask 25 g × 3',
    dailyRoutine: 'Cleanse → booster → serum → cream, morning and evening',
    maskRoutine: 'After booster for 15–20 minutes, then serum and cream; use immediately after opening',
    serum: 'Hydrolyzed hyaluronic acid 2,000 ppm · PENTAVITIN 0.615% · humectant base 16.02%',
    cream: 'Glycerin 9% · PENTAVITIN 0.615% · high-molecular-weight sodium hyaluronate 1,000.9 ppm',
    masks: 'Methylpropanediol 10% · glycerin 5.035% · betaine 0.5% · allantoin and panthenol 0.1% each',
    origin: 'Products made in Korea; box assembled in the UAE',
    pricing: 'Bundle value is calculated from current component prices',
  }),
  keyFeatures: JSON.stringify([
    { title: 'Seven exact pieces', description: 'Four full-size daily products and three single-use 25 g masks.' },
    { title: 'Measured Hyaluron duo', description: 'Serum has hydrolyzed hyaluronic acid 2,000 ppm; cream has high-molecular-weight sodium hyaluronate 1,000.9 ppm.' },
    { title: 'Measured cream result', description: 'After one application, hydration increased 82% and remained significantly above baseline after 72 hours.' },
    { title: 'Live price comparison', description: 'The page calculates component value and saving from current prices.' },
  ]),
  benefits: JSON.stringify([
    'Clear four-step morning and evening order',
    'Serum with hydrolyzed hyaluronic acid 2,000 ppm and PENTAVITIN 0.615%',
    'Cream with glycerin 9% and high-molecular-weight sodium hyaluronate 1,000.9 ppm',
    'Three separate Eucalace® masks with a 15.535% humectant base',
    'Morning care finishes with suitable sunscreen',
  ]),
  ingredients: null,
  howToUse: JSON.stringify([
    { step: 'AM/PM · cleanse', instruction: 'Apply SNOW O₂ to a dry face, avoiding the eyes, massage gently and rinse with tepid water.' },
    { step: 'AM/PM · booster', instruction: 'Apply SNOW BOOSTER with the hands or spray onto clean skin. Do not rinse.' },
    { step: 'AM/PM · serum', instruction: 'Apply to the face and pat gently with the fingertips.' },
    { step: 'AM/PM · cream', instruction: 'Apply after serum. Finish mornings with suitable sunscreen.' },
    { step: 'Optional evening · mask', instruction: 'After booster, wear one mask for 15–20 minutes, remove, pat in the remaining essence, then apply serum and cream. Use immediately after opening.' },
  ]),
  directions:
    'For external use only. Avoid eyes, mucous membranes and damaged skin; stop use if irritation persists. SNOW O₂ contains fragrance and limonene; serum and cream contain geranium oil and fragrance allergens including citronellol, and cream also contains geraniol; the mask contains peppermint oil. Introduce products one at a time if sensitive to fragrance, essential oils, plasters or compresses. The SNOW O₂ pack says not to use during pregnancy or breastfeeding. Use masks immediately after opening. Do not refrigerate the cream. Use suitable sunscreen in the morning.',
  skinType: null,
  targetConcerns: null,
  usage: null,
  ageGroup: null,
} as const

async function main() {
  const product = await prisma.product.findFirst({
    where: {
      OR: [
        { productNumber: '59' },
        { id: 'cmhp0jfrq00008odr033fg0ly' },
        { name: 'DEEP MOISTURIZING BEAUTY BOX' },
      ],
    },
  })
  if (!product) throw new Error('product 59 not found')
  if (product.productNumber && product.productNumber !== '59') {
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
    throw new Error(`product 59 parity failed: ${mismatches.map(([key]) => key).join(', ')}`)
  }

  const quantities: Record<string, number> = { '10': 1, '16': 1, '18': 1, '29': 1, '36': 3 }
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
  if (separateTotal !== 1318 || bundlePrice !== 1120.3 || saving !== 197.7 || savingPercent !== 15) {
    throw new Error(`product 59 pricing parity failed: ${JSON.stringify({ separateTotal, bundlePrice, saving, savingPercent })}`)
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
