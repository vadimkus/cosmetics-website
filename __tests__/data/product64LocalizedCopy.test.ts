import { getHairStampCopy } from '@/components/product/hairstamp/hairstampCopy'
import {
  PRODUCT_64_AR_TRANSLATION,
  PRODUCT_64_RU_TRANSLATION,
} from '@/data/product64LocalizedCopy'
import { getProductTranslations } from '@/data/productTranslations'
import { getProductTranslationsRu } from '@/data/productTranslationsRu'
import { getConcernBySlug } from '@/lib/concernsData'
import { getCatalogQuickFacts } from '@/lib/productQuickFactsCatalog'
import arMessages from '@/messages/ar.json'
import ruMessages from '@/messages/ru.json'

const productId = 'cmqep332d00gef4ej9y2ajz41'
const hairConcern = getConcernBySlug('hair-loss')

const localizedLiveCopy = {
  centralRu: PRODUCT_64_RU_TRANSLATION,
  centralAr: PRODUCT_64_AR_TRANSLATION,
  bespokeRu: getHairStampCopy('ru'),
  bespokeAr: getHairStampCopy('ar'),
  quickFactsRu: getCatalogQuickFacts('64', 'ru'),
  quickFactsAr: getCatalogQuickFacts('64', 'ar'),
  routineRu: [
    ruMessages.product.routineHairStampDesc,
    ruMessages.product.routineHairSolutionDesc,
    ruMessages.product.routineHairGenBoosterDesc,
  ],
  routineAr: [
    arMessages.product.routineHairStampDesc,
    arMessages.product.routineHairSolutionDesc,
    arMessages.product.routineHairGenBoosterDesc,
  ],
  recommendationRu: [
    ruMessages.product.pc64Intro,
    ruMessages.product.pc64Benefit1Text,
    ruMessages.product.pc64Benefit2Text,
    ruMessages.product.pc64Benefit3Text,
    ruMessages.product.pc64Benefit4Text,
  ],
  recommendationAr: [
    arMessages.product.pc64Intro,
    arMessages.product.pc64Benefit1Text,
    arMessages.product.pc64Benefit2Text,
    arMessages.product.pc64Benefit3Text,
    arMessages.product.pc64Benefit4Text,
  ],
  concernRu: {
    seo: hairConcern?.seo.ru,
    routine: hairConcern?.routine?.ru,
    faq: hairConcern?.faq.ru,
  },
  concernAr: {
    seo: hairConcern?.seo.ar,
    routine: hairConcern?.routine?.ar,
    faq: hairConcern?.faq.ar,
  },
}

describe('product 64 RU/AR localized copy', () => {
  it('serves one canonical payload by product number and production CUID', () => {
    expect(getProductTranslationsRu('64')).toBe(PRODUCT_64_RU_TRANSLATION)
    expect(getProductTranslations('64')).toBe(PRODUCT_64_AR_TRANSLATION)
    expect(getProductTranslationsRu(productId)).toBe(PRODUCT_64_RU_TRANSLATION)
    expect(getProductTranslations(productId)).toBe(PRODUCT_64_AR_TRANSLATION)
  })

  it.each(['ru', 'ar'] as const)('keeps product 64 %s structured fields valid JSON', locale => {
    const copy = locale === 'ru' ? PRODUCT_64_RU_TRANSLATION : PRODUCT_64_AR_TRANSLATION

    for (const key of ['productDetails', 'keyFeatures', 'benefits', 'howToUse'] as const) {
      expect(() => JSON.parse(copy[key])).not.toThrow()
    }
    expect(copy.ingredients).toBeNull()
  })

  it('keeps the documented pack, count, compatibility and device timing', () => {
    const text = JSON.stringify(localizedLiveCopy)

    expect(text).toContain('52')
    expect(text).toContain('8')
    expect(text).toContain('10')
    expect(text).toContain('HairGen Booster')
    expect(text).toContain('HR³ MATRIX HAIR SOLUTION α')
    expect(text).toContain('одноразов')
    expect(text).toContain('أحادي الاستخدام')
  })

  it('attributes 0.3 mm to artwork and does not promote it as confirmed', () => {
    const ru = JSON.stringify({
      central: localizedLiveCopy.centralRu,
      bespoke: localizedLiveCopy.bespokeRu,
      quickFacts: localizedLiveCopy.quickFactsRu,
      concern: localizedLiveCopy.concernRu,
    })
    const ar = JSON.stringify({
      central: localizedLiveCopy.centralAr,
      bespoke: localizedLiveCopy.bespokeAr,
      quickFacts: localizedLiveCopy.quickFactsAr,
      concern: localizedLiveCopy.concernAr,
    })

    expect(ru).toContain('0,3 мм')
    expect(ru).toMatch(/макет|изображени/)
    expect(ru).toMatch(/не подтвержд|не приведена|отсутствует/)
    expect(ar).toContain('0.3 مم')
    expect(ar).toContain('العمل الفني')
    expect(ar).toMatch(/غير مؤكد|لا تذكر/)
  })

  it('removes prohibited mechanism, efficacy, comfort and hygiene claims', () => {
    const text = JSON.stringify({
      centralRu: localizedLiveCopy.centralRu,
      centralAr: localizedLiveCopy.centralAr,
      bespokeRu: localizedLiveCopy.bespokeRu,
      bespokeAr: localizedLiveCopy.bespokeAr,
      quickFactsRu: localizedLiveCopy.quickFactsRu,
      quickFactsAr: localizedLiveCopy.quickFactsAr,
      routineRu: localizedLiveCopy.routineRu,
      routineAr: localizedLiveCopy.routineAr,
      recommendationRu: localizedLiveCopy.recommendationRu,
      recommendationAr: localizedLiveCopy.recommendationAr,
      concernRu: localizedLiveCopy.concernRu,
      concernAr: localizedLiveCopy.concernAr,
    }).toLocaleLowerCase()

    for (const forbidden of [
      'доставляются напрямую к волосяным фолликулам',
      'повышая её проницаемость',
      'естественную реакцию заживления',
      'улучшение кровообращения',
      'благоприятную среду для роста волос',
      'минимальном дискомфорте',
      'равномерное покрытие',
      'медицинского класса',
      'стерильн',
      'дезинф',
      'توصيل المكوّنات النشطة',
      'ترفع نفاذية الجلد',
      'استجابة الشفاء',
      'تحسين الدورة الدموية',
      'بيئة أفضل لنمو الشعر',
      'أقل قدر من الإزعاج',
      'تغطية متساوية',
      'درجة طبية',
      'معقم',
      'تطهير',
    ]) {
      expect(text).not.toContain(forbidden)
    }
  })
})
