/**
 * Product 42 — INTENSIVE BLEMISH BALM CREAM [SPF30 / PA++].
 *
 * Aligns the record with the source audit in
 * docs/SESSION_CHANGES_2026-08-17_PRODUCT_42_BLEMISH_BALM_SOURCE_AUDIT.md.
 *
 * 1. THE MANDATORY KOREAN ARBUTIN PRECAUTION WAS MISSING FROM THE SITE. The
 *    carton carries it because the product holds arbutin at 2% or more: human
 *    application data has reported papules and mild itching. It is printed on
 *    the box the customer receives and appeared on no page of ours, while the
 *    record simultaneously claimed the product suited "especially sensitive"
 *    skin.
 * 2. The `ingredients` field was empty — no INCI at all, the same gap product 40
 *    had. Transcribed from the registered carton.
 * 3. Nothing recorded the triple Korean function, the three filters at 19.70%,
 *    arbutin 2.00%, adenosine 0.04%, or that every declared active was assayed
 *    on the batch — including a hydroquinone test, which is the one that
 *    actually matters when you sell arbutin.
 * 4. Nothing said the product is ONE SHADE. The BB Cushion ships three.
 * 5. Nothing said it contains BEESWAX at 2%, so it is not vegan.
 * 6. Nothing said it is the only fragrance-free product of the three SPF items,
 *    which is a genuine advantage that was being left on the table.
 *
 * Run: npx tsx --env-file=.env.local scripts/update-product-42-blemish-balm-record-20260817.ts
 */

import { prisma } from '../lib/prisma'
import {
  PRODUCT_42_AR_DESCRIPTION,
  PRODUCT_42_AR_NAME,
  PRODUCT_42_FULL_INCI,
  PRODUCT_42_RU_DESCRIPTION,
  PRODUCT_42_RU_NAME,
} from '../data/product42LocalizedCopy'

const DESCRIPTION_EN =
  'A tinted BB cream with natural coverage and SPF 30 PA++. Three UV filters make up 19.70% of the formula: ' +
  'Titanium Dioxide 7.70%, Octinoxate 7% and Octocrylene 5%. Arbutin 2% supports a more even-looking tone, ' +
  'adenosine 0.04% cares for the appearance of wrinkles, and glycerin 5% with butylene glycol 5.5% helps maintain ' +
  'comfort. One shade. No parabens, artificial fragrance, mineral oil, ethanol or phenoxyethanol. The product is ' +
  'not claimed water-resistant and contains beeswax.'


const KEY_FEATURES = [
  {
    title: 'Natural tinted coverage',
    description:
      'One shade visually softens the look of redness and imperfections, including redness that may remain after a dermatological treatment. Use after a procedure only with specialist approval and on intact skin.',
  },
  {
    title: 'Arbutin 2% and Adenosine 0.04%',
    description:
      'Functional ingredients for a more even-looking tone and care for the appearance of wrinkles.',
  },
  {
    title: 'No artificial fragrance',
    description:
      'Also made without parabens, mineral oil, ethanol or phenoxyethanol.',
  },
  {
    title: 'Five key components measured',
    description:
      'The finished cream measured Titanium Dioxide at 7.09%, Octinoxate 6.31%, Octocrylene 4.50%, arbutin 1.81% and adenosine 0.04%.',
  },
]

const BENEFITS = [
  'Natural tinted coverage that visually softens redness and imperfections',
  'SPF 30 PA++ from three UV filters at 19.70% total',
  'Arbutin 2% for a more even-looking tone',
  'Adenosine 0.04% for the appearance of wrinkles',
  'Glycerin 5% and butylene glycol 5.5% for moisturizing comfort',
  'No parabens, artificial fragrance, mineral oil, ethanol or phenoxyethanol',
]

/** Real doses first, then everything the page must not build on. */
const ACTIVES = [
  {
    name: 'Arbutin 2.00%',
    description:
      'Supports a more even-looking tone; measured at 1.81% in the finished cream. Human application data for products containing arbutin at 2% or more has reported papules and mild itching.',
  },
  {
    name: 'Adenosine 0.04%',
    description:
      'Cares for the appearance of wrinkles; measured at 0.04% in the finished cream.',
  },
  {
    name: 'Three UV filters, 19.70%',
    description:
      'Titanium Dioxide 7.70%, Ethylhexyl Methoxycinnamate 7.00% and Octocrylene 5.00% deliver the labelled SPF 30 PA++.',
  },
  {
    name: 'Allantoin 0.10%',
    description: 'Helps maintain skin comfort alongside glycerin at 5% and butylene glycol at 5.5%.',
  },
]

