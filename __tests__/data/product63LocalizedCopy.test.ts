import {
  PRODUCT_63_AR_TRANSLATION,
  PRODUCT_63_RU_TRANSLATION,
} from '@/data/product63LocalizedCopy'
import { productTranslations } from '@/data/productTranslations'
import { productTranslationsRu } from '@/data/productTranslationsRu'
import { getRevitaGlowCopy } from '@/components/product/revitaglow/revitaGlowCopy'
import { getCatalogQuickFacts } from '@/lib/productQuickFactsCatalog'
import { getMobileRoutine } from '@/lib/mobileProductRoutines'
import { getProductColors } from '@/data/productConfig'
import { findSelectedStandardCartLine } from '@/lib/cartVariantSelection'

const prohibited = [
  /(?:стеклянн|glass[\s-]?skin|كالزجاج)/i,
  /(?:регенер|восстанавлив|оживля|энерг|منشط|تجديد|إحياء|تنشيط)/i,
  /(?:барьер|حاجز).{0,20}(?:защит|восстанов|حماي|إصلاح)/i,
  /(?:противовоспал|коллаген|фибробласт|مضاد للالتهاب|كولاجين|خلايا ليفية)/i,
  /(?:растительн.{0,20}гиалур|بديل.{0,20}هيالور)/i,
  /(?:весь день|без переноса|без сухости|طوال اليوم|مقاوم للانتقال|دون جفاف)/i,
  /(?:все типы кожи|جميع أنواع البشرة)/i,
  /(?:микро.?воздуш|четыр[её]хслойн|adhesion|التصاق رباعي|بنية هوائية دقيقة)/i,
]

describe('product 63 audited RU/AR copy', () => {
  it('feeds both product-number and CUID translation keys from one canonical payload', () => {
    expect(productTranslationsRu['63']).toBe(PRODUCT_63_RU_TRANSLATION)
    expect(productTranslations['63']).toBe(PRODUCT_63_AR_TRANSLATION)
    expect(productTranslationsRu['cmljaahes0017e9ex5yfv76en']).toBe(PRODUCT_63_RU_TRANSLATION)
    expect(productTranslations['cmljaahes0017e9ex5yfv76en']).toBe(PRODUCT_63_AR_TRANSLATION)
  })

  it('locks the source-grounded concentrations and risk boundaries', () => {
    const copy = JSON.stringify([
      PRODUCT_63_RU_TRANSLATION,
      PRODUCT_63_AR_TRANSLATION,
      getRevitaGlowCopy('ru'),
      getRevitaGlowCopy('ar'),
      getCatalogQuickFacts('63', 'ru'),
      getCatalogQuickFacts('63', 'ar'),
    ])

    for (const fact of [
      '21,5895%',
      '20,6389%',
      '2,000010%',
      '0,040000%',
      '0,036%',
      '0.036%',
      'Водостойкость не заявлена',
      'لا يدّعي المنتج مقاومة الماء',
      'масла кожуры лимона и горького апельсина',
      'زيتي قشر الليمون والبرتقال المر',
    ]) {
      expect(copy).toContain(fact)
    }

    for (const pattern of prohibited) expect(copy).not.toMatch(pattern)
  })

  it('preserves stable shade keys for web cart and native mobile options', () => {
    expect(getProductColors('63')).toEqual([
      { value: 'Bright', label: '#01 Bright', available: true },
      { value: 'Natural', label: '#02 Natural', available: true },
    ])
    expect(getRevitaGlowCopy('ru').shades.map(shade => shade.value)).toEqual(['Bright', 'Natural'])
    expect(getRevitaGlowCopy('ar').shades.map(shade => shade.value)).toEqual(['Bright', 'Natural'])

    const items = [
      { id: 'line-bright', product: { id: 'product-63' }, selectedColor: 'Bright', selectedSize: '', quantity: 1 },
      { id: 'line-natural', product: { id: 'product-63' }, selectedColor: 'Natural', selectedSize: '', quantity: 2 },
    ]
    expect(findSelectedStandardCartLine(items as never, 'product-63', 'Bright', '')?.quantity)
      .toBe(1)
    expect(findSelectedStandardCartLine(items as never, 'product-63', 'Natural', '')?.quantity)
      .toBe(2)
  })

  it('keeps Revita Glow as the final mobile routine step in all locales', () => {
    for (const locale of ['en', 'ru', 'ar']) {
      const routine = getMobileRoutine('63', locale)
      expect(routine?.steps.at(-1)?.productId).toBe('63')
    }
  })
})
