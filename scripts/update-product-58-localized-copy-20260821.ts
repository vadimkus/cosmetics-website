/* eslint-disable no-console */
import { prisma } from '../lib/prisma'
import {
  PRODUCT_58_AR_DESCRIPTION,
  PRODUCT_58_AR_NAME,
  PRODUCT_58_RU_DESCRIPTION,
  PRODUCT_58_RU_NAME,
} from '../data/product58LocalizedCopy'

const DESCRIPTION_EN =
  'Nine pieces: SNOW O₂ 180 ml, SNOW BOOSTER 200 ml, MULTI FUNCTIONAL ANTI-WRINKLE SERUM 30 ml, MULTI FUNCTIONAL ANTI-WRINKLE CREAM 50 g and five INTENSIVE REPAIR COLLAGEN sheet masks of 23 g each. Use cleanser, booster, serum and cream morning and evening, finishing mornings with sunscreen. On a mask evening, leave one mask on for 15–20 minutes after booster, then continue with serum and cream. The mask pack sets no weekly frequency. Bundle value is calculated from current component prices.'

const EXPECTED = {
  productNumber: '58',
  name: 'ANTI-AGING BEAUTY BOX',
  nameRu: PRODUCT_58_RU_NAME,
  nameAr: PRODUCT_58_AR_NAME,
  description: DESCRIPTION_EN,
  descriptionRu: PRODUCT_58_RU_DESCRIPTION,
  descriptionAr: PRODUCT_58_AR_DESCRIPTION,
  size: '1 set · 9 pieces',
  productDetails: JSON.stringify({
    form: 'One set · nine pieces',
    contents:
      'SNOW O₂ 180 ml × 1 · SNOW BOOSTER 200 ml × 1 · serum 30 ml × 1 · cream 50 g × 1 · mask 23 g × 5',
    dailyRoutine: 'Cleanse → booster → serum → cream, morning and evening',
    maskRoutine: 'After booster for 15–20 minutes, then serum and cream; no weekly frequency is stated',
    serum: 'Glycerin 25.45% · niacinamide 2% · adenosine 0.04% · bakuchiol 0.1%',
    cream: 'Glycerin 8% · about 13% emollient phase · niacinamide 2% · adenosine 0.04%',
    masks: 'Humectant base 18.062% · sodium hyaluronate 0.5% · collagen 1 ppm',
    origin: 'Products made in Korea; box assembled in the UAE',
    pricing: 'Bundle value is calculated from current component prices',
  }),
  keyFeatures: JSON.stringify([
    { title: 'Nine exact pieces', description: 'Four full-size daily products and five single-use 23 g masks.' },
    { title: 'Two registered steps', description: 'Serum and cream contain niacinamide 2% and adenosine 0.04%.' },
    { title: 'Different textures', description: 'Serum has glycerin 25.45%; cream has glycerin 8% and about 13% emollient phase.' },
    { title: 'Live price comparison', description: 'The page calculates component value and saving from current prices.' },
  ]),
  benefits: JSON.stringify([
    'Clear four-step morning and evening order',
    'Serum with glycerin 25.45%, niacinamide 2% and adenosine 0.04%',
    'Cream with glycerin 8%, niacinamide 2%, adenosine 0.04% and mango butter 0.8%',
    'Five separate moisturizing masks for 15–20 minutes',
    'Morning care finishes with suitable sunscreen',
  ]),
  ingredients: null,
  howToUse: JSON.stringify([
    { step: 'AM/PM · cleanse', instruction: 'Apply SNOW O₂ to a dry face, let the foam form, massage gently and rinse with tepid water.' },
    { step: 'AM/PM · booster', instruction: 'Apply SNOW BOOSTER with the hands or spray after cleansing.' },
    { step: 'AM/PM · serum', instruction: 'Apply to the face and pat gently with the fingertips.' },
    { step: 'AM/PM · cream', instruction: 'Apply after serum. Finish mornings with suitable sunscreen.' },
    { step: 'Optional evening · mask', instruction: 'After booster, wear one mask for 15–20 minutes, remove, pat in the remaining essence, then apply serum and cream. No weekly frequency is stated.' },
  ]),
  directions:
    'For external use only. Avoid eyes, mucous membranes and damaged skin; stop use if irritation persists. SNOW O₂ contains fragrance and limonene; serum contains lavender oil, linalool and propolis; cream contains lavender oil, linalool, limonene and propolis; masks contain Parfum 0.01%, Alcohol 0.1% and soybean extract. Introduce products one at a time if sensitive to fragrance or bee products. The SNOW O₂ pack carries a pregnancy and breastfeeding warning; discuss introducing bakuchiol with a doctor. Use masks immediately after opening. Use suitable sunscreen in the morning.',
  skinType: null,
  targetConcerns: null,
  usage: null,
  ageGroup: null,
} as const

async function main() {
  const product = await prisma.product.findFirst({
    where: {
      OR: [
        { productNumber: '58' },
        { id: 'cmhozfrep00008oxxizeqk8a0' },
        { name: 'ANTI-AGING BEAUTY BOX' },
      ],
    },
  })
  if (!product) throw new Error('product 58 not found')
  if (product.productNumber && product.productNumber !== '58') {
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
    throw new Error(`product 58 parity failed: ${mismatches.map(([key]) => key).join(', ')}`)
  }

  const components = await prisma.product.findMany({
    where: { productNumber: { in: ['10', '16', '22', '32', '53'] } },
    select: { productNumber: true, name: true, price: true },
  })
  const quantities: Record<string, number> = { '10': 1, '16': 1, '22': 1, '32': 1, '53': 5 }
  const ordered = ['10', '16', '22', '32', '53'].map(productNumber => {
    const component = components.find(item => item.productNumber === productNumber)
    if (!component) throw new Error(`missing component ${productNumber}`)
    return { ...component, quantity: quantities[productNumber]! }
  })
  const separateTotal = ordered.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0,
  )
  const bundlePrice = Number(verified.price)
  const saving = separateTotal - bundlePrice
  const savingPercent = separateTotal > 0 ? (saving / separateTotal) * 100 : 0
  if (separateTotal !== 1390 || bundlePrice !== 1181.5 || saving !== 208.5 || savingPercent !== 15) {
    throw new Error(`product 58 pricing parity failed: ${JSON.stringify({ separateTotal, bundlePrice, saving, savingPercent })}`)
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
