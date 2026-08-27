import { getHairStampCopy } from '@/components/product/hairstamp/hairstampCopy'
import { MESOPECIA_KIT_COPY } from '@/components/product/hr3/mesopeciaKitCopy'
import { SCALP_PEELING_COPY } from '@/components/product/hr3/scalpPeelingCopy'
import {
  PRODUCT_46_AR_TRANSLATION,
  PRODUCT_46_FULL_INCI,
  PRODUCT_46_RU_TRANSLATION,
} from '@/data/product46LocalizedCopy'
import { getProductTranslations } from '@/data/productTranslations'
import { getProductTranslationsRu } from '@/data/productTranslationsRu'
import { getConcernBySlug } from '@/lib/concernsData'
import { getCatalogQuickFacts } from '@/lib/productQuickFactsCatalog'
import arMessages from '@/messages/ar.json'
import ruMessages from '@/messages/ru.json'

const standaloneCopy = {
  centralRu: PRODUCT_46_RU_TRANSLATION,
  centralAr: PRODUCT_46_AR_TRANSLATION,
  bespokeRu: SCALP_PEELING_COPY.ru,
  bespokeAr: SCALP_PEELING_COPY.ar,
  quickFactsRu: getCatalogQuickFacts('46', 'ru'),
  quickFactsAr: getCatalogQuickFacts('46', 'ar'),
  routineRu: ruMessages.product.routineScalpPeelingDesc,
  routineAr: arMessages.product.routineScalpPeelingDesc,
  recommendationRu: [
    ruMessages.product.pc46Intro,
    ruMessages.product.pc46Benefit1Text,
    ruMessages.product.pc46Benefit2Text,
    ruMessages.product.pc46Benefit3Text,
    ruMessages.product.pc46Benefit4Text,
  ],
  recommendationAr: [
    arMessages.product.pc46Intro,
    arMessages.product.pc46Benefit1Text,
    arMessages.product.pc46Benefit2Text,
    arMessages.product.pc46Benefit3Text,
    arMessages.product.pc46Benefit4Text,
  ],
  hairConcernRu: getConcernBySlug('hair-loss')?.routine?.ru,
  hairConcernAr: getConcernBySlug('hair-loss')?.routine?.ar,
}

describe('product 46 RU/AR localized copy', () => {
  it('serves one canonical RU/AR payload from both translation maps', () => {
    expect(getProductTranslationsRu('46')).toBe(PRODUCT_46_RU_TRANSLATION)
    expect(getProductTranslations('46')).toBe(PRODUCT_46_AR_TRANSLATION)
  })

  it.each(['ru', 'ar'] as const)('keeps product 46 %s structured fields valid JSON', locale => {
    const copy = locale === 'ru' ? PRODUCT_46_RU_TRANSLATION : PRODUCT_46_AR_TRANSLATION

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

  it('preserves the exact signed-formula concentrations', () => {
    const text = JSON.stringify(standaloneCopy)

    for (const required of [
      '33,600%',
      '33.600%',
      '11,994%',
      '11.994%',
      '2,000%',
      '2.000%',
      '0,900%',
      '0.900%',
      '0,800%',
      '0.800%',
      '0,200%',
      '0.200%',
      '0,150%',
      '0.150%',
      '0,100%',
      '0.100%',
      '99 ppm',
      '5 ppb',
      'пятнадцать других растительных экстрактов',
      'خمسة عشر مستخلصاً نباتياً آخر',
    ]) {
      expect(text).toContain(required)
    }

    expect(PRODUCT_46_FULL_INCI).toContain('Alcohol Denat.')
    expect(PRODUCT_46_FULL_INCI).toContain('1,2-Hexanediol')
    expect(PRODUCT_46_FULL_INCI).toContain('Denatonium Benzoate')
  })

  it('keeps the verified size, pH, leave-on method and PAO visible', () => {
    const text = JSON.stringify(standaloneCopy)

    for (const required of [
      '100 мл',
      '100 مل',
      '4,31',
      '4.31',
      '4,00-5,00',
      '4.00-5.00',
      '5 минут',
      '5 دقائق',
      'Не смывайте',
      'لا تشطفيه',
      '6 месяцев',
      '6 أشهر',
    ]) {
      expect(text).toContain(required)
    }
  })

  it('removes the old drug, procedure and trace-ingredient efficacy copy', () => {
    const text = JSON.stringify(standaloneCopy).toLocaleLowerCase()

    for (const forbidden of [
      'улучшает впитывание',
      'открывает фолликулы',
      'стимулирует кровообращение',
      'противовоспалительное действие',
      'дезинфицирующие свойства',
      'подготовка кожи головы для процедур микронидлинга',
      'تحسين امتصاص',
      'فتح بصيلات',
      'يعزز الدورة الدموية',
      'عمل مضاد للالتهابات',
      'خصائص مطهرة',
      'إعداد فروة الرأس لعلاجات الميكرونيدلينج',
    ]) {
      expect(text).not.toContain(forbidden)
    }
  })

  it('resolves standalone versus kit microneedling instructions', () => {
    const standalone = JSON.stringify({
      ru: SCALP_PEELING_COPY.ru,
      ar: SCALP_PEELING_COPY.ar,
    })
    const kit = JSON.stringify({
      ru: MESOPECIA_KIT_COPY.ru,
      ar: MESOPECIA_KIT_COPY.ar,
      stampRu: getHairStampCopy('ru'),
      stampAr: getHairStampCopy('ar'),
    })

    expect(standalone).toContain('Не наносить после микронидлинга')
    expect(standalone).toContain('لا يوضع بعد الميكرونيدلينغ')
    expect(kit).toContain('2-5 минут')
    expect(kit).toContain('2-5 دقائق')
    expect(kit).toContain('Не наносите Scalp Peeling после роллера')
    expect(kit).toContain('لا تضعي Scalp Peeling بعد الرولر')
  })
})
