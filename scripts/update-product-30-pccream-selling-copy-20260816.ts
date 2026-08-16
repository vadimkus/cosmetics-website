/**
 * Rewrite INTENSIVE PROBLEM CONTROL CREAM (product 30) against the Intertek
 * dossier. See components/product/pccream/pccreamCopy.ts for the sourcing.
 *
 * What this fixes:
 *   - The full INCI was missing 1,2-Hexanediol, the third ingredient at 2%.
 *     Same bug as the serum.
 *   - keyFeatures was null, so the record had nothing to show there.
 *   - "All skin types" and "safe for all skin types". The carton says oily
 *     and combination.
 *   - Allantoin promoting "skin healing", beta-glucan strengthening "the
 *     skin's own defences".
 *   - "Keeps skin hydrated without clogging pores", which is a
 *     non-comedogenic claim with no test behind it.
 *   - productNumber was null, so the record resolved through its id.
 */
import { PrismaClient } from '@prisma/client'

const url = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL || ''
const prisma = new PrismaClient({ accelerateUrl: url } as never)

const FULL_INCI =
  'Aqua (Water), Dipropylene Glycol, 1,2-Hexanediol, Trehalose, Zinc PCA, Acrylates/C10-30 Alkyl Acrylate Crosspolymer, ' +
  'Sodium Polyacrylate, Xylitol, Allantoin, Betaine, Lactobacillus/Pumpkin Ferment Extract, Panthenol, Beta-Glucan, ' +
  'Betula Platyphylla Japonica Bark Extract, Leuconostoc/Radish Root Ferment Filtrate, Phaseolus Radiatus Extract, ' +
  'Polyglutamic Acid, Rumex Crispus Root Extract, Disodium EDTA, Potassium Hydroxide, Butylene Glycol, Dimethicone, ' +
  'Glycerin, Hydrogenated Lecithin.'

