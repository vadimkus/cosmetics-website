import type { BeautyBoxCopy, BeautyBoxLocaleCopy } from '../beautyBoxCopy'

/**
 * Product 62 has no set-level efficacy dossier. Every quantitative statement
 * below belongs to one of its six audited component products.
 */
const EN: BeautyBoxCopy = {
  eyebrow: 'Beauty Box',
  backToProducts: 'Products',
  headline: 'Built for skin that reacts, and measured for redness.',
  subheadline:
    'Six full-size GENOSYS products for sensitive, reactive skin: a cleanser that works without scrubbing, a fragrance-free toner, a serum built on a seven-botanical calming complex, the richest barrier cream in the range at 5,000 ppm ceramide, an overnight cream mask that cut redness 26% over four weeks, and a sea algae sheet for the bad evenings. Bought together they cost less than the six bought one at a time.',
  heroBullets: [
    'Redness measured 26% lower and water loss 15% lower after four weeks with the overnight mask',
    'Ceramide NP at 5,000 ppm in the barrier cream, a dose its Korean panel prints on the carton',
    'Every item is the full retail size sold on its own page, not a travel sample',
    'Read the fragrance note below before you buy: three of the six are fragranced',
  ],
  kitSize: '6 products',
  fullSizeNote: 'Full sizes',
  vatIncluded: 'VAT included',
  freeDelivery: 'Free delivery over AED 1,000 · Dispatched from Dubai',
  addToBag: 'Add the box',
  adding: 'Adding...',
  added: 'Added',
  outOfStock: 'Out of stock',
  loginToShop: 'Log in to shop',
  inBag: 'In your bag',
  viewBag: 'View bag',
  badges: ['Authentic GENOSYS', 'Made in Korea', 'Full retail sizes', 'Dubai in 1-2 hours'],
  stats: [
    { value: '26%', label: 'less redness after four weeks with the overnight mask' },
    { value: '5,000 ppm', label: 'Ceramide NP in the barrier cream' },
    { value: '6', label: 'full-size products, in the order you use them' },
    { value: 'Korea', label: 'made by DTS MG in Seoul, the lab GENOSYS was built around' },
  ],
  contents: {
    eyebrow: 'What is inside',
    title: 'Six products, one sequence',
    intro:
      'Every product here has its own page, its own paperwork and its own price, so you can read the full detail on any of them before you buy. What the box does is put the whole sequence in your hands at once, for less than the pieces.',
    items: [
      {
        titleKey: 'routineSnowO2Title',
        productNumber: '10',
        quantity: 1,
        step: 'Step 1 - Cleanse',
        body:
          'Goes on to a dry face, where oxygen bubbles form on their own and lift make-up and the day off the skin. Massage in circles as they appear, then rinse with tepid water. The point on reactive skin is that nothing has to be scrubbed off.',
        facts: ['Bubble agent 3.000%', 'pH 5.86', 'Fragranced · contains limonene and SLS'],
      },
      {
        titleKey: 'routineSnowBoosterTitle',
        productNumber: '16',
        quantity: 1,
        step: 'Step 2 - Tone',
        body:
          'The one item in the box with no fragrance in it at all. A daily toner that hydrates and calms with botanical extracts while bringing pH back down after cleansing, which matters because the serum works best on skin that is still damp.',
        facts: ['Betaine 3.000%', 'Pumpkin ferment 1.000%', 'pH 6.08', 'Fragrance-free'],
      },
      {
        titleKey: 'routineAllForSensitiveSerumTitle',
        productNumber: '19',
        quantity: 1,
        step: 'Step 3 - Calm',
        body:
          'The calming step, and the reason this is the sensitive box rather than a hydration one. It is built on a botanical complex at a full 1% of the bottle carrying seven plants - centella, polygonum, scutellaria, green tea, licorice, chamomile and rosemary - with allantoin and betaine behind them.',
        facts: ['Botanical complex 1.0000%', 'Allantoin 0.1000%', 'pH 5.77', 'Fragranced · orange peel oil'],
      },
      {
        titleKey: 'routineSkinBarrierCreamTitle',
        productNumber: '27',
        quantity: 1,
        step: 'Step 4 - Seal',
        body:
          'The richest cream GENOSYS makes, and the one with the number worth checking: Ceramide NP at 5,000 ppm, which the Korean carton panel prints in brackets next to the ingredient because ceramide creams usually run it far lower. Behind it, glycerin at nearly a fifth of the tube.',
        facts: ['Ceramide NP 5,000 ppm', 'Glycerin 17.490%', 'Shea butter 3.000%', 'pH 6.07', 'Fragranced'],
      },
      {
        titleKey: 'routineOvernightMaskTitle',
        productNumber: '34',
        quantity: 1,
        step: 'Once or twice a week, overnight',
        body:
          'The treatment step, and the only item in the box with a clinical trial behind it. Oxygen capsules burst as it goes on and melt into a pink ceramide cream. It is the last thing on your face at night and it is not washed off. Niacinamide at 2% and adenosine at 0.04% are the working actives.',
        facts: ['Niacinamide 2%', 'Adenosine 0.04%', 'Erythema −26% at 4 weeks', 'pH 5.71', 'Leave on · avoid the eyes'],
      },
      {
        titleKey: 'routineSoothingBombMaskTitle',
        productNumber: '36',
        quantity: 1,
        step: 'When skin needs a reset',
        body:
          'One Eucalace® sheet soaked in a sea algae complex with centella. Fifteen to twenty minutes after toning on an evening when skin feels hot or tight, then carry on with the serum and cream as usual. One sheet, so treat it as a rescue rather than a routine.',
        facts: ['1 sheet', '15-20 minutes', 'pH 5.69', 'No artificial pigment'],
      },
    ],
    eanLabel: 'Barcode',
    each: 'each',
    viewItem: 'Read the full page',
    boughtSeparately: 'Bought separately',
    inThisBox: 'In this box',
    youSave: 'You save',
    againstSeparate: 'against buying the six separately',
    seeBreakdown: 'See the breakdown',
    savingNote:
      'Prices update live, so this comparison is always what you would actually pay today.',
  },
  howTo: {
    eyebrow: 'How to use it',
    title: 'Four steps daily, two masks as needed',
    intro:
      'Cleanse, tone, serum, cream, morning and evening. The overnight mask replaces your night cream once or twice a week; the sheet mask is for the evening skin has had enough. Each product carries its own full instructions on its own page.',
    steps: [
      {
        title: 'Cleanse on dry skin',
        body:
          'Pump the cleanser on to a dry face, avoiding the eyes. Wait for the oxygen bubbles, massage in circles, rinse with tepid water. Morning and evening, and no flannel or brush.',
      },
      {
        title: 'Tone while skin is damp',
        body:
          'Straight after cleansing, before skin dries, pressed in with your palms rather than wiped. This is the fragrance-free step, so if your skin is having a bad week you can stop the routine here and just tone and seal.',
      },
      {
        title: 'Serum, two or three drops',
        body:
          'Pat it over face and neck and let it settle rather than rubbing it in. Morning and evening, always before the cream.',
      },
      {
        title: 'Cream to close',
        body:
          'Apply on the face and gently pat, which is what the carton asks for and what reactive skin prefers to rubbing. In the morning, finish with your sunscreen.',
      },
      {
        title: 'Overnight mask, once or twice a week',
        body:
          'On those nights it goes on last instead of the cream, and it stays on until morning: do not wash it off. Keep it away from the eyes. It can also sit under make-up as a base, ten minutes then wipe and reapply.',
      },
      {
        title: 'Sheet mask on the bad evening',
        body:
          'After toning, lay the sheet on for 15 to 20 minutes, take it off, pat in what is left, then serum and cream as normal. There is one sheet in the box.',
      },
    ],
    note:
      'Sunscreen is the one thing this routine assumes and does not contain. If your skin is currently broken, weeping or freshly treated, wait until it has closed before starting anything here.',
  },
  evidence: {
    eyebrow: 'The clinical results',
    title: 'Measured on real skin',
    intro:
      'One product in this box has been through clinical measurement, and it happens to have been measured on the two things that matter most to reactive skin. Here is what came back, and what the rest of the box rests on instead.',
    cards: [
      {
        value: '26%',
        title: 'Less redness after four weeks',
        body:
          'Erythema improved 26% over a four-week trial of the overnight cream mask, run by an independent laboratory. Redness is the symptom most people mean when they say their skin is sensitive, and it is the one endpoint here that was actually measured.',
      },
      {
        value: '15%',
        title: 'Less water lost through the skin',
        body:
          'Transepidermal water loss improved 15% in the same four-week trial. That is a barrier reading rather than a hydration one: it measures how much moisture the skin is leaking, not how much you put on it.',
      },
      {
        value: '5,000 ppm',
        title: 'Ceramide NP in the barrier cream',
        body:
          'Not a trial, a declaration - and an unusually checkable one. The Korean carton panel prints the ceramide dose in brackets next to the ingredient, which most brands never do, and 5,000 ppm is well above where ceramide creams normally sit.',
      },
    ],
    footnote:
      'The 26% and 15% readings are both from the same four-week study on the overnight cream mask. The serum, cleanser, toner and sheet mask have no efficacy studies, and we are not going to imply otherwise: the cleanser, toner, serum and cream are dermatologically tested, which is a safety test and not a performance one.',
  },
  suited: {
    eyebrow: 'Suitability',
    title: 'Who this box is for',
    forTitle: 'A good match if',
    forList: [
      'Your skin flushes, stings or reddens easily and you want the sequence rather than another single product',
      'Your barrier is worn down - from over-exfoliating, retinoids, hard water or a Dubai summer of air conditioning',
      'You want a night that is a treatment rather than a cream, once or twice a week',
      'You are rebuilding after a course of treatments and need comfort rather than actives',
    ],
    notForTitle: 'Look elsewhere if',
    notForList: [
      'Fragrance is what sets your skin off. Three of the six are fragranced: the cleanser has parfum and limonene, the serum has orange peel oil, the cream has parfum, linalool and coumarin. Only the toner and the two masks are free of it. No GENOSYS box avoids this, because all six are built around the same cleanser - buy the toner, the masks and the cream individually instead',
      'Your skin is broken, weeping or open. Nothing here is for use on a wound, and the overnight mask says to avoid the eye area',
      'You are treating acne or congestion rather than reactivity. The Problem Skin Care box is built for that',
      'Pigmentation or uneven tone is the goal. The Skin Brightening box targets it directly',
      'You already own two or three of these six. Buying the gaps on their own will cost you less',
    ],
    alternativesLabel: 'The boxes mentioned above',
    alternatives: [
      { productNumber: '55', label: 'Problem Skin Care Beauty Box' },
      { productNumber: '56', label: 'Skin Brightening Beauty Box' },
    ],
    note:
      'The cleanser, toner, serum and cream are all dermatologically tested. Skin is individual, though, so if one product does not agree with yours, drop that one rather than the whole routine - and patch test behind the ear first if you know you react.',
  },
  details: {
    eyebrow: 'Specifications',
    title: 'The details',
    rows: [
      {
        label: 'Contents',
        value: '6 products: cleanser 180ml, toner 200ml, serum 30ml, barrier cream 100g, overnight cream mask 100g, 1 sheet mask',
      },
      { label: 'Skin type', value: 'Sensitive and reactive skin. The cleanser and toner suit all skin types' },
      { label: 'Routine', value: 'Cleanse, tone, serum, cream, morning and evening. Overnight mask once or twice a week' },
      { label: 'Fragrance', value: 'Cleanser, serum and cream are fragranced. Toner and both masks are not' },
      { label: 'Clinical', value: 'Overnight mask: erythema −26%, water loss −15% over four weeks' },
      { label: 'Origin', value: 'Made in Korea by DTS MG Co., Ltd., Seoul' },
      { label: 'Testing', value: 'Cleanser, toner, serum and cream all dermatologically tested' },
      { label: 'Barcodes', value: 'Each product carries its own EAN, listed with the item above' },
      { label: 'Discounts', value: 'The bundle price is already the discount, so other offers do not stack on the box' },
    ],
  },
  faq: {
    eyebrow: 'Before you buy',
    title: 'Questions worth asking',
    items: [
      {
        q: 'It is called the sensitive box, so why is anything in it fragranced?',
        a: 'A fair question and we would rather answer it than bury it. Three of the six carry fragrance: the cleanser, the serum and the barrier cream. The toner and both masks do not. Every one of those ingredients is named on the label, and the amounts are small - the cream\u2019s parfum is around a hundredth of a per cent - but small is not zero, and if fragrance is your trigger then this box is the wrong purchase. The honest route in that case is to buy the toner, the two masks and skip the rest, because all six GENOSYS boxes are built around the same fragranced cleanser.',
      },
      {
        q: 'What happened to the EGF Repair Oxymask that used to be in this box?',
        a: 'It has been discontinued, so we replaced it with the Skin Rescue Overnight Cream Mask. It is the closer relative than the swap sounds: same cream-mask format, the same oxygen capsules that burst on contact, double the size at 100 g, and unlike the oxymask it has a four-week trial behind it measuring redness and water loss. The box is better for the change, not worse.',
      },
      {
        q: 'Can I just buy the products separately?',
        a: 'Yes, and each one is linked above. The box is not a different formula or an exclusive size, it is the same six units at a lower total. If you already own some, buying the gaps will cost you less than the box.',
      },
      {
        q: 'Do I use the overnight mask instead of the cream, or on top of it?',
        a: 'Instead of it, on the nights you use it. The mask is the last step and it stays on until morning, so on those nights the order is cleanse, tone, serum, mask. Use the barrier cream every other night. Once or twice a week is what the manufacturer specifies.',
      },
      {
        q: 'Can I use it while pregnant or breastfeeding?',
        a: 'We cannot answer that for this box. None of the six carries a pregnancy clearance in its paperwork, and the overnight mask\u2019s English carton carries no pregnancy warning either way - an absence is not a clearance. Take the ingredient lists to your doctor, who can also tell you whether niacinamide at 2% is something they are comfortable with.',
      },
      {
        q: 'My skin is red right now. Should I start with everything at once?',
        a: 'No. On angry skin, start with the toner and the barrier cream only, twice a day, for about a week. Add the serum next, then the overnight mask once things have settled. Introducing six products to reactive skin on the same evening makes it impossible to tell which one helped and which one did not.',
      },
      {
        q: 'How long will it last?',
        a: 'That depends on how heavy-handed you are. What is fixed: the cleanser, toner, serum and both creams are full retail units, and there is exactly one sheet mask, which is one session. The overnight mask at once or twice a week will outlast the daily items by a long way.',
      },
    ],
  },
}

