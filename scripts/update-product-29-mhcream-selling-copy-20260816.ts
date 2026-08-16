/**
 * Rewrite MOISTURE REPLENISHING HYALURON CREAM (product 29) against the
 * Intertek dossier and the DTS MG deck. See
 * components/product/mhcream/mhcreamCopy.ts for the sourcing.
 *
 * What this fixes:
 *   - The full INCI was missing 1,2-Hexanediol at 1.0008%, and printed
 *     Propanediol before Dipropylene Glycol where the carton has them the
 *     other way round. It also dropped the ppm and ppb figures the carton
 *     prints beside every hyaluronate, which are the most useful numbers on
 *     the whole list.
 *   - Mushrooms sold as "powerful anti-inflammatory and antioxidant". They
 *     sit at about 0.17 ppm each.
 *   - "Anti-Aging Benefits - Reduces fine lines and improves skin
 *     elasticity". No study. The clinical on file is hydration only.
 *   - "All skin types, including sensitive". The deck says dry and
 *     dehydrated skin.
 *   - "4-step hydration system" as the technology name, and aquaporin as the
 *     mechanism. Glyceryl glucoside is at 5 ppm.
 *   - productNumber was null, so the record resolved through its id.
 *
 * Kept, because they are documented in the DTS MG deck: Hyaluronan 11
 * Multi-Complex by name, PENTAVITIN by name, +82% immediate hydration, and
 * 72-hour persistence.
 */
import { PrismaClient } from '@prisma/client'

const url = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL || ''
const prisma = new PrismaClient({ accelerateUrl: url } as never)

const FULL_INCI =
  'Aqua (Water), Glycerin, Caprylic/Capric Triglyceride, Dipropylene Glycol, Propanediol, Isononyl Isononanoate, ' +
  'Dicaprylyl Ether, Sodium Acrylates Copolymer, 1,2-Hexanediol, Sodium Hyaluronate (1,000.9 ppm), ' +
  'Sodium Hyaluronate Crosspolymer (30 ppb), Potassium Hyaluronate (30 ppb), Hydroxypropyltrimonium Hyaluronate (30 ppb), ' +
  'Hydrolyzed Sodium Hyaluronate (30 ppb), Hydrolyzed Hyaluronic Acid (30 ppb), Hyaluronic Acid (30 ppb), ' +
  'Sodium Acetylated Hyaluronate (1 ppb), Saccharide Isomerate, Xylitol, Erythritol, Glyceryl Glucoside, ' +
  'Tremella Fuciformis Polysaccharide, Trametes Versicolor Extract, Sparassis Crispa Extract, ' +
  'Ganoderma Lucidum (Mushroom) Extract, Phellinus Linteus Extract, Tremella Fuciformis (Mushroom) Extract, ' +
  'Saccharomyces Ferment Filtrate, Solanum Melongena (Eggplant) Fruit Extract, Aloe Barbadensis Flower Extract, ' +
  'Ocimum Sanctum Leaf Extract, Curcuma Longa (Turmeric) Root Extract, Corallina Officinalis Extract, ' +
  'Coccinia Indica Fruit Extract, Melia Azadirachta Leaf Extract, Melia Azadirachta Flower Extract, Tocopherol, ' +
  'Lecithin, Anhydroxylitol, Glyceryl Stearate Citrate, Ethylhexylglycerin, Xylitylglucoside, ' +
  'Pelargonium Graveolens Flower Oil, Citric Acid, Pentylene Glycol, Polyglyceryl-3 Distearate, Sodium Phytate, ' +
  'Sodium Citrate, Citronellol, Geraniol.'

