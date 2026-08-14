/**
 * Product 52 claim corrections, checked against the DTS MG dossier.
 *
 * Sources, all under
 * ~/Desktop/Drive/Genosys/Registration/Intertek/SKIN REBOOT PDRN MASK PACK /
 *
 *   Formula-GENOSYS SKIN REBOOT PDRN MASK PACK.pdf   full quali-quanti, signed
 *                                                    by Narae Han, R&D manager
 *   Artwork-GENOSYS SKIN REBOOT PDRN MASK PACK.pdf   pack text in 7 languages
 *   COA-...(256EE).pdf                               lot 256EE, pH 6.37
 *   CFS-...pdf                                       KCA cert 2025-12072
 *   GENOSYS SKIN REBOOT PDRN MASK PACK .pptx         clinical study + concept
 *
 * What was wrong
 *
 * 1. "Peptide Complex - stimulates collagen production" was an ingredient card
 *    for an ingredient that is not in the product. The formula has 33 lines and
 *    not one peptide among them. The nearest things are hydrolyzed collagen at
 *    9.7 ppm and hydrolyzed elastin at 0.01 ppm, both traces. Removed.
 *
 * 2. The Full INCI was missing 1,2-Hexanediol, which the formula and the carton
 *    both declare at 1.504%. That is the seventh-largest ingredient in the
 *    product and a known sensitiser for a small number of people, so its absence
 *    is the one error here that could actually harm somebody. Restored.
 *
 * 3. "Promotes cellular regeneration", "accelerates skin repair", "promoting
 *    wound healing" and "calms inflammation" are drug-register claims. Reworded.
 *
 * 4. "Delivers clinical-grade skin rejuvenation" pointed at a study that
 *    measured barrier recovery, not rejuvenation. Replaced with what was
 *    actually measured.
 *
 * What was missing, and matters more than anything that was wrong
 *
 * 5. Korea licenses this as a 미백·주름개선 2중 기능성 화장품 - a DUAL-function
 *    cosmetic, for brightening AND wrinkle improvement - and names the two
 *    actives it is granted on: niacinamide and adenosine. The formula carries
 *    niacinamide at 2.00% and adenosine at 0.04%, which are the notified
 *    functional doses for exactly those two claims. Neither ingredient appeared
 *    anywhere on the page.
 *
 * 6. The carton declares Sodium DNA at 1000 ppm. The page said only "PDRN".
 *    A number that specific, printed on the pack, is worth more than the acronym.
 *
 * 7. There is a real clinical study: P&K Skin Research Center, 2 May 2025,
 *    20 women aged 20-60, barrier improvement against external stimuli.
 *    Trans-epidermal water loss on the treated side fell from 13.445 to 8.735
 *    after use, 34.969% below the irritated peak, and finished 14% below the
 *    untreated control at 10.205. The page said "clinical results show
 *    significant improvement" and gave no figure at all.
 */
import { PrismaClient } from '@prisma/client'

const url = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL || ''
const prisma = new PrismaClient(
  url.startsWith('prisma') ? ({ accelerateUrl: url } as any) : ({ datasources: { db: { url } } } as any)
)

const APPLY = process.argv.includes('--commit')

/** Pack order, which is the manufacturer's own grouping rather than strict
 *  descending weight. 1,2-Hexanediol restored at position 7 and the ppm figure
 *  kept on Sodium DNA, both exactly as the carton prints them. */
const FULL_INCI =
  'Aqua (Water), Glycerin, Dipropylene Glycol, Propanediol, Butylene Glycol, Niacinamide, ' +
  '1,2-Hexanediol, Glycereth-26, Panthenol, Xylitol, Sodium DNA (1000ppm), Ceramide NP, ' +
  'Phytosphingosine, Hydrolyzed Collagen, Hydrolyzed Elastin, Adenosine, Butyrospermum Parkii ' +
  '(Shea) Butter, Mentha Rotundifolia Leaf Extract, Camellia Sinensis Leaf Extract, Thymus ' +
  'Vulgaris (Thyme) Leaf Extract, Allantoin, Hydroxyethylcellulose, Arginine, Lavandula ' +
  'Angustifolia (Lavender) Oil, Ethylhexylglycerin, Pullulan, Xanthan Gum, Carbomer, Disodium ' +
  'EDTA, Methyl Diisopropyl Propionamide, PVM/MA Copolymer, Glyceryl Acrylate/Acrylic Acid ' +
  'Copolymer, Polyglyceryl-10 Laurate.'

const DESCRIPTION =
  'Thirty sheets in one tub, so the mask is there on the evening your skin actually needs it. ' +
  'Korea licenses this one for two things at once, brightening and wrinkle improvement, on a ' +
  'full 2% niacinamide and adenosine at 0.04%. Salmon DNA is declared at 1,000 ppm on the ' +
  'carton, and 1% panthenol rides with it on an ultra-thin lyocell sheet that sits close ' +
  'enough to read as second skin. In a clinical study on deliberately irritated skin, water ' +
  'loss through the barrier fell about 35%.'

