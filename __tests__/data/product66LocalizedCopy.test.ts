import {
  PRODUCT_66_AR_NAME,
  PRODUCT_66_AR_TRANSLATION,
  PRODUCT_66_FULL_INCI,
  PRODUCT_66_RU_NAME,
  PRODUCT_66_RU_TRANSLATION,
} from '@/data/product66LocalizedCopy'
import { getProductTranslations } from '@/data/productTranslations'
import { getProductTranslationsRu } from '@/data/productTranslationsRu'
import { getCeraCopy } from '@/components/product/cerabarrier/cerabarrierCopy'
import { getCatalogQuickFacts } from '@/lib/productQuickFactsCatalog'
import { localizeProductImages } from '@/lib/localizedProductImages'
import arMessages from '@/messages/ar.json'
import ruMessages from '@/messages/ru.json'

const productId = 'cmr6dajor031ygfnm6rsjkicf'
const gallery = [
  '/images/cera_o/s1.jpeg',
  '/images/cera_o/s2.jpeg',
  '/images/cera_o/s3.jpeg',
  '/images/cera_o/s4.jpeg',
  '/images/cera_o/s5.jpeg',
  '/images/cera_o/s6.jpeg',
  '/images/cera_o/s7.jpeg',
]

const forbidden = [
  /клинически доказан|مُثبت سريري/i,
  /укрепл\w+ .{0,20}барьер|تقوية .{0,20}الحاجز/i,
  /балансиру\w+ микробиом|للحفاظ على توازن الفلورا/i,
  /все типы кожи|جميع أنواع البشرة/i,
  /полностью удаля\w+|يزيل الدهون والشوائب/i,
  /без стянут|بلا شد/i,
  /утром и вечером|صباحاً ومساءً/i,
]

describe('product 66 source-grounded RU/AR copy', () => {
  it('serves one canonical payload by product number and production CUID', () => {
    expect(getProductTranslationsRu('66')).toBe(PRODUCT_66_RU_TRANSLATION)
    expect(getProductTranslations('66')).toBe(PRODUCT_66_AR_TRANSLATION)
    expect(getProductTranslationsRu(productId)).toBe(PRODUCT_66_RU_TRANSLATION)
    expect(getProductTranslations(productId)).toBe(PRODUCT_66_AR_TRANSLATION)
    expect(PRODUCT_66_RU_TRANSLATION.name).toBe(PRODUCT_66_RU_NAME)
    expect(PRODUCT_66_AR_TRANSLATION.name).toBe(PRODUCT_66_AR_NAME)
  })

  it('keeps exact formula, pH and pack facts across live RU/AR surfaces', () => {
    const copy = JSON.stringify([
      PRODUCT_66_RU_TRANSLATION,
      PRODUCT_66_AR_TRANSLATION,
      getCeraCopy('ru'),
      getCeraCopy('ar'),
      getCatalogQuickFacts('66', 'ru'),
      getCatalogQuickFacts('66', 'ar'),
      ruMessages.product.routineCerabarrierCleanserDesc,
      arMessages.product.routineCerabarrierCleanserDesc,
    ])
    for (const value of [
      '8,75%',
      '8.75%',
      '6%',
      '1,65%',
      '1.65%',
      '5%',
      '3%',
      '0,5%',
      '0.5%',
      '6,37',
      '6.37',
      '200 ml',
      '600 ml',
    ]) {
      expect(copy).toContain(value)
    }
    expect(PRODUCT_66_FULL_INCI).toContain('1,2-Hexanediol')
    expect(PRODUCT_66_FULL_INCI).toContain('Parfum (Fragrance)')
    expect(PRODUCT_66_FULL_INCI).toContain('Ceramide EOP')
  })

  it('keeps unsupported barrier, microbiome and clinical headlines out of live RU/AR', () => {
    const liveRuAr = JSON.stringify([
      PRODUCT_66_RU_TRANSLATION,
      PRODUCT_66_AR_TRANSLATION,
      getCeraCopy('ru'),
      getCeraCopy('ar'),
      getCatalogQuickFacts('66', 'ru'),
      getCatalogQuickFacts('66', 'ar'),
      ruMessages.product.routineCerabarrierCleanserDesc,
      arMessages.product.routineCerabarrierCleanserDesc,
      ruMessages.product.pc34Benefit1Text,
      arMessages.product.pc34Benefit1Text,
    ])
    for (const pattern of forbidden) expect(liveRuAr).not.toMatch(pattern)
  })

  it('treats 145.8% and 2.4x as one unreproducible deck claim', () => {
    const copy = JSON.stringify([
      PRODUCT_66_RU_TRANSLATION,
      PRODUCT_66_AR_TRANSLATION,
      getCeraCopy('ru'),
      getCeraCopy('ar'),
    ])
    expect(copy).toContain('25,59')
    expect(copy).toContain('25.59')
    expect(copy).toContain('56,19')
    expect(copy).toContain('56.19')
    expect(copy).toContain('2,20')
    expect(copy).toContain('2.20')
    expect(copy).toContain('119,6')
    expect(copy).toContain('119.6')
    expect(copy).toContain('DTS MG')
  })

  it('preserves the studio gallery and locale mapping', () => {
    expect(localizeProductImages(gallery, 'ru')).toEqual(
      gallery.map(path => path.replace('/cera_o/', '/cera_o/ru/'))
    )
    expect(localizeProductImages(gallery, 'ar')).toEqual(
      gallery.map(path => path.replace('/cera_o/', '/cera_o/ar/'))
    )
  })
})
