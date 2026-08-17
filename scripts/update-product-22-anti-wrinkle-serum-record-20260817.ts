/**
 * Product 22 — MULTI FUNCTIONAL ANTI-WRINKLE SERUM.
 *
 * Aligns the record with the source audit in
 * docs/SESSION_CHANGES_2026-08-17_PRODUCT_22_ANTI_WRINKLE_SERUM_SOURCE_AUDIT.md.
 *
 * Nothing on this product was invented. Everything was out of proportion:
 *
 * 1. GLYCERIN AT 25.45% WAS NEVER MENTIONED. It is the second ingredient and a
 *    quarter of the bottle, and the certificate's specific gravity of 1.0689
 *    confirms it. The description led instead on a six-peptide complex present
 *    at roughly 1.4 ppm.
 * 2. Bakuchiol is at 0.100%. The retinol-equivalence study everybody cites
 *    (Dhaliwal, Br J Dermatol 2019;180:289-296, verified from the journal) used
 *    0.5% twice daily — five times this concentration. The record now gives both
 *    numbers instead of borrowing the conclusion.
 * 3. THE CITED CLINICAL STUDY IS NOT IN OUR POSSESSION. The description claimed
 *    "Clinical study on improvement of skin age index, P&K Skin Research Center,
 *    Feb. 22 to May 13, 2024, 24 adult women aged 30~59 years." No such report
 *    exists anywhere in ~/Desktop/Drive/Genosys, and the 46-page EU safety
 *    assessment does not reference it. Removed rather than left as an
 *    unsupported half-claim. Request it from DTS MG — a real 24-subject study
 *    would be the strongest asset this product has.
 * 4. The six peptides come from genuinely premium raw materials (Matrixyl 3000
 *    from Sederma, Syn-Coll from DSM, Elastyl from Corum, AH PEP 50) bought in
 *    at 0.1% each, giving peptides at 0.05-1.1 ppm. Credit the sourcing, print
 *    the numbers, attach no mechanisms.
 * 5. NOTHING MENTIONED THE FRAGRANCE. Lavender oil at 0.0186% with linalool
 *    declared separately at 0.0114%.
 * 6. Niacinamide and adenosine were both assayed on the batch — 96.72% and
 *    101.00% of declaration — and the patch test came back graded "Non
 *    Irritant" rather than merely passing. None of that was on the record.
 *
 * Run: npx tsx --env-file=.env.local scripts/update-product-22-anti-wrinkle-serum-record-20260817.ts
 */

import { prisma } from '../lib/prisma'

const DESCRIPTION_EN =
  'A humectant serum with two real actives in it. Glycerin sits second on the ingredient list at 25.45% — a quarter ' +
  'of the bottle — with betaine at 0.5% and panthenol and allantoin at 0.1% each, which is why skin looks plumper ' +
  'and lines shallower while it holds water. On top of that, niacinamide at 2% for tone and barrier, measured at ' +
  '96.72% of declaration on the batch, and adenosine at 0.04%, the dose Korea licenses for wrinkle improvement, ' +
  'measured at 101%. Bakuchiol is present at 0.100%; the study behind its retinol comparison used 0.5% twice daily, ' +
  'so treat it as a welcome photostable extra rather than a retinoid replacement. Six peptides from Sederma, DSM and ' +
  'Corum materials are in the formula at roughly 1.4 ppm combined. Contains lavender oil with declared linalool. ' +
  'Assessed under EC Regulation 1223/2009 and graded Non Irritant on patch test.'

const DESCRIPTION_RU =
  'Увлажняющая сыворотка с двумя настоящими активами. Глицерин стоит вторым в составе — 25,45%, четверть флакона, — ' +
  'с бетаином 0,5% и пантенолом и аллантоином по 0,1%, поэтому кожа выглядит полнее, а линии мельче, пока она ' +
  'удерживает воду. Сверху ниацинамид 2% для тона и барьера, измеренный в партии на 96,72% от заявленного, и ' +
  'аденозин 0,04% — доза, под которую Корея лицензирует уменьшение морщин, измерено 101%. Бакучиол присутствует в ' +
  'концентрации 0,100%; исследование, на котором строится сравнение с ретинолом, использовало 0,5% дважды в день, ' +
  'поэтому считайте его приятным фотостабильным дополнением, а не заменой ретиноида. Шесть пептидов из материалов ' +
  'Sederma, DSM и Corum присутствуют суммарно около 1,4 ppm. Содержит лавандовое масло с заявленным линалоолом. ' +
  'Оценено по регламенту EC 1223/2009, патч-тест — «не раздражает».'

