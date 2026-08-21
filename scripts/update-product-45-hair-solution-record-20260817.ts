/**
 * Idempotently align product 45 with its registered artwork, signed formula,
 * safety assessment and COA. No efficacy or hair-loss claim is stored.
 *
 * Run:
 * npx tsx --env-file=.env.local scripts/update-product-45-hair-solution-record-20260817.ts
 */
import {
  PRODUCT_45_AR_NAME,
  PRODUCT_45_AR_TRANSLATION,
  PRODUCT_45_FULL_INCI,
  PRODUCT_45_RU_NAME,
  PRODUCT_45_RU_TRANSLATION,
} from '../data/product45LocalizedCopy'
import { prisma } from '../lib/prisma'

const description =
  'A professional leave-in conditioning solution for the scalp and hair in eight 4 ml single-use vials. Its registered function is nutrition supply and hair conditioning, without a hair-loss treatment or hair-growth claim. The vehicle contains propylene glycol 9.995%, 1,2-hexanediol 2.042%, PEG-40 hydrogenated castor oil 1.000% and carbomer 0.450%. Menthol at 0.200% provides a fresh sensation, while niacinamide and panthenol are present at 0.100% each. Copper Tripeptide-1 is present at 5 ppm and the four recombinant peptides total 1.2 ppm, without assigning a hair-growth effect to these trace levels. Use once or twice weekly. Open immediately before the session, use at once and discard any remainder.'

const productDetails = JSON.stringify({
  form: 'Professional leave-in conditioning solution for scalp and hair',
  size: '4 ml × 8 single-use vials',
  registeredCategory: 'Leave-in hair conditioner',
  registeredFunction: 'Nutrition supply and hair conditioning',
  vehicle:
    'Propylene glycol 9.995%, 1,2-hexanediol 2.042%, PEG-40 hydrogenated castor oil 1.000%, carbomer 0.450%',
  conditioningCare: 'Menthol 0.200%, niacinamide 0.100%, panthenol 0.100%',
  copperPeptide: 'Copper Tripeptide-1 5 ppm',
  recombinantPeptides:
    'sh-Polypeptide-7 0.5 ppm, sh-Polypeptide-9 0.5 ppm, sh-Oligopeptide-1 0.15 ppm, sh-Polypeptide-71 0.05 ppm; total 1.2 ppm',
  botanicals:
    'Broccoli 100 ppm, saw palmetto 10 ppm, nine Black Complex extracts at 1 ppm each',
  pH: 'Measured 6.65; specification 6.00–7.00',
  frequency: 'Once or twice weekly',
  professionalUse:
    'Part clean, dry hair at 1–2 cm intervals; use a 0.25–0.5 mm roller or stamp for 10–15 minutes under professional control',
  homecareUse:
    'Tap vertically with the applicator using steady pressure. Rinse with the cleaning brush, treat with alcohol, dry and re-cap',
  afterOpening: 'Use immediately and discard any remainder; do not refrigerate an opened vial',
  testing:
    'Dermatologically tested. No irritation was observed in the patch test; the assessor noted the volunteer count was not statistically significant. This is not an efficacy study',
  precautions: 'Avoid during pregnancy and lactation. External use only. Keep away from eyes and mucous membranes',
  origin: 'Made in Korea',
})

const keyFeatures = JSON.stringify([
  {
    title: 'Registered conditioning function',
    description:
      'A leave-in hair conditioner for nutrition supply and hair conditioning, without a hair-loss or regrowth claim.',
  },
  {
    title: 'Documented vehicle',
    description:
      'Propylene glycol 9.995%, 1,2-hexanediol 2.042%, PEG-40 hydrogenated castor oil 1.000% and carbomer 0.450%.',
  },
  {
    title: 'Cooling and conditioning care',
    description: 'Menthol 0.200%, with niacinamide and panthenol at 0.100% each.',
  },
  {
    title: 'Exact peptide levels',
    description:
      'Copper Tripeptide-1 at 5 ppm and four recombinant peptides at 1.2 ppm combined, without functional attribution.',
  },
  {
    title: 'Eight fresh 4 ml vials',
    description: 'Open immediately before use, use at once and discard any remainder.',
  },
])

