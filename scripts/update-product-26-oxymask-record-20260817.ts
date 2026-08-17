/**
 * Product 26 — EGF REPAIR OXYMASK CREAM.
 *
 * Aligns the record with the source audit in
 * docs/SESSION_CHANGES_2026-08-17_PRODUCT_26_OXYMASK_SOURCE_AUDIT.md.
 *
 * 1. NEITHER INGREDIENT THAT MAKES THIS PRODUCT WORK WAS ON THE RECORD.
 *    Methyl perfluoroisobutyl ether at 5.000% is the second ingredient after
 *    water and is what carries and releases the oxygen. Decyl glucoside at
 *    2.750% is what lets it foam at all. Our six "key ingredients" included
 *    neither. Both now lead.
 * 2. THE USAGE INSTRUCTIONS WERE MISSING ENTIRELY, and on a product whose whole
 *    mechanism is a foaming reaction they are functional information: apply to
 *    DRY skin, do NOT rub, 3-5 pumps, and do NOT rinse off. All on the carton.
 * 3. THE CARTON DECLARES THE EGF DOSE ITSELF. The Korean panel prints
 *    "에스에이치-올리고펩타이드-1 (0.1ppm)". No other GENOSYS carton audited this
 *    week states a concentration inside the ingredient list. The record now
 *    repeats the manufacturer's own figure.
 * 4. THE OTHER NAMED INGREDIENTS ARE TRACE: madecassoside 1 ppm (200x lower than
 *    the centella in product 25), copper tripeptide-1 0.05 ppm (1,000x lower than
 *    in product 23), Sepitonic M3 minerals ~10 ppm combined, salmon oil 100 ppm.
 *    Only adenosine at 0.040% is a working dose, and it is the licensed one.
 * 5. SALMON OIL WAS UNDISCLOSED as animal- and fish-derived. It makes the product
 *    non-vegan.
 * 6. THE CARTON SAYS AVOID PREGNANCY AND LACTATION and our record said nothing.
 *    Also do not use near the eyes, and avoid broken skin.
 * 7. EUCALYPTUS OIL 0.0184% WITH LIMONENE 0.0016% was undisclosed. There is no
 *    perfume compound, but the cream smells distinctly of eucalyptus.
 * 8. THE CLAIMED EFFICACY TEST IS REAL BUT UNQUANTIFIED. The Intertek assessment
 *    records "Other Tests: None presented", but the DTS MG deck carries a page
 *    titled "Clinical study on skin soothing effect against external stimulus
 *    (physical stimulus)" for this product. Unlike the deck's other products it
 *    shows no readable figure, so the record references the study and states that
 *    no result is held.
 * 9. THE INGREDIENTS FIELD WAS EMPTY. Added the full INCI from the carton.
 *
 * Run: npx tsx --env-file=.env.local scripts/update-product-26-oxymask-record-20260817.ts
 */

import { prisma } from '../lib/prisma'

const DESCRIPTION_EN =
  'A cream that foams on contact with skin. The bubbling comes from methyl perfluoroisobutyl ether at 5.000%, the ' +
  'second ingredient after water — a perfluorocarbon that holds and releases far more oxygen than water can — ' +
  'together with decyl glucoside at 2.750%, a mild sugar surfactant that turns the released gas into foam. Around ' +
  '10% humectants (glycerin, diglycerin, dipropylene glycol) with shea butter and jojoba oil at 1.000% each keep it ' +
  'comfortable. Adenosine at 0.040% is the licensed Korean wrinkle-improvement dose, measured on the batch at ' +
  '0.043% alongside a separate identity check. APPLY TO DRY SKIN, DO NOT RUB, and DO NOT RINSE OFF: three to five ' +
  'pumps, spread evenly, wait for the bubbles, then massage and tap in. The EGF the product is named for — ' +
  'sh-Oligopeptide-1 — is present at 0.1 ppm, and the carton prints that figure itself. Madecassoside is at 1 ppm, ' +
  'copper tripeptide-1 at 0.05 ppm and the Sepitonic M3 minerals at about 10 ppm combined. CONTAINS SALMON OIL ' +
  '(100 ppm), so NOT VEGAN. Contains eucalyptus oil 0.0184% with limonene declared. Not for use during pregnancy or ' +
  'breastfeeding, near the eyes, or on broken skin. Assessed as safe for human health under EC Regulation ' +
  '1223/2009 and graded Non Irritant on patch test.'

