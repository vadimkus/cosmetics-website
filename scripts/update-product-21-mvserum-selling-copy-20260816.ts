/**
 * Rewrite MULTI VITA RADIANCE SERUM (product 21) against the Intertek dossier
 * and the DTS MG deck. See components/product/mvserum/mvserumCopy.ts.
 *
 * What this fixes:
 *   - The full INCI dropped the ppm and ppb figures the carton prints beside
 *     every vitamin, and dropped 1,2-Hexanediol and 3-O-Ethyl Ascorbic Acid
 *     entirely. Those are the most useful numbers on the list.
 *   - Glutathione was a key ingredient card described as a powerful
 *     antioxidant. The carton prints it at 1 ppb.
 *   - Gluconolactone was a key ingredient card described as a gentle
 *     exfoliating acid. It is at 10 ppb.
 *   - "Suitable for all skin types with anti-inflammatory properties", on a
 *     vitamin serum whose own manufacturer warns it may sting.
 *   - "Visible improvements within 4-6 weeks". The study measured two weeks.
 *   - "Gently massage in upward motions". The carton says pat.
 *   - No pregnancy warning anywhere, though the carton carries one on the
 *     Turkish panel.
 *   - productNumber was null, so the record resolved through its id.
 *
 * Kept, because documented in the deck or on the carton: MELAZERO by name and
 * composition, the Multi Vita 12 count, niacinamide as the registered
 * functional active, the two-week melanin figure and the 21-woman panel.
 */
import { PrismaClient } from '@prisma/client'

const url = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL || ''
const prisma = new PrismaClient({ accelerateUrl: url } as never)

const FULL_INCI =
  'Aqua (Water), Butylene Glycol, Glycerin, 1,2-Hexanediol, Niacinamide (20,000 ppm), Dipropylene Glycol, Sorbitol, ' +
  'Methyl Gluceth-10, Panthenol (10,000 ppm), Eriobotrya Japonica Leaf Extract, Mentha Viridis (Spearmint) Extract, ' +
  '3-O-Ethyl Ascorbic Acid (1,000 ppm), Tocopherol (300 ppm), Sodium Ascorbyl Phosphate (50 ppb), ' +
  'Glutathione (1 ppb), Biotin (1 ppb), Folic Acid (1 ppb), Pyridoxine (1 ppb), Cyanocobalamin (0.1 ppb), ' +
  'Linoleic Acid (0.01 ppb), Riboflavin (0.01 ppb), Beta-Carotene (0.01 ppb), Inositol (0.01 ppb), ' +
  'Thiamine HCl (0.01 ppb), Glycyrrhiza Uralensis (Licorice) Root Extract, Centella Asiatica Extract, ' +
  'Andrographis Paniculata Extract, Propolis Extract, Forsythia Suspensa Fruit Extract, ' +
  'Aloe Barbadensis Leaf Extract, Nelumbo Nucifera Seed Extract, Arctium Lappa Seed Extract, ' +
  'Lonicera Japonica (Honeysuckle) Flower Extract, Anemarrhena Asphodeloides Root Extract, ' +
  'Coptis Chinensis Root Extract, Psidium Guajava Leaf Extract, Sasa Quelpaertensis Extract, ' +
  'Opuntia Ficus-Indica Stem Extract, Gluconolactone, Brassica Campestris (Rapeseed) Sterols, Cholesterol, ' +
  'Ethylhexylglycerin, Macadamia Ternifolia Seed Oil, Citrus Aurantium Bergamia (Bergamot) Fruit Oil, ' +
  'Hydrogenated Lecithin, Carbomer, Xanthan Gum, Propanediol, Disodium EDTA, Tromethamine, ' +
  'Potassium Cetyl Phosphate, Acrylates/C10-30 Alkyl Acrylate Crosspolymer, ' +
  'Phytosteryl/Behenyl/Octyldodecyl Lauroyl Glutamate, Polyglyceryl-10 Oleate, Polyglyceryl-10 Stearate, ' +
  'Polyglyceryl-10 Laurate, C12-14 Pareth-7, Limonene, Linalool.'