const benefits = JSON.stringify([
  'Supplies nutrition and conditions hair in line with the registered cosmetic function',
  'Provides a fresh scalp sensation with menthol at 0.200%',
  'Complements conditioning care with niacinamide and panthenol at 0.100% each',
  'Distributes over scalp partings with a documented propylene-glycol and carbomer vehicle',
  'Supports the documented professional or home applicator routine',
  'Dermatologically tested and made in Korea',
])

const ingredients = JSON.stringify([
  {
    name: 'Vehicle',
    description:
      'Propylene glycol 9.995%, 1,2-hexanediol 2.042%, PEG-40 hydrogenated castor oil 1.000% and carbomer 0.450%.',
  },
  {
    name: 'Conditioning care',
    description: 'Menthol 0.200%, niacinamide 0.100% and panthenol 0.100%.',
  },
  {
    name: 'Copper Tripeptide-1',
    description: '5 ppm, stated without a hair-growth claim.',
  },
  {
    name: 'Four recombinant peptides',
    description:
      'sh-Polypeptide-7 0.5 ppm, sh-Polypeptide-9 0.5 ppm, sh-Oligopeptide-1 0.15 ppm and sh-Polypeptide-71 0.05 ppm; 1.2 ppm total, without functional attribution.',
  },
  {
    name: 'Botanical extracts',
    description:
      'Broccoli 100 ppm, saw palmetto 10 ppm and nine Black Complex extracts at 1 ppm each, without hair-loss or regrowth claims.',
  },
  { name: 'Full INCI', description: PRODUCT_45_FULL_INCI },
])

const howToUse = JSON.stringify([
  {
    step: 'Prepare',
    instruction:
      'Part clean, dry hair. For the professional protocol, keep 1–2 cm between partings.',
  },
  {
    step: 'Open a fresh vial',
    instruction:
      'For professional use, shake before opening. Open immediately before the session.',
  },
  {
    step: 'Professional protocol',
    instruction:
      'A qualified professional uses a 0.25–0.5 mm roller or stamp for 10–15 minutes.',
  },
  {
    step: 'Home applicator',
    instruction:
      'Tap vertically with even pressure and do not drag the applicator sideways.',
  },
  {
    step: 'Clean the applicator',
    instruction:
      'Rinse under running water with the cleaning brush, treat in the alcohol jar, dry and re-cap.',
  },
  {
    step: 'Use immediately',
    instruction:
      'Use once or twice weekly. Use the opened vial at once and discard any remainder.',
  },
])

const directions =
  'For external use only. Avoid use during pregnancy and lactation. Do not use on damaged, inflamed or infected scalp. Avoid the eyes, eye area and mucous membranes; if contact occurs, rinse thoroughly with cool water. Stop use and seek medical advice if redness, swelling or irritation occurs. Use immediately after opening and discard any remainder. Store in a cool, dry place away from direct sunlight and children.'

async function main() {
  const matches = await prisma.product.findMany({
    where: {
      OR: [
        { productNumber: '45' },
        { id: '45' },
        { name: { contains: 'HAIR SOLUTION', mode: 'insensitive' } },
      ],
    },
  })

  const unique = [...new Map(matches.map(product => [product.id, product])).values()]
  if (unique.length !== 1) {
    throw new Error(`Expected exactly one product 45 match, found ${unique.length}`)
  }

  const product = unique[0]
  const expected = {
    productNumber: '45',
    size: '4ml*8pcs',
    nameRu: PRODUCT_45_RU_NAME,
    nameAr: PRODUCT_45_AR_NAME,
    description,
    descriptionRu: PRODUCT_45_RU_TRANSLATION.description,
    descriptionAr: PRODUCT_45_AR_TRANSLATION.description,
    productDetails,
    keyFeatures,
    benefits,
    ingredients,
    howToUse,
    directions,
    usage: null,
    skinType: null,
    ageGroup: 'adult',
    targetConcerns: JSON.stringify(['hair', 'scalp-care']),
  } as const

  await prisma.product.update({
    where: { id: product.id },
    data: expected,
  })

  const after = await prisma.product.findUniqueOrThrow({ where: { id: product.id } })
  for (const [field, value] of Object.entries(expected)) {
    if (after[field as keyof typeof after] !== value) {
      throw new Error(`Database parity failed for ${field}`)
    }
  }

  console.log(
    `Product 45 updated with exact parity: id=${after.id}, productNumber=${after.productNumber}`,
  )
}

main()
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