const DESCRIPTION_RU =
  'Крем, который вспенивается при контакте с кожей. Пузырьки создаёт метил перфторизобутиловый эфир 5,000% — второй ' +
  'ингредиент после воды, перфторуглерод, удерживающий и отдающий гораздо больше кислорода, чем вода, — вместе с ' +
  'decyl glucoside 2,750%, мягким сахарным сурфактантом, превращающим выделяющийся газ в пену. Около 10% ' +
  'увлажнителей (глицерин, диглицерин, дипропиленгликоль) с маслом ши и жожоба по 1,000% сохраняют комфорт. ' +
  'Аденозин 0,040% — лицензионная корейская доза для уменьшения морщин, измеренная в партии как 0,043% вместе с ' +
  'отдельной проверкой идентичности. НАНОСИТЬ НА СУХУЮ КОЖУ, НЕ РАСТИРАТЬ и НЕ СМЫВАТЬ: три–пять нажатий, ' +
  'распределить ровно, дождаться пузырьков, затем помассировать и вбить. EGF, по которому назван продукт, — ' +
  'sh-Oligopeptide-1 — присутствует в концентрации 0,1 ppm, и коробка сама печатает эту цифру. Мадекассосид — ' +
  '1 ppm, copper tripeptide-1 — 0,05 ppm, минералы Sepitonic M3 — около 10 ppm суммарно. СОДЕРЖИТ МАСЛО ЛОСОСЯ ' +
  '(100 ppm), поэтому НЕ ВЕГАНСКИЙ. Содержит масло эвкалипта 0,0184% с заявленным лимоненом. Не применять при ' +
  'беременности и кормлении, рядом с глазами и на повреждённой коже. Оценено как безопасное для здоровья человека ' +
  'по регламенту EC 1223/2009, патч-тест — «не раздражает».'

const DESCRIPTION_AR =
  'كريم يرتغي عند ملامسة البشرة. والفقاعات تأتي من ميثيل بيرفلورو أيزوبيوتيل إيثر بنسبة 5.000%، وهو المكوّن الثاني ' +
  'بعد الماء — مركّب فلوري يحمل ويطلق أوكسجيناً أكثر بكثير مما يستطيع الماء — إلى جانب دايسيل غلوكوسايد بنسبة ' +
  '2.750%، وهو خافض توتر سطحي سكري لطيف يحوّل الغاز المُطلَق إلى رغوة. ونحو 10% مرطّبات جاذبة (غليسرين ودايغليسرين ' +
  'ودايبروبيلين غلايكول) مع زبدة الشيا وزيت الجوجوبا بنسبة 1.000% لكل منهما تحفظ الراحة. والأدينوزين بنسبة 0.040% ' +
  'هو الجرعة الكورية المرخّصة لتحسين التجاعيد، مقيسة على الدفعة عند 0.043% مع فحص هوية منفصل. يُطبَّق على بشرة ' +
  'جافة، ولا يُفرك، ولا يُشطَف: ثلاث إلى خمس ضغطات، افرديه بالتساوي، انتظري الفقاعات، ثم دلّكي وانقري لإدخاله. أما ' +
  'عامل النمو الذي سُمّي المنتج به — sh-Oligopeptide-1 — فموجود بنسبة 0.1 جزء من المليون، والعلبة تطبع ذلك الرقم ' +
  'بنفسها. والمادِكاسوسايد عند جزء واحد من المليون، والكوبر ترايببتايد-1 عند 0.05، ومعادن Sepitonic M3 عند نحو 10 ' +
  'أجزاء من المليون مجتمعةً. يحتوي زيت السلمون (100 جزء من المليون)، فهو ليس نباتياً. ويحتوي زيت اليوكاليبتوس بنسبة ' +
  '0.0184% مع ليمونين معلن. لا يُستخدم أثناء الحمل أو الإرضاع، ولا قرب العينين، ولا على بشرة مجروحة. مقيَّم آمناً ' +
  'لصحة الإنسان وفق اللائحة EC 1223/2009 ومصنّف «غير مهيّج» في اختبار اللصقة.'

