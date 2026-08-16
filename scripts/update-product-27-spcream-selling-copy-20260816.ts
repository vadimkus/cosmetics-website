/**
 * Rewrite SKIN BARRIER PROTECTING CREAM (product 27) against the Intertek
 * dossier. See components/product/spcream/spcreamCopy.ts for the sourcing.
 *
 * What this fixes:
 *   - MultiEx BSASM Plus was the productDetails technology line. The safety
 *     assessment records it at 0.0001%, ten thousand times less than in the
 *     All For Sensitive Serum, which is the product actually built on it.
 *   - The full INCI was missing 1,2-Hexanediol at 2%, and missing the
 *     C18-C21 Alkane the carton prints. Replaced with the carton list.
 *   - "Barrier Repair" as a benefit. The product is called Protecting and
 *     the carton says protecting.
 *   - "All skin types". The carton and the Turkish panel say sensitive and
 *     dry skin.
 *   - Macadamia oil written up as a featured restorative active. It is at
 *     0.0001%.
 *   - "Visible improvement in skin barrier function within 2-4 weeks".
 *     There is no efficacy study on file for this product at all.
 *   - "Gently massage in upward motions". The carton says pat.
 *   - directions read "dermatologically tested and dermatologically tested".
 *   - productNumber was null, so the record resolved through its id.
 */
import { PrismaClient } from '@prisma/client'

const url = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL || ''
const prisma = new PrismaClient({ accelerateUrl: url } as never)

const FULL_INCI =
  'Aqua (Water), Glycerin, Hydrogenated Polydecene, Caprylic/Capric/Myristic/Stearic Triglyceride, Propanediol, ' +
  'Butyrospermum Parkii (Shea) Butter, 1,2-Hexanediol, Hydrogenated Lecithin, Cetearyl Alcohol, Polysorbate 60, ' +
  'Dimethicone, Ceramide NP, Glycine, Serine, Glutamic Acid, Aspartic Acid, Leucine, Alanine, Arginine, Lysine, ' +
  'Tyrosine, Phenylalanine, Valine, Threonine, Proline, Isoleucine, Histidine, Methionine, Cysteine, ' +
  'Centella Asiatica Extract, Polygonum Cuspidatum Root Extract, Scutellaria Baicalensis Root Extract, ' +
  'Camellia Sinensis Leaf Extract, Glycyrrhiza Glabra (Licorice) Root Extract, ' +
  'Rosmarinus Officinalis (Rosemary) Leaf Extract, Chamomilla Recutita (Matricaria) Flower Extract, ' +
  'Macadamia Ternifolia Seed Oil, Limnanthes Alba (Meadowfoam) Seed Oil, Palmitic Acid, Glyceryl Stearate, ' +
  'PEG-100 Stearate, Stearic Acid, Sodium Polyacrylate, Sorbitan Stearate, C18-C21 Alkane, Trideceth-6, ' +
  'Disodium EDTA, Myristic Acid, Fragrance, Butylene Glycol.'

