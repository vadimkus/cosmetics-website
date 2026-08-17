/**
 * Product 32 — MULTI FUNCTIONAL ANTI-WRINKLE CREAM.
 *
 * Aligns the record with the source audit in
 * docs/SESSION_CHANGES_2026-08-17_PRODUCT_32_ANTI_WRINKLE_CREAM_SOURCE_AUDIT.md.
 *
 * 1. THE CITED CLINICAL STUDY IS STILL NOT IN OUR POSSESSION. The record carried
 *    the identical P&K citation to the serum — "Feb. 22 to May 13, 2024, 24 adult
 *    women aged 30~59 years" — and there is no report anywhere on the drive, nor
 *    any reference in the 42-page EU safety assessment. Removed. That the same
 *    citation appears on both products suggests one study covering the pair,
 *    which makes obtaining it worth more than a single page.
 * 2. THE RECORD LISTED "MANGO SEED BUTTER" AND "LIPID BARRIER LIPOSOME" AS
 *    EQUALS. The butter is at 0.800%, a real emollient dose. The liposome
 *    components are at 0.1 ppm each. One belongs in a key-ingredient list.
 * 3. NOTHING RECORDED THAT THIS FORMULA HAS NO PEPTIDES. That is a genuine point
 *    of difference from the serum and a mild point in the cream's favour — there
 *    is nothing here being sold as six mechanisms at parts per million.
 * 4. Nothing mentioned the lavender oil at 0.0413%, or the linalool and limonene
 *    declared with it. The cream carries more than twice the serum's fragrance.
 * 5. Bakuchiol at 0.100% was sold as "a natural alternative to retinol" without
 *    the concentration context. The study behind that comparison (Dhaliwal,
 *    Br J Dermatol 2019;180:289-296) used 0.5% twice daily.
 * 6. Neither the niacinamide assay (101.30%) nor the adenosine assay (95.50%)
 *    was on the record, and both are measured figures rather than declarations.
 *
 * Run: npx tsx --env-file=.env.local scripts/update-product-32-anti-wrinkle-cream-record-20260817.ts
 */

import { prisma } from '../lib/prisma'

const DESCRIPTION_EN =
  'The occlusive half of a pair. Around 13% of this jar is oils and butters — ethylhexyl palmitate 4%, cetearyl ' +
  'alcohol 3%, caprylic/capric triglyceride 2.4%, butylene glycol dicaprylate 2%, dimethicone 0.8% and mango seed ' +
  'butter 0.8% — over glycerin at 8%, niacinamide at 2% and adenosine at 0.04%, the dose Korea licenses for wrinkle ' +
  'improvement. Both of those actives were assayed on the batch, at 101.30% and 95.50% of declaration. Where the ' +
  'matching Anti-Wrinkle Serum draws water into skin at 25.45% glycerin, this holds it there: the serum has a ' +
  'specific gravity of 1.0689 and this cream 0.9860, either side of water. Contains no peptides at all. Bakuchiol is ' +
  'at 0.100%; the study behind its retinol comparison used 0.5% twice daily. Contains lavender oil with linalool and ' +
  'limonene declared. A Korean dual-function cosmetic for wrinkle improvement and brightening, assessed under EC ' +
  'Regulation 1223/2009 and graded Non Irritant on patch test.'

const DESCRIPTION_RU =
  'Окклюзивная половина пары. Около 13% этой баночки — масла и баттеры: этилгексил палмитат 4%, цетеарил спирт 3%, ' +
  'каприловый/каприновый триглицерид 2,4%, бутиленгликоль дикаприлат 2%, диметикон 0,8% и масло семян манго 0,8% — ' +
  'поверх глицерина 8%, ниацинамида 2% и аденозина 0,04%, дозы, под которую Корея лицензирует уменьшение морщин. Оба ' +
  'этих актива измерены в партии: 101,30% и 95,50% от заявленного. Где парная сыворотка втягивает воду в кожу своими ' +
  '25,45% глицерина, этот крем её удерживает: удельный вес сыворотки 1,0689, а крема 0,9860 — по обе стороны от воды. ' +
  'Пептидов нет совсем. Бакучиол — 0,100%; исследование, стоящее за сравнением с ретинолом, использовало 0,5% дважды ' +
  'в день. Содержит лавандовое масло с заявленными линалоолом и лимоненом. Корейское средство двойного действия для ' +
  'уменьшения морщин и осветления, оценено по регламенту EC 1223/2009, патч-тест — «не раздражает».'

