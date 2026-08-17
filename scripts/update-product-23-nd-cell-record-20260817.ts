/**
 * Product 23 — ND Cell ANTI-WRINKLE CREAM (neck and décolleté).
 *
 * Aligns the record with the source audit in
 * docs/SESSION_CHANGES_2026-08-17_PRODUCT_23_ND_CELL_SOURCE_AUDIT.md.
 * This is the largest correction set of the range so far.
 *
 * 1. IT CONTAINS PEANUT OIL AND WE SAID NOTHING. Arachis Hypogaea (Peanut) Oil at
 *    0.0087%, arriving as the carrier for the retinyl palmitate. The safety
 *    assessment handles it under Annex III/306 with under 0.5 ppm peanut protein,
 *    citing SCCS/1526/14. Our sibling product 24 (EyeCell) already declares
 *    "Contains peanut oil" on the site; this product, applied over a far larger
 *    area, declared nothing. Now disclosed in the description and in details.
 * 2. THE DEPIGMENTATION CLAIM CONTRADICTED THE LICENCE. The record said it "has
 *    an excellent effect of depigmentation". The Korean carton licenses this as a
 *    SINGLE-function wrinkle-improvement cosmetic with adenosine as the main
 *    ingredient. There is no whitening function, and the only brightening-adjacent
 *    ingredient is ascorbyl glucoside at 0.025%, roughly an eightieth of the
 *    concentration used in efficacy work. Removed.
 * 3. THE CLAIMED EFFICACY TEST DOES NOT EXIST. "Efficacy test on improving
 *    wrinkles" — no report on the drive, and the valid safety assessment states
 *    unprompted that "the phrases 'Anti-Wrinkle' need further documentation in
 *    order to be proven" under Regulation (EU) 655/2013. Removed. What replaces
 *    it is the defensible fact: Korea licenses wrinkle improvement via adenosine
 *    at 0.04%, assayed at 92.60% on the batch.
 * 4. FIVE PEPTIDES WERE LISTED AS EQUALS. Copper tripeptide-1 is 50 ppm and the
 *    other four run 1 ppm down to 0.01 ppm — copper tripeptide alone is 97% of
 *    the ~51.5 ppm total. Reframed.
 * 5. THE "VITAMIN COMPLEX" IS TWO REAL AND TWO TOKEN. Vitamin E at 1.000% and B5
 *    at 0.300% are working doses; vitamin C at 0.025% and vitamin A at 0.0111%
 *    are not. Stated.
 * 6. SQUALANE AT 5% IS THE ACTUAL STAR and was buried at the end of the old
 *    ingredient list. It now leads, along with the fact that glycerin is only
 *    0.700%, which makes this an occlusive cream rather than a hydrating one.
 * 7. THE INGREDIENTS FIELD WAS EMPTY. Added the full INCI, transcribed from the
 *    current signed formula rather than the carton, because the carton list is out
 *    of date (it carries five ingredients no longer in the formula, including a
 *    sixth peptide, and omits tocopherol and linalool).
 * 8. LAVENDER OIL AND LINALOOL WERE UNDISCLOSED, and linalool at 0.0235% is 23x
 *    the declaration threshold while being absent from the printed carton INCI.
 *
 * Run: npx tsx --env-file=.env.local scripts/update-product-23-nd-cell-record-20260817.ts
 */

import { prisma } from '../lib/prisma'

const DESCRIPTION_EN =
  'A sealing cream for neck and décolleté. Squalane at 5% leads, over dimethicone at 3%, vitamin E at a full 1% and ' +
  'panthenol at 0.3%, with adenosine at 0.04% — the dose Korea licenses for wrinkle improvement, and the only active ' +
  'assayed on the certificate, at 92.60% of declaration. Glycerin is only 0.7%, so this is occlusive rather than ' +
  'hydrating: it holds moisture in thin neck and chest skin rather than drawing water in. CONTAINS PEANUT OIL ' +
  '(Arachis Hypogaea, 0.0087%), present as the carrier for the vitamin A and held below 0.5 ppm peanut protein — do ' +
  'not use if you have a peanut allergy. Also contains lavender oil 0.0265% with linalool 0.0235% declared. Of the ' +
  'five peptides, copper tripeptide-1 at 50 ppm is 97% of the total peptide load; the other four run from 1 ppm down ' +
  'to 0.01 ppm. Korean single-function licence: wrinkle improvement only. Assessed under EC Regulation 1223/2009 and ' +
  'graded Non Irritant on patch test. Do not use near the eyes.'

