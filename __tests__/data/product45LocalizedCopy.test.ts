import {
  PRODUCT_45_AR_TRANSLATION,
  PRODUCT_45_FULL_INCI,
  PRODUCT_45_RU_TRANSLATION,
} from '@/data/product45LocalizedCopy'
import { productTranslations } from '@/data/productTranslations'
import { productTranslationsRu } from '@/data/productTranslationsRu'
import { HAIR_SOLUTION_COPY } from '@/components/product/hr3/hairSolutionCopy'

const combined = JSON.stringify({
  ru: PRODUCT_45_RU_TRANSLATION,
  ar: PRODUCT_45_AR_TRANSLATION,
  bespokeRu: HAIR_SOLUTION_COPY.ru,
  bespokeAr: HAIR_SOLUTION_COPY.ar,
}).toLowerCase()

describe('product 45 RU/AR localized copy', () => {
  it('is wired into both translation maps', () => {
    expect(productTranslations['45']).toBe(PRODUCT_45_AR_TRANSLATION)
    expect(productTranslationsRu['45']).toBe(PRODUCT_45_RU_TRANSLATION)
  })

  it('uses the registered 4 ml × 8 format and immediate-use rule', () => {
    expect(PRODUCT_45_RU_TRANSLATION.description).toContain('4 мл')
    expect(PRODUCT_45_AR_TRANSLATION.description).toContain('4 مل')
    expect(PRODUCT_45_RU_TRANSLATION.description).toContain('восьми')
    expect(PRODUCT_45_AR_TRANSLATION.description).toContain('ثماني')
    expect(combined).toContain('утилиз')
    expect(combined).toContain('التخلص')
  })

  it('preserves the verified formula concentrations', () => {
    for (const value of [
      '9,995%',
      '2,042%',
      '1,000%',
      '0,450%',
      '0,200%',
      '0,100%',
      '5 ppm',
      '1,2 ppm',
      '6,65',
    ]) {
      expect(JSON.stringify(PRODUCT_45_RU_TRANSLATION)).toContain(value)
    }
    for (const value of ['9.995%', '2.042%', '1.000%', '0.450%', '0.200%', '0.100%', '6.65']) {
      expect(JSON.stringify(PRODUCT_45_AR_TRANSLATION)).toContain(value)
    }
  })

  it('preserves exact peptide levels and the full INCI', () => {
    expect(combined).toContain('sh-polypeptide-7')
    expect(combined).toContain('sh-polypeptide-9')
    expect(combined).toContain('sh-oligopeptide-1')
    expect(combined).toContain('sh-polypeptide-71')
    expect(PRODUCT_45_FULL_INCI).toContain('1,2-Hexanediol')
    expect(PRODUCT_45_FULL_INCI).toContain('Copper Tripeptide-1')
  })

  it('includes professional/home protocols and pregnancy precautions', () => {
    expect(combined).toContain('0,25-0,5')
    expect(combined).toContain('0.25-0.5')
    expect(combined).toContain('10-15')
    expect(combined).toContain('1-2 см')
    expect(combined).toContain('1-2 سم')
    expect(combined).toContain('беременности')
    expect(combined).toContain('الحمل')
  })

  it('does not make prohibited efficacy or sterility claims', () => {
    for (const forbidden of [
      '5α-reductase',
      'dht',
      'angiogenesis',
      'sterile-by-design',
      'стимулирует рост',
      'предотвращает выпадение',
      'усиливает кровоток',
      'يمنع تساقط الشعر',
      'تكوين الأوعية',
    ]) {
      expect(combined).not.toContain(forbidden)
    }
  })
})
