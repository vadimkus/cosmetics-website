import {
  PRODUCT_52_AR_TRANSLATION,
  PRODUCT_52_FULL_INCI,
  PRODUCT_52_RU_TRANSLATION,
} from '@/data/product52LocalizedCopy'
import { productTranslations } from '@/data/productTranslations'
import { productTranslationsRu } from '@/data/productTranslationsRu'
import { getPdrnMaskCopy } from '@/components/product/pdrnmask/pdrnMaskCopy'
import { getCatalogQuickFacts } from '@/lib/productQuickFactsCatalog'

const unsupported = [
  /working dose|рабоч(?:ая|ей)\s+(?:доза|концентрац)|جرعة فعالة/i,
  /close to human|близк\w+\s+к\s+человеческ|قريب من الحمض النووي البشري/i,
  /skin (?:reads|recognises).*(?:familiar|own)|кожа (?:распозна|воспринима).*(?:свой|знаком)|تتعرف البشرة.*مألوف/i,
  /stimulates? (?:cell|tissue) (?:repair|regeneration)|стимулирует регенерацию (?:клеток|тканей)|يحفز (?:إصلاح|تجدد) (?:الخلايا|الأنسجة)/i,
  /promotes? collagen synthesis|стимулирует синтез коллагена|يعزز تخليق الكولاجين/i,
  /restores? the skin barrier|восстанавливает барьер кожи|يستعيد حاجز البشرة/i,
  /2[–-]3 (?:times|раза)|2-3 مرات|٢[–-]٣ مرات/i,
  /does not sting|не (?:щиплет|вызывает жжения)|لا يسبب لسعاً/i,
  /all skin types|все типы кожи|جميع أنواع البشرة/i,
]

describe('product 52 audited localized copy', () => {
  it('feeds the RU and AR translation maps from the audited payload', () => {
    expect(productTranslationsRu['52']).toEqual(PRODUCT_52_RU_TRANSLATION)
    expect(productTranslations['52']).toEqual(PRODUCT_52_AR_TRANSLATION)
  })

  it('keeps the verified pack, formula, pH and study facts', () => {
    const copy = JSON.stringify([
      PRODUCT_52_RU_TRANSLATION,
      PRODUCT_52_AR_TRANSLATION,
      getPdrnMaskCopy('ru'),
      getPdrnMaskCopy('ar'),
      getCatalogQuickFacts('52', 'ru'),
      getCatalogQuickFacts('52', 'ar'),
    ])
    for (const value of ['350', '30', '10–20', '1 000', '1,000', '2%', '0,04%', '0.04%', '1%', '0,1%', '0.1%', '6,37', '6.37', '35%', '13,445', '13.445', '8,735', '8.735', '20']) {
      expect(copy).toContain(value)
    }
    expect(copy).toContain('5,094076%')
    expect(copy).toContain('5.094076%')
    expect(copy).toContain('Lavandula Angustifolia')
  })

  it('keeps unsupported mechanisms, protocols and absolutes out of live RU/AR', () => {
    const liveRuAr = JSON.stringify([
      PRODUCT_52_RU_TRANSLATION,
      PRODUCT_52_AR_TRANSLATION,
      getPdrnMaskCopy('ru'),
      getPdrnMaskCopy('ar'),
      getCatalogQuickFacts('52', 'ru'),
      getCatalogQuickFacts('52', 'ar'),
    ])
    for (const pattern of unsupported) expect(liveRuAr).not.toMatch(pattern)
  })

  it('preserves complete INCI and storage hygiene', () => {
    expect(PRODUCT_52_FULL_INCI).toContain('Lavandula Angustifolia (Lavender) Oil')
    const copy = JSON.stringify([PRODUCT_52_RU_TRANSLATION, PRODUCT_52_AR_TRANSLATION])
    expect(copy).toContain('пинцет')
    expect(copy).toContain('الملقط')
    expect(copy).toContain('6 месяцев')
    expect(copy).toContain('6 أشهر')
  })
})
