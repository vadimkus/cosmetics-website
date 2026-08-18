/**
 * Product 47, HR³ MATRIX MESOPECIA KIT — the applicator is a roller, not a stamp.
 *
 * The record written earlier today called it "a 0.5 mm GENOSYS stamp" and instructed the
 * customer to "stamp directly on the scalp". The product photograph shows a drum roller
 * on a handle, and the registration artwork uses both words in the same document:
 *
 *   Contents line   "HR3 MATRIX HAIR SOLUTIONα4ml x 6vials / HR3 MATRIX SCALP
 *                    PEELINGα100ml / GENOSYS STAMP(ROLLER)"
 *   Korean contents "제노시스 스템프(롤러)"  — GENOSYS stamp (roller)
 *   Precaution      "Do not use roller(stamp) if you have metal allergy, keloid skin or
 *                    any other dermatitis."
 *   Step 3          "Part the hair … and roll (stamp) on the scalp directly. While
 *                    rolling(stamping), apply HAIR SOLUTIONα using a dropper."
 *   French          "L'utilisation de roller est interdite dans les cas suivants…"
 *   German          "…sollten Sie den Roller nicht verwenden"
 *
 * So the record now calls it a roller, notes that the carton also calls it a stamp, and
 * describes rolling rather than pressing.
 *
 * Two further corrections from the same artwork:
 *
 * 1. THE 0.5 mm IS ON THE RUSSIAN PANEL ONLY — "Дермаштамп 0,5 мм". The English panel
 *    gives no needle depth at all. The record now says where the figure comes from,
 *    the same way products 44 and 45 record the instructions recovered from their own
 *    Russian panels.
 *
 * 2. THE CARTON'S ENGLISH BLURB MAKES THE DRUG CLAIM, verbatim: "HR³ MATRIX MESOPECIA
 *    KIT is an innovative hair and scalp treatment system invented to prevent hair loss
 *    and promote hair regrowth and restoration by inhibiting the fundamental causes of
 *    hair loss." That is the source of the "prevent hair loss and promote healthy hair
 *    regrowth" line stripped from this record earlier today — it came off the box, in
 *    English, not out of a translation. Recorded as a known carton claim we do not
 *    carry, so the next person to read this record does not "restore" it.
 *
 * Also recovered from the Arabic panel and absent from the English one: dry with a hair
 * dryer for two to five minutes after the peeling, and repeat the sequence after ten
 * minutes if needed.
 *
 * Run: npx tsx --env-file=.env.local scripts/fix-product-47-roller-not-stamp-20260818.ts
 */

import { prisma } from '../lib/prisma'

const DESCRIPTION = [
  'The professional microneedling set for the scalp: a 100 ml bottle of HR³ MATRIX SCALP PEELING α,',
  'six 4 ml vials of HR³ MATRIX HAIR SOLUTION α, and a 0.5 mm GENOSYS roller. The peeling clears the',
  'scalp and cools it, the roller opens the way, and the solution goes in behind it.',
  '',
  'Korea registers the peeling as a scalp refresher and the solution for nutrition supply and hair',
  'conditioning. Neither is registered as a hair-loss treatment, and nothing here is a substitute for',
  'seeing a doctor about hair loss.',
].join(' ')

const KEY_FEATURES = JSON.stringify([
  {
    title: 'HR³ MATRIX SCALP PEELING α — 100 ml',
    description:
      'Denatured alcohol at 33.6% with 1.7% total cooling agents, of which 0.900% is menthol. It clears '
      + 'oil and loose flakes and leaves the scalp cold. Not a gentle peel and not a disinfectant — the '
      + 'salicylic acid sits at 99 ppm, far below a keratolytic dose.',
  },
  {
    title: 'HR³ MATRIX HAIR SOLUTION α — 4 ml × 6 vials',
    description:
      'Four growth factors totalling 1.2 ppm, copper tripeptide-1 at 5 ppm, plus panthenol and niacinamide '
      + 'in a propylene glycol carrier. Built to be driven in by the roller rather than rubbed on. Use a vial '
      + 'immediately once opened.',
  },
  {
    title: 'GENOSYS roller — 0.5 mm',
    description:
      'A drum roller on a handle, which the carton also calls a stamp. The needle depth is what makes the '
      + 'set a microneedling protocol rather than two topicals, and it is printed on the Russian panel only. '
      + 'Do not use it with a metal allergy, keloid-prone skin or dermatitis.',
  },
])