const DESCRIPTION_RU =
  'Запечатывающий крем для шеи и декольте. Ведёт сквалан 5%, поверх диметикона 3%, витамина E в полный 1% и ' +
  'пантенола 0,3%, с аденозином 0,04% — дозой, под которую Корея лицензирует уменьшение морщин, и единственным ' +
  'активом, измеряемым в сертификате: 92,60% от заявленного. Глицерина всего 0,7%, поэтому крем окклюзивный, а не ' +
  'увлажняющий: он удерживает влагу в тонкой коже шеи и груди, а не притягивает воду. СОДЕРЖИТ АРАХИСОВОЕ МАСЛО ' +
  '(Arachis Hypogaea, 0,0087%) — оно присутствует как носитель витамина A и держится ниже 0,5 ppm арахисового ' +
  'белка; не используйте при аллергии на арахис. Также содержит лавандовое масло 0,0265% с заявленным линалоолом ' +
  '0,0235%. Из пяти пептидов copper tripeptide-1 на 50 ppm составляет 97% всей пептидной загрузки; остальные четыре ' +
  'идут от 1 ppm до 0,01 ppm. Корейская лицензия одинарного действия: только уменьшение морщин. Оценено по ' +
  'регламенту EC 1223/2009, патч-тест — «не раздражает». Не наносить рядом с глазами.'

const DESCRIPTION_AR =
  'كريم عازل للرقبة والصدر. يتقدّمه السكوالان بنسبة 5%، فوق دايميثيكون بنسبة 3%، وفيتامين E بنسبة 1% كاملة، ' +
  'وبانثينول بنسبة 0.3%، مع أدينوزين بنسبة 0.04% — وهي الجرعة التي ترخّصها كوريا لتحسين التجاعيد، والفعّال الوحيد ' +
  'المقيس على الشهادة، عند 92.60% من المعلن. أما الغليسرين فبنسبة 0.7% فقط، فالكريم عازل لا مرطّب: يحفظ الرطوبة ' +
  'في بشرة الرقبة والصدر الرقيقة لا يجذب الماء إليها. يحتوي زيت الفول السوداني (Arachis Hypogaea، 0.0087%)، ' +
  'وهو موجود كحامل لفيتامين A ويُحفظ تحت 0.5 جزء من المليون من بروتين الفول السوداني — لا يُستخدم إن كانت لديك ' +
  'حساسية من الفول السوداني. ويحتوي أيضاً زيت اللافندر بنسبة 0.0265% مع لينالول معلن بنسبة 0.0235%. ومن الببتيدات ' +
  'الخمسة، يمثّل الكوبر ترايببتايد-1 عند 50 جزءاً من المليون 97% من إجمالي حمل الببتيد؛ أما الأربعة الأخرى فتتراوح ' +
  'من جزء واحد من المليون إلى 0.01. ترخيص كوري مفرد الوظيفة: تحسين التجاعيد فقط. مقيَّم وفق اللائحة EC 1223/2009 ' +
  'ومصنّف «غير مهيّج» في اختبار اللصقة. لا يُستخدم قرب العينين.'

/**
 * Transcribed from the current signed DTS MG formula, descending by weight.
 * NOT from the carton: the printed list still carries Hydrolyzed Hibiscus
 * Esculentus Extract, Dextrin, Palmitoyl Oligopeptide, Sodium Polystyrene
 * Sulfonate and Sorghum Bicolor Stalk Juice, none of which are in the current
 * formula, and omits Tocopherol and Linalool, both of which are.
 */
