/**
 * Product-record copy for the GLASS SKIN RITUAL KIT (product 68, holiday 2026).
 *
 * English goes into the database record (scripts/create-product-68-glass-skin-ritual-kit.ts);
 * Russian and Arabic are served from data/productTranslations(Ru).ts. Every claim traces to
 * the sourcing block in components/product/beautybox/copy/glassSkinRitual.ts.
 */

export const PRODUCT_68_NAME = 'GLASS SKIN RITUAL KIT'
export const PRODUCT_68_RU_NAME = 'Праздничный набор GLASS SKIN RITUAL KIT'
export const PRODUCT_68_AR_NAME = 'مجموعة GLASS SKIN RITUAL KIT للأعياد'

export const PRODUCT_68_EN_DESCRIPTION =
  'Full moon glow. The GENOSYS holiday kit: three steps to the Korean glass-skin look in a gift box printed with a Korean moon jar. Moisture Replenishing Hyaluron Serum 30 ml fills skin with water, with 2,000 ppm of hydrolyzed hyaluronic acid. Moisture Replenishing Hyaluron Cream 50 g holds it there with high-weight hyaluronic acid and 9% glycerin; one use lifted hydration 82%, still holding at 72 hours. Revita Glow BB Cream 50 g finishes every morning with SPF 38 PA+++, 2% niacinamide and a soft luminous tint, in #01 Bright or #02 Natural, tapped in with the Revita Glow puff that comes with a holiday puff case with mirror. Serum and cream morning and evening, BB cream every morning as the last step. Made in Korea. Together for less than the three bought separately.'

export const PRODUCT_68_RU_DESCRIPTION =
  'Сияние полной луны. Праздничный набор GENOSYS: три шага к корейскому эффекту стеклянной кожи в подарочной коробке с корейской лунной вазой. Сыворотка Moisture Replenishing Hyaluron 30 мл наполняет кожу водой благодаря 2 000 ppm гидролизованной гиалуроновой кислоты. Крем Moisture Replenishing Hyaluron 50 г удерживает её высокомолекулярной гиалуроновой кислотой и глицерином 9%; одно нанесение подняло увлажнение на 82%, и оно держалось 72 часа. BB-крем Revita Glow 50 г каждое утро завершает уход с SPF 38 PA+++, ниацинамидом 2% и мягким сияющим тоном, в оттенке #01 Bright или #02 Natural, и вбивается пуфом Revita Glow, который лежит в праздничном футляре с зеркалом. Сыворотка и крем утром и вечером, BB-крем каждое утро последним шагом. Сделано в Корее. Вместе дешевле, чем три средства по отдельности.'

export const PRODUCT_68_AR_DESCRIPTION =
  'توهّج البدر. مجموعة أعياد GENOSYS: ثلاث خطوات إلى إطلالة البشرة الزجاجية الكورية في علبة هدايا عليها جرّة القمر الكورية. سيروم Moisture Replenishing Hyaluron بحجم 30 مل يملأ البشرة بالماء بفضل 2,000 جزء في المليون من حمض الهيالورونيك المحلل. وكريم Moisture Replenishing Hyaluron بوزن 50 غ يحبسه بحمض الهيالورونيك عالي الوزن الجزيئي وغليسرين 9%، واستخدام واحد رفع الترطيب ⁦82%⁩ وبقي 72 ساعة. وكريم Revita Glow BB بوزن 50 غ يختم كل صباح بحماية ⁦SPF 38 PA+++⁩ ونياسيناميد 2% ولون ناعم مشرق، بدرجة ⁦#01 Bright⁩ أو ⁦#02 Natural⁩، ويُربَّت بإسفنجة Revita Glow التي تأتي في علبة احتفالية بمرآة. السيروم والكريم صباحاً ومساءً، وكريم BB كل صباح كآخر خطوة. صُنع في كوريا. ومعاً بسعر أقل من شراء الثلاثة منفردة.'