const EN = {
  description:
    'Twelve vitamins, and the carton prints the dose beside every one of them. Niacinamide at 20,000 ppm, panthenol at 10,000, stable vitamin C at 1,000, vitamin E at 300, and then eleven more measured in parts per billion. Korea registers this as a whitening functional cosmetic with niacinamide named as the active. MELAZERO, the patented complex, is loquat leaf and spearmint. In the maker\'s two-week trial, surface melanin fell 28.0%. Pat it in morning and night, and wear sunscreen over it by day.',
  productDetails: JSON.stringify({
    form: 'Leave-on face serum, dropper bottle',
    size: '30ml',
    function: 'Skin brightening',
    registeredActive: 'Niacinamide, named on the Korean registration',
    technology: 'Niacinamide 20,000 ppm with MELAZERO®, from loquat leaf and spearmint',
    keyBenefits: 'Even tone, brightness, comfort while doing it',
    usage: 'Morning and night, with sunscreen by day',
    skinType: 'Dull or uneven tone. Build up slowly if you sting easily',
    application: 'Two or three drops on the face, patted in',
    fragrance: 'Bergamot fruit oil, with limonene and linalool',
    pregnancy: 'Not for use during pregnancy, per the carton',
    testing: 'Dermatologically tested',
    origin: 'Made in Korea by DTS MG',
  }),
  keyFeatures: JSON.stringify([
    {
      title: 'Niacinamide 20,000 ppm',
      description:
        'Two percent, printed on the carton, and the functional active named on the Korean whitening registration.',
    },
    {
      title: 'The doses are on the box',
      description:
        'Fifteen vitamins and vitamin-adjacent actives, each with its ppm or ppb figure printed beside it. Four are working doses, eleven are traces.',
    },
    {
      title: 'MELAZERO®, and not a trace',
      description:
        'The patented complex is loquat leaf extract at 0.04% and spearmint at 0.01%, which is four hundred and one hundred parts per million.',
    },
    {
      title: 'Minus 28.0% at two weeks',
      description:
        'Skin surface melanin fell from 6.190 to 4.457 in the manufacturer\'s trial, measured after two weeks of use.',
    },
  ]),
  benefits: JSON.stringify([
    'Niacinamide at 20,000 ppm, printed on the carton',
    'The registered whitening active in Korea',
    'MELAZERO®, patented, from loquat leaf and spearmint',
    'Panthenol at 10,000 ppm so the tone work stays comfortable',
    'Surface melanin down 28.0% at two weeks in the maker\'s trial',
    'Pat it in morning and night. Sunscreen over it by day',
  ]),
  ingredients: JSON.stringify([
    {
      name: 'Niacinamide 20,000 ppm',
      description:
        'Two percent, and the largest active in the bottle. Korea registers this serum as a whitening functional cosmetic and names niacinamide as the functional ingredient, so this is not a supporting act.',
    },
    {
      name: 'MELAZERO® · loquat 0.04%, spearmint 0.01%',
      description:
        'The patented melanin complex. Unusually for a branded name it is not a trace: the two botanicals sit at four hundred and one hundred parts per million respectively, in a glycol carrier.',
    },
    {
      name: 'Panthenol 10,000 ppm',
      description:
        'One percent of provitamin B5, printed on the carton. It is the comfort half, and the reason a serum this loaded with actives can still read as a glow.',
    },
    {
      name: '3-O-Ethyl Ascorbic Acid 1,000 ppm',
      description:
        'A tenth of a percent of one of the more stable vitamin C derivatives. A real but modest dose, working at the synthesis end alongside MELAZERO.',
    },
    {
      name: 'The other eleven vitamins, 1 ppb and below',
      description:
        'Glutathione, biotin, folic acid, B6, B12, B1, B2, beta-carotene, inositol and linoleic acid, each printed on the carton with its dose. They complete the count of twelve. They are not doing the work.',
    },
    {
      name: 'Licorice, centella, andrographis, propolis',
      description:
        'Four botanicals at 0.01% each, with six more at 0.0015%. Present and listed, and named here rather than credited with an effect.',
    },
    { name: 'Full INCI', description: FULL_INCI },
  ]),
  howToUse: [
    '1. Cleanse and tone first',
    '2. Two or three drops on the face, avoiding the eye area',
    '3. Pat it in with your fingers rather than rubbing',
    '4. Start with a small amount. It contains active vitamins and may sting at first; if that continues rather than settling, stop',
    '5. Sunscreen over it in daylight, every day',
    '6. Close the cap and keep it cool. The colour can darken with air without the effect changing',
  ].join('\n'),
  directions:
    'Dermatologically tested. Not for use during pregnancy. Contains bergamot fruit oil, with limonene and linalool. For external use only. Keep clear of the eye area. Stop and speak to a doctor if redness, swelling or irritation appears. Store cool and dark with the cap closed.',
}

