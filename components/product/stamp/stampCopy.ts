/**
 * Bespoke copy for the GENOSYS DTS Microneedle Stamp page (product 67).
 *
 * The product facts - features, steps, specification, cautions and the hero
 * bullets - come from data/product67LocalizedCopy.ts, which is sourced and
 * already carries EN, RU and AR. This file only adds the page chrome around
 * them, so there is one place to change a claim.
 *
 * A scalp tool, positioned with HR³ MATRIX HAIR SOLUTION α (product 45). No
 * face use, and no hair-loss or regrowth claim anywhere (owner decision for the
 * whole HR³ line, 17 Aug 2026).
 */

import {
  PRODUCT_67_AR_TRANSLATION,
  PRODUCT_67_EN,
  PRODUCT_67_RU_TRANSLATION,
} from '@/data/product67LocalizedCopy'
import { dtsToolFacts, pickLocale, type DtsToolCopy, type DtsToolLocale } from '../dtstool/dtsToolCopy'

export type StampCopy = DtsToolCopy

const en = dtsToolFacts(PRODUCT_67_EN, 'en')

const EN: StampCopy = {
  eyebrow: 'HR³ Matrix · Scalp microneedling',
  headline: 'Press here.',
  subheadline:
    '140 disk-cut needles in one flat head, pressed straight down along every parting. A roller has to travel through the hair; the stamp only goes down and lifts off, so nothing tangles and nothing pulls.',
  heroBullets: en.heroBullets,
  badges: ['Made in Korea', 'CE · ISO 13485', 'Sterile, single use', 'Official UAE distributor'],
  chooseLength: 'Choose the needle length',
  lengthNote: 'The HR³ scalp protocol works at 0.25 or 0.5 mm. Longer lengths are set by the practitioner.',
  protocolTag: 'HR³ scalp',
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
    { value: '140', label: 'disk-cut needles in one flat head' },
    { value: '90°', label: 'every press straight down, no drag' },
    { value: '5', label: 'needle lengths, 0.25 to 2.0 mm' },
    { value: '10-15', label: 'minutes to work the whole scalp' },
  ],
  why: {
    eyebrow: 'Why a stamp',
    title: 'Made for hair, not around it.',
    intro:
      'On the face a roller glides. On the scalp it has to fight through the hair. The stamp was built for exactly that place: it goes down between the strands and lifts straight off.',
    cards: en.cards,
  },
  pairing: {
    eyebrow: 'Made for HR³',
    title: 'Every press opens a way in.',
    body: 'Part the hair every 1 to 2 cm, apply HR³ MATRIX HAIR SOLUTION α along the parting, then stamp. Half a vial covers a small area, a whole vial a larger one, and a session takes 10 to 15 minutes.',
    viewProduct: 'View HR³ MATRIX HAIR SOLUTION α',
  },
  lengths: {
    eyebrow: 'Five lengths',
    title: 'The same five as the GENOSYS roller.',
    body: '0.25, 0.5, 1.0, 1.5 and 2.0 mm. For the HR³ scalp protocol choose 0.25 or 0.5 mm; the practitioner sets the length, the pressure and the interval between sessions.',
  },
  howTo: {
    eyebrow: 'How to use',
    title: 'Part. Press. Move.',
    frequency: 'One stamp per session',
    steps: en.steps,
    note: 'Press straight down and lift straight off. Dragging the head is the one thing that turns a stamp back into a roller.',
  },
  cautions: {
    eyebrow: 'Before you use it',
    title: 'Precautions',
    points: en.cautions,
    note: 'Opened at the session, discarded after. Never cleaned, shared or reused.',
  },
  routine: { eyebrow: 'The HR³ line', title: 'Works with', viewProduct: 'View product' },
  details: { eyebrow: 'Specification', title: 'The details.', rows: en.detailRows },
  faq: {
    eyebrow: 'Questions',
    title: 'Before you add it.',
    items: [
      {
        q: 'Which length should I choose?',
        a: 'For the HR³ MATRIX HAIR SOLUTION α scalp protocol, 0.25 or 0.5 mm. Longer lengths are for practitioners who set the length, pressure and interval for each client.',
      },
      {
        q: 'Why a stamp and not a roller?',
        a: 'A roller has to travel through the hair, which tangles and pulls. The stamp presses straight down between the strands and lifts straight off, parting by parting. Roller for the face, stamp for the scalp.',
      },
      {
        q: 'Can I use it more than once?',
        a: 'No. It is sterile, sealed and made for one session: open it right before, discard it after, and never clean, share or reuse it.',
      },
      {
        q: 'How long does a session take?',
        a: 'About 10 to 15 minutes to work the whole scalp, parting by parting, with HR³ MATRIX HAIR SOLUTION α applied along each parting first.',
      },
      {
        q: 'Is it for home use?',
        a: 'It is made for professional use by a trained practitioner, who also decides whether the scalp is ready for it.',
      },
    ],
  },
  backToProducts: 'All products',
}

const ru = dtsToolFacts(PRODUCT_67_RU_TRANSLATION, 'ru')

