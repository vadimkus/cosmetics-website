/**
 * Shared copy shape for the GENOSYS DTS needle tools (roller, product 1, and
 * scalp stamp, product 67), which render through DtsToolProductPage.
 *
 * The product facts - features, steps, specification, cautions, hero bullets -
 * are read from each product's data/product*LocalizedCopy.ts, which is sourced
 * and carries EN, RU and AR. A product's copy module only adds page chrome.
 */

export type DtsToolLocale = 'en' | 'ar' | 'ru'

export interface DtsToolCard {
  title: string
  body: string
}

export interface DtsToolCopy {
  eyebrow: string
  headline: string
  subheadline: string
  heroBullets: string[]
  badges: string[]
  chooseLength: string
  lengthNote: string
  /** Tag on the lengths a paired protocol is documented at; unused when there are none. */
  protocolTag: string
  addToBag: string
  adding: string
  added: string
  inBag: string
  viewBag: string
  loginToShop: string
  outOfStock: string
  vatIncluded: string
  freeDelivery: string
  stats: Array<{ value: string; label: string }>
  why: { eyebrow: string; title: string; intro: string; cards: DtsToolCard[] }
  pairing: { eyebrow: string; title: string; body: string; viewProduct: string }
  lengths: { eyebrow: string; title: string; body: string }
  howTo: { eyebrow: string; title: string; frequency: string; steps: DtsToolCard[]; note: string }
  cautions: { eyebrow: string; title: string; points: string[]; note: string }
  routine: { eyebrow: string; title: string; viewProduct: string }
  details: { eyebrow: string; title: string; rows: Array<{ label: string; value: string }> }
  faq: { eyebrow: string; title: string; items: Array<{ q: string; a: string }> }
  backToProducts: string
}

export interface DtsToolSource {
  productDetails: string
  keyFeatures: string
  benefits: string
  howToUse: string
  directions: string
}

/** Specification row order; a product shows the keys its record carries. */
const DETAIL_KEYS = [
  'type',
  'availableLengths',
  'needleCount',
  'needleThickness',
  'needleMaterial',
  'construction',
  'application',
  'treatmentAreas',
  'sterilization',
  'shelfLife',
  'safety',
  'certification',
  'origin',
] as const

type DetailKey = (typeof DETAIL_KEYS)[number]

export const DETAIL_LABELS: Record<DtsToolLocale, Record<DetailKey, string>> = {
  en: {
    type: 'Type',
    availableLengths: 'Lengths',
    needleCount: 'Needles',
    needleThickness: 'Needle thickness',
    needleMaterial: 'Needle material',
    construction: 'Construction',
    application: 'Technique',
    treatmentAreas: 'Area',
    sterilization: 'Sterility',
    shelfLife: 'Shelf life',
    safety: 'Use',
    certification: 'Certification',
    origin: 'Origin',
  },
  ru: {
    type: 'Тип',
    availableLengths: 'Длины',
    needleCount: 'Иглы',
    needleThickness: 'Толщина игл',
    needleMaterial: 'Материал игл',
    construction: 'Конструкция',
    application: 'Техника',
    treatmentAreas: 'Зона',
    sterilization: 'Стерильность',
    shelfLife: 'Срок годности',
    safety: 'Применение',
    certification: 'Сертификация',
    origin: 'Происхождение',
  },
  ar: {
    type: 'النوع',
    availableLengths: 'الأطوال',
    needleCount: 'الإبر',
    needleThickness: 'سماكة الإبر',
    needleMaterial: 'مادة الإبر',
    construction: 'التصنيع',
    application: 'التقنية',
    treatmentAreas: 'المنطقة',
    sterilization: 'التعقيم',
    shelfLife: 'مدة الصلاحية',
    safety: 'الاستخدام',
    certification: 'الشهادات',
    origin: 'بلد المنشأ',
  },
}

export function dtsToolFacts(src: DtsToolSource, locale: DtsToolLocale) {
  const details = JSON.parse(src.productDetails) as Record<string, string>
  const features = JSON.parse(src.keyFeatures) as Array<{ title: string; description: string }>
  const steps = JSON.parse(src.howToUse) as Array<{ step: string; instruction: string }>
  const labels = DETAIL_LABELS[locale]
  return {
    heroBullets: (JSON.parse(src.benefits) as string[]).slice(0, 4),
    cards: features.map(f => ({ title: f.title, body: f.description })),
    steps: steps.map(s => ({ title: s.step, body: s.instruction })),
    detailRows: DETAIL_KEYS.filter(k => details[k]).map(k => ({ label: labels[k], value: details[k] as string })),
    // One sentence per caution card.
    cautions: src.directions.split(/(?<=\.)\s+/).filter(Boolean),
  }
}

export function pickLocale<T>(copy: Record<DtsToolLocale, T>, locale: string): T {
  return copy[(locale as DtsToolLocale) in copy ? (locale as DtsToolLocale) : 'en']
}
