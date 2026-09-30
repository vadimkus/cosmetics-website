/**
 * Bespoke copy for the GENOSYS Eye Roller page (product 69).
 *
 * Product facts come from data/product69LocalizedCopy.ts (EN, RU, AR); this file only adds the
 * page chrome. Every figure here is one the product record carries: one piece, 0.25 mm, 60
 * stainless-steel needles, five minutes in chlorhexidine before each reuse. No sterility,
 * single-use, frequency, channel or collagen claim (see the sourcing note in the data file).
 */

import {
  PRODUCT_69_AR_TRANSLATION,
  PRODUCT_69_EN,
  PRODUCT_69_RU_TRANSLATION,
} from '@/data/product69LocalizedCopy'
import { dtsToolFacts, pickLocale, type DtsToolCopy, type DtsToolLocale } from '../dtstool/dtsToolCopy'

const en = dtsToolFacts(PRODUCT_69_EN, 'en')

const EN: DtsToolCopy = {
  eyebrow: 'GENOSYS · Eye contour',
  headline: 'For your eyes only.',
  subheadline:
    'One small piece with 60 fine needles at 0.25 mm, the shortest length we make, shaped for the curve under the eyes. It rolls over EyeCell Eye Contour Serum, and it is yours alone.',
  heroBullets: en.heroBullets,
  badges: ['Made in Korea', 'DTS MG', 'Reusable, personal', 'Official UAE distributor'],
  chooseLength: 'Needle length',
  lengthNote: 'One length, 0.25 mm, made for the eye contour.',
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
    { value: '0.25 mm', label: 'the shortest GENOSYS needle length' },
    { value: '60', label: 'fine stainless-steel needles' },
    { value: '1', label: 'piece: handle and drum together' },
    { value: '5 min', label: 'in chlorhexidine before each reuse' },
  ],
  why: {
    eyebrow: 'Why this roller',
    title: 'Small enough for the eye contour.',
    intro:
      'The face roller is built for cheeks and forehead. This one is scaled down for the eye area: a short 0.25 mm needle, a small drum and one piece in the hand, so it follows the curve under the eyes and along the brow bone.',
    cards: en.cards,
  },
  pairing: {
    eyebrow: 'Made for the serum',
    title: 'The serum goes first.',
    body: 'Apply EyeCell Eye Contour Serum under the eyes and along the brow bone, then roll over it. Patches and cream follow, as in the Eye Zone Care Kit.',
    viewProduct: 'View Eye Contour Serum',
  },
  lengths: {
    eyebrow: 'One length',
    title: 'The shortest we make.',
    body: '0.25 mm, the shortest needle length in the GENOSYS range, on a drum small enough for the eye contour.',
  },
  howTo: {
    eyebrow: 'How to use',
    title: 'Across, then down.',
    frequency: 'Over the serum · a few minutes',
    steps: en.steps,
    note: 'Light passes, no pressing. Stop if it feels uncomfortable.',
  },
  cautions: {
    eyebrow: 'Before you use it',
    title: 'Precautions',
    points: en.cautions,
    note: 'Disinfect it for five minutes in chlorhexidine solution before each reuse, and never share it.',
  },
  routine: { eyebrow: 'The eye ritual', title: 'Works with', viewProduct: 'View product' },
  details: { eyebrow: 'Specification', title: 'The details.', rows: en.detailRows },
  faq: {
    eyebrow: 'Questions',
    title: 'Before you add it.',
    items: [
      {
        q: 'How is it different from the Microneedle Roller?',
        a: 'The Microneedle Roller is the face roller, in five lengths. This is the eye roller: one piece, one length of 0.25 mm and 60 needles on a small drum made for the eye contour.',
      },
      {
        q: 'Can I use it more than once?',
        a: 'Yes. It is personal and reusable: disinfect it for five minutes in chlorhexidine solution before each reuse, and never share it.',
      },
      {
        q: 'What do I roll it over?',
        a: 'EyeCell Eye Contour Serum, applied under the eyes and along the brow bone. Roll horizontally, then vertically, for a few minutes.',
      },
      {
        q: 'Should I press?',
        a: 'No. Let it glide lightly, keep it away from the eye and the lips, and stop if it feels uncomfortable.',
      },
      {
        q: 'Is it the roller from the Eye Zone Care Kit?',
        a: 'Yes, the same GENOSYS Eye Roller, now also sold on its own.',
      },
    ],
  },
  backToProducts: 'All products',
}

const ru = dtsToolFacts(PRODUCT_69_RU_TRANSLATION, 'ru')