const DESCRIPTION_AR =
  'النصف العازل من زوج. نحو 13% من هذه العلبة زيوت وزُبد — إيثيل هكسيل بالميتات 4%، وسيتيريل ألكوهول 3%، وثلاثي ' +
  'غليسريد الكابريليك/الكابريك 2.4%، وبيوتيلين غلايكول دايكابريليت 2%، ودايميثيكون 0.8%، وزبدة بذور المانجو 0.8% — ' +
  'فوق غليسرين بنسبة 8%، ونياسيناميد بنسبة 2%، وأدينوزين بنسبة 0.04%، وهي الجرعة التي ترخّصها كوريا لتحسين التجاعيد. ' +
  'وقد قيس هذان الفعّالان على الدفعة، عند 101.30% و95.50% من المعلن. وحيث يجذب السيروم المطابق الماء إلى البشرة ' +
  'بغليسرينه البالغ 25.45%، يحتفظ هذا الكريم به: فالكثافة النوعية للسيروم 1.0689 ولهذا الكريم 0.9860، على جانبَي ' +
  'الماء. ولا يحتوي أي ببتيدات. والباكوتشيول بنسبة 0.100%؛ أما الدراسة التي تقف خلف مقارنته بالريتينول فقد استخدمت ' +
  '0.5% مرتين يومياً. ويحتوي زيت اللافندر مع اللينالول والليمونين المعلنَين. مستحضر كوري مزدوج الوظيفة لتحسين ' +
  'التجاعيد والتفتيح، مقيَّم وفق اللائحة EC 1223/2009 ومصنّف «غير مهيّج» في اختبار اللصقة.'

/** Transcribed from the DTS MG quantitative formula, descending by weight. */
const FULL_INCI =
  'Aqua (Water), Glycerin, Ethylhexyl Palmitate, Butylene Glycol, Cetearyl Alcohol, Caprylic/Capric Triglyceride, ' +
  'Niacinamide, Butylene Glycol Dicaprylate/Dicaprate, Polyglyceryl-3 Methylglucose Distearate, Mangifera Indica ' +
  'Seed Butter, Dimethicone, Hydroxyacetophenone, Glyceryl Stearate, Hydroxyethyl Acrylate/Sodium ' +
  'Acryloyldimethyl Taurate Copolymer, Palmitic Acid, Stearic Acid, Bakuchiol, Allantoin, Adenosine, Lavandula ' +
  'Angustifolia (Lavender) Oil, Linalool, Sorbitan Isostearate, Disodium EDTA, Sodium Polyacrylate, 1,2-Hexanediol, ' +
  'Limonene, Propolis Extract, Hydrogenated Lecithin, Hydrolyzed Elastin, Ceramide NP, Cholesterol, ' +
  'Phytosphingosine, Hydrolyzed Collagen'

const KEY_FEATURES = [
  {
    title: 'Roughly 13% Oils and Butters',
    description:
      'Ethylhexyl palmitate 4%, cetearyl alcohol 3%, caprylic/capric triglyceride 2.4%, butylene glycol dicaprylate 2%, dimethicone 0.8% and mango seed butter 0.8%. This is the occlusive layer that stops water leaving skin.',
  },
  {
    title: 'Niacinamide 2%, Measured at 101.30%',
    description:
      'Vitamin B3 for uneven tone and barrier support, assayed on the batch slightly over declaration and comfortably inside specification.',
  },
  {
    title: 'Adenosine 0.04%, Measured at 95.50%',
    description:
      'The exact dose Korea licenses for wrinkle improvement, and the only anti-wrinkle active in the jar with a regulatory threshold behind it.',
  },
  {
    title: 'No Peptides At All',
    description:
      'Unlike the matching serum, which carries six at between 0.05 and 1.1 parts per million. Nothing in this jar is being sold to you at a millionth of a gram.',
  },
]

const BENEFITS = [
  'Locks moisture in - around 13% oils and butters over 8% glycerin',
  'Tone and barrier - niacinamide 2%, assayed at 101.30% of declaration',
  'Wrinkle improvement - adenosine 0.04%, the Korean licensed dose, assayed at 95.50%',
  'Mango seed butter 0.8% - a genuine emollient dose, well inside its reported limit',
  'Graded Non Irritant - a stronger patch-test result than a bare pass',
  'Pairs with the Anti-Wrinkle Serum - that draws water in, this holds it there',
]

