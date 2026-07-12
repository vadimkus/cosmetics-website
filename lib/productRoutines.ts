/**
 * Data-driven "Recommended Routine" cards for PDPs.
 *
 * Each routine is tailored to the product: the product itself sits at its
 * natural step in a real GENOSYS regimen, surrounded by the products it is
 * designed to combine with. Steps reference i18n keys under `product.*` and
 * deep-link via ROUTINE_STEP_PRODUCT_IDS (lib/routineStepLinks.ts).
 *
 * Products with bespoke hardcoded routine blocks (beauty boxes 55-59, 62,
 * Revita Glow 63, Cerabarrier 66) are intentionally NOT listed here.
 * Professional clinic lines (Power Solutions, SRS, professional devices)
 * are also excluded — their protocols are practitioner territory.
 */
export interface RoutineStep {
  titleKey: string
  descKey: string
}

export interface ProductRoutine {
  headingKey: string
  steps: RoutineStep[]
}

const step = (titleKey: string, descKey: string): RoutineStep => ({ titleKey, descKey })

// ── Shared regimen fragments ─────────────────────────────────────────────
const CLEANSE = step('routineSnowO2Title', 'routineSnowO2Desc')
const CLEANSE_GENTLE = step('routineCerabarrierCleanserTitle', 'routineCerabarrierCleanserDesc')
const MIST = step('routineMicrobiomeMistTitle', 'routineMicrobiomeMistDesc')
const BOOSTER = step('routineSnowBoosterTitle', 'routineSnowBoosterDescBrightening')
const HYALURON_SERUM = step('routineHyaluronSerumTitle', 'routineHyaluronSerumDesc')
const HYALURON_CREAM = step('routineHyaluronCreamTitle', 'routineHyaluronCreamDesc')
const SUN_40 = step('routineMultiSunCreamTitle', 'routineMultiSunCreamDesc')
const SUN_50 = step('routineUltraShieldSunTitle', 'routineUltraShieldSunDesc')

// ── Routine templates ────────────────────────────────────────────────────
const BRIGHTENING = (self: RoutineStep[]): ProductRoutine => ({
  headingKey: 'recommendedSkinBrighteningRoutine',
  steps: self,
})

