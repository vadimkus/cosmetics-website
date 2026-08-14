/**
 * Product 4, POWER SOLUTION HES: correct the record against the Intertek
 * dossier and the DTS MG catalogue, and rewrite the copy so it sells.
 *
 * Sources, all read for this script:
 *   Registration DOC/Artwork/[GENOSYS]POWER SOLUTION HES.pdf
 *     Full name "HA volume Enhancing Solution", registered function
 *     "Firming, hydrating", the INCI as printed, the precaution text, and the
 *     four application pictograms plus the roller diagram.
 *   Registration DOC/Formula/Formula-GENOSYS POWER SOLUTION HES.pdf
 *     The quantitative formula. Identical to both Quali-quanti copies, so
 *     unlike CVS there is no superseded version to fall for.
 *   Registration DOC/SA/SA-GENOSYS POWER SOLUTION HES.pdf
 *     Supplier trade names against INCI and percentage, which is the only
 *     place BIOPHYTEX(R) LS 9832 and MATRIXYL 3000 are recorded. Also pH
 *     spec 5.0-6.0, "no declarable allergen in the perfume", and the
 *     somatotropin description of sh-Polypeptide-7.
 *   Registration DOC/COA/COA-GENOSYS POWER SOLUTION HES(WNL053).pdf
 *     Lot WNL053, Dec 2024: pH 5.75, specific gravity 1.0272, <10 cfu/ml.
 *   Artwork/Art_Work/Catalogue/GENOSYS CATALOG.pdf p22-24
 *     The molecular-weight ladder with the Dalton figures, the roller
 *     mechanism, and BIOPHYTEX's six-botanical composition.
 *
 * WHAT WAS WRONG
 *
 * 1. 1,2-Hexanediol was missing from the INCI. It is 2.00% and fourth on the
 *    carton. Same omission as CVS had.
 * 2. "Hyaluronic Acid" was used as an ingredient name. The INCI is Sodium
 *    Hyaluronate.
 * 3. Healing and regeneration throughout: "promoting optimal healing",
 *    "Stimulates cellular renewal and healing processes", Copper Tripeptide-1
 *    as a "healing peptide" that "reduces inflammation", phytosphingosine with
 *    "anti-inflammatory benefits". None of that belongs on a cosmetic.
 * 4. "free from ... sulfates" appears in no source. The box badge reads
 *    Formaldehyde, Artificial fragrance, Artificial Colorant, Ethanol,
 *    Artificial Pigment. The catalogue prints a different five (paraben and
 *    artificial surfactant in place of formaldehyde and colorant). The badge
 *    on the box wins here because it is what the buyer is holding; the
 *    discrepancy is logged in genosys-artwork-corrections.html.
 * 5. "clinical-grade results" and "long-lasting" with nothing behind them.
 * 6. howToUse invented "1-2 ampoules" per treatment and "3-5 days
 *    post-treatment". The carton's steps are cleanse, open, apply, absorb, and
 *    the vial is a single 2 ml dose.
 *
 * WHAT WAS MISSING, which matters more
 *
 * The one fully documented fact that makes this product worth buying was
 * absent. HES runs hyaluronic acid at 1.65 +/- 0.35 million Dalton, chosen to
 * sit between dermal-filler grade above 2 million and the sub-1-million HA
 * that ordinary cosmetics use. Heavier HA binds more water but cannot get in
 * unaided, which is the whole reason the carton pairs it with a roller. Also
 * absent: HA at 1%, niacinamide at 2%, adenosine at 0.04%, MATRIXYL 3000, and
 * BIOPHYTEX's actual composition.
 *
 * ON MICRONEEDLING. Unlike CVS, the roller is documented for this product, on
 * the carton diagram and in the catalogue mechanism. It stays. It is framed as
 * what the sources support - a way to carry heavy HA past the surface - and
 * the carton's own four steps are leave-on, so the page says it works alone
 * too, which the Russian carton text states outright.
 *
 * Run: npx tsx --env-file=.env.local scripts/fix-power-solution-hes-4-claims-20260814.ts [--apply]
 */

import { PrismaClient } from '@prisma/client'

const url = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL || ''
const prisma = new PrismaClient({ accelerateUrl: url } as any)

const APPLY = process.argv.includes('--apply')