const KEY_FEATURES = [
  {
    title: 'Licensed for two claims, not one',
    description:
      'Korea registers this as a dual-function cosmetic and names the actives it is granted ' +
      'on: niacinamide for brightening, adenosine for wrinkle improvement. Both sit at the ' +
      'doses that licence is given for, 2% and 0.04%.',
  },
  {
    title: 'Salmon DNA at 1,000 ppm',
    description:
      'Printed as a figure on the carton rather than left as an acronym. A tenth of a percent ' +
      'is a real inclusion for a DNA fraction, not a label sprinkle.',
  },
  {
    title: 'Ultra-thin lyocell sheet',
    description:
      'The fibre is laid down evenly, so essence loads across the whole sheet instead of ' +
      'pooling in patches. It goes on translucent, holds to the jaw and nose, and you can ' +
      'read through it.',
  },
  {
    title: 'Barrier recovery, measured',
    description:
      'Skin was deliberately irritated, then treated. Water loss through the barrier fell ' +
      '34.969% from the irritated peak and finished below the untreated side. Twenty women, ' +
      'aged 20 to 60, at an independent Korean research centre.',
  },
]

const BENEFITS = [
  'Barrier recovery - water loss through the skin fell about 35% in a clinical study on irritated skin',
  'Brightening - licensed in Korea on a full 2% niacinamide',
  'Wrinkle improvement - licensed in Korea on adenosine at 0.04%',
  'Deep hydration - glycerin, dipropylene glycol, propanediol, butylene glycol and xylitol make up most of the essence',
  'Soothing - 1% panthenol and 0.1% allantoin, for skin that has just been through something',
  'Near-neutral pH - the batch on file tested at 6.37, so it does not sting compromised skin',
  'Thirty sheets to a tub, lifted out one at a time with the built-in tweezers',
]

const INGREDIENTS = [
  {
    name: 'Sodium DNA (PDRN), 1,000 ppm',
    description:
      'Salmon-derived DNA fragments, declared as a figure on the carton. Salmon DNA is close ' +
      'enough to human DNA that the skin reads it as familiar rather than foreign, which is ' +
      'why it turns up in post-procedure care.',
  },
  {
    name: 'Niacinamide, 2%',
    description:
      'A full dose, and one of the two actives Korea licenses this mask on. Works on tone and ' +
      'on the barrier at the same time, which is unusual and the reason it is in almost ' +
      'everything worth buying.',
  },
  {
    name: 'Adenosine, 0.04%',
    description:
      'The second licensed active, at precisely the concentration Korea grants a ' +
      'wrinkle-improvement claim for. Not rounded up to it, not approaching it. At it.',
  },
  {
    name: 'Panthenol, 1%',
    description:
      'Provitamin B5. Holds water in the skin and takes the edge off tightness and redness ' +
      'after a treatment, a peel or too much sun.',
  },
  {
    name: 'Allantoin, 0.1%',
    description: 'A quiet soother that sits at the top of its usual range here rather than the bottom.',
  },
  {
    name: 'The essence itself',
    description:
      'Glycerin at 5.1%, then dipropylene glycol, propanediol and butylene glycol at 3%, 3% ' +
      'and 2%, with xylitol at 1%. The tub holds 350 g across 30 sheets, so each one comes ' +
      'out heavy with essence and the skin stays damp for the full twenty minutes.',
  },
  { name: 'Full INCI', description: FULL_INCI },
]

const PRODUCT_DETAILS = {
  type: 'Professional sheet mask, 30-sheet tub',
  size: '350 g / 30 sheets',
  keyBenefits: 'Barrier recovery, brightening, wrinkle improvement',
  skinType: 'All skin types, and built for skin that is stressed, dry or freshly treated',
  usage: '2 to 3 times a week, 10 to 20 minutes a sheet',
  technology: 'Ultra-thin lyocell sheet carrying salmon DNA at 1,000 ppm',
  origin: 'South Korea',
}

/** The carton says 10-20 minutes. The English record said 10-15 and the Russian
 *  said 15-20, so all three disagreed. The carton wins: it is the one the
 *  customer is holding. */
const HOW_TO_USE = [
  'Cleanse and pat dry',
  'Lift one sheet out with the built-in tweezers',
  'Smooth it onto the face, working out the air pockets',
  'Leave it on for 10 to 20 minutes',
  'Peel it off and pat the remaining essence in rather than rinsing',
  'Close the seal and the lid firmly so the sheets underneath stay wet',
]
  .map((step, i) => `${i + 1}. ${step}`)
  .join('\n')

const DIRECTIONS =
  'Tested for barrier recovery at an independent Korean research centre in May 2025, on 20 ' +
  'women aged 20 to 60 whose skin was deliberately irritated first: water loss through the ' +
  'barrier fell 34.969% from the irritated peak. Two to three sheets a week is the rhythm it ' +
  'was tested on. Keep the tub somewhere cool and closed tightly, or the sheets near the top ' +
  'will dry out.'

async function main() {
  const product = await prisma.product.findFirst({
    where: { productNumber: '52' },
    select: { id: true, name: true },
  })
  if (!product) throw new Error('product 52 not found')

  const data = {
    description: DESCRIPTION,
    keyFeatures: JSON.stringify(KEY_FEATURES),
    benefits: JSON.stringify(BENEFITS),
    ingredients: JSON.stringify(INGREDIENTS),
    productDetails: JSON.stringify(PRODUCT_DETAILS),
    howToUse: HOW_TO_USE,
    directions: DIRECTIONS,
    size: '350 g / 30 sheets',
  }

  for (const [k, v] of Object.entries(data)) {
    console.log(`\n=== ${k} ===\n${v}`)
  }

  if (!APPLY) {
    console.log('\n\ndry run, pass --commit to write')
    return
  }
  await prisma.product.update({ where: { id: product.id }, data })
  console.log('\n\nupdated', product.name)
}

main().finally(() => prisma.$disconnect())
