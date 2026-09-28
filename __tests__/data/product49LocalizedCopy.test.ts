/**
 * @jest-environment node
 */
import { getGenoLedCopy } from '@/components/product/genoled/genoLedCopy'
import {
  PRODUCT_49_AR_TRANSLATION,
  PRODUCT_49_EN_RECORD,
  PRODUCT_49_RU_TRANSLATION,
} from '@/data/product49LocalizedCopy'
import { getProductTranslations } from '@/data/productTranslations'
import { getProductTranslationsRu } from '@/data/productTranslationsRu'
import { getCategoryBySlug } from '@/lib/concernsData'
import { filterProductsByConcern } from '@/lib/productsDb'
import { products } from '@/lib/products'
import { getCatalogQuickFacts } from '@/lib/productQuickFactsCatalog'
import arMessages from '@/messages/ar.json'
import enMessages from '@/messages/en.json'
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
      '1-186',
      '1-152',
      '1-52',
      '1-39',
      '1-56',
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

    expect(text).toContain('70 Вт - номинальная электрическая мощность')
    expect(text).toContain('70 واط قدرة كهربائية مقدرة')
    expect(text).toContain('каждые три секунды')
    expect(text).toContain('كل ثلاث ثوانٍ')
    expect(text).toContain('5-30 минут')
    expect(text).toContain('5 إلى 30 دقيقة')
    expect(text).toContain('5-60 минут')
    expect(text).toContain('5-60 دقيقة')
    expect(text).toContain('1-10 минут')
    expect(text).toContain('1-10 دقائق')
  })

  it('does not claim certification or medical status for IR II', () => {
    const text = JSON.stringify(liveCopy).toLocaleLowerCase()

    for (const forbidden of [
      'ir ii сертифицирован',
      'ir ii حاصل على شهادة',
      'медицинское изделие',
      'جهاز طبي',
      'сертификат ce',
      'شهادة ce',
    ]) {
      expect(text).not.toContain(forbidden)
    }
  })

  it('keeps post-procedure timing with the specialist and the 2019 paper tied to the older model', () => {
    const text = JSON.stringify(liveCopy).toLocaleLowerCase()

    expect(text).toContain('определяет специалист')
    expect(text).toContain('يحدد المختص')
    expect(text).toContain('модель ir ii вышла в 2024 году')
    expect(text).toContain('أُطلق طراز ir ii في 2024')
    expect(text).not.toContain('сразу после микронидлинга')
    expect(text).not.toContain('مباشرة بعد الوخز')
  })

  it('sells in its own voice, without archive or source-hedging language', () => {
    const text = JSON.stringify(liveCopy).toLocaleLowerCase()

    for (const forbidden of [
      'архив',
      'не переносим',
      'dts mg публикует',
      'производитель не публикует',
      'не заменяет руководство',
      'الأرشيف',
      'لا ننقل',
      'تنشر dts mg',
      'لا تنشر الشركة',
    ]) {
      expect(text).not.toContain(forbidden)
    }
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

const liveEn = {
  record: PRODUCT_49_EN_RECORD,
  fallback: products.find((p) => p.id === '49')?.description,
  bespoke: getGenoLedCopy('en'),
  quickFacts: getCatalogQuickFacts('49', 'en'),
  category: getCategoryBySlug('device')?.seo.en,
  recommendation: [
    enMessages.product.pc49Intro,
    enMessages.product.pc49Benefit1Text,
    enMessages.product.pc49Benefit2Text,
    enMessages.product.pc49Benefit3Text,
    enMessages.product.pc49Benefit4Text,
  ],
}

describe('product 49 EN copy', () => {
  it('sells the same verified hardware as RU/AR', () => {
    const text = JSON.stringify(liveEn)

    for (const required of [
      '1,710',
      '1-186',
      '1-56',
      '20 ±5',
      '520 × 220 × 315',
      '2.6 kg',
      'every three seconds',
      '5-30 minutes',
      'rated electrical power',
      'set by the specialist',
      'IR II launched in 2024',
    ]) {
      expect(text).toContain(required)
    }
  })

  it('keeps the fallback description identical to the record', () => {
    expect(liveEn.fallback).toBe(PRODUCT_49_EN_RECORD.description)
  })

  it('removes the medical, efficacy, contact and absolute-safety claims the audit removed from RU/AR', () => {
    const text = JSON.stringify(liveEn).toLocaleLowerCase()

    for (const forbidden of [
      'led therapy',
      'light therapy',
      'rejuvenation',
      'regeneration',
      'collagen',
      'elastin',
      'circulation',
      'acne bacteria',
      'breakout',
      'redness',
      'deeper',
      'absorption',
      'no downtime',
      'photo-ageing',
      'heat damage',
      'holds the distance',
      'loses less light',
      'most common use',
      'straight after',
      'post-care',
      'nothing touches',
      'never touches',
      'no contact',
      'certified',
      'all skin types',
      'painless',
    ]) {
      expect(text).not.toContain(forbidden)
    }
  })
})

describe('product 49 concern mapping', () => {
  it('is not matched to any skin concern by name', () => {
    const led = { id: '49', name: 'GENO-LED IR II', targetConcerns: null, category: 'Device' } as unknown as Parameters<typeof filterProductsByConcern>[0][number]

    expect(
      filterProductsByConcern([led], ['anti-aging', 'acne-blemishes', 'brightening', 'sensitivity', 'page-acne'])
    ).toEqual([])
  })
})
