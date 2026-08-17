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

const DESCRIPTION_EN =
  'The tinted cream built for the hour after a treatment, when the redness is still visible and you have to be seen. ' +
  'Three UV filters make up 19.70% of the tube for SPF30 / PA++, over a single universal shade from iron oxides and ' +
  'titanium dioxide. Underneath sit arbutin at 2% and adenosine at 0.04%, the two doses Korea licenses the ' +
  'brightening and wrinkle functions against, plus allantoin at 0.1%. Fragrance-free with no parabens, mineral oil, ' +
  'ethanol or phenoxyethanol — the only one of our three SPF products with no perfume at all. Contains arbutin at ' +
  '2%, which carries a Korean precaution about papules and mild itching, so patch test first. Contains beeswax. ' +
  'One shade only, and no water-resistance claim.'

const DESCRIPTION_RU =
  'Тонирующий крем, созданный для часа после процедуры, когда краснота ещё видна, а показаться на людях всё равно ' +
  'надо. Три УФ-фильтра составляют 19,70% тюбика и дают SPF30 / PA++ поверх единственного универсального оттенка из ' +
  'оксидов железа и диоксида титана. Под ними — арбутин 2% и аденозин 0,04%, две дозы, под которые Корея лицензирует ' +
  'осветление и уменьшение морщин, плюс аллантоин 0,1%. Без отдушки, парабенов, минерального масла, этанола и ' +
  'феноксиэтанола — единственное из трёх наших SPF-средств совсем без парфюма. Содержит арбутин 2%, к которому идёт ' +
  'корейское предостережение о папулах и легком зуде, поэтому сначала сделайте пробу. Содержит пчелиный воск. Один ' +
  'оттенок, водостойкость не заявлена.'

const DESCRIPTION_AR =
  'الكريم الملوّن المصنوع للساعة التي تلي الإجراء، حين يبقى الاحمرار مرئياً ويجب أن تظهري بين الناس. ثلاثة مرشحات ' +
  'تشكّل 19.70% من الأنبوب وتمنح SPF30 / PA++ فوق درجة لون واحدة شاملة من أكاسيد الحديد وثاني أكسيد التيتانيوم. ' +
  'وتحتها أربوتين بنسبة 2% وأدينوزين بنسبة 0.04%، وهما الجرعتان اللتان ترخّص عليهما كوريا وظيفتي التفتيح وتحسين ' +
  'التجاعيد، مع ألانتوين بنسبة 0.1%. خالٍ من العطر والبارابين والزيوت المعدنية والإيثانول والفينوكسي إيثانول — ' +
  'وهو الوحيد بين واقياتنا الثلاثة بلا أي عطر. يحتوي أربوتين بنسبة 2%، ويرافقه احتياط كوري بشأن حبيبات جلدية وحكة ' +
  'خفيفة، فاختبريه على بقعة أولاً. ويحتوي شمع العسل. درجة واحدة فقط، ولا ادعاء لمقاومة الماء.'

/** Transcribed from the registered carton. The record previously had none. */
const FULL_INCI =
  'Aqua (Water), Titanium Dioxide, Ethylhexyl Methoxycinnamate, Cetyl Ethylhexanoate, Butylene Glycol, Glycerin, ' +
  'Octocrylene, Cyclopentasiloxane, Cetyl PEG/PPG-10/1 Dimethicone, Cyclohexasiloxane, Cera Alba, Arbutin, ' +
  'Diisopropyl Dimer Dilinoleate, Sodium Chloride, Sorbitan Olivate, Iron Oxides (CI 77492), Silica Dimethyl ' +
  'Silylate, Mica, Iron Oxides (CI 77491), Caprylyl Glycol, Magnesium Stearate, Triethoxycaprylylsilane, Iron ' +
  'Oxides (CI 77499), Aluminum Hydroxide, 1,2-Hexanediol, Allantoin, Glyceryl Caprylate, Adenosine, ' +
  'Caprylhydroxamic Acid, Disodium EDTA, Glyceryl Laurate, Origanum Vulgare Leaf Extract, Eucalyptus Globulus ' +
  'Leaf Oil, Perilla Ocymoides Seed Oil, Tropolone, Phaseolus Radiatus Extract, Betula Platyphylla Japonica Bark ' +
  'Extract, Rumex Crispus Root Extract'

const KEY_FEATURES = [
  {
    title: 'Built for Post-Procedure Redness',
    description:
      'The registered carton is specific: it covers redness and blemishes after a dermatological treatment. That is what the pigment load, the SPF and the absence of fragrance are all for.',
  },
  {
    title: 'Arbutin 2% and Adenosine 0.04%',
    description:
      'The two doses Korea licenses the brightening and wrinkle-improvement functions against, which is why this is registered as a triple-function cosmetic rather than base makeup with an SPF.',
  },
  {
    title: 'Fragrance-Free, Five Ways Clean',
    description:
      'No parabens, artificial fragrance, mineral oil, ethanol or phenoxyethanol, all verified against the quantitative formula. It is the only one of the three GENOSYS SPF products with no perfume in it.',
  },
  {
    title: 'Every Active Assayed, Hydroquinone Included',
    description:
      'The certificate reports titanium dioxide at 7.09%, octinoxate 6.31%, octocrylene 4.50%, arbutin 1.81% and adenosine 0.04% — plus hydroquinone under 1 ppm, which is the test that matters when a product carries arbutin.',
  },
]

