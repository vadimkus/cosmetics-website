import { getGenoLedCopy } from '@/components/product/genoled/genoLedCopy'
import {
  PRODUCT_49_AR_TRANSLATION,
  PRODUCT_49_RU_TRANSLATION,
} from '@/data/product49LocalizedCopy'
import { getProductTranslations } from '@/data/productTranslations'
import { getProductTranslationsRu } from '@/data/productTranslationsRu'
import { getCategoryBySlug } from '@/lib/concernsData'
import { getCatalogQuickFacts } from '@/lib/productQuickFactsCatalog'
import arMessages from '@/messages/ar.json'
import ruMessages from '@/messages/ru.json'

const liveCopy = {
  centralRu: PRODUCT_49_RU_TRANSLATION,
  centralAr: PRODUCT_49_AR_TRANSLATION,
  bespokeRu: getGenoLedCopy('ru'),
  bespokeAr: getGenoLedCopy('ar'),
  quickFactsRu: getCatalogQuickFacts('49', 'ru'),
  quickFactsAr: getCatalogQuickFacts('49', 'ar'),
  categoryRu: getCategoryBySlug('device')?.seo.ru,
  categoryAr: getCategoryBySlug('device')?.seo.ar,
  recommendationRu: [
    ruMessages.product.pc49Intro,
    ruMessages.product.pc49Benefit1Text,
    ruMessages.product.pc49Benefit2Text,
    ruMessages.product.pc49Benefit3Text,
    ruMessages.product.pc49Benefit4Text,
  ],
  recommendationAr: [
    arMessages.product.pc49Intro,
    arMessages.product.pc49Benefit1Text,
    arMessages.product.pc49Benefit2Text,
    arMessages.product.pc49Benefit3Text,
    arMessages.product.pc49Benefit4Text,
  ],
}

describe('product 49 RU/AR localized copy', () => {
  it('serves one canonical RU/AR payload from both translation maps', () => {
    expect(getProductTranslationsRu('49')).toBe(PRODUCT_49_RU_TRANSLATION)
    expect(getProductTranslations('49')).toBe(PRODUCT_49_AR_TRANSLATION)
  })

  it.each(['ru', 'ar'] as const)('keeps product 49 %s structured fields valid JSON', locale => {
    const copy = locale === 'ru' ? PRODUCT_49_RU_TRANSLATION : PRODUCT_49_AR_TRANSLATION

    for (const key of ['productDetails', 'keyFeatures', 'benefits', 'howToUse'] as const) {
      expect(() => JSON.parse(copy[key])).not.toThrow()
    }
    expect(copy.ingredients).toBeNull()
  })

  it('preserves the exact IR II hardware and dosimetry', () => {
    const text = JSON.stringify(liveCopy)

    for (const required of [
      '1 710',
      '1,710',
      '380',
      '190',
      '423',
      '532',
      '583',
      '640',
      '830',
      '42',
      '46',
      '15',
      '11',
      '28',
      '12',
      '1–186',
      '1–152',
      '1–52',
      '1–39',
      '1–56',
      '20 ±5',
      '520 × 220 × 315',
      '2,6 кг',
      '2.6 كغ',
    ]) {
      expect(text).toContain(required)
    }
  })

  it('keeps electrical power, mode behaviour and panel timing precise', () => {
    const text = JSON.stringify(liveCopy)

    expect(text).toContain('70 Вт — номинальная электрическая мощность')
    expect(text).toContain('70 واط قدرة كهربائية مقدرة')
    expect(text).toContain('каждые три секунды')
    expect(text).toContain('كل ثلاث ثوانٍ')
    expect(text).toContain('5–30 минут')
    expect(text).toContain('5 إلى 30 دقيقة')
    expect(text).toContain('5–60 минут')
    expect(text).toContain('5–60 دقيقة')
    expect(text).toContain('1–10 минут')
    expect(text).toContain('1–10 دقائق')
  })

  it('does not convert the old GENO LED certificate into IR II certification', () => {
    const text = JSON.stringify(liveCopy).toLocaleLowerCase()

    expect(text).toContain('старому geno led на 32 вт')
    expect(text).toContain('geno led الأقدم بقدرة 32 واط')
    expect(text).toContain('выпущенному в 2024')
    expect(text).toContain('أطلق في 2024')
    expect(text).not.toContain('ir ii сертифицирован')
    expect(text).not.toContain('ir ii حاصل على شهادة')
  })

  it('does not invent a manual safety list or post-procedure timing', () => {
    const text = JSON.stringify(liveCopy).toLocaleLowerCase()

    expect(text).toContain('нет руководства пользователя именно для geno-led ir ii')
    expect(text).toContain('لا تتضمن دليل استخدام خاصاً بطراز geno-led ir ii')
    expect(text).toContain('не переносим противопоказания')
    expect(text).toContain('لا ننقل موانع الاستعمال')
    expect(text).not.toContain('сразу после микронидлинга')
    expect(text).not.toContain('مباشرة بعد الوخز')
  })

  it('removes medical, efficacy and absolute-safety claims from live RU/AR surfaces', () => {
    const text = JSON.stringify(liveCopy).toLocaleLowerCase()

    for (const forbidden of [
      'профессиональная led-терапия',
      'лечение акне',
      'лечит выпадение волос',
      'улучшает кровообращение',
      'для всех типов кожи',
      'без реабилитации',
      'без термического повреждения',
      'без фотостарения',
      'без рубцов',
      'безболезнен',
      'потеря света',
      'удерживает расстояние',
      'علاج ضوئي احترافي',
      'علاج حب الشباب',
      'يعالج تساقط الشعر',
      'يحسن الدورة الدموية',
      'لجميع أنواع البشرة',
      'بلا فترة نقاهة',
      'بلا ضرر حراري',
      'بلا شيخوخة ضوئية',
      'بلا ندبات',
      'غير مؤلم',
      'يفقد ضوءاً أقل',
      'تحفظ المسافة',
    ]) {
      expect(text).not.toContain(forbidden)
    }
  })
})
