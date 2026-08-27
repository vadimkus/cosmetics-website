import {
  PRODUCT_60_AR_TRANSLATION,
  PRODUCT_60_FULL_INCI,
  PRODUCT_60_RU_TRANSLATION,
} from '@/data/product60LocalizedCopy'
import { productTranslations } from '@/data/productTranslations'
import { productTranslationsRu } from '@/data/productTranslationsRu'
import { getBioMesoExpertCopy } from '@/components/product/biomeso/biomesoExpertCopy'
import { getCatalogQuickFacts } from '@/lib/productQuickFactsCatalog'
import arMessages from '@/messages/ar.json'
import ruMessages from '@/messages/ru.json'

const forbidden = [
  /60[,\s]?000\s*ppm spicules?|Спикулы 60\s?000\s*ppm|شويكات 60,000\s*ppm/i,
  /spicule (?:load|count).{0,20}60[,\s]?000|концентрация спикул.{0,20}60\s?000|تركيز الشويكات.{0,20}60,000/i,
  /300[,\s]?000.{0,30}360[,\s]?000/i,
  /(?:spicules?|спикул|شويك).{0,20}(?:create|form|созда|формир|تُنشئ|تشكل).{0,20}(?:micro-?channels?|микроканал|قنوات دقيقة)/i,
  /(?:deliver|drive).{0,20}(?:PDRN|active).{0,20}(?:deep|skin)|достав\w*.{0,20}(?:PDRN|актив).{0,20}(?:вглубь|кож)|توص\w*.{0,20}(?:PDRN|المكونات).{0,20}(?:بعمق|البشرة)/i,
  /needle-?free microneedling|безыгольн\w+ микронидлинг|وخز دقيق بلا إبر/i,
  /collagen.{0,20}(?:stimulat|synthes|production)|(?:стимул|синтез|выработк).{0,20}коллаген|(?:تحفيز|إنتاج).{0,20}الكولاجين/i,
  /elastin.{0,20}(?:stimulat|synthes|production)|(?:стимул|синтез|выработк).{0,20}эластин|(?:تحفيز|إنتاج).{0,20}الإيلاستين/i,
  /cell regeneration|регенерац\w+ клет|تجدد الخلايا/i,
  /barrier (?:repair|strengthen)|(?:восстанавлив|укрепля).{0,20}барьер|(?:إصلاح|تقوية).{0,20}الحاجز/i,
  /bio-?peel|био-?пилинг|تقشير حيوي/i,
  /once a month|раз в месяц|مرة شهرياً/i,
  /7\s*(?:to| - |-)\s*10 days|14 days|six months|7\s*(?: - |-)\s*10 дней|14 дней|шесть месяцев/i,
  /licensed aestheticians?|licensed dermatologists?|лицензированн\w+ (?:косметолог|дерматолог)|خبير تجميل مرخص|طبيب جلدية مرخص/i,
]

describe('product 60 audited localized copy', () => {
  it('feeds both translation maps from one canonical payload', () => {
    expect(productTranslationsRu['60']).toEqual(PRODUCT_60_RU_TRANSLATION)
    expect(productTranslations['60']).toEqual(PRODUCT_60_AR_TRANSLATION)
    expect(productTranslationsRu['cmk449na90077e9k5anpfqz4o']).toBe(productTranslationsRu['60'])
    expect(productTranslations['cmk449na90077e9k5anpfqz4o']).toBe(productTranslations['60'])
  })

  it('keeps pack, formula, origin, COA and exact-study facts', () => {
    const copy = JSON.stringify([
      PRODUCT_60_RU_TRANSLATION,
      PRODUCT_60_AR_TRANSLATION,
      getBioMesoExpertCopy('ru'),
      getBioMesoExpertCopy('ar'),
      getCatalogQuickFacts('60', 'ru'),
      getCatalogQuickFacts('60', 'ar'),
    ])
    for (const value of [
      '5,72022%',
      '5.72022%',
      '1 120',
      '1,120',
      '0,112%',
      '0.112%',
      '2%',
      '1%',
      '0,04%',
      '0.04%',
      '7,27',
      '7.27',
      '7,446%',
      '7.446%',
      '19,858%',
      '19.858%',
      '52,247%',
      '52.247%',
      '20',
      '48 ± 8',
      '4 ампулы',
      '4 أمبولات',
    ]) {
      expect(copy).toContain(value)
    }
    expect(copy).toContain('молок лосося')
    expect(copy).toContain('حليب السلمون')
  })

  it('defines 60000 as the complex rather than PDRN or a spicule count', () => {
    const copy = JSON.stringify([
      PRODUCT_60_RU_TRANSLATION,
      PRODUCT_60_AR_TRANSLATION,
      getBioMesoExpertCopy('ru'),
      getBioMesoExpertCopy('ar'),
      getCatalogQuickFacts('60', 'ru'),
      getCatalogQuickFacts('60', 'ar'),
    ])
    expect(copy).toContain('комплекс')
    expect(copy).toContain('المركب')
    expect(copy).toContain('не количество спикул')
    expect(copy).toContain('ليس إلى عدد الشويكات')
  })

  it('keeps unsupported mechanisms, medical analogies and invented schedules out of live RU/AR', () => {
    const liveRuAr = JSON.stringify([
      PRODUCT_60_RU_TRANSLATION,
      PRODUCT_60_AR_TRANSLATION,
      getBioMesoExpertCopy('ru'),
      getBioMesoExpertCopy('ar'),
      getCatalogQuickFacts('60', 'ru'),
      getCatalogQuickFacts('60', 'ar'),
      ruMessages.product.routineBioMesoExpertDesc,
      arMessages.product.routineBioMesoExpertDesc,
      ruMessages.product.pc60Intro,
      ruMessages.product.pc60Benefit1Text,
      ruMessages.product.pc60Benefit2Text,
      ruMessages.product.pc60Benefit3Text,
      ruMessages.product.pc60Benefit4Text,
      arMessages.product.pc60Intro,
      arMessages.product.pc60Benefit1Text,
      arMessages.product.pc60Benefit2Text,
      arMessages.product.pc60Benefit3Text,
      arMessages.product.pc60Benefit4Text,
    ])
    for (const pattern of forbidden) expect(liveRuAr).not.toMatch(pattern)
  })

  it('keeps the complete INCI and source-backed professional safety boundaries', () => {
    expect(PRODUCT_60_FULL_INCI).toContain('Hydrolyzed Sponge')
    expect(PRODUCT_60_FULL_INCI).toContain('Sodium DNA (1120ppm)')
    expect(PRODUCT_60_FULL_INCI).toContain('Ceramide EOP')
    expect(PRODUCT_60_FULL_INCI).toContain('sh-Oligopeptide-1')

    const copy = JSON.stringify([
      PRODUCT_60_RU_TRANSLATION,
      PRODUCT_60_AR_TRANSLATION,
      getBioMesoExpertCopy('ru').safety,
      getBioMesoExpertCopy('ar').safety,
    ])
    for (const value of ['розацеа', 'الوردية', 'аутоиммун', 'المناعة الذاتية', 'изотретиноин', 'الإيزوتريتينوين']) {
      expect(copy).toContain(value)
    }
    expect(copy).toContain('обученного специалиста')
    expect(copy).toContain('مختص مدرّب')
  })
})
