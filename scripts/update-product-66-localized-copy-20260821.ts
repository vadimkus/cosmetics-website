import { prisma } from '../lib/prisma'
import {
  PRODUCT_66_AR_NAME,
  PRODUCT_66_AR_TRANSLATION,
  PRODUCT_66_FULL_INCI,
  PRODUCT_66_RU_NAME,
  PRODUCT_66_RU_TRANSLATION,
} from '../data/product66LocalizedCopy'

const expected = {
  productNumber: '66',
  nameRu: PRODUCT_66_RU_NAME,
  nameAr: PRODUCT_66_AR_NAME,
  description:
    'A transparent daily facial cleansing gel that foams with water. The cleansing base is Sodium Cocoyl Glutamate 8.75%, Cocamidopropyl Betaine 6%, and Decyl Glucoside 1.65%. Glycerin 5%, butylene glycol 3%, and betaine 0.5% support the rinse-off formula. Five ceramides (NP, AS, AP, NS, EOP), Lactobacillus and Bifida ferment lysates, fructan, and botanical extracts are present at trace levels, so no strong standalone benefit is assigned to them. The formula contains fragrance at 0.5%. Measured pH is 6.37. Dermatologically tested and available in 200 ml and 600 ml.',
  descriptionRu: PRODUCT_66_RU_TRANSLATION.description,
  descriptionAr: PRODUCT_66_AR_TRANSLATION.description,
  productDetails: JSON.stringify({
    form: 'Transparent foaming facial cleansing gel',
    baseSize: '200 ml',
    purchaseOptions: '200 ml Homecare / 600 ml Professional',
    cleansingSystem: 'Sodium Cocoyl Glutamate 8.75% + Cocamidopropyl Betaine 6% + Decyl Glucoside 1.65%',
    humectants: 'Glycerin 5.0000076% + Butylene Glycol 3.000041% + Betaine 0.5%',
    ceramides: 'Ceramide NP, AS, AP, NS, and EOP; present at trace levels',
    pinkCeramide: 'DTS MG deck mapping: Epilobium angustifolium + Lactobacillus Ferment Lysate + Ceramide NP',
    pH: '6.37 within the 6.50 ± 0.50 specification',
    fragrance: 'Parfum 0.5%',
    testing: 'Dermatologically tested',
    afterOpening: '12 months',
    origin: 'Made in Korea',
    evidence:
      'The DTS MG deck presents 145.8% and 2.4x as two descriptions of one immediate post-wash result. Its displayed values, 25.59 to 56.19, equal 2.20x / +119.6%; the underlying report, method, and sample size are unavailable, so the headline figures are not presented as verified efficacy.',
    pdfBrochure: '/documents/ppt/GENOSYS%20CERABARRIER%20BIOME%20GEL%20CLEANSER.pdf',
  }),
  keyFeatures: JSON.stringify([
    { title: 'Three-surfactant base', description: 'Sodium Cocoyl Glutamate 8.75%, Cocamidopropyl Betaine 6%, and Decyl Glucoside 1.65% provide the cleansing system.' },
    { title: 'Humectant base', description: 'Glycerin 5.0000076%, Butylene Glycol 3.000041%, and Betaine 0.5% support the rinse-off formula.' },
    { title: 'Five ceramides', description: 'NP, AS, AP, NS, and EOP are confirmed in the quantitative formula at trace levels.' },
    { title: 'Two sizes', description: '200 ml Homecare and 600 ml Professional, with the same formula.' },
  ]),
  benefits: JSON.stringify([
    'Cleanses the skin and rinses thoroughly with lukewarm water',
    'Transforms from a transparent gel into foam with water',
    'Contains glycerin 5%, butylene glycol 3%, and betaine 0.5%',
    'Contains five ceramides and two ferment lysates at trace levels',
    'Dermatologically tested',
  ]),
  ingredients: JSON.stringify([
    { name: 'Cleansing system · 16.4%', description: 'Sodium Cocoyl Glutamate 8.75%, Cocamidopropyl Betaine 6%, and Decyl Glucoside 1.65%.' },
    { name: 'Glycerin · 5.0000076%', description: 'The largest humectant in the rinse-off formula.' },
    { name: 'Butylene Glycol · 3.000041% + Betaine · 0.5%', description: 'Support the water base and comfortable application.' },
    { name: 'Pink Ceramide Complex', description: 'The DTS MG deck maps this name to Epilobium angustifolium, Lactobacillus Ferment Lysate, and Ceramide NP. No Safety Assessment mapping the finished premix percentage was found in the archive.' },
    { name: '5 Ceramides · NP, AS, AP, NS, EOP', description: 'All five are confirmed in the quantitative formula at trace levels; no strong standalone finished-product result is assigned to them.' },
    { name: 'Ferments and deck-described prebiotics', description: 'Lactobacillus Ferment Lysate, Bifida Ferment Lysate, Fructan, Chicory Root Extract, and Dandelion Root Extract are present at trace levels. Beneficial-bacteria growth or finished-product microbiome balancing has not been demonstrated.' },
    { name: 'Fragrance · 0.5%', description: 'The formula contains Parfum and is not fragrance-free.' },
    { name: 'Full INCI', description: PRODUCT_66_FULL_INCI },
  ]),
  howToUse: JSON.stringify([
    { step: 'Lather', instruction: 'Lather a sufficient amount with water.' },
    { step: 'Cleanse', instruction: 'Gently massage the foam over the skin.' },
    { step: 'Rinse', instruction: 'Rinse thoroughly with lukewarm water.' },
  ]),
  directions:
    'The pack does not set a fixed frequency; adjust use to the skin. For external use only. Avoid contact with the eyes and mucous membranes and rinse thoroughly with cool water after contact. Keep in a cool, dry place and out of children’s reach. Do not use on damaged skin. Stop use and seek medical advice if redness, swelling, or irritation occurs.',
  size: '200 ml',
  skinType: null,
  targetConcerns: null,
  usage: null,
  ageGroup: null,
} as const

async function main() {
  const product = await prisma.product.findFirst({
    where: {
      OR: [
        { productNumber: '66' },
        { id: '66' },
        { name: { contains: 'CERABARRIER BIOME GEL CLEANSER', mode: 'insensitive' } },
      ],
    },
  })
  if (!product) throw new Error('Product 66 CERABARRIER BIOME GEL CLEANSER not found')

  const numberOwner = await prisma.product.findUnique({
    where: { productNumber: '66' },
    select: { id: true, name: true },
  })
  if (numberOwner && numberOwner.id !== product.id) {
    throw new Error(`productNumber 66 already belongs to ${numberOwner.id} (${numberOwner.name})`)
  }

  const preserved = {
    image: product.image,
    images: product.images,
    videoUrl: product.videoUrl,
    price: product.price,
    category: product.category,
    inStock: product.inStock,
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
  if (mismatches.length) throw new Error(`Product 66 parity check failed: ${mismatches.join(', ')}`)
  for (const [key, value] of Object.entries(preserved)) {
    if (verified[key as keyof typeof verified] !== value) {
      throw new Error(`Product 66 preservation failed: ${key}`)
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