const EN = {
  description:
    'The carton prints the dose of every hyaluronate beside its name, which almost nobody does. Sodium hyaluronate at 1,000.9 ppm, then seven more at 30 parts per billion. The one carrying the cream is the high molecular weight grade, the heavy form that stays on the surface and stops water leaving, and glycerin at 9% sits right behind it. Hydration measured 82% higher immediately after a single use and was still significantly up at 72 hours. Massage it in morning and night, after the serum. 50g and 250g.',
  productDetails: JSON.stringify({
    form: 'Leave-on moisturizing cream, tube',
    size: '50g homecare / 250g professional',
    function: 'Moisturizing',
    technology: 'Hyaluronan 11 Multi-Complex, led by 1,000.9 ppm of high molecular weight sodium hyaluronate',
    keyBenefits: 'Water in, water held, measured at 72 hours',
    usage: 'Morning and night, after the serum',
    skinType: 'Dry skin, and dehydrated skin of any type',
    application: 'Apply on the face and gently massage, as if laying a film of moisture',
    fragrance: 'Geranium flower oil, with citronellol and geraniol declared',
    storage: 'Cool and dry, but not the fridge',
    testing: 'Dermatologically tested',
    origin: 'Made in Korea by DTS MG',
  }),
  keyFeatures: JSON.stringify([
    {
      title: 'The doses are on the box',
      description:
        'Sodium hyaluronate at 1,000.9 ppm and seven more hyaluronates at 30 ppb, each printed beside its name on the carton.',
    },
    {
      title: 'High molecular weight',
      description:
        'The 1,000 ppm is the heavy grade, the one that films the surface and stops evaporation. The serum carries the light grade that goes in.',
    },
    {
      title: 'Glycerin 9% and PENTAVITIN 0.615%',
      description:
        'The humectant pair that pulls water toward the skin. Between them they are more than a tenth of the tube.',
    },
    {
      title: '+82% hydration, held for 72 hours',
      description:
        'Measured immediately after a single application and still significantly above baseline three days later.',
    },
  ]),
  benefits: JSON.stringify([
    'Sodium hyaluronate at 1,000.9 ppm, printed on the carton',
    'High molecular weight, so it seals rather than fills',
    'Glycerin 9% and PENTAVITIN 0.615% behind it',
    'Hydration up 82% immediately after one use',
    'Still significantly above baseline at 72 hours',
    'Morning and night after the serum. 50g and 250g. Dermatologically tested',
  ]),
  ingredients: JSON.stringify([
    {
      name: 'Hyaluronan 11 Multi-Complex',
      description:
        'Eleven molecular weight grades delivered across eight INCI entries, which is why the carton lists eight hyaluronates and the box says eleven. Both are true. One of the eight is at 1,000.9 ppm and the rest are at 30 parts per billion, and the carton prints all nine numbers.',
    },
    {
      name: 'Sodium Hyaluronate 1,000.9 ppm',
      description:
        'The high molecular weight fraction and the working dose. It forms the film on the surface that keeps water from evaporating, which is the half of the job a serum cannot do.',
    },
    {
      name: 'Glycerin 9%',
      description:
        'The quiet workhorse of this formula. Nearly a tenth of the tube, and more of it than every named complex added together.',
    },
    {
      name: 'PENTAVITIN 0.615%',
      description:
        'Saccharide isomerate, a plant-derived carbohydrate close to the ones already in the outer layer of skin. The manufacturer calls it the moisture magnet.',
    },
    {
      name: 'Tremella and the mushroom complex',
      description:
        'Snow fungus, turkey tail, cauliflower fungus, reishi and blackhood, all in the formula and all on the carton at around 0.17 parts per million each. Named because they are there, not because they are doing the hydrating.',
    },
    {
      name: 'Xylitol and erythritol',
      description:
        'The manufacturer names these two as the natural-origin cooling pair behind the fresh feel. They are at 0.012% and 0.010%, so what you notice is mostly the light watery texture.',
    },
    { name: 'Full INCI', description: FULL_INCI },
  ]),
  howToUse: [
    '1. Cleanse, then tone',
    '2. Moisture Replenishing Hyaluron Serum first, patted in',
    '3. Massage this cream over the face as if laying a film of moisture on the skin',
    '4. Last step at night. Sunscreen over it in the morning',
    '5. Do not store it in the fridge: cold changes the viscosity and the texture',
  ].join('\n'),
  directions:
    'Dermatologically tested. For dry skin and for dehydrated skin of any type. Contains geranium flower oil, with citronellol and geraniol declared. For external use only. Keep clear of the eye area. Stop and speak to a doctor if redness, swelling or irritation appears. Keep in a cool dry place, but not the fridge. Three years unopened, with the expiry date on the box.',
}