const EN = {
  description:
    'A cream with no oil in it. No plant oil, no butter, no wax, no emulsifier: what makes it feel like a cream is 1.3% of thickener holding 86.6% water in a gel. Zinc PCA sits at 0.05%, the same dose as the Problem Control Serum, and Korea registers the cream for anti-blemishes and oil control. Massage it in as the last step, morning and night. 50g and 250g. No perfume of any kind. Dermatologically tested.',
  productDetails: JSON.stringify({
    form: 'Leave-on oil-free gel cream, tube',
    size: '50g homecare / 250g professional',
    function: 'Anti-blemishes, oil control',
    technology: 'Zinc PCA 0.05% in a gel with no oil phase at all',
    keyBenefits: 'Oil control, hydration that holds, comfort as the last step',
    usage: 'Morning and night, massaged in as the last step',
    skinType: 'Oily and combination skin, blemish-prone',
    application: 'Apply on the face and gently massage in',
    fragrance: 'None in the formula',
    testing: 'Dermatologically tested',
    origin: 'Made in Korea by DTS MG',
  }),
  keyFeatures: JSON.stringify([
    {
      title: 'No oil in it',
      description:
        'No plant oil, no butter, no wax, no emulsifier. Dimethicone is the only entry that behaves like an oil at all and it sits at 0.005%.',
    },
    {
      title: 'Zinc PCA 0.05%',
      description:
        'The same dose as the Problem Control Serum, so the pair really is a matched pair rather than a strong version and a weak one.',
    },
    {
      title: 'Water, thickened',
      description:
        '86.6% water held in a gel by acrylates crosspolymer at 0.7% and sodium polyacrylate at 0.6%. That is the whole structure.',
    },
    {
      title: 'Two grams of humectant',
      description:
        'Trehalose 1.5% and xylitol 0.5%, which is more than the entire botanical set put together.',
    },
  ]),
  benefits: JSON.stringify([
    'Anti-blemishes and oil control, the registered function of the cream',
    'No oil, butter, wax or emulsifier anywhere in the formula',
    'Zinc PCA at 0.05%, matching the Problem Control Serum',
    'Trehalose 1.5% and xylitol 0.5% for hydration that holds',
    'No perfume in the formula, artificial or botanical',
    'Morning and night as the last step. 50g and 250g. Dermatologically tested',
  ]),
  ingredients: JSON.stringify([
    {
      name: 'Zinc PCA 0.05%',
      description:
        'The active, at the same dose as the serum. Zinc paired with pyrrolidone carboxylic acid, one of the humectants skin makes for itself, so the oil-control half arrives with a water-binding half attached.',
    },
    {
      name: 'Trehalose 1.5% · Xylitol 0.5%',
      description:
        'Two grams of sugar humectant in every hundred. This is the hydration half of the pack promise, and it is more of the tube than every botanical in it combined.',
    },
    {
      name: 'Panthenol 0.1% · Allantoin 0.1% · Beta-Glucan 0.1%',
      description:
        'The comfort set, three tenths of a percent between them. What makes the routine liveable once the toner and the serum have already been through.',
    },
    {
      name: 'Acrylates Crosspolymer 0.7% · Sodium Polyacrylate 0.6%',
      description:
        'The two thickeners that turn 86.6% water into something that spreads like a cream. In an ordinary cream this job is done by oil and an emulsifier; here there is neither.',
    },
    {
      name: 'Dipropylene Glycol 7% · 1,2-Hexanediol 2%',
      description:
        'The solvent pair that carries everything else and keeps the gel stable without a preservative you would recognise as one.',
    },
    {
      name: 'Mung bean · white birch bark · yellow dock',
      description:
        'Three botanicals at 0.1% each, alongside pumpkin and radish root ferments and polyglutamic acid at the same level. Really in there, and not the reason the cream works.',
    },
    { name: 'Full INCI', description: FULL_INCI },
  ]),
  howToUse: [
    '1. Cleanse. Start on clean skin',
    '2. Toner, then serum. This cream is the step after both',
    '3. Massage it gently into the face. The carton asks for massage here, not the patting the serum wants',
    '4. Nothing on top at night. Sunscreen over it in the morning',
    '5. Keep it clear of the eye area',
  ].join('\n'),
  directions:
    'Dermatologically tested. For oily and combination skin. For external use only. Keep clear of the eye area. Stop and speak to a doctor if redness, swelling or irritation appears. Keep in a cool dry place, out of reach of children. Three years unopened, with the expiry date on the box.',
}

