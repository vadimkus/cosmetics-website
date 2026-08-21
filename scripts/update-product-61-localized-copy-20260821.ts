import { prisma } from '../lib/prisma'
import {
  PRODUCT_61_AR_NAME,
  PRODUCT_61_AR_TRANSLATION,
  PRODUCT_61_RU_NAME,
  PRODUCT_61_RU_TRANSLATION,
} from '../data/product61LocalizedCopy'

const expected = {
  productNumber: '61',
  nameRu: PRODUCT_61_RU_NAME,
  nameAr: PRODUCT_61_AR_NAME,
  description:
    'One manual brush with soft silicone tips and a stable central grip. Wet the hair with lukewarm water, lather shampoo, move the brush gently over the scalp with controlled pressure, then rinse thoroughly. The pack contains one brush. Apply leave-on tonics and solutions separately with fingertips, not with the brush.',
  descriptionRu: PRODUCT_61_RU_TRANSLATION.description,
  descriptionAr: PRODUCT_61_AR_TRANSLATION.description,
  productDetails: JSON.stringify({
    type: 'Manual silicone brush for use with shampoo',
    format: '1 brush',
    material: 'Soft silicone',
    design: 'Flexible tapered tips and a stable central grip',
    use: 'On wet hair after lathering shampoo',
    pressure: 'Light and controlled',
    leaveOnProducts: 'Do not use to apply leave-on products',
    evidenceBoundary:
      'The available guide does not state dimensions, tip count, a replacement interval or country of origin',
  }),
  keyFeatures: JSON.stringify([
    {
      title: 'Soft silicone tips',
      description: 'Flexible tapered tips provide soft contact during washing.',
    },
    {
      title: 'Stable grip',
      description: 'The central handle helps keep movement and pressure controlled in a wet hand.',
    },
    {
      title: 'Wet-shampoo use',
      description: 'The documented method is wet hair, lathered shampoo, gentle brush movement and thorough rinsing.',
    },
    {
      title: 'One clear role',
      description: 'A wash-time accessory. Leave-on products are applied afterwards with fingertips.',
    },
  ]),
  benefits: JSON.stringify([
    'Helps distribute shampoo lather over the scalp',
    'Flexible silicone tips provide soft contact',
    'The stable central grip helps control movement and pressure',
    'Fits into the normal shampoo step without a separate dry-use stage',
    'Complements shampoo without making a scalp-treatment or hair-growth claim',
  ]),
  ingredients: JSON.stringify([
    {
      name: 'Soft silicone tips',
      description: 'The material and softness are confirmed by the DTS MG guide.',
    },
    {
      name: 'Stable central grip',
      description: 'The form is visible on the product and the guide confirms stable use.',
    },
  ]),
  howToUse: JSON.stringify([
    { step: 'Wet the hair', instruction: 'Wet the hair thoroughly with lukewarm water.' },
    { step: 'Lather shampoo', instruction: 'Apply shampoo and work it into sufficient lather.' },
    {
      step: 'Use the brush',
      instruction: 'Move it gently over the scalp with controlled pressure. Do not rub damaged or irritated areas.',
    },
    { step: 'Rinse', instruction: 'Rinse the shampoo thoroughly and remove the brush from the hair.' },
    {
      step: 'Keep leave-on care separate',
      instruction: 'Apply tonics and other leave-on products afterwards with fingertips, not with this brush.',
    },
  ]),
  directions:
    'After use, rinse the brush, shake off water and let it dry completely in a ventilated place. Do not store it wet in a closed container. Replace it if the silicone tears, deforms or stops returning to shape; the available guide gives no calendar replacement interval. Do not use on damaged, irritated or infected scalp. Stop if use feels uncomfortable. The guide gives no post-procedure interval, so do not use the brush until the scalp has recovered.',
  size: '1 pc',
  skinType: null,
  targetConcerns: null,
  usage: null,
} as const

async function main() {
  const product = await prisma.product.findFirst({
    where: {
      OR: [
        { productNumber: '61' },
        { id: '61' },
        { name: { contains: 'MATRIX SCALP BRUSH', mode: 'insensitive' } },
      ],
    },
  })
  if (!product) throw new Error('Product 61 HR³ MATRIX SCALP BRUSH not found')

  const numberOwner = await prisma.product.findUnique({
    where: { productNumber: '61' },
    select: { id: true, name: true },
  })
  if (numberOwner && numberOwner.id !== product.id) {
    throw new Error(`productNumber 61 already belongs to ${numberOwner.id} (${numberOwner.name})`)
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
  if (mismatches.length) throw new Error(`Product 61 parity check failed: ${mismatches.join(', ')}`)
  for (const [key, value] of Object.entries(preserved)) {
    if (verified[key as keyof typeof verified] !== value) {
      throw new Error(`Product 61 asset preservation failed: ${key}`)
    }
  }

  // eslint-disable-next-line no-console
  console.log(JSON.stringify({
    id: product.id,
    previousProductNumber: product.productNumber,
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
