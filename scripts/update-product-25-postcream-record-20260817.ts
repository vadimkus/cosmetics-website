/**
 * Product 25 — SOOTHING REPAIR POSTCREAM.
 *
 * Aligns the record with the source audit in
 * docs/SESSION_CHANGES_2026-08-17_PRODUCT_25_POSTCREAM_SOURCE_AUDIT.md.
 *
 * This is a RE-ATTRIBUTION, not a debunking. The soothing claim holds up well; it
 * was simply credited to the wrong ingredients.
 *
 * 1. THE KEY-INGREDIENT LIST WAS IN ALMOST EXACTLY INVERSE ORDER OF CONCENTRATION.
 *    It read: sh-Polypeptide-7, Centella Complex, Dipotassium Glycyrrhizate,
 *    Panthenol, grape callus, rosa damascena callus, Scutellaria. Actual doses:
 *    sh-polypeptide-7 0.000001% (10 PARTS PER BILLION) led the list, while the two
 *    ingredients genuinely at anti-irritant doses — dipotassium glycyrrhizate
 *    0.200% and scutellaria 0.200% — sat at positions 3 and 7. Reordered.
 * 2. THE 18.4% HUMECTANT LOAD WAS NOT MENTIONED AT ALL. Butylene glycol 12.000%
 *    plus glycerin 6.390% is the largest functional component of the product and
 *    the most useful thing on freshly treated skin. It now leads.
 * 3. THE CLAIMED EFFICACY TEST DOES NOT EXIST. "Efficacy test on protection of the
 *    skin against damage induced by physical stimuli" — no report anywhere on the
 *    drive, and the string "physical stimuli" does not appear in the 42-page
 *    safety assessment. Removed.
 * 4. "REGENERATING CREAM … PROMOTES HEALTHY REJUVENATION" overstates the licence.
 *    The registered carton function is the single word "Soothing", there is no
 *    Korean functional licence, and neither COA carries an ingredient assay
 *    because there is no functional active to measure. Replaced with the
 *    manufacturer's own registered claim: helps fast skin recovery after
 *    professional treatment.
 * 5. THE CARTON SAYS TO AVOID BROKEN SKIN and our copy invited the opposite
 *    reading with "after the dermatological operations". Korean precaution 2:
 *    상처가 있는 부위 등에는 사용을 자제할 것. Now stated prominently.
 * 6. PERIOD AFTER OPENING IS 6 MONTHS (the 6M symbol is on the carton) and was
 *    nowhere on our site. Material for a 100 g tube used across many clients.
 * 7. BEESWAX 0.500% was undisclosed, so the product is not vegan.
 * 8. LAVENDER OIL AND LINALOOL were undisclosed. The assessment additionally had
 *    the finished cream analysed, measuring linalool at 0.0032%.
 * 9. THE INGREDIENTS FIELD WAS EMPTY. Added the full INCI.
 *
 * Run: npx tsx --env-file=.env.local scripts/update-product-25-postcream-record-20260817.ts
 */

import { prisma } from '../lib/prisma'

const DESCRIPTION_EN =
  'The cream a practitioner hands you after a treatment. Nearly a fifth of it is humectant — butylene glycol at ' +
  '12.000% and glycerin at 6.390% — which is the most useful thing for skin that has just been needled or lasered ' +
  'and is losing water faster than usual. On top of that sit three calming ingredients at a full 0.2% each: ' +
  'licorice-derived dipotassium glycyrrhizate, scutellaria baicalensis root extract for its baicalin, and allantoin, ' +
  'with bisabolol at 0.050% and vitamin E at 0.500%. Purified centella triterpenes (asiaticoside, madecassic acid, ' +
  'asiatic acid) total 0.020%. Its registered function is one word: soothing. There is no functional active in it — ' +
  'no retinoid, acid, arbutin, adenosine or UV filter — which on freshly treated skin is the point. NOT FOR WOUNDED ' +
  'OR BROKEN SKIN, as printed on the carton, and not for use during pregnancy or breastfeeding. Contains beeswax ' +
  '0.500%, so not vegan, and lavender oil 0.0053% with linalool declared. May be applied several times a day. Use ' +
  'within six months of opening. Assessed as safe for human health under EC Regulation 1223/2009 and graded Non ' +
  'Irritant on patch test.'

