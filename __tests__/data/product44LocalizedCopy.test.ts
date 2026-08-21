import { MEDI_SHAMPOO_COPY } from '@/components/product/hr3/mediShampooCopy'
import {
  PRODUCT_44_AR_TRANSLATION,
  PRODUCT_44_FULL_INCI,
  PRODUCT_44_RU_TRANSLATION,
} from '@/data/product44LocalizedCopy'
import { getProductTranslations } from '@/data/productTranslations'
import { getProductTranslationsRu } from '@/data/productTranslationsRu'
import { getCategoryBySlug, getConcernBySlug } from '@/lib/concernsData'
import { getCatalogQuickFacts } from '@/lib/productQuickFactsCatalog'
import arMessages from '@/messages/ar.json'
import ruMessages from '@/messages/ru.json'

describe('product 44 localized copy', () => {
  const customerCopy = {
    centralRu: PRODUCT_44_RU_TRANSLATION,
    centralAr: PRODUCT_44_AR_TRANSLATION,
    bespokeRu: MEDI_SHAMPOO_COPY.ru,
    bespokeAr: MEDI_SHAMPOO_COPY.ar,
    factsRu: getCatalogQuickFacts('44', 'ru'),
    factsAr: getCatalogQuickFacts('44', 'ar'),
    routineRu: ruMessages.product.routineScalpShampooDesc,
    routineAr: arMessages.product.routineScalpShampooDesc,
    shampooTonicPairRu: [
      ruMessages.product.pc44Intro,
      ruMessages.product.pc44Benefit1Text,
      ruMessages.product.pc44Benefit2TextShampooFirst,
      ruMessages.product.pc44Benefit3TextShampooFirst,
      ruMessages.product.pc44Benefit4Text,
    ],
    shampooTonicPairAr: [
      arMessages.product.pc44Intro,
      arMessages.product.pc44Benefit1Text,
      arMessages.product.pc44Benefit2TextShampooFirst,
      arMessages.product.pc44Benefit3TextShampooFirst,
      arMessages.product.pc44Benefit4Text,
    ],
    peelingShampooPairRu: [
      ruMessages.product.pc46Intro,
      ruMessages.product.pc46Benefit1Text,
      ruMessages.product.pc46Benefit2Text,
      ruMessages.product.pc46Benefit3Text,
      ruMessages.product.pc46Benefit4Text,
    ],
    peelingShampooPairAr: [
      arMessages.product.pc46Intro,
      arMessages.product.pc46Benefit1Text,
      arMessages.product.pc46Benefit2Text,
      arMessages.product.pc46Benefit3Text,
      arMessages.product.pc46Benefit4Text,
    ],
    hairConcernRu: getConcernBySlug('hair-loss')?.seo.ru,
    hairConcernAr: getConcernBySlug('hair-loss')?.seo.ar,
    scalpCategoryRu: getCategoryBySlug('scalp-hair')?.seo.ru,
    scalpCategoryAr: getCategoryBySlug('scalp-hair')?.seo.ar,
  }

  it('serves one canonical RU/AR payload everywhere', () => {
    expect(getProductTranslationsRu('44')).toEqual(PRODUCT_44_RU_TRANSLATION)
    expect(getProductTranslations('44')).toEqual(PRODUCT_44_AR_TRANSLATION)
  })

  it.each(['ru', 'ar'] as const)('keeps product 44 %s structured fields valid JSON', locale => {
    const copy = locale === 'ru' ? PRODUCT_44_RU_TRANSLATION : PRODUCT_44_AR_TRANSLATION

    for (const key of [
      'productDetails',
      'keyFeatures',
      'benefits',
      'ingredients',
      'howToUse',
    ] as const) {
      expect(() => JSON.parse(copy[key])).not.toThrow()
    }
  })

  it('preserves the verified formula, test and usage facts', () => {
    const text = JSON.stringify(customerCopy)

    for (const required of [
      '300 мл',
      '300 مل',
      '1.000%',
      '1.120%',
      '0.080%',
      '14.100%',
      '5.250%',
      '0.240%',
      '0.160%',
      '2.753%',
      '0.210%',
      '0.300%',
      '0.010%',
      '75 ppm',
      '2 ppm',
      '1 ppm',
      '10 ppb',
      '5,6',
      '5.6',
      '4,50–6,50',
      '4.50–6.50',
      '3–5 мл',
      '3–5 مل',
      'три минуты',
      '3 دقائق',
      'SLS',
      'SLES',
    ]) {
      expect(text).toContain(required)
    }

    expect(PRODUCT_44_FULL_INCI).toContain('Sodium C14-16 Olefin Sulfonate')
    expect(PRODUCT_44_FULL_INCI).not.toContain('Sodium Lauryl Sulfate')
    expect(PRODUCT_44_FULL_INCI).not.toContain('Sodium Laureth Sulfate')
  })

  it('keeps the exact child and eye precautions visible', () => {
    const text = JSON.stringify(customerCopy)

    expect(text).toContain('Не использовать детям младше 3 лет')
    expect(text).toContain('لا يستخدم للأطفال دون 3 سنوات')
    expect(text).toContain('Не использовать вокруг глаз')
    expect(text).toContain('لا يستخدم حول منطقة العين')
    expect(text).toContain('прохладной водой')
    expect(text).toContain('بالماء البارد')
  })

  it('keeps the registered function and claim limits explicit', () => {
    const text = JSON.stringify(customerCopy)

    expect(text).toContain('очищение кожи головы и волос')
    expect(text).toContain('تنظيف فروة الرأس والشعر')
    expect(text).toContain('не средство для лечения выпадения')
    expect(text).toContain('ليس علاجاً لتساقط الشعر')
    expect(text).toContain('без заявления о лечении перхоти')
    expect(text).toContain('من دون ادعاء علاج القشرة')
  })

  it('removes unsupported affirmative efficacy and audience claims', () => {
    const text = JSON.stringify(customerCopy).toLocaleLowerCase()

    for (const forbidden of [
      'kfda',
      'кфда',
      'предотвращает выпадение',
      'улучшает выпадение',
      'стимулирует рост волос',
      'активирует фолликулы',
      'контролирует себум',
      'улучшает кровообращение',
      'запатентованная технология',
      'для всех типов кожи головы',
      'ежедневное применение',
      'يمنع تساقط الشعر',
      'يحسن تساقط الشعر',
      'يحفز نمو الشعر',
      'ينشط البصيلات',
      'يتحكم في الزهم',
      'يحسن الدورة الدموية',
      'تقنية حاصلة على براءة اختراع',
      'لجميع أنواع فروة الرأس',
      'للاستخدام اليومي',
    ]) {
      expect(text).not.toContain(forbidden)
    }
  })
})