/* Russian keeps its em dashes where they are correct punctuation. */
const RU: StampCopy = {
  eyebrow: 'HR³ Matrix · Микронидлинг кожи головы',
  headline: 'Нажмите здесь.',
  subheadline:
    '140 игл, вырезанных из металлических дисков, в одной плоской головке - строго вниз вдоль каждого пробора. Роллеру приходится катиться сквозь волосы, а штамп только опускается и поднимается, поэтому ничего не путается и не тянет.',
  heroBullets: ru.heroBullets,
  badges: ['Сделано в Корее', 'CE · ISO 13485', 'Стерильно, однократно', 'Официальный дистрибьютор в ОАЭ'],
  chooseLength: 'Выберите длину игл',
  lengthNote: 'Протокол HR³ для кожи головы - 0,25 или 0,5 мм. Большую длину определяет специалист.',
  protocolTag: 'HR³ кожа головы',
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
    { value: '140', label: 'игл из дисков в одной плоской головке' },
    { value: '90°', label: 'каждое нажатие строго вниз, без протягивания' },
    { value: '5', label: 'длин игл, от 0,25 до 2,0 мм' },
    { value: '10-15', label: 'минут на всю кожу головы' },
  ],
  why: {
    eyebrow: 'Почему штамп',
    title: 'Создан для волос, а не в обход них.',
    intro:
      'На лице роллер скользит. На коже головы ему приходится пробиваться сквозь волосы. Штамп сделан именно для этого места: он опускается между прядями и поднимается строго вверх.',
    cards: ru.cards,
  },
  pairing: {
    eyebrow: 'Создан для HR³',
    title: 'Каждое нажатие открывает путь.',
    body: 'Разделите волосы на проборы через 1-2 см, нанесите HR³ MATRIX HAIR SOLUTION α вдоль пробора и работайте штампом. Половина флакона - на небольшую зону, целый флакон - на большую; процедура занимает 10-15 минут.',
    viewProduct: 'Открыть HR³ MATRIX HAIR SOLUTION α',
  },
  lengths: {
    eyebrow: 'Пять длин',
    title: 'Те же пять, что у роллера GENOSYS.',
    body: '0,25, 0,5, 1,0, 1,5 и 2,0 мм. Для протокола HR³ по коже головы выберите 0,25 или 0,5 мм; длину, давление и интервал между процедурами определяет специалист.',
  },
  howTo: {
    eyebrow: 'Как использовать',
    title: 'Пробор. Нажатие. Дальше.',
    frequency: 'Один штамп на процедуру',
    steps: ru.steps,
    note: 'Нажимайте строго вниз и поднимайте строго вверх. Протягивание головки - единственное, что снова превращает штамп в роллер.',
  },
  cautions: {
    eyebrow: 'Перед применением',
    title: 'Меры предосторожности',
    points: ru.cautions,
    note: 'Вскрывается на процедуре, утилизируется после. Не очищается, не передаётся и не используется повторно.',
  },
  routine: { eyebrow: 'Линия HR³', title: 'Работает вместе с', viewProduct: 'Открыть продукт' },
  details: { eyebrow: 'Спецификация', title: 'Детали.', rows: ru.detailRows },
  faq: {
    eyebrow: 'Вопросы',
    title: 'Прежде чем добавить.',
    items: [
      {
        q: 'Какую длину выбрать?',
        a: 'Для протокола HR³ MATRIX HAIR SOLUTION α по коже головы - 0,25 или 0,5 мм. Большая длина - для специалистов, которые подбирают длину, давление и интервал для каждого клиента.',
      },
      {
        q: 'Почему штамп, а не роллер?',
        a: 'Роллеру приходится катиться сквозь волосы, он путает и тянет их. Штамп нажимает строго вниз между прядями и поднимается строго вверх, пробор за пробором. Роллер - для лица, штамп - для кожи головы.',
      },
      {
        q: 'Можно ли использовать повторно?',
        a: 'Нет. Штамп стерилен, запечатан и рассчитан на одну процедуру: вскройте его непосредственно перед ней, утилизируйте после и никогда не очищайте, не передавайте и не используйте снова.',
      },
      {
        q: 'Сколько длится процедура?',
        a: 'Около 10-15 минут на всю кожу головы, пробор за пробором, с HR³ MATRIX HAIR SOLUTION α, нанесённым вдоль каждого пробора.',
      },
      {
        q: 'Подходит ли для домашнего применения?',
        a: 'Штамп предназначен для профессионального применения обученным специалистом, который также решает, готова ли кожа головы к процедуре.',
      },
    ],
  },
  backToProducts: 'Все продукты',
}

const ar = dtsToolFacts(PRODUCT_67_AR_TRANSLATION, 'ar')

