/**
 * Copy for the MESOPECIA KIT page (product 70), in English, Arabic and Russian.
 * "The root of it." campaign, Oct 2026.
 *
 * The kit is three products sold on their own pages, so every fact here comes from those pages
 * (see data/product70LocalizedCopy.ts for the sourcing): 46 Scalp Peeling α, 45 Hair Solution α,
 * 67 Microneedle Stamp 0.25 mm. Live price, size, barcode and link for each come from the catalogue.
 *
 * Must not be added: any hair-loss, regrowth or growth-factor effect, a session frequency, DTS MG,
 * or "kit only" for any of the three (all three sell alone).
 */

export type MesopeciaLocale = 'en' | 'ar' | 'ru'

export interface MesopeciaItemCopy {
  id: string
  title: string
  productNumber: string
  quantity: number
  step: string
  body: string
  facts: string[]
}

export interface MesopeciaCopy {
  eyebrow: string
  backToProducts: string
  headline: string
  subheadline: string
  heroBullets: string[]
  kitSize: string
  fullSizeNote: string
  vatIncluded: string
  freeDelivery: string
  addToBag: string
  adding: string
  added: string
  outOfStock: string
  loginToShop: string
  inBag: string
  viewBag: string
  badges: string[]
  stats: { value: string; label: string }[]
  concern: { eyebrow: string; title: string; body: string; points: string[] }
  contents: {
    eyebrow: string
    title: string
    intro: string
    items: MesopeciaItemCopy[]
    eanLabel: string
    each: string
    viewItem: string
    boughtSeparately: string
    inThisBox: string
    youSave: string
    againstSeparate: string
    seeBreakdown: string
    savingNote: string
  }
  howTo: { eyebrow: string; title: string; intro: string; steps: { title: string; body: string }[]; note: string }
  stamp: { eyebrow: string; title: string; body: string; points: string[]; aside: string }
  evidence: {
    eyebrow: string
    title: string
    intro: string
    cards: { value: string; title: string; body: string }[]
    footnote: string
  }
  suited: {
    eyebrow: string
    title: string
    forTitle: string
    forList: string[]
    notForTitle: string
    notForList: string[]
    alternativesLabel: string
    alternatives: { productNumber: string; label: string }[]
    note: string
  }
  details: { eyebrow: string; title: string; rows: { label: string; value: string }[]; barcodeLabel: string }
  faq: { eyebrow: string; title: string; items: { q: string; a: string }[] }
}