const DESCRIPTION_AR =
  'سيروم مرطّب بفعّالَين حقيقيَّين. الغليسرين ثانياً في قائمة المكوّنات بنسبة 25.45% — ربع العبوة — مع بيتايين بنسبة ' +
  '0.5% وبانثينول وألانتوين بنسبة 0.1% لكل منهما، ولهذا تبدو البشرة أكثر امتلاءً والخطوط أقلّ عمقاً وهي محتفظة ' +
  'بالماء. وفوق ذلك نياسيناميد بنسبة 2% للّون والحاجز، مقيس عند 96.72% من المعلن على الدفعة، وأدينوزين بنسبة 0.04%، ' +
  'وهي الجرعة التي ترخّصها كوريا لتحسين التجاعيد، مقيسة عند 101%. والباكوتشيول موجود بنسبة 0.100%؛ أما الدراسة التي ' +
  'تقف خلف مقارنته بالريتينول فقد استخدمت 0.5% مرتين يومياً، فاعتبريه إضافة ثابتة ضوئياً مرحّباً بها لا بديلاً عن ' +
  'الريتينويد. وستة ببتيدات من مواد Sederma وDSM وCorum موجودة بنحو 1.4 جزء من المليون مجتمعة. يحتوي زيت اللافندر ' +
  'مع اللينالول المعلن. مقيَّم وفق اللائحة EC 1223/2009 ومصنّف «غير مهيّج» في اختبار اللصقة.'

/** Transcribed from the DTS MG quantitative formula, descending by weight. */
const FULL_INCI =
  'Aqua (Water), Glycerin, 1,2-Hexanediol, Niacinamide, Caprylic/Capric Triglyceride, Cetyl Ethylhexanoate, ' +
  'Polyglyceryl-3 Methylglucose Distearate, Betaine, Hydroxyethyl Acrylate/Sodium Acryloyldimethyl Taurate ' +
  'Copolymer, Glyceryl Stearate, Bakuchiol, Allantoin, Panthenol, Xanthan Gum, Inulin Lauryl Carbamate, ' +
  'Ethylhexylglycerin, Adenosine, Butylene Glycol, Lavandula Angustifolia (Lavender) Oil, Sorbitan Isostearate, ' +
  'Linalool, Carbomer, Hesperidin Methyl Chalcone, Hydrogenated Lecithin, Propolis Extract, Polysorbate 20, ' +
  'Steareth-20, Hydrolyzed Elastin, Palmitoyl Tripeptide-5, Tocopherol, Ceramide NP, Cholesterol, ' +
  'Phytosphingosine, Hydrolyzed Collagen, Dipeptide-2, Palmitoyl Tripeptide-1, Palmitoyl Hexapeptide-12, ' +
  'Palmitoyl Tetrapeptide-7, Acetyl Hexapeptide-8'

const KEY_FEATURES = [
  {
    title: 'Glycerin 25.45%',
    description:
      'The second ingredient and a quarter of the bottle, sourced as a branded pharmaceutical grade. The certificate backs it: specific gravity 1.0689. This is what makes skin look plumper and lines shallower within minutes.',
  },
  {
    title: 'Niacinamide 2%, Measured',
    description:
      'Vitamin B3 at a genuinely useful level for uneven tone and barrier support, assayed on the batch at 96.72% of declaration rather than merely declared.',
  },
  {
    title: 'Adenosine 0.04%, Measured at 101%',
    description:
      'The exact dose Korea licenses for wrinkle improvement, and the only anti-wrinkle active in the formula with a regulatory threshold behind it.',
  },
  {
    title: 'Bakuchiol 0.1% — With the Context',
    description:
      'Photostable and gentle, so it works morning or night. Worth knowing the study behind the retinol comparison used 0.5% twice daily, five times this concentration.',
  },
]

const BENEFITS = [
  'Deep hydration - glycerin 25.45% with betaine, panthenol and allantoin',
  'Tone and barrier - niacinamide 2%, assayed at 96.72% of declaration',
  'Wrinkle improvement - adenosine 0.04%, the Korean licensed dose, assayed at 101%',
  'Morning or night - bakuchiol is photostable, unlike retinol',
  'Graded Non Irritant - a stronger patch-test result than a bare pass',
  'No acids, retinoids or exfoliants - it layers under anything',
]

