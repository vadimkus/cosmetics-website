/**
 * Product 43 — HR³ MATRIX HAIR TONIC α.
 *
 * Aligns the record with the line audit in
 * docs/SESSION_CHANGES_2026-08-17_HR3_MATRIX_LINE_SOURCE_AUDIT.md.
 *
 * FRAMING DECISION (owner, 17 Aug): the UAE pages follow the ENGLISH panel —
 * "scalp nourishing, hair conditioning" — and make no hair-loss claim. We do not
 * hold the Korean functional filing, the hair-loss designation appears only on the
 * Korean, Russian and Arabic panels, and the English, French, German, Turkish,
 * Spanish and Portuguese panels all describe a scalp toner. So:
 *
 * 1. REMOVED "KFDA approved as a functional product for improving hair loss
 *    symptoms", "Functional tonic that improves the conditions of hair loss" and
 *    "Efficacy test on improving hair loss". Beyond the framing decision, the
 *    Korean designation is printed with a MANDATORY disclaimer we were omitting
 *    ("not a medicine for the prevention or treatment of disease"), and the
 *    licensed effect is 완화 — alleviation of symptoms — not improvement.
 * 2. NOTHING ON OUR SITE MENTIONED 9.500% DENATURED ALCOHOL, in a product applied
 *    twice daily and left on the scalp for 3-4 hours. Now stated.
 * 3. THE KOREAN PANEL CARRIES CONTRAINDICATIONS THAT EXIST ON NO OTHER PANEL:
 *    salicylic acid hypersensitivity, diabetes, circulatory disorders, renal
 *    failure, infection or erythema, and menstruation, pregnancy or possible
 *    pregnancy — all told to AVOID use, because existing symptoms may worsen.
 *    Driven by the salicylic acid at 0.250%. Added.
 * 4. DO NOT USE ON INFANTS UNDER 3 — on the English panel too, and absent from
 *    our record.
 * 5. PERIOD AFTER OPENING IS 3 MONTHS, printed twice on the carton and the
 *    shortest in the whole range. Added.
 * 6. THE PROPORTIONS WERE INVERTED. Our key-ingredient list opened with copper
 *    tripeptide-1 (1 ppm), then Sophora japonica (10 ppm), then caffeine (10 ppm),
 *    while menthol at 0.300% and panthenol at 0.200% sat mid-list. Reordered.
 * 7. THE APPLICATION INSTRUCTIONS were missing: spray morning and evening, massage
 *    in circles, do not wash off, leave at least 3-4 hours.
 *
 * MUST NEVER BE ADDED: the Russian panel's claim that the tonic "inhibits
 * 5α-reductase activation, suppresses dihydrotestosterone production" and
 * "stimulates the growth of new hair". That is the mechanism of finasteride, a
 * prescription medicine. It is logged in the corrections file and stays off every
 * GENOSYS UAE surface.
 *
 * Run: npx tsx --env-file=.env.local scripts/update-product-43-hair-tonic-record-20260817.ts
 */

import { prisma } from '../lib/prisma'
import {
  PRODUCT_43_AR_NAME,
  PRODUCT_43_AR_TRANSLATION,
  PRODUCT_43_RU_NAME,
  PRODUCT_43_RU_TRANSLATION,
} from '../data/product43LocalizedCopy'

const DESCRIPTION_EN =
  '70 ml scalp toner. Nearly a tenth of the bottle is denatured alcohol at 9.500%, which is what makes it dry down ' +
  'fast and feel clean rather than sit on the hair. Over that: menthol at 0.300% with two supporting cooling agents, ' +
  'panthenol at 0.200%, salicylic acid at 0.250% and allantoin at 0.100%. Spray onto the scalp morning and evening, ' +
  'massage it in with circular movements, and leave it — do not wash it off, and give it at least three to four ' +
  'hours. Its registered function outside Korea is scalp nourishing and hair conditioning. IMPORTANT: because of the ' +
  'salicylic acid, the manufacturer says to avoid this product if you have salicylic acid sensitivity, diabetes, a ' +
  'circulatory disorder, renal impairment, an active infection or reddened scalp, and during menstruation, ' +
  'pregnancy or possible pregnancy. Not for children under 3. Use within three months of opening. The remaining ' +
  'named ingredients are at trace: caffeine and Sophora japonica at 10 ppm each, copper tripeptide-1 at 1 ppm. ' +
  'Dermatologically tested.'

