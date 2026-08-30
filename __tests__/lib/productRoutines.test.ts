import fs from 'node:fs'
import path from 'node:path'
import { PRODUCT_ROUTINES } from '@/lib/productRoutines'
import { ROUTINE_STEP_PRODUCT_IDS } from '@/lib/routineStepLinks'
import {
  ROUTINE_STEP_IMAGE_BY_PRODUCT_ID,
  getRoutineStepImage,
} from '@/lib/routineStepImages'
import { getMobileRoutine } from '@/lib/mobileProductRoutines'
import enMessages from '@/messages/en.json'
import arMessages from '@/messages/ar.json'
import ruMessages from '@/messages/ru.json'

const EXPECTED_RECIPIENTS = [
  '1', '3', '10', '11', '12', '14', '15', '16', '17', '18', '19', '20',
  '21', '22', '23', '24', '25', '27', '28', '29', '30', '31', '32', '33',
  '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45',
  '46', '47', '50', '51', '52', '53', '55', '56', '57', '58', '59', '60',
  '61', '62', '63', '64', '65', '66',
]

const CLEANSERS = new Set([
  'routineMakeupRemoverTitle',
  'routineSnowO2Title',
  'routineCerabarrierCleanserTitle',
])
const REMOVERS = new Set(['routineMakeupRemoverTitle'])
const SUN_OR_MAKEUP_FINISHERS = new Set([
  'routineUltraShieldSunTitle',
  'routineMultiSunCreamTitle',
  'routineBBCushionTitle',
  'routineIntensiveBBTitle',
  'routineRevitaGlowBBTitle',
])
const MASKS = new Set([
  'routineCollagenMaskTitle',
  'routineSoothingBombMaskTitle',
  'routineEyePatchTitle',
  'routinePeptideGelMaskTitle',
  'routinePDRNMaskTitle',
  'routineBioFermentMaskTitle',
  'routineHydroCoolMaskTitle',
  'routineEZCO2MaskTitle',
])
const LEAVE_ON_FACE_PRODUCTS = new Set([
  'routineMultiVitaSerumTitle',
  'routineMultiVitaCreamTitle',
  'routineProblemControlSerumTitle',
  'routineProblemControlCreamTitle',
  'routineHyaluronSerumTitle',
  'routineHyaluronCreamTitle',
  'routineAllForSensitiveSerumTitle',
  'routineSkinBarrierCreamTitle',
  'routineAntiWrinkleSerumTitle',
  'routineAntiWrinkleCreamTitle',
  'routineEyeSerumTitle',
  'routineEyeCreamTitle',
  'routinePostcreamTitle',
  'routineHydroSoothingCreamTitle',
  'routineNDCellCreamTitle',
])
const KIT_RECIPIENTS = new Set(['47', '50', '55', '56', '57', '58', '59', '62'])