/** Working doses first; the trace layer named without mechanisms. */
const ACTIVES = [
  {
    name: 'Emollients and structure, ~13%',
    description:
      'Ethylhexyl palmitate 4.00%, cetearyl alcohol 3.00%, caprylic/capric triglyceride 2.40%, butylene glycol dicaprylate/dicaprate 2.00%, dimethicone 0.80%. This is what makes it a cream and what keeps water in once it is there. It is also why the specific gravity is 0.9860 — lighter than water, where the serum is 1.0689.',
  },
  {
    name: 'Glycerin 8.00%',
    description:
      'A serious humectant load for a cream, though a third of what the matching serum carries. Enough on its own; better under the serum.',
  },
  {
    name: 'Niacinamide 2.00%',
    description:
      'Vitamin B3 for uneven tone and barrier support. Assayed on this batch at 101.30% of declaration.',
  },
  {
    name: 'Mango seed butter 0.800%',
    description:
      'A genuine emollient dose of Mangifera Indica seed butter. The safety assessment checked it against a maximum reported use of 5% in leave-on products.',
  },
  {
    name: 'Adenosine 0.040%',
    description:
      'The dose Korea licenses for wrinkle improvement, assayed at 95.50% of declaration.',
  },
  {
    name: 'Bakuchiol 0.100%',
    description:
      'Genuinely present, photostable, and gentler than a retinoid. The head-to-head-with-retinol study (Dhaliwal, British Journal of Dermatology 2019) used 0.5% twice daily, so this is one fifth of that concentration. Not assayed on the certificate, unlike the niacinamide and adenosine.',
  },
  {
    name: 'Allantoin 0.100% and hydroxyacetophenone 0.500%',
    description: 'Allantoin for comfort at a working dose; hydroxyacetophenone as antioxidant and preservative support.',
  },
  {
    name: 'The barrier and ECM layer, at trace',
    description:
      'Ceramide NP, cholesterol and phytosphingosine at 0.1 ppm each, hydrolyzed collagen at 0.1 ppm, hydrolyzed elastin at 1 ppm and propolis extract at 10 ppm. Named because they are in the formula; nothing here rests on them.',
  },
  {
    name: 'Lavender oil 0.0413%, linalool 0.0266%, limonene 0.0021%',
    description:
      'It is scented, with more than twice the serum\u2019s lavender. Both allergens are named because European law requires it. Patch test if you react to fragrance.',
  },
]

async function main() {
  const product = await prisma.product.findFirst({
    where: { OR: [{ productNumber: '32' }, { id: '32' }] },
  })
  if (!product) throw new Error('product 32 not found')

  const details = JSON.parse(product.productDetails || '{}') as Record<string, string>
  details.size = '50 g homecare · a 250 g professional size also exists'
  details.formulation =
    'Roughly 13% oils and butters over glycerin 8.00%, niacinamide 2.00%, mango seed butter 0.800%, allantoin 0.100%, bakuchiol 0.100%, adenosine 0.040%'
  details.peptides = 'None — unlike the matching serum, which carries six at ~1.4 ppm combined'
  details.bakuchiol =
    '0.100% — the retinol-comparison study used 0.5% twice daily, so five times this concentration'
  details.pairsWith =
    'The Anti-Wrinkle Serum. That is 25.45% glycerin and draws water in; this is ~13% oils and holds it there'
  details.fragrance = 'Yes — lavender oil 0.0413%, with linalool 0.0266% and limonene 0.0021% declared'
  details.ph = '5.00–7.00 (6.23 on the batch tested)'
  details.specificGravity = '0.9860 — lighter than water, against the serum\u2019s 1.0689'
  details.licence = 'Korean dual-function: wrinkle improvement and brightening'
  details.assessment = 'EU safety assessment under EC Regulation 1223/2009; patch test graded Non Irritant'
  details.usage = 'Twice daily as the last step, over serum and under sunscreen'
  details.keyBenefits = 'Moisture retention, tone and barrier, wrinkle improvement'
  details.origin = 'South Korea'

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

  console.log('Product 32 updated:')
  console.log('  pair       -> the serum/cream comparison is now the spine of the record')
  console.log('  peptides   -> "none" stated; it is a real difference from the serum')
  console.log('  mango      -> 0.800% separated from the 0.1 ppm liposome')
  console.log('  fragrance  -> lavender oil, linalool and limonene disclosed')
  console.log('  assays     -> niacinamide 101.30%, adenosine 95.50% now on the record')
  console.log('  dropped    -> the P&K clinical study, which we still do not hold')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