const AR: StampCopy = {
  eyebrow: 'HR³ Matrix · الوخز الدقيق لفروة الرأس',
  headline: 'اضغطي هنا.',
  subheadline:
    '140 إبرة مقطوعة من أقراص معدنية في رأس مسطح واحد، تُضغط مباشرة إلى الأسفل على طول كل فرق في الشعر. الرولر يضطر إلى المرور عبر الشعر، أما الختم فينزل ويرتفع فقط، فلا يتشابك شيء ولا يُشدّ شيء.',
  heroBullets: ar.heroBullets,
  badges: ['صُنع في كوريا', 'CE · ISO 13485', 'معقم ولاستخدام واحد', 'الموزّع الرسمي في الإمارات'],
  chooseLength: 'اختاري طول الإبر',
  lengthNote: 'بروتوكول HR³ لفروة الرأس يعمل بطول 0.25 أو 0.5 مم. الأطوال الأكبر يحددها المختص.',
  protocolTag: 'HR³ فروة الرأس',
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
    { value: '140', label: 'إبرة قرصية في رأس مسطح واحد' },
    { value: '90°', label: 'كل ضغطة مباشرة إلى الأسفل، بلا سحب' },
    { value: '5', label: 'أطوال للإبر، من 0.25 إلى 2.0 مم' },
    { value: '10-15', label: 'دقيقة لفروة الرأس كلها' },
  ],
  why: {
    eyebrow: 'لماذا الختم',
    title: 'مصمم للشعر، لا للالتفاف حوله.',
    intro:
      'على الوجه ينزلق الرولر. أما على فروة الرأس فعليه أن يشق طريقه عبر الشعر. الختم صُنع لهذا المكان تحديداً: ينزل بين الخصلات ويرتفع مباشرة.',
    cards: ar.cards,
  },
  pairing: {
    eyebrow: 'مصمم لـ HR³',
    title: 'كل ضغطة تفتح الطريق.',
    body: 'افرقي الشعر كل 1 إلى 2 سم، وضعي HR³ MATRIX HAIR SOLUTION α على طول الفرق، ثم استخدمي الختم. نصف قارورة لمنطقة صغيرة، وقارورة كاملة لمنطقة أكبر، وتستغرق الجلسة من 10 إلى 15 دقيقة.',
    viewProduct: 'عرض HR³ MATRIX HAIR SOLUTION α',
  },
  lengths: {
    eyebrow: 'خمسة أطوال',
    title: 'الأطوال الخمسة نفسها في رولر GENOSYS.',
    body: '0.25 و0.5 و1.0 و1.5 و2.0 مم. لبروتوكول HR³ على فروة الرأس اختاري 0.25 أو 0.5 مم؛ ويحدد المختص الطول والضغط والفاصل بين الجلسات.',
  },
  howTo: {
    eyebrow: 'طريقة الاستخدام',
    title: 'افرقي. اضغطي. انتقلي.',
    frequency: 'ختم واحد لكل جلسة',
    steps: ar.steps,
    note: 'اضغطي مباشرة إلى الأسفل وارفعي مباشرة إلى الأعلى. سحب الرأس هو الشيء الوحيد الذي يعيد الختم رولراً.',
  },
  cautions: {
    eyebrow: 'قبل الاستخدام',
    title: 'تنبيهات',
    points: ar.cautions,
    note: 'يُفتح في الجلسة ويُتخلص منه بعدها. لا يُنظف ولا يُشارك ولا يُعاد استخدامه.',
  },
  routine: { eyebrow: 'خط HR³', title: 'يعمل مع', viewProduct: 'عرض المنتج' },
  details: { eyebrow: 'المواصفات', title: 'التفاصيل.', rows: ar.detailRows },
  faq: {
    eyebrow: 'أسئلة',
    title: 'قبل أن تضيفيه.',
    items: [
      {
        q: 'أي طول أختار؟',
        a: 'لبروتوكول HR³ MATRIX HAIR SOLUTION α على فروة الرأس، 0.25 أو 0.5 مم. الأطوال الأكبر للمختصين الذين يحددون الطول والضغط والفاصل لكل عميلة.',
      },
      {
        q: 'لماذا الختم وليس الرولر؟',
        a: 'الرولر يضطر إلى المرور عبر الشعر، فيشده ويشابكه. أما الختم فيضغط مباشرة بين الخصلات ويرتفع مباشرة، فرقاً بعد فرق. الرولر للوجه، والختم لفروة الرأس.',
      },
      {
        q: 'هل يمكن استخدامه أكثر من مرة؟',
        a: 'لا. هو معقم ومحكم الإغلاق ومخصص لجلسة واحدة: يُفتح قبلها مباشرة، ويُتخلص منه بعدها، ولا يُنظف ولا يُشارك ولا يُعاد استخدامه.',
      },
      {
        q: 'كم تستغرق الجلسة؟',
        a: 'نحو 10 إلى 15 دقيقة لفروة الرأس كلها، فرقاً بعد فرق، بعد وضع HR³ MATRIX HAIR SOLUTION α على طول كل فرق.',
      },
      {
        q: 'هل هو للاستخدام المنزلي؟',
        a: 'مصمم للاستخدام الاحترافي بواسطة مختص مدرّب، يقرر أيضاً إن كانت فروة الرأس جاهزة له.',
      },
    ],
  },
  backToProducts: 'كل المنتجات',
}

const COPY: Record<DtsToolLocale, StampCopy> = { en: EN, ar: AR, ru: RU }

export function getStampCopy(locale: string): StampCopy {
  return pickLocale(COPY, locale)
}