const EN = {
  description:
    'Ceramide NP at 0.5%, and the Korean panel on the carton prints the number in brackets: 5,000 ppm. Most creams that put ceramide on the front use it one or two orders of magnitude lower. Behind it, glycerin at 17.49% and shea butter at 3%, which makes this the richest of the three GENOSYS face creams and the one for skin that is sensitive and dry rather than dehydrated or oily. The carton asks you to pat it in, not rub it. 100g, morning and night.',
  productDetails: JSON.stringify({
    form: 'Leave-on face cream, tube',
    size: '100g',
    function: 'Soothing, hydrating',
    technology: 'Ceramide NP at 0.5%, printed on the carton as 5,000 ppm',
    keyBenefits: 'Barrier support, comfort, moisture that holds on dry skin',
    usage: 'Morning and night, patted in',
    skinType: 'Sensitive and dry skin',
    application: 'Apply on the face and gently pat with fingers',
    fragrance: 'Mild lavender, with linalool and coumarin',
    testing: 'Dermatologically tested',
    origin: 'Made in Korea by DTS MG',
  }),
  keyFeatures: JSON.stringify([
    {
      title: 'Ceramide NP 0.5%',
      description:
        'Five thousand parts per million, and the Korean side of the carton prints the figure. This is the ingredient the product is named for.',
    },
    {
      title: 'Glycerin 17.49%',
      description:
        'Nearly a fifth of the tube, from two separate raw materials. More than every other named ingredient added together.',
    },
    {
      title: 'The richest of the three creams',
      description:
        '49.9% water against 72.4% in the Hyaluron Cream and 86.6% in the Problem Control. Shea butter at 3% is the difference you feel.',
    },
    {
      title: 'Seventeen amino acids',
      description:
        'A named premix in the shape of skin\'s own natural moisturizing factor, at about nine parts per million between them.',
    },
  ]),
  benefits: JSON.stringify([
    'Ceramide NP at 0.5%, printed on the carton as 5,000 ppm',
    'Glycerin 17.49% and shea butter 3%',
    'Soothing and hydrating, the registered function',
    'For sensitive and dry skin',
    'Pat it in morning and night, as the carton asks',
    '100g. Dermatologically tested. Made in Korea by DTS MG',
  ]),
  ingredients: JSON.stringify([
    {
      name: 'Ceramide NP 0.5%',
      description:
        'The active, at 5,000 parts per million, printed on the Korean side of the carton. It arrives inside a 10% premix that also carries glycerin and hydrogenated lecithin. Ceramides are part of the mortar between skin cells and this is a serious dose of one.',
    },
    {
      name: 'Glycerin 17.49%',
      description:
        'Nearly a fifth of the tube, arriving from two separate raw materials. The quiet reason this cream holds water on skin that has stopped holding its own.',
    },
    {
      name: 'Shea butter 3% and the ester blend',
      description:
        'Shea at 3%, hydrogenated polydecene at 7.18%, a four-chain triglyceride at 6% and dimethicone at 1%. The occlusive half, and why this feels nothing like the other two creams in the range.',
    },
    {
      name: 'Seventeen amino acids, 0.00093%',
      description:
        'Glycine, serine, glutamic acid, aspartic acid and thirteen more, as a named premix. Skin builds its own moisturizing factor from these; here they are present rather than dominant.',
    },
    {
      name: 'MultiEx BSASM® Plus 0.0001%',
      description:
        'The same seven-botanical complex the All For Sensitive Serum is built around, at one ten-thousandth of that dose. Centella, chamomile, licorice, green tea and the rest are here. They are not why this cream works.',
    },
    {
      name: 'Mild lavender fragrance 0.0107%',
      description:
        'A named lavender accord, which brings linalool and coumarin with it. Worth knowing if you avoid fragrance, because this cream is aimed at sensitive skin and still has one.',
    },
    { name: 'Full INCI', description: FULL_INCI },
  ]),
  howToUse: [
    '1. Cleanse and tone gently. Skin that feels thin does not want a scrub first',
    '2. All For Sensitive Serum is the step before this one',
    '3. Apply on the face and gently pat with your fingers. Do not rub',
    '4. A second press over the dry or stressed patches',
    '5. Morning and night. Keep it clear of the eye area',
  ].join('\n'),
  directions:
    'Dermatologically tested. For sensitive and dry skin. Contains a mild lavender fragrance, with linalool and coumarin. For external use only. Keep clear of the eye area. Stop and speak to a doctor if redness, swelling or irritation appears. Keep in a cool dry place, out of reach of children. Three years unopened, with the expiry date on the box.',
}