const DESCRIPTION =
  'HES stands for HA Volume Enhancing Solution, and the carton registers it for two things: ' +
  'firming and hydrating. The difference is the weight of the hyaluronic acid. Ordinary serums ' +
  'use low-molecular HA because that is the only kind that soaks in unaided, and it holds less ' +
  'water for it. HES runs HA at 1.65 million Dalton, just below the grade used in dermal ' +
  'fillers, and pairs it with a roller so the weight becomes an advantage instead of a barrier. ' +
  'A full 1% of that HA, niacinamide at 2%, adenosine at 0.04%, and a six-botanical firming ' +
  'complex led by escin. Ten sealed glass vials, 2 ml each, made in Korea.'

const DESCRIPTION_RU =
  'HES означает HA Volume Enhancing Solution, и на упаковке зарегистрированы две функции: ' +
  'укрепление и увлажнение. Отличие — в молекулярной массе гиалуроновой кислоты. Обычные ' +
  'сыворотки используют низкомолекулярную ГК, потому что только она впитывается сама, и воды ' +
  'она удерживает меньше. В HES гиалуроновая кислота с массой 1,65 миллиона дальтон — чуть ниже ' +
  'той, что применяется в дермальных филлерах, — и работает она в паре с роллером, так что вес ' +
  'молекулы становится преимуществом, а не препятствием. Полный 1% этой ГК, ниацинамид 2%, ' +
  'аденозин 0,04% и растительный укрепляющий комплекс из шести компонентов во главе с эсцином. ' +
  'Десять герметичных стеклянных ампул по 2 мл, произведено в Корее.'

const DESCRIPTION_AR =
  'يرمز HES إلى HA Volume Enhancing Solution، وتسجّل العلبة وظيفتين: تماسك البشرة وترطيبها. ' +
  'الفرق هو الوزن الجزيئي لحمض الهيالورونيك. تستخدم السيرومات المعتادة حمض هيالورونيك منخفض ' +
  'الوزن لأنه الوحيد الذي يتشرّب وحده، ولذلك يحتفظ بماء أقل. يعتمد HES على حمض هيالورونيك بوزن ' +
  '1.65 مليون دالتون، أي أقل بقليل من الدرجة المستخدمة في الفيلر، ويعمل مع الرولر ليصبح هذا ' +
  'الوزن ميزة لا عائقاً. نسبة كاملة 1% من هذا الحمض، ونياسيناميد 2%، وأدينوزين 0.04%، ومركّب ' +
  'نباتي مشدّ من ستة مكوّنات يتقدّمها الإسين. عشر قوارير زجاجية مُحكمة سعة 2 مل، صُنعت في كوريا.'

const KEY_FEATURES = [
  {
    title: 'Hyaluronic acid at 1.65 million Dalton',
    description:
      'Heavier hyaluronic acid binds more water. GENOSYS sits this one between the grade used in ' +
      'dermal fillers, above 2 million Dalton, and the sub-1-million HA that ordinary cosmetics ' +
      'use, then pairs it with a roller so the weight works for you rather than against you.',
  },
  {
    title: 'A full 1% hyaluronic acid',
    description:
      'One percent sodium hyaluronate, the largest active in the vial, with 10% glycerin and 2% ' +
      'betaine underneath it so the water it draws in has somewhere to stay.',
  },
  {
    title: 'Niacinamide at 2%, adenosine at 0.04%',
    description:
      'Real doses rather than a sprinkle for the ingredient list, alongside panthenol at 0.3% ' +
      'and phytosphingosine at 0.1% delivered in a liposome.',
  },
  {
    title: 'Two named complexes',
    description:
      'MATRIXYL 3000 brings palmitoyl oligopeptide and palmitoyl tetrapeptide-7. BIOPHYTEX is ' +
      "three percent of the batch and brings six botanicals led by escin and butcher's broom.",
  },
]

const BENEFITS = [
  'Firming and hydrating, the two functions printed on the carton',
  'Skin looks fuller and feels cushioned rather than tight, from HA heavy enough to hold its water',
  'Niacinamide at 2% and panthenol at 0.3% leave the surface comfortable after a professional session',
  "Escin, butcher's broom and centella in one complex for a firmer-looking finish",
  'Works on its own as a leave-on, or with a roller when a practitioner is driving it deeper',
  'A sealed single-use vial, so nothing sits open oxidising between one face and the next',
  'No formaldehyde, no artificial fragrance, no artificial colourant, no ethanol, no artificial pigment',
]

