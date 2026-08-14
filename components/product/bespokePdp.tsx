import type { Product } from '@/types'
import { PRODUCT_ROUTINES } from '@/lib/productRoutines'
import { ROUTINE_STEP_PRODUCT_IDS } from '@/lib/routineStepLinks'
import { getProductsByNumbers } from '@/lib/productsDb'

import BeautyBoxProductPage from '@/components/product/beautybox/BeautyBoxProductPage'
import type { BeautyBoxNumber } from '@/components/product/beautybox/beautyBoxes'
import CerabarrierProductPage from '@/components/product/cerabarrier/CerabarrierProductPage'
import BioMesoProductPage from '@/components/product/biomeso/BioMesoProductPage'
import BioMesoExpertProductPage from '@/components/product/biomeso/BioMesoExpertProductPage'
import HairStampProductPage from '@/components/product/hairstamp/HairStampProductPage'
import RevitaGlowProductPage from '@/components/product/revitaglow/RevitaGlowProductPage'
import ScalpBrushProductPage from '@/components/product/scalpbrush/ScalpBrushProductPage'

/**
 * A handful of products have bespoke editorial layouts instead of the shared
 * PDP. Both currently ship in all three languages, but the route files stay in
 * charge of *which* products they opt in, so a layout can be rolled out to
 * English first without the localized routes having to change.
 *
 * Every layout takes the same props, so a route only has to pick a component
 * and hand it the routine products.
 */
export const BESPOKE_PDP_LAYOUTS = {
  // 57, 58 and 59 are beauty boxes: one layout, configured in beautyBoxes.ts.
  '56': BeautyBoxProductPage,
  '57': BeautyBoxProductPage,
  '58': BeautyBoxProductPage,
  '59': BeautyBoxProductPage,
  // 60 and 65 are the same Bio-Meso layout with different configuration.
  '60': BioMesoExpertProductPage,
  '61': ScalpBrushProductPage,
  '63': RevitaGlowProductPage,
  '64': HairStampProductPage,
  '65': BioMesoProductPage,
  '66': CerabarrierProductPage,
} as const

export type BespokeProductNumber = keyof typeof BESPOKE_PDP_LAYOUTS

/**
 * Every box registered in beautyBoxes.ts must appear above, because
 * BeautyBoxProductPage reads its copy and palette from that registry and has no
 * fallback if the entry is missing. Registering a box without adding it here is
 * a compile error rather than a blank page.
 */
type Routed<T extends BespokeProductNumber> = T
export type RoutedBeautyBoxNumber = Routed<BeautyBoxNumber>

export function getBespokePdpLayout(
  product: Product,
  allowed: readonly BespokeProductNumber[]
) {
  const key = product.productNumber as BespokeProductNumber | undefined
  if (!key || !allowed.includes(key)) return null
  return BESPOKE_PDP_LAYOUTS[key] ?? null
}

/**
 * The bespoke layouts add routine products straight to the bag, so they need
 * real price and stock records. Resolved on the server so the cross-sell is
 * render-complete on first paint rather than popping in after hydration.
 */
export async function getRoutineProducts(productNumber: string): Promise<Product[]> {
  const numbers = (PRODUCT_ROUTINES[productNumber]?.steps ?? [])
    .map(step => ROUTINE_STEP_PRODUCT_IDS[step.titleKey])
    .filter((n): n is string => Boolean(n))
  return numbers.length ? getProductsByNumbers(numbers) : []
}
