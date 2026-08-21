import { getMultiSunCopy } from '@/components/product/multisun/multiSunCopy'
import { SENSITIVE_SKIN_COPY } from '@/components/product/beautybox/copy/sensitiveSkin'
import {
  PRODUCT_40_AR_TRANSLATION,
  PRODUCT_40_RU_TRANSLATION,
} from '@/data/product40LocalizedCopy'
import { getProductTranslations } from '@/data/productTranslations'
import { getProductTranslationsRu } from '@/data/productTranslationsRu'
import { CONCERN_PAGES } from '@/lib/concernsData'
import { PRODUCT_QUICK_FACTS_CATALOG } from '@/lib/productQuickFactsCatalog'
import arMessages from '@/messages/ar.json'
import ruMessages from '@/messages/ru.json'

describe('product 40 localized copy', () => {
  it('serves one audited RU/AR payload everywhere', () => {
    expect(getProductTranslationsRu('40')).toEqual(PRODUCT_40_RU_TRANSLATION)
    expect(getProductTranslations('40')).toEqual(PRODUCT_40_AR_TRANSLATION)
  })

  it.each(['ru', 'ar'] as const)('keeps product 40 %s structured fields valid JSON', locale => {
    const copy = locale === 'ru'
      ? PRODUCT_40_RU_TRANSLATION
      : PRODUCT_40_AR_TRANSLATION

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

  it('preserves the exact filter declarations and measurements', () => {
    const copy = JSON.stringify({
      ru: PRODUCT_40_RU_TRANSLATION,
      ar: PRODUCT_40_AR_TRANSLATION,
      bespokeRu: getMultiSunCopy('ru'),
      bespokeAr: getMultiSunCopy('ar'),
      facts: PRODUCT_QUICK_FACTS_CATALOG['40'],
    })

    for (const required of [
      '18,50%',
      '18.50%',
      '7,50%',
      '7.50%',
      '5,00%',
      '5.00%',
      '3,00%',
      '3.00%',
      '7,21%',
      '7.21%',
      '4,96%',
      '4.96%',
      '2,98%',
      '2.98%',
      '2,75%',
      '2.75%',
    ]) {
      expect(copy).toContain(required)
    }
  })

  it('keeps the verified grade, size, pH and fragrance facts', () => {
    const copy = JSON.stringify({
      ru: PRODUCT_40_RU_TRANSLATION,
      ar: PRODUCT_40_AR_TRANSLATION,
      bespokeRu: getMultiSunCopy('ru'),
      bespokeAr: getMultiSunCopy('ar'),
    })

    for (const required of [
      'SPF 40',
      'PA++',
      'умеренн',
      'متوسطة',
      '40 г',
      '40 غ',
      '6,71',
      '6.71',
      '0,25%',
      '0.25%',
      'Benzyl Benzoate',
      'Citronellol',
      'Hexyl Cinnamal',
      'Alpha-Isomethyl Ionone',
      'Limonene',
    ]) {
      expect(copy).toContain(required)
    }
  })

  it('standardizes application and reapplication across shared surfaces', () => {
    const copy = JSON.stringify({
      centralRu: PRODUCT_40_RU_TRANSLATION,
      centralAr: PRODUCT_40_AR_TRANSLATION,
      bespokeRu: getMultiSunCopy('ru'),
      bespokeAr: getMultiSunCopy('ar'),
      facts: PRODUCT_QUICK_FACTS_CATALOG['40'],
      routineRu: ruMessages.product.routineMultiSunCreamDesc,
      routineAr: arMessages.product.routineMultiSunCreamDesc,
      concerns: CONCERN_PAGES,
    })

    expect(copy).toContain('минимум за 15 минут')
    expect(copy).toContain('قبل الخروج بـ15 دقيقة على الأقل')
    expect(copy).toContain('не реже чем каждые два часа')
    expect(copy).toContain('كل ساعتين على الأقل')
    expect(copy).toContain('Водостойкость не заявлена')
    expect(copy).toContain('لا يدعي مقاومة الماء')
    expect(copy).toContain('полотенц')
    expect(copy).toContain('المنشفة')
  })

  it('removes unsupported and audit-style selling claims', () => {
    const copy = JSON.stringify({
      centralRu: PRODUCT_40_RU_TRANSLATION,
      centralAr: PRODUCT_40_AR_TRANSLATION,
      bespokeRu: getMultiSunCopy('ru'),
      bespokeAr: getMultiSunCopy('ar'),
      facts: PRODUCT_QUICK_FACTS_CATALOG['40'],
      routineRu: ruMessages.product.routineMultiSunCreamDesc,
      routineAr: arMessages.product.routineMultiSunCreamDesc,
    }).toLocaleLowerCase()

    for (const forbidden of [
      'для всех типов кожи',
      'всех типов кожи',
      'включая чувствительную',
      'جميع أنواع البشرة',
      'البشرة الحساسة',
      'комплексная защита',
      'полная защита',
      'сильная защита',
      'максимальная защита',
      'حماية شاملة',
      'حماية كاملة',
      'حماية قوية',
      'الحماية القصوى',
      'reef-safe',
      'безопасен для рифов',
      'آمن للشعاب',
      'зажив',
      'восстанов',
      'лечен',
      'омолож',
      'антивозраст',
      'شفاء',
      'إصلاح',
      'علاج',
      'مضاد للشيخوخة',
      'пептидный комфорт',
      'راحة البنتاببتيد',
      'досье',
      'الشهادة تقول',
    ]) {
      expect(copy).not.toContain(forbidden)
    }
  })

  it('does not position product 40 as the sensitive-skin Beauty Box sunscreen', () => {
    const copy = JSON.stringify(SENSITIVE_SKIN_COPY).toLocaleLowerCase()

    expect(copy).not.toContain('multi sun')
    expect(copy).not.toContain('/products/40')
  })
})
