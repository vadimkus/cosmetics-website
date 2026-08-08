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
