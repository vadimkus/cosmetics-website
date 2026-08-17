/**
 * Product 28 — INTENSIVE HYDRO SOOTHING CREAM.
 *
 * Aligns the record with the source audit in
 * docs/SESSION_CHANGES_2026-08-17_PRODUCT_28_HYDRO_SOOTHING_SOURCE_AUDIT.md.
 *
 * 1. THE HYDRATION CLAIM WAS SUPPORTED AFTER ALL, AND UNDERSOLD. The Intertek
 *    assessment records "Other Tests: None presented", so the dossier alone
 *    suggests deleting it. The DTS MG homecare deck carries a CLINICAL TRIAL DATA
 *    page for this exact product with TWO endpoints:
 *      - skin hydration +12% after 4 weeks
 *      - skin temperature down ~1 C, 20 minutes after application
 *    Both are now on the record, with the caveat that the deck names no
 *    laboratory, subject count, method or instrument. The cooling figure had
 *    never been used anywhere on the site.
 * 2. BETAINE AT 5.000% WAS MISSING ENTIRELY. It is the largest active in the
 *    formula, an osmolyte, at a high dose (typical use 0.5-2%), and DTS MG's own
 *    deck credits it with hydration and with calming redness. With butylene
 *    glycol 10.555% and glycerin 6.175% that is 21.7% humectants, which is the
 *    entire design of the product. Now leads.
 * 3. SNAIL SECRETION FILTRATE WAS THE SECOND NAMED INGREDIENT AT 10 PPM. The
 *    premix trap: the supplier sheet lists SNAIL MUCOUS EXTRACT-WP at 0.100%, and
 *    that raw material is only 1.00% filtrate, so the finished cream holds
 *    0.0010%. Overstated one hundred fold. Same mechanism put beta-glucan on the
 *    key list at 4 ppm (SC-GLUCAN 0.100% x 79.60%, then reduced in the current
 *    formula).
 * 4. IT IS NOT VEGAN and nothing said so. Snail secretion filtrate, for 10 ppm.
 * 5. PERIOD AFTER OPENING IS 6 MONTHS (the 6M symbol is on the carton) and was
 *    nowhere on the site.
 * 6. THERE IS NO CONVENTIONAL PRESERVATIVE. Protection is from glycols:
 *    1,2-hexanediol 2.002%, pentylene and caprylyl glycol. No paraben, no
 *    phenoxyethanol, no perfume and no declared allergens.
 * 7. IT IS A TRANSPARENT GEL-CREAM per the COA and the assessment. Our record
 *    called it a "gel" while the name says cream; gel-cream is the accurate word.
 * 8. THE INGREDIENTS FIELD WAS EMPTY. Added the full INCI from the signed formula,
 *    which matches the registered carton exactly.
 *
 * Run: npx tsx --env-file=.env.local scripts/update-product-28-hydro-soothing-record-20260817.ts
 */

import { prisma } from '../lib/prisma'

const DESCRIPTION_EN =
  'A transparent gel-cream built almost entirely around water-binding: butylene glycol 10.555%, glycerin 6.175% and ' +
  'betaine 5.000% make 21.7% humectants, with betaine at a high dose for a cosmetic (typical use is 0.5 to 2%). The ' +
  'manufacturer\u2019s clinical documentation records skin temperature down by an average of about 1 °C twenty minutes ' +
  'after application, and skin hydration up 12% after four weeks of regular use — figures given without a named ' +
  'laboratory, subject count or method, so treat them as the manufacturer\u2019s measurements rather than a published ' +
  'trial. Also contains Lactobacillus/pumpkin ferment extract 0.1000%, aloe barbadensis leaf extract 0.0500% and ' +
  'sodium hyaluronate 0.0500%. Snail secretion filtrate is present at 0.0010%, ten parts per million, so this is not ' +
  'a snail cream — but it is NOT VEGAN. No paraben and no phenoxyethanol: the formula is preserved by glycols. No ' +
  'perfume and no declared allergens. Registered function is hydrating and soothing, with no Korean functional ' +
  'licence. Do not use on wounded or broken skin. Six months after opening. Assessed as safe for human health under ' +
  'EC Regulation 1223/2009 and graded Non Irritant on patch test.'

const DESCRIPTION_RU =
  'Прозрачный гель-крем, построенный почти целиком на связывании воды: бутиленгликоль 10,555%, глицерин 6,175% и ' +
  'бетаин 5,000% дают 21,7% увлажнителей, причём бетаин — в высокой для косметики дозе (обычно применяют 0,5–2%). ' +
  'Клиническая документация производителя фиксирует снижение температуры кожи в среднем примерно на 1 °C через ' +
  'двадцать минут после нанесения и рост увлажнённости на 12% через четыре недели регулярного применения; цифры ' +
  'приведены без названия лаборатории, числа участников и метода, поэтому считайте их измерениями производителя, а ' +
  'не опубликованным исследованием. Также содержит экстракт ферментации лактобактерий и тыквы 0,1000%, экстракт ' +
  'листа алоэ 0,0500% и гиалуронат натрия 0,0500%. Фильтрат секрета улитки присутствует в концентрации 0,0010%, ' +
  'десять частей на миллион, так что это не улиточный крем — но средство НЕ ВЕГАНСКОЕ. Без парабена и ' +
  'феноксиэтанола: формулу держат гликоли. Без отдушки и без заявленных аллергенов. Зарегистрированная функция — ' +
  'увлажнение и успокоение, корейской функциональной лицензии нет. Не наносить на повреждённую кожу. Шесть месяцев ' +
  'после вскрытия. Оценено как безопасное для здоровья человека по регламенту EC 1223/2009, патч-тест — «не ' +
  'раздражает».'

