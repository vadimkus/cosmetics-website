import { PROBLEM_SKIN_COPY } from '@/components/product/beautybox/copy/problemSkin'
import {
  PRODUCT_55_AR_TRANSLATION,
  PRODUCT_55_RU_TRANSLATION,
} from '@/data/product55LocalizedCopy'
import { getProductTranslations } from '@/data/productTranslations'
import { getProductTranslationsRu } from '@/data/productTranslationsRu'
import { getCatalogQuickFacts } from '@/lib/productQuickFactsCatalog'
import { PRODUCT_ROUTINES } from '@/lib/productRoutines'
import arMessages from '@/messages/ar.json'
import ruMessages from '@/messages/ru.json'

describe('product 55 localized copy', () => {
  it('serves one canonical RU/AR payload from both runtime maps', () => {
    expect(getProductTranslationsRu('55')).toEqual(PRODUCT_55_RU_TRANSLATION)
    expect(getProductTranslations('55')).toEqual(PRODUCT_55_AR_TRANSLATION)
  })

  it.each(['ru', 'ar'] as const)('keeps product 55 %s structured fields valid JSON', locale => {
    const copy = locale === 'ru' ? PRODUCT_55_RU_TRANSLATION : PRODUCT_55_AR_TRANSLATION
    for (const key of ['productDetails', 'keyFeatures', 'benefits', 'howToUse'] as const) {
      expect(() => JSON.parse(copy[key])).not.toThrow()
    }
    expect(copy.ingredients).toBeNull()
  })

  it('keeps exact contents, quantities and routine order across live surfaces', () => {
    const text = JSON.stringify({
      ru: PRODUCT_55_RU_TRANSLATION,
      ar: PRODUCT_55_AR_TRANSLATION,
      bespokeRu: PROBLEM_SKIN_COPY.ru,
      bespokeAr: PROBLEM_SKIN_COPY.ar,
      factsRu: getCatalogQuickFacts('55', 'ru'),
      factsAr: getCatalogQuickFacts('55', 'ar'),
    })

    for (const required of [
      '180 мл', '180 مل', '200 мл', '200 مل', '30 мл', '30 مل',
      '50 г', '50 غ', '25 г', '25 غ', '15–20',
      '0,5%', '0.5%', '0,05%', '0.05%', '13,398%', '13.398%',
      '10%', '5,035%', '5.035%', '0,005%', '0.005%',
    ]) {
      expect(text).toContain(required)
    }

    expect(PRODUCT_ROUTINES['55']!.steps.map(step => step.titleKey)).toEqual([
      'routineSnowO2Title',
      'routineProblemControlTonerTitle',
      'routineSoothingBombMaskTitle',
      'routineProblemControlSerumTitle',
      'routineProblemControlCreamTitle',
    ])
  })

  it('preserves fragrance, essential-oil, salicylic-acid and SPF guidance', () => {
    const text = JSON.stringify({
      ru: PRODUCT_55_RU_TRANSLATION,
      ar: PRODUCT_55_AR_TRANSLATION,
      bespokeRu: PROBLEM_SKIN_COPY.ru,
      bespokeAr: PROBLEM_SKIN_COPY.ar,
      routineRu: ruMessages.product,
      routineAr: arMessages.product,
    }).toLocaleLowerCase()

    for (const required of [
      'салицил', 'الساليسيليك', 'масло чайного дерева', 'زيت شجرة الشاي',
      'масло мяты', 'زيت النعناع', 'отдуш', 'عطر', 'spf', 'واقي شمس',
    ]) {
      expect(text).toContain(required)
    }
  })

  it('does not restore unsupported treatment, mechanism or stale-price claims', () => {
    const text = JSON.stringify({
      ru: PRODUCT_55_RU_TRANSLATION,
      ar: PRODUCT_55_AR_TRANSLATION,
      bespokeRu: PROBLEM_SKIN_COPY.ru,
      bespokeAr: PROBLEM_SKIN_COPY.ar,
    }).toLocaleLowerCase()

    for (const forbidden of [
      'кислородные пузырьки',
      'فقاعات الأكسجين',
      'целебной силой океана',
      'قوة الشفاء في المحيط',
      'уменьшать воспаление',
      'تقليل الالتهاب',
      'балансировать выработку масла',
      'موازنة إنتاج الزيت',
      '2-3 раза в неделю',
      '2-3 مرات في الأسبوع',
      '1120.30',
      '197.70',
    ]) {
      expect(text).not.toContain(forbidden)
    }
  })
})
