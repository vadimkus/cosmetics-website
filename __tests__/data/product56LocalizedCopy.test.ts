import { SKIN_BRIGHTENING_COPY } from '@/components/product/beautybox/copy/skinBrightening'
import {
  PRODUCT_56_AR_TRANSLATION,
  PRODUCT_56_RU_TRANSLATION,
} from '@/data/product56LocalizedCopy'
import { getProductTranslations } from '@/data/productTranslations'
import { getProductTranslationsRu } from '@/data/productTranslationsRu'
import { getCatalogQuickFacts } from '@/lib/productQuickFactsCatalog'
import { PRODUCT_ROUTINES } from '@/lib/productRoutines'
import arMessages from '@/messages/ar.json'
import ruMessages from '@/messages/ru.json'

describe('product 56 localized copy', () => {
  it('serves one canonical RU/AR payload from both runtime maps', () => {
    expect(getProductTranslationsRu('56')).toEqual(PRODUCT_56_RU_TRANSLATION)
    expect(getProductTranslations('56')).toEqual(PRODUCT_56_AR_TRANSLATION)
  })

  it.each(['ru', 'ar'] as const)('keeps product 56 %s structured fields valid JSON', locale => {
    const copy = locale === 'ru' ? PRODUCT_56_RU_TRANSLATION : PRODUCT_56_AR_TRANSLATION
    for (const key of ['productDetails', 'keyFeatures', 'benefits', 'howToUse'] as const) {
      expect(() => JSON.parse(copy[key])).not.toThrow()
    }
    expect(copy.ingredients).toBeNull()
  })

  it('keeps exact contents and the safe shared display order', () => {
    const text = JSON.stringify({
      ru: PRODUCT_56_RU_TRANSLATION,
      ar: PRODUCT_56_AR_TRANSLATION,
      bespokeRu: SKIN_BRIGHTENING_COPY.ru,
      bespokeAr: SKIN_BRIGHTENING_COPY.ar,
      factsRu: getCatalogQuickFacts('56', 'ru'),
      factsAr: getCatalogQuickFacts('56', 'ar'),
    })

    for (const required of [
      '180 мл', '180 مل', '200 мл', '200 مل', '30 мл', '30 مل',
      '50 г', '50 غ', '100 г', '100 غ', '25 г', '25 غ', '15-20',
      '2%', '1%', '0,1%', '0.1%', '13%', '3%', '4,75%', '4.75%',
      '0,005%', '0.005%',
    ]) {
      expect(text).toContain(required)
    }

    expect(PRODUCT_ROUTINES['56']!.steps.map(step => step.titleKey)).toEqual([
      'routineSnowO2Title',
      'routinePeelingGelTitle',
      'routineSnowBoosterTitle',
      'routineSoothingBombMaskTitle',
      'routineMultiVitaSerumTitle',
      'routineMultiVitaCreamTitle',
    ])
  })

  it('preserves SPF, exfoliation, fragrance and essential-oil cautions', () => {
    const text = JSON.stringify({
      ru: PRODUCT_56_RU_TRANSLATION,
      ar: PRODUCT_56_AR_TRANSLATION,
      bespokeRu: SKIN_BRIGHTENING_COPY.ru,
      bespokeAr: SKIN_BRIGHTENING_COPY.ar,
      routineRu: ruMessages.product,
      routineAr: arMessages.product,
    }).toLocaleLowerCase()

    for (const required of [
      'spf', 'واقي شمس', 'поврежд', 'متضرر', 'отдуш', 'عطر',
      'масло бергамота', 'زيت البرغموت', 'масло мяты', 'زيت النعناع',
    ]) {
      expect(text).toContain(required)
    }
  })

  it('does not restore removed mechanisms, blanket claims or stale prices', () => {
    const text = JSON.stringify({
      ru: PRODUCT_56_RU_TRANSLATION,
      ar: PRODUCT_56_AR_TRANSLATION,
      bespokeRu: SKIN_BRIGHTENING_COPY.ru,
      bespokeAr: SKIN_BRIGHTENING_COPY.ar,
    }).toLocaleLowerCase()

    for (const forbidden of [
      'кислородные пузырьки',
      'فقاعات الأكسجين',
      'без раздражения',
      'دون تهيج',
      'чудо-дерево',
      'شجرة المعجزة',
      'пустынный комплекс',
      'مركب الصحراء',
      'целебной силой океана',
      'قوة الشفاء في المحيط',
      'интенсивное облегчение',
      'راحة مكثفة',
      'vita 12',
      'защита от свободных радикалов',
      'الجذور الحرة',
      'активирует выработку коллагена',
      'تنشيط إنتاج الكولاجين',
      '1271.60',
      '224.40',
      '1,496',
    ]) {
      expect(text).not.toContain(forbidden)
    }
  })
})
