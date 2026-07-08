/**
 * Maps routine-step i18n title keys (product.routine*Title) to product IDs so
 * the "Recommended Routine" cards on PDPs can deep-link each step to its
 * product page. IDs verified against the live catalog on 2026-07-08.
 */
export const ROUTINE_STEP_PRODUCT_IDS: Record<string, string> = {
  routineSnowO2Title: '10',
  routineSnowBoosterTitle: '16',
  routineMultiVitaSerumTitle: '21',
  routineMultiVitaCreamTitle: '31',
  routinePeelingGelTitle: '12',
  routineSoothingBombMaskTitle: '36',
  routineProblemControlTonerTitle: '15',
  routineProblemControlSerumTitle: '20',
  routineProblemControlCreamTitle: '30',
  routineBBCushionTitle: '41',
  routineMakeupRemoverTitle: '11',
  routineOvernightMaskTitle: '34',
  routineAntiWrinkleSerumTitle: '22',
  routineAntiWrinkleCreamTitle: '32',
  routineCollagenMaskTitle: '53',
  routineHyaluronSerumTitle: '18',
  routineHyaluronCreamTitle: '29',
  routineAllForSensitiveSerumTitle: '19',
  routineSkinBarrierCreamTitle: '27',
  routineEGFOxymaskTitle: '26',
  routineRevitaGlowBBTitle: '63',
  routineCerabarrierCleanserTitle: '66',
  routineMicrobiomeMistTitle: '14',
  routineMultiSunCreamTitle: '40',
}