describe('recommended routine catalog', () => {
  it('covers the audited 54 product recipients from one canonical map', () => {
    expect(Object.keys(PRODUCT_ROUTINES).sort((a, b) => Number(a) - Number(b)))
      .toEqual(EXPECTED_RECIPIENTS)
  })

  it('has localized, linked, image-backed steps in EN/RU/AR', () => {
    const locales = [enMessages, ruMessages, arMessages]

    for (const [recipientId, routine] of Object.entries(PRODUCT_ROUTINES)) {
      for (const locale of locales) {
        const productMessages = locale.product as Record<string, string>
        expect(productMessages[routine.headingKey]).toBeTruthy()
      }

      const linkedProductIds = routine.steps.map(({ titleKey, descKey }) => {
        for (const locale of locales) {
          const productMessages = locale.product as Record<string, string>
          expect(productMessages[titleKey]).toBeTruthy()
          expect(productMessages[descKey]).toBeTruthy()
        }

        const productId = ROUTINE_STEP_PRODUCT_IDS[titleKey]
        expect(productId).toBeTruthy()
        expect(ROUTINE_STEP_IMAGE_BY_PRODUCT_ID[productId!]).toBeTruthy()
        expect(getRoutineStepImage(titleKey)).toBe(ROUTINE_STEP_IMAGE_BY_PRODUCT_ID[productId!])
        expect(fs.existsSync(path.join(process.cwd(), 'public', ROUTINE_STEP_IMAGE_BY_PRODUCT_ID[productId!]!.slice(1))))
          .toBe(true)
        return productId
      })

      expect(new Set(linkedProductIds).size).toBe(linkedProductIds.length)
      if (!KIT_RECIPIENTS.has(recipientId)) {
        expect(linkedProductIds).toContain(recipientId)
      }
    }
  })

  it('keeps cleansing first and removers PM-first only', () => {
    for (const routine of Object.values(PRODUCT_ROUTINES)) {
      const titles = routine.steps.map(({ titleKey }) => titleKey)
      const removerIndex = titles.findIndex((title) => REMOVERS.has(title))
      if (removerIndex >= 0) expect(removerIndex).toBe(0)

      const treatmentIndex = titles.findIndex((title) => !CLEANSERS.has(title))
      for (let index = treatmentIndex + 1; index < titles.length; index += 1) {
        expect(CLEANSERS.has(titles[index]!)).toBe(false)
      }
    }
  })

  it('keeps SPF and complexion makeup as the final daytime step', () => {
    for (const routine of Object.values(PRODUCT_ROUTINES)) {
      const titles = routine.steps.map(({ titleKey }) => titleKey)
      titles.forEach((title, index) => {
        if (SUN_OR_MAKEUP_FINISHERS.has(title)) expect(index).toBe(titles.length - 1)
      })
    }
  })

  it('places treatment masks before leave-on serums and creams', () => {
    for (const routine of Object.values(PRODUCT_ROUTINES)) {
      const titles = routine.steps.map(({ titleKey }) => titleKey)
      const firstLeaveOn = titles.findIndex((title) => LEAVE_ON_FACE_PRODUCTS.has(title))
      if (firstLeaveOn < 0) continue
      titles.forEach((title, index) => {
        if (MASKS.has(title)) expect(index).toBeLessThan(firstLeaveOn)
      })
    }
  })

  it('keeps device and scalp sequencing safe', () => {
    for (const routine of Object.values(PRODUCT_ROUTINES)) {
      const ids = routine.steps.map(({ titleKey }) => ROUTINE_STEP_PRODUCT_IDS[titleKey])
      expect(ids.includes('1') && (ids.includes('60') || ids.includes('65'))).toBe(false)

      const titles = routine.steps.map(({ titleKey }) => titleKey)
      const scalpPeel = titles.indexOf('routineScalpPeelingTitle')
      const shampoo = titles.indexOf('routineScalpShampooTitle')
      if (scalpPeel >= 0 && shampoo >= 0) expect(scalpPeel).toBeLessThan(shampoo)

      const stamp = titles.indexOf('routineHairStampTitle')
      const solution = titles.indexOf('routineHairSolutionTitle')
      if (stamp >= 0 && solution >= 0) expect(stamp).toBeLessThan(solution)
    }
  })

  it('regresses product 41 to a cushion-final daytime sequence', () => {
    const titles = PRODUCT_ROUTINES['41']!.steps.map(({ titleKey }) => titleKey)
    expect(titles).toEqual([
      'routineSnowO2Title',
      'routineMicrobiomeMistTitle',
      'routineHyaluronCreamTitle',
      'routineBBCushionTitle',
    ])
    expect(titles).not.toContain('routineMakeupRemoverTitle')
  })

  it('serializes corrected routines through the native mobile API resolver', () => {
    for (const locale of ['en', 'ru', 'ar']) {
      const routine = getMobileRoutine('41', locale)
      expect(routine?.steps).toHaveLength(4)
      expect(routine?.steps.at(-1)?.productId).toBe('41')
      expect(routine?.steps.some((step) => step.productId === '11')).toBe(false)
    }

    expect(getMobileRoutine('55', 'en')).not.toBeNull()
    expect(getMobileRoutine('57', 'en')?.steps.at(-1)?.productId).toBe('41')
    expect(getMobileRoutine('62', 'en')?.steps.some((step) => step.title.includes('EGF'))).toBe(false)
  })
})

/**
 * The August 2026 localization pass rewrote Russian and Arabic against the
 * Intertek dossier while English was deliberately frozen, and the routine steps
 * ended up saying different things in different languages: English invented
 * weekly frequencies for three masks whose cartons print none, and Russian
 * drifted into reciting the formula. These guard the repair.
 */