const BENEFITS = JSON.stringify([
  'Three steps in one box — clear the scalp, open the way, apply the solution',
  'Six 4 ml vials, enough for a course of sessions rather than a single treatment',
  '0.5 mm roller included, so the solution is delivered rather than left on the surface',
  'The same two liquids sold on their own as products 46 and 45, at the sizes the protocol uses',
  'Full INCI for both liquids printed on the carton and listed below',
])

const PRODUCT_DETAILS = JSON.stringify({
  form: 'Three-part scalp microneedling set',
  size: 'Peeling 100 ml · Solution 4 ml × 6 vials · Roller 0.5 mm',
  applicator:
    'A drum roller on a handle. The carton names it inconsistently — the contents line reads "GENOSYS '
    + 'STAMP(ROLLER)" and the instructions say "roll (stamp)" — but what ships is a roller, and it is rolled '
    + 'along each parting rather than pressed',
  needleDepth:
    '0.5 mm. This figure appears on the Russian panel only ("Дермаштамп 0,5 мм"); the English panel gives no '
    + 'depth',
  declaredFunction: 'Peeling: scalp refresher. Solution: nutrition supply, hair conditioning.',
  protocol:
    'Rub the peeling into the area with a swab, dry the scalp and hair, part the hair with a comb and roll '
    + 'directly on the scalp, applying the solution from the dropper as you go, then massage gently. The '
    + 'Arabic panel adds two to five minutes with a dryer at the drying step, and says the sequence may be '
    + 'repeated after ten minutes if needed. No interval between sessions is given on any panel',
  keyFigures:
    'Peeling: 33.6% alcohol, 0.900% menthol, salicylic acid 99 ppm, copper tripeptide-1 5 ppb. '
    + 'Solution: growth factors 1.2 ppm total, copper tripeptide-1 5 ppm.',
  precautions:
    'External use only. Keep away from the eyes and mucous membranes; rinse with cool water on contact. '
    + 'Stop and see a doctor if redness, swelling or irritation appears. Do not use the roller with a metal '
    + 'allergy, keloid-prone skin or dermatitis. Use each vial immediately after opening. The peeling is '
    + 'alcohol-heavy and flammable — keep it away from flame. Keep out of reach of children.',
  cartonClaimNotCarried:
    'The carton\u2019s English blurb reads "an innovative hair and scalp treatment system invented to prevent '
    + 'hair loss and promote hair regrowth and restoration by inhibiting the fundamental causes of hair loss", '
    + 'and the Russian panel titles the kit a hair-loss kit and credits the ampoule with angiogenesis. None of '
    + 'that is carried on our site: the registered functions are scalp refresher and hair conditioning. Do not '
    + 'restore these claims from the packaging',
  origin: 'South Korea — DTS MG Co., Ltd.',
})

async function main() {
  const before = await prisma.product.findUnique({ where: { id: '47' } })
  if (!before) throw new Error('product 47 not found')

  await prisma.product.update({
    where: { id: '47' },
    data: {
      size: 'Peeling 100ml · Solution 4ml x 6 · Roller 0.5mm',
      description: DESCRIPTION,
      benefits: BENEFITS,
      keyFeatures: KEY_FEATURES,
      productDetails: PRODUCT_DETAILS,
    },
  })

  const after = await prisma.product.findUnique({ where: { id: '47' } })
  const blob = [after?.description, after?.benefits, after?.keyFeatures, after?.size]
    .join(' ')
    .toLowerCase()

  // productDetails is excluded from this check on purpose: it now records the carton's
  // own claim as something we deliberately do not carry, so the words appear there.
  const banned = ['5α-reductase', 'dht', 'angiogenesis', 'regrowth', 'prevent hair loss', '5ml', 'stamp']
  const stillThere = banned.filter(t => blob.includes(t))

  console.log('size       :', after?.size)
  console.log('customer-facing fields still carrying a banned term:', stillThere.length ? stillThere : 'none')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