const RU: BeautyBoxCopy = {
  ...EN,
  eyebrow: 'Beauty Box',
  backToProducts: 'Продукты',
  headline: 'Шесть полноразмерных шагов с честным раскрытием ароматических компонентов.',
  subheadline:
    'Очищение, бустер, сыворотка, крем и два формата масок в одном поэтапном уходе. Четырёхнедельные показатели TEWL и покраснения относятся только к ночной маске, а не ко всему набору.',
  heroBullets: [
    'Ровно шесть единиц: 180 мл + 200 мл + 30 мл + 100 г + 100 г + одна маска 25 г',
    'MultiEx BSASM® Plus 1% в сыворотке и церамид NP 5 000 ppm в креме',
    'Только ночная маска: TEWL −15% и выраженность покраснения −26% через четыре недели',
    'Проба на небольшом участке и поочерёдное введение средств',
  ],
  kitSize: '1 набор · 6 единиц',
  fullSizeNote: 'Полные размеры',
  vatIncluded: 'НДС включён',
  freeDelivery: 'Бесплатная доставка от 1 000 AED · Отправка из Дубая',
  addToBag: 'Добавить набор',
  adding: 'Добавляем...',
  added: 'Добавлено',
  outOfStock: 'Нет в наличии',
  loginToShop: 'Войдите, чтобы купить',
  inBag: 'В корзине',
  viewBag: 'Открыть корзину',
  badges: ['Оригинальный GENOSYS', 'Сделано в Корее', 'Шесть полных единиц', 'Собрано в ОАЭ'],
  stats: [
    { value: '6', label: 'полноразмерных продуктов' },
    { value: '1%', label: 'MultiEx BSASM® Plus в сыворотке' },
    { value: '5 000 ppm', label: 'церамида NP в креме' },
    { value: '15-20 мин', label: 'время тканевой маски' },
  ],
  contents: {
    ...EN.contents,
    eyebrow: 'Внутри',
    title: 'Шесть точных продуктов',
    intro: 'Страница берёт цены компонентов из каталога: 330 + 260 + 330 + 450 + 340 + 36 AED. При изменении цены расчёт обновится.',
    items: EN.contents.items.map((item, index) => {
      const localized = [
        ['Шаг 1 · Очищение', 'Нанесите на сухое лицо, избегая глаз. Дождитесь образования пены, мягко помассируйте круговыми движениями и смойте тёплой водой.', ['180 мл', 'Эфир 8%', 'SLES 2,4%', 'Parfum 0,15% · лимонен 0,108%']],
        ['Шаг 2 · Бустер', 'Наносите руками или распыляйте на чистую кожу утром и вечером. Parfum и эфирных масел нет, но в INCI есть экстракт семян грейпфрута.', ['200 мл', 'Бетаин 3%', 'Без Parfum и эфирных масел', 'Экстракт семян грейпфрута']],
        ['Шаг 3 · Сыворотка', 'Мягко вбейте по лицу перед кремом. MultiEx BSASM® Plus 1% объединяет семь растительных экстрактов; бетаин - 0,5%, аллантоин - 0,1%.', ['30 мл', 'MultiEx BSASM® Plus 1%', 'Масло апельсиновой цедры · лимонен']],
        ['Шаг 4 · Крем', 'Наносите после сыворотки утром и вечером, мягко прижимая пальцами. Церамид, глицерин и масло ши - факты формулы, а не результат набора.', ['100 г', 'Церамид NP 0,5%', 'Глицерин 17,49%', 'Parfum · линалоол · кумарин']],
        ['1-2 раза в неделю · Последний шаг', 'Используйте вместо крема последним вечерним шагом, избегайте области глаз и оставляйте на ночь. Четырёхнедельные показатели относятся только к этой маске.', ['100 г', 'Ниацинамид 2%', 'Аденозин 0,04%', 'TEWL −15% · покраснение −26%', 'Эфирные масла · цитраль · гераниол · лимонен']],
        ['Отдельный вечер с маской', 'После бустера наложите одну маску Eucalace® на 15-20 минут, снимите и мягко вбейте остатки, затем нанесите сыворотку и крем.', ['1 маска · 25 г', '15-20 минут', 'Масло мяты перечной', 'Использовать сразу после вскрытия']],
      ] as const
      return { ...item, step: localized[index]![0], body: localized[index]![1], facts: [...localized[index]![2]] }
    }),
    eanLabel: 'Штрихкод',
    each: 'за штуку',
    viewItem: 'Открыть страницу продукта',
    boughtSeparately: 'По отдельности',
    inThisBox: 'В наборе',
    youSave: 'Экономия',
    againstSeparate: 'по сравнению с шестью продуктами отдельно',
    seeBreakdown: 'Посмотреть расчёт',
    savingNote: 'Стоимость компонентов и экономия рассчитываются по текущим ценам каталога.',
  },
  howTo: {
    eyebrow: 'Схема ухода',
    title: 'Вводите шесть продуктов поэтапно',
    intro: 'Ежедневный порядок: очищение, бустер, сыворотка и крем. Две маски - отдельные вечерние варианты, а не дополнительные ежедневные слои.',
    steps: [
      { title: 'Утро', body: 'Очищение → бустер → сыворотка → крем → подходящее солнцезащитное средство.' },
      { title: 'Вечер', body: 'Очищение → бустер → сыворотка → крем.' },
      { title: 'Вечер с ночной маской', body: 'Очищение → бустер → сыворотка → ночная маска вместо крема. Используйте 1-2 раза в неделю и не смывайте.' },
      { title: 'Вечер с тканевой маской', body: 'Очищение → бустер → тканевая маска на 15-20 минут → сыворотка → крем. Недельная частота не указана.' },
      { title: 'Вводите постепенно', body: 'Проверяйте каждое средство на небольшом участке и добавляйте по одному. Отмените продукт при стойком жжении, покраснении, отёке или раздражении.' },
    ],
    note: 'Не наносите на повреждённую кожу. Упаковка SNOW O₂ предписывает избегать применения при беременности и грудном вскармливании. После процедур следуйте назначению специалиста.',
  },
  evidence: {
    eyebrow: 'Доказательная база',
    title: 'Каждый результат остаётся у своего продукта',
    intro: 'У набора нет собственного клинического исследования. Показатели эффективности здесь есть только у ночной маски.',
    cards: [
      { value: '−15%', title: 'TEWL', body: 'После четырёх недель применения только ночной маски Skin Rescue.' },
      { value: '−26%', title: 'Выраженность покраснения', body: 'После четырёх недель применения той же ночной маски.' },
      { value: '5 000 ppm', title: 'Церамид NP', body: 'Концентрация в формуле крема Skin Barrier Protecting, не клинический результат.' },
    ],
    footnote: 'Мы не заявляем для набора в целом успокоение, защиту, снижение чувствительности, восстановление барьера, регенерацию, глубокое увлажнение или постпроцедурный результат.',
  },
  suited: {
    eyebrow: 'Перед покупкой',
    title: 'Смотрите на формулы, а не только на название',
    forTitle: 'Рассмотрите набор, если',
    forList: [
      'Вам нужны именно эти шесть полноразмерных продуктов в поэтапном уходе',
      'Вы готовы проверять переносимость и вводить средства по одному',
      'Вам нужны несмываемая ночная маска и одна одноразовая тканевая маска',
    ],
    notForTitle: 'Выберите отдельные продукты, если',
    notForList: [
      'Отдушки, эфирные масла или ароматические растительные компоненты вызывают у вас реакцию',
      'Кожа повреждена, мокнет или активно воспалена',
      'Вам нужен постпроцедурный уход: следуйте рекомендациям специалиста',
      'Несколько продуктов из набора у вас уже есть',
    ],
    alternativesLabel: 'Другие наборы',
    alternatives: [
      { productNumber: '59', label: 'Deep Moisturizing Beauty Box' },
      { productNumber: '55', label: 'Problem Skin Care Beauty Box' },
    ],
    note: 'Отсутствие Parfum не означает полного отсутствия ароматических компонентов. В сыворотке, ночной и тканевой масках есть эфирные масла или ароматические растительные ингредиенты.',
  },
  details: {
    eyebrow: 'Характеристики',
    title: 'Детали набора',
    rows: [
      { label: 'Формат', value: '1 набор · 6 единиц' },
      { label: 'Состав', value: 'Очищение 180 мл · бустер 200 мл · сыворотка 30 мл · крем 100 г · ночная маска 100 г · тканевая маска 25 г' },
      { label: 'Ежедневно', value: 'Очищение → бустер → сыворотка → крем; утром SPF' },
      { label: 'Ночная маска', value: 'Вместо крема последним шагом, 1-2 раза в неделю' },
      { label: 'Тканевая маска', value: '15-20 минут; недельная частота не указана' },
      { label: 'Цена', value: 'Стоимость компонентов и экономия рассчитываются live' },
    ],
  },
  faq: {
    eyebrow: 'Вопросы',
    title: 'Что важно до начала ухода',
    items: [
      { q: 'Весь набор без отдушек?', a: 'Нет. В очищающем средстве и креме есть Parfum. Сыворотка содержит масло апельсиновой цедры и лимонен, ночная маска - несколько эфирных масел, цитраль, гераниол и лимонен, тканевая маска - масло мяты. В бустере нет Parfum и эфирных масел, но есть экстракт семян грейпфрута.' },
      { q: 'Показатели 15% и 26% относятся ко всему набору?', a: 'Нет. Оба показателя относятся только к четырёхнедельному исследованию ночной маски Skin Rescue.' },
      { q: 'Как часто использовать тканевую маску?', a: 'Оставьте её на 15-20 минут и используйте сразу после вскрытия. Недельная частота на упаковке не указана.' },
      { q: 'Начинать сразу со всех шести?', a: 'Нет. Сделайте пробу и вводите продукты по одному, чтобы распознать возможную реакцию.' },
    ],
  },
}

