import {
  PRODUCT_65_AR_TRANSLATION,
  PRODUCT_65_FULL_INCI,
  PRODUCT_65_RU_TRANSLATION,
} from '@/data/product65LocalizedCopy'
import { getProductTranslations } from '@/data/productTranslations'
import { getProductTranslationsRu } from '@/data/productTranslationsRu'
import { getBioMesoCopy } from '@/components/product/biomeso/biomesoCopy'
import { getCatalogQuickFacts } from '@/lib/productQuickFactsCatalog'
import { localizeProductImages } from '@/lib/localizedProductImages'
import arMessages from '@/messages/ar.json'
import ruMessages from '@/messages/ru.json'

const productId = 'cmqj8zzkf0157f4ejkpxactpy'
const gallery = [
  '/images/pdrn_5000_new/S1.jpeg',
  '/images/pdrn_5000_new/S2.jpeg',
  '/images/pdrn_5000_new/S3.jpeg',
  '/images/pdrn_5000_new/S4.jpeg',
  '/images/pdrn_5000_new/S6.jpeg',
  '/images/pdrn_5000_new/S7.jpeg',
  '/images/pdrn_5000_new/S8.jpeg',
  '/images/pdrn_5000_new/Close.jpeg',
]

const forbidden = [
  /прям\w+ проникнов|اختراق\w* مباشر/i,
  /созда\w+ микроканал|تُنشئ قنوات دقيقة/i,
  /эквивалент\w* игл|يعادل.{0,12}إبر/i,
  /био-?пилинг|تقشير حيوي/i,
  /регенерац\w+ кож|تجديد البشرة/i,
  /(?:синтез|выработк|ремоделирован).{0,25}(?:коллаген|эластин)|(?:إنتاج|تصنيع|إعادة تشكيل).{0,25}(?:الكولاجين|الإيلاستين)/i,
  /(?:укрепля|восстанавлива).{0,25}барьер|(?:تقوية|إصلاح).{0,25}الحاجز/i,
  /противовоспалительн\w+ цитокин|السيتوكينات المضادة للالتهاب/i,
  /MMP-?1/i,
  /глубок\w+ увлажнен|ترطيب عميق/i,
  /улучш\w+ несовершенств|تحسين الشوائب/i,
  /все типы кожи|جميع أنواع البشرة/i,
  /между профессиональн\w+ процедур|بين الجلسات الاحترافية/i,
  /шесть дней обновлен|التجدد خلال ستة أيام/i,
]

