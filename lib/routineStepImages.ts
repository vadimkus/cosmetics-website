/**
 * Resolves a routine-step i18n title key to the product's main image so the
 * "Recommended Routine" cards (web PDP + mobile app via API) can show a
 * thumbnail preview next to each step.
 *
 * Images come from the static catalog (lib/products.ts), which is kept in
 * sync with the DB main images — same source the PDP gallery falls back to.
 */
import { products } from '@/lib/products'
import { ROUTINE_STEP_PRODUCT_IDS } from '@/lib/routineStepLinks'

// Newer DB-only products that never made it into the static catalog
// (verified against the live DB on 2026-07-12).
const IMAGE_BY_ID: Record<string, string> = {
  '53': '/images/collagen_mask/Main.jpeg', // Intensive Repair Collagen Mask
  '66': '/images/cera/main2.jpeg', // Cerabarrier Biome Gel Cleanser
}
for (const p of products) {
  const img = typeof p.image === 'string' && p.image.trim() ? p.image.trim() : ''
  if (!img) continue
  if (p.id) IMAGE_BY_ID[String(p.id)] = img
  if (p.productNumber) IMAGE_BY_ID[String(p.productNumber)] = img
}

/** Returns the step product's main image path (e.g. /images/mist/main.jpeg) or null. */
export function getRoutineStepImage(titleKey: string): string | null {
  const pid = ROUTINE_STEP_PRODUCT_IDS[titleKey]
  if (!pid) return null
  return IMAGE_BY_ID[pid] || null
}
