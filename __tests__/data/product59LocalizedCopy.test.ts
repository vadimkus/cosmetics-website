import { DEEP_MOISTURIZING_COPY } from '@/components/product/beautybox/copy/deepMoisturizing'
import {
  PRODUCT_59_AR_TRANSLATION,
  PRODUCT_59_RU_TRANSLATION,
} from '@/data/product59LocalizedCopy'
import { getProductTranslations } from '@/data/productTranslations'
import { getProductTranslationsRu } from '@/data/productTranslationsRu'
import { CONCERN_PAGES } from '@/lib/concernsData'
import { getCatalogQuickFacts } from '@/lib/productQuickFactsCatalog'
import { PRODUCT_ROUTINES } from '@/lib/productRoutines'
import arMessages from '@/messages/ar.json'
import ruMessages from '@/messages/ru.json'

describe('product 59 localized copy', () => {
  it('serves exact canonical RU/AR payloads by product number and CUID', () => {
    expect(getProductTranslationsRu('59')).toEqual(PRODUCT_59_RU_TRANSLATION)
    expect(getProductTranslations('59')).toEqual(PRODUCT_59_AR_TRANSLATION)
    expect(getProductTranslationsRu('cmhp0jfrq00008odr033fg0ly')).toEqual(PRODUCT_59_RU_TRANSLATION)
    expect(getProductTranslations('cmhp0jfrq00008odr033fg0ly')).toEqual(PRODUCT_59_AR_TRANSLATION)
  })

  it.each(['ru', 'ar'] as const)('keeps product 59 %s structured fields valid JSON', locale => {
    const copy = locale === 'ru' ? PRODUCT_59_RU_TRANSLATION : PRODUCT_59_AR_TRANSLATION
    for (const key of ['productDetails', 'keyFeatures', 'benefits', 'howToUse'] as const) {
      expect(() => JSON.parse(copy[key])).not.toThrow()
    }
    expect(copy.ingredients).toBeNull()
  })

  it('keeps the exact seven pieces and safe routine order', () => {
    expect(DEEP_MOISTURIZING_COPY.ru.contents.items.map(item => [item.productNumber, item.quantity])).toEqual([
      ['10', 1], ['16', 1], ['18', 1], ['29', 1], ['36', 3],
    ])
    expect(PRODUCT_ROUTINES['59']!.steps.map(step => step.titleKey)).toEqual([
      'routineSnowO2Title',
      'routineSnowBoosterTitle',
      'routineSoothingBombMaskTitle',
      'routineHyaluronSerumTitle',
      'routineHyaluronCreamTitle',
    ])
    const text = JSON.stringify({
      ru: PRODUCT_59_RU_TRANSLATION,
      ar: PRODUCT_59_AR_TRANSLATION,
      bespokeRu: DEEP_MOISTURIZING_COPY.ru,
      bespokeAr: DEEP_MOISTURIZING_COPY.ar,
      factsRu: getCatalogQuickFacts('59', 'ru'),
      factsAr: getCatalogQuickFacts('59', 'ar'),
    })
    for (const required of [
      '180 мл', '180 مل', '200 мл', '200 مل', '30 мл', '30 مل',
      '50 г', '50 غ', '25 г', '25 غ', '15-20', '2 000 ppm', '2,000',
      '0,615%', '0.615%', '1 000,9 ppm', '1,000.9',
    ]) {
      expect(text).toContain(required)
    }
  })

  it('preserves SPF, fragrance, essential-oil and use cautions', () => {
    const text = JSON.stringify({
      ru: PRODUCT_59_RU_TRANSLATION,
      ar: PRODUCT_59_AR_TRANSLATION,
      bespokeRu: DEEP_MOISTURIZING_COPY.ru,
      bespokeAr: DEEP_MOISTURIZING_COPY.ar,
      routineRu: ruMessages.product,
      routineAr: arMessages.product,
    }).toLocaleLowerCase()
    for (const required of [
      'spf', 'واقي شمس', 'отдуш', 'عطر', 'герани', 'الجيرانيوم',
      'мят', 'النعناع', 'сразу после вскрытия', 'فور فتحه',
    ]) {
      expect(text).toContain(required)
    }
  })

  it('does not restore unsupported box or component claims', () => {
    const live = JSON.stringify({
      ru: PRODUCT_59_RU_TRANSLATION,
      ar: PRODUCT_59_AR_TRANSLATION,
      bespokeRu: DEEP_MOISTURIZING_COPY.ru,
      bespokeAr: DEEP_MOISTURIZING_COPY.ar,
    }).toLocaleLowerCase()
    for (const forbidden of [
      'кислородные пузырьки', 'فقاعات الأكسجين', 'без раздражения', 'دون تهيج',
      'поверх макияжа', 'فوق المكياج', 'слой за слоем', 'طبقة تلو الأخرى',
      'аквапорин', 'أكوابورين', 'водных канал', 'قنوات الماء',
      'грибн', 'الفطر', 'глубокое увлажнение', 'ترطيب عميق',
      'укрепляет барьер', 'تقوية الحاجز', 'мгновенное охлаждение', 'تبريد فوري',
      '2-3 раза', '2-3 раза', '2-3 مرات', '2-3 مرات',
      '1120.30', '197.70',
    ]) {
      expect(live).not.toContain(forbidden)
    }
  })

  it('keeps the live RU/AR hydration concern surface source-safe', () => {
    const concern = CONCERN_PAGES.find(item => item.slug === 'hydration')
    expect(concern).toBeDefined()
    const localized = JSON.stringify({
      arProtocol: concern!.protocolPdf?.description.ar,
      ruProtocol: concern!.protocolPdf?.description.ru,
      arSeo: concern!.seo.ar,
      ruSeo: concern!.seo.ru,
      arWhy: concern!.why?.ar,
      ruWhy: concern!.why?.ru,
      arRoutine: concern!.routine?.ar,
      ruRoutine: concern!.routine?.ru,
      arFaq: concern!.faq.ar,
      ruFaq: concern!.faq.ru,
    }).toLocaleLowerCase()
    for (const required of ['2,000', '2 000', '0.615%', '0,615%', 'واقي الشمس', 'spf']) {
      expect(localized).toContain(required)
    }
    for (const forbidden of [
      'فقاعات الأكسجين', 'кислородные пузырьки',
      'بضعف الفعالية', 'в 2 раза лучше',
      'طبقات حمض الهيالورونيك', 'послойное нанесение гиалуроновой',
      'تقنية قفل الحاجز', 'технология барьерной защиты',
    ]) {
      expect(localized).not.toContain(forbidden)
    }
  })
})