const DESCRIPTION_RU =
  'Крем, который вам отдают после процедуры. Почти пятая часть его — увлажнители: бутиленгликоль 12,000% и глицерин ' +
  '6,390%, а это самое полезное для кожи, только что прошедшей микронидлинг или лазер и теряющей воду быстрее ' +
  'обычного. Поверх — три успокаивающих ингредиента по полные 0,2% каждый: производное лакрицы дикалия ' +
  'глицирризинат, экстракт корня шлемника ради байкалина и аллантоин, плюс бисаболол 0,050% и витамин E 0,500%. ' +
  'Очищенные тритерпены центеллы (азиатикозид, мадекассовая и азиатовая кислоты) — суммарно 0,020%. ' +
  'Зарегистрированная функция — одно слово: успокоение. Функциональных активов в нём нет — ни ретиноида, ни кислоты, ' +
  'ни арбутина, ни аденозина, ни UV-фильтра, и для свежеобработанной кожи в этом весь смысл. НЕ ДЛЯ ПОВРЕЖДЁННОЙ И ' +
  'ОТКРЫТОЙ КОЖИ, как указано на коробке, и не для применения при беременности и кормлении. Содержит пчелиный воск ' +
  '0,500%, поэтому не веганский, и лавандовое масло 0,0053% с заявленным линалоолом. Можно наносить несколько раз в ' +
  'день. Использовать в течение шести месяцев после вскрытия. Оценено как безопасное для здоровья человека по ' +
  'регламенту EC 1223/2009, патч-тест — «не раздражает».'

const DESCRIPTION_AR =
  'الكريم الذي يسلّمك إياه الأخصائي بعد الجلسة. نحو خُمسه مرطّبات جاذبة — بيوتيلين غلايكول بنسبة 12.000% وغليسرين ' +
  'بنسبة 6.390% — وهو أنفع ما يكون لبشرة خرجت لتوّها من الإبر الدقيقة أو الليزر وتفقد الماء أسرع من المعتاد. وفوق ' +
  'ذلك ثلاثة مكوّنات مهدّئة بنسبة 0.2% كاملة لكل منها: دايبوتاسيوم غليسيرايزينات المشتقّ من عرق السوس، ومستخلص جذر ' +
  'القُبّعية لبايكالينه، والألانتوين، مع بيسابولول بنسبة 0.050% وفيتامين E بنسبة 0.500%. وثلاثيات تربين السنتيلا ' +
  'المنقّاة (أسياتيكوسايد، وحمض المادِكاسيك، وحمض الأسياتيك) تبلغ 0.020%. ووظيفته المسجّلة كلمة واحدة: التهدئة. ولا ' +
  'فعّال وظيفي فيه — لا ريتينويد ولا حمض ولا أربوتين ولا أدينوزين ولا مرشّح أشعة — وهذا هو المقصود على بشرة معالجة ' +
  'حديثاً. لا يُستخدم على بشرة مجروحة أو مفتوحة، كما هو مطبوع على العلبة، ولا أثناء الحمل أو الإرضاع. يحتوي شمع ' +
  'العسل بنسبة 0.500%، فهو ليس نباتياً، وزيت اللافندر بنسبة 0.0053% مع لينالول معلن. ويمكن تطبيقه عدة مرات يومياً. ' +
  'يُستخدم خلال ستة أشهر من الفتح. مقيَّم آمناً لصحة الإنسان وفق اللائحة EC 1223/2009 ومصنّف «غير مهيّج» في اختبار ' +
  'اللصقة.'