const AR = {
  description:
    'العلبة تطبع جرعة كل هيالورونات بجانب اسمه، وهو ما لا يفعله أحد تقريباً. صوديوم هيالورونات بنسبة ١٬٠٠٠٫٩ جزء بالمليون، ثم سبعة آخرين عند ٣٠ جزءاً بالمليار. الذي يحمل الكريم هو الدرجة عالية الوزن الجزيئي، الشكل الثقيل الذي يبقى على السطح ويمنع الماء من المغادرة، والجلسرين بنسبة ٩٪ يجلس خلفه مباشرة. قيس الترطيب أعلى بـ ٨٢٪ فور استخدام واحد وظلّ مرتفعاً بدلالة عند ٧٢ ساعة. دلّكيه صباحاً ومساءً بعد السيروم. ٥٠ غ و٢٥٠ غ.',
  productDetails: JSON.stringify({
    form: 'كريم ترطيب يُترك على البشرة، أنبوب',
    size: '٥٠ غ منزلي / ٢٥٠ غ احترافي',
    function: 'الترطيب',
    technology: 'مركب Hyaluronan 11، بقيادة ١٬٠٠٠٫٩ جزء بالمليون من صوديوم هيالورونات عالي الوزن الجزيئي',
    keyBenefits: 'الماء يدخل، والماء يبقى، مقاساً عند ٧٢ ساعة',
    usage: 'صباحاً ومساءً، بعد السيروم',
    skinType: 'البشرة الجافة، والبشرة المجفّفة من أي نوع',
    application: 'يوضع على الوجه ويُدلّك برفق، كأنك تضعين طبقة رطوبة',
    fragrance: 'زيت زهرة الجيرانيوم، مع سيترونيلول وجيرانيول مُصرّح بهما',
    storage: 'بارد وجاف، لكن ليس الثلاجة',
    testing: 'مختبر جلدياً',
    origin: 'صنع في كوريا من DTS MG',
  }),
  keyFeatures: JSON.stringify([
    {
      title: 'الجرعات على العلبة',
      description:
        'صوديوم هيالورونات عند ١٬٠٠٠٫٩ جزء بالمليون وسبعة هيالورونات أخرى عند ٣٠ جزءاً بالمليار، كل منها مطبوع بجانب اسمه على العلبة.',
    },
    {
      title: 'عالي الوزن الجزيئي',
      description:
        'الـ ١٬٠٠٠ جزء بالمليون هي الدرجة الثقيلة، التي تشكّل طبقة على السطح وتمنع التبخّر. السيروم يحمل الدرجة الخفيفة التي تدخل.',
    },
    {
      title: 'جلسرين ٩٪ وPENTAVITIN ٠٫٦١٥٪',
      description:
        'ثنائي الترطيب الذي يجذب الماء نحو البشرة. معاً هما أكثر من عُشر الأنبوب.',
    },
    {
      title: 'ترطيب +٨٢٪، يدوم ٧٢ ساعة',
      description:
        'مقاس فور تطبيق واحد وما زال أعلى بدلالة من خط الأساس بعد ثلاثة أيام.',
    },
  ]),
  benefits: JSON.stringify([
    'صوديوم هيالورونات بنسبة ١٬٠٠٠٫٩ جزء بالمليون، مطبوعة على العلبة',
    'عالي الوزن الجزيئي، فيختم بدل أن يملأ',
    'جلسرين ٩٪ وPENTAVITIN ٠٫٦١٥٪ خلفه',
    'الترطيب أعلى بـ ٨٢٪ فور استخدام واحد',
    'ما زال أعلى بدلالة من خط الأساس عند ٧٢ ساعة',
    'صباحاً ومساءً بعد السيروم. ٥٠ غ و٢٥٠ غ. مختبر جلدياً',
  ]),
  ingredients: JSON.stringify([
    {
      name: 'مركب Hyaluronan 11',
      description:
        'إحدى عشرة درجة وزن جزيئي موصلة عبر ثمانية مدخلات INCI، ولهذا تسرد العلبة ثمانية هيالورونات وتقول أحد عشر. كلاهما صحيح. واحد من الثمانية عند ١٬٠٠٠٫٩ جزء بالمليون والباقي عند ٣٠ جزءاً بالمليار، والعلبة تطبع الأرقام التسعة كلها.',
    },
    {
      name: 'صوديوم هيالورونات ١٬٠٠٠٫٩ جزء بالمليون',
      description:
        'الجزء عالي الوزن الجزيئي والجرعة العاملة. يشكّل الطبقة على السطح التي تمنع تبخّر الماء، وهو نصف المهمة الذي لا يستطيع السيروم أداءه.',
    },
    {
      name: 'جلسرين ٩٪',
      description:
        'حصان العمل الهادئ في هذه التركيبة. قرابة عُشر الأنبوب، وأكثر من كل مركّب مُسمّى مجتمعاً.',
    },
    {
      name: 'PENTAVITIN ٠٫٦١٥٪',
      description:
        'ساكاريد أيزوميريت، كربوهيدرات نباتية قريبة من تلك الموجودة أصلاً في الطبقة الخارجية للبشرة. المصنّع يسمّيها مغناطيس الرطوبة.',
    },
    {
      name: 'التريميلا ومركب الفطر',
      description:
        'فطر الثلج وذيل الديك الرومي وفطر القرنبيط والريشي والفطر الأسود، كلها في التركيبة وكلها على العلبة بنحو ٠٫١٧ جزء بالمليون لكل منها. مذكورة لأنها موجودة، لا لأنها تقوم بالترطيب.',
    },
    {
      name: 'الزايليتول والإريثريتول',
      description:
        'المصنّع يسمّي هذين الاثنين ثنائي التبريد طبيعي المصدر خلف الإحساس المنعش. هما عند ٠٫٠١٢٪ و٠٫٠١٠٪، فما تلاحظينه في الأغلب هو القوام المائي الخفيف.',
    },
    { name: 'Full INCI', description: FULL_INCI },
  ]),
  howToUse: JSON.stringify([
    { step: 'التنظيف', instruction: 'نظّفي ثم ضعي التونر' },
    { step: 'السيروم', instruction: 'Moisture Replenishing Hyaluron Serum أولاً، مربوتاً' },
    { step: 'التدليك', instruction: 'دلّكي هذا الكريم على الوجه كأنك تضعين طبقة رطوبة على البشرة' },
    { step: 'الختام', instruction: 'الخطوة الأخيرة ليلاً. واقي الشمس فوقه صباحاً' },
    { step: 'التخزين', instruction: 'لا تحفظيه في الثلاجة: البرودة تغيّر اللزوجة والقوام' },
  ]),
  directions:
    'مختبر جلدياً. للبشرة الجافة وللبشرة المجفّفة من أي نوع. يحتوي زيت زهرة الجيرانيوم، مع سيترونيلول وجيرانيول مُصرّح بهما. للاستخدام الخارجي فقط. أبعديه عن محيط العين. توقّفي واستشيري طبيباً إن ظهر احمرار أو تورم أو تهيّج. احفظيه في مكان بارد وجاف، لكن ليس الثلاجة. ثلاث سنوات دون فتح، وتاريخ الانتهاء على العلبة.',
}