async function main() {
  const product = await prisma.product.findFirst({
    where: { OR: [{ productNumber: '42' }, { id: '42' }] },
  })
  if (!product) throw new Error('product 42 not found')

  const details = JSON.parse(product.productDetails || '{}') as Record<string, string>
  details.form = 'Tinted BB cream with a natural finish'
  details.size = '50 g'
  details.spfRating = 'SPF 30 PA++ · three UV filters · 19.70% declared total'
  details.filters = 'Titanium Dioxide 7.70% · Octinoxate 7% · Octocrylene 5%'
  details.shade = 'One shade from iron oxides and titanium dioxide'
  details.actives = 'Arbutin 2.00%, adenosine 0.04%, allantoin 0.10%'
  details.hydrationBase = 'Butylene glycol 5.5% · glycerin 5%'
  details.precaution =
    'Human application data for products containing arbutin at 2% or more has reported papules and mild itching.'
  details.freeFrom = 'Parabens, artificial fragrance, mineral oil, ethanol, phenoxyethanol'
  details.contains = 'Beeswax 2% · not vegan'
  details.waterResistance = 'The product is not claimed water-resistant'
  details.ph = 'Measured pH 7.44 · specification 5.50–7.50'
  details.licence = 'Korean triple-function: whitening, wrinkle improvement, UV protection'
  details.testing = 'Dermatologically tested'
  details.origin = 'Made in Korea'
  delete details.skinType
  delete details.type
  delete details.coverage

  await prisma.product.update({
    where: { id: product.id },
    data: {
      productNumber: '42',
      name: 'INTENSIVE BLEMISH BALM CREAM [SPF 30 PA++]',
      nameRu: PRODUCT_42_RU_NAME,
      nameAr: PRODUCT_42_AR_NAME,
      description: DESCRIPTION_EN,
      descriptionRu: PRODUCT_42_RU_DESCRIPTION,
      descriptionAr: PRODUCT_42_AR_DESCRIPTION,
      size: '50 g',
      productDetails: JSON.stringify(details),
      keyFeatures: JSON.stringify(KEY_FEATURES),
      benefits: JSON.stringify(BENEFITS),
      ingredients: JSON.stringify([...ACTIVES, { name: 'Full INCI', description: PRODUCT_42_FULL_INCI }]),
      howToUse: JSON.stringify([
        {
          step: 'Patch test',
          instruction:
            'Because the formula contains arbutin at 2%, test a small amount on a limited area first if your skin is prone to reactions.',
        },
        {
          step: 'Apply as the final morning step',
          instruction:
            'Spread an even layer over the face and neck 15 minutes before going outdoors. Spot application will not deliver the labelled SPF.',
        },
        {
          step: 'Build only where needed',
          instruction:
            'Let the first thin layer settle, then add a second thin layer where more coverage is wanted.',
        },
        {
          step: 'Reapply protection',
          instruction:
            'Reapply at least every two hours outdoors and after swimming, heavy sweating or towelling. The product is not claimed water-resistant.',
        },
      ]),
      directions:
        'For external use only. Do not apply to damaged skin. Avoid the eyes and mucous membranes; rinse thoroughly with cool water after contact. Human application data for products containing arbutin at 2% or more has reported papules and mild itching. Stop use and seek medical advice if redness, swelling, itching or irritation occurs. After a dermatological procedure, use only when a specialist confirms the skin is intact and ready for makeup. Store in a cool, dry place away from direct sunlight and children.',
      skinType: null,
      targetConcerns: JSON.stringify(['sun-protection', 'uneven-tone', 'wrinkles']),
      usage: 'morning',
    },
  })

  console.log('Product 42 updated:')
  console.log('  arbutin warning -> now on the record, was on the box only')
  console.log('  INCI            -> added; the record previously had none at all')
  console.log('  filters         -> three, 19.70%, with the batch assay')
  console.log('  disclosed       -> one shade, beeswax, no water resistance')
  console.log('  dropped         -> "especially sensitive skin" claim')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