export const PRODUCT_68_EN_RECORD = {
  name: PRODUCT_68_NAME,
  description: PRODUCT_68_EN_DESCRIPTION,
  productDetails: JSON.stringify({
    form: 'Holiday kit of three products · five pieces',
    contents:
      'Moisture Replenishing Hyaluron Serum 30ml × 1 · Moisture Replenishing Hyaluron Cream 50g × 1 · Revita Glow BB Cream 50g × 1 (#01 Bright or #02 Natural) · Revita Glow puff × 1 · holiday puff case with mirror × 1',
    routine: 'Serum → cream, morning and evening; BB cream every morning as the last step',
    serum: 'Hydrolyzed hyaluronic acid 2,000 ppm · PENTAVITIN · coconut water',
    cream: 'High-weight hyaluronic acid 1,000 ppm · glycerin 9% · +82% hydration after one use',
    bbCream: 'SPF 38 PA+++ · niacinamide 2% · adenosine 0.04%',
    giftBox: 'GENOSYS holiday box with the Korean moon jar design',
    origin: 'Made in Korea for DTS MG Co., Ltd., Seoul',
  }),
  keyFeatures: JSON.stringify([
    { title: 'Three steps to glass skin', description: 'Serum fills skin with water, cream holds it, BB cream finishes with a luminous tint.' },
    { title: '+82% hydration after one use', description: 'Measured on the hyaluron cream straight after a single application, still holding at 72 hours.' },
    { title: 'SPF 38 PA+++ finish', description: 'Revita Glow BB cream with 2% niacinamide and adenosine, in #01 Bright or #02 Natural.' },
    { title: 'A gift, ready to give', description: 'The moon jar holiday box, with the Revita Glow puff and a mirror case inside.' },
  ]),
  benefits: JSON.stringify([
    'A dewy, lit-from-within glass-skin look in three steps',
    'Hydrolyzed hyaluronic acid to fill and high-weight hyaluronic acid to hold',
    'Hydration up 82% straight after one use of the cream',
    'Light luminous coverage with SPF 38 PA+++ every morning',
    'Two shades: #01 Bright and #02 Natural',
    'Puff and mirror case included, in a holiday gift box',
  ]),
  howToUse: JSON.stringify([
    { step: 'Morning and evening · serum', instruction: 'On clean skin, smooth the serum over the face and pat it in with your fingertips.' },
    { step: 'Morning and evening · cream', instruction: 'Massage a small amount of cream over the serum to hold the water in.' },
    { step: 'Every morning · BB cream', instruction: 'Dot the BB cream over the face, blend it out, then tap it in with the puff. Add a thin second layer where you want more coverage.' },
    { step: 'Evening', instruction: 'Cleanse the BB cream away, then serum and cream only.' },
  ]),
  directions:
    'For external use only. Avoid the eyes and mucous membranes; if product gets into the eyes, rinse with cool water. Do not use on broken or irritated skin. Stop use and consult a doctor if redness, swelling or itching appears. Keep out of reach of children, away from direct sunlight and heat.',
} as const

export const PRODUCT_68_RU_TRANSLATION = {
  name: PRODUCT_68_RU_NAME,
  description: PRODUCT_68_RU_DESCRIPTION,
  productDetails: JSON.stringify({
    form: 'Праздничный набор из трёх средств · пять предметов',
    contents:
      'Сыворотка Moisture Replenishing Hyaluron 30 мл × 1 · крем Moisture Replenishing Hyaluron 50 г × 1 · BB-крем Revita Glow 50 г × 1 (#01 Bright или #02 Natural) · пуф Revita Glow × 1 · праздничный футляр для пуфа с зеркалом × 1',
    routine: 'Сыворотка → крем утром и вечером; BB-крем каждое утро последним шагом',
    serum: 'Гидролизованная гиалуроновая кислота 2 000 ppm · PENTAVITIN · кокосовая вода',
    cream: 'Высокомолекулярная гиалуроновая кислота 1 000 ppm · глицерин 9% · +82% увлажнения после одного нанесения',
    bbCream: 'SPF 38 PA+++ · ниацинамид 2% · аденозин 0,04%',
    giftBox: 'Праздничная коробка GENOSYS с рисунком корейской лунной вазы',
    origin: 'Сделано в Корее для DTS MG Co., Ltd., Сеул',
  }),
  keyFeatures: JSON.stringify([
    { title: 'Три шага к стеклянной коже', description: 'Сыворотка наполняет кожу водой, крем удерживает её, BB-крем завершает сияющим тоном.' },
    { title: '+82% увлажнения после одного нанесения', description: 'Измерено на гиалуроновом креме сразу после одного нанесения, увлажнение держалось 72 часа.' },
    { title: 'Финиш SPF 38 PA+++', description: 'BB-крем Revita Glow с ниацинамидом 2% и аденозином, в оттенке #01 Bright или #02 Natural.' },
    { title: 'Готовый подарок', description: 'Праздничная коробка с лунной вазой, внутри пуф Revita Glow и футляр с зеркалом.' },
  ]),
  benefits: JSON.stringify([
    'Свежий эффект стеклянной кожи, сияющей изнутри, за три шага',
    'Гидролизованная гиалуроновая кислота наполняет, высокомолекулярная удерживает',
    'Увлажнение +82% сразу после одного нанесения крема',
    'Лёгкое сияющее покрытие с SPF 38 PA+++ каждое утро',
    'Два оттенка: #01 Bright и #02 Natural',
    'Пуф и футляр с зеркалом в праздничной подарочной коробке',
  ]),
  ingredients: null,
  howToUse: JSON.stringify([
    { step: 'Утром и вечером · сыворотка', instruction: 'На чистую кожу распределите сыворотку и вбейте кончиками пальцев.' },
    { step: 'Утром и вечером · крем', instruction: 'Вмассируйте немного крема поверх сыворотки, чтобы удержать воду.' },
    { step: 'Каждое утро · BB-крем', instruction: 'Нанесите BB-крем точками, распределите и вбейте пуфом. Там, где нужно больше покрытия, добавьте тонкий второй слой.' },
    { step: 'Вечером', instruction: 'Смойте BB-крем, затем только сыворотка и крем.' },
  ]),
  directions:
    'Только для наружного применения. Избегайте попадания в глаза и на слизистые; при попадании промойте прохладной водой. Не наносите на повреждённую или раздражённую кожу. При покраснении, отёке или зуде прекратите применение и обратитесь к врачу. Храните в недоступном для детей месте, вдали от прямых солнечных лучей и тепла.',
} as const