const AR = {
  description:
    'سيراميد NP بنسبة ٠٫٥٪، واللوحة الكورية على العلبة تطبع الرقم بين قوسين: ٥٬٠٠٠ جزء بالمليون. معظم الكريمات التي تضع السيراميد على الواجهة تستخدمه بمرتبة أو مرتبتين أقل. خلفه جلسرين بنسبة ١٧٫٤٩٪ وزبدة شيا ٣٪، ما يجعله أغنى كريمات الوجه الثلاثة من جينوسيس والكريم المخصّص للبشرة الحساسة والجافة لا المجفّفة ولا الدهنية. العلبة تطلب أن تربّتيه لا أن تفركيه. ١٠٠ غ، صباحاً ومساءً.',
  productDetails: JSON.stringify({
    form: 'كريم وجه يُترك على البشرة، أنبوب',
    size: '١٠٠ غ',
    function: 'التهدئة والترطيب',
    technology: 'سيراميد NP بنسبة ٠٫٥٪، مطبوعة على العلبة كـ ٥٬٠٠٠ جزء بالمليون',
    keyBenefits: 'دعم الحاجز، الراحة، ترطيب يدوم على البشرة الجافة',
    usage: 'صباحاً ومساءً، بالتربيت',
    skinType: 'البشرة الحساسة والجافة',
    application: 'يوضع على الوجه ويُربّت برفق بالأصابع',
    fragrance: 'لافندر خفيف، مع لينالول وكومارين',
    testing: 'مختبر جلدياً',
    origin: 'صنع في كوريا من DTS MG',
  }),
  keyFeatures: JSON.stringify([
    {
      title: 'سيراميد NP ٠٫٥٪',
      description:
        'خمسة آلاف جزء بالمليون، والجانب الكوري من العلبة يطبع الرقم. هذا هو المكوّن الذي سُمّي المنتج باسمه.',
    },
    {
      title: 'جلسرين ١٧٫٤٩٪',
      description:
        'قرابة خُمس الأنبوب، من مادّتين خامّتين منفصلتين. أكثر من كل مكوّن مُسمّى آخر مجتمعاً.',
    },
    {
      title: 'أغنى الكريمات الثلاثة',
      description:
        '٤٩٫٩٪ ماء مقابل ٧٢٫٤٪ في Hyaluron Cream و٨٦٫٦٪ في Problem Control. زبدة الشيا ٣٪ هي الفرق الذي تحسّينه.',
    },
    {
      title: 'سبعة عشر حمضاً أمينياً',
      description:
        'خليط مُسمّى على هيئة عامل الترطيب الطبيعي للبشرة، بنحو تسعة أجزاء بالمليون بينها جميعاً.',
    },
  ]),
  benefits: JSON.stringify([
    'سيراميد NP بنسبة ٠٫٥٪، مطبوعة على العلبة كـ ٥٬٠٠٠ جزء بالمليون',
    'جلسرين ١٧٫٤٩٪ وزبدة شيا ٣٪',
    'التهدئة والترطيب، الوظيفة المسجّلة',
    'للبشرة الحساسة والجافة',
    'ربّتيه صباحاً ومساءً، كما تطلب العلبة',
    '١٠٠ غ. مختبر جلدياً. صنع في كوريا من DTS MG',
  ]),
  ingredients: JSON.stringify([
    {
      name: 'سيراميد NP ٠٫٥٪',
      description:
        'الفعّال، عند ٥٬٠٠٠ جزء بالمليون، مطبوع على الجانب الكوري من العلبة. يصل داخل خليط بنسبة ١٠٪ يحمل أيضاً الجلسرين والليسيثين المهدرج. السيراميدات جزء من الملاط بين خلايا البشرة وهذه جرعة جادّة من أحدها.',
    },
    {
      name: 'جلسرين ١٧٫٤٩٪',
      description:
        'قرابة خُمس الأنبوب، آتٍ من مادّتين خامّتين منفصلتين. السبب الهادئ في احتفاظ هذا الكريم بالماء على بشرة توقّفت عن الاحتفاظ بمائها.',
    },
    {
      name: 'زبدة الشيا ٣٪ ومزيج الإسترات',
      description:
        'شيا ٣٪، هيدروجينيتد بوليديسين ٧٫١٨٪، ترايجليسيريد رباعي السلسلة ٦٪، ودايميثيكون ١٪. النصف الحاجب، ولهذا لا يشبه إحساسه الكريمين الآخرين في المجموعة.',
    },
    {
      name: 'سبعة عشر حمضاً أمينياً، ٠٫٠٠٠٩٣٪',
      description:
        'الجلايسين والسيرين وحمض الجلوتاميك وحمض الأسبارتيك وثلاثة عشر آخرون، كخليط مُسمّى. البشرة تبني عامل ترطيبها الطبيعي من هذه؛ وهي هنا موجودة لا مهيمنة.',
    },
    {
      name: 'MultiEx BSASM® Plus ٠٫٠٠٠١٪',
      description:
        'نفس مركّب النباتات السبعة الذي بُني عليه سيروم All For Sensitive، بجزء من عشرة آلاف من تلك الجرعة. السنتيلا والبابونج والسوس والشاي الأخضر والبقية هنا. وليست سبب عمل هذا الكريم.',
    },
    {
      name: 'عطر لافندر خفيف ٠٫٠١٠٧٪',
      description:
        'تركيبة لافندر مُسمّاة، تجلب معها اللينالول والكومارين. يستحق المعرفة إن كنت تتجنّبين العطر، لأن هذا الكريم موجّه للبشرة الحساسة ومع ذلك يحتوي عطراً.',
    },
    { name: 'Full INCI', description: FULL_INCI },
  ]),
  howToUse: JSON.stringify([
    { step: 'التنظيف', instruction: 'نظّفي وضعي التونر برفق. البشرة الرقيقة لا تريد تقشيراً أولاً' },
    { step: 'السيروم', instruction: 'All For Sensitive Serum هو الخطوة قبل هذه' },
    { step: 'التربيت', instruction: 'ضعيه على الوجه وربّتيه برفق بأصابعك. لا تفركيه' },
    { step: 'الزيادة', instruction: 'ضغطة ثانية على البقع الجافة أو المجهدة' },
    { step: 'التكرار', instruction: 'صباحاً ومساءً. أبعديه عن محيط العين' },
  ]),
  directions:
    'مختبر جلدياً. للبشرة الحساسة والجافة. يحتوي عطر لافندر خفيف، مع لينالول وكومارين. للاستخدام الخارجي فقط. أبعديه عن محيط العين. توقّفي واستشيري طبيباً إن ظهر احمرار أو تورم أو تهيّج. احفظيه في مكان بارد وجاف بعيداً عن متناول الأطفال. ثلاث سنوات دون فتح، وتاريخ الانتهاء على العلبة.',
}

