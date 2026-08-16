/**
 * Rewrite PROBLEM CONTROL SERUM (product 20) against the Intertek dossier.
 *
 * Sources: Winnova formula, QACS safety assessment (July 2015), registered
 * artwork, COA. See components/product/pcserum/pcserumCopy.ts for the full
 * sourcing note.
 *
 * What this fixes:
 *   - The full INCI was missing 1,2-Hexanediol, the third ingredient at 2%.
 *   - Beta-glucan was sold as "immune-boosting", panthenol and allantoin as
 *     "healing" and "regeneration". Drug-register for a UAE cosmetic.
 *   - Black willow bark at 0.001% was written as a co-active working
 *     "alongside zinc PCA".
 *   - "Clinically proven" in productDetails.testing. Only a patch test exists.
 *   - "Visible improvements in 2 to 4 weeks". Invented.
 *   - "Massage in upward motions". The carton says pat.
 *   - productNumber was null, so the record resolved through its id.
 */
import { PrismaClient } from '@prisma/client'

const url = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL || ''
const prisma = new PrismaClient({ accelerateUrl: url } as never)

const FULL_INCI =
  'Aqua (Water), Dipropylene Glycol, 1,2-Hexanediol, Trehalose, Zinc PCA, Salix Nigra (Willow) Bark Extract, ' +
  'Leuconostoc/Radish Root Ferment Filtrate, Panthenol, Rumex Crispus Root Extract, Phaseolus Radiatus Extract, ' +
  'Lactobacillus/Pumpkin Ferment Extract, Betula Platyphylla Japonica Bark Extract, Betaine, Beta-Glucan, ' +
  'Allantoin, Polyglutamic Acid, Glycerin, Acrylates/C10-30 Alkyl Acrylate Crosspolymer, Xylitol, ' +
  'Potassium Hydroxide, Butylene Glycol, Disodium EDTA.'

const EN = {
  description:
    '30ml leave-on serum for oily and combination skin. Korea registers it for anti-blemishes, oil and sebum control, and zinc PCA at a full 0.05% is the ingredient carrying that. Nine tenths of the bottle is water, so it sinks in and leaves nothing sitting on the surface. Two or three drops after your toner, patted in, morning and night. No perfume of any kind. Dermatologically tested.',
  productDetails: JSON.stringify({
    form: 'Leave-on face serum, dropper bottle',
    size: '30ml',
    function: 'Anti-blemishes, oil and sebum control',
    technology: 'Zinc PCA 0.05%, neat rather than a diluted premix',
    keyBenefits: 'Sebum control, even surface, comfort without tightness',
    usage: 'Morning and night, after toner',
    skinType: 'Oily and combination skin, blemish-prone',
    application: 'Two or three drops on the face, patted in with the fingers',
    fragrance: 'None in the formula',
    testing: 'Dermatologically tested',
    origin: 'Made in Korea by DTS MG',
  }),
  keyFeatures: JSON.stringify([
    {
      title: 'Zinc PCA 0.05%',
      description:
        'Neat, not a diluted premix, so the figure on the card is the figure on the skin. This is the ingredient the registered function rests on.',
    },
    {
      title: 'Over 90% water',
      description:
        'No oil, no silicone, no film former beyond a trace of thickener. It absorbs and leaves nothing behind.',
    },
    {
      title: 'Comfort at readable doses',
      description:
        'Panthenol 0.2%, allantoin 0.1%, trehalose 1% and xylitol 0.5%, so an oil-control step does not turn into a tight one.',
    },
    {
      title: 'No perfume at all',
      description:
        'Not just no artificial fragrance. There is no perfume ingredient in the formula, botanical or otherwise.',
    },
  ]),
  benefits: JSON.stringify([
    'Anti-blemishes, oil and sebum control, the registered function of the serum',
    'Zinc PCA at a full 0.05%, undiluted',
    'Over 90% water, so it wears under a cream in Gulf heat',
    'Panthenol, allantoin, trehalose and xylitol for comfort',
    'No perfume in the formula, artificial or botanical',
    'Morning and night, after toner. Dermatologically tested',
  ]),
  ingredients: JSON.stringify([
    {
      name: 'Zinc PCA 0.05%',
      description:
        'The active. Zinc paired with pyrrolidone carboxylic acid, one of the humectants skin makes for itself, so the oil-control half arrives with a water-binding half attached. It goes in neat.',
    },
    {
      name: 'Panthenol 0.2% · Allantoin 0.1%',
      description:
        'The comfort pair, at doses you can read on the list. They are why a control serum does not have to feel like a stripping one.',
    },
    {
      name: 'Trehalose 1% · Xylitol 0.5%',
      description:
        'Two sugars that hold water without weight. Between them they are more of this bottle than every botanical in it combined.',
    },
    {
      name: 'Phytolex SC 0.5%',
      description:
        'Mung bean, white birch bark and yellow dock delivered as one premix at half a percent of the batch. Named because it is really there, not because it is the reason the serum works.',
    },
    {
      name: 'Beta-Glucan 0.08% · Polyglutamic Acid 0.01%',
      description:
        'The supporting set, with radish root and pumpkin ferments at 0.02% and 0.01%. Listed honestly in tenths and hundredths of a percent.',
    },
    {
      name: 'Salix Nigra (Willow) Bark Extract 0.001%',
      description:
        'Black willow, and a trace of it. Willow is where people expect salicylic acid, so it is worth saying plainly: salicylic acid is not in this formula and this is not an acid step.',
    },
    { name: 'Full INCI', description: FULL_INCI },
  ]),
  howToUse: [
    '1. Cleanse. Start on clean skin',
    '2. Toner first. Intensive Problem Control Toner is the step before this one',
    '3. Two or three drops on the face',
    '4. Pat it in with your fingers rather than rubbing it around',
    '5. Finish with Intensive Problem Control Cream',
    '6. Morning and night. Sunscreen after the morning round',
  ].join('\n'),
  directions:
    'Dermatologically tested. For external use only. Keep clear of the eye area. Stop and speak to a doctor if redness, swelling or irritation appears. Keep in a cool dry place, out of reach of children. Three years unopened, with the expiry date on the box.',
}