const FULL_INCI =
  'Aqua (Water), Squalane, Dimethicone, 1,2-Hexanediol, Butylene Glycol, Phenyl Trimethicone, Tocopheryl Acetate, ' +
  'Cetearyl Olivate, Polyacrylate-13, Glycerin, Sorbitan Olivate, Simmondsia Chinensis (Jojoba) Seed Oil, Silica, ' +
  'Sorbitan Stearate, Cetearyl Alcohol, Polyisobutene, Panthenol, Ethylhexylglycerin, Xanthan Gum, Allantoin, ' +
  'Hydrogenated Lecithin, Butyrospermum Parkii (Shea) Butter, Polysorbate 20, Sorbitan Isostearate, Adenosine, ' +
  'PEG-40 Hydrogenated Castor Oil, Lavandula Angustifolia (Lavender) Oil, Ascorbyl Glucoside, Arginine, Linalool, ' +
  'Ceramide NP, PPG-26-Buteth-26, Caprylyl Glycol, Retinyl Palmitate, Arachis Hypogaea (Peanut) Oil, Copper ' +
  'Tripeptide-1, Beta-Glucan, Helianthus Annuus (Sunflower) Seed Oil, Sodium Hyaluronate, Tocopherol, Palmitoyl ' +
  'Hexapeptide-12, Lecithin, Acetyl Hexapeptide-8, Palmitoyl Tripeptide-1, Sodium Phosphate, Sodium Chloride, ' +
  'Scutellaria Baicalensis Root Extract, Citrus Junos Fruit Extract, Camellia Sinensis Leaf Extract, Houttuynia ' +
  'Cordata Extract, Artemisia Princeps Extract, Artemisia Vulgaris Extract, Glycine, Disodium EDTA, Chamaecyparis ' +
  'Obtusa Water, Lactobacillus Ferment Lysate Filtrate, Lysine, sh-Polypeptide-7'

const KEY_FEATURES = [
  {
    title: 'Squalane 5%',
    description:
      'The largest ingredient after water and the one carrying this cream. A lipid skin already recognises, stable and non-greasy, which is why the texture suits a neck rather than a face.',
  },
  {
    title: 'Vitamin E 1% and B5 0.3%',
    description:
      'Two of the four claimed vitamins are at genuine working doses. The vitamin C at 0.025% and vitamin A at 0.0111% are not, and we say so.',
  },
  {
    title: 'Adenosine 0.04%, Measured at 92.60%',
    description:
      'The dose Korea licenses for wrinkle improvement, and the only active the certificate assays. Korea licenses this product for wrinkles only.',
  },
  {
    title: 'Contains Peanut Oil and Lavender Oil',
    description:
      'Arachis Hypogaea seed oil at 0.0087%, present as the carrier for the vitamin A and held below 0.5 ppm peanut protein. Do not use if you have a peanut allergy. Lavender oil 0.0265% with linalool 0.0235%.',
  },
]

const BENEFITS = [
  'Built for neck and decollete - thinner skin with fewer oil glands',
  'Seals rather than hydrates - 0.7% glycerin against ~15% oils, silicones and squalane',
  'Squalane 5% - a lipid the skin recognises, stable and non-greasy',
  'Vitamin E at a full 1% and panthenol at 0.3%, both real working doses',
  'Wrinkle improvement - adenosine 0.04%, assayed at 92.60% of declaration',
  'Graded Non Irritant - a stronger patch-test result than a bare pass',
  'Four pathogens screened on the batch, all not detected',
]

/** Working doses first; the trace layer named without mechanisms. */
const ACTIVES = [
  {
    name: 'Squalane 5.000%',
    description:
      'The single largest ingredient after water. A lipid the skin already recognises, stable and non-greasy, and the reason the texture suits neck and chest skin.',
  },
  {
    name: 'Dimethicone 3.000% and phenyl trimethicone 1.000%',
    description:
      'The occlusive layer and the slip. Together with the squalane this is where most of the product\u2019s work happens: reducing what evaporates from skin with little oil of its own.',
  },
  {
    name: 'Tocopheryl acetate (vitamin E) 1.000%',
    description: 'A genuinely strong antioxidant dose, not a token one. It earns its place in the vitamin claim.',
  },
  {
    name: 'Panthenol (vitamin B5) 0.300% and allantoin 0.200%',
    description: 'Real working doses for comfort and barrier support.',
  },
  {
    name: 'Adenosine 0.040%',
    description:
      'The dose Korea licenses for wrinkle improvement, and the basis of the single-function licence. Assayed on the batch at 92.60% of declaration — the only active the certificate measures.',
  },
  {
    name: 'Glycerin 0.700%',
    description:
      'Deliberately low. This is an occlusive cream, not a hydrating one: it holds moisture in rather than drawing water into skin. For comparison, our Anti-Wrinkle Serum is 25.45% glycerin and the Multi Functional Cream is 8%.',
  },
  {
    name: 'Ceramide NP 0.020% and jojoba seed oil 0.500%',
    description:
      'The ceramide is modest at 200 ppm, though about two thousand times the level in our Multi Functional Cream. Jojoba rounds out the lipid phase alongside shea butter at 0.100%.',
  },
  {
    name: 'Ascorbyl glucoside 0.025% and retinyl palmitate 0.0111%',
    description:
      'The other two of the four claimed vitamins, and both are low. The vitamin C is roughly an eightieth of the concentration used in efficacy work. The vitamin A is the gentlest and weakest retinoid ester; an earlier formula carried 0.02% and the safety assessor capped body products at 0.025%, so it was reduced.',
  },
  {
    name: 'Five peptides, ~51.5 ppm in total',
    description:
      'Copper tripeptide-1 at 0.005% (50 ppm) is 97% of the peptide load and the only one present in a meaningful amount. Palmitoyl hexapeptide-12 is at 1 ppm, acetyl hexapeptide-8 at 0.25 ppm, palmitoyl tripeptide-1 at 0.2 ppm and sh-polypeptide-7 at 0.01 ppm. Named because they are in the formula; nothing rests on the last four.',
  },
  {
    name: 'Arachis Hypogaea (peanut) oil 0.0087%',
    description:
      'Present as the carrier the vitamin A arrives in. The refined oil is held below 0.5 parts per million of peanut protein under Annex III/306, which is the basis on which it may be used. Do not use this product if you have a peanut allergy.',
  },
  {
    name: 'Lavender oil 0.0265% and linalool 0.0235%',
    description:
      'It is scented with essential oil rather than synthetic perfume. European law requires linalool to be declared above 0.001%; this is twenty-three times that, and the printed carton list does not name it, so we do.',
  },
  {
    name: 'Sodium hyaluronate 0.001% and eight botanical extracts at 10-30 ppb',
    description:
      'The "hyaluronic acid" in older copy is 10 ppm. The botanicals — Scutellaria, Citrus junos, Camellia sinensis, Chamaecyparis obtusa, Houttuynia cordata and two Artemisia species — are at parts per billion. Listed for completeness only.',
  },
]