const FULL_INCI =
  'Aqua (Water), Glycerin, Butylene Glycol, 1,2-Hexanediol, Niacinamide, Betaine, Sodium ' +
  'Hyaluronate, Panthenol, Phytosphingosine, Lecithin, Escin, Ruscus Aculeatus Root Extract, ' +
  'Adenosine, Ammonium Glycyrrhizate, Centella Asiatica Extract, Hydrolyzed Yeast Protein, ' +
  'Lavandula Angustifolia (Lavender) Oil, Citrus Aurantium Dulcis (Orange) Oil, Salvia ' +
  'Officinalis (Sage) Oil, Santalum Austrocaledonicum Wood Oil, Pinus Sylvestris Oil, ' +
  'Cymbopogon Schoenanthus Oil, Lactic Acid, Calendula Officinalis Flower Extract, ' +
  'sh-Polypeptide-7, Copper Tripeptide-1, Palmitoyl Oligopeptide, Palmitoyl Tetrapeptide-7, ' +
  'Sodium Chloride, Sodium Phosphate, Carbomer, Polysorbate 20, Disodium EDTA.'

const INGREDIENTS = [
  {
    name: 'Sodium Hyaluronate (1%)',
    description:
      'The reason the product exists. At 1.65 million Dalton it is heavier than the hyaluronic ' +
      'acid in an ordinary serum, so it binds more water, and at 1% it is the largest active in ' +
      'the vial.',
  },
  {
    name: 'Niacinamide (2%)',
    description:
      'Vitamin B3 at a working concentration, second only to glycerin among the things in here ' +
      'doing visible work on the surface.',
  },
  {
    name: 'Glycerin (10%) and Betaine (2%)',
    description:
      'The humectant floor under the hyaluronic acid. Twelve percent of the vial between them, ' +
      'which is what keeps a 2 ml dose comfortable on skin that has just been worked on.',
  },
  {
    name: 'BIOPHYTEX (3% of the batch)',
    description:
      "Six botanicals in one complex: escin from horse chestnut, butcher's broom root, ammonium " +
      'glycyrrhizate from licorice, centella asiatica, calendula and hydrolysed yeast protein. ' +
      'Rich in saponins and flavonoids, and the firming half of the formula.',
  },
  {
    name: 'MATRIXYL 3000',
    description:
      'Palmitoyl oligopeptide and palmitoyl tetrapeptide-7 together, one of the most widely ' +
      'used peptide pairs in cosmetics, dosed here at 1 ppm each.',
  },
  {
    name: 'sh-Polypeptide-7 (1 ppm)',
    description:
      'The peptide that marks the Power Solution range. A single-chain recombinant human peptide ' +
      'grown by fermentation from a synthesised copy of the gene for somatotropin, so every ' +
      'batch arrives with the same 217-amino-acid sequence instead of varying the way a plant ' +
      'extract does. COSING lists it as a skin protectant.',
  },
  {
    name: 'Copper Tripeptide-1 (1 ppm)',
    description:
      'A copper-bound tripeptide, long established in professional skincare and dosed in parts ' +
      'per million, where it is classed as a skin conditioning agent.',
  },
  {
    name: 'Adenosine (0.04%)',
    description:
      'Present at exactly the concentration Korean formulators use it at when it is in a product ' +
      'for the look of firmness.',
  },
  {
    name: 'Phytosphingosine (0.1%)',
    description:
      'A ceramide precursor, delivered in a lecithin liposome alongside lactic acid so it is ' +
      'carried rather than simply mixed in. Supports the barrier that holds the water in.',
  },
  {
    name: 'A six-oil essential blend',
    description:
      'Lavender, sweet orange, sage, sandalwood, pine and lemongrass, 0.06% between them. This ' +
      'is where the scent comes from, which is why the box can say no artificial fragrance. Too ' +
      'little to declare a single fragrance allergen.',
  },
  {
    name: 'Full INCI',
    description: FULL_INCI,
  },
]