const DESCRIPTION_AR =
  'كريم جيلي شفّاف مبنيّ كلّه تقريباً على ربط الماء: بيوتيلين غلايكول 10.555%، وغليسرين 6.175%، وبيتايين 5.000% ' +
  'تصنع 21.7% مرطّبات جاذبة، والبيتايين بجرعة عالية لمستحضر تجميلي (فالاستخدام المعتاد بين 0.5 و2%). وتسجّل وثائق ' +
  'الشركة السريرية انخفاض حرارة البشرة بمعدل نحو درجة مئوية واحدة بعد عشرين دقيقة من التطبيق، وارتفاع ترطيب البشرة ' +
  '12% بعد أربعة أسابيع من الاستخدام المنتظم — وهي أرقام معطاة بلا مختبر مسمّى ولا عدد مشاركين ولا طريقة، فاعتبريها ' +
  'قياسات الشركة لا تجربة منشورة. ويحتوي أيضاً مستخلص تخمّر اللاكتوباسيلوس/القرع بنسبة 0.1000%، ومستخلص ورق الألوة ' +
  'بنسبة 0.0500%، وصوديوم هيالورونات بنسبة 0.0500%. أما مرشّح إفراز المحار فموجود بنسبة 0.0010%، أي عشرة أجزاء من ' +
  'المليون، فهذا ليس كريم محار — لكنه ليس نباتياً. ولا بارابين ولا فينوكسي إيثانول: فالتركيبة محفوظة بالغلايكولات. ' +
  'ولا عطر ولا مسبّبات حساسية معلنة. والوظيفة المسجّلة هي الترطيب والتهدئة، بلا ترخيص وظيفي كوري. لا يُستخدم على ' +
  'بشرة مجروحة أو مفتوحة. ستة أشهر بعد الفتح. مقيَّم آمناً لصحة الإنسان وفق اللائحة EC 1223/2009 ومصنّف «غير مهيّج» ' +
  'في اختبار اللصقة.'

/** From the signed Formula_up; matches the registered carton INCI exactly. */
const FULL_INCI =
  'Aqua (Water), Butylene Glycol, Glycerin, Betaine, 1,2-Hexanediol, Aloe Barbadensis Leaf Extract, Snail Secretion ' +
  'Filtrate, Lactobacillus/Pumpkin Ferment Extract, Sodium Hyaluronate, Carbomer, Potassium Hydroxide, Phaseolus ' +
  'Radiatus Extract, Betula Platyphylla Japonica Bark Extract, Rumex Crispus Root Extract, Beta-Glucan, Nelumbo ' +
  'Nucifera Flower Extract, Pentylene Glycol, Caprylyl Glycol, Prunus Mume Fruit Extract, Lactic Acid, Citric Acid, ' +
  'Xanthan Gum, Disodium EDTA'

const KEY_FEATURES = [
  {
    title: 'Measured: About 1 °C Cooler at Twenty Minutes',
    description:
      'From the manufacturer\u2019s clinical documentation, alongside hydration up 12% after four weeks. No laboratory, subject count or method is named, so these are manufacturer measurements rather than a published trial.',
  },
  {
    title: 'Betaine 5%, Inside 21.7% Humectants',
    description:
      'An osmolyte at a high dose for a cosmetic, with butylene glycol 10.555% and glycerin 6.175%. This is the whole design of the product and it was previously unmentioned.',
  },
  {
    title: 'No Preservative Beyond the Glycols',
    description:
      'No paraben, no phenoxyethanol, no perfume and no declared allergens. Protection comes from 1,2-hexanediol at 2% with pentylene and caprylyl glycol.',
  },
  {
    title: 'Not Vegan — Contains Snail Filtrate at 10 ppm',
    description:
      'Snail secretion filtrate is at 0.0010%. It is not what hydrates the cream, but it is in it, and anyone avoiding animal-derived ingredients should know.',
  },
]

const BENEFITS = [
  'Cools measurably - about 1 C lower skin temperature at twenty minutes',
  'Hydration up 12% after four weeks in the manufacturer\'s clinical work',
  '21.7% humectants - butylene glycol, glycerin and betaine at 5%',
  'Transparent gel-cream, almost no oil, absorbs without a film',
  'No paraben, no phenoxyethanol, no perfume, no declared allergens',
  'Graded Non Irritant, and assessed safe with no restrictions attached',
  'Suits the Gulf problem: dry outdoor air and drier air conditioning',
]