async function main() {
  const product = await prisma.product.findFirst({
    where: { OR: [{ productNumber: '23' }, { id: '23' }] },
  })
  if (!product) throw new Error('product 23 not found')

  const details = JSON.parse(product.productDetails || '{}') as Record<string, string>
  details.size = '50 g'
  details.appliedTo = 'Neck and décolleté. Do not use near the eyes'
  details.formulation =
    'Squalane 5.00%, dimethicone 3.00%, vitamin E 1.00%, phenyl trimethicone 1.00%, jojoba 0.500%, panthenol 0.300%, allantoin 0.200%, adenosine 0.040%, ceramide NP 0.020%'
  details.glycerin = '0.700% — occlusive rather than hydrating (the serum is 25.45%, the MFC cream 8%)'
  details.peptides =
    'Five, ~51.5 ppm total. Copper tripeptide-1 at 50 ppm is 97% of it; the other four run 1 ppm to 0.01 ppm'
  details.vitamins =
    'E 1.000% and B5 0.300% at working doses; C 0.025% and A 0.0111% are token'
  details.allergens =
    'CONTAINS PEANUT OIL (Arachis Hypogaea 0.0087%, under 0.5 ppm peanut protein). Also linalool 0.0235%'
  details.fragrance = 'Yes — lavender oil 0.0265%. No synthetic perfume'
  details.ph = '6.00 ± 1.00 (6.32 on the batch tested)'
  details.specificGravity = '0.981 — lighter than water, from the oil and silicone load'
  details.licence = 'Korean single-function: wrinkle improvement only, via adenosine. No whitening licence'
  details.assessment = 'EU safety assessment under EC Regulation 1223/2009; patch test graded Non Irritant'
  details.usage = 'Twice daily, upward from collarbone to jaw and out across the chest. Sunscreen over it by day'
  details.keyBenefits = 'Moisture retention on thin skin, wrinkle improvement'
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

  console.log('Product 23 updated:')
  console.log('  peanut      -> DISCLOSED; sibling 24 already did, this did not')
  console.log('  depigment   -> REMOVED; Korea licenses wrinkle only, no brightening active at dose')
  console.log('  efficacy    -> REMOVED; no report, and the assessor flagged the anti-wrinkle phrasing')
  console.log('  squalane    -> 5% now leads instead of sitting at the end of a list')
  console.log('  peptides    -> copper tripeptide is 97% of ~51.5 ppm; the other four named honestly')
  console.log('  vitamins    -> E and B5 real, C and A token, marked as such')
  console.log('  glycerin    -> 0.700% stated; this seals rather than hydrates')
  console.log('  INCI        -> added from the signed formula, not the out-of-date carton')
  console.log('  linalool    -> disclosed; the printed carton omits it')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