/** Transcribed from the DTS MG signed formula; matches the registered carton order. */
const FULL_INCI =
  'Aqua (Water), Butylene Glycol, Glycerin, 1,2-Hexanediol, Dimethicone, Squalane, Caprylic/Capric Triglyceride, ' +
  'sh-Polypeptide-7, Asiaticoside, Madecassic Acid, Asiatic Acid, Sodium Hyaluronate, Beta-Glucan, Scutellaria ' +
  'Baicalensis Root Extract, Dipotassium Glycyrrhizate, Cetearyl Glucoside, Carbomer, Allantoin, Xanthan Gum, ' +
  'Hydrogenated Lecithin, Panthenol, Bisabolol, Vitis Vinifera (Grape) Callus Culture Extract, Rosa Damascena ' +
  'Callus Culture Extract, Lavandula Angustifolia (Lavender) Oil, Simmondsia Chinensis (Jojoba) Seed Oil, Lecithin, ' +
  'Ethylhexylglycerin, Sodium Phosphate, Sodium Chloride, Citrus Junos Fruit Extract, Camellia Sinensis Leaf ' +
  'Extract, Houttuynia Cordata Extract, Glycine, Disodium EDTA, Artemisia Vulgaris Extract, Artemisia Princeps ' +
  'Extract, Lysine, Lactobacillus Ferment Lysate Filtrate, Chamaecyparis Obtusa Water, Cetearyl Olivate, Cetearyl ' +
  'Alcohol, Sorbitan Olivate, Tocopheryl Acetate, Beeswax, Arginine, Acrylates/C10-30 Alkyl Acrylate Crosspolymer, ' +
  'Linalool'

const KEY_FEATURES = [
  {
    title: '18.4% Humectants',
    description:
      'Butylene glycol at 12.000% and glycerin at 6.390%. Freshly treated skin loses water faster than intact skin, and replacing it is the most useful thing a cream can do in the first days.',
  },
  {
    title: 'Three Calming Actives at 0.2% Each',
    description:
      'Licorice-derived dipotassium glycyrrhizate, scutellaria baicalensis root extract for its baicalin, and allantoin — all at proper working doses, with bisabolol at 0.050% and vitamin E at 0.500%.',
  },
  {
    title: 'No Functional Actives At All',
    description:
      'No retinoid, acid, vitamin C, arbutin, adenosine or UV filter. Its registered Korean function is the single word "soothing", and on skin that has just been treated that absence is the point.',
  },
  {
    title: 'Reapply As Often As Needed',
    description:
      'The manufacturer explicitly permits several applications a day. Use within six months of opening; the 6M symbol is on the carton.',
  },
]

const BENEFITS = [
  'Built for the days after a professional treatment',
  'Replaces water fast - 18.4% humectants from butylene glycol and glycerin',
  'Calms - licorice, scutellaria and allantoin, each at a full 0.2%',
  'Nothing to react with - no retinoid, acid, arbutin, adenosine or UV filter',
  'May be reapplied several times a day per the manufacturer',
  'Graded Non Irritant, and assessed safe with no restrictions attached',
  'Four pathogens screened across both batches on file, all absent',
]