const AR = {
  description:
    'كريم بلا زيت فيه. لا زيت نباتي ولا زبدة ولا شمع ولا مستحلب: ما يجعله يشبه الكريم هو ١٫٣٪ من المكثّف يحمل ٨٦٫٦٪ ماءً في هيئة جل. زنك PCA بنسبة ٠٫٠٥٪، نفس جرعة سيروم Problem Control، وكوريا تسجّل الكريم لمقاومة العيوب والتحكم بالدهون. دلّكيه كخطوة أخيرة صباحاً ومساءً. ٥٠ غ و٢٥٠ غ. بلا أي عطر. مختبر جلدياً.',
  productDetails: JSON.stringify({
    form: 'جل كريم خالٍ من الزيوت يُترك على البشرة، أنبوب',
    size: '٥٠ غ منزلي / ٢٥٠ غ احترافي',
    function: 'مقاومة العيوب والتحكم بالدهون',
    technology: 'زنك PCA ٠٫٠٥٪ في جل بلا أي طور زيتي',
    keyBenefits: 'تحكم بالدهون، ترطيب يدوم، راحة كخطوة أخيرة',
    usage: 'صباحاً ومساءً، يُدلّك كخطوة أخيرة',
    skinType: 'بشرة دهنية ومختلطة، معرّضة للعيوب',
    application: 'يوضع على الوجه ويُدلّك برفق',
    fragrance: 'لا يوجد في التركيبة',
    testing: 'مختبر جلدياً',
    origin: 'صنع في كوريا من DTS MG',
  }),
  keyFeatures: JSON.stringify([
    {
      title: 'بلا زيت فيه',
      description:
        'لا زيت نباتي ولا زبدة ولا شمع ولا مستحلب. الدايميثيكون هو الوحيد الذي يتصرّف كالزيت أصلاً وهو بنسبة ٠٫٠٠٥٪.',
    },
    {
      title: 'زنك PCA ٠٫٠٥٪',
      description:
        'نفس جرعة سيروم Problem Control، فالثنائي متطابق فعلاً لا نسخة قوية وأخرى ضعيفة.',
    },
    {
      title: 'ماء مكثّف',
      description:
        '٨٦٫٦٪ ماء محمول في جل بأكريليت كروسبوليمر ٠٫٧٪ وصوديوم بولي أكريليت ٠٫٦٪. هذا هو البناء كله.',
    },
    {
      title: 'غرامان من المرطّب',
      description:
        'تريهالوز ١٫٥٪ وزايليتول ٠٫٥٪، أكثر من مجموعة النباتات كلها مجتمعة.',
    },
  ]),
  benefits: JSON.stringify([
    'مقاومة العيوب والتحكم بالدهون، الوظيفة المسجّلة للكريم',
    'بلا زيت أو زبدة أو شمع أو مستحلب في أي مكان من التركيبة',
    'زنك PCA بنسبة ٠٫٠٥٪، مطابق لسيروم Problem Control',
    'تريهالوز ١٫٥٪ وزايليتول ٠٫٥٪ لترطيب يدوم',
    'لا عطر في التركيبة، لا صناعي ولا نباتي',
    'صباحاً ومساءً كخطوة أخيرة. ٥٠ غ و٢٥٠ غ. مختبر جلدياً',
  ]),
  ingredients: JSON.stringify([
    {
      name: 'زنك PCA ٠٫٠٥٪',
      description:
        'الفعّال، وبالجرعة نفسها الموجودة في السيروم. زنك مقترن بحمض البيروليدون كربوكسيليك، أحد المرطّبات التي تصنعها البشرة لنفسها، فيصل نصف التحكم بالدهون ومعه نصف يربط الماء.',
    },
    {
      name: 'تريهالوز ١٫٥٪ · زايليتول ٠٫٥٪',
      description:
        'غرامان من السكّر المرطّب في كل مئة. هذا هو نصف الترطيب من وعد العلبة، وهو من الأنبوب أكثر من كل النباتات مجتمعة.',
    },
    {
      name: 'بانثينول ٠٫١٪ · ألانتوين ٠٫١٪ · بيتا جلوكان ٠٫١٪',
      description:
        'مجموعة الراحة، ثلاثة أعشار بالمئة بينها جميعاً. ما يجعل الروتين محتملاً بعد أن يمرّ التونر والسيروم.',
    },
    {
      name: 'أكريليت كروسبوليمر ٠٫٧٪ · صوديوم بولي أكريليت ٠٫٦٪',
      description:
        'المكثّفان اللذان يحوّلان ٨٦٫٦٪ ماءً إلى شيء ينتشر ككريم. في الكريم العادي يقوم بهذه المهمة زيت ومستحلب، وهنا لا وجود لأيّ منهما.',
    },
    {
      name: 'داي بروبيلين جلايكول ٧٪ · ١٬٢-هكسانديول ٢٪',
      description:
        'ثنائي المذيب الذي يحمل كل شيء ويبقي الجل مستقرّاً دون مادة حافظة بالمعنى المعتاد.',
    },
    {
      name: 'الفاصولياء الذهبية · لحاء البتولا الأبيض · الحمّاض',
      description:
        'ثلاثة نباتات بنسبة ٠٫١٪ لكل منها، مع تخمّرات القرع وجذر الفجل وحمض بولي جلوتاميك بالمستوى نفسه. موجودة فعلاً، وليست سبب عمل الكريم.',
    },
    { name: 'Full INCI', description: FULL_INCI },
  ]),
  howToUse: JSON.stringify([
    { step: 'التنظيف', instruction: 'ابدئي ببشرة نظيفة' },
    { step: 'التونر ثم السيروم', instruction: 'هذا الكريم هو الخطوة بعدهما' },
    { step: 'التدليك', instruction: 'دلّكيه برفق على الوجه. العلبة تطلب التدليك هنا لا التربيت كما في السيروم' },
    { step: 'الختام', instruction: 'لا شيء فوقه ليلاً. واقي الشمس فوقه صباحاً' },
    { step: 'تنبيه', instruction: 'أبعديه عن محيط العين' },
  ]),
  directions:
    'مختبر جلدياً. للبشرة الدهنية والمختلطة. للاستخدام الخارجي فقط. أبعديه عن محيط العين. توقّفي واستشيري طبيباً إن ظهر احمرار أو تورم أو تهيّج. احفظيه في مكان بارد وجاف بعيداً عن متناول الأطفال. ثلاث سنوات دون فتح، وتاريخ الانتهاء على العلبة.',
}

