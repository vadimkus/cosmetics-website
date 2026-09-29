/**
 * Bespoke copy for the GENOSYS DTS Microneedle Roller page (product 1).
 *
 * Product facts come from data/product1LocalizedCopy.ts (EN, RU, AR); this file
 * only adds the page chrome. Every figure here is one the product record
 * already carries: 540 / 450 / 405 needles by length against 192 on a typical
 * wire roller, 0.2 mm SUS 304(H) needles, gamma sterilisation with a yellow to
 * red indicator, up to 500,000 channels in a ten-minute session.
 */

import {
  PRODUCT_1_AR_TRANSLATION,
  PRODUCT_1_EN,
  PRODUCT_1_RU_TRANSLATION,
} from '@/data/product1LocalizedCopy'
import { dtsToolFacts, pickLocale, type DtsToolCopy, type DtsToolLocale } from '../dtstool/dtsToolCopy'

const en = dtsToolFacts(PRODUCT_1_EN, 'en')

const EN: DtsToolCopy = {
  eyebrow: 'GENOSYS DTS · Microneedling',
  headline: 'Every needle counts.',
  subheadline:
    'Every needle cut from a metal disk, 0.2 mm fine and gamma-sterilised, for one precise, comfortable, perfectly clean session. Up to 500,000 micro-channels in ten minutes open the way for the ampoule you apply.',
  heroBullets: en.heroBullets,
  badges: ['Made in Korea', 'CE · ISO 13485', 'Gamma-sterilised', 'Official UAE distributor'],
  chooseLength: 'Choose the needle length',
  lengthNote: 'The practitioner matches the length to the area and the goal, and sets the interval between sessions.',
  protocolTag: '',
  addToBag: 'Add to bag',
  adding: 'Adding…',
  added: 'Added',
  inBag: 'In your bag',
  viewBag: 'View bag',
  loginToShop: 'Log in to shop',
  outOfStock: 'Out of stock',
  vatIncluded: 'VAT included',
  freeDelivery: 'Free delivery over 1,000 AED · Ships from Dubai',
  stats: [
    { value: '540', label: 'needles on the 0.25 mm head, against 192 on a wire roller' },
    { value: '0.2 mm', label: 'needles, finer than the usual 0.25 to 0.3 mm' },
    { value: '500,000', label: 'micro-channels in a ten-minute session' },
    { value: '5', label: 'needle lengths, 0.25 to 2.0 mm' },
  ],
  why: {
    eyebrow: 'Why DTS',
    title: 'A drum with nothing to come loose.',
    intro:
      'Most rollers are wire needles glued into a drum. DTS cuts every row from a single metal disk, so there is no wire and no glue, more needles fit on the head, and the drum stays perfect for the whole session.',
    cards: en.cards,
  },
  pairing: {
    eyebrow: 'Made for the ampoule',
    title: 'Every pass opens a way in.',
    body: 'Cleanse, spread a Power Solution ampoule over the skin, then roll. The channels are there for the ampoule you apply, which is why the roller is always part of a treatment and never the whole of one.',
    viewProduct: 'View the Power Solution range',
  },
  lengths: {
    eyebrow: 'Five lengths',
    title: 'One drum, five depths.',
    body: '0.25, 0.5, 1.0, 1.5 and 2.0 mm. The shorter lengths carry more needles per head: 540 at 0.25 mm, 450 at 0.5 and 1.0 mm, 405 at 1.5 and 2.0 mm. The practitioner matches the roller to the area and the goal.',
  },
  howTo: {
    eyebrow: 'How to use',
    title: 'Horizontal. Vertical. Diagonal.',
    frequency: 'One roller per session',
    steps: en.steps,
    note: 'Slow, even passes with steady pressure. No zig-zags and no sudden moves: the drum does the work.',
  },
  cautions: {
    eyebrow: 'Before you use it',
    title: 'Precautions',
    points: en.cautions,
    note: 'Sealed until the session, discarded after. Never cleaned or reused.',
  },
  routine: { eyebrow: 'The treatment', title: 'Works with', viewProduct: 'View product' },
  details: { eyebrow: 'Specification', title: 'The details.', rows: en.detailRows },
  faq: {
    eyebrow: 'Questions',
    title: 'Before you add it.',
    items: [
      {
        q: 'Which length should I choose?',
        a: 'The practitioner matches the length to the area and the goal, and sets the pressure and the interval between sessions.',
      },
      {
        q: 'How is it different from a wire roller?',
        a: 'A typical wire roller carries 192 needles glued into the drum. DTS cuts every row from a metal disk, so the 0.25 mm head carries 540 and nothing can come loose mid-pass.',
      },
      {
        q: 'How do I know it is sterile?',
        a: 'Every roller is gamma-sterilised and sealed, and the indicator turns from yellow to red to prove it. Open the pack right before the session.',
      },
      {
        q: 'Can I use it more than once?',
        a: 'No. One roller, one session: discard it afterwards and never clean or reuse it.',
      },
      {
        q: 'What goes on after?',
        a: 'A treatment mask and the Soothing Repair Postcream, with sun protection during the day.',
      },
      {
        q: 'Is it for the scalp too?',
        a: 'For the scalp, use the GENOSYS DTS stamp: the same disk needles, pressed straight down between the hairs so nothing tangles.',
      },
    ],
  },
  backToProducts: 'All products',
}