/** Ordered by concentration. */
const ACTIVES = [
  {
    name: 'Betaine 5.000%',
    description:
      'The largest active in the formula and a high dose for a cosmetic, where typical use is 0.5 to 2%. An osmolyte, so it helps skin cells hold their own water rather than only sitting on the surface. The manufacturer\u2019s own material credits it with hydration and with calming redness and irritation.',
  },
  {
    name: 'Butylene glycol 10.555% and glycerin 6.175%',
    description:
      'With the betaine, 21.7% humectants. This is why the product is a transparent gel-cream rather than a rich one: there is almost no oil phase in it at all.',
  },
  {
    name: '1,2-Hexanediol 2.002%',
    description:
      'Solvent, and the main part of the preservation system along with pentylene and caprylyl glycol. There is no paraben or phenoxyethanol in the formula.',
  },
  {
    name: 'Carbomer 0.500%, potassium hydroxide 0.135%, xanthan gum 0.100%',
    description: 'The gel structure and its neutralisation.',
  },
  {
    name: 'Lactobacillus/pumpkin ferment extract 0.1000%',
    description: '1,000 parts per million, so genuinely present rather than a trace.',
  },
  {
    name: 'Aloe barbadensis leaf extract 0.0500%',
    description:
      '500 parts per million. Real and modest. Note the 2014 safety assessment describes an earlier formula that carried aloe at 1.0%, twenty times more.',
  },
  {
    name: 'Sodium hyaluronate 0.0500%',
    description:
      'Another 500 parts per million, supporting the humectants rather than carrying the formula.',
  },
  {
    name: 'Phytolex SC 0.00765% combined',
    description:
      'The supplier\u2019s branded three-herb complex: Phaseolus radiatus (mung bean) at 75 ppm, Betula platyphylla bark at 1 ppm and Rumex crispus root at 0.5 ppm. Named because it is a real material in the tube, not because 76 ppm does the soothing.',
  },
  {
    name: 'Snail secretion filtrate 0.0010%',
    description:
      'Ten parts per million. Our old description named it second because the supplier sheet lists the pre-diluted raw material at 0.100%, and that material is only 1% filtrate. It makes the product non-vegan and it does not hydrate it.',
  },
  {
    name: 'Nelumbo nucifera flower 0.00057%, Prunus mume fruit 0.00024%, beta-glucan 0.0004%',
    description:
      '5.7, 2.4 and 4 parts per million. Listed for completeness. Beta-glucan in particular was on our key-ingredient list; the supplier sheet shows 0.100% because that is the pre-diluted material.',
  },
]

async function main() {
  const product = await prisma.product.findFirst({
    where: { OR: [{ productNumber: '28' }, { id: '28' }] },
  })
  if (!product) throw new Error('product 28 not found')

  const details = JSON.parse(product.productDetails || '{}') as Record<string, string>
  details.size = '50 g homecare tube · 250 g professional'
  details.texture = 'Transparent gel-cream, light, almost no oil phase'
  details.registeredFunction = 'Hydrating and soothing. No Korean functional licence, and none claimed'
  details.humectants = 'Butylene glycol 10.555%, glycerin 6.175%, betaine 5.000% — 21.7% combined'
  details.measured =
    'Skin temperature about −1 °C at twenty minutes; hydration +12% at four weeks. Manufacturer clinical data, no laboratory, subject count or method named'
  details.snail = '0.0010% — ten parts per million. Makes the product non-vegan; does not hydrate it'
  details.vegan = 'No — contains snail secretion filtrate'
  details.preservative =
    'Glycols only: 1,2-hexanediol 2.002%, pentylene and caprylyl glycol. No paraben, no phenoxyethanol'
  details.fragrance = 'None. No perfume in the formula and no declared allergens'
  details.notFor = 'Wounded or broken skin. Not for use near the eyes'
  details.ph = '6.00–7.00 (6.39 on the batch tested)'
  details.periodAfterOpening = 'Six months — the 6M symbol is on the carton'
  details.assessment =
    'EU safety assessment under EC Regulation 1223/2009: safe for human health, no restrictions attached; patch test graded Non Irritant'
  details.usage =
    'Morning and evening on clean skin, gently massaged in. Reapply when skin feels warm. Layer an occlusive cream over it on dry skin'
  details.keyBenefits = 'Hydration and a measured cooling effect'
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

  console.log('Product 28 updated:')
  console.log('  KEPT+SOURCED -> the hydration claim: +12% at 4 weeks, from the DTS MG deck')
  console.log('  ADDED        -> the cooling finding: about -1 C at 20 minutes, never used before')
  console.log('  ADDED        -> betaine 5.000%, the largest active, previously unmentioned')
  console.log('  DEMOTED      -> snail secretion filtrate from 2nd place to its real 10 ppm')
  console.log('  ADDED        -> not vegan, from the snail filtrate')
  console.log('  ADDED        -> no paraben/phenoxyethanol; glycol preservation; no fragrance')
  console.log('  ADDED        -> period after opening 6 months, and the broken-skin instruction')
  console.log('  FIXED        -> "gel" -> transparent gel-cream, per the COA')
  console.log('  ADDED        -> full INCI, which was empty')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
