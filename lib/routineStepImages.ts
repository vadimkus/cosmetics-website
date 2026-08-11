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
  '1': '/images/genosys-microneedling-devices.jpg',
  '3': '/images/Booster.jpg',
  '10': '/images/cleanser/Main.jpg',
  '11': '/images/remover/Main2.jpg',
  '12': '/images/epi/main.jpeg',
  '14': '/images/mist/main2.jpeg',
  '15': '/images/problem/Main.jpg',
  '16': '/images/Second/main_booster.jpg',
  '17': '/images/eye_serum/main.jpeg',
  '18': '/images/hyaluron_serum/main.jpeg',
  '19': '/images/sensitive_serum/main.jpeg',
  '20': '/images/problems_serum/main.jpeg',
  '21': '/images/radiance_serum/main.jpeg',
  '22': '/images/multif_serum/main.jpeg',
  '23': '/images/ND.jpg',
  '24': '/images/eye_cream/main.jpeg',
  '25': '/images/SRC.jpg',
  '27': '/images/skin_barr/main.jpeg',
  '28': '/images/HSC.jpg',
  '29': '/images/hyaluron/main.jpeg',
  '30': '/images/problem_cream/main.jpeg',
  '31': '/images/radiance/main.jpeg',
  '32': '/images/multifunc_cream/main.jpeg',
  '33': '/images/patch/main.jpeg',
  '34': '/images/overnight/main.jpeg',
  '35': '/images/HYDR.jpg',
  '36': '/images/sea_algae/Main.jpeg',
  '37': '/images/peptide_mask/main.jpeg',
  '38': '/images/ez_mask/main.jpeg',
  '39': '/images/ultra/main.jpeg',
  '40': '/images/sun/main.jpeg',
  '41': '/images/cushion_2/main.jpeg',
  '42': '/images/BLEM.jpg',
  '43': '/images/hair_tonic/main-v2.jpeg',
  '44': '/images/shampoo/Main.jpg',
  '45': '/images/HHR.jpg',
  '46': '/images/scal.jpg',
  '51': '/images/bio_ferment/bferment_main.jpg',
  '52': '/images/pdrn_mask/main.jpeg',
  '53': '/images/collagen_mask/Main.jpeg',
  '60': '/images/6000/main.jpg',
  '61': '/images/brush/main.jpg',
  '63': '/images/revita/main.jpg',
  '64': '/images/needles/main.jpeg',
  '65': '/images/meso_5000/main.jpg',
  '66': '/images/cera/main2.jpeg',
}

/** Returns the step product's main image path (e.g. /images/mist/main.jpeg) or null. */
export function getRoutineStepImage(titleKey: string): string | null {
  const pid = ROUTINE_STEP_PRODUCT_IDS[titleKey]
  if (!pid) return null
  return ROUTINE_STEP_IMAGE_BY_PRODUCT_ID[pid] || null
}
