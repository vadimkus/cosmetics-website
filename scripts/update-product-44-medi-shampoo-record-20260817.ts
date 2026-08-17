/**
 * Correct the database record for product 44, HR³ MATRIX MEDI SCALP SHAMPOO α.
 *
 * Sources: docs/SESSION_CHANGES_2026-08-17_HR3_MATRIX_LINE_SOURCE_AUDIT.md, and
 * the current-generation dossier in Intertek/MEDI SHAMPOO ALPHA/ — signed DTS MG
 * formula, COA lot I30Y001 (product date 2025-10-23), and the registered artwork.
 *
 * WHY THIS RECORD NEEDED REWRITING
 *
 * 1. It claimed KFDA functional approval for improving hair-loss symptoms. Per the
 *    owner decision of 17 Aug we follow the ENGLISH panel, whose function line
 *    reads "Scalp & hair cleansing". The hair-loss designation is Korean-market
 *    only, we do not hold that filing, and where the Korean panel does cite it, it
 *    is legally obliged to add "this is not a medicine for the prevention or
 *    treatment of disease". Removed rather than reproduced.
 *
 * 2. The Russian panel goes considerably further than the Korean one and claims the
 *    shampoo "has antibacterial and antifungal action", "effectively fights
 *    dandruff", "reduces hair loss and accelerates hair growth". The only
 *    antifungal in the formula is piroctone olamine at 0.010%, which is roughly ten
 *    to a hundred times below an anti-dandruff working dose. None of that is going
 *    on our pages. This is the second Russian panel in this line to overclaim.
 *
 * 3. The proportions were inverted, as everywhere else in this line. Our record led
 *    with copper tripeptide-1 and biotin. Copper tripeptide-1 is at 0.000001%, or
 *    ten parts per BILLION. Biotin is at 2 ppm. Meanwhile caffeine sits at a full
 *    1.000% and menthol at 1.120% and neither was given any prominence.
 *
 * 4. Nothing recorded the cleansing system, the pH, or the fact that this is the
 *    coolest-running product in the range.
 *
 * Run: npx tsx --env-file=.env.local scripts/update-product-44-medi-shampoo-record-20260817.ts
 */

import { prisma } from '../lib/prisma'

const DESCRIPTION = [
  '300 ml scalp shampoo. Caffeine at a full 1.000% and menthol at 1.120% with menthyl lactate at 0.080%, which makes this the most strongly cooling product GENOSYS makes — and, for caffeine, a hundred times the dose in the HR³ MATRIX Hair Tonic.',
  'Cleansing runs on sodium C14-16 olefin sulfonate at 14.100% with coco-betaine at 5.250%, plus coco-glucoside and decyl glucoside; there is no sodium lauryl or laureth sulfate in the formula. Glycerin at 2.753% and sorbitol at 0.210% keep it from stripping, and the batch pH is 5.6 against a 4.50–6.50 specification.',
  'The carton function line is scalp and hair cleansing. Dermatologically tested. Fragranced at 0.300%. Rinse-off, so the sensible way to use it is to leave the lather on the scalp for about three minutes before rinsing, which is what the manufacturer\u2019s own Russian panel instructs.',
  'Note on the label reading: biotin is present at 2 ppm, saw palmetto fruit extract at 1 ppm and copper tripeptide-1 at 0.000001%, which is ten parts per billion. They are on the ingredient list but they are not doses to buy the product for. Piroctone olamine is present at 0.010%, a preservative-level amount rather than an anti-dandruff treatment dose.',
].join(' ')

const INGREDIENTS = JSON.stringify([
  {
    name: 'Caffeine 1.000%',
    description:
      'A full one per cent, which is a hundred times the amount in the HR³ MATRIX Hair Tonic in the same line. If caffeine is the ingredient you are shopping for, this is the product in the range that actually carries it at a meaningful dose.',
  },
  {
    name: 'Menthol 1.120% with menthyl lactate 0.080%',
    description:
      'The strongest cooling in the GENOSYS range — roughly three and a half times the menthol in the hair tonic. Menthol gives the immediate cold hit, menthyl lactate carries it on after rinsing.',
  },
  {
    name: 'Sodium C14-16 Olefin Sulfonate 14.100% with Coco-Betaine 5.250%',
    description:
      'The cleansing system, supported by coco-glucoside at 0.240% and decyl glucoside at 0.160%. An olefin sulfonate is not a sulfate: there is no sodium lauryl sulfate or laureth sulfate in this formula. It is still a thorough cleanser rather than a low-foaming gentle one.',
  },
  {
    name: 'Glycerin 2.753% with Sorbitol 0.210%',
    description:
      'Humectants at a real dose for a rinse-off product, which is what stops a 14% surfactant load leaving the scalp tight.',
  },
  {
    name: 'Viscum album (mistletoe) extract 0.050%',
    description:
      'At 500 ppm, the most substantial botanical in the formula, and the only one present in an amount worth naming.',
  },
  {
    name: 'Malt extract 0.028%',
    description: 'At 280 ppm. Modest, and second only to the mistletoe among the plant extracts here.',
  },
  {
    name: 'Piroctone Olamine 0.010%',
    description:
      'An antifungal, present at 100 ppm. Worth being straight about: anti-dandruff efficacy for this ingredient generally needs 0.1% to 1.0%, so at 0.010% it is functioning as part of the preservative system rather than as a dandruff treatment. We do not claim it treats dandruff.',
  },
  {
    name: 'Panthenol 0.007500%',
    description:
      'Vitamin B5 at 75 ppm. Present, but a small fraction of the 0.200% in the hair tonic from the same line — worth knowing if panthenol is what you are after.',
  },
  {
    name: 'Biotin 0.000200%',
    description:
      'Two parts per million. Our own copy used to lead on biotin and the carton names it too, but this is not a dose that does anything. Listed here for completeness rather than as a selling point.',
  },
  {
    name: 'Serenoa serrulata (saw palmetto) fruit extract 0.000100%',
    description: 'One part per million. On the label, not at a working concentration.',
  },
  {
    name: 'Copper Tripeptide-1 0.000001%',
    description:
      'Ten parts per billion. It appears high on the carton ingredient list because of where it sits in the manufacturer\u2019s sequence, not because of how much is in the bottle.',
  },
  {
    name: 'Citric Acid 0.300%',
    description: 'Holds the shampoo on the acid side of neutral. The batch tested at pH 5.6.',
  },
])