const ru = dtsToolFacts(PRODUCT_1_RU_TRANSLATION, 'ru')

const RU: DtsToolCopy = {
  eyebrow: 'GENOSYS DTS · Микронидлинг',
  headline: 'Важна каждая игла.',
  subheadline:
    'Каждая игла вырезана из металлического диска, толщина 0,2 мм, гамма-стерилизация - для одной точной, комфортной и идеально чистой процедуры. До 500 000 микроканалов за десять минут открывают путь ампуле, которую вы наносите.',
  heroBullets: ru.heroBullets,
  badges: ['Сделано в Корее', 'CE · ISO 13485', 'Гамма-стерилизация', 'Официальный дистрибьютор в ОАЭ'],
  chooseLength: 'Выберите длину игл',
  lengthNote: 'Длину под зону и задачу, а также интервал между процедурами подбирает специалист.',
  protocolTag: '',
  addToBag: 'В корзину',
  adding: 'Добавляем…',
  added: 'Добавлено',
  inBag: 'В корзине',
  viewBag: 'Открыть корзину',
  loginToShop: 'Войдите, чтобы купить',
  outOfStock: 'Нет в наличии',
  vatIncluded: 'Включая НДС',
  freeDelivery: 'Бесплатная доставка от 1 000 AED · Отправка из Дубая',
  stats: [
    { value: '540', label: 'игл на головке 0,25 мм против 192 у проволочного роллера' },
    { value: '0,2 мм', label: 'иглы тоньше привычных 0,25-0,3 мм' },
    { value: '500 000', label: 'микроканалов за десятиминутную процедуру' },
    { value: '5', label: 'длин игл, от 0,25 до 2,0 мм' },
  ],
  why: {
    eyebrow: 'Почему DTS',
    title: 'Барабан, в котором нечему выпасть.',
    intro:
      'Большинство роллеров - это проволочные иглы, вклеенные в барабан. DTS вырезает каждый ряд из цельного металлического диска: ни проволоки, ни клея, больше игл на головке, и барабан остаётся идеальным всю процедуру.',
    cards: ru.cards,
  },
  pairing: {
    eyebrow: 'Создан для ампулы',
    title: 'Каждый проход открывает путь.',
    body: 'Очистите кожу, распределите ампулу Power Solution и прокатывайте. Каналы нужны для ампулы, которую вы наносите, поэтому роллер - всегда часть процедуры, а не вся процедура.',
    viewProduct: 'Открыть линию Power Solution',
  },
  lengths: {
    eyebrow: 'Пять длин',
    title: 'Один барабан, пять глубин.',
    body: '0,25, 0,5, 1,0, 1,5 и 2,0 мм. Чем короче иглы, тем больше их на головке: 540 при 0,25 мм, 450 при 0,5 и 1,0 мм, 405 при 1,5 и 2,0 мм. Специалист подбирает роллер под зону и задачу.',
  },
  howTo: {
    eyebrow: 'Как использовать',
    title: 'Горизонтально. Вертикально. По диагонали.',
    frequency: 'Один роллер на процедуру',
    steps: ru.steps,
    note: 'Медленные ровные проходы с постоянным давлением. Без зигзагов и резких движений: работу делает барабан.',
  },
  cautions: {
    eyebrow: 'Перед применением',
    title: 'Меры предосторожности',
    points: ru.cautions,
    note: 'Запечатан до процедуры, утилизируется после. Не очищается и не используется повторно.',
  },
  routine: { eyebrow: 'Процедура', title: 'Работает вместе с', viewProduct: 'Открыть продукт' },
  details: { eyebrow: 'Спецификация', title: 'Детали.', rows: ru.detailRows },
  faq: {
    eyebrow: 'Вопросы',
    title: 'Прежде чем добавить.',
    items: [
      {
        q: 'Какую длину выбрать?',
        a: 'Длину под зону и задачу подбирает специалист; он же определяет давление и интервал между процедурами.',
      },
      {
        q: 'Чем он отличается от проволочного роллера?',
        a: 'У обычного проволочного роллера 192 иглы, вклеенные в барабан. DTS вырезает каждый ряд из металлического диска, поэтому на головке 0,25 мм - 540 игл, и ничего не выпадет во время прокатывания.',
      },
      {
        q: 'Как понять, что он стерилен?',
        a: 'Каждый роллер проходит гамма-стерилизацию и запечатан, а индикатор меняет цвет с жёлтого на красный. Вскрывайте упаковку непосредственно перед процедурой.',
      },
      {
        q: 'Можно ли использовать повторно?',
        a: 'Нет. Один роллер - одна процедура: после неё утилизируйте его и никогда не очищайте и не используйте снова.',
      },
      {
        q: 'Что наносить после?',
        a: 'Маску для процедур и Soothing Repair Postcream, а днём - солнцезащитное средство.',
      },
      {
        q: 'Подходит ли для кожи головы?',
        a: 'Для кожи головы используйте штамп GENOSYS DTS: те же дисковые иглы, но он нажимает строго вниз между волосами, поэтому ничего не путается.',
      },
    ],
  },
  backToProducts: 'Все продукты',
}