export const PRODUCT_ROUTINES: Record<string, ProductRoutine> = {
  // ── Cleansers & prep ──────────────────────────────────────────────────
  '10': BRIGHTENING([
    CLEANSE,
    BOOSTER,
    step('routineMultiVitaSerumTitle', 'routineMultiVitaSerumDesc'),
    step('routineMultiVitaCreamTitle', 'routineMultiVitaCreamDesc'),
    SUN_40,
  ]),
  '11': {
    headingKey: 'recommendedSkincareMakeupRoutine',
    steps: [
      step('routineMakeupRemoverTitle', 'routineMakeupRemoverDesc'),
      CLEANSE,
      MIST,
      HYALURON_CREAM,
    ],
  },
  '12': {
    headingKey: 'recommendedRenewalRoutine',
    steps: [CLEANSE, step('routinePeelingGelTitle', 'routinePeelingGelDesc'), MIST, HYALURON_SERUM, HYALURON_CREAM],
  },
  '14': {
    headingKey: 'recommendedBarrierCareRoutine',
    steps: [CLEANSE_GENTLE, MIST, HYALURON_SERUM, HYALURON_CREAM],
  },
  '15': {
    headingKey: 'recommendedProblemSkinRoutine',
    steps: [
      CLEANSE,
      step('routineProblemControlTonerTitle', 'routineProblemControlTonerDesc'),
      step('routineProblemControlSerumTitle', 'routineProblemControlSerumDesc'),
      step('routineProblemControlCreamTitle', 'routineProblemControlCreamDesc'),
      step('routineSoothingBombMaskTitle', 'routineSoothingBombMaskDescProblem'),
    ],
  },
  '16': BRIGHTENING([
    CLEANSE,
    BOOSTER,
    step('routineMultiVitaSerumTitle', 'routineMultiVitaSerumDesc'),
    step('routineMultiVitaCreamTitle', 'routineMultiVitaCreamDesc'),
    SUN_40,
  ]),

  // ── Eye care ──────────────────────────────────────────────────────────
  '17': {
    headingKey: 'recommendedEyeCareRoutine',
    steps: [
      CLEANSE,
      step('routineEyeSerumTitle', 'routineEyeSerumDesc'),
      step('routineEyeCreamTitle', 'routineEyeCreamDesc'),
      step('routineEyePatchTitle', 'routineEyePatchDesc'),
    ],
  },
  '24': {
    headingKey: 'recommendedEyeCareRoutine',
    steps: [
      CLEANSE,
      step('routineEyeSerumTitle', 'routineEyeSerumDesc'),
      step('routineEyeCreamTitle', 'routineEyeCreamDesc'),
      step('routineEyePatchTitle', 'routineEyePatchDesc'),
    ],
  },
  '33': {
    headingKey: 'recommendedEyeCareRoutine',
    steps: [
      CLEANSE,
      step('routineEyePatchTitle', 'routineEyePatchDesc'),
      step('routineEyeSerumTitle', 'routineEyeSerumDesc'),
      step('routineEyeCreamTitle', 'routineEyeCreamDesc'),
    ],
  },

  // ── Serums ────────────────────────────────────────────────────────────
  // Deep Moisturizing routines open with the Cerabarrier ceramide cleanser
  // (cleans without stripping the moisture barrier) instead of Snow O₂.
  '18': {
    headingKey: 'recommendedDeepMoisturizingRoutine',
    steps: [CLEANSE_GENTLE, MIST, HYALURON_SERUM, HYALURON_CREAM],
  },
  '19': {
    headingKey: 'recommendedSensitiveSkinRoutine',
    steps: [
      CLEANSE_GENTLE,
      MIST,
      step('routineAllForSensitiveSerumTitle', 'routineAllForSensitiveSerumDesc'),
      step('routineSkinBarrierCreamTitle', 'routineSkinBarrierCreamDesc'),
    ],
  },
  '20': {
    headingKey: 'recommendedProblemSkinRoutine',
    steps: [
      CLEANSE,
      step('routineProblemControlTonerTitle', 'routineProblemControlTonerDesc'),
      step('routineProblemControlSerumTitle', 'routineProblemControlSerumDesc'),
      step('routineProblemControlCreamTitle', 'routineProblemControlCreamDesc'),
      step('routineSoothingBombMaskTitle', 'routineSoothingBombMaskDescProblem'),
    ],
  },
  '21': BRIGHTENING([
    CLEANSE,
    BOOSTER,
    step('routineMultiVitaSerumTitle', 'routineMultiVitaSerumDesc'),
    step('routineMultiVitaCreamTitle', 'routineMultiVitaCreamDesc'),
    SUN_40,
  ]),
  '22': {
    headingKey: 'recommendedAntiAgingRoutine',
    steps: [
      CLEANSE,
      step('routineSnowBoosterTitle', 'routineSnowBoosterDescAntiAging'),
      step('routineAntiWrinkleSerumTitle', 'routineAntiWrinkleSerumDesc'),
      step('routineAntiWrinkleCreamTitle', 'routineAntiWrinkleCreamDesc'),
      step('routineCollagenMaskTitle', 'routineCollagenMaskDesc'),
    ],
  },

  // ── Creams ────────────────────────────────────────────────────────────
  '23': {
    headingKey: 'recommendedAntiAgingRoutine',
    steps: [
      CLEANSE,
      step('routineSnowBoosterTitle', 'routineSnowBoosterDescAntiAging'),
      step('routineAntiWrinkleSerumTitle', 'routineAntiWrinkleSerumDesc'),
      step('routineNDCellCreamTitle', 'routineNDCellCreamDesc'),
    ],
  },
  '25': {
    headingKey: 'recommendedRecoveryRoutine',
    steps: [
      CLEANSE_GENTLE,
      MIST,
      step('routinePostcreamTitle', 'routinePostcreamDesc'),
      step('routineSoothingBombMaskTitle', 'routineSoothingBombMaskDescSensitive'),
    ],
  },
  '27': {
    headingKey: 'recommendedSensitiveSkinRoutine',
    steps: [
      CLEANSE_GENTLE,
      MIST,
      step('routineAllForSensitiveSerumTitle', 'routineAllForSensitiveSerumDesc'),
      step('routineSkinBarrierCreamTitle', 'routineSkinBarrierCreamDesc'),
    ],
  },
  '28': {
    headingKey: 'recommendedDeepMoisturizingRoutine',
    steps: [
      CLEANSE_GENTLE,
      MIST,
      HYALURON_SERUM,
      step('routineHydroSoothingCreamTitle', 'routineHydroSoothingCreamDesc'),
    ],
  },
  '29': {
    headingKey: 'recommendedDeepMoisturizingRoutine',
    steps: [CLEANSE_GENTLE, MIST, HYALURON_SERUM, HYALURON_CREAM],
  },
  '30': {
    headingKey: 'recommendedProblemSkinRoutine',
    steps: [
      CLEANSE,
      step('routineProblemControlTonerTitle', 'routineProblemControlTonerDesc'),
      step('routineProblemControlSerumTitle', 'routineProblemControlSerumDesc'),
      step('routineProblemControlCreamTitle', 'routineProblemControlCreamDesc'),
      step('routineSoothingBombMaskTitle', 'routineSoothingBombMaskDescProblem'),
    ],
  },
  '31': BRIGHTENING([
    CLEANSE,
    BOOSTER,
    step('routineMultiVitaSerumTitle', 'routineMultiVitaSerumDesc'),
    step('routineMultiVitaCreamTitle', 'routineMultiVitaCreamDesc'),
    SUN_40,
  ]),
  '32': {
    headingKey: 'recommendedAntiAgingRoutine',
    steps: [
      CLEANSE,
      step('routineSnowBoosterTitle', 'routineSnowBoosterDescAntiAging'),
      step('routineAntiWrinkleSerumTitle', 'routineAntiWrinkleSerumDesc'),
      step('routineAntiWrinkleCreamTitle', 'routineAntiWrinkleCreamDesc'),
      step('routineCollagenMaskTitle', 'routineCollagenMaskDesc'),
    ],
  },

  // ── Masks ─────────────────────────────────────────────────────────────
  '34': {
    headingKey: 'recommendedDeepMoisturizingRoutine',
    steps: [
      CLEANSE_GENTLE,
      BOOSTER,
      HYALURON_SERUM,
      step('routineOvernightMaskTitle', 'routineOvernightMaskDesc'),
    ],
  },
  '35': {
    headingKey: 'recommendedDeepMoisturizingRoutine',
    steps: [
      CLEANSE_GENTLE,
      MIST,
      step('routineHydroCoolMaskTitle', 'routineHydroCoolMaskDesc'),
      HYALURON_CREAM,
    ],
  },
  '36': {
    headingKey: 'recommendedRecoveryRoutine',
    steps: [
      CLEANSE_GENTLE,
      MIST,
      step('routineSoothingBombMaskTitle', 'routineSoothingBombMaskDescSensitive'),
      step('routinePostcreamTitle', 'routinePostcreamDesc'),
    ],
  },
  '37': {
    headingKey: 'recommendedAntiAgingRoutine',
    steps: [
      CLEANSE,
      step('routinePeptideGelMaskTitle', 'routinePeptideGelMaskDesc'),
      step('routineAntiWrinkleSerumTitle', 'routineAntiWrinkleSerumDesc'),
      step('routineAntiWrinkleCreamTitle', 'routineAntiWrinkleCreamDesc'),
    ],
  },
  '38': {
    headingKey: 'recommendedRenewalRoutine',
    steps: [
      CLEANSE,
      step('routineEZCO2MaskTitle', 'routineEZCO2MaskDesc'),
      MIST,
      HYALURON_CREAM,
    ],
  },
  '51': {
    headingKey: 'recommendedRenewalRoutine',
    steps: [
      CLEANSE,
      step('routineBioFermentMaskTitle', 'routineBioFermentMaskDesc'),
      MIST,
      HYALURON_CREAM,
    ],
  },
  '52': {
    headingKey: 'recommendedRenewalRoutine',
    steps: [
      CLEANSE,
      step('routinePeelingGelTitle', 'routinePeelingGelDesc'),
      step('routinePDRNMaskTitle', 'routinePDRNMaskDesc'),
      HYALURON_CREAM,
    ],
  },
  '53': {
    headingKey: 'recommendedAntiAgingRoutine',
    steps: [
      CLEANSE,
      step('routineSnowBoosterTitle', 'routineSnowBoosterDescAntiAging'),
      step('routineCollagenMaskTitle', 'routineCollagenMaskDesc'),
      step('routineAntiWrinkleCreamTitle', 'routineAntiWrinkleCreamDesc'),
    ],
  },

  // ── Sun & BB ──────────────────────────────────────────────────────────
  '39': {
    headingKey: 'recommendedSunProtectionRoutine',
    steps: [CLEANSE, MIST, HYALURON_CREAM, SUN_50],
  },
  '40': {
    headingKey: 'recommendedSunProtectionRoutine',
    steps: [CLEANSE, MIST, HYALURON_CREAM, SUN_40],
  },
  '41': {
    headingKey: 'recommendedSkincareMakeupRoutine',
    steps: [
      CLEANSE,
      MIST,
      HYALURON_CREAM,
      step('routineBBCushionTitle', 'routineBBCushionDesc'),
      step('routineMakeupRemoverTitle', 'routineMakeupRemoverDesc'),
    ],
  },
  '42': {
    headingKey: 'recommendedSkincareMakeupRoutine',
    steps: [
      CLEANSE,
      MIST,
      HYALURON_CREAM,
      step('routineIntensiveBBTitle', 'routineIntensiveBBDesc'),
      step('routineMakeupRemoverTitle', 'routineMakeupRemoverDesc'),
    ],
  },

  // ── Hair & scalp ──────────────────────────────────────────────────────
  '3': {
    headingKey: 'recommendedHairCareRoutine',
    steps: [
      step('routineScalpShampooTitle', 'routineScalpShampooDesc'),
      step('routineHairSolutionTitle', 'routineHairSolutionDesc'),
      step('routineHairStampTitle', 'routineHairStampDesc'),
      step('routineHairGenBoosterTitle', 'routineHairGenBoosterDesc'),
    ],
  },
  '43': {
    headingKey: 'recommendedHairCareRoutine',
    steps: [
      step('routineScalpPeelingTitle', 'routineScalpPeelingDesc'),
      step('routineScalpShampooTitle', 'routineScalpShampooDesc'),
      step('routineHairTonicTitle', 'routineHairTonicDesc'),
      step('routineScalpBrushTitle', 'routineScalpBrushDesc'),
    ],
  },
  '44': {
    headingKey: 'recommendedHairCareRoutine',
    steps: [
      step('routineScalpPeelingTitle', 'routineScalpPeelingDesc'),
      step('routineScalpShampooTitle', 'routineScalpShampooDesc'),
      step('routineHairTonicTitle', 'routineHairTonicDesc'),
      step('routineScalpBrushTitle', 'routineScalpBrushDesc'),
    ],
  },
  '45': {
    headingKey: 'recommendedHairCareRoutine',
    steps: [
      step('routineScalpShampooTitle', 'routineScalpShampooDesc'),
      step('routineScalpPeelingTitle', 'routineScalpPeelingDesc'),
      step('routineHairSolutionTitle', 'routineHairSolutionDesc'),
      step('routineHairStampTitle', 'routineHairStampDesc'),
    ],
  },
  '46': {
    headingKey: 'recommendedHairCareRoutine',
    steps: [
      step('routineScalpPeelingTitle', 'routineScalpPeelingDesc'),
      step('routineScalpShampooTitle', 'routineScalpShampooDesc'),
      step('routineHairTonicTitle', 'routineHairTonicDesc'),
      step('routineScalpBrushTitle', 'routineScalpBrushDesc'),
    ],
  },
  '61': {
    headingKey: 'recommendedHairCareRoutine',
    steps: [
      step('routineScalpShampooTitle', 'routineScalpShampooDesc'),
      step('routineHairTonicTitle', 'routineHairTonicDesc'),
      step('routineScalpBrushTitle', 'routineScalpBrushDesc'),
    ],
  },
  '64': {
    headingKey: 'recommendedHairCareRoutine',
    steps: [
      step('routineScalpShampooTitle', 'routineScalpShampooDesc'),
      step('routineHairSolutionTitle', 'routineHairSolutionDesc'),
      step('routineHairStampTitle', 'routineHairStampDesc'),
      step('routineHairGenBoosterTitle', 'routineHairGenBoosterDesc'),
    ],
  },

  // ── Retail kits — how the components work together ───────────────────
  '47': {
    headingKey: 'recommendedHairCareRoutine',
    steps: [
      step('routineScalpShampooTitle', 'routineScalpShampooDesc'),
      step('routineScalpPeelingTitle', 'routineScalpPeelingDesc'),
      step('routineHairSolutionTitle', 'routineHairSolutionDesc'),
      step('routineHairStampTitle', 'routineHairStampDesc'),
    ],
  },
  '50': {
    headingKey: 'recommendedEyeCareRoutine',
    steps: [
      CLEANSE,
      step('routineEyeSerumTitle', 'routineEyeSerumDesc'),
      step('routineEyeCreamTitle', 'routineEyeCreamDesc'),
      step('routineEyePatchTitle', 'routineEyePatchDesc'),
    ],
  },

  // ── Microneedling home care ───────────────────────────────────────────
  '1': {
    headingKey: 'recommendedMicroneedlingRoutine',
    steps: [
      CLEANSE,
      step('routineMicroneedleRollerTitle', 'routineMicroneedleRollerDesc'),
      step('routinePDRNAmpouleTitle', 'routinePDRNAmpouleDesc'),
      step('routinePostcreamTitle', 'routinePostcreamDesc'),
    ],
  },
  '65': {
    headingKey: 'recommendedMicroneedlingRoutine',
    steps: [
      CLEANSE,
      step('routineMicroneedleRollerTitle', 'routineMicroneedleRollerDesc'),
      step('routinePDRNAmpouleTitle', 'routinePDRNAmpouleDesc'),
      step('routinePostcreamTitle', 'routinePostcreamDesc'),
    ],
  },
}