/** From the registered carton, matching the signed formula order. */
const FULL_INCI =
  'Aqua (Water), Alcohol Denat., Dipropylene Glycol, Ethoxydiglycol, Copper Tripeptide-1, Sophora Japonica Extract, ' +
  'Acorus Calamus Root Extract, Panthenol, Centella Asiatica Extract, Scutellaria Baicalensis Root Extract, ' +
  'Polygonum Cuspidatum Root Extract, Glycyrrhiza Glabra (Licorice) Root Extract, Camellia Sinensis Leaf Extract, ' +
  'Menthol, Salicylic Acid, Caffeine, Ascorbic Acid, Tocopherol, Allantoin, 1,2-Hexanediol, Sodium Citrate, PEG-60 ' +
  'Hydrogenated Castor Oil, Citric Acid, Butylene Glycol, Methyl Diisopropyl Propionamide, Menthyl Lactate, ' +
  'Ethylhexylglycerin, Disodium EDTA, Glycerin, Rosmarinus Officinalis (Rosemary) Leaf Extract, Chamomilla Recutita ' +
  '(Matricaria) Flower Extract'

const KEY_FEATURES = [
  {
    title: 'Denatured Alcohol 9.5%',
    description:
      'Nearly a tenth of the bottle, and the reason it dries down fast and leaves the hair clean rather than weighed down. It is also why a sensitive or already-irritated scalp may not want it twice a day.',
  },
  {
    title: 'Menthol 0.3%, With Two More Cooling Agents',
    description:
      'Menthol at 0.300% alongside menthyl lactate and methyl diisopropyl propionamide at 0.040% each. Between them they are the cooling everyone actually notices.',
  },
  {
    title: 'Panthenol 0.2% and Allantoin 0.1%',
    description:
      'The two conditioning ingredients present at working doses, sitting behind a salicylic acid load of 0.250%.',
  },
  {
    title: 'Read the Precautions Before You Buy',
    description:
      'The salicylic acid brings real contraindications: diabetes, circulatory disorders, renal impairment, pregnancy and menstruation are all on the manufacturer\u2019s avoid list, and it is not for under-3s. Use within three months of opening.',
  },
]

const BENEFITS = [
  'Dries down fast - 9.5% alcohol, no residue on the hair',
  'Strong cooling - menthol 0.3% plus two supporting cooling agents',
  'Conditioning at a working dose - panthenol 0.2%, allantoin 0.1%',
  'Leave-on - spray morning and evening, do not wash off for 3-4 hours',
  'Scalp nourishing and hair conditioning, per the registered English function',
  'Dermatologically tested',
]

const ACTIVES = [
  {
    name: 'Alcohol denat. 9.500%',
    description:
      'Nearly a tenth of the bottle after water. It carries the actives, dries down in seconds and leaves no film, which is what makes a leave-on scalp tonic wearable twice a day. It is also the ingredient most likely to bother a scalp that is already sore.',
  },
  {
    name: 'Dipropylene glycol 3.000% and ethoxydiglycol 1.000%',
    description: 'Solvents, and how the botanical extracts stay in solution in a mostly water-and-alcohol base.',
  },
  {
    name: 'Menthol 0.300%, menthyl lactate 0.040%, methyl diisopropyl propionamide 0.040%',
    description:
      'Three cooling agents rather than one. Menthol gives the immediate hit, the other two extend it. This is the sensation the product is really selling.',
  },
  {
    name: 'Salicylic acid 0.250%',
    description:
      'A keratolytic at a real dose, which is why the scalp feels cleaner over time — and why the manufacturer\u2019s contraindication list exists. If you are sensitive to salicylates, this is the ingredient to note.',
  },
  {
    name: 'Panthenol 0.200% and allantoin 0.100%',
    description: 'The conditioning pair, both at working doses.',
  },
  {
    name: 'Acorus calamus root 250 ppm, centella asiatica 50 ppm',
    description: 'Present in modest but non-trivial amounts, unlike the rest of the botanical list.',
  },
  {
    name: 'Caffeine and Sophora japonica, 10 ppm each',
    description:
      'Both named as key ingredients in our earlier copy. Ten parts per million each. For comparison, the MEDI Scalp Shampoo in the same line carries caffeine at a full 1% — a hundred times more.',
  },
  {
    name: 'Copper tripeptide-1, 1 ppm',
    description:
      'One part per million, and it used to open our ingredient list. It is in the formula; it is not what the tonic does.',
  },
  {
    name: 'Scutellaria and Polygonum cuspidatum 20 ppm; licorice, camellia sinensis, rosemary and chamomile 5-10 ppm',
    description: 'Listed for completeness. Nothing on this page rests on them.',
  },
]