const ar = dtsToolFacts(PRODUCT_1_AR_TRANSLATION, 'ar')

const AR: DtsToolCopy = {
  eyebrow: 'GENOSYS DTS · الوخز الدقيق',
  headline: 'كل إبرة لها قيمتها.',
  subheadline:
    'كل إبرة مقطوعة من قرص معدني، بسماكة 0.2 مم، ومعقمة بأشعة غاما، لجلسة واحدة دقيقة ومريحة ونظيفة تماماً. حتى 500,000 قناة دقيقة في عشر دقائق تفتح الطريق للأمبولة المستخدمة.',
  heroBullets: ar.heroBullets,
  badges: ['صُنع في كوريا', 'CE · ISO 13485', 'معقم بأشعة غاما', 'الموزّع الرسمي في الإمارات'],
  chooseLength: 'اختاري طول الإبر',
  lengthNote: 'يختار المختص الطول المناسب للمنطقة والهدف، ويحدد الفاصل بين الجلسات.',
  protocolTag: '',
  addToBag: 'أضيفي إلى السلة',
  adding: 'جارٍ الإضافة…',
  added: 'تمت الإضافة',
  inBag: 'في سلتك',
  viewBag: 'عرض السلة',
  loginToShop: 'سجّلي الدخول للشراء',
  outOfStock: 'غير متوفر',
  vatIncluded: 'شامل ضريبة القيمة المضافة',
  freeDelivery: 'توصيل مجاني للطلبات فوق 1,000 درهم · يُشحن من دبي',
  stats: [
    { value: '540', label: 'إبرة على رأس 0.25 مم، مقابل 192 في الرولر السلكي' },
    { value: '0.2 مم', label: 'إبر أنعم من المعتاد 0.25 إلى 0.3 مم' },
    { value: '500,000', label: 'قناة دقيقة في جلسة من عشر دقائق' },
    { value: '5', label: 'أطوال للإبر، من 0.25 إلى 2.0 مم' },
  ],
  why: {
    eyebrow: 'لماذا DTS',
    title: 'أسطوانة لا ينفصل منها شيء.',
    intro:
      'معظم الرولرات إبر سلكية ملصقة في أسطوانة. أما DTS فيقطع كل صف من قرص معدني واحد: بلا أسلاك ولا مواد لاصقة، وإبر أكثر على الرأس، وأسطوانة تبقى مثالية طوال الجلسة.',
    cards: ar.cards,
  },
  pairing: {
    eyebrow: 'مصمم للأمبولة',
    title: 'كل تمريرة تفتح الطريق.',
    body: 'نظفي البشرة، ووزعي أمبولة Power Solution، ثم مرري الرولر. القنوات موجودة من أجل الأمبولة المستخدمة، ولهذا يكون الرولر دائماً جزءاً من العلاج لا العلاج كله.',
    viewProduct: 'عرض مجموعة Power Solution',
  },
  lengths: {
    eyebrow: 'خمسة أطوال',
    title: 'أسطوانة واحدة، خمسة أعماق.',
    body: '0.25 و0.5 و1.0 و1.5 و2.0 مم. كلما قصرت الإبر زاد عددها على الرأس: 540 عند 0.25 مم، و450 عند 0.5 و1.0 مم، و405 عند 1.5 و2.0 مم. ويختار المختص الرولر المناسب للمنطقة والهدف.',
  },
  howTo: {
    eyebrow: 'طريقة الاستخدام',
    title: 'أفقياً. عمودياً. قطرياً.',
    frequency: 'رولر واحد لكل جلسة',
    steps: ar.steps,
    note: 'تمريرات بطيئة ومتساوية بضغط ثابت. بلا حركات متعرجة أو مفاجئة: الأسطوانة تقوم بالعمل.',
  },
  cautions: {
    eyebrow: 'قبل الاستخدام',
    title: 'تنبيهات',
    points: ar.cautions,
    note: 'مغلق حتى الجلسة، ويُتخلص منه بعدها. لا يُنظف ولا يُعاد استخدامه.',
  },
  routine: { eyebrow: 'العلاج', title: 'يعمل مع', viewProduct: 'عرض المنتج' },
  details: { eyebrow: 'المواصفات', title: 'التفاصيل.', rows: ar.detailRows },
  faq: {
    eyebrow: 'أسئلة',
    title: 'قبل أن تضيفيه.',
    items: [
      {
        q: 'أي طول أختار؟',
        a: 'يختار المختص الطول المناسب للمنطقة والهدف، ويحدد الضغط والفاصل بين الجلسات.',
      },
      {
        q: 'ما الفرق بينه وبين الرولر السلكي؟',
        a: 'الرولر السلكي المعتاد يحمل 192 إبرة ملصقة في الأسطوانة. أما DTS فيقطع كل صف من قرص معدني، فيحمل رأس 0.25 مم 540 إبرة، ولا ينفصل شيء أثناء التمرير.',
      },
      {
        q: 'كيف أعرف أنه معقم؟',
        a: 'كل رولر معقم بأشعة غاما ومحكم الإغلاق، ويتحول المؤشر من الأصفر إلى الأحمر. افتحي العبوة مباشرة قبل الجلسة.',
      },
      {
        q: 'هل يمكن استخدامه أكثر من مرة؟',
        a: 'لا. رولر واحد لجلسة واحدة: يُتخلص منه بعدها، ولا يُنظف ولا يُعاد استخدامه.',
      },
      {
        q: 'ماذا أضع بعده؟',
        a: 'قناع العلاج وكريم Soothing Repair Postcream، مع واقي الشمس خلال النهار.',
      },
      {
        q: 'هل يصلح لفروة الرأس؟',
        a: 'لفروة الرأس استخدمي ختم GENOSYS DTS: الإبر القرصية نفسها، لكنه يُضغط مباشرة بين الشعر فلا يتشابك شيء.',
      },
    ],
  },
  backToProducts: 'كل المنتجات',
}

const COPY: Record<DtsToolLocale, DtsToolCopy> = { en: EN, ar: AR, ru: RU }

export function getRollerCopy(locale: string): DtsToolCopy {
  return pickLocale(COPY, locale)
}