const AR = {
  description:
    'اثنا عشر فيتاميناً، والعلبة تطبع الجرعة بجانب كل واحد منها. نياسيناميد عند ٢٠٬٠٠٠ جزء بالمليون، بانثينول عند ١٠٬٠٠٠، فيتامين C مستقر عند ١٬٠٠٠، فيتامين E عند ٣٠٠، ثم أحد عشر آخرون مقاسون بالأجزاء بالمليار. كوريا تسجّله كمستحضر تجميل وظيفي للتفتيح مع تسمية النياسيناميد فعّالاً. وMELAZERO، المركّب الحاصل على براءة، هو لحاء البشملة والنعناع. في تجربة المصنّع خلال أسبوعين انخفض ميلانين السطح ٢٨٫٠٪. ربّتيه صباحاً ومساءً، وضعي واقي الشمس فوقه نهاراً.',
  productDetails: JSON.stringify({
    form: 'سيروم وجه يُترك على البشرة، زجاجة بقطارة',
    size: '٣٠ مل',
    function: 'تفتيح البشرة',
    registeredActive: 'نياسيناميد، مذكور في التسجيل الكوري',
    technology: 'نياسيناميد ٢٠٬٠٠٠ جزء بالمليون مع MELAZERO® من لحاء البشملة والنعناع',
    keyBenefits: 'لون متجانس، إشراق، وراحة أثناء ذلك',
    usage: 'صباحاً ومساءً، مع واقي الشمس نهاراً',
    skinType: 'لون باهت أو غير متجانس. تدرّجي ببطء إن كانت بشرتك تلسع',
    application: 'قطرتان أو ثلاث على الوجه، بالتربيت',
    fragrance: 'زيت ثمرة البرغموت، مع ليمونين ولينالول',
    pregnancy: 'لا يُستخدم أثناء الحمل، بحسب العلبة',
    testing: 'مختبر جلدياً',
    origin: 'صنع في كوريا من DTS MG',
  }),
  keyFeatures: JSON.stringify([
    {
      title: 'نياسيناميد ٢٠٬٠٠٠ جزء بالمليون',
      description:
        'اثنان بالمئة، مطبوعة على العلبة، والفعّال الوظيفي المذكور في التسجيل الكوري للتفتيح.',
    },
    {
      title: 'الجرعات على العلبة',
      description:
        'خمسة عشر فيتاميناً وما يشبهها، كل منها برقمه بالأجزاء بالمليون أو المليار مطبوعاً بجانبه. أربعة جرعات عاملة وأحد عشر أثرية.',
    },
    {
      title: 'MELAZERO®، وليس أثرياً',
      description:
        'المركّب الحاصل على براءة هو مستخلص لحاء البشملة عند ٠٫٠٤٪ والنعناع عند ٠٫٠١٪، أي أربعمئة ومئة جزء بالمليون.',
    },
    {
      title: 'ناقص ٢٨٫٠٪ خلال أسبوعين',
      description:
        'ميلانين سطح البشرة انخفض من ٦٫١٩٠ إلى ٤٫٤٥٧ في تجربة المصنّع، مقاساً بعد أسبوعين من الاستخدام.',
    },
  ]),
  benefits: JSON.stringify([
    'نياسيناميد عند ٢٠٬٠٠٠ جزء بالمليون، مطبوعة على العلبة',
    'الفعّال المسجّل للتفتيح في كوريا',
    'MELAZERO® الحاصل على براءة، من لحاء البشملة والنعناع',
    'بانثينول عند ١٠٬٠٠٠ جزء بالمليون ليبقى العمل على اللون مريحاً',
    'ميلانين السطح أقل بـ ٢٨٫٠٪ خلال أسبوعين في تجربة المصنّع',
    'ربّتيه صباحاً ومساءً. واقي الشمس فوقه نهاراً',
  ]),
  ingredients: JSON.stringify([
    {
      name: 'نياسيناميد ٢٠٬٠٠٠ جزء بالمليون',
      description:
        'اثنان بالمئة، وأكبر فعّال في الزجاجة. كوريا تسجّل هذا السيروم كمستحضر تجميل وظيفي للتفتيح وتسمّي النياسيناميد المكوّن الوظيفي، فهو ليس دوراً مساعداً.',
    },
    {
      name: 'MELAZERO® · بشملة ٠٫٠٤٪، نعناع ٠٫٠١٪',
      description:
        'مركّب الميلانين الحاصل على براءة. وبخلاف معظم الأسماء التجارية ليس أثرياً: النبتتان عند أربعمئة ومئة جزء بالمليون على التوالي، في حامل جلايكولي.',
    },
    {
      name: 'بانثينول ١٠٬٠٠٠ جزء بالمليون',
      description:
        'واحد بالمئة من بروفيتامين B5، مطبوع على العلبة. هو نصف الراحة، والسبب في أن سيروماً بهذا الحِمل من الفعّالات ما زال يُقرأ كإشراقة.',
    },
    {
      name: '3-O-Ethyl Ascorbic Acid ١٬٠٠٠ جزء بالمليون',
      description:
        'عُشر بالمئة من أحد أكثر مشتقات فيتامين C استقراراً. جرعة حقيقية لكن متواضعة، تعمل عند طرف التصنيع إلى جانب MELAZERO.',
    },
    {
      name: 'الأحد عشر فيتاميناً الآخرون، جزء بالمليار فأقل',
      description:
        'الجلوتاثيون والبيوتين وحمض الفوليك وB6 وB12 وB1 وB2 وبيتا كاروتين والإينوزيتول وحمض اللينوليك، كلٌّ مطبوع على العلبة بجرعته. يكملون عدد الاثني عشر. ولا يقومون بالعمل.',
    },
    {
      name: 'السوس والسنتيلا والكالميغ والبروبوليس',
      description:
        'أربعة نباتات عند ٠٫٠١٪ لكل منها، ومعها ستة أخرى عند ٠٫٠٠١٥٪. موجودة ومذكورة، ومسمّاة هنا لا منسوباً إليها أثر.',
    },
    { name: 'Full INCI', description: FULL_INCI },
  ]),
  howToUse: JSON.stringify([
    { step: 'التنظيف', instruction: 'نظّفي وضعي التونر أولاً' },
    { step: 'الجرعة', instruction: 'قطرتان أو ثلاث على الوجه، مع تجنّب محيط العين' },
    { step: 'التربيت', instruction: 'ربّتيه بأصابعك بدل الفرك' },
    { step: 'التدرّج', instruction: 'ابدئي بكمية صغيرة. يحتوي فيتامينات نشطة وقد يلسع في البداية؛ وإن استمر بدل أن يهدأ، توقّفي' },
    { step: 'واقي الشمس', instruction: 'واقي الشمس فوقه نهاراً، كل يوم' },
    { step: 'التخزين', instruction: 'أغلقي الغطاء واحفظيه بارداً. اللون قد يغمق مع الهواء دون أن يتغيّر الأثر' },
  ]),
  directions:
    'مختبر جلدياً. لا يُستخدم أثناء الحمل. يحتوي زيت ثمرة البرغموت، مع ليمونين ولينالول. للاستخدام الخارجي فقط. أبعديه عن محيط العين. توقّفي واستشيري طبيباً إن ظهر احمرار أو تورم أو تهيّج. احفظيه بارداً ومظلماً والغطاء مغلق.',
}