const RU: DtsToolCopy = {
  eyebrow: 'GENOSYS · Контур глаз',
  headline: 'Только для ваших глаз.',
  subheadline:
    'Небольшой цельный роллер: 60 тонких игл длиной 0,25 мм, самой короткой в нашей линейке, по форме контура под глазами. Он прокатывается по сыворотке EyeCell Eye Contour Serum и принадлежит только вам.',
  heroBullets: ru.heroBullets,
  badges: ['Сделано в Корее', 'DTS MG', 'Многоразовый, личный', 'Официальный дистрибьютор в ОАЭ'],
  chooseLength: 'Длина игл',
  lengthNote: 'Одна длина, 0,25 мм, для контура глаз.',
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
    { value: '0,25 мм', label: 'самая короткая длина игл GENOSYS' },
    { value: '60', label: 'тонких игл из нержавеющей стали' },
    { value: '1', label: 'цельный корпус: ручка и барабан вместе' },
    { value: '5 мин', label: 'в хлоргексидине перед каждым повторным применением' },
  ],
  why: {
    eyebrow: 'Почему этот роллер',
    title: 'Достаточно маленький для контура глаз.',
    intro:
      'Роллер для лица создан для щёк и лба. Этот уменьшен для зоны вокруг глаз: короткие иглы 0,25 мм, маленький барабан и цельный корпус, поэтому он повторяет контур под глазами и вдоль надбровной дуги.',
    cards: ru.cards,
  },
  pairing: {
    eyebrow: 'Создан для сыворотки',
    title: 'Сначала сыворотка.',
    body: 'Нанесите EyeCell Eye Contour Serum под глаза и вдоль надбровной дуги, затем прокатывайте роллер по ней. Дальше патчи и крем, как в наборе Eye Zone Care Kit.',
    viewProduct: 'Открыть Eye Contour Serum',
  },
  lengths: {
    eyebrow: 'Одна длина',
    title: 'Самая короткая из наших.',
    body: '0,25 мм, самая короткая длина игл в линейке GENOSYS, на барабане, достаточно маленьком для контура глаз.',
  },
  howTo: {
    eyebrow: 'Как использовать',
    title: 'Поперёк, затем вдоль.',
    frequency: 'По сыворотке · несколько минут',
    steps: ru.steps,
    note: 'Лёгкие проходы без надавливания. Остановитесь при дискомфорте.',
  },
  cautions: {
    eyebrow: 'Перед применением',
    title: 'Меры предосторожности',
    points: ru.cautions,
    note: 'Перед каждым повторным применением дезинфицируйте его 5 минут в растворе хлоргексидина и никому не передавайте.',
  },
  routine: { eyebrow: 'Уход за глазами', title: 'Работает вместе с', viewProduct: 'Открыть продукт' },
  details: { eyebrow: 'Спецификация', title: 'Детали.', rows: ru.detailRows },
  faq: {
    eyebrow: 'Вопросы',
    title: 'Прежде чем добавить.',
    items: [
      {
        q: 'Чем он отличается от микроигольчатого роллера?',
        a: 'Микроигольчатый роллер предназначен для лица и выпускается в пяти длинах. Это роллер для глаз: цельный корпус, одна длина 0,25 мм и 60 игл на маленьком барабане для контура глаз.',
      },
      {
        q: 'Можно ли использовать его повторно?',
        a: 'Да. Он личный и многоразовый: перед каждым повторным применением дезинфицируйте его 5 минут в растворе хлоргексидина и никому не передавайте.',
      },
      {
        q: 'По чему его прокатывать?',
        a: 'По сыворотке EyeCell Eye Contour Serum, нанесённой под глаза и вдоль надбровной дуги. Горизонтально, затем вертикально, несколько минут.',
      },
      {
        q: 'Нужно ли надавливать?',
        a: 'Нет. Пусть он скользит легко, в стороне от глаз и губ. Остановитесь при дискомфорте.',
      },
      {
        q: 'Это роллер из набора Eye Zone Care Kit?',
        a: 'Да, тот же GENOSYS Eye Roller, теперь он продаётся и отдельно.',
      },
    ],
  },
  backToProducts: 'Все продукты',
}

const ar = dtsToolFacts(PRODUCT_69_AR_TRANSLATION, 'ar')

