import { getBbCushionCopy } from '@/components/product/bbcushion/bbCushionCopy'
import { CHARMING_LOOK_COPY } from '@/components/product/beautybox/copy/charmingLook'
import {
  PRODUCT_41_AR_TRANSLATION,
  PRODUCT_41_RU_TRANSLATION,
} from '@/data/product41LocalizedCopy'
import { getProductTranslations } from '@/data/productTranslations'
import { getProductTranslationsRu } from '@/data/productTranslationsRu'
import { localizeProductImage } from '@/lib/localizedProductImages'
import { products } from '@/lib/products'
import { PRODUCT_QUICK_FACTS_CATALOG } from '@/lib/productQuickFactsCatalog'
import arMessages from '@/messages/ar.json'
import ruMessages from '@/messages/ru.json'

describe('product 41 localized copy', () => {
  it('serves one audited RU/AR payload everywhere', () => {
    expect(getProductTranslationsRu('41')).toEqual(PRODUCT_41_RU_TRANSLATION)
    expect(getProductTranslations('41')).toEqual(PRODUCT_41_AR_TRANSLATION)
  })

  it.each(['ru', 'ar'] as const)('keeps product 41 %s structured fields valid JSON', locale => {
    const copy = locale === 'ru'
      ? PRODUCT_41_RU_TRANSLATION
      : PRODUCT_41_AR_TRANSLATION

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

  it('preserves the exact five-filter system and functional ingredients', () => {
    const copy = JSON.stringify({
      centralRu: PRODUCT_41_RU_TRANSLATION,
      centralAr: PRODUCT_41_AR_TRANSLATION,
      bespokeRu: getBbCushionCopy('ru'),
      bespokeAr: getBbCushionCopy('ar'),
      facts: PRODUCT_QUICK_FACTS_CATALOG['41'],
    })

    for (const required of [
      'SPF 50+',
      'PA++++',
      '9,00208%',
      '9.00208%',
      '7%',
      '4,5%',
      '4.5%',
      '2%',
      '0,04%',
      '0.04%',
      'Titanium Dioxide',
      'Ethylhexyl Methoxycinnamate',
      'Ethylhexyl Salicylate',
      'Octocrylene',
      'Zinc Oxide',
    ]) {
      expect(copy).toContain(required)
    }
  })

  it('keeps pack, shade, puff, testing and reapplication facts aligned', () => {
    const copy = JSON.stringify({
      centralRu: PRODUCT_41_RU_TRANSLATION,
      centralAr: PRODUCT_41_AR_TRANSLATION,
      bespokeRu: getBbCushionCopy('ru'),
      bespokeAr: getBbCushionCopy('ar'),
      facts: PRODUCT_QUICK_FACTS_CATALOG['41'],
      routineRu: ruMessages.product.routineBBCushionDesc,
      routineAr: arMessages.product.routineBBCushionDesc,
    })

    for (const required of [
      '15 г',
      '15 غ',
      '#01 Ivory',
      '#02 Beige',
      '#03 Camel',
      'Waterdrop',
      'Дерматологически',
      'مختبر جلدياً',
      'каждые два часа',
      'كل ساعتين',
      'Водостойкость',
      'مقاومة الماء',
    ]) {
      expect(copy).toContain(required)
    }
  })

  it('does not claim that all three shade formulas differ only by pigment', () => {
    const copy = JSON.stringify({
      centralRu: PRODUCT_41_RU_TRANSLATION,
      centralAr: PRODUCT_41_AR_TRANSLATION,
      bespokeRu: getBbCushionCopy('ru'),
      bespokeAr: getBbCushionCopy('ar'),
    }).toLocaleLowerCase()

    expect(copy).not.toContain('только пигмент')
    expect(copy).not.toContain('только цвет')
    expect(copy).not.toContain('الصبغة وحدها')
    expect(copy).not.toContain('اللون وحده')
    expect(copy).toContain('camel')
    expect(copy).toContain('растворител')
    expect(copy).toContain('المذيبات')
  })

  it('removes unsupported claims across every audited RU/AR surface', () => {
    const copy = JSON.stringify({
      centralRu: PRODUCT_41_RU_TRANSLATION,
      centralAr: PRODUCT_41_AR_TRANSLATION,
      bespokeRu: getBbCushionCopy('ru'),
      bespokeAr: getBbCushionCopy('ar'),
      facts: PRODUCT_QUICK_FACTS_CATALOG['41'],
      charmingRu: CHARMING_LOOK_COPY.ru,
      charmingAr: CHARMING_LOOK_COPY.ar,
      routineRu: ruMessages.product.routineBBCushionDesc,
      routineAr: arMessages.product.routineBBCushionDesc,
    }).toLocaleLowerCase()

    for (const forbidden of [
      '60% essence',
      '60% эссен',
      '60% من الخلاصة',
      'volufiline',
      'волюфилин',
      'pep9',
      'коллаген',
      'الكولاجين',
      'регенерац',
      'تجديد الخلايا',
      'восстанавливает барьер',
      'إصلاح الحاجز',
      'лечит',
      'يعالج',
      'липофилинг',
      'подходит после процедур',
      'مناسب بعد الجلسات',
      'مقاوم للماء للمنتج',
      'досье',
      'التدقيق',
    ]) {
      expect(copy).not.toContain(forbidden)
    }
  })

  it('keeps waterproof language attached to the puff rather than the formula', () => {
    const ru = JSON.stringify(getBbCushionCopy('ru')).toLocaleLowerCase()
    const ar = JSON.stringify(getBbCushionCopy('ar')).toLocaleLowerCase()

    expect(ru).toContain('слой находится внутри спонжа')
    expect(ru).toContain('водостойкость средства не заявлена')
    expect(ar).toContain('الطبقة المقاومة للماء موجودة داخل إسفنجة')
    expect(ar).toContain('لا يدّعي المنتج مقاومة الماء')
  })

  it('serves the "Covered." art set: main, thirteen slides and the localized how-to slide', () => {
    const product = products.find(p => p.id === '41')
    const gallery = JSON.parse(product?.images ?? '[]')
    expect(product?.image).toBe('/images/cushion_campaign/main.jpg')
    expect(gallery).toHaveLength(13)
    expect(gallery[0]).toBe('/images/cushion_art/s1.jpg')
    expect(gallery.slice(-2)).toEqual(['/images/cushion_art/s13.jpg', '/images/cushion_art/s12.jpg'])
    expect(localizeProductImage('/images/cushion_art/s13.jpg', 'ar')).toBe('/images/cushion_art/ar/s13.jpg')
    expect(localizeProductImage('/images/cushion_art/s10.jpg', 'ru')).toBe('/images/cushion_art/ru/s10.jpg')
    expect(localizeProductImage('/images/cushion_art/s10.jpg', 'ar')).toBe('/images/cushion_art/ar/s10.jpg')
    expect(getBbCushionCopy('en').headline).toBe('Shade to go.')
    expect(getBbCushionCopy('ru').headline).toBe('Тень с собой.')
    expect(getBbCushionCopy('ar').headline).toBe('ظلّكِ معكِ.')
  })
})