const AR: BeautyBoxCopy = {
  ...EN,
  eyebrow: 'صندوق الجمال',
  backToProducts: 'المنتجات',
  headline: 'ست خطوات كاملة الحجم مع إفصاح واضح عن المكونات العطرية.',
  subheadline: 'منظف ومعزز وسيروم وكريم ونوعان من الأقنعة ضمن روتين متدرج. تخص قياسات TEWL والاحمرار بعد أربعة أسابيع القناع الليلي وحده، ولا تنسب إلى المجموعة.',
  heroBullets: [
    'ست قطع بالضبط: 180 مل + 200 مل + 30 مل + 100 غ + 100 غ + قناع واحد 25 غ',
    'MultiEx BSASM® Plus بنسبة 1% في السيروم وسيراميد NP بتركيز 5,000 جزء في المليون في الكريم',
    'للقناع الليلي وحده: TEWL ‏−15% وتحسن مظهر الاحمرار 26% بعد أربعة أسابيع',
    'اختبار رقعة وإدخال منتج واحد في كل مرة',
  ],
  kitSize: 'مجموعة واحدة · 6 قطع',
  fullSizeNote: 'أحجام كاملة',
  vatIncluded: 'شامل ضريبة القيمة المضافة',
  freeDelivery: 'توصيل مجاني للطلبات فوق 1,000 درهم · يشحن من دبي',
  addToBag: 'أضيفي المجموعة',
  adding: 'جارٍ الإضافة...',
  added: 'تمت الإضافة',
  outOfStock: 'غير متوفر',
  loginToShop: 'سجلي الدخول للشراء',
  inBag: 'في سلتك',
  viewBag: 'عرض السلة',
  badges: ['GENOSYS أصلي', 'صنع في كوريا', 'ست قطع كاملة الحجم', 'جمعت في الإمارات'],
  stats: [
    { value: '6', label: 'منتجات كاملة الحجم' },
    { value: '1%', label: 'MultiEx BSASM® Plus في السيروم' },
    { value: '5,000 ppm', label: 'سيراميد NP في الكريم' },
    { value: '15-20 دقيقة', label: 'مدة القناع الورقي' },
  ],
  contents: {
    ...EN.contents,
    eyebrow: 'داخل المجموعة',
    title: 'ستة منتجات محددة',
    intro: 'تقرأ الصفحة أسعار المكونات مباشرة من الكتالوج: 330 + 260 + 330 + 450 + 340 + 36 درهماً. يتحدث الحساب عند تغير أي سعر.',
    items: EN.contents.items.map((item, index) => {
      const localized = [
        ['الخطوة 1 · التنظيف', 'يوضع على وجه جاف مع تجنب العينين. تترك الرغوة لتتكون، ثم يدلك بلطف بحركات دائرية ويشطف بالماء الفاتر.', ['180 مل', 'إيثر 8%', 'SLES ‏2.4%', 'Parfum ‏0.15% · ليمونين 0.108%']],
        ['الخطوة 2 · المعزز', 'يوضع باليدين أو يرش على بشرة نظيفة صباحاً ومساءً. لا يحتوي على Parfum أو زيوت عطرية، لكن INCI يتضمن مستخلص بذور الجريب فروت.', ['200 مل', 'بيتايين 3%', 'من دون Parfum أو زيوت عطرية', 'مستخلص بذور الجريب فروت']],
        ['الخطوة 3 · السيروم', 'يربت على الوجه قبل الكريم. يجمع MultiEx BSASM® Plus بنسبة 1% سبعة مستخلصات نباتية؛ والبيتايين 0.5% والألانتوين 0.1%.', ['30 مل', 'MultiEx BSASM® Plus ‏1%', 'زيت قشر البرتقال · الليمونين']],
        ['الخطوة 4 · الكريم', 'يوضع بعد السيروم صباحاً ومساءً ويربت بلطف. السيراميد والغليسرين وزبدة الشيا حقائق تخص التركيبة وليست نتيجة للمجموعة.', ['100 غ', 'سيراميد NP ‏0.5%', 'غليسرين 17.49%', 'Parfum · لينالول · كومارين']],
        ['1-2 مرة أسبوعياً · الخطوة الأخيرة', 'يستخدم بدلاً من الكريم كخطوة مسائية أخيرة مع تجنب محيط العينين، ويترك طوال الليل. تخص قياسات الأربعة أسابيع هذا القناع وحده.', ['100 غ', 'نياسيناميد 2%', 'أدينوزين 0.04%', 'TEWL ‏−15% · الاحمرار −26%', 'زيوت عطرية · سيترال · جيرانيول · ليمونين']],
        ['مساء منفصل للقناع', 'بعد المعزز، يوضع قناع Eucalace® واحد لمدة 15-20 دقيقة، ثم يرفع وتربت الخلاصة المتبقية ويتبع بالسيروم والكريم.', ['قناع واحد · 25 غ', '15-20 دقيقة', 'زيت النعناع الفلفلي', 'يستخدم فور فتحه']],
      ] as const
      return { ...item, step: localized[index]![0], body: localized[index]![1], facts: [...localized[index]![2]] }
    }),
    eanLabel: 'الباركود',
    each: 'للواحدة',
    viewItem: 'عرض صفحة المنتج',
    boughtSeparately: 'عند الشراء منفصلاً',
    inThisBox: 'في المجموعة',
    youSave: 'التوفير',
    againstSeparate: 'مقارنة بشراء المنتجات الستة منفصلة',
    seeBreakdown: 'عرض الحساب',
    savingNote: 'تحسب قيمة المكونات والتوفير وفق أسعار الكتالوج الحالية.',
  },
  howTo: {
    eyebrow: 'الروتين',
    title: 'أدخلي المنتجات الستة بالتدرج',
    intro: 'الترتيب اليومي هو المنظف ثم المعزز والسيروم والكريم. القناعان خياران لمسائين منفصلين، وليسا طبقتين يوميتين إضافيتين.',
    steps: [
      { title: 'الصباح', body: 'منظف ← معزز ← سيروم ← كريم ← واقي شمس مناسب.' },
      { title: 'المساء', body: 'منظف ← معزز ← سيروم ← كريم.' },
      { title: 'مساء القناع الليلي', body: 'منظف ← معزز ← سيروم ← القناع الليلي بدلاً من الكريم. يستخدم مرة أو مرتين أسبوعياً ولا يشطف.' },
      { title: 'مساء القناع الورقي', body: 'منظف ← معزز ← قناع ورقي 15-20 دقيقة ← سيروم ← كريم. لا تحدد العبوة وتيرة أسبوعية.' },
      { title: 'الإدخال التدريجي', body: 'اختبري كل منتج على رقعة صغيرة وأضيفي منتجاً واحداً في كل مرة. أوقفي المنتج عند استمرار الحرقان أو الاحمرار أو التورم أو التهيج.' },
    ],
    note: 'لا يطبق على بشرة متضررة. تنص عبوة SNOW O₂ على تجنب الاستخدام أثناء الحمل والرضاعة. بعد الإجراءات، اتبعي تعليمات المختص ولا تفترضي ملاءمة المجموعة.',
  },
  evidence: {
    eyebrow: 'الأدلة',
    title: 'كل نتيجة تبقى مرتبطة بمنتجها',
    intro: 'لا توجد دراسة سريرية للمجموعة نفسها. المنتج الوحيد الذي يقدم قياسات فعالية هنا هو القناع الليلي.',
    cards: [
      { value: '−15%', title: 'TEWL', body: 'بعد أربعة أسابيع مع قناع Skin Rescue الليلي وحده.' },
      { value: '−26%', title: 'مظهر الاحمرار', body: 'بعد أربعة أسابيع مع القناع الليلي نفسه.' },
      { value: '5,000 ppm', title: 'سيراميد NP', body: 'تركيز في كريم Skin Barrier Protecting، وليس نتيجة سريرية.' },
    ],
    footnote: 'لا ندعي للمجموعة ككل تهدئة أو حماية أو خفض الحساسية أو إعادة بناء الحاجز أو التجدد أو الترطيب العميق أو نتيجة بعد الإجراءات.',
  },
  suited: {
    eyebrow: 'قبل الشراء',
    title: 'راجعي التركيبات لا اسم المجموعة وحده',
    forTitle: 'يمكن النظر فيها إذا',
    forList: [
      'كنت تريدين هذه المنتجات الستة كاملة الحجم ضمن روتين متدرج',
      'كنت مستعدة لاختبار التحمل وإدخال المنتجات واحداً تلو الآخر',
      'كنت تريدين قناعاً ليلياً يترك على البشرة وقناعاً ورقياً أحادي الاستخدام',
    ],
    notForTitle: 'اختاري المنتجات منفردة إذا',
    notForList: [
      'كانت العطور أو الزيوت العطرية أو النباتات العطرية من محفزات بشرتك المعروفة',
      'كانت البشرة متضررة أو مترشحة أو ملتهبة بوضوح',
      'كنت تحتاجين خطة بعد إجراء؛ اتبعي تعليمات المختص الذي أجرى الجلسة',
      'كنت تملكين بالفعل عدة منتجات من المجموعة',
    ],
    alternativesLabel: 'مجموعات أخرى',
    alternatives: [
      { productNumber: '59', label: 'Deep Moisturizing Beauty Box' },
      { productNumber: '55', label: 'Problem Skin Care Beauty Box' },
    ],
    note: 'غياب Parfum لا يعني غياب جميع المكونات العطرية. يحتوي السيروم والقناع الليلي والقناع الورقي على زيوت أو نباتات عطرية.',
  },
  details: {
    eyebrow: 'المواصفات',
    title: 'تفاصيل المجموعة',
    rows: [
      { label: 'الشكل', value: 'مجموعة واحدة · 6 قطع' },
      { label: 'المحتويات', value: 'منظف 180 مل · معزز 200 مل · سيروم 30 مل · كريم 100 غ · قناع ليلي 100 غ · قناع ورقي 25 غ' },
      { label: 'يومياً', value: 'منظف ← معزز ← سيروم ← كريم؛ واقي الشمس صباحاً' },
      { label: 'القناع الليلي', value: 'بدلاً من الكريم كخطوة أخيرة، مرة أو مرتين أسبوعياً' },
      { label: 'القناع الورقي', value: '15-20 دقيقة؛ لا توجد وتيرة أسبوعية محددة' },
      { label: 'السعر', value: 'تحسب قيمة المكونات والتوفير مباشرة' },
    ],
  },
  faq: {
    eyebrow: 'أسئلة',
    title: 'ما يجب معرفته قبل الاستخدام',
    items: [
      { q: 'هل المجموعة كلها خالية من العطر؟', a: 'لا. يحتوي المنظف والكريم على Parfum. يحتوي السيروم على زيت قشر البرتقال والليمونين، والقناع الليلي على عدة زيوت عطرية وسيترال وجيرانيول وليمونين، والقناع الورقي على زيت النعناع. لا يحتوي المعزز على Parfum أو زيوت عطرية، لكنه يتضمن مستخلص بذور الجريب فروت.' },
      { q: 'هل تنطبق نتيجتا 15% و26% على المجموعة؟', a: 'لا. تخص النتيجتان الدراسة الممتدة أربعة أسابيع لقناع Skin Rescue الليلي وحده.' },
      { q: 'كم مرة يستخدم القناع الورقي؟', a: 'يترك 15-20 دقيقة ويستخدم فور فتحه. لا تحدد العبوة وتيرة أسبوعية.' },
      { q: 'هل أبدأ بالمنتجات الستة معاً؟', a: 'لا. اختبري كل منتج وأدخلي منتجاً واحداً في كل مرة حتى يمكن تمييز أي تفاعل.' },
    ],
  },
}

export const SENSITIVE_SKIN_COPY: BeautyBoxLocaleCopy = { en: EN, ar: AR, ru: RU }
