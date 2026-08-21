import { prisma } from '../lib/prisma'
import {
  PRODUCT_41_AR_TRANSLATION,
  PRODUCT_41_RU_TRANSLATION,
} from '../data/product41LocalizedCopy'

const productDetails = {
  form: 'Buildable tinted BB cushion',
  size: '15 g cushion + 15 g refill',
  grade: 'SPF 50+ PA++++',
  registration:
    'Korean triple-functional cosmetic: UV protection, brightening and wrinkle care',
  filterSystem: 'Five UV filters · 24.50208% declared total',
  actives: 'Niacinamide 2% · adenosine 0.04%',
  shades: '#01 Ivory · #02 Beige · #03 Camel',
  shadeNote:
    'All shades share the five UV filters, niacinamide 2% and adenosine 0.04%. Iron oxide ratios determine colour; Camel also has a different solvent balance.',
  puff:
    'Waterdrop puff with an internal waterproof layer that reduces formula absorption by the puff',
  waterResistance: 'The product is not claimed water-resistant',
  fragrance: 'No added fragrance',
  testing: 'Dermatologically tested',
  ph: 'COA: Ivory 6.44 · Beige 6.49 · Camel 6.51',
  origin: 'Made in Korea',
}

const keyFeatures = [
  {
    title: 'SPF 50+ PA++++ · five UV filters',
    description:
      'Titanium Dioxide 9.00208%, Octinoxate 7%, Octisalate 4.5%, Octocrylene 2% and Zinc Oxide 2%.',
  },
  {
    title: 'Niacinamide 2% · adenosine 0.04%',
    description:
      'The registered functional ingredients for tone and wrinkle care.',
  },
  {
    title: 'Cushion and refill',
    description: 'A 15 g cushion and 15 g refill are included in the box.',
  },
  {
    title: 'Three shades',
    description:
      '#01 Ivory, #02 Beige and #03 Camel share the same five filters and functional ingredients.',
  },
]

const benefits = [
  'Natural, buildable coverage applied with light patting motions',
  'SPF 50+ PA++++ in a compact tinted format',
  'Niacinamide 2% for a more even-looking tone',
  'Adenosine 0.04% for the appearance of wrinkles',
  'Three shades with the same UV-filter system and functional ingredients',
  '15 g cushion and 15 g refill in one box',
]

const ingredients = [
  {
    name: 'Titanium Dioxide · 9.00208%',
    description: 'Mineral UV filter and base pigment.',
  },
  {
    name: 'Octinoxate · 7%',
    description: 'Ethylhexyl Methoxycinnamate, an organic UVB filter.',
  },
  {
    name: 'Octisalate · 4.5%',
    description: 'Ethylhexyl Salicylate, an organic UVB filter.',
  },
  {
    name: 'Octocrylene · 2%',
    description: 'An organic filter in the five-filter UV system.',
  },
  {
    name: 'Zinc Oxide · 2%',
    description: 'A mineral UV filter.',
  },
  {
    name: 'Niacinamide · 2%',
    description: 'The registered functional ingredient for brightening care.',
  },
  {
    name: 'Adenosine · 0.04%',
    description: 'The registered functional ingredient for wrinkle care.',
  },
]

const howToUse = [
  {
    step: 'Choose a shade',
    instruction:
      '#01 Ivory is light, #02 Beige is medium and #03 Camel is deeper and warm. Test on the jawline in daylight.',
  },
  {
    step: 'Press lightly',
    instruction: 'Press the puff lightly onto the cushion without pushing deeply.',
  },
  {
    step: 'Pat and build',
    instruction:
      'Pat a thin, even layer over the face, then add a second layer only where more coverage is wanted.',
  },
  {
    step: 'Reapply protection',
    instruction:
      'Reapply at least every two hours outdoors and after swimming, heavy sweating or towelling. The product is not claimed water-resistant.',
  },
]

async function main() {
  const product = await prisma.product.findFirst({
    where: {
      OR: [{ id: '41' }, { productNumber: '41' }],
    },
    select: { id: true },
  })

  if (!product) {
    throw new Error('Product 41 was not found')
  }

  const updated = await prisma.product.update({
    where: { id: product.id },
    data: {
      productNumber: '41',
      name: 'SKIN CARING BLEMISH BALM CUSHION [SPF 50+ PA++++]',
      nameRu: PRODUCT_41_RU_TRANSLATION.name,
      nameAr: PRODUCT_41_AR_TRANSLATION.name,
      description:
        'Natural, buildable coverage with SPF 50+ PA++++ from five UV filters. Niacinamide 2% supports a more even-looking tone and adenosine 0.04% cares for the appearance of wrinkles. Includes a 15 g cushion, 15 g refill and Waterdrop puff in #01 Ivory, #02 Beige or #03 Camel. No added fragrance; the product is not claimed water-resistant.',
      descriptionRu: PRODUCT_41_RU_TRANSLATION.description,
      descriptionAr: PRODUCT_41_AR_TRANSLATION.description,
      size: '15 g + 15 g refill',
      productDetails: JSON.stringify(productDetails),
      keyFeatures: JSON.stringify(keyFeatures),
      benefits: JSON.stringify(benefits),
      ingredients: JSON.stringify(ingredients),
      howToUse: JSON.stringify(howToUse),
      directions:
        'For external use only. Do not use on damaged skin. Avoid the eyes and mucous membranes; rinse thoroughly with cool water after contact. Stop use and consult a doctor if redness, swelling, itching or irritation occurs. Store at 10–30°C away from direct sunlight and children. Use within 12 months of opening.',
      skinType: null,
      targetConcerns: JSON.stringify(['sun-protection', 'uneven-tone', 'wrinkles']),
      usage: 'morning',
    },
    select: {
      id: true,
      productNumber: true,
      nameRu: true,
      nameAr: true,
      descriptionRu: true,
      descriptionAr: true,
      productDetails: true,
      keyFeatures: true,
      benefits: true,
      ingredients: true,
      howToUse: true,
      directions: true,
      skinType: true,
      targetConcerns: true,
    },
  })

  console.log(JSON.stringify(updated, null, 2))
}

main()
  .catch(error => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