const EN: MesopeciaCopy = {
  eyebrow: 'HR³ scalp routine · Three-step kit',
  backToProducts: 'All products',
  headline: 'The root of it.',
  subheadline:
    'Beautiful hair starts at the scalp. Clear it with Scalp Peeling α, feed it with Hair Solution α, and work it in with a 0.25 mm stamp: the whole HR³ scalp routine, in one kit.',
  heroBullets: [
    'Clear: Scalp Peeling α lifts sebum, flakes and styling build-up',
    'Feed: eight fresh 4 ml vials of Hair Solution α',
    'Press: a sterile 0.25 mm stamp, straight down along each parting',
    'Less than the three bought separately',
  ],
  kitSize: '1 kit',
  fullSizeNote: 'Full-size peeling and a full box of vials',
  vatIncluded: 'VAT included',
  freeDelivery: 'Free delivery over 1,000 AED · Ships from Dubai',
  addToBag: 'Add to bag',
  adding: 'Adding…',
  added: 'Added',
  outOfStock: 'Out of stock',
  loginToShop: 'Log in to shop',
  inBag: 'In your bag',
  viewBag: 'View bag',
  badges: ['Made in Korea', 'Full-size products', 'Sterile stamp', 'Official UAE distributor'],
  stats: [
    { value: '3', label: 'steps in one kit: clear, feed, press' },
    { value: '100 ml', label: 'Scalp Peeling α' },
    { value: '4 ml × 8', label: 'vials of Hair Solution α' },
    { value: '0.25 mm', label: 'stamp, 140 disk-cut needles' },
  ],
  concern: {
    eyebrow: 'Start at the scalp',
    title: 'Hair grows from the scalp. Care starts there.',
    body: 'Sebum, flakes and styling build-up sit right where every hair begins. The kit works on that ground in order: it clears the scalp, feeds it a conditioning solution, and works it in with a stamp built to go between the hairs.',
    points: [
      'A clean, cool, fresh-feeling scalp',
      'Nourished, conditioned hair',
      'No rolling through the hair, no tangles',
      'One routine to repeat, step by step',
    ],
  },
  contents: {
    eyebrow: 'Inside the kit',
    title: 'Three full products, one routine.',
    intro:
      'The peeling, the vials and the stamp are the same products sold on their own pages, at full size. Together they are the HR³ scalp routine from the first step to the last.',
    items: [
      {
        id: 'peeling',
        title: 'HR³ MATRIX SCALP PEELING α',
        productNumber: '46',
        quantity: 1,
        step: 'Step 1 · Clear',
        body: 'A leave-on scalp prep. Alcohol and propylene glycol lift sebum, flakes and styling build-up, and menthol with menthyl lactate leaves a crisp, cold feel. Smooth it on with a swab, leave it 5 minutes and let it dry.',
        facts: ['100 ml', 'Menthol 0.9%', 'Leave on', '5 minutes'],
      },
      {
        id: 'solution',
        title: 'HR³ MATRIX HAIR SOLUTION α',
        productNumber: '45',
        quantity: 1,
        step: 'Step 2 · Feed',
        body: 'The ampoule made to be worked in. A light gel with copper tripeptide-1, niacinamide and panthenol to nourish and condition, and menthol for a cool finish. Apply it along each parting.',
        facts: ['4 ml × 8 vials', 'Copper tripeptide-1', 'Single-use vials', 'Shake before use'],
      },
      {
        id: 'stamp',
        title: 'Microneedle Stamp 0.25 mm',
        productNumber: '67',
        quantity: 1,
        step: 'Step 3 · Press',
        body: '140 disk-cut needles in one flat head. It presses straight down along the parting and lifts off, so nothing rolls through the hair and nothing tangles. Sterile, sealed and single use.',
        facts: ['0.25 mm', '140 needles', 'Sterile', 'One per session'],
      },
    ],
    eanLabel: 'Barcode',
    each: 'each',
    viewItem: 'Open this product',
    boughtSeparately: 'The three bought separately',
    inThisBox: 'This kit',
    youSave: 'You save',
    againstSeparate: 'against the three bought separately',
    seeBreakdown: 'See the breakdown',
    savingNote: 'The separate total counts the peeling, the box of eight vials and one 0.25 mm stamp at their own prices.',
  },
  howTo: {
    eyebrow: 'How to use it',
    title: 'Clear. Feed. Press.',
    intro: 'One session takes the peeling, a vial and the stamp, on a clean scalp.',
    steps: [
      { title: 'Clear the scalp', body: 'Smooth Scalp Peeling α over the scalp with a cotton swab and massage it in. Leave it 5 minutes, do not rinse, and let the scalp dry completely.' },
      { title: 'Part the hair', body: 'Comb the hair into partings 1 to 2 cm apart.' },
      { title: 'Feed each parting', body: 'Shake a vial of Hair Solution α, open it and apply it along the parting: half a vial for a small area, a whole vial for a larger one. Use it straight after opening.' },
      { title: 'Press, lift, move on', body: 'Open the sterile stamp. Set the head flat in the parting, press straight down, lift and move one head-width along. Work parting by parting for 10 to 15 minutes, and never drag it.' },
      { title: 'Finish', body: 'Massage the rest of the solution in gently and leave it on. Discard the stamp: one stamp, one session.' },
    ],
    note: 'The practitioner sets the needle length and the interval between sessions. Avoid the kit during pregnancy and breastfeeding. The peeling contains alcohol: let it dry before any heat or styling tool.',
  },
  stamp: {
    eyebrow: 'The stamp',
    title: 'Straight down. Nothing pulls.',
    body: 'A roller has to travel through the hair. The stamp only goes down between the strands and lifts off, so it works the scalp parting by parting without tangling a single hair.',
    points: [
      '140 needles cut from metal disks: no wire, no glue',
      '0.25 mm, inside the 0.25 to 0.5 mm HR³ scalp protocol',
      'Sterile and sealed, opened right before the session',
      'One stamp, one session: never clean, share or reuse it',
    ],
    aside: 'The kit holds one stamp for the first session. More stamps are sold on their own page.',
  },
  evidence: {
    eyebrow: 'What does the work',
    title: 'One job per step.',
    intro: 'Each product does one thing, in order, so the next one meets a better-prepared scalp.',
    cards: [
      { value: '33.6%', title: 'Clear', body: 'Alcohol with propylene glycol in Scalp Peeling α lifts sebum and build-up, then flashes off. Menthol 0.9% and menthyl lactate 0.8% keep the scalp cold.' },
      { value: '5 ppm', title: 'Feed', body: 'Copper tripeptide-1 at 5 ppm, the most in the HR³ range, with niacinamide and panthenol in Hair Solution α to nourish and condition.' },
      { value: '0.25 mm', title: 'Press', body: '140 disk-cut needles in one flat head, pressed straight down along each parting for 10 to 15 minutes.' },
    ],
    footnote: 'Made in Korea. Scalp Peeling α and Hair Solution α are dermatologically tested.',
  },
  suited: {
    eyebrow: 'Who it is for',
    title: 'The whole routine, or one step.',
    forTitle: 'This kit is for you if',
    forList: [
      'You want the full HR³ scalp routine in one box',
      'An oily, flaky or tired-feeling scalp is what you want to work on',
      'You want a stamp that works between the hairs, not through them',
    ],
    notForTitle: 'Choose something else if',
    notForList: [
      'You are pregnant or breastfeeding: avoid the kit in that time',
      'You have a metal allergy, keloid scarring, psoriasis or severe dermatitis of the scalp: skip the stamp',
      'Your scalp is damaged, inflamed or infected',
      'You only need one step: open that product instead',
    ],
    alternativesLabel: 'The three on their own',
    alternatives: [
      { productNumber: '46', label: 'Scalp Peeling α' },
      { productNumber: '45', label: 'Hair Solution α' },
      { productNumber: '67', label: 'Microneedle Stamp' },
      { productNumber: '43', label: 'Hair Tonic α' },
    ],
    note: 'Keep every product away from the eyes. The peeling is flammable until it is dry.',
  },
  details: {
    eyebrow: 'At a glance',
    title: 'Everything in the kit.',
    rows: [
      { label: 'Form', value: 'Three-step scalp care kit' },
      { label: 'Contents', value: 'Scalp Peeling α 100 ml, Hair Solution α 4 ml × 8 vials, Microneedle Stamp 0.25 mm × 1' },
      { label: 'Steps', value: 'Clear, feed, press' },
      { label: 'Session', value: '10 to 15 minutes of stamping, parting by parting' },
      { label: 'Stamp', value: '140 disk-cut needles, sterile, single use' },
      { label: 'Made in', value: 'Korea' },
      { label: 'Caution', value: 'External use only. Avoid during pregnancy and breastfeeding' },
    ],
    barcodeLabel: 'Barcode',
  },
  faq: {
    eyebrow: 'Before you buy',
    title: 'Questions about the kit.',
    items: [
      { q: 'What do I get over buying the three separately?', a: 'The whole HR³ scalp routine in one box, for less than the peeling, the eight vials and the stamp cost on their own.' },
      { q: 'How many sessions does it cover?', a: 'The kit holds one sterile stamp, so one stamped session. The peeling and the eight vials go much further: add a new stamp for each session from its own page.' },
      { q: 'Which needle length is it?', a: '0.25 mm, the shortest of the five stamp lengths. The HR³ scalp protocol works at 0.25 to 0.5 mm, and the practitioner sets the length.' },
      { q: 'Why a stamp and not a roller?', a: 'A roller has to travel through the hair and can catch it. The stamp presses straight down between the strands and lifts off, so nothing tangles or pulls.' },
      { q: 'How often can I use it?', a: 'The practitioner sets the interval between sessions. Use each vial straight after opening, and a new sterile stamp every time.' },
      { q: 'Is the peeling rinsed off?', a: 'No. Leave it 5 minutes and let the scalp dry completely before the solution. It contains alcohol, so keep heat and styling tools away until it is dry.' },
      { q: 'Can I use it while pregnant?', a: 'Avoid the kit during pregnancy and breastfeeding.' },
    ],
  },
}