/** Ordered by concentration, which is the whole point of this revision. */
const ACTIVES = [
  {
    name: 'Butylene glycol 12.000% and glycerin 6.390%',
    description:
      '18.4% humectants combined, and the largest functional component of the product. This is what rehydrates skin that has just lost its barrier integrity, and it is why the cream weighs slightly more than water.',
  },
  {
    name: 'Dipotassium glycyrrhizate 0.200%',
    description:
      'The licorice-derived anti-irritant, at the middle of its normal cosmetic range of 0.1 to 0.5%. The ingredient that most deserves to lead this list.',
  },
  {
    name: 'Scutellaria baicalensis root extract 0.200%',
    description:
      'The source of baicalin, a well-studied calming flavonoid, at a proper working dose. It was previously listed last of seven.',
  },
  {
    name: 'Allantoin 0.200% and bisabolol 0.050%',
    description:
      'Allantoin at a full working dose for comfort; bisabolol, the calming fraction of chamomile, at the low end of its typical range but genuinely present.',
  },
  {
    name: 'Tocopheryl acetate 0.500% and arginine 0.500%',
    description: 'Vitamin E as an antioxidant at a real dose, and arginine as a conditioning amino acid.',
  },
  {
    name: 'The lipid phase, ~8.3%',
    description:
      'Dimethicone 2.000%, squalane 1.500%, caprylic/capric triglyceride 1.500%, jojoba 0.500%, beeswax 0.500% and the olive-derived emulsifiers. Enough to hold the water in without weighing down skin that is already warm.',
  },
  {
    name: 'Beta-glucan 0.028% and sodium hyaluronate 0.025%',
    description: 'Modest but real supporting humectants at 280 and 250 parts per million.',
  },
  {
    name: 'Centella triterpenes, 0.020% combined',
    description:
      'Asiaticoside 0.008%, madecassic acid 0.006% and asiatic acid 0.006%. These are purified triterpenes rather than a crude extract, so a deliberate and comparatively expensive choice — but the wound-healing literature works at 0.1% to 1%, so read this as a supporting note rather than the reason the formula works.',
  },
  {
    name: 'Grape and rosa damascena callus culture extracts, 0.006% each',
    description:
      '60 parts per million each. Named because they are in the formula; no regeneration claim rests on them.',
  },
  {
    name: 'sh-Polypeptide-7 0.000001%',
    description:
      'Ten parts per billion. This previously led our key-ingredient list. It is in the formula and nothing rests on it.',
  },
  {
    name: 'Lavender oil 0.0053% and linalool 0.0047%',
    description:
      'It is scented with essential oil rather than synthetic perfume. The safety assessment additionally had the finished cream analysed for linalool, measuring 0.0032%, so this is a tested figure.',
  },
]

async function main() {
  const product = await prisma.product.findFirst({
    where: { OR: [{ productNumber: '25' }, { id: '25' }] },
  })
  if (!product) throw new Error('product 25 not found')

  const details = JSON.parse(product.productDetails || '{}') as Record<string, string>
  details.size = '20 g homecare tube · 100 g professional'
  details.registeredFunction = 'Soothing. No Korean functional licence, and none claimed'
  details.humectants = 'Butylene glycol 12.000% and glycerin 6.390% — 18.4% combined'
  details.calmingActives =
    'Dipotassium glycyrrhizate 0.200%, scutellaria baicalensis 0.200%, allantoin 0.200%, bisabolol 0.050%'
  details.centella = 'Purified triterpenes: asiaticoside 0.008%, madecassic acid 0.006%, asiatic acid 0.006%'
  details.functionalActives = 'None — no retinoid, acid, vitamin C, arbutin, adenosine or UV filter'
  details.notFor = 'Wounded or broken skin. Not for use during pregnancy or breastfeeding'
  details.vegan = 'No — contains beeswax 0.500%'
  details.fragrance = 'Yes — lavender oil 0.0053%, with linalool declared (measured at 0.0032%)'
  details.ph = '6.80 ± 1.00 (6.65 and 6.67 on the two batches on file)'
  details.periodAfterOpening = 'Six months — the 6M symbol is on the carton'
  details.assessment =
    'EU safety assessment under EC Regulation 1223/2009: safe for human health, no restrictions attached; patch test graded Non Irritant'
  details.usage =
    'Morning and evening, pressed on rather than rubbed. May be applied several times a day. Start when your practitioner says to'
  details.keyBenefits = 'Soothing and moisture replacement after professional treatment'
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

  console.log('Product 25 updated:')
  console.log('  reordered  -> humectants 18.4% and the three 0.2% actives now lead')
  console.log('  demoted    -> sh-polypeptide-7 (10 ppb) moved off the front of the list')
  console.log('  dropped    -> the "physical stimuli" efficacy test, which has no report')
  console.log('  dropped    -> "regenerating" / "rejuvenation"; registered function is soothing')
  console.log('  added      -> not for broken skin, per the Korean carton panel')
  console.log('  added      -> period after opening 6 months, from the 6M symbol')
  console.log('  added      -> beeswax 0.500% (not vegan) and the lavender/linalool disclosure')
  console.log('  added      -> full INCI, which was empty')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