const RU = {
  description:
    'Ceramide NP — 0,5%, и корейская панель на упаковке печатает число в скобках: 5 000 ppm. Большинство кремов, выносящих церамид на лицевую сторону, используют его на порядок или два ниже. За ним глицерин 17,49% и масло ши 3%, что делает этот крем самым насыщенным из трёх кремов GENOSYS для лица и тем, который предназначен для чувствительной и сухой кожи, а не обезвоженной и не жирной. Коробка просит его вбивать, а не растирать. 100 г, утром и вечером.',
  productDetails: JSON.stringify({
    form: 'Несмываемый крем для лица, туба',
    size: '100 г',
    function: 'Успокоение, увлажнение',
    technology: 'Ceramide NP 0,5%, на упаковке напечатано как 5 000 ppm',
    keyBenefits: 'Поддержка барьера, комфорт, увлажнение, которое держится на сухой коже',
    usage: 'Утром и вечером, вбивая',
    skinType: 'Чувствительная и сухая кожа',
    application: 'Нанести на лицо и мягко вбить пальцами',
    fragrance: 'Мягкая лаванда, с линалоолом и кумарином',
    testing: 'Дерматологически протестировано',
    origin: 'Сделано в Корее, DTS MG',
  }),
  keyFeatures: JSON.stringify([
    {
      title: 'Ceramide NP 0,5%',
      description:
        'Пять тысяч частей на миллион, и корейская сторона упаковки печатает эту цифру. Это ингредиент, по которому назван продукт.',
    },
    {
      title: 'Глицерин 17,49%',
      description:
        'Почти пятая часть тубы, из двух разных сырьевых материалов. Больше, чем все прочие названные ингредиенты вместе взятые.',
    },
    {
      title: 'Самый насыщенный из трёх кремов',
      description:
        '49,9% воды против 72,4% в Hyaluron Cream и 86,6% в Problem Control. Масло ши 3% — та разница, которую чувствуешь.',
    },
    {
      title: 'Семнадцать аминокислот',
      description:
        'Именованный премикс в форме собственного натурального увлажняющего фактора кожи, около девяти частей на миллион на всех.',
    },
  ]),
  benefits: JSON.stringify([
    'Ceramide NP 0,5%, на упаковке напечатано как 5 000 ppm',
    'Глицерин 17,49% и масло ши 3%',
    'Успокоение и увлажнение — зарегистрированная функция',
    'Для чувствительной и сухой кожи',
    'Вбивайте утром и вечером, как просит коробка',
    '100 г. Дерматологически протестировано. Сделано в Корее, DTS MG',
  ]),
  ingredients: JSON.stringify([
    {
      name: 'Ceramide NP 0,5%',
      description:
        'Актив, 5 000 частей на миллион, напечатано на корейской стороне упаковки. Приходит внутри 10% премикса, который несёт также глицерин и гидрогенизированный лецитин. Церамиды — часть «раствора» между клетками кожи, и это серьёзная доза одного из них.',
    },
    {
      name: 'Глицерин 17,49%',
      description:
        'Почти пятая часть тубы, из двух разных сырьевых материалов. Тихая причина того, что крем держит воду на коже, которая перестала держать свою.',
    },
    {
      name: 'Масло ши 3% и эфирная база',
      description:
        'Ши 3%, гидрогенизированный полидецен 7,18%, четырёхцепочечный триглицерид 6% и диметикон 1%. Окклюзивная половина, и поэтому по ощущению он не похож на два других крема линейки.',
    },
    {
      name: 'Семнадцать аминокислот, 0,00093%',
      description:
        'Глицин, серин, глутаминовая и аспарагиновая кислоты и ещё тринадцать, как именованный премикс. Кожа строит из них свой увлажняющий фактор; здесь они присутствуют, а не доминируют.',
    },
    {
      name: 'MultiEx BSASM® Plus 0,0001%',
      description:
        'Тот же комплекс из семи растений, вокруг которого построена сыворотка All For Sensitive, в одной десятитысячной от той дозы. Центелла, ромашка, солодка, зелёный чай и остальные здесь есть. Не они причина того, что этот крем работает.',
    },
    {
      name: 'Мягкая лавандовая отдушка 0,0107%',
      description:
        'Именованный лавандовый аккорд, приносящий с собой линалоол и кумарин. Стоит знать, если вы избегаете отдушки: крем адресован чувствительной коже и всё же ароматизирован.',
    },
    { name: 'Full INCI', description: FULL_INCI },
  ]),
  howToUse: JSON.stringify([
    { step: 'Очищение', instruction: 'Очистите и протонизируйте мягко. Истончённой коже не нужен скраб перед этим' },
    { step: 'Сыворотка', instruction: 'All For Sensitive Serum — шаг перед этим' },
    { step: 'Вбить', instruction: 'Нанесите на лицо и мягко вбейте пальцами. Не растирайте' },
    { step: 'Добавить', instruction: 'Ещё одно нажатие на сухие или перегруженные участки' },
    { step: 'Частота', instruction: 'Утром и вечером. Держите подальше от области вокруг глаз' },
  ]),
  directions:
    'Дерматологически протестировано. Для чувствительной и сухой кожи. Содержит мягкую лавандовую отдушку, с линалоолом и кумарином. Только для наружного применения. Держите подальше от области вокруг глаз. Прекратите использование и обратитесь к врачу при покраснении, отёке или раздражении. Храните в прохладном сухом месте, вне доступа детей. Три года в закрытом виде, дата окончания срока — на коробке.',
}

async function main() {
  const p = await prisma.product.findFirst({
    where: { OR: [{ productNumber: '27' }, { id: '27' }] },
    select: { id: true, name: true },
  })
  if (!p) throw new Error('product 27 not found')

  await prisma.product.update({
    where: { id: p.id },
    data: {
      productNumber: '27',
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
    where: { productNumber: '27' },
    select: { productNumber: true, ingredients: true, benefits: true, productDetails: true, directions: true },
  })
  console.log('productNumber:', after?.productNumber)
  console.log('INCI has 1,2-Hexanediol:', after?.ingredients?.includes('1,2-Hexanediol'))
  console.log('INCI has C18-C21 Alkane:', after?.ingredients?.includes('C18-C21 Alkane'))
  console.log('MultiEx not the technology:', !after?.productDetails?.includes('MultiEx'))
  console.log('no repair benefit:', !after?.benefits?.includes('Repair'))
  console.log('no duplicated directions:', (after?.directions?.match(/[Dd]ermatologically tested/g) || []).length === 1)
  console.log('done')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())

export { AR, RU }