const RU = {
  description:
    'Крем, в котором нет масла. Ни растительного масла, ни баттера, ни воска, ни эмульгатора: кремом это делает 1,3% загустителя, удерживающего 86,6% воды в виде геля. Цинк PCA — 0,05%, та же доза, что в сыворотке Problem Control, и Корея регистрирует крем на контроле высыпаний и жирности. Втирайте последним шагом утром и вечером. 50 г и 250 г. Совсем без отдушки. Дерматологически протестировано.',
  productDetails: JSON.stringify({
    form: 'Несмываемый гель-крем без масел, туба',
    size: '50 г домашний / 250 г профессиональный',
    function: 'Контроль высыпаний и жирности',
    technology: 'Цинк PCA 0,05% в геле, где нет масляной фазы вообще',
    keyBenefits: 'Контроль жирности, стойкое увлажнение, комфорт последним шагом',
    usage: 'Утром и вечером, втирается последним шагом',
    skinType: 'Жирная и комбинированная кожа, склонная к высыпаниям',
    application: 'Нанести на лицо и мягко втереть',
    fragrance: 'В формуле отсутствует',
    testing: 'Дерматологически протестировано',
    origin: 'Сделано в Корее, DTS MG',
  }),
  keyFeatures: JSON.stringify([
    {
      title: 'В нём нет масла',
      description:
        'Ни растительного масла, ни баттера, ни воска, ни эмульгатора. Диметикон — единственное, что вообще ведёт себя как масло, и он на уровне 0,005%.',
    },
    {
      title: 'Цинк PCA 0,05%',
      description:
        'Та же доза, что в сыворотке Problem Control, поэтому пара действительно парная, а не «сильная и слабая версии».',
    },
    {
      title: 'Загущённая вода',
      description:
        '86,6% воды, удержанной в геле акрилатным кроссполимером 0,7% и полиакрилатом натрия 0,6%. Это вся структура.',
    },
    {
      title: 'Два грамма увлажнителя',
      description:
        'Трегалоза 1,5% и ксилитол 0,5% — больше, чем весь растительный набор вместе взятый.',
    },
  ]),
  benefits: JSON.stringify([
    'Контроль высыпаний и жирности — зарегистрированная функция крема',
    'Ни масел, ни баттеров, ни восков, ни эмульгаторов нигде в составе',
    'Цинк PCA 0,05%, как в сыворотке Problem Control',
    'Трегалоза 1,5% и ксилитол 0,5% для стойкого увлажнения',
    'В формуле нет отдушки, ни синтетической, ни растительной',
    'Утром и вечером последним шагом. 50 г и 250 г. Дерматологически протестировано',
  ]),
  ingredients: JSON.stringify([
    {
      name: 'Цинк PCA 0,05%',
      description:
        'Актив, в той же дозе, что и в сыворотке. Цинк в паре с пирролидонкарбоновой кислотой, одним из увлажнителей, которые кожа делает сама, так что половина по контролю жирности приходит вместе с половиной, связывающей воду.',
    },
    {
      name: 'Трегалоза 1,5% · Ксилитол 0,5%',
      description:
        'Два грамма сахарного увлажнителя на каждые сто. Это увлажняющая половина обещания на коробке, и её в тубе больше, чем всех растительных экстрактов вместе.',
    },
    {
      name: 'Пантенол 0,1% · Аллантоин 0,1% · Бета-глюкан 0,1%',
      description:
        'Набор комфорта, три десятых процента на троих. То, что делает уход выносимым после тоника и сыворотки.',
    },
    {
      name: 'Акрилатный кроссполимер 0,7% · Полиакрилат натрия 0,6%',
      description:
        'Два загустителя, превращающие 86,6% воды в то, что распределяется как крем. В обычном креме эту работу делают масло и эмульгатор; здесь нет ни того, ни другого.',
    },
    {
      name: 'Дипропиленгликоль 7% · 1,2-гександиол 2%',
      description:
        'Пара растворителей, которая несёт всё остальное и держит гель стабильным без консерванта в привычном смысле слова.',
    },
    {
      name: 'Маш · кора белой берёзы · щавель курчавый',
      description:
        'Три растения по 0,1% каждое, рядом с ферментами тыквы и корня редиса и полиглутаминовой кислотой на том же уровне. Действительно там, и не причина того, что крем работает.',
    },
    { name: 'Full INCI', description: FULL_INCI },
  ]),
  howToUse: JSON.stringify([
    { step: 'Очищение', instruction: 'Начните на чистой коже' },
    { step: 'Тоник, затем сыворотка', instruction: 'Этот крем идёт после обоих' },
    { step: 'Втереть', instruction: 'Мягко втереть в лицо. Коробка просит здесь именно втирание, а не вбивание, как в сыворотке' },
    { step: 'Завершение', instruction: 'Вечером сверху ничего. Утром поверх — SPF' },
    { step: 'Внимание', instruction: 'Держите подальше от области вокруг глаз' },
  ]),
  directions:
    'Дерматологически протестировано. Для жирной и комбинированной кожи. Только для наружного применения. Держите подальше от области вокруг глаз. Прекратите использование и обратитесь к врачу при покраснении, отёке или раздражении. Храните в прохладном сухом месте, вне доступа детей. Три года в закрытом виде, дата окончания срока — на коробке.',
}

async function main() {
  const p = await prisma.product.findFirst({
    where: { OR: [{ productNumber: '30' }, { id: '30' }] },
    select: { id: true, name: true },
  })
  if (!p) throw new Error('product 30 not found')

  await prisma.product.update({
    where: { id: p.id },
    data: {
      productNumber: '30',
      description: EN.description,
      descriptionRu: RU.description,
      descriptionAr: AR.description,
      productDetails: EN.productDetails,
      keyFeatures: EN.keyFeatures,
      benefits: EN.benefits,
      ingredients: EN.ingredients,
      howToUse: EN.howToUse,
      directions: EN.directions,
    },
  })

  const after = await prisma.product.findFirst({
    where: { productNumber: '30' },
    select: { productNumber: true, ingredients: true, keyFeatures: true, directions: true },
  })
  console.log('productNumber:', after?.productNumber)
  console.log('INCI has 1,2-Hexanediol:', after?.ingredients?.includes('1,2-Hexanediol'))
  console.log('keyFeatures set:', Boolean(after?.keyFeatures))
  console.log('no all-skin-types:', !after?.directions?.includes('all skin types'))
  console.log('done')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())

export { AR, RU }
