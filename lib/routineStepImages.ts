/**
 * Resolves a routine-step i18n title key to the product's main image so the
 * "Recommended Routine" cards (web PDP + mobile app via API) can show a
 * thumbnail preview next to each step.
 *
 * Paths mirror the current database `Product.image` values. Keeping the map
 * explicit prevents a stale legacy `lib/products.ts` entry from overriding a
 * newer canonical main image.
 */
import { ROUTINE_STEP_PRODUCT_IDS } from '@/lib/routineStepLinks'

// Audited against the production product table on 2026-08-08.
export const ROUTINE_STEP_IMAGE_BY_PRODUCT_ID: Readonly<Record<string, string>> = {
  '1': '/images/roller_campaign/main.jpg',
  '69': '/images/eyeroller_art/main.jpg',
  '3': '/images/Booster.jpg',
  '6': '/images/cts_campaign/main.jpg',
  '10': '/images/snowo2_campaign/main.jpg',
  '11': '/images/defender_0/Main.jpeg',
  '12': '/images/epi_peel_o/Main.jpeg',
  '14': '/images/mist_0/Main.jpeg',
  '15': '/images/pct_campaign/main.jpg',
  '16': '/images/Second/main_booster.jpg',
  '17': '/images/eye_serum/main.jpeg',
  '18': '/images/hsserum_v2/main.jpg',
  '19': '/images/sensitive_serum/main-v2.jpg',
  '20': '/images/problems_serum/main-v2.jpg',
  '21': '/images/radiance_serum/main-v2.jpg',
  '22': '/images/multif_serum/main-v2.jpg',
  '23': '/images/nd_cell_o/Main.jpeg',
  '24': '/images/eye_cream/main.jpeg',
  '25': '/images/soothing_rep_o/Main.jpeg',
  '27': '/images/skin_barr/main.jpeg',
  '28': '/images/hydro_soothing_o/Main.jpeg',
  '29': '/images/mhcream_campaign/main.jpg',
  '30': '/images/problem_cream/main.jpeg',
  '31': '/images/radiance/main-v2.jpg',
  '32': '/images/multifunc_cream/main-v2.jpg',
  '33': '/images/patch/main.jpeg',
  '34': '/images/overnight/main-v2.jpeg',
  '35': '/images/hydro_o/Main.jpeg',
  '36': '/images/seaalgae_campaign/main.jpg',
  '37': '/images/peptide_mask/main.jpeg',
  '38': '/images/ez_mask/main.jpeg',
  '39': '/images/ultra/main-v4.jpg',
  '40': '/images/multisun_campaign/main.jpg',
  '41': '/images/cushion_campaign/main.jpg',
  '42': '/images/blemish_o/Main.jpeg',
  '43': '/images/tonic_campaign/main.jpg',
  '44': '/images/shampoo_o/Main.jpeg',
  '45': '/images/hair_sol_o/Main.jpeg',
  '46': '/images/scal.jpg',
  '51': '/images/bio_ferment2/main.jpeg',
  '52': '/images/pdrn_mask/main.jpeg',
  '53': '/images/collagen_mask/Main.jpeg',
  '60': '/images/6000/main-v2.jpg',
  '61': '/images/brush_o/Main2.jpeg',
  '63': '/images/revita/main.jpg',
  '64': '/images/needles/main.jpeg',
  '65': '/images/pdrn_5000_new/main2c.jpg',
  '66': '/images/cera/main3.jpeg',
}

/** Returns the step product's main image path (e.g. /images/mist/main.jpeg) or null. */
export function getRoutineStepImage(titleKey: string): string | null {
  const pid = ROUTINE_STEP_PRODUCT_IDS[titleKey]
  if (!pid) return null
  return ROUTINE_STEP_IMAGE_BY_PRODUCT_ID[pid] || null
}
