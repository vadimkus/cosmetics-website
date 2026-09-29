import type { BeautyBoxCopy, BeautyBoxLocaleCopy } from '../beautyBoxCopy'

/**
 * Copy for the SENSITIVE SKIN BEAUTY BOX page (product 62), in English,
 * Arabic and Russian. Campaign: "Handle with care." (Beauty Box style v1).
 *
 * ─── Sourcing rules ──────────────────────────────────────────────────────────
 *
 * This is a kit, so it has no efficacy dossier of its own. Every figure below
 * belongs to one of the six products inside it:
 *
 *   Snow O₂ 180ml
 *     Intertek/Ingredient lists_old/GENOSYS SNOW O2.pdf,
 *     Registration DOC/Artwork/[GENOSYS]SNOW O2(180ml).pdf
 *     Methyl Perfluoroisobutyl Ether 8% is the bubble agent (the 3.000% this
 *     block used to quote was stale). SLES 2.4%, Parfum 0.15%, Limonene 0.108%.
 *     The carton asks users to avoid it during pregnancy and breastfeeding.
 *
 *   Snow Booster 200ml
 *     Ingredient lists_old/GENOSYS SNOW BOOSTER.pdf
 *     Betaine 3.000%, pumpkin ferment 1.000%. No Parfum and no essential oils;
 *     the INCI does carry grapefruit seed extract.
 *
 *   All For Sensitive Serum 30ml
 *     Ingredient lists_old/GENOSYS ALL FOR SENSITIVE SERUM.pdf
 *     Registration DOC/SA/SA-GENOSYS ALL FOR SENSITIVE SERUM.pdf
 *     MultiEx BSASM Plus 1.0000% (BioSpectrum) = centella, polygonum,
 *     scutellaria, green tea, licorice, chamomile, rosemary. Betaine 0.5%,
 *     allantoin 0.1%. Orange peel oil 0.0024%, limonene 0.0176%.
 *
 *   Skin Barrier Protecting Cream 100g
 *     Ingredient lists_old/GENOSYS SKIN BARRIER PROTECTING CREAM.pdf
 *     Registration DOC/SA/SA-GENOSYS SKIN BARRIER PROTECTING CREAM.pdf
 *     Ceramide NP 0.5% = 5,000 ppm, glycerin 17.49% (SA), shea butter 3%.
 *     Parfum, linalool, coumarin.
 *
 *   Skin Rescue Overnight Cream Mask 100g
 *     Intertek/GENOSYS SKIN RESCUE OVERNIGHT CREAM MASK/ (Ingredients, Artwork,
 *     deck). Niacinamide 2%, adenosine 0.04%. Four-week trial: erythema −26%,
 *     TEWL −15% (product 34's own page carries both). Litsea cubeba, palmarosa,
 *     cedarwood, grapefruit peel and patchouli oils, citral, geraniol, limonene.
 *     Once or twice a week, last step, leave on, avoid the eyes.
 *
 *   Soothing Bomb Sea Algae Mask 25g ×1
 *     Intertek/Soothing Bomb Sea Mask/Ingredient_Report_*.pdf
 *     Eucalace® sheet, 15-20 minutes. Peppermint oil 0.005%.
 *
 * ─── Claims that must not come back ──────────────────────────────────────────
 *
 *   "The toner and both masks are fragrance-free"   Only the toner is. The
 *       overnight mask carries essential oils with citral, geraniol and
 *       limonene, and the sheet mask carries peppermint oil.
 *   The −26% and −15% readings are the overnight mask's, never the box's. RU and
 *   AR state it outright and __tests__/data/product62LocalizedCopy.test.ts
 *   holds that sentence in place.
 *   Aftercare after procedures is not a claim this box makes.
 */