/** From the registered carton, which matches the signed formula order. */
const FULL_INCI =
  'Aqua (Water), Methyl Perfluoroisobutyl Ether, Glycerin, Diglycerin, Dipropylene Glycol, Decyl Glucoside, ' +
  '1,2-Hexanediol, Hydrogenated Polyisobutene, C14-22 Alcohols, Butyrospermum Parkii (Shea) Butter, Simmondsia ' +
  'Chinensis (Jojoba) Seed Oil, Adenosine, Sodium Hyaluronate, sh-Oligopeptide-1, Copper Tripeptide-1, Zinc ' +
  'Gluconate, Salmon Oil, Madecassoside, Allantoin, Hydroxyethylcellulose, Glucose, Magnesium Aspartate, Copper ' +
  'Gluconate, Glyceryl Stearate, Erythritol, Carbomer, C12-20 Alkyl Glucoside, Sodium Acrylate/Sodium ' +
  'Acryloyldimethyl Taurate Copolymer, Potassium Hydroxide, Isohexadecane, Tocopheryl Acetate, Polysorbate 60, ' +
  'Polysorbate 80, Disodium EDTA, Sorbitan Oleate, Pentylene Glycol, Ethylhexylglycerin, Phenoxyethanol, Propylene ' +
  'Glycol, Tripropylene Glycol, Disodium Phosphate, Sodium Phosphate, Eucalyptus Globulus Leaf Oil, Limonene'

const KEY_FEATURES = [
  {
    title: 'The Bubbles Are a Perfluorocarbon at 5%',
    description:
      'Methyl perfluoroisobutyl ether, the second ingredient after water, holds and releases far more oxygen than water can. With decyl glucoside at 2.750% turning that gas into foam, these two are what the product actually is.',
  },
  {
    title: 'Dry Skin, No Rubbing, No Rinsing',
    description:
      'Three to five pumps onto dry skin, spread evenly, do not rub. Wait for the bubbles, then massage and tap in and leave it. Applying to damp skin or rubbing it in stops it working.',
  },
  {
    title: 'Adenosine 0.040%, Measured at 0.043%',
    description:
      'The licensed Korean wrinkle-improvement dose and the only working active in the formula, verified on the batch by both an assay and a separate identity check against a reference chromatogram.',
  },
  {
    title: 'The Carton Prints the EGF Dose Itself',
    description:
      'The Korean ingredient list reads "sh-Oligopeptide-1 (0.1ppm)". The manufacturer states the trace concentration on the pack, which is more transparent than most brands manage.',
  },
]

const BENEFITS = [
  'Foams on the skin - a perfluorocarbon at 5% releasing oxygen',
  'Wrinkle improvement - adenosine 0.040%, assayed at 0.043%',
  'Comfortable despite the surfactant - ~10% humectants plus shea and jojoba at 1% each',
  'Leave-on, not a rinse-off mask',
  'Graded Non Irritant, and assessed safe with no restrictions attached',
  'The trace doses are disclosed, including on the carton itself',
]

/** Ordered by concentration. */
const ACTIVES = [
  {
    name: 'Methyl perfluoroisobutyl ether 5.000%',
    description:
      'The second ingredient after water and the largest active by a wide margin. A perfluorocarbon, from the family of fluids that dissolve and release far more oxygen than water. This is the oxygen in "oxymask" and the reason the cream bubbles on skin.',
  },
  {
    name: 'Decyl glucoside 2.750%',
    description:
      'A mild surfactant from coconut and corn sugar. Without a surfactant nothing foams, so this is what turns the released gas into a blanket of bubbles. It also explains why the texture behaves unlike any other cream in the range.',
  },
  {
    name: 'Glycerin 3.996%, diglycerin 3.000%, dipropylene glycol 2.998%',
    description:
      'Roughly 10% humectants, which is why a formula carrying 2.750% surfactant still leaves skin comfortable rather than tight.',
  },
  {
    name: 'Shea butter and jojoba seed oil, 1.000% each',
    description: 'The lipid half. Modest, real, and enough to keep the surfactant from feeling stripping.',
  },
  {
    name: 'Adenosine 0.040%',
    description:
      'The dose Korea licenses for wrinkle improvement, and the basis of the single-function licence. Assayed on the batch at 0.043%, with a separate identity check against a reference chromatogram.',
  },
  {
    name: 'Tocopheryl acetate 0.100%, sodium hyaluronate 0.050%, allantoin 0.050%',
    description: '1,000, 500 and 500 parts per million. Supporting rather than headline.',
  },
  {
    name: 'Eucalyptus globulus leaf oil 0.0184%, limonene 0.0016%',
    description:
      'There is no perfume compound in the formula, but the eucalyptus oil gives it a distinct smell and the limonene is declared because European law requires it above 0.001%. Another reason the carton says not to use it near the eyes.',
  },
  {
    name: 'Salmon oil 0.0100%',
    description:
      '100 parts per million, and enough to make the product non-vegan. Not suitable if you avoid fish-derived ingredients.',
  },
  {
    name: 'Sepitonic M3 minerals, ~0.001% combined',
    description:
      'Magnesium aspartate and zinc gluconate at 4.75 ppm each and copper gluconate at 0.5 ppm, supplied as one complex. The phenoxyethanol on the ingredient list is a 1 ppm carryover from this premix, not an added preservative — the formula is preserved by 1,2-hexanediol at 2.020% with ethylhexylglycerin.',
  },
  {
    name: 'Madecassoside 0.0001% and copper tripeptide-1 0.0000050%',
    description:
      '1 ppm and 0.05 ppm. For scale, that madecassoside is two hundred times lower than the centella triterpenes in our Soothing Repair Postcream, and the copper tripeptide is a thousand times lower than in ND Cell.',
  },
  {
    name: 'sh-Oligopeptide-1 (EGF) 0.0000100%',
    description:
      '0.1 parts per million — and the Korean panel of the carton prints that figure beside the ingredient name. The product is named after it; it is not what the product does.',
  },
]

