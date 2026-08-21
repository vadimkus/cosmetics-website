import { HAIR_TONIC_COPY } from '@/components/product/hr3/hairTonicCopy'
import {
  PRODUCT_43_AR_TRANSLATION,
  PRODUCT_43_RU_TRANSLATION,
} from '@/data/product43LocalizedCopy'
import { getProductTranslations } from '@/data/productTranslations'
import { getProductTranslationsRu } from '@/data/productTranslationsRu'
import { getCatalogQuickFacts } from '@/lib/productQuickFactsCatalog'
import arMessages from '@/messages/ar.json'
import ruMessages from '@/messages/ru.json'

describe('product 43 localized copy', () => {
  it('serves one canonical RU/AR payload everywhere', () => {
    expect(getProductTranslationsRu('43')).toEqual(PRODUCT_43_RU_TRANSLATION)
    expect(getProductTranslations('43')).toEqual(PRODUCT_43_AR_TRANSLATION)
  })

  it.each(['ru', 'ar'] as const)('keeps product 43 %s structured fields valid JSON', locale => {
    const copy = locale === 'ru' ? PRODUCT_43_RU_TRANSLATION : PRODUCT_43_AR_TRANSLATION

    for (const key of ['productDetails', 'keyFeatures', 'benefits', 'ingredients', 'howToUse'] as const) {
      expect(() => JSON.parse(copy[key])).not.toThrow()
    }
  })

  it('preserves exact formula facts, use and precautions across surfaces', () => {
    const text = JSON.stringify({
      centralRu: PRODUCT_43_RU_TRANSLATION,
      centralAr: PRODUCT_43_AR_TRANSLATION,
      bespokeRu: HAIR_TONIC_COPY.ru,
      bespokeAr: HAIR_TONIC_COPY.ar,
      factsRu: getCatalogQuickFacts('43', 'ru'),
      factsAr: getCatalogQuickFacts('43', 'ar'),
      routineRu: ruMessages.product.routineHairTonicDesc,
      routineAr: arMessages.product.routineHairTonicDesc,
    })

    for (const required of [
      '70 мл', '70 مل',
      '9,5%', '9.5%',
      '0,3%', '0.3%',
      '0,25%', '0.25%',
      '0,2%', '0.2%',
      '0,1%', '0.1%',
      '0,04%', '0.04%',
      '10 ppm', '10 أجزاء في المليون',
      '1 ppm', 'جزء واحد في المليون',
      '3–4 часа', '3–4 ساعات',
      '3 месяца', '3 أشهر',
      'диабет', 'السكري',
      'беременн', 'الحمل',
      'почечн', 'القصور الكلوي',
    ]) {
      expect(text).toContain(required)
    }
  })

  it('removes unsupported hair-loss, growth, circulation, penetration and roller claims', () => {
    const text = JSON.stringify({
      centralRu: PRODUCT_43_RU_TRANSLATION,
      centralAr: PRODUCT_43_AR_TRANSLATION,
      bespokeRu: HAIR_TONIC_COPY.ru,
      bespokeAr: HAIR_TONIC_COPY.ar,
      factsRu: getCatalogQuickFacts('43', 'ru'),
      factsAr: getCatalogQuickFacts('43', 'ar'),
      routineRu: ruMessages.product.routineHairTonicDesc,
      routineAr: arMessages.product.routineHairTonicDesc,
      pairingRu: {
        intro: ruMessages.product.pc44Intro,
        benefits: [
          ruMessages.product.pc44Benefit1Text,
          ruMessages.product.pc44Benefit3TextShampooFirst,
        ],
      },
      pairingAr: {
        intro: arMessages.product.pc44Intro,
        benefits: [
          arMessages.product.pc44Benefit1Text,
          arMessages.product.pc44Benefit3TextShampooFirst,
        ],
      },
    }).toLocaleLowerCase()

    for (const forbidden of [
      'укрепляет волосяные фолликулы',
      'стимулирует активность волосяных фолликулов',
      'предотвращает выпадение',
      'улучшает кровообращение',
      'глубокое проникновение',
      'коллаген',
      'تقوية بصيلات الشعر',
      'يحفز نشاط بصيلات الشعر',
      'منع تساقط الشعر',
      'تحسين الدورة الدموية',
      'اختراق أعمق',
      'الكولاجين',
      '5α-reductase',
    ]) {
      expect(text).not.toContain(forbidden)
    }
  })
})