const BENEFITS = [
  'Post-treatment coverage - covers redness and blemishes after a dermatological procedure',
  'SPF30 / PA++ - three filters at 19.70%, though with no long-UVA filter in the set',
  'Arbutin 2% - at the concentration the Korean brightening function is granted on',
  'Adenosine 0.04% - the licensed dose for wrinkle improvement',
  'Fragrance-free - no perfume, ethanol, phenoxyethanol, parabens or mineral oil',
  'Tested for hydroquinone, lead and arsenic - the checks a pigmented arbutin product should show',
]

/** Real doses first, then everything the page must not build on. */
const ACTIVES = [
  {
    name: 'Arbutin 2.00%',
    description:
      'The Korean brightening function, measured at 1.81% on the batch against a 2.00% declaration. Korea requires a precaution at this level: human application data for products with arbutin at 2% or more has reported papules and mild itching. Patch test before first full use.',
  },
  {
    name: 'Adenosine 0.04%',
    description:
      'The licensed dose for wrinkle improvement, assayed on the batch at exactly 0.04%. The same figure appears in every functional anti-ageing product registered in Korea.',
  },
  {
    name: 'Three UV filters, 19.70%',
    description:
      'Titanium dioxide 7.70%, ethylhexyl methoxycinnamate 7.00% and octocrylene 5.00%. Note the titanium dioxide is also the coverage pigment, so it is not all optically available as protection — which is why 19.70% of filter still reads SPF30.',
  },
  {
    name: 'Allantoin 0.10%',
    description: 'Soothing and anti-irritant at a dose that works, alongside glycerin at 5% and butylene glycol at 5.5%.',
  },
  {
    name: 'Cyclopentasiloxane 3.50% and cyclohexasiloxane 2.50%',
    description:
      'D5 and D6. They are what let a cream holding nearly 20% mineral filter spread like a light base. European law caps both at 0.1% in leave-on cosmetics from 6 June 2027, on environmental persistence grounds rather than skin safety.',
  },
  {
    name: 'The botanicals, at trace level',
    description:
      'Eucalyptus globulus leaf oil and perilla ocymoides seed oil at 50 ppm each, oregano leaf at 50 ppm, and the Phaseolus radiatus, betula bark and Rumex crispus trio at 10 ppm each. Named because they are in the formula; nothing rests on them.',
  },
]

async function main() {
  const product = await prisma.product.findFirst({
    where: { OR: [{ productNumber: '42' }, { id: '42' }] },
  })
  if (!product) throw new Error('product 42 not found')

  const details = JSON.parse(product.productDetails || '{}') as Record<string, string>
  details.spfRating = 'SPF30 / PA++ — three filters, 19.70% combined, no long-UVA filter'
  details.coverage = 'Buildable, from sheer to medium. One universal shade only.'
  details.shade = 'Single shade from iron oxides and titanium dioxide — the cushion ships three'
  details.actives = 'Arbutin 2.00%, adenosine 0.04%, allantoin 0.10%'
  details.precaution =
    'Contains arbutin at 2%. Korean human-application data at this level reports papules and mild itching — patch test first.'
  details.freeFrom = 'Parabens, artificial fragrance, mineral oil, ethanol, phenoxyethanol'
  details.contains = 'Beeswax 2% (not vegan); D5 and D6 silicones at 6% combined'
  details.waterResistance = 'None claimed — reapply after swimming, sweating or towelling'
  details.ph = '5.50–7.50 (7.44 on the batch tested)'
  details.licence = 'Korean triple-function: whitening, wrinkle improvement, UV protection'
  details.keyBenefits = 'Post-procedure coverage, UV protection, brightening, wrinkle improvement'
  // Replaced by `precaution` above: the old value claimed the product was
  // "especially" for sensitive skin, which the arbutin warning contradicts.
  delete details.skinType
  delete details.type

  await prisma.product.update({
    where: { id: product.id },
    data: {
      description: DESCRIPTION_EN,
      descriptionRu: DESCRIPTION_RU,
      descriptionAr: DESCRIPTION_AR,
      productDetails: JSON.stringify(details),
      keyFeatures: JSON.stringify(KEY_FEATURES),
      benefits: JSON.stringify(BENEFITS),
      ingredients: JSON.stringify([...ACTIVES, { name: 'Full INCI', description: FULL_INCI }]),
    },
  })

  console.log('Product 42 updated:')
  console.log('  arbutin warning -> now on the record, was on the box only')
  console.log('  INCI            -> added; the record previously had none at all')
  console.log('  filters         -> three, 19.70%, with the batch assay')
  console.log('  disclosed       -> one shade, beeswax, D5/D6, no water resistance')
  console.log('  dropped         -> "especially sensitive skin" claim')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