async function main() {
  const product = await prisma.product.findFirst({
    where: { OR: [{ productNumber: '26' }, { id: '26' }] },
  })
  if (!product) throw new Error('product 26 not found')

  const details = JSON.parse(product.productDetails || '{}') as Record<string, string>
  details.size = '50 g, pump'
  details.texture = 'White cream that foams on contact with skin'
  details.howToApply =
    'Three to five pumps onto DRY skin. Spread evenly, do NOT rub. Wait for the bubbles, then massage and tap in. Do NOT rinse off. Morning and evening'
  details.theOxygen = 'Methyl perfluoroisobutyl ether 5.000% — a perfluorocarbon, the second ingredient after water'
  details.theFoam = 'Decyl glucoside 2.750% — a mild sugar surfactant'
  details.licensedActive = 'Adenosine 0.040%, assayed at 0.043% with a separate identity check'
  details.egf = 'sh-Oligopeptide-1 at 0.1 ppm — the carton prints this figure itself'
  details.traceIngredients =
    'Madecassoside 1 ppm, copper tripeptide-1 0.05 ppm, Sepitonic M3 minerals ~10 ppm, salmon oil 100 ppm'
  details.vegan = 'No — contains salmon oil'
  details.fragrance = 'No perfume compound, but eucalyptus oil 0.0184% with limonene 0.0016% declared'
  details.preservative =
    '1,2-hexanediol 2.020% with ethylhexylglycerin. The 1 ppm phenoxyethanol is a carryover from Sepitonic M3'
  details.notFor = 'Pregnancy or breastfeeding, the eye area, or broken skin'
  details.ph = '5.10–7.10 (6.18 on the batch tested)'
  details.licence = 'Korean single-function: wrinkle improvement, via adenosine'
  details.clinical =
    'The manufacturer records a "Clinical study on skin soothing effect against external stimulus (physical stimulus)"; no result figure is held and the report has been requested'
  details.assessment =
    'EU safety assessment under EC Regulation 1223/2009: safe for human health, no restrictions attached; patch test graded Non Irritant'
  details.keyBenefits = 'Foaming oxygen delivery and wrinkle improvement'
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

  console.log('Product 26 updated:')
  console.log('  ADDED   -> the perfluorocarbon 5% and decyl glucoside 2.75%, the actual engine')
  console.log('  ADDED   -> the usage rules: dry skin, do not rub, 3-5 pumps, do not rinse')
  console.log('  ADDED   -> the EGF at 0.1 ppm, matching the figure the carton prints itself')
  console.log('  DEMOTED -> madecassoside 1 ppm, copper tripeptide 0.05 ppm, Sepitonic ~10 ppm')
  console.log('  ADDED   -> salmon oil disclosed; product is not vegan')
  console.log('  ADDED   -> pregnancy and lactation avoidance, eye area, broken skin')
  console.log('  ADDED   -> eucalyptus oil and limonene; phenoxyethanol explained as a carryover')
  console.log('  QUALIFIED -> the soothing study is referenced with no figure claimed')
  console.log('  ADDED   -> full INCI, which was empty')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