async function main() {
  const product = await prisma.product.findFirst({
    where: { OR: [{ productNumber: '43' }, { id: '43' }] },
  })
  if (!product) throw new Error('product 43 not found')

  const details = {
    form: 'Leave-on scalp tonic spray',
    size: '70 ml, spray',
    registeredFunction: 'Scalp nourishing and hair conditioning',
    alcohol: 'Alcohol denat. 9.500%',
    cooling: 'Menthol 0.300%, menthyl lactate 0.040%, methyl diisopropyl propionamide 0.040%',
    care: 'Salicylic acid 0.250%, panthenol 0.200%, allantoin 0.100%',
    traceIngredients: 'Caffeine 10 ppm, Sophora japonica 10 ppm, copper tripeptide-1 1 ppm',
    usage: 'Morning and evening; circular massage; leave for at least 3-4 hours without rinsing',
    periodAfterOpening: 'Three months',
    testing: 'Dermatologically tested by HRIPT',
    origin: 'Made in Korea',
  }

  await prisma.product.update({
    where: { id: product.id },
    data: {
      productNumber: '43',
      nameRu: PRODUCT_43_RU_NAME,
      nameAr: PRODUCT_43_AR_NAME,
      description: DESCRIPTION_EN,
      descriptionRu: PRODUCT_43_RU_TRANSLATION.description,
      descriptionAr: PRODUCT_43_AR_TRANSLATION.description,
      productDetails: JSON.stringify(details),
      keyFeatures: JSON.stringify(KEY_FEATURES),
      benefits: JSON.stringify(BENEFITS),
      ingredients: JSON.stringify([...ACTIVES, { name: 'Full INCI', description: FULL_INCI }]),
      howToUse: JSON.stringify([
        { step: 'Spray', instruction: 'Part the hair and spray a small amount directly onto the scalp.' },
        { step: 'Massage', instruction: 'Distribute gently with circular fingertip movements.' },
        { step: 'Leave on', instruction: 'Do not rinse for at least 3-4 hours.' },
        { step: 'Repeat', instruction: 'Apply morning and evening. Use within three months of opening.' },
      ]),
      directions:
        'For external use only. Not for children under 3. Avoid with salicylic acid sensitivity, diabetes, circulatory disorders, renal impairment, scalp infection or redness, during menstruation, pregnancy or possible pregnancy. Do not use on damaged skin. Avoid eyes and mucous membranes. Stop use and seek medical advice if redness, swelling, itching or irritation occurs.',
      usage: 'morning-evening',
      targetConcerns: JSON.stringify(['hair', 'scalp-care']),
    },
  })

  console.log('Product 43 updated:')
  console.log('  REMOVED -> the KFDA hair-loss functional claim and the "efficacy test on improving hair loss"')
  console.log('  ADDED   -> alcohol denat. 9.500%, previously undisclosed')
  console.log('  ADDED   -> the contraindications: diabetes, circulatory, renal, pregnancy, menstruation')
  console.log('  ADDED   -> not for under-3s, and the 3-month period after opening')
  console.log('  ADDED   -> the application instructions, including do not wash off for 3-4 hours')
  console.log('  REORDER -> menthol and panthenol lead; caffeine 10 ppm and copper peptide 1 ppm demoted')
  console.log('  ADDED   -> full INCI')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
