import { getUltraShieldCopy } from '@/components/product/ultrashield/ultraShieldCopy'
import { SKIN_BRIGHTENING_COPY } from '@/components/product/beautybox/copy/skinBrightening'
import {
  PRODUCT_39_AR_TRANSLATION,
  PRODUCT_39_RU_TRANSLATION,
} from '@/data/product39LocalizedCopy'
import { getProductTranslations } from '@/data/productTranslations'
import { getProductTranslationsRu } from '@/data/productTranslationsRu'
import { CONCERN_PAGES } from '@/lib/concernsData'
import { PRODUCT_QUICK_FACTS_CATALOG } from '@/lib/productQuickFactsCatalog'
import arMessages from '@/messages/ar.json'
import ruMessages from '@/messages/ru.json'

describe('product 39 localized copy', () => {
  it('serves one audited RU/AR payload everywhere', () => {
    expect(getProductTranslationsRu('39')).toEqual(PRODUCT_39_RU_TRANSLATION)
    expect(getProductTranslations('39')).toEqual(PRODUCT_39_AR_TRANSLATION)
  })

  it.each(['ru', 'ar'] as const)('keeps product 39 %s structured fields valid JSON', locale => {
    const copy = locale === 'ru'
      ? PRODUCT_39_RU_TRANSLATION
      : PRODUCT_39_AR_TRANSLATION

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

  it('preserves the verified protection and formula values', () => {
    const copy = JSON.stringify({
      ru: PRODUCT_39_RU_TRANSLATION,
      ar: PRODUCT_39_AR_TRANSLATION,
      bespokeRu: getUltraShieldCopy('ru'),
      bespokeAr: getUltraShieldCopy('ar'),
      facts: PRODUCT_QUICK_FACTS_CATALOG['39'],
    })

    for (const required of [
      '65,9',
      '65.9',
      '23,13',
      '23.13',
      '24,3',
      '24.3',
      '17,10%',
      '17.10%',
      '2,00%',
      '2.00%',
      '0,04%',
      '0.04%',
      '7,23',
      '7.23',
      '50 г',
      '50 غ',
    ]) {
      expect(copy).toContain(required)
    }
  })

  it('uses the six exact UV-filter percentages', () => {
    const copy = JSON.stringify({
      ru: PRODUCT_39_RU_TRANSLATION,
      ar: PRODUCT_39_AR_TRANSLATION,
    })

    for (const percentage of ['4,00%', '3,50%', '3,069%', '3,00%', '2,00%', '1,533%']) {
      expect(copy).toContain(percentage)
    }
    for (const percentage of ['4.00%', '3.50%', '3.069%', '3.00%', '2.00%', '1.533%']) {
      expect(copy).toContain(percentage)
    }
  })

  it('removes legacy and unsupported claims from RU/AR customer copy', () => {
    const copy = JSON.stringify({
      centralRu: PRODUCT_39_RU_TRANSLATION,
      centralAr: PRODUCT_39_AR_TRANSLATION,
      bespokeRu: getUltraShieldCopy('ru'),
      bespokeAr: getUltraShieldCopy('ar'),
      facts: PRODUCT_QUICK_FACTS_CATALOG['39'],
      routineRu: ruMessages.product.routineUltraShieldSunDesc,
      routineAr: arMessages.product.routineUltraShieldSunDesc,
    }).toLocaleLowerCase()

    for (const forbidden of [
      'безопасная для рифов',
      'опасных для рифов',
      'آمنة للشعاب',
      'قلق الشعاب',
      'система из 7',
      'نظام 7',
      'всех типов кожи',
      'جميع أنواع البشرة',
      'солнечными ожогами',
      'حروق الشمس',
      'глубокое увлажнение',
      'ترطيب عميق',
      'максимальная защита',
      'الحماية القصوى',
      'превосходную защиту',
      'حماية فائقة',
    ]) {
      expect(copy).not.toContain(forbidden)
    }
  })

  it('states the verified application timing and cadence on every shared surface', () => {
    const copy = JSON.stringify({
      ru: PRODUCT_39_RU_TRANSLATION,
      ar: PRODUCT_39_AR_TRANSLATION,
      bespokeRu: getUltraShieldCopy('ru'),
      bespokeAr: getUltraShieldCopy('ar'),
      facts: PRODUCT_QUICK_FACTS_CATALOG['39'],
      messagesRu: ruMessages.product.routineUltraShieldSunDesc,
      messagesAr: arMessages.product.routineUltraShieldSunDesc,
      concerns: CONCERN_PAGES,
      beautyBox: SKIN_BRIGHTENING_COPY,
    })

    expect(copy).toContain('минимум за 15 минут')
    expect(copy).toContain('قبل الخروج بـ15 دقيقة على الأقل')
    expect(copy).toContain('не реже чем каждые два часа')
    expect(copy).toContain('كل ساعتين على الأقل')
    expect(copy).toContain('Водостойкость не заявлена')
    expect(copy).toContain('لا تدّعي مقاومة الماء')
  })
})