export const PRODUCT_68_AR_TRANSLATION = {
  name: PRODUCT_68_AR_NAME,
  description: PRODUCT_68_AR_DESCRIPTION,
  productDetails: JSON.stringify({
    form: 'مجموعة أعياد من ثلاثة منتجات · خمس قطع',
    contents:
      'سيروم Moisture Replenishing Hyaluron ‏30 مل × 1 · كريم Moisture Replenishing Hyaluron ‏50 غ × 1 · كريم Revita Glow BB ‏50 غ × 1 ‏(⁦#01 Bright⁩ أو ⁦#02 Natural⁩) · إسفنجة Revita Glow × 1 · علبة إسفنجة احتفالية بمرآة × 1',
    routine: 'سيروم ← كريم صباحاً ومساءً، وكريم BB كل صباح كآخر خطوة',
    serum: 'حمض هيالورونيك محلل 2,000 جزء في المليون · PENTAVITIN · ماء جوز الهند',
    cream: 'حمض هيالورونيك عالي الوزن 1,000 جزء في المليون · غليسرين 9% · ترطيب ⁦+82%⁩ بعد استخدام واحد',
    bbCream: '⁦SPF 38 PA+++⁩ · نياسيناميد 2% · أدينوزين 0.04%',
    giftBox: 'علبة أعياد GENOSYS بتصميم جرّة القمر الكورية',
    origin: 'صُنع في كوريا لصالح ⁦DTS MG Co., Ltd.⁩ في سيول',
  }),
  keyFeatures: JSON.stringify([
    { title: 'ثلاث خطوات إلى البشرة الزجاجية', description: 'السيروم يملأ البشرة بالماء، والكريم يحبسه، وكريم BB يختم بلون مشرق.' },
    { title: '⁦+82%⁩ ترطيب بعد استخدام واحد', description: 'قيس على كريم الهيالورون مباشرة بعد وضعه مرة واحدة، وبقي الترطيب 72 ساعة.' },
    { title: 'لمسة ⁦SPF 38 PA+++⁩', description: 'كريم Revita Glow BB مع نياسيناميد 2% وأدينوزين، بدرجة ⁦#01 Bright⁩ أو ⁦#02 Natural⁩.' },
    { title: 'هدية جاهزة', description: 'علبة الأعياد بتصميم جرّة القمر، وفيها إسفنجة Revita Glow وعلبة بمرآة.' },
  ]),
  benefits: JSON.stringify([
    'إطلالة بشرة زجاجية ندية تتوهّج من الداخل في ثلاث خطوات',
    'حمض هيالورونيك محلل يملأ، وحمض هيالورونيك عالي الوزن يحبس',
    'ترطيب ⁦+82%⁩ مباشرة بعد استخدام واحد للكريم',
    'تغطية خفيفة مشرقة مع ⁦SPF 38 PA+++⁩ كل صباح',
    'درجتان: ⁦#01 Bright⁩ و⁦#02 Natural⁩',
    'إسفنجة وعلبة بمرآة داخل علبة هدايا الأعياد',
  ]),
  ingredients: null,
  howToUse: JSON.stringify([
    { step: 'صباحاً ومساءً · السيروم', instruction: 'على بشرة نظيفة، وزّعي السيروم على الوجه وربّتي عليه بأطراف أصابعكِ.' },
    { step: 'صباحاً ومساءً · الكريم', instruction: 'دلّكي كمية صغيرة من الكريم فوق السيروم لتحبسي الماء.' },
    { step: 'كل صباح · كريم BB', instruction: 'ضعي نقاطاً من كريم BB على الوجه، وزّعيها ثم ربّتيها بالإسفنجة. أضيفي طبقة ثانية رقيقة حيث تريدين تغطية أكبر.' },
    { step: 'في المساء', instruction: 'أزيلي كريم BB بالتنظيف، ثم السيروم والكريم فقط.' },
  ]),
  directions:
    'للاستخدام الخارجي فقط. تجنّبي العينين والأغشية المخاطية، وعند ملامسة العين اشطفيها بماء بارد. لا تستخدميه على بشرة متضررة أو متهيجة. أوقفي الاستخدام واستشيري الطبيب عند ظهور احمرار أو تورّم أو حكة. يُحفظ بعيداً عن متناول الأطفال وعن أشعة الشمس المباشرة والحرارة.',
} as const