const EN: BeautyBoxCopy = {
  eyebrow: 'Beauty Box',
  backToProducts: 'Products',
  headline: 'Handle with care.',
  subheadline:
    'Reactive skin flushes at the smallest thing: heat, air conditioning, a new cream. This box goes gently from the first step to the last. A cleanser that bubbles up on its own so nothing is scrubbed, a toner with no parfum or essential oils, a serum with seven plant extracts to relieve and protect, and the richest cream GENOSYS makes, with Ceramide NP at 5,000 ppm. For the nights skin needs more, an overnight cream mask that took redness down 26% in four weeks, and a sea algae sheet for the evening it runs hot.',
  heroBullets: [
    'Made for skin that flushes, stings or tightens easily, and for a barrier worn thin by retinoids, peels or a summer of air conditioning',
    'Redness down 26% and water loss down 15% after four weeks with the overnight cream mask',
    'Ceramide NP at 5,000 ppm with glycerin at 17.49% in the barrier cream',
    'Five full sizes and a sheet mask, for less than the six bought one by one',
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
    { value: '−26%', label: 'redness after four weeks with the overnight cream mask' },
    { value: '−15%', label: 'water lost through the skin, in the same trial' },
    { value: '5,000 ppm', label: 'Ceramide NP in the barrier cream' },
    { value: '6', label: 'full-size products, in the order you use them' },
  ],
  contents: {
    eyebrow: 'What is inside',
    title: 'Six products, handled gently',
    intro:
      'Every product here has its own page and its own price, so you can read the full detail on any of them before you buy. Together they run the whole routine without friction: cleanse without scrubbing, tone with nothing perfumed, relieve, then seal, with two masks for the nights skin asks for more.',
    items: [
      {
        titleKey: 'routineSnowO2Title',
        productNumber: '10',
        quantity: 1,
        step: 'Step 1 · Cleanse',
        body:
          'Goes on to a dry face, where bubbles form on their own and lift make-up and the day off the skin. Massage in circles as they appear, then rinse with tepid water. On reactive skin, the point is that nothing has to be scrubbed off.',
        facts: ['180 ml', 'Bubble agent 8%', 'Contains parfum, limonene and SLES'],
      },
      {
        titleKey: 'routineSnowBoosterTitle',
        productNumber: '16',
        quantity: 1,
        step: 'Step 2 · Tone',
        body:
          'The one step with no parfum and no essential oils in it. A daily toner that hydrates and soothes with botanical extracts and brings skin back into balance after cleansing. Press it in while skin is still damp, so the serum goes on to moist skin.',
        facts: ['200 ml', 'Betaine 3%', 'Pumpkin ferment 1%', 'No parfum or essential oils'],
      },
      {
        titleKey: 'routineAllForSensitiveSerumTitle',
        productNumber: '19',
        quantity: 1,
        step: 'Step 3 · Relieve',
        body:
          'The reason this is the sensitive box. MultiEx BSASM® Plus at a full 1% brings seven plants together - centella, polygonum, scutellaria, green tea, licorice, chamomile and rosemary - with allantoin and betaine behind them, to relieve and protect skin that reacts.',
        facts: ['30 ml', 'MultiEx BSASM® Plus 1%', 'Allantoin 0.1%', 'Contains orange peel oil and limonene'],
      },
      {
        titleKey: 'routineSkinBarrierCreamTitle',
        productNumber: '27',
        quantity: 1,
        step: 'Step 4 · Seal',
        body:
          'The richest cream GENOSYS makes. Ceramide NP at 5,000 ppm, a dose most ceramide creams never come near, with glycerin at 17.49% and shea butter at 3% behind it. Pat it on rather than rubbing it in.',
        facts: ['100 g', 'Ceramide NP 5,000 ppm', 'Glycerin 17.49%', 'Shea butter 3%', 'Contains parfum, linalool and coumarin'],
      },
      {
        titleKey: 'routineOvernightMaskTitle',
        productNumber: '34',
        quantity: 1,
        step: 'Once or twice a week · Overnight',
        body:
          'The treatment night, and the product with the trial behind it: redness down 26% and water loss down 15% after four weeks. Oxygen capsules burst as it goes on and melt into a pink ceramide cream. It takes the cream\u2019s place as the last step and stays on until morning.',
        facts: ['100 g', 'Niacinamide 2%', 'Adenosine 0.04%', 'Redness −26% in 4 weeks', 'Leave on · avoid the eyes', 'Contains essential oils, citral, geraniol, limonene'],
      },
      {
        titleKey: 'routineSoothingBombMaskTitle',
        productNumber: '36',
        quantity: 1,
        step: 'When skin runs hot',
        body:
          'One Eucalace® sheet soaked in a sea algae essence with centella. Fifteen to twenty minutes after toning, on the evening skin feels hot or tight, then serum and cream as usual. One sheet: keep it for the night you need it.',
        facts: ['1 sheet · 25 g', '15-20 minutes', 'Contains peppermint oil', 'Use as soon as it is opened'],
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
    title: 'Four steps daily, two masks when skin asks',
    intro:
      'Cleanse, tone, serum, cream, morning and evening. The overnight mask takes the cream\u2019s place once or twice a week; the sheet mask is for the evening skin has had enough. Each product carries its full instructions on its own page.',
    steps: [
      {
        title: 'Cleanse on dry skin',
        body:
          'Pump the cleanser on to a dry face, avoiding the eyes. Wait for the bubbles, massage in circles, rinse with tepid water. Morning and evening, and no flannel or brush.',
      },
      {
        title: 'Tone while skin is damp',
        body:
          'Straight after cleansing, before skin dries, pressed in with your palms rather than wiped. This is the step with no parfum or essential oils, so on a bad week you can pare the routine back to tone and seal.',
      },
      {
        title: 'Serum, two or three drops',
        body:
          'Pat it over face and neck and let it settle rather than rubbing it in. Morning and evening, always before the cream.',
      },
      {
        title: 'Cream to close',
        body:
          'Apply on the face and pat gently: reactive skin prefers pressure to friction. In the morning, finish with your sunscreen.',
      },
      {
        title: 'Overnight mask, once or twice a week',
        body:
          'On those nights it goes on last instead of the cream, and it stays on until morning: do not wash it off. Keep it away from the eyes.',
      },
      {
        title: 'Sheet mask on the hot evening',
        body:
          'After toning, lay the sheet on for 15 to 20 minutes, take it off, pat in what is left, then serum and cream as normal. There is one sheet in the box.',
      },
    ],
    note:
      'Sunscreen is the one thing this routine assumes and does not contain. If your skin is broken, weeping or freshly treated, wait until it has closed before starting anything here. The SNOW O₂ carton asks you to avoid it during pregnancy and breastfeeding.',
  },
  evidence: {
    eyebrow: 'The clinical results',
    title: 'Measured on real skin',
    intro:
      'The overnight cream mask went through a four-week trial on the two readings reactive skin cares about most: how red it looks, and how much water it loses. Here is what came back.',
    cards: [
      {
        value: '−26%',
        title: 'Less redness in four weeks',
        body:
          'Erythema, the redness most people mean when they say their skin is sensitive, improved 26% over four weeks with the overnight cream mask.',
      },
      {
        value: '−15%',
        title: 'Less water lost through the skin',
        body:
          'Transepidermal water loss fell 15% in the same trial. That is a barrier reading: it measures how much moisture skin is leaking, not how much you put on it.',
      },
      {
        value: '5,000 ppm',
        title: 'Ceramide NP in the barrier cream',
        body:
          'Ceramide NP at 0.5% of the formula, which is 5,000 ppm and far above where ceramide creams usually sit. Behind it, glycerin at 17.49% and shea butter at 3%.',
      },
    ],
    footnote:
      'Both readings come from the four-week trial of the overnight cream mask. The cleanser, toner, serum and cream are all dermatologically tested.',
  },
  suited: {
    eyebrow: 'Suitability',
    title: 'Who this box is for',
    forTitle: 'A good match if',
    forList: [
      'Your skin flushes, stings or reddens easily and you want the whole sequence rather than one more single',
      'Your barrier is worn thin from over-exfoliating, retinoids, hard water or a Dubai summer of air conditioning',
      'You want a treatment night once or twice a week, not just a cream',
      'You would rather patch test and add products one at a time than change everything at once',
    ],
    notForTitle: 'Look elsewhere if',
    notForList: [
      'Fragrance is what sets your skin off. Only the toner is free of parfum and essential oils: the cleanser and cream carry parfum, the serum orange peel oil, the overnight mask essential oils with citral, geraniol and limonene, and the sheet mask peppermint oil. Buy the toner on its own instead',
      'Your skin is broken, weeping or open, or you need aftercare following a procedure: follow the plan from whoever treated you',
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
      'The cleanser, toner, serum and cream are all dermatologically tested. Skin is individual, so if one product does not agree with yours, drop that one rather than the whole routine, and patch test first if you know you react.',
  },
  details: {
    eyebrow: 'Specifications',
    title: 'The details',
    rows: [
      {
        label: 'Contents',
        value: '6 products: cleanser 180 ml, toner 200 ml, serum 30 ml, barrier cream 100 g, overnight cream mask 100 g, 1 sheet mask 25 g',
      },
      { label: 'Skin type', value: 'Sensitive and reactive skin. The cleanser and toner suit all skin types' },
      { label: 'Routine', value: 'Cleanse, tone, serum, cream, morning and evening. Overnight mask once or twice a week' },
      { label: 'Fragrance', value: 'Only the toner is free of parfum and essential oils. Each fragrance ingredient is named on its product page' },
      { label: 'Clinical', value: 'Overnight cream mask: redness −26%, water loss −15% over four weeks' },
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
        q: 'It is the sensitive box, so why is anything in it fragranced?',
        a: 'We would rather answer that here than have you find it on a label. Five of the six contain fragrance ingredients: parfum in the cleanser and the cream, orange peel oil in the serum, essential oils with citral, geraniol and limonene in the overnight mask, and peppermint oil in the sheet mask. The toner has no parfum and no essential oils. The amounts are small and every one is named on its product page, but if fragrance is your trigger, buy the toner on its own rather than the box.',
      },
      {
        q: 'What happened to the EGF Repair Oxymask that used to be in this box?',
        a: 'It was discontinued, so the Skin Rescue Overnight Cream Mask took its place: the same cream-mask format with oxygen capsules that burst as it goes on, twice the size at 100 g, and a four-week trial behind it measuring redness and water loss.',
      },
      {
        q: 'Can I just buy the products separately?',
        a: 'Yes, and each one is linked above. The box is the same six units at a lower total, not a different formula or an exclusive size. If you already own some, buying the gaps will cost you less than the box.',
      },
      {
        q: 'Do I use the overnight mask instead of the cream, or on top of it?',
        a: 'Instead of it, on the nights you use it. The mask is the last step and stays on until morning, so on those nights the order is cleanse, tone, serum, mask. Once or twice a week; the barrier cream covers the other nights.',
      },
      {
        q: 'Can I use it while pregnant or breastfeeding?',
        a: 'Ask your doctor first. The SNOW O₂ carton asks you to avoid it during pregnancy and breastfeeding, and none of the other five carries a pregnancy clearance. Take the ingredient lists to your appointment; your doctor can also tell you whether niacinamide at 2% suits you.',
      },
      {
        q: 'My skin is red right now. Should I start with everything at once?',
        a: 'No. On angry skin, start with the toner and the barrier cream only, twice a day, until things settle. Add the serum next, then the overnight mask. Bringing six products to reactive skin on one evening makes it impossible to tell which one helped.',
      },
      {
        q: 'How long will it last?',
        a: 'That depends on your hand. The cleanser, toner, serum and both creams are full retail units, and there is exactly one sheet mask, which is one evening. At once or twice a week, the overnight mask will outlast the daily items by a long way.',
      },
    ],
  },
}

const RU: BeautyBoxCopy = {
  ...EN,
  eyebrow: 'Beauty Box',
  backToProducts: 'Продукты',
  headline: 'Обращаться бережно.',
  subheadline:
    'Реактивная кожа краснеет от любой мелочи: жара, кондиционер, новый крем. Этот набор бережен от первого шага до последнего. Очищение, которое само пенится, так что ничего не нужно тереть; тоник без Parfum и эфирных масел; сыворотка с семью растительными экстрактами, которая успокаивает и защищает; и самый насыщенный крем GENOSYS с церамидом NP 5 000 ppm. Для вечеров, когда коже нужно больше, - ночная маска и тканевая маска с морскими водорослями.',
  heroBullets: [
    'Для кожи, которая легко краснеет, жжёт или стягивается, и для барьера, ослабленного ретиноидами, пилингами или летом под кондиционером',
    'Только ночная маска: TEWL −15% и выраженность покраснения −26% через четыре недели',
    'Церамид NP 5 000 ppm и глицерин 17,49% в креме, MultiEx BSASM® Plus 1% в сыворотке',
    'Пять полноразмерных средств и тканевая маска дешевле, чем шесть продуктов по отдельности',
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
    { value: '−26%', label: 'покраснения за четыре недели с ночной маской' },
    { value: '−15%', label: 'потери влаги через кожу в том же исследовании' },
    { value: '5 000 ppm', label: 'церамида NP в креме' },
    { value: '6', label: 'полноразмерных продуктов в порядке применения' },
  ],
  contents: {
    ...EN.contents,
    eyebrow: 'Внутри',
    title: 'Шесть продуктов, бережно',
    intro: 'У каждого продукта своя страница и своя цена, так что любой можно изучить до покупки. Вместе они проводят весь уход без трения: очищение без растирания, тоник без Parfum, сыворотка, крем и две маски для вечеров, когда коже нужно больше.',
    items: EN.contents.items.map((item, index) => {
      const localized = [
        ['Шаг 1 · Очищение', 'Нанесите на сухое лицо, избегая глаз: пена образуется сама и снимает макияж и следы дня. Мягко помассируйте круговыми движениями и смойте тёплой водой. Ничего не нужно тереть.', ['180 мл', 'Эфир 8%', 'SLES 2,4%', 'Parfum 0,15% · лимонен 0,108%']],
        ['Шаг 2 · Тоник', 'Единственный шаг без Parfum и эфирных масел. Увлажняет и успокаивает растительными экстрактами и возвращает коже баланс после очищения. Вбивайте, пока кожа ещё влажная. В INCI есть экстракт семян грейпфрута.', ['200 мл', 'Бетаин 3%', 'Без Parfum и эфирных масел', 'Экстракт семян грейпфрута']],
        ['Шаг 3 · Успокоение', 'Главная причина, почему это набор для чувствительной кожи. MultiEx BSASM® Plus 1% объединяет семь растений - центеллу, горец, шлемник, зелёный чай, солодку, ромашку и розмарин; за ними бетаин 0,5% и аллантоин 0,1%.', ['30 мл', 'MultiEx BSASM® Plus 1%', 'Масло апельсиновой цедры · лимонен']],
        ['Шаг 4 · Защита', 'Самый насыщенный крем GENOSYS: церамид NP 5 000 ppm, глицерин 17,49% и масло ши 3%. Наносите после сыворотки утром и вечером, мягко прижимая пальцами.', ['100 г', 'Церамид NP 0,5%', 'Глицерин 17,49%', 'Parfum · линалоол · кумарин']],
        ['1-2 раза в неделю · Последний шаг', 'Ночь-уход: кислородные капсулы лопаются при нанесении и тают в розовом креме с церамидом. Используйте вместо крема последним вечерним шагом, избегайте области глаз и оставляйте на ночь. Четырёхнедельные показатели относятся только к этой маске.', ['100 г', 'Ниацинамид 2%', 'Аденозин 0,04%', 'TEWL −15% · покраснение −26%', 'Эфирные масла · цитраль · гераниол · лимонен']],
        ['Когда кожа горит', 'После тоника наложите одну маску Eucalace® на 15-20 минут, снимите и мягко вбейте остатки, затем нанесите сыворотку и крем. Одна маска - для того вечера, когда она нужна.', ['1 маска · 25 г', '15-20 минут', 'Масло мяты перечной', 'Использовать сразу после вскрытия']],
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
    title: 'Четыре шага каждый день, две маски по необходимости',
    intro: 'Каждый день: очищение, тоник, сыворотка и крем. Две маски - для отдельных вечеров, а не дополнительные ежедневные слои.',
    steps: [
      { title: 'Утро', body: 'Очищение → тоник → сыворотка → крем → подходящее солнцезащитное средство.' },
      { title: 'Вечер', body: 'Очищение → тоник → сыворотка → крем.' },
      { title: 'Вечер с ночной маской', body: 'Очищение → тоник → сыворотка → ночная маска вместо крема. Используйте 1-2 раза в неделю и не смывайте.' },
      { title: 'Вечер с тканевой маской', body: 'Очищение → тоник → тканевая маска на 15-20 минут → сыворотка → крем. Недельная частота не указана.' },
      { title: 'Вводите постепенно', body: 'Проверяйте каждое средство на небольшом участке и добавляйте по одному. Отмените продукт при стойком жжении, покраснении, отёке или раздражении.' },
    ],
    note: 'Не наносите на повреждённую кожу. Упаковка SNOW O₂ предписывает избегать применения при беременности и грудном вскармливании. После процедур следуйте назначению специалиста.',
  },
  evidence: {
    eyebrow: 'Клинические результаты',
    title: 'Измерено на коже',
    intro: 'Ночная маска прошла четырёхнедельное исследование по двум показателям, которые важнее всего для реактивной кожи: насколько она красная и сколько влаги теряет.',
    cards: [
      { value: '−26%', title: 'Меньше покраснения', body: 'Выраженность покраснения снизилась на 26% после четырёх недель применения только ночной маски Skin Rescue.' },
      { value: '−15%', title: 'Меньше потери влаги', body: 'Трансэпидермальная потеря воды (TEWL) снизилась на 15% в том же исследовании той же ночной маски.' },
      { value: '5 000 ppm', title: 'Церамид NP', body: 'Концентрация в формуле крема Skin Barrier Protecting - намного выше, чем обычно в кремах с церамидами.' },
    ],
    footnote: 'Мы не заявляем для набора в целом успокоение, защиту, снижение чувствительности, восстановление барьера, регенерацию, глубокое увлажнение или постпроцедурный результат.',
  },
  suited: {
    eyebrow: 'Кому подойдёт',
    title: 'Для кого этот набор',
    forTitle: 'Подойдёт, если',
    forList: [
      'Кожа легко краснеет, жжёт или стягивается, и вам нужен весь порядок ухода, а не ещё одно средство',
      'Барьер ослаблен пилингами, ретиноидами, жёсткой водой или летом под кондиционером',
      'Вам нужна ночь-уход один-два раза в неделю, а не просто крем',
      'Вы готовы проверять переносимость и вводить средства по одному',
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
      { label: 'Состав', value: 'Очищение 180 мл · тоник 200 мл · сыворотка 30 мл · крем 100 г · ночная маска 100 г · тканевая маска 25 г' },
      { label: 'Ежедневно', value: 'Очищение → тоник → сыворотка → крем; утром SPF' },
      { label: 'Ночная маска', value: 'Вместо крема последним шагом, 1-2 раза в неделю' },
      { label: 'Тканевая маска', value: '15-20 минут; недельная частота не указана' },
      { label: 'Цена', value: 'Стоимость компонентов и экономия считаются по текущим ценам' },
    ],
  },
  faq: {
    eyebrow: 'Вопросы',
    title: 'Что важно до начала ухода',
    items: [
      { q: 'Весь набор без отдушек?', a: 'Нет. В очищающем средстве и креме есть Parfum. Сыворотка содержит масло апельсиновой цедры и лимонен, ночная маска - несколько эфирных масел, цитраль, гераниол и лимонен, тканевая маска - масло мяты. В тонике нет Parfum и эфирных масел, но есть экстракт семян грейпфрута.' },
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
  headline: 'تعاملي معها بعناية.',
  subheadline: 'البشرة المتفاعلة تحمرّ لأبسط سبب: الحرارة، والمكيّف، وكريم جديد. هذا الصندوق لطيف من الخطوة الأولى حتى الأخيرة. منظف يتحوّل إلى فقاعات بنفسه فلا حاجة للفرك، وتونر بلا Parfum ولا زيوت عطرية، وسيروم بسبعة مستخلصات نباتية يلطّف ويحمي، وأغنى كريم تصنعه GENOSYS مع سيراميد NP بتركيز 5,000 جزء في المليون. وللأمسيات التي تحتاج فيها البشرة إلى المزيد، قناع ليلي كريمي وقناع ورقي بالطحالب البحرية.',
  heroBullets: [
    'للبشرة التي تحمرّ أو تلسع أو تشدّ بسهولة، وللحاجز الذي أضعفه الريتينويد أو التقشير أو صيف تحت المكيّف',
    'للقناع الليلي وحده: TEWL ‏−15% وتحسن مظهر الاحمرار 26% بعد أربعة أسابيع',
    'سيراميد NP بتركيز 5,000 جزء في المليون وغليسرين 17.49% في الكريم، وMultiEx BSASM® Plus بنسبة 1% في السيروم',
    'خمسة منتجات كاملة الحجم وقناع ورقي بسعر أقل من شراء الستة منفردة',
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
    { value: '−26%', label: 'احمرار بعد أربعة أسابيع مع القناع الليلي' },
    { value: '−15%', label: 'فقدان الماء عبر البشرة في الدراسة نفسها' },
    { value: '5,000 ppm', label: 'سيراميد NP في الكريم' },
    { value: '6', label: 'منتجات كاملة الحجم بترتيب الاستخدام' },
  ],
  contents: {
    ...EN.contents,
    eyebrow: 'داخل المجموعة',
    title: 'ستة منتجات، بلطف',
    intro: 'لكل منتج صفحته وسعره، فيمكنك قراءة تفاصيل أي منها قبل الشراء. ومعاً تؤدي الروتين كله بلا احتكاك: تنظيف بلا فرك، وتونر بلا Parfum، ثم سيروم وكريم، وقناعان للأمسيات التي تحتاج فيها البشرة إلى المزيد.',
    items: EN.contents.items.map((item, index) => {
      const localized = [
        ['الخطوة 1 · التنظيف', 'يوضع على وجه جاف مع تجنب العينين، فتتكوّن الفقاعات بنفسها وترفع المكياج وآثار اليوم. دلّكي بلطف بحركات دائرية ثم اشطفي بالماء الفاتر. لا شيء يحتاج إلى فرك.', ['180 مل', 'إيثر 8%', 'SLES ‏2.4%', 'Parfum ‏0.15% · ليمونين 0.108%']],
        ['الخطوة 2 · التونر', 'الخطوة الوحيدة بلا Parfum ولا زيوت عطرية. يرطب ويلطّف بمستخلصات نباتية ويعيد التوازن إلى البشرة بعد التنظيف. ربّتيه والبشرة ما زالت رطبة. يتضمن INCI مستخلص بذور الجريب فروت.', ['200 مل', 'بيتايين 3%', 'من دون Parfum أو زيوت عطرية', 'مستخلص بذور الجريب فروت']],
        ['الخطوة 3 · التلطيف', 'السبب في أن هذا صندوق البشرة الحساسة. يجمع MultiEx BSASM® Plus بنسبة 1% سبعة نباتات: السنتيلا، وعقدة اليابان، والسكوتيلاريا، والشاي الأخضر، وعرق السوس، والبابونج، وإكليل الجبل، ومعها بيتايين 0.5% وألانتوين 0.1%.', ['30 مل', 'MultiEx BSASM® Plus ‏1%', 'زيت قشر البرتقال · الليمونين']],
        ['الخطوة 4 · الحماية', 'أغنى كريم تصنعه GENOSYS: سيراميد NP بتركيز 5,000 جزء في المليون، وغليسرين 17.49%، وزبدة الشيا 3%. يوضع بعد السيروم صباحاً ومساءً ويربت بلطف.', ['100 غ', 'سيراميد NP ‏0.5%', 'غليسرين 17.49%', 'Parfum · لينالول · كومارين']],
        ['1-2 مرة أسبوعياً · الخطوة الأخيرة', 'ليلة العناية: كبسولات أكسجين تنفجر عند التطبيق وتذوب في كريم وردي بالسيراميد. يستخدم بدلاً من الكريم كخطوة مسائية أخيرة مع تجنب محيط العينين، ويترك طوال الليل. تخص قياسات الأربعة أسابيع هذا القناع وحده.', ['100 غ', 'نياسيناميد 2%', 'أدينوزين 0.04%', 'TEWL ‏−15% · الاحمرار −26%', 'زيوت عطرية · سيترال · جيرانيول · ليمونين']],
        ['حين تسخن البشرة', 'بعد التونر، يوضع قناع Eucalace® واحد لمدة 15-20 دقيقة، ثم يرفع وتربت الخلاصة المتبقية ويتبع بالسيروم والكريم. قناع واحد لليلة التي تحتاجينه فيها.', ['قناع واحد · 25 غ', '15-20 دقيقة', 'زيت النعناع الفلفلي', 'يستخدم فور فتحه']],
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
    title: 'أربع خطوات يومياً، وقناعان عند الحاجة',
    intro: 'كل يوم: المنظف ثم التونر والسيروم والكريم. القناعان لأمسيات منفصلة، وليسا طبقتين يوميتين إضافيتين.',
    steps: [
      { title: 'الصباح', body: 'منظف ← تونر ← سيروم ← كريم ← واقي شمس مناسب.' },
      { title: 'المساء', body: 'منظف ← تونر ← سيروم ← كريم.' },
      { title: 'مساء القناع الليلي', body: 'منظف ← تونر ← سيروم ← القناع الليلي بدلاً من الكريم. يستخدم مرة أو مرتين أسبوعياً ولا يشطف.' },
      { title: 'مساء القناع الورقي', body: 'منظف ← تونر ← قناع ورقي 15-20 دقيقة ← سيروم ← كريم. لا تحدد العبوة وتيرة أسبوعية.' },
      { title: 'الإدخال التدريجي', body: 'اختبري كل منتج على رقعة صغيرة وأضيفي منتجاً واحداً في كل مرة. أوقفي المنتج عند استمرار الحرقان أو الاحمرار أو التورم أو التهيج.' },
    ],
    note: 'لا يطبق على بشرة متضررة. تنص عبوة SNOW O₂ على تجنب الاستخدام أثناء الحمل والرضاعة. بعد الإجراءات، اتبعي تعليمات المختص.',
  },
  evidence: {
    eyebrow: 'النتائج السريرية',
    title: 'قيس على البشرة',
    intro: 'خضع القناع الليلي لدراسة مدتها أربعة أسابيع على القراءتين الأهم للبشرة المتفاعلة: مقدار احمرارها، ومقدار الماء الذي تفقده.',
    cards: [
      { value: '−26%', title: 'احمرار أقل', body: 'تحسن مظهر الاحمرار 26% بعد أربعة أسابيع مع قناع Skin Rescue الليلي وحده.' },
      { value: '−15%', title: 'فقدان أقل للماء', body: 'انخفض فقدان الماء عبر البشرة (TEWL) بنسبة 15% في الدراسة نفسها للقناع الليلي نفسه.' },
      { value: '5,000 ppm', title: 'سيراميد NP', body: 'تركيز في كريم Skin Barrier Protecting، وهو أعلى بكثير مما تحتويه كريمات السيراميد عادة.' },
    ],
    footnote: 'لا ندعي للمجموعة ككل تهدئة أو حماية أو خفض الحساسية أو إعادة بناء الحاجز أو التجدد أو الترطيب العميق أو نتيجة بعد الإجراءات.',
  },
  suited: {
    eyebrow: 'لمن تناسب',
    title: 'لمن هذا الصندوق',
    forTitle: 'مناسب إذا',
    forList: [
      'كانت بشرتك تحمرّ أو تلسع أو تشدّ بسهولة، وتريدين الروتين كاملاً لا منتجاً إضافياً واحداً',
      'كان الحاجز قد ضعف بسبب التقشير أو الريتينويد أو الماء العسر أو صيف تحت المكيّف',
      'كنت تريدين ليلة عناية مرة أو مرتين أسبوعياً، لا مجرد كريم',
      'كنت مستعدة لاختبار التحمل وإدخال المنتجات واحداً تلو الآخر',
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
      { label: 'المحتويات', value: 'منظف 180 مل · تونر 200 مل · سيروم 30 مل · كريم 100 غ · قناع ليلي 100 غ · قناع ورقي 25 غ' },
      { label: 'يومياً', value: 'منظف ← تونر ← سيروم ← كريم؛ واقي الشمس صباحاً' },
      { label: 'القناع الليلي', value: 'بدلاً من الكريم كخطوة أخيرة، مرة أو مرتين أسبوعياً' },
      { label: 'القناع الورقي', value: '15-20 دقيقة؛ لا توجد وتيرة أسبوعية محددة' },
      { label: 'السعر', value: 'تحسب قيمة المكونات والتوفير وفق الأسعار الحالية' },
    ],
  },
  faq: {
    eyebrow: 'أسئلة',
    title: 'ما يجب معرفته قبل الاستخدام',
    items: [
      { q: 'هل المجموعة كلها خالية من العطر؟', a: 'لا. يحتوي المنظف والكريم على Parfum. يحتوي السيروم على زيت قشر البرتقال والليمونين، والقناع الليلي على عدة زيوت عطرية وسيترال وجيرانيول وليمونين، والقناع الورقي على زيت النعناع. لا يحتوي التونر على Parfum أو زيوت عطرية، لكنه يتضمن مستخلص بذور الجريب فروت.' },
      { q: 'هل تنطبق نتيجتا 15% و26% على المجموعة؟', a: 'لا. تخص النتيجتان الدراسة الممتدة أربعة أسابيع لقناع Skin Rescue الليلي وحده.' },
      { q: 'كم مرة يستخدم القناع الورقي؟', a: 'يترك 15-20 دقيقة ويستخدم فور فتحه. لا تحدد العبوة وتيرة أسبوعية.' },
      { q: 'هل أبدأ بالمنتجات الستة معاً؟', a: 'لا. اختبري كل منتج وأدخلي منتجاً واحداً في كل مرة حتى يمكن تمييز أي تفاعل.' },
    ],
  },
}

export const SENSITIVE_SKIN_COPY: BeautyBoxLocaleCopy = { en: EN, ar: AR, ru: RU }