const RU = {
  description:
    'Упаковка печатает дозу каждого гиалуроната рядом с его названием, чего почти никто не делает. Гиалуронат натрия — 1 000,9 ppm, дальше ещё семь по 30 частей на миллиард. Крем везёт высокомолекулярная градация, тяжёлая форма, которая остаётся на поверхности и не даёт воде уйти, а сразу за ней глицерин в 9%. Увлажнение измерено на 82% выше сразу после одного нанесения и оставалось значимо повышенным через 72 часа. Втирайте утром и вечером, после сыворотки. 50 г и 250 г.',
  productDetails: JSON.stringify({
    form: 'Несмываемый увлажняющий крем, туба',
    size: '50 г домашний / 250 г профессиональный',
    function: 'Увлажнение',
    technology: 'Комплекс Hyaluronan 11 во главе с 1 000,9 ppm высокомолекулярного гиалуроната натрия',
    keyBenefits: 'Вода внутрь, вода на месте, измерено на 72 часах',
    usage: 'Утром и вечером, после сыворотки',
    skinType: 'Сухая кожа и обезвоженная кожа любого типа',
    application: 'Нанести на лицо и мягко втереть, будто укладывая плёнку влаги',
    fragrance: 'Масло цветков герани, цитронеллол и гераниол задекларированы',
    storage: 'Прохладно и сухо, но не в холодильнике',
    testing: 'Дерматологически протестировано',
    origin: 'Сделано в Корее, DTS MG',
  }),
  keyFeatures: JSON.stringify([
    {
      title: 'Дозы напечатаны на коробке',
      description:
        'Гиалуронат натрия 1 000,9 ppm и ещё семь гиалуронатов по 30 ppb, каждый напечатан рядом со своим названием.',
    },
    {
      title: 'Высокомолекулярный',
      description:
        '1 000 ppm — это тяжёлая градация, та, что образует плёнку и не даёт воде испаряться. Лёгкую, уходящую внутрь, несёт сыворотка.',
    },
    {
      title: 'Глицерин 9% и PENTAVITIN 0,615%',
      description:
        'Пара увлажнителей, тянущая воду к коже. Вдвоём это больше десятой части тубы.',
    },
    {
      title: '+82% увлажнения, держится 72 часа',
      description:
        'Измерено сразу после одного нанесения и всё ещё значимо выше исходного через трое суток.',
    },
  ]),
  benefits: JSON.stringify([
    'Гиалуронат натрия 1 000,9 ppm, напечатано на упаковке',
    'Высокомолекулярный: запечатывает, а не наполняет',
    'Глицерин 9% и PENTAVITIN 0,615% следом',
    'Увлажнение выше на 82% сразу после одного нанесения',
    'Через 72 часа всё ещё значимо выше исходного',
    'Утром и вечером после сыворотки. 50 г и 250 г. Дерматологически протестировано',
  ]),
  ingredients: JSON.stringify([
    {
      name: 'Комплекс Hyaluronan 11',
      description:
        'Одиннадцать градаций по молекулярной массе, доставленных через восемь позиций INCI: поэтому на упаковке восемь гиалуронатов, а на коробке цифра одиннадцать. Верно и то, и другое. Одна из восьми стоит на 1 000,9 ppm, остальные на 30 частях на миллиард, и упаковка печатает все девять чисел.',
    },
    {
      name: 'Гиалуронат натрия 1 000,9 ppm',
      description:
        'Высокомолекулярная фракция и рабочая доза. Образует на поверхности плёнку, которая не даёт воде испаряться, — та половина работы, которую сыворотка сделать не может.',
    },
    {
      name: 'Глицерин 9%',
      description:
        'Тихая рабочая лошадь этой формулы. Почти десятая часть тубы, и его больше, чем всех именованных комплексов вместе взятых.',
    },
    {
      name: 'PENTAVITIN 0,615%',
      description:
        'Сахаридный изомерат, растительный углевод, близкий к тем, что уже есть во внешнем слое кожи. Производитель называет его магнитом влаги.',
    },
    {
      name: 'Тремелла и грибной комплекс',
      description:
        'Серебряное ухо, трутовик разноцветный, спарассис, рейши и феллинус — все в составе и все на упаковке, примерно по 0,17 части на миллион каждый. Названы потому, что они там, а не потому, что они увлажняют.',
    },
    {
      name: 'Ксилитол и эритритол',
      description:
        'Производитель называет эту пару охлаждающими агентами природного происхождения, отвечающими за свежесть. Они на уровне 0,012% и 0,010%, так что заметна в основном лёгкая водянистая текстура.',
    },
    { name: 'Full INCI', description: FULL_INCI },
  ]),
  howToUse: JSON.stringify([
    { step: 'Очищение', instruction: 'Очистите, затем тоник' },
    { step: 'Сыворотка', instruction: 'Moisture Replenishing Hyaluron Serum первой, вбить' },
    { step: 'Втереть', instruction: 'Втирайте крем по лицу, будто укладываете плёнку влаги на кожу' },
    { step: 'Завершение', instruction: 'Вечером последний шаг. Утром поверх — SPF' },
    { step: 'Хранение', instruction: 'Не храните в холодильнике: холод меняет вязкость и текстуру' },
  ]),
  directions:
    'Дерматологически протестировано. Для сухой кожи и для обезвоженной кожи любого типа. Содержит масло цветков герани, цитронеллол и гераниол задекларированы. Только для наружного применения. Держите подальше от области вокруг глаз. Прекратите использование и обратитесь к врачу при покраснении, отёке или раздражении. Храните в прохладном сухом месте, но не в холодильнике. Три года в закрытом виде, дата окончания срока — на коробке.',
}

async function main() {
  const p = await prisma.product.findFirst({
    where: { OR: [{ productNumber: '29' }, { id: '29' }] },
    select: { id: true, name: true },
  })
  if (!p) throw new Error('product 29 not found')

  await prisma.product.update({
    where: { id: p.id },
    data: {
      productNumber: '29',
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
    where: { productNumber: '29' },
    select: { productNumber: true, ingredients: true, benefits: true },
  })
  console.log('productNumber:', after?.productNumber)
  console.log('INCI has 1,2-Hexanediol:', after?.ingredients?.includes('1,2-Hexanediol'))
  console.log('INCI prints ppm:', after?.ingredients?.includes('1,000.9 ppm'))
  console.log('no anti-inflammatory:', !after?.ingredients?.includes('anti-inflammatory'))
  console.log('no elasticity claim:', !after?.benefits?.includes('elasticity'))
  console.log('done')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())

export { AR, RU }