/** Working doses first; the premium-but-trace materials named without claims. */
const ACTIVES = [
  {
    name: 'Glycerin 25.45%',
    description:
      'The largest ingredient after water and the reason this serum works at all. A quarter of the bottle is humectant, which in Gulf air is the difference between skin that holds water and skin that does not. Follow with a moisturiser so it has something to hold the water under.',
  },
  {
    name: 'Niacinamide 2.00%',
    description:
      'Vitamin B3 for uneven tone and barrier support, at a level that does something. Assayed on the batch at 96.72% of the declared 2%.',
  },
  {
    name: 'Adenosine 0.04%',
    description:
      'The dose Korea licenses for wrinkle improvement, assayed at 101.00% of declaration. The same figure appears in every functional anti-ageing product registered there.',
  },
  {
    name: 'Bakuchiol 0.100%',
    description:
      'Genuinely present, photostable, and well tolerated in a way retinol is not. The head-to-head-with-retinol study (Dhaliwal, British Journal of Dermatology 2019) used 0.5% twice daily, so this is one fifth of that concentration. A welcome extra rather than a retinoid replacement.',
  },
  {
    name: 'Betaine 0.50%, allantoin and panthenol 0.10% each',
    description:
      'The rest of the working formula. Betaine is a second humectant alongside the glycerin; allantoin and panthenol are there for comfort and barrier.',
  },
  {
    name: 'Six peptides, about 1.4 ppm combined',
    description:
      'From premium materials — Matrixyl 3000 (Sederma), Syn-Coll (DSM), Elastyl (Corum) and AH PEP 50 — each bought in at 0.1% of the formula. That gives palmitoyl tripeptide-5 at 1.1 ppm and the other five between 0.05 and 0.1 ppm. Good sourcing, very small amounts. Named because they are in the formula; nothing here rests on them.',
  },
  {
    name: 'The barrier and ECM layer, at trace',
    description:
      'Ceramide NP, cholesterol and phytosphingosine at 0.1 ppm each, hydrolyzed elastin at 1 ppm, hydrolyzed collagen at 0.1 ppm and propolis extract at 10 ppm.',
  },
  {
    name: 'Lavender oil 0.0186%, linalool 0.0114%',
    description:
      'It is scented, with a natural essential oil rather than a synthetic perfume. Linalool is listed separately because European law requires that allergen to be named. Patch test if you react to fragrance.',
  },
]

async function main() {
  const product = await prisma.product.findFirst({
    where: { OR: [{ productNumber: '22' }, { id: '22' }] },
  })
  if (!product) throw new Error('product 22 not found')

  const details = JSON.parse(product.productDetails || '{}') as Record<string, string>
  details.size = '30 ml'
  details.formulation =
    'Glycerin 25.45%, niacinamide 2.00%, betaine 0.50%, allantoin 0.10%, panthenol 0.10%, adenosine 0.04%, bakuchiol 0.100%'
  details.bakuchiol =
    '0.100% — the retinol-comparison study used 0.5% twice daily, so five times this concentration'
  details.peptides =
    'Six, roughly 1.4 ppm combined, from Matrixyl 3000, Syn-Coll, Elastyl and AH PEP 50 materials'
  details.fragrance = 'Yes — lavender oil 0.0186%, with linalool declared at 0.0114%'
  details.ph = '5.60–7.60 (6.78 on the batch tested)'
  details.assessment = 'EU safety assessment under EC Regulation 1223/2009; patch test graded Non Irritant'
  details.usage = 'Morning and evening, onto damp skin, followed by a moisturiser'
  details.keyBenefits = 'Hydration, tone and barrier, wrinkle improvement'
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

  console.log('Product 22 updated:')
  console.log('  glycerin   -> 25.45% now the headline; it was mentioned nowhere')
  console.log('  bakuchiol  -> 0.100% stated with the study\'s 0.5% for context')
  console.log('  peptides   -> named with suppliers and real ppm, no mechanisms')
  console.log('  fragrance  -> lavender oil and linalool now disclosed')
  console.log('  dropped    -> the P&K clinical study, which we do not hold')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