describe('recommended routine copy', () => {
  const LOCALE_MESSAGES = {
    en: (enMessages as { product: Record<string, string> }).product,
    ru: (ruMessages as { product: Record<string, string> }).product,
    ar: (arMessages as { product: Record<string, string> }).product,
  }
  const LOCALES = ['en', 'ru', 'ar'] as const

  const descKeys = [
    ...new Set(Object.values(PRODUCT_ROUTINES).flatMap((r) => r.steps.map((s) => s.descKey))),
  ]

  /** Arabic may use Arabic-Indic numerals, which are the same figures. */
  const figuresIn = (text: string): Set<string> => {
    const western = text.replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    const normalized = western
      .replace(/(\d)[\u00a0\u202f ](?=\d)/g, '$1')
      .replace(/(\d),(?=\d{3}\b)/g, '$1')
    return new Set((normalized.match(/\d+[.,]?\d*/g) || []).map((d) => d.replace(',', '.')))
  }

  it('quotes the same figures in every language', () => {
    const divergent: string[] = []
    for (const key of descKeys) {
      const en = figuresIn(LOCALE_MESSAGES.en[key] ?? '')
      for (const locale of ['ru', 'ar'] as const) {
        const other = figuresIn(LOCALE_MESSAGES[locale][key] ?? '')
        const added = [...other].filter((f) => !en.has(f))
        const dropped = [...en].filter((f) => !other.has(f))
        if (added.length || dropped.length) {
          divergent.push(`${key} (${locale}): +${added.join(',')} -${dropped.join(',')}`)
        }
      }
    }
    expect(divergent).toEqual([])
  })

  it('keeps dossier vocabulary out of customer-facing steps', () => {
    // One named active in plain prose is fine. An ingredient welded to its
    // concentration, a ppm figure, or a stack of percentages is not.
    const inciWithFigure =
      /(Sodium Cocoyl Glutamate|Cocamidopropyl Betaine|Decyl Glucoside|PENTAVITIN|Butylene Glycol|Sodium Hyaluronate|Niacinamide|Adenosine|Panthenol|Allantoin|Glycerin|Squalane|Ceramide NP)[^.!?]{0,24}?\d/i
    const offenders: string[] = []
    for (const key of descKeys) {
      for (const locale of LOCALES) {
        const text = LOCALE_MESSAGES[locale][key] ?? ''
        if (inciWithFigure.test(text)) offenders.push(`${key} (${locale}): ingredient with a concentration`)
        if (/\bppm\b|جزء في المليون/i.test(text)) offenders.push(`${key} (${locale}): ppm`)
        if ((text.match(/\d+[.,]?\d*\s?%/g) || []).length >= 2) {
          offenders.push(`${key} (${locale}): stacked percentages`)
        }
        if (/\b[A-Z]\d{3,4}[A-Z]\b/.test(text)) offenders.push(`${key} (${locale}): lot code`)
      }
    }
    expect(offenders).toEqual([])
  })

  it('does not reinstate the usage frequencies the cartons never printed', () => {
    // Verified against the registered artwork: the collagen mask, the PDRN mask
    // and the soothing bomb mask print a wear time and no weekly frequency.
    const noPrintedFrequency = [
      'routineCollagenMaskDesc',
      'routinePDRNMaskDesc',
      'routineSoothingBombMaskDesc',
      'routineSoothingBombMaskDescProblem',
      'routineSoothingBombMaskDescSensitive',
      'routineSoothingBombMaskDescBrightening',
    ]
    for (const key of noPrintedFrequency) {
      for (const locale of LOCALES) {
        const text = LOCALE_MESSAGES[locale][key] ?? ''
        expect(text).not.toMatch(/times? (a|per) week|раз в неделю|أسبوعياً/i)
      }
    }
  })

  it('does not reinstate claims that appear in no document', () => {
    // "Skin age index" and "seven plants" are deliberately absent from this
    // list: both have sources (a P&K clinical study and the sensitive box copy
    // naming all seven botanicals). They are simply not what a two-line step
    // needs. These four have no source anywhere.
    const unsupported = [
      /causes of hair (thinning|loss)/i,
      /multipl(y|ies|ying) [^.!?]*absorption/i,
      /dramatically improve/i,
      /refresh follicles/i,
    ]
    for (const key of descKeys) {
      const text = LOCALE_MESSAGES.en[key] ?? ''
      for (const pattern of unsupported) expect(text).not.toMatch(pattern)
    }
  })

  it('reserves the micro-channel mechanism for the microneedle roller', () => {
    // A roller genuinely perforates the surface. The hair stamp and the spicule
    // ampoule were borrowing the same language with nothing behind it.
    for (const key of descKeys) {
      if (key === 'routineMicroneedleRollerDesc') continue
      for (const locale of LOCALES) {
        expect(LOCALE_MESSAGES[locale][key] ?? '').not.toMatch(
          /micro-?channels?|микроканал|قنوات دقيقة/i
        )
      }
    }
  })

  it('ends every step as a finished sentence', () => {
    for (const key of descKeys) {
      for (const locale of LOCALES) {
        expect(LOCALE_MESSAGES[locale][key] ?? '').toMatch(/[.!?…]\s*$/)
      }
    }
  })
})