const AR = {
  description:
    '٣٠ مل. سيروم يُترك على البشرة للبشرة الدهنية والمختلطة. كوريا تسجّله للتحكم بالعيوب والدهون والزهم، وزنك PCA بنسبة ٠٫٠٥٪ كاملة هو المكوّن الذي يحمل ذلك. تسعة أعشار الزجاجة ماء، فيتغلغل ولا يترك شيئاً على السطح. قطرتان أو ثلاث بعد التونر، ربّتيها، صباحاً ومساءً. بلا أي عطر. مختبر جلدياً.',
  productDetails: JSON.stringify({
    form: 'سيروم وجه يُترك على البشرة، زجاجة بقطارة',
    size: '٣٠ مل',
    function: 'مقاومة العيوب والتحكم بالدهون والزهم',
    technology: 'زنك PCA ٠٫٠٥٪ صافياً لا كخليط مخفّف',
    keyBenefits: 'تحكم بالزهم، سطح متجانس، راحة بلا شدّ',
    usage: 'صباحاً ومساءً، بعد التونر',
    skinType: 'بشرة دهنية ومختلطة، معرّضة للعيوب',
    application: 'قطرتان أو ثلاث على الوجه، ربّتيها بالأصابع',
    fragrance: 'لا يوجد في التركيبة',
    testing: 'مختبر جلدياً',
    origin: 'صنع في كوريا من DTS MG',
  }),
  keyFeatures: JSON.stringify([
    {
      title: 'زنك PCA ٠٫٠٥٪',
      description:
        'صافٍ لا مخفّف، فالرقم على البطاقة هو الرقم على البشرة. هذا هو المكوّن الذي تستند إليه الوظيفة المسجّلة.',
    },
    {
      title: 'أكثر من ٩٠٪ ماء',
      description:
        'بلا زيوت، بلا سيليكون، وبلا مكوّن يشكّل طبقة سوى أثر من المكثّف. يمتصّ ولا يترك شيئاً خلفه.',
    },
    {
      title: 'راحة بجرعات مقروءة',
      description:
        'بانثينول ٠٫٢٪، ألانتوين ٠٫١٪، تريهالوز ١٪ وزايليتول ٠٫٥٪، حتى لا تتحوّل خطوة التحكم بالدهون إلى خطوة شدّ.',
    },
    {
      title: 'بلا أي عطر',
      description:
        'ليس فقط بلا عطر صناعي. لا يوجد مكوّن عطري في التركيبة، نباتي أو غيره.',
    },
  ]),
  benefits: JSON.stringify([
    'مقاومة العيوب والتحكم بالدهون والزهم، الوظيفة المسجّلة للسيروم',
    'زنك PCA بنسبة ٠٫٠٥٪ كاملة، غير مخفّف',
    'أكثر من ٩٠٪ ماء، فيُلبس تحت الكريم في حرّ الخليج',
    'بانثينول وألانتوين وتريهالوز وزايليتول للراحة',
    'لا عطر في التركيبة، لا صناعي ولا نباتي',
    'صباحاً ومساءً بعد التونر. مختبر جلدياً',
  ]),
  ingredients: JSON.stringify([
    {
      name: 'زنك PCA ٠٫٠٥٪',
      description:
        'الفعّال. زنك مقترن بحمض البيروليدون كربوكسيليك، أحد المرطّبات التي تصنعها البشرة لنفسها، فيصل نصف التحكم بالدهون ومعه نصف يربط الماء. ويدخل صافياً.',
    },
    {
      name: 'بانثينول ٠٫٢٪ · ألانتوين ٠٫١٪',
      description:
        'ثنائي الراحة، بجرعات تقرئينها على القائمة. بسببهما لا يضطر سيروم التحكم أن يكون سيروم تجريد.',
    },
    {
      name: 'تريهالوز ١٪ · زايليتول ٠٫٥٪',
      description:
        'سكّران يحتفظان بالماء بلا ثقل. معاً يشكّلان من هذه الزجاجة أكثر من كل النباتات مجتمعة.',
    },
    {
      name: 'Phytolex SC ٠٫٥٪',
      description:
        'الفاصولياء الذهبية ولحاء البتولا الأبيض والحمّاض، في خليط واحد بنصف بالمئة من الدفعة. يُسمّى لأنه موجود فعلاً، لا لأنه سبب النتيجة.',
    },
    {
      name: 'بيتا جلوكان ٠٫٠٨٪ · حمض بولي جلوتاميك ٠٫٠١٪',
      description:
        'المجموعة المساندة، مع تخمّرات جذر الفجل والقرع بنسبة ٠٫٠٢٪ و٠٫٠١٪. مذكورة بصدق بالأعشار والأجزاء من المئة.',
    },
    {
      name: 'مستخلص لحاء الصفصاف الأسود ٠٫٠٠١٪',
      description:
        'صفصاف أسود، وبكمية أثرية. الصفصاف هو المكان الذي يتوقّع الناس فيه حمض الساليسيليك، ويستحق القول بوضوح: حمض الساليسيليك ليس في هذه التركيبة وهذه ليست خطوة حمضية.',
    },
    { name: 'Full INCI', description: FULL_INCI },
  ]),
  howToUse: JSON.stringify([
    { step: 'التنظيف', instruction: 'ابدئي ببشرة نظيفة' },
    { step: 'التونر', instruction: 'Intensive Problem Control Toner هو الخطوة التي تسبق هذه' },
    { step: 'الجرعة', instruction: 'قطرتان أو ثلاث على الوجه' },
    { step: 'التربيت', instruction: 'ربّتيها بأصابعك بدل فركها' },
    { step: 'الكريم', instruction: 'اختمي بـ Intensive Problem Control Cream' },
    { step: 'التكرار', instruction: 'صباحاً ومساءً. واقي الشمس بعد جولة الصباح' },
  ]),
  directions:
    'مختبر جلدياً. للاستخدام الخارجي فقط. أبعديه عن محيط العين. توقّفي واستشيري طبيباً إن ظهر احمرار أو تورم أو تهيّج. احفظيه في مكان بارد وجاف بعيداً عن متناول الأطفال. ثلاث سنوات دون فتح، وتاريخ الانتهاء على العلبة.',
}