const RU: MesopeciaCopy = {
  eyebrow: 'Уход HR³ для кожи головы · Набор в три шага',
  backToProducts: 'Все продукты',
  headline: 'Всё дело в корнях.',
  subheadline:
    'Красивые волосы начинаются с кожи головы. Очистите её пилингом Scalp Peeling α, напитайте раствором Hair Solution α и проработайте штампом 0,25 мм: весь уход HR³ для кожи головы в одном наборе.',
  heroBullets: [
    'Очищение: Scalp Peeling α убирает себум, чешуйки и остатки стайлинга',
    'Питание: восемь свежих ампул Hair Solution α по 4 мл',
    'Штамп: стерильный, 0,25 мм, строго вниз вдоль каждого пробора',
    'Дешевле, чем все три по отдельности',
  ],
  kitSize: '1 набор',
  fullSizeNote: 'Полноразмерный пилинг и полная коробка ампул',
  vatIncluded: 'С НДС',
  freeDelivery: 'Бесплатная доставка от 1 000 AED · Отправка из Дубая',
  addToBag: 'В корзину',
  adding: 'Добавляем…',
  added: 'Добавлено',
  outOfStock: 'Нет в наличии',
  loginToShop: 'Войдите, чтобы купить',
  inBag: 'В корзине',
  viewBag: 'Открыть корзину',
  badges: ['Сделано в Корее', 'Полноразмерные средства', 'Стерильный штамп', 'Официальный дистрибьютор в ОАЭ'],
  stats: [
    { value: '3', label: 'шага в одном наборе: очищение, питание, штамп' },
    { value: '100 мл', label: 'Scalp Peeling α' },
    { value: '4 мл × 8', label: 'ампул Hair Solution α' },
    { value: '0,25 мм', label: 'штамп, 140 игл из металлических дисков' },
  ],
  concern: {
    eyebrow: 'Начните с кожи головы',
    title: 'Волосы растут из кожи головы. Уход начинается там же.',
    body: 'Себум, чешуйки и остатки стайлинга скапливаются там, где начинается каждый волос. Набор работает с этой основой по порядку: очищает кожу головы, питает её кондиционирующим раствором и прорабатывает его штампом, который входит между волосами.',
    points: [
      'Чистая, прохладная, свежая кожа головы',
      'Напитанные, кондиционированные волосы',
      'Без прокатывания по волосам и без спутывания',
      'Один уход, который легко повторять шаг за шагом',
    ],
  },
  contents: {
    eyebrow: 'Внутри набора',
    title: 'Три полноразмерных средства, один уход.',
    intro:
      'Пилинг, ампулы и штамп - те же средства, что продаются на своих страницах, в полном размере. Вместе это уход HR³ для кожи головы от первого шага до последнего.',
    items: [
      {
        id: 'peeling',
        title: 'HR³ MATRIX SCALP PEELING α',
        productNumber: '46',
        quantity: 1,
        step: 'Шаг 1 · Очищение',
        body: 'Несмываемая подготовка кожи головы. Спирт и пропиленгликоль убирают себум, чешуйки и остатки стайлинга, а ментол с ментиллактатом дарят бодрящий холод. Нанесите ватной палочкой, оставьте на 5 минут и дайте высохнуть.',
        facts: ['100 мл', 'Ментол 0,9%', 'Не смывать', '5 минут'],
      },
      {
        id: 'solution',
        title: 'HR³ MATRIX HAIR SOLUTION α',
        productNumber: '45',
        quantity: 1,
        step: 'Шаг 2 · Питание',
        body: 'Ампула, созданная для работы со штампом. Лёгкий гель с медным трипептидом-1, ниацинамидом и пантенолом питает и кондиционирует, а ментол дарит прохладу. Наносите вдоль каждого пробора.',
        facts: ['4 мл × 8 ампул', 'Медный трипептид-1', 'Одноразовые ампулы', 'Встряхнуть перед применением'],
      },
      {
        id: 'stamp',
        title: 'Микроигольчатый штамп 0,25 мм',
        productNumber: '67',
        quantity: 1,
        step: 'Шаг 3 · Штамп',
        body: '140 игл из металлических дисков в одной плоской головке. Штамп опускается строго вниз вдоль пробора и поднимается, поэтому ничего не катится по волосам и ничего не путается. Стерильный, в запечатанной упаковке, одноразовый.',
        facts: ['0,25 мм', '140 игл', 'Стерильный', 'Один на процедуру'],
      },
    ],
    eanLabel: 'Штрихкод',
    each: 'за шт.',
    viewItem: 'Открыть продукт',
    boughtSeparately: 'Все три по отдельности',
    inThisBox: 'Этот набор',
    youSave: 'Экономия',
    againstSeparate: 'по сравнению с покупкой всех трёх по отдельности',
    seeBreakdown: 'Подробнее',
    savingNote: 'В сумму по отдельности входят пилинг, коробка из восьми ампул и один штамп 0,25 мм по их собственным ценам.',
  },
  howTo: {
    eyebrow: 'Как применять',
    title: 'Очищение. Питание. Штамп.',
    intro: 'На одну процедуру нужны пилинг, ампула и штамп, на чистой коже головы.',
    steps: [
      { title: 'Очистите кожу головы', body: 'Нанесите Scalp Peeling α на кожу головы ватной палочкой и помассируйте. Оставьте на 5 минут, не смывайте и дайте коже полностью высохнуть.' },
      { title: 'Разделите на проборы', body: 'Разделите волосы расчёской на проборы через 1-2 см.' },
      { title: 'Нанесите раствор', body: 'Встряхните ампулу Hair Solution α, откройте и нанесите вдоль пробора: половину ампулы на небольшой участок, целую на больший. Используйте сразу после вскрытия.' },
      { title: 'Нажать, поднять, дальше', body: 'Откройте стерильный штамп. Поставьте головку ровно в пробор, нажмите строго вниз, поднимите и сместите на ширину головки. Работайте пробор за пробором 10-15 минут и никогда не тяните штамп по коже.' },
      { title: 'Завершение', body: 'Мягко вмассируйте остаток раствора и не смывайте. Штамп утилизируйте: один штамп - одна процедура.' },
    ],
    note: 'Длину игл и интервал между процедурами определяет специалист. Не применяйте набор во время беременности и грудного вскармливания. Пилинг содержит спирт: дайте ему высохнуть перед феном и стайлерами.',
  },
  stamp: {
    eyebrow: 'Штамп',
    title: 'Строго вниз. Ничего не тянет.',
    body: 'Роллеру приходится катиться сквозь волосы. Штамп только опускается между прядями и поднимается, поэтому прорабатывает кожу головы пробор за пробором, не спутав ни одного волоса.',
    points: [
      '140 игл, вырезанных из металлических дисков: без проволоки и клея',
      '0,25 мм, в пределах протокола HR³ для кожи головы 0,25-0,5 мм',
      'Стерильный и запечатанный, вскрывается прямо перед процедурой',
      'Один штамп - одна процедура: не очищайте, не передавайте и не используйте повторно',
    ],
    aside: 'В наборе один штамп для первой процедуры. Дополнительные штампы продаются на отдельной странице.',
  },
  evidence: {
    eyebrow: 'Что работает',
    title: 'Одна задача на каждый шаг.',
    intro: 'Каждое средство делает одно дело и по порядку, поэтому следующее встречает лучше подготовленную кожу головы.',
    cards: [
      { value: '33,6%', title: 'Очищение', body: 'Спирт с пропиленгликолем в Scalp Peeling α убирают себум и наслоения и быстро испаряются. Ментол 0,9% и ментиллактат 0,8% сохраняют прохладу.' },
      { value: '5 ppm', title: 'Питание', body: 'Медный трипептид-1 в концентрации 5 ppm, самой высокой в линии HR³, с ниацинамидом и пантенолом в Hair Solution α питает и кондиционирует.' },
      { value: '0,25 мм', title: 'Штамп', body: '140 игл из металлических дисков в одной плоской головке, строго вниз вдоль каждого пробора 10-15 минут.' },
    ],
    footnote: 'Сделано в Корее. Scalp Peeling α и Hair Solution α дерматологически протестированы.',
  },
  suited: {
    eyebrow: 'Кому подходит',
    title: 'Весь уход или один шаг.',
    forTitle: 'Набор для вас, если',
    forList: [
      'Вы хотите весь уход HR³ для кожи головы в одной коробке',
      'Вас беспокоит жирная, шелушащаяся или уставшая кожа головы',
      'Вам нужен штамп, который работает между волосами, а не сквозь них',
    ],
    notForTitle: 'Выберите другое, если',
    notForList: [
      'Вы беременны или кормите грудью: в это время набор не применяют',
      'У вас аллергия на металл, келоидные рубцы, псориаз или выраженный дерматит кожи головы: обойдитесь без штампа',
      'Кожа головы повреждена, воспалена или инфицирована',
      'Вам нужен только один шаг: откройте этот продукт',
    ],
    alternativesLabel: 'Все три по отдельности',
    alternatives: [
      { productNumber: '46', label: 'Scalp Peeling α' },
      { productNumber: '45', label: 'Hair Solution α' },
      { productNumber: '67', label: 'Микроигольчатый штамп' },
      { productNumber: '43', label: 'Hair Tonic α' },
    ],
    note: 'Избегайте попадания любого средства в глаза. Пилинг огнеопасен до высыхания.',
  },
  details: {
    eyebrow: 'Коротко',
    title: 'Всё, что в наборе.',
    rows: [
      { label: 'Форма', value: 'Набор для ухода за кожей головы в три шага' },
      { label: 'Состав', value: 'Scalp Peeling α 100 мл, Hair Solution α 4 мл × 8 ампул, микроигольчатый штамп 0,25 мм × 1' },
      { label: 'Шаги', value: 'Очищение, питание, штамп' },
      { label: 'Процедура', value: '10-15 минут работы штампом, пробор за пробором' },
      { label: 'Штамп', value: '140 игл из металлических дисков, стерильный, одноразовый' },
      { label: 'Сделано в', value: 'Корее' },
      { label: 'Предупреждение', value: 'Только для наружного применения. Не применять при беременности и грудном вскармливании' },
    ],
    barcodeLabel: 'Штрихкод',
  },
  faq: {
    eyebrow: 'Перед покупкой',
    title: 'Вопросы о наборе.',
    items: [
      { q: 'Чем набор лучше покупки трёх средств по отдельности?', a: 'Весь уход HR³ для кожи головы в одной коробке и дешевле, чем пилинг, восемь ампул и штамп по отдельности.' },
      { q: 'На сколько процедур хватает набора?', a: 'В наборе один стерильный штамп, то есть одна процедура со штампом. Пилинга и восьми ампул хватит намного дольше: для каждой новой процедуры добавляйте новый штамп с его страницы.' },
      { q: 'Какая длина игл?', a: '0,25 мм, самая короткая из пяти длин штампа. Протокол HR³ для кожи головы - 0,25-0,5 мм, длину выбирает специалист.' },
      { q: 'Почему штамп, а не роллер?', a: 'Роллеру приходится катиться сквозь волосы, и он может за них цепляться. Штамп опускается строго вниз между прядями и поднимается, поэтому ничего не путается и не тянет.' },
      { q: 'Как часто можно применять?', a: 'Интервал между процедурами определяет специалист. Каждую ампулу используйте сразу после вскрытия, а штамп каждый раз берите новый, стерильный.' },
      { q: 'Пилинг нужно смывать?', a: 'Нет. Оставьте его на 5 минут и дайте коже головы полностью высохнуть перед раствором. Он содержит спирт, поэтому не используйте фен и стайлеры, пока кожа не высохнет.' },
      { q: 'Можно ли при беременности?', a: 'Во время беременности и грудного вскармливания набор не применяют.' },
    ],
  },
}