const AR: DtsToolCopy = {
  eyebrow: 'GENOSYS · محيط العين',
  headline: 'لعينيكِ فقط.',
  subheadline:
    'قطعة صغيرة واحدة بـ60 إبرة دقيقة بطول 0.25 مم، أقصر طول لدينا، مصممة لانحناءة ما تحت العين. تُمرَّر فوق سيروم EyeCell Eye Contour Serum، وهي لكِ وحدكِ.',
  heroBullets: ar.heroBullets,
  badges: ['صُنع في كوريا', 'DTS MG', 'شخصي وقابل لإعادة الاستخدام', 'الموزّع الرسمي في الإمارات'],
  chooseLength: 'طول الإبر',
  lengthNote: 'طول واحد، 0.25 مم، لمحيط العين.',
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
    { value: '0.25 مم', label: 'أقصر طول للإبر في GENOSYS' },
    { value: '60', label: 'إبرة دقيقة من الفولاذ المقاوم للصدأ' },
    { value: '1', label: 'قطعة واحدة: المقبض والأسطوانة معاً' },
    { value: '5 دقائق', label: 'في الكلورهيكسيدين قبل كل استخدام جديد' },
  ],
  why: {
    eyebrow: 'لماذا هذا الرولر',
    title: 'صغير بما يكفي لمحيط العين.',
    intro:
      'رولر الوجه مصمم للخدين والجبهة. أما هذا فمصغّر لمنطقة العين: إبر قصيرة بطول 0.25 مم، وأسطوانة صغيرة، وقطعة واحدة في اليد، فيتبع انحناءة ما تحت العين وعظمة الحاجب.',
    cards: ar.cards,
  },
  pairing: {
    eyebrow: 'مصمم للسيروم',
    title: 'السيروم أولاً.',
    body: 'ضعي EyeCell Eye Contour Serum تحت العينين وعلى طول عظمة الحاجب، ثم مرّري الرولر فوقه. تليه اللصقات والكريم، كما في طقم Eye Zone Care Kit.',
    viewProduct: 'عرض Eye Contour Serum',
  },
  lengths: {
    eyebrow: 'طول واحد',
    title: 'أقصر ما نصنع.',
    body: '0.25 مم، أقصر طول للإبر في مجموعة GENOSYS، على أسطوانة صغيرة بما يكفي لمحيط العين.',
  },
  howTo: {
    eyebrow: 'طريقة الاستخدام',
    title: 'أفقياً، ثم عمودياً.',
    frequency: 'فوق السيروم · لبضع دقائق',
    steps: ar.steps,
    note: 'تمريرات خفيفة دون ضغط. توقفي إذا شعرتِ بعدم الارتياح.',
  },
  cautions: {
    eyebrow: 'قبل الاستخدام',
    title: 'تنبيهات',
    points: ar.cautions,
    note: 'عقّميه 5 دقائق في محلول الكلورهيكسيدين قبل كل استخدام جديد، ولا تشاركيه مع أحد.',
  },
  routine: { eyebrow: 'طقوس العين', title: 'يعمل مع', viewProduct: 'عرض المنتج' },
  details: { eyebrow: 'المواصفات', title: 'التفاصيل.', rows: ar.detailRows },
  faq: {
    eyebrow: 'أسئلة',
    title: 'قبل أن تضيفيه.',
    items: [
      {
        q: 'ما الفرق بينه وبين رولر الوخز الدقيق؟',
        a: 'رولر الوخز الدقيق مخصص للوجه ويأتي بخمسة أطوال. أما هذا فرولر العين: قطعة واحدة، وطول واحد 0.25 مم، و60 إبرة على أسطوانة صغيرة لمحيط العين.',
      },
      {
        q: 'هل يمكن استخدامه أكثر من مرة؟',
        a: 'نعم. إنه شخصي وقابل لإعادة الاستخدام: عقّميه 5 دقائق في محلول الكلورهيكسيدين قبل كل استخدام جديد، ولا تشاركيه مع أحد.',
      },
      {
        q: 'فوق ماذا أمرّره؟',
        a: 'فوق سيروم EyeCell Eye Contour Serum الموضوع تحت العينين وعلى طول عظمة الحاجب. أفقياً ثم عمودياً لبضع دقائق.',
      },
      {
        q: 'هل أضغط؟',
        a: 'لا. دعيه ينزلق بخفة، بعيداً عن العين والشفتين، وتوقفي إذا شعرتِ بعدم الارتياح.',
      },
      {
        q: 'هل هو رولر طقم Eye Zone Care Kit؟',
        a: 'نعم، إنه GENOSYS Eye Roller نفسه، ويُباع الآن منفرداً أيضاً.',
      },
    ],
  },
  backToProducts: 'كل المنتجات',
}

const COPY: Record<DtsToolLocale, DtsToolCopy> = { en: EN, ar: AR, ru: RU }

export function getEyeRollerCopy(locale: string): DtsToolCopy {
  return pickLocale(COPY, locale)
}