describe('product 65 source-grounded RU/AR copy', () => {
  it('serves one canonical payload by product number and production CUID', () => {
    expect(getProductTranslationsRu('65')).toBe(PRODUCT_65_RU_TRANSLATION)
    expect(getProductTranslations('65')).toBe(PRODUCT_65_AR_TRANSLATION)
    expect(getProductTranslationsRu(productId)).toBe(PRODUCT_65_RU_TRANSLATION)
    expect(getProductTranslations(productId)).toBe(PRODUCT_65_AR_TRANSLATION)
  })

  it('keeps exact pack, formula and protocol facts across live RU/AR surfaces', () => {
    const copy = JSON.stringify([
      PRODUCT_65_RU_TRANSLATION,
      PRODUCT_65_AR_TRANSLATION,
      getBioMesoCopy('ru'),
      getBioMesoCopy('ar'),
      getCatalogQuickFacts('65', 'ru'),
      getCatalogQuickFacts('65', 'ar'),
      ruMessages.product.routinePDRNAmpouleDesc,
      arMessages.product.routinePDRNAmpouleDesc,
      ruMessages.product.pc65Intro,
      ruMessages.product.pc65Benefit1Text,
      ruMessages.product.pc65Benefit2Text,
      ruMessages.product.pc65Benefit3Text,
      ruMessages.product.pc65Benefit4Text,
      arMessages.product.pc65Intro,
      arMessages.product.pc65Benefit1Text,
      arMessages.product.pc65Benefit2Text,
      arMessages.product.pc65Benefit3Text,
      arMessages.product.pc65Benefit4Text,
    ])
    for (const value of [
      '50 ml',
      '0,476685%',
      '0.476685%',
      '1 010',
      '1,010',
      '0,101%',
      '0.101%',
      '2%',
      '1%',
      '0,04%',
      '0.04%',
      '3 ml',
      '30 секунд',
      '30 ثانية',
      '10-15',
    ]) {
      expect(copy).toContain(value)
    }
    expect(copy).toContain('комплекс')
    expect(copy).toContain('المركب')
    expect(copy).toContain('молок лосося')
    expect(copy).toContain('حليب السلمون')
  })

  it('keeps unsupported mechanisms and benefits out of customer-facing RU/AR', () => {
    const liveRuAr = JSON.stringify([
      PRODUCT_65_RU_TRANSLATION,
      PRODUCT_65_AR_TRANSLATION,
      getBioMesoCopy('ru'),
      getBioMesoCopy('ar'),
      getCatalogQuickFacts('65', 'ru'),
      getCatalogQuickFacts('65', 'ar'),
      ruMessages.product.routinePDRNAmpouleDesc,
      arMessages.product.routinePDRNAmpouleDesc,
      ruMessages.product.pc65Intro,
      ruMessages.product.pc65Benefit1Text,
      ruMessages.product.pc65Benefit2Text,
      ruMessages.product.pc65Benefit3Text,
      ruMessages.product.pc65Benefit4Text,
      arMessages.product.pc65Intro,
      arMessages.product.pc65Benefit1Text,
      arMessages.product.pc65Benefit2Text,
      arMessages.product.pc65Benefit3Text,
      arMessages.product.pc65Benefit4Text,
    ])
    for (const pattern of forbidden) expect(liveRuAr).not.toMatch(pattern)
  })

  it('qualifies trace ingredients and absence of an exact-product efficacy study', () => {
    const copy = JSON.stringify([
      PRODUCT_65_RU_TRANSLATION,
      PRODUCT_65_AR_TRANSLATION,
      getBioMesoCopy('ru'),
      getBioMesoCopy('ar'),
    ])
    expect(copy).toContain('следов')
    expect(copy).toContain('ضئيلة')
    expect(copy).toContain('нет отдельного клинического исследования')
    expect(copy).toContain('لا تتوفر دراسة فعالية خاصة')
    expect(PRODUCT_65_FULL_INCI).toContain('Sodium DNA (1010ppm)')
    expect(PRODUCT_65_FULL_INCI).toContain('sh-Oligopeptide-1')
    expect(PRODUCT_65_FULL_INCI).toContain('Ceramide EOP')
    expect(PRODUCT_65_FULL_INCI).toContain('Collagen, Elastin')
  })

  it('keeps documented reactions, aftercare and contraindications qualified', () => {
    const copy = JSON.stringify([
      PRODUCT_65_RU_TRANSLATION.directions,
      PRODUCT_65_AR_TRANSLATION.directions,
      getBioMesoCopy('ru').safety,
      getBioMesoCopy('ar').safety,
      getBioMesoCopy('ru').timeline,
      getBioMesoCopy('ar').timeline,
    ])
    for (const value of [
      'покалывание',
      'وخز',
      'покраснение',
      'احمرار',
      'сухость',
      'جفاف',
      'солнцезащит',
      'واقي الشمس',
      'розацеа',
      'الوردية',
      'беременности',
      'الحمل',
    ]) {
      expect(copy).toContain(value)
    }
  })

  it('preserves the studio gallery and locale mapping', () => {
    expect(localizeProductImages(gallery, 'ru')).toEqual(gallery.map(path => path.replace('/pdrn_5000_new/', '/pdrn_5000_new/ru/')))
    expect(localizeProductImages(gallery, 'ar')).toEqual(gallery.map(path => path.replace('/pdrn_5000_new/', '/pdrn_5000_new/ar/')))
  })
})