const RU = {
  description:
    '30 мл. Несмываемая сыворотка для жирной и комбинированной кожи. Корея регистрирует её на контроле высыпаний, жирности и себума, и несёт это цинк PCA в полных 0,05%. Девять десятых флакона — вода, поэтому средство впитывается и ничего не оставляет на поверхности. Две-три капли после тоника, вбить, утром и вечером. Совсем без отдушки. Дерматологически протестировано.',
  productDetails: JSON.stringify({
    form: 'Несмываемая сыворотка для лица, флакон с пипеткой',
    size: '30 мл',
    function: 'Контроль высыпаний, жирности и себума',
    technology: 'Цинк PCA 0,05% в чистом виде, а не разбавленным премиксом',
    keyBenefits: 'Контроль себума, ровная поверхность, комфорт без стянутости',
    usage: 'Утром и вечером, после тоника',
    skinType: 'Жирная и комбинированная кожа, склонная к высыпаниям',
    application: 'Две-три капли на лицо, вбить пальцами',
    fragrance: 'В формуле отсутствует',
    testing: 'Дерматологически протестировано',
    origin: 'Сделано в Корее, DTS MG',
  }),
  keyFeatures: JSON.stringify([
    {
      title: 'Цинк PCA 0,05%',
      description:
        'В чистом виде, а не разбавленным премиксом, поэтому число на карточке — это число на коже. Именно на нём держится зарегистрированная функция.',
    },
    {
      title: 'Более 90% воды',
      description:
        'Ни масел, ни силиконов, ни плёнкообразователей, кроме следа загустителя. Впитывается и ничего не оставляет.',
    },
    {
      title: 'Комфорт в читаемых дозах',
      description:
        'Пантенол 0,2%, аллантоин 0,1%, трегалоза 1% и ксилитол 0,5%, чтобы шаг контроля жирности не превратился в стянутость.',
    },
    {
      title: 'Совсем без отдушки',
      description:
        'Не просто без синтетической отдушки. Отдушки в формуле нет вообще, ни растительной, ни какой-либо ещё.',
    },
  ]),
  benefits: JSON.stringify([
    'Контроль высыпаний, жирности и себума — зарегистрированная функция сыворотки',
    'Цинк PCA в полных 0,05%, неразбавленный',
    'Более 90% воды, поэтому носится под кремом в жару Залива',
    'Пантенол, аллантоин, трегалоза и ксилитол для комфорта',
    'В формуле нет отдушки, ни синтетической, ни растительной',
    'Утром и вечером, после тоника. Дерматологически протестировано',
  ]),
  ingredients: JSON.stringify([
    {
      name: 'Цинк PCA 0,05%',
      description:
        'Актив. Цинк в паре с пирролидонкарбоновой кислотой, одним из увлажнителей, которые кожа делает сама, так что половина по контролю жирности приходит вместе с половиной, связывающей воду. Вводится в чистом виде.',
    },
    {
      name: 'Пантенол 0,2% · Аллантоин 0,1%',
      description:
        'Пара комфорта, в дозах, которые видно в составе. Из-за них сыворотка контроля не обязана ощущаться как обезжиривающая.',
    },
    {
      name: 'Трегалоза 1% · Ксилитол 0,5%',
      description:
        'Два сахара, которые удерживают воду без веса. Вдвоём они занимают во флаконе больше места, чем все растительные экстракты вместе.',
    },
    {
      name: 'Phytolex SC 0,5%',
      description:
        'Маш, кора белой берёзы и щавель курчавый в одном премиксе, полпроцента партии. Назван потому, что он действительно там, а не потому, что в нём причина результата.',
    },
    {
      name: 'Бета-глюкан 0,08% · Полиглутаминовая кислота 0,01%',
      description:
        'Группа поддержки, вместе с ферментами корня редиса и тыквы 0,02% и 0,01%. Честно указана в десятых и сотых долях процента.',
    },
    {
      name: 'Экстракт коры чёрной ивы 0,001%',
      description:
        'Чёрная ива, и её здесь след. В иве люди ожидают найти салициловую кислоту, поэтому стоит сказать прямо: салициловой кислоты в формуле нет, и это не кислотный шаг.',
    },
    { name: 'Full INCI', description: FULL_INCI },
  ]),
  howToUse: JSON.stringify([
    { step: 'Очищение', instruction: 'Начните на чистой коже' },
    { step: 'Тоник', instruction: 'Intensive Problem Control Toner — шаг перед этим' },
    { step: 'Доза', instruction: 'Две-три капли на лицо' },
    { step: 'Вбить', instruction: 'Вбейте пальцами, а не растирайте' },
    { step: 'Крем', instruction: 'Завершите Intensive Problem Control Cream' },
    { step: 'Частота', instruction: 'Утром и вечером. После утреннего круга — SPF' },
  ]),
  directions:
    'Дерматологически протестировано. Только для наружного применения. Держите подальше от области вокруг глаз. Прекратите использование и обратитесь к врачу при покраснении, отёке или раздражении. Храните в прохладном сухом месте, вне доступа детей. Три года в закрытом виде, дата окончания срока — на коробке.',
}

async function main() {
  const p = await prisma.product.findFirst({
    where: { OR: [{ productNumber: '20' }, { id: '20' }] },
    select: { id: true, name: true },
  })
  if (!p) throw new Error('product 20 not found')

  await prisma.product.update({
    where: { id: p.id },
    data: {
      productNumber: '20',
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
    where: { productNumber: '20' },
    select: { productNumber: true, name: true, ingredients: true },
  })
  console.log('productNumber:', after?.productNumber)
  console.log('INCI has 1,2-Hexanediol:', after?.ingredients?.includes('1,2-Hexanediol'))
  console.log('no immune-boosting:', !after?.ingredients?.toLowerCase().includes('immune'))
  console.log('done')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())

export { AR, RU }
