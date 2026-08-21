import {
  PRODUCT_62_AR_TRANSLATION,
  PRODUCT_62_RU_TRANSLATION,
} from '@/data/product62LocalizedCopy'
import { productTranslations } from '@/data/productTranslations'
import { productTranslationsRu } from '@/data/productTranslationsRu'
import { SENSITIVE_SKIN_COPY } from '@/components/product/beautybox/copy/sensitiveSkin'
import { getCatalogQuickFacts } from '@/lib/productQuickFactsCatalog'
import { PRODUCT_ROUTINES } from '@/lib/productRoutines'
import { calculateDiscountedPrice } from '@/lib/discountUtils'
import type { Product } from '@/types'

describe('product 62 audited RU/AR copy', () => {
  it('feeds both translation maps from one canonical payload', () => {
    expect(productTranslationsRu['62']).toBe(PRODUCT_62_RU_TRANSLATION)
    expect(productTranslations['62']).toBe(PRODUCT_62_AR_TRANSLATION)
  })

  it('keeps the exact six pieces and component-level evidence', () => {
    for (const locale of ['ru', 'ar'] as const) {
      const copy = SENSITIVE_SKIN_COPY[locale]
      expect(copy.contents.items.map(item => item.productNumber)).toEqual(['10', '16', '19', '27', '34', '36'])
      expect(copy.contents.items).toHaveLength(6)
    }

    const combined = JSON.stringify([
      PRODUCT_62_RU_TRANSLATION,
      PRODUCT_62_AR_TRANSLATION,
      SENSITIVE_SKIN_COPY.ru,
      SENSITIVE_SKIN_COPY.ar,
      getCatalogQuickFacts('62', 'ru'),
      getCatalogQuickFacts('62', 'ar'),
    ])
    for (const fact of ['5 000 ppm', '5,000 ppm', '17,49%', '17.49%', 'MultiEx BSASM® Plus', '−15%', '−26%']) {
      expect(combined).toContain(fact)
    }
    expect(combined).toMatch(/только.{0,25}ночн|للقناع الليلي وحده/i)
  })

  it('discloses fragrance and does not generalize the mask study', () => {
    const combined = JSON.stringify([
      PRODUCT_62_RU_TRANSLATION,
      PRODUCT_62_AR_TRANSLATION,
      SENSITIVE_SKIN_COPY.ru,
      SENSITIVE_SKIN_COPY.ar,
    ])
    for (const value of ['Parfum', 'лимонен', 'الليمونين', 'линалоол', 'اللينالول', 'кумарин', 'الكومارين', 'масло мяты', 'زيت النعناع']) {
      expect(combined).toContain(value)
    }
    expect(combined).toMatch(/Весь набор без отдушек\?.{0,20}Нет|هل المجموعة كلها خالية من العطر\?.{0,20}لا/i)
    expect(combined).toContain('Мы не заявляем для набора в целом')
    expect(combined).toContain('لا ندعي للمجموعة ككل')
  })

  it('keeps the staged routine without an invented starter week', () => {
    expect(PRODUCT_ROUTINES['62']!.steps.map(step => step.titleKey)).toEqual([
      'routineSnowO2Title',
      'routineSnowBoosterTitle',
      'routineSoothingBombMaskTitle',
      'routineAllForSensitiveSerumTitle',
      'routineSkinBarrierCreamTitle',
      'routineOvernightMaskTitle',
    ])
    const combined = JSON.stringify([PRODUCT_62_RU_TRANSLATION, PRODUCT_62_AR_TRANSLATION, SENSITIVE_SKIN_COPY.ru, SENSITIVE_SKIN_COPY.ar])
    expect(combined).toMatch(/1–2|один-два|مرة أو مرتين/)
    expect(combined).toContain('15–20')
    expect(combined).not.toMatch(/перв\w+ недел|أسبوع البداية|الأسبوع الأول/i)
  })

  it('uses AED 1,746 component value and rounds 17.41% only at runtime', () => {
    const product = {
      productNumber: '62',
      category: 'Beauty Boxes',
      price: 1442,
    } as Product
    expect(calculateDiscountedPrice(product, null)).toMatchObject({
      originalPrice: 1746,
      discountedPrice: 1442,
      discountAmount: 304,
      discountPercentage: 17,
      isBeautyBox: true,
    })
    const quickFacts = JSON.stringify([getCatalogQuickFacts('62', 'ru'), getCatalogQuickFacts('62', 'ar')])
    expect(quickFacts).toContain('304')
    expect(quickFacts).not.toMatch(/17\s*%/)
  })
})