const AR: MesopeciaCopy = {
  eyebrow: 'روتين HR³ لفروة الرأس · طقم من ثلاث خطوات',
  backToProducts: 'كل المنتجات',
  headline: 'السر في الجذور.',
  subheadline:
    'الشعر الجميل يبدأ من فروة الرأس. نظّفيها بـ Scalp Peeling α، وغذّيها بـ Hair Solution α، واعملي به بختم 0.25 مم: روتين HR³ الكامل لفروة الرأس في طقم واحد.',
  heroBullets: [
    'التنظيف: يزيل Scalp Peeling α الدهون والقشور وبقايا مستحضرات التصفيف',
    'التغذية: ثماني أمبولات جديدة من Hair Solution α سعة 4 مل',
    'الضغط: ختم معقم بطول 0.25 مم، مباشرة إلى الأسفل على طول كل فرق',
    'بسعر أقل من شراء الثلاثة منفصلة',
  ],
  kitSize: 'طقم واحد',
  fullSizeNote: 'مقشر بالحجم الكامل وعلبة أمبولات كاملة',
  vatIncluded: 'شامل الضريبة',
  freeDelivery: 'توصيل مجاني فوق 1,000 درهم · الشحن من دبي',
  addToBag: 'أضيفي إلى السلة',
  adding: 'جارٍ الإضافة…',
  added: 'أُضيف',
  outOfStock: 'غير متوفر',
  loginToShop: 'سجّلي الدخول للشراء',
  inBag: 'في سلتك',
  viewBag: 'عرض السلة',
  badges: ['صُنع في كوريا', 'منتجات بالحجم الكامل', 'ختم معقم', 'الموزع الرسمي في الإمارات'],
  stats: [
    { value: '3', label: 'خطوات في طقم واحد: تنظيف، تغذية، ضغط' },
    { value: '100 مل', label: 'Scalp Peeling α' },
    { value: '4 مل × 8', label: 'أمبولات Hair Solution α' },
    { value: '0.25 مم', label: 'ختم، 140 إبرة مقطوعة من أقراص معدنية' },
  ],
  concern: {
    eyebrow: 'ابدئي من فروة الرأس',
    title: 'الشعر ينمو من فروة الرأس، والعناية تبدأ من هناك.',
    body: 'تتجمع الدهون والقشور وبقايا مستحضرات التصفيف حيث تبدأ كل شعرة. ويعمل الطقم على هذه الأرض بالترتيب: ينظّف الفروة، ويغذيها بمحلول مكيّف، ثم يعمل به بختم مصمم ليدخل بين الشعرات.',
    points: [
      'فروة رأس نظيفة وباردة ومنتعشة',
      'شعر مغذّى ومكيّف',
      'بلا تدحرج عبر الشعر وبلا تشابك',
      'روتين واحد تكررينه خطوة بخطوة',
    ],
  },
  contents: {
    eyebrow: 'داخل الطقم',
    title: 'ثلاثة منتجات كاملة، روتين واحد.',
    intro:
      'المقشر والأمبولات والختم هي المنتجات نفسها التي تُباع في صفحاتها، بحجمها الكامل. ومعاً تشكّل روتين HR³ لفروة الرأس من الخطوة الأولى حتى الأخيرة.',
    items: [
      {
        id: 'peeling',
        title: 'HR³ MATRIX SCALP PEELING α',
        productNumber: '46',
        quantity: 1,
        step: 'الخطوة 1 · التنظيف',
        body: 'تحضير لفروة الرأس يُترك من دون شطف. يزيل الكحول والبروبيلين غليكول الدهون والقشور وبقايا التصفيف، ويمنح المنثول ومنثيل لاكتات برودة منعشة. وزّعيه بعود قطني، واتركيه 5 دقائق، ثم دعيه يجف.',
        facts: ['100 مل', 'منثول 0.9%', 'من دون شطف', '5 دقائق'],
      },
      {
        id: 'solution',
        title: 'HR³ MATRIX HAIR SOLUTION α',
        productNumber: '45',
        quantity: 1,
        step: 'الخطوة 2 · التغذية',
        body: 'الأمبولة المصممة للعمل مع الختم. جل خفيف مع ثلاثي ببتيد النحاس-1 والنياسيناميد والبانثينول للتغذية والتكييف، ومنثول للمسة باردة. ضعيه على طول كل فرق.',
        facts: ['4 مل × 8 أمبولات', 'ثلاثي ببتيد النحاس-1', 'أمبولات للاستخدام مرة واحدة', 'يُرجّ قبل الاستخدام'],
      },
      {
        id: 'stamp',
        title: 'ختم الوخز الدقيق 0.25 مم',
        productNumber: '67',
        quantity: 1,
        step: 'الخطوة 3 · الضغط',
        body: '140 إبرة مقطوعة من أقراص معدنية في رأس مسطح واحد. ينزل مباشرة على طول الفرق ثم يرتفع، فلا شيء يتدحرج عبر الشعر ولا شيء يتشابك. معقم ومحكم الإغلاق وللاستخدام مرة واحدة.',
        facts: ['0.25 مم', '140 إبرة', 'معقم', 'واحد لكل جلسة'],
      },
    ],
    eanLabel: 'الباركود',
    each: 'للقطعة',
    viewItem: 'افتحي هذا المنتج',
    boughtSeparately: 'الثلاثة عند شرائها منفصلة',
    inThisBox: 'هذا الطقم',
    youSave: 'توفّرين',
    againstSeparate: 'مقارنة بشراء الثلاثة منفصلة',
    seeBreakdown: 'اعرضي التفاصيل',
    savingNote: 'يحسب المجموع المنفصل المقشر وعلبة الأمبولات الثماني وختماً واحداً بطول 0.25 مم بأسعارها الخاصة.',
  },
  howTo: {
    eyebrow: 'طريقة الاستخدام',
    title: 'تنظيف. تغذية. ضغط.',
    intro: 'تحتاج الجلسة الواحدة إلى المقشر وأمبولة والختم، على فروة نظيفة.',
    steps: [
      { title: 'نظّفي الفروة', body: 'وزّعي Scalp Peeling α على فروة الرأس بعود قطني ودلّكيه. اتركيه 5 دقائق من دون شطف، ثم دعي الفروة تجف تماماً.' },
      { title: 'افرقي الشعر', body: 'افرقي الشعر بالمشط فروقاً تفصل بينها 1 إلى 2 سم.' },
      { title: 'غذّي كل فرق', body: 'رجّي أمبولة Hair Solution α وافتحيها وضعيها على طول الفرق: نصف أمبولة لمساحة صغيرة، وأمبولة كاملة لمساحة أكبر. استخدميها فور فتحها.' },
      { title: 'اضغطي، ارفعي، تابعي', body: 'افتحي الختم المعقم. ضعي الرأس مستوياً في الفرق، واضغطي مباشرة إلى الأسفل، ثم ارفعيه وحرّكيه بعرض الرأس. اعملي فرقاً بعد فرق لمدة 10 إلى 15 دقيقة، ولا تسحبيه على الفروة أبداً.' },
      { title: 'الختام', body: 'دلّكي ما تبقى من المحلول بلطف واتركيه من دون شطف. تخلّصي من الختم: ختم واحد لجلسة واحدة.' },
    ],
    note: 'يحدد المختص طول الإبر والفاصل بين الجلسات. تجنبي الطقم أثناء الحمل والرضاعة. يحتوي المقشر على الكحول: دعيه يجف قبل أي أداة حرارة أو تصفيف.',
  },
  stamp: {
    eyebrow: 'الختم',
    title: 'مباشرة إلى الأسفل. لا شيء يُشدّ.',
    body: 'الرولر يضطر إلى المرور عبر الشعر. أما الختم فينزل بين الخصلات ويرتفع فقط، فيعمل على الفروة فرقاً بعد فرق من دون أن تتشابك شعرة واحدة.',
    points: [
      '140 إبرة مقطوعة من أقراص معدنية: بلا أسلاك ولا مواد لاصقة',
      '0.25 مم، ضمن بروتوكول HR³ لفروة الرأس من 0.25 إلى 0.5 مم',
      'معقم ومحكم الإغلاق، يُفتح قبل الجلسة مباشرة',
      'ختم واحد لجلسة واحدة: لا تنظفيه ولا تشاركيه ولا تعيدي استخدامه',
    ],
    aside: 'يضم الطقم ختماً واحداً للجلسة الأولى. والأختام الإضافية تُباع في صفحتها الخاصة.',
  },
  evidence: {
    eyebrow: 'ما الذي يعمل',
    title: 'مهمة واحدة لكل خطوة.',
    intro: 'كل منتج يؤدي عملاً واحداً وبالترتيب، فيلتقي المنتج التالي بفروة أفضل تحضيراً.',
    cards: [
      { value: '33.6%', title: 'التنظيف', body: 'الكحول مع البروبيلين غليكول في Scalp Peeling α يزيلان الدهون والتراكمات ثم يتبخران بسرعة. ويحافظ المنثول 0.9% ومنثيل لاكتات 0.8% على برودة الفروة.' },
      { value: '5 ppm', title: 'التغذية', body: 'ثلاثي ببتيد النحاس-1 بتركيز 5 أجزاء في المليون، الأعلى في مجموعة HR³، مع النياسيناميد والبانثينول في Hair Solution α للتغذية والتكييف.' },
      { value: '0.25 مم', title: 'الضغط', body: '140 إبرة مقطوعة من أقراص معدنية في رأس مسطح واحد، تُضغط مباشرة على طول كل فرق لمدة 10 إلى 15 دقيقة.' },
    ],
    footnote: 'صُنع في كوريا. Scalp Peeling α وHair Solution α مختبران جلدياً.',
  },
  suited: {
    eyebrow: 'لمن هذا الطقم',
    title: 'الروتين كاملاً، أو خطوة واحدة.',
    forTitle: 'هذا الطقم لكِ إذا',
    forList: [
      'أردتِ روتين HR³ الكامل لفروة الرأس في علبة واحدة',
      'كانت فروة رأسك دهنية أو متقشرة أو تبدو متعبة',
      'أردتِ ختماً يعمل بين الشعرات لا عبرها',
    ],
    notForTitle: 'اختاري شيئاً آخر إذا',
    notForList: [
      'كنتِ حاملاً أو مرضعاً: تجنبي الطقم في هذه الفترة',
      'كانت لديكِ حساسية من المعادن أو ندبات جدرية أو صدفية أو التهاب شديد في جلد الفروة: استغني عن الختم',
      'كانت فروة رأسك متضررة أو ملتهبة أو مصابة بعدوى',
      'كنتِ تحتاجين خطوة واحدة فقط: افتحي ذلك المنتج',
    ],
    alternativesLabel: 'الثلاثة منفصلة',
    alternatives: [
      { productNumber: '46', label: 'Scalp Peeling α' },
      { productNumber: '45', label: 'Hair Solution α' },
      { productNumber: '67', label: 'ختم الوخز الدقيق' },
      { productNumber: '43', label: 'Hair Tonic α' },
    ],
    note: 'أبعدي كل المنتجات عن العينين. المقشر قابل للاشتعال حتى يجف.',
  },
  details: {
    eyebrow: 'نظرة سريعة',
    title: 'كل ما في الطقم.',
    rows: [
      { label: 'الشكل', value: 'طقم للعناية بفروة الرأس في ثلاث خطوات' },
      { label: 'المحتويات', value: 'Scalp Peeling α بحجم 100 مل، Hair Solution α سعة 4 مل × 8 أمبولات، ختم الوخز الدقيق 0.25 مم × 1' },
      { label: 'الخطوات', value: 'تنظيف، تغذية، ضغط' },
      { label: 'الجلسة', value: '10 إلى 15 دقيقة بالختم، فرقاً بعد فرق' },
      { label: 'الختم', value: '140 إبرة مقطوعة من أقراص معدنية، معقم، للاستخدام مرة واحدة' },
      { label: 'بلد الصنع', value: 'كوريا' },
      { label: 'تنبيه', value: 'للاستخدام الخارجي فقط. تجنبيه أثناء الحمل والرضاعة' },
    ],
    barcodeLabel: 'الباركود',
  },
  faq: {
    eyebrow: 'قبل الشراء',
    title: 'أسئلة عن الطقم.',
    items: [
      { q: 'ما الذي أحصل عليه مقارنة بشراء الثلاثة منفصلة؟', a: 'روتين HR³ الكامل لفروة الرأس في علبة واحدة، بسعر أقل من المقشر والأمبولات الثماني والختم عند شرائها منفصلة.' },
      { q: 'كم جلسة يكفي الطقم؟', a: 'يضم الطقم ختماً معقماً واحداً، أي جلسة واحدة بالختم. أما المقشر والأمبولات الثماني فتكفي أكثر بكثير: أضيفي ختماً جديداً لكل جلسة من صفحته.' },
      { q: 'ما طول الإبر؟', a: '0.25 مم، الأقصر بين خمسة أطوال للختم. يعمل بروتوكول HR³ لفروة الرأس بطول 0.25 إلى 0.5 مم، ويحدد المختص الطول.' },
      { q: 'لماذا ختم وليس رولر؟', a: 'الرولر يضطر إلى المرور عبر الشعر وقد يعلق به. أما الختم فينزل مباشرة بين الخصلات ثم يرتفع، فلا شيء يتشابك أو يُشدّ.' },
      { q: 'كم مرة يمكنني استخدامه؟', a: 'يحدد المختص الفاصل بين الجلسات. استخدمي كل أمبولة فور فتحها، وختماً معقماً جديداً في كل مرة.' },
      { q: 'هل يُشطف المقشر؟', a: 'لا. اتركيه 5 دقائق ودعي الفروة تجف تماماً قبل المحلول. يحتوي على الكحول، فأبعدي أدوات الحرارة والتصفيف حتى يجف.' },
      { q: 'هل يمكنني استخدامه أثناء الحمل؟', a: 'تجنبي الطقم أثناء الحمل والرضاعة.' },
    ],
  },
}

const COPY: Record<MesopeciaLocale, MesopeciaCopy> = { en: EN, ar: AR, ru: RU }

export function getMesopeciaCopy(locale: string): MesopeciaCopy {
  return COPY[(locale as MesopeciaLocale)] ?? EN
}
