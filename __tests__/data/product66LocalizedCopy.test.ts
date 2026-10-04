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
  '/images/cera_o/m1j.jpg',
  '/images/cera_o/s1.jpeg',
  '/images/cera_o/s2.jpeg',
  '/images/cera_o/m2j.jpg',
  '/images/cera_o/s3.jpeg',
  '/images/cera_o/m3j.jpg',
  '/images/cera_o/s4j.jpeg',
  '/images/cera_o/m4j.jpg',
  '/images/cera_o/s5.jpeg',
  '/images/cera_o/m5j.jpg',
  '/images/cera_o/s6.jpeg',
  '/images/cera_o/m6j.jpg',
  '/images/cera_o/m7j.jpg',
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
    expect(getProductTranslationsRu('66')).toEqual(PRODUCT_66_RU_TRANSLATION)
    expect(getProductTranslations('66')).toEqual(PRODUCT_66_AR_TRANSLATION)
    expect(getProductTranslationsRu(productId)).toEqual(PRODUCT_66_RU_TRANSLATION)
    expect(getProductTranslations(productId)).toEqual(PRODUCT_66_AR_TRANSLATION)
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

  it('sells in RU/AR without dossier language or the deck hydration headline', () => {
    const copy = JSON.stringify([
      PRODUCT_66_RU_TRANSLATION,
      PRODUCT_66_AR_TRANSLATION,
      getCeraCopy('ru'),
      getCeraCopy('ar'),
    ])
    for (const pattern of [
      /DTS MG|Safety Assessment/,
      /презентац|документ|измерен|спецификац|исходн\w* отч|следов\w* концентрац|не доказан|не приписыва/i,
      /عرض DTS|المستندات|مقاس|مواصفة|التقرير الأصلي|تراكيز ضئيلة|لم يثبت|لا ننسب/,
      /145[,.]8|2[,.]4×|25[,.]59|56[,.]19|119[,.]6/,
      /5[,.]0000076|3[,.]000041/,
    ]) {
      expect(copy).not.toMatch(pattern)
    }
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