const HOW_TO_USE = [
  '1. Cleanse the face and pat it dry',
  '2. Open one vial. Each 2 ml vial is a single dose',
  '3. Pat the solution over the face',
  '4. Let it absorb. This is a leave-on, not rinsed off',
  '5. With a roller, under a practitioner: the carton shows the heavy HA carried past the surface rather than sitting on it. Follow the protocol you were given',
  '6. Discard whatever is left in an opened vial',
]

const DIRECTIONS =
  'Dermatologically tested. For professional use, or at home on a practitioner\u2019s advice. ' +
  'For external use only. Avoid contact with eyes and mucous membranes, and rinse with cool ' +
  'water if it happens. Do not use near the eyes. Scented with a blend of six essential oils ' +
  'rather than synthetic perfume, so patch test first if botanical oils are something you react ' +
  'to. Stop use and ask a doctor if redness, swelling or irritation occurs. Keep in a cool, dry ' +
  'place away from direct sunlight and out of children\u2019s reach.'

const PRODUCT_DETAILS = {
  form: 'Leave-on hydrating and firming solution in a sealed 2 ml glass vial',
  size: '2ml x 10ea',
  target: 'Skin that reads dehydrated, flat or slack',
  technology:
    'Hyaluronic acid at 1.65 million Dalton, delivered with a roller, over a 12% humectant base',
  keyBenefits: 'Firming and hydrating, the two functions registered on the carton',
  usage: 'Professional treatment and the days after it',
  skinType: 'All skin types, dehydrated and mature skin especially',
  application:
    'Cleanse, open one vial, pat over the face and let it absorb. Not rinsed off. A roller carries it deeper.',
  professionalUse: 'For licensed practitioners, or at home on a practitioner\u2019s advice',
  packaging: 'Sealed glass vial with a rubber crimp cap, ten vials to the carton',
  appearance: 'Pale brown liquid. The colour is the botanicals\u2019 own; there is no colourant in it',
  ph: '5.75 on lot WNL053 against a 4.50 to 6.50 specification',
  fill: '2 ml per vial; specific gravity 1.0272 on lot WNL053',
  microbial: 'Under 10 cfu/ml on lot WNL053, against a limit of 100',
  freeFrom: 'Formaldehyde, artificial fragrance, artificial colourant, ethanol, artificial pigment',
  shelfLife: 'Three years from manufacture; lot WNL053 runs to December 2027',
  origin: 'South Korea',
}

async function main() {
  const product =
    (await prisma.product.findFirst({ where: { productNumber: '4' } })) ||
    (await prisma.product.findUnique({ where: { id: '4' } }))
  if (!product) throw new Error('product 4 not found')

  const data = {
    description: DESCRIPTION,
    descriptionRu: DESCRIPTION_RU,
    descriptionAr: DESCRIPTION_AR,
    keyFeatures: JSON.stringify(KEY_FEATURES),
    benefits: JSON.stringify(BENEFITS),
    ingredients: JSON.stringify(INGREDIENTS),
    howToUse: HOW_TO_USE.join('\n'),
    directions: DIRECTIONS,
    productDetails: JSON.stringify(PRODUCT_DETAILS),
  }

  console.log(`product ${product.productNumber ?? product.id}: ${product.name}\n`)
  for (const [key, next] of Object.entries(data)) {
    const prev = (product as any)[key] ?? ''
    console.log(`--- ${key} ---`)
    console.log(`  was (${String(prev).length} chars): ${String(prev).slice(0, 160)}…`)
    console.log(`  now (${String(next).length} chars): ${String(next).slice(0, 160)}…\n`)
  }

  // Guard the two errors that must not survive this script.
  if (!FULL_INCI.includes('1,2-Hexanediol')) throw new Error('INCI lost 1,2-Hexanediol')
  const blob = JSON.stringify(data).toLowerCase()
  for (const banned of ['healing', 'regenerat', 'anti-inflammat', 'sulfate', 'hyaluronic acid (', 'igf-1']) {
    if (blob.includes(banned)) throw new Error(`banned phrase back in the copy: ${banned}`)
  }

  if (!APPLY) return console.log('DRY RUN - pass --apply to write')

  await prisma.product.update({ where: { id: product.id }, data })
  console.log('written')
}

main()
  .catch(e => {
    console.error(e.message ?? e)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