const PRODUCT_DETAILS = JSON.stringify({
  form: 'Rinse-off scalp shampoo, brown transparent liquid',
  size: '300 ml',
  registeredFunction: 'Scalp and hair cleansing (English carton panel)',
  cooling: 'Menthol 1.120% plus menthyl lactate 0.080% — the strongest cooling in the GENOSYS range',
  caffeine: '1.000% — one hundred times the concentration in the HR³ MATRIX Hair Tonic α',
  cleansingSystem:
    'Sodium C14-16 olefin sulfonate 14.100%, coco-betaine 5.250%, coco-glucoside 0.240%, decyl glucoside 0.160%. No sodium lauryl sulfate and no laureth sulfate',
  humectants: 'Glycerin 2.753%, sorbitol 0.210%',
  botanicals:
    'Mistletoe 0.050%, malt 0.028%, acorus calamus root 0.002%, persimmon / camellia japonica / carob 0.00175% each',
  atTrace:
    'Panthenol 75 ppm, biotin 2 ppm, saw palmetto 1 ppm, ginseng 0.5 ppm, copper tripeptide-1 0.000001% (10 ppb)',
  piroctoneOlamine:
    '0.010%. An antifungal at a preservative-level dose, not an anti-dandruff treatment dose. No dandruff claim is made',
  fragrance: 'Parfum 0.300%',
  preservation: 'Potassium benzoate 0.450%, ethylhexylglycerin 0.200%, 1,2-hexanediol 0.031%',
  pH: '4.50–6.50 (5.6 on the batch tested)',
  viscosity: '5,740 against a 3,000–9,000 specification',
  purity: 'Total aerobic microbial count nil, against a permitted 100 cfu/ml',
  testing: 'Dermatologically tested, as printed on the carton',
  usage:
    'Take a moderate amount, emulsify in the hands, apply to damp hair and massage into the scalp. The manufacturer\u2019s Russian panel adds a useful step the English one omits: work 3–5 ml into the scalp and leave the lather on for about three minutes before rinsing thoroughly.',
  notFor: 'Children under 3 years of age. Avoid the eye area; rinse thoroughly with water on contact',
  keyBenefits:
    'A strong, cooling cleanse with caffeine at a working 1%, an acidic pH, and no sulfates',
  origin: 'Made in Korea',
})

const KEY_FEATURES = JSON.stringify([
  'Caffeine at a full 1.000% — a hundred times the dose in the hair tonic',
  'Menthol 1.120% with menthyl lactate — the strongest cooling in the range',
  'No sodium lauryl or laureth sulfate; olefin sulfonate and betaine instead',
  'Batch pH 5.6, on the acid side of neutral',
  'Glycerin 2.753% so a 14% surfactant load does not leave the scalp tight',
  'Dermatologically tested, as printed on the carton',
])

const BENEFITS = JSON.stringify([
  'Cools the scalp harder than anything else GENOSYS makes',
  'Cleans thoroughly through sebum and product build-up',
  'Leaves the scalp comfortable rather than stripped',
  'Pairs with the HR³ MATRIX Hair Tonic, which goes on afterwards on a dry scalp',
])

async function main() {
  const product = await prisma.product.findFirst({
    where: { name: { contains: 'MEDI SCALP SHAMPOO' } },
  })
  if (!product) throw new Error('Product 44 (MEDI SCALP SHAMPOO) not found')

  console.log(`Updating id=${product.id} — ${product.name}`)

  await prisma.product.update({
    where: { id: product.id },
    data: {
      description: DESCRIPTION,
      ingredients: INGREDIENTS,
      productDetails: PRODUCT_DETAILS,
      keyFeatures: KEY_FEATURES,
      benefits: BENEFITS,
    },
  })

  const after = await prisma.product.findUnique({ where: { id: product.id } })
  console.log('\nDescription now:\n', after?.description?.slice(0, 320), '…')
  console.log('\nRemoved: KFDA hair-loss functional claim, the Russian panel\u2019s antibacterial /')
  console.log('antifungal / anti-dandruff / accelerates-growth claims, and biotin and copper')
  console.log('tripeptide-1 as headline ingredients.')
  console.log('Added: caffeine 1.000%, menthol 1.120%, the cleansing system, pH 5.6, the')
  console.log('three-minute dwell instruction, and honest doses for the trace ingredients.')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