const RU = {
  description:
    'Двенадцать витаминов, и упаковка печатает дозу рядом с каждым. Ниацинамид 20 000 ppm, пантенол 10 000, стабильный витамин C 1 000, витамин E 300, а дальше ещё одиннадцать, измеренных в частях на миллиард. Корея регистрирует средство как отбеливающее функциональное с ниацинамидом в качестве актива. MELAZERO, запатентованный комплекс, — это лист мушмулы и мята. В двухнедельном исследовании производителя поверхностный меланин снизился на 28,0%. Вбивайте утром и вечером, днём наносите сверху SPF.',
  productDetails: JSON.stringify({
    form: 'Несмываемая сыворотка для лица, флакон с пипеткой',
    size: '30 мл',
    function: 'Осветление кожи',
    registeredActive: 'Ниацинамид, назван в корейской регистрации',
    technology: 'Ниацинамид 20 000 ppm с MELAZERO® из листа мушмулы и мяты',
    keyBenefits: 'Ровный тон, сияние и комфорт по ходу дела',
    usage: 'Утром и вечером, днём с SPF',
    skinType: 'Тусклый или неровный тон. Наращивайте постепенно, если кожа реагирует',
    application: 'Две-три капли на лицо, вбить',
    fragrance: 'Масло плодов бергамота, с лимоненом и линалоолом',
    pregnancy: 'Не применять во время беременности, согласно упаковке',
    testing: 'Дерматологически протестировано',
    origin: 'Сделано в Корее, DTS MG',
  }),
  keyFeatures: JSON.stringify([
    {
      title: 'Ниацинамид 20 000 ppm',
      description:
        'Два процента, напечатано на упаковке, и функциональный актив, названный в корейской осветляющей регистрации.',
    },
    {
      title: 'Дозы напечатаны на коробке',
      description:
        'Пятнадцать витаминов и близких к ним активов, у каждого рядом стоит своя цифра в ppm или ppb. Четыре — рабочие дозы, одиннадцать — следы.',
    },
    {
      title: 'MELAZERO®, и это не след',
      description:
        'Запатентованный комплекс — экстракт листа мушмулы 0,04% и мята 0,01%, то есть четыреста и сто частей на миллион.',
    },
    {
      title: 'Минус 28,0% за две недели',
      description:
        'Поверхностный меланин снизился с 6,190 до 4,457 в исследовании производителя, измерение через две недели применения.',
    },
  ]),
  benefits: JSON.stringify([
    'Ниацинамид 20 000 ppm, напечатано на упаковке',
    'Зарегистрированный в Корее осветляющий актив',
    'MELAZERO®, запатентован, из листа мушмулы и мяты',
    'Пантенол 10 000 ppm, чтобы работа над тоном оставалась комфортной',
    'Поверхностный меланин ниже на 28,0% за две недели у производителя',
    'Вбивайте утром и вечером. Днём сверху SPF',
  ]),
  ingredients: JSON.stringify([
    {
      name: 'Ниацинамид 20 000 ppm',
      description:
        'Два процента и самый крупный актив во флаконе. Корея регистрирует эту сыворотку как отбеливающее функциональное средство и называет ниацинамид функциональным ингредиентом, так что это не роль второго плана.',
    },
    {
      name: 'MELAZERO® · мушмула 0,04%, мята 0,01%',
      description:
        'Запатентованный меланиновый комплекс. В отличие от большинства брендированных названий, здесь это не след: два растения на уровне четырёхсот и ста частей на миллион, в гликолевом носителе.',
    },
    {
      name: 'Пантенол 10 000 ppm',
      description:
        'Один процент провитамина B5, напечатано на упаковке. Это половина комфорта и причина, по которой настолько заряженная активами сыворотка всё же читается как сияние.',
    },
    {
      name: '3-O-Ethyl Ascorbic Acid 1 000 ppm',
      description:
        'Одна десятая процента одного из более стабильных производных витамина C. Реальная, но скромная доза, работающая на этапе синтеза рядом с MELAZERO.',
    },
    {
      name: 'Остальные одиннадцать витаминов, 1 ppb и ниже',
      description:
        'Глутатион, биотин, фолиевая кислота, B6, B12, B1, B2, бета-каротин, инозитол и линолевая кислота, каждый напечатан на упаковке со своей дозой. Они дополняют счёт до двенадцати. Работу делают не они.',
    },
    {
      name: 'Солодка, центелла, андрографис, прополис',
      description:
        'Четыре растения по 0,01% каждое, и ещё шесть по 0,0015%. Присутствуют и указаны; названы здесь, а не наделены эффектом.',
    },
    { name: 'Full INCI', description: FULL_INCI },
  ]),
  howToUse: JSON.stringify([
    { step: 'Очищение', instruction: 'Сначала очищение и тоник' },
    { step: 'Доза', instruction: 'Две-три капли на лицо, избегая области вокруг глаз' },
    { step: 'Вбить', instruction: 'Вбейте пальцами, а не растирайте' },
    { step: 'Постепенно', instruction: 'Начните с малого количества. Средство содержит активные витамины и поначалу может пощипывать; если это не проходит, прекратите' },
    { step: 'SPF', instruction: 'Днём сверху солнцезащита, каждый день' },
    { step: 'Хранение', instruction: 'Закрывайте крышку и держите в прохладе. Цвет может потемнеть от воздуха, действие при этом не меняется' },
  ]),
  directions:
    'Дерматологически протестировано. Не применять во время беременности. Содержит масло плодов бергамота, с лимоненом и линалоолом. Только для наружного применения. Держите подальше от области вокруг глаз. Прекратите использование и обратитесь к врачу при покраснении, отёке или раздражении. Храните в прохладе и темноте с закрытой крышкой.',
}

async function main() {
  const p = await prisma.product.findFirst({
    where: { OR: [{ productNumber: '21' }, { id: '21' }] },
    select: { id: true, name: true },
  })
  if (!p) throw new Error('product 21 not found')

  await prisma.product.update({
    where: { id: p.id },
    data: {
      productNumber: '21',
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

  const a = await prisma.product.findFirst({
    where: { productNumber: '21' },
    select: { productNumber: true, ingredients: true, benefits: true, directions: true },
  })
  console.log('productNumber:', a?.productNumber)
  console.log('INCI prints 20,000 ppm:', a?.ingredients?.includes('(20,000 ppm)'))
  console.log('INCI has 1,2-Hexanediol:', a?.ingredients?.includes('1,2-Hexanediol'))
  console.log('glutathione shown as 1 ppb:', a?.ingredients?.includes('Glutathione (1 ppb)'))
  console.log('pregnancy warning present:', a?.directions?.includes('pregnancy'))
  console.log('no anti-inflammatory:', !a?.benefits?.includes('anti-inflammatory'))
  console.log('done')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())

export { AR, RU }
