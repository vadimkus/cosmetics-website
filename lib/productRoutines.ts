/**
 * Data-driven "Recommended Routine" cards for PDPs.
 *
 * Each routine is tailored to the product: the product itself sits at its
 * natural step in a real GENOSYS regimen, surrounded by the products it is
 * designed to combine with. Steps reference i18n keys under `product.*` and
 * deep-link via ROUTINE_STEP_PRODUCT_IDS (lib/routineStepLinks.ts).
 *
 * This is the single source of truth for every PDP routine, including beauty
 * boxes, Revita Glow 63, and Cerabarrier 66. Website and mobile API render the
 * same definitions.
 * Professional clinic lines (Power Solutions, SRS, devices 48/49) are excluded.
 * Bio Meso Expert 60000 (60) is included — retail SKU with a clinic protocol card.
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
      step('routineSoothingBombMaskTitle', 'routineSoothingBombMaskDescProblem'),
      step('routineProblemControlSerumTitle', 'routineProblemControlSerumDesc'),
      step('routineProblemControlCreamTitle', 'routineProblemControlCreamDesc'),
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
      step('routineEyePatchTitle', 'routineEyePatchDesc'),
      step('routineEyeSerumTitle', 'routineEyeSerumDesc'),
      step('routineEyeCreamTitle', 'routineEyeCreamDesc'),
    ],
  },
  '24': {
    headingKey: 'recommendedEyeCareRoutine',
    steps: [
      CLEANSE,
      step('routineEyePatchTitle', 'routineEyePatchDesc'),
      step('routineEyeSerumTitle', 'routineEyeSerumDesc'),
      step('routineEyeCreamTitle', 'routineEyeCreamDesc'),
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
      step('routineSoothingBombMaskTitle', 'routineSoothingBombMaskDescProblem'),
      step('routineProblemControlSerumTitle', 'routineProblemControlSerumDesc'),
      step('routineProblemControlCreamTitle', 'routineProblemControlCreamDesc'),
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
      step('routineCollagenMaskTitle', 'routineCollagenMaskDesc'),
      step('routineAntiWrinkleSerumTitle', 'routineAntiWrinkleSerumDesc'),
      step('routineAntiWrinkleCreamTitle', 'routineAntiWrinkleCreamDesc'),
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
      step('routineSoothingBombMaskTitle', 'routineSoothingBombMaskDescSensitive'),
      step('routinePostcreamTitle', 'routinePostcreamDesc'),
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
      step('routineSoothingBombMaskTitle', 'routineSoothingBombMaskDescProblem'),
      step('routineProblemControlSerumTitle', 'routineProblemControlSerumDesc'),
      step('routineProblemControlCreamTitle', 'routineProblemControlCreamDesc'),
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
      step('routineCollagenMaskTitle', 'routineCollagenMaskDesc'),
      step('routineAntiWrinkleSerumTitle', 'routineAntiWrinkleSerumDesc'),
      step('routineAntiWrinkleCreamTitle', 'routineAntiWrinkleCreamDesc'),
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
    headingKey: 'recommendedRecoveryRoutine',
    steps: [
      CLEANSE_GENTLE,
      MIST,
      step('routinePeptideGelMaskTitle', 'routinePeptideGelMaskDesc'),
      step('routinePostcreamTitle', 'routinePostcreamDesc'),
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
    ],
  },
  '42': {
    headingKey: 'recommendedSkincareMakeupRoutine',
    steps: [
      CLEANSE,
      MIST,
      HYALURON_CREAM,
      step('routineIntensiveBBTitle', 'routineIntensiveBBDesc'),
    ],
  },

  // ── Hair & scalp ──────────────────────────────────────────────────────
  '3': {
    headingKey: 'recommendedHairCareRoutine',
    steps: [
      step('routineScalpShampooTitle', 'routineScalpShampooDesc'),
      step('routineHairStampTitle', 'routineHairStampDesc'),
      step('routineHairSolutionTitle', 'routineHairSolutionDesc'),
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
      step('routineScalpPeelingTitle', 'routineScalpPeelingDesc'),
      step('routineScalpShampooTitle', 'routineScalpShampooDesc'),
      step('routineHairStampTitle', 'routineHairStampDesc'),
      step('routineHairSolutionTitle', 'routineHairSolutionDesc'),
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
  /* The brush sits second, immediately after the shampoo, because DTS MG's own
     instruction is to use the two together in the shower: "apply shampoo to
     create sufficient lather. Massage scalp with the brush." Listing the brush
     last, after the leave-on tonic, implied a dry post-tonic massage that no
     manufacturer document describes. */
  '61': {
    headingKey: 'recommendedHairCareRoutine',
    steps: [
      step('routineScalpPeelingTitle', 'routineScalpPeelingDesc'),
      step('routineScalpShampooTitle', 'routineScalpShampooDesc'),
      step('routineScalpBrushTitle', 'routineScalpBrushDesc'),
      step('routineHairTonicTitle', 'routineHairTonicDesc'),
    ],
  },
  '64': {
    headingKey: 'recommendedHairCareRoutine',
    steps: [
      step('routineScalpShampooTitle', 'routineScalpShampooDesc'),
      step('routineHairStampTitle', 'routineHairStampDesc'),
      step('routineHairSolutionTitle', 'routineHairSolutionDesc'),
      step('routineHairGenBoosterTitle', 'routineHairGenBoosterDesc'),
    ],
  },

  // ── Retail kits — how the components work together ───────────────────
  '47': {
    headingKey: 'recommendedHairCareRoutine',
    steps: [
      step('routineScalpPeelingTitle', 'routineScalpPeelingDesc'),
      step('routineScalpShampooTitle', 'routineScalpShampooDesc'),
      step('routineHairStampTitle', 'routineHairStampDesc'),
      step('routineHairSolutionTitle', 'routineHairSolutionDesc'),
    ],
  },
  '50': {
    headingKey: 'recommendedEyeCareRoutine',
    steps: [
      CLEANSE,
      step('routineEyePatchTitle', 'routineEyePatchDesc'),
      step('routineEyeSerumTitle', 'routineEyeSerumDesc'),
      step('routineEyeCreamTitle', 'routineEyeCreamDesc'),
    ],
  },

  // ── Microneedling / Bio-Meso ──────────────────────────────────────────
  // NEVER pair microneedle roller with Bio-Meso spicule ampoules (60/65).
  '1': {
    headingKey: 'recommendedMicroneedlingRoutine',
    steps: [
      CLEANSE,
      step('routineMicroneedleRollerTitle', 'routineMicroneedleRollerDesc'),
      step('routineHyaluronSerumTitle', 'routineHyaluronSerumDescMicroneedling'),
      step('routinePostcreamTitle', 'routinePostcreamDesc'),
    ],
  },
  '60': {
    headingKey: 'recommendedBioMesoRoutine',
    steps: [
      CLEANSE,
      step('routineBioMesoExpertTitle', 'routineBioMesoExpertDesc'),
      step('routinePDRNMaskTitle', 'routinePDRNMaskDesc'),
      step('routinePostcreamTitle', 'routinePostcreamDesc'),
    ],
  },
  '65': {
    headingKey: 'recommendedBioMesoRoutine',
    steps: [
      CLEANSE,
      step('routinePDRNAmpouleTitle', 'routinePDRNAmpouleDesc'),
      step('routinePDRNMaskTitle', 'routinePDRNMaskDesc'),
      step('routinePostcreamTitle', 'routinePostcreamDesc'),
    ],
  },

  // ── Beauty boxes ──────────────────────────────────────────────────────
  // These are practical use sequences, not exhaustive box inventories.
  // Optional masks sit before leave-on serums/creams; incompatible AM/PM
  // products are not forced into one linear routine.
  '55': {
    headingKey: 'recommendedProblemSkinRoutine',
    steps: [
      CLEANSE,
      step('routineProblemControlTonerTitle', 'routineProblemControlTonerDesc'),
      step('routineSoothingBombMaskTitle', 'routineSoothingBombMaskDescProblem'),
      step('routineProblemControlSerumTitle', 'routineProblemControlSerumDesc'),
      step('routineProblemControlCreamTitle', 'routineProblemControlCreamDesc'),
    ],
  },
  '56': {
    headingKey: 'recommendedSkinBrighteningRoutine',
    steps: [
      CLEANSE,
      step('routinePeelingGelTitle', 'routinePeelingGelDesc'),
      BOOSTER,
      step('routineSoothingBombMaskTitle', 'routineSoothingBombMaskDescBrightening'),
      step('routineMultiVitaSerumTitle', 'routineMultiVitaSerumDesc'),
      step('routineMultiVitaCreamTitle', 'routineMultiVitaCreamDesc'),
    ],
  },
  /* All five items the Charming Look box actually contains. The remover and the
     overnight mask were missing, which mattered once the box page started
     deriving its contents list and its saving from this routine: three of five
     products would have priced a five-product box.
     Order follows the two rules the catalogue keeps everywhere: a remover comes
     before the cleanser, and complexion make-up is the last step. The overnight
     mask therefore sits with the treatments, which is the same compromise every
     mixed morning-and-evening routine in this file makes. */
  '57': {
    headingKey: 'recommendedSkincareMakeupRoutine',
    steps: [
      step('routineMakeupRemoverTitle', 'routineMakeupRemoverDesc'),
      CLEANSE,
      step('routineSnowBoosterTitle', 'routineSnowBoosterDescMakeup'),
      step('routineOvernightMaskTitle', 'routineOvernightMaskDesc'),
      step('routineBBCushionTitle', 'routineBBCushionDesc'),
    ],
  },
  '58': {
    headingKey: 'recommendedAntiAgingRoutine',
    steps: [
      CLEANSE,
      step('routineSnowBoosterTitle', 'routineSnowBoosterDescAntiAging'),
      step('routineCollagenMaskTitle', 'routineCollagenMaskDesc'),
      step('routineAntiWrinkleSerumTitle', 'routineAntiWrinkleSerumDesc'),
      step('routineAntiWrinkleCreamTitle', 'routineAntiWrinkleCreamDesc'),
    ],
  },
  '59': {
    headingKey: 'recommendedDeepMoisturizingRoutine',
    steps: [
      CLEANSE,
      step('routineSnowBoosterTitle', 'routineSnowBoosterDescMoisturizing'),
      step('routineSoothingBombMaskTitle', 'routineSoothingBombMaskDesc'),
      HYALURON_SERUM,
      HYALURON_CREAM,
    ],
  },
  /* The overnight cream mask joined this routine on 17 Aug 2026, when it replaced
     the discontinued EGF Repair Oxymask in the Sensitive Skin box. It also has to
     be here for the box page itself: BeautyBoxProductPage looks its six members up
     through getRoutineProducts, so an item missing from this list would render
     without a live price or stock state. */
  '62': {
    headingKey: 'recommendedSensitiveSkinRoutine',
    steps: [
      CLEANSE,
      step('routineSnowBoosterTitle', 'routineSnowBoosterDescSensitive'),
      step('routineSoothingBombMaskTitle', 'routineSoothingBombMaskDescSensitive'),
      step('routineAllForSensitiveSerumTitle', 'routineAllForSensitiveSerumDesc'),
      step('routineSkinBarrierCreamTitle', 'routineSkinBarrierCreamDesc'),
      step('routineOvernightMaskTitle', 'routineOvernightMaskDesc'),
    ],
  },

  // ── BB and barrier care ───────────────────────────────────────────────
  '63': {
    headingKey: 'recommendedRevitaGlowRoutine',
    steps: [
      CLEANSE,
      step('routineSnowBoosterTitle', 'routineSnowBoosterDescRevitaGlow'),
      step('routineMultiVitaSerumTitle', 'routineMultiVitaSerumDesc'),
      step('routineHyaluronCreamTitle', 'routineHyaluronCreamDescRevitaGlow'),
      step('routineRevitaGlowBBTitle', 'routineRevitaGlowBBDesc'),
    ],
  },
  '66': {
    headingKey: 'recommendedBarrierCareRoutine',
    steps: [
      CLEANSE_GENTLE,
      MIST,
      step('routineAllForSensitiveSerumTitle', 'routineAllForSensitiveSerumDesc'),
      step('routineSkinBarrierCreamTitle', 'routineSkinBarrierCreamDesc'),
      SUN_40,
    ],
  },
}
