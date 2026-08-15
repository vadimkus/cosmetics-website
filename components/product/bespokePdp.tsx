import type { Product } from '@/types'
import { PRODUCT_ROUTINES } from '@/lib/productRoutines'
import { ROUTINE_STEP_PRODUCT_IDS } from '@/lib/routineStepLinks'
import { getProductsByNumbers } from '@/lib/productsDb'

import BeautyBoxProductPage from '@/components/product/beautybox/BeautyBoxProductPage'
import type { BeautyBoxNumber } from '@/components/product/beautybox/beautyBoxes'
import CerabarrierProductPage from '@/components/product/cerabarrier/CerabarrierProductPage'
import CollagenMaskProductPage from '@/components/product/collagenmask/CollagenMaskProductPage'
import BioMesoProductPage from '@/components/product/biomeso/BioMesoProductPage'
import BioMesoExpertProductPage from '@/components/product/biomeso/BioMesoExpertProductPage'
import HairStampProductPage from '@/components/product/hairstamp/HairStampProductPage'
import PdrnMaskProductPage from '@/components/product/pdrnmask/PdrnMaskProductPage'
import AfsProductPage from '@/components/product/afs/AfsProductPage'
import BioFermentProductPage from '@/components/product/bioferment/BioFermentProductPage'
import EpiProductPage from '@/components/product/epi/EpiProductPage'
import EyeCreamProductPage from '@/components/product/eyecream/EyeCreamProductPage'
import EzCo2ProductPage from '@/components/product/ezco2/EzCo2ProductPage'
import CvsProductPage from '@/components/product/powersolution/CvsProductPage'
import HesProductPage from '@/components/product/powersolution/HesProductPage'
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
  // 4 and 5 are two of the six professional Power Solution ampoules. They share
  // one layout and differ only by variant; see powerSolutionCopy.ts.
  '4': HesProductPage,
  '5': CvsProductPage,
  // 19 is the sensitive-skin serum. Single SKU, no deck, no efficacy study;
  // the page is built on the artwork sentence and MultiEx BSASM Plus at 1%.
  // 12 is the enzyme + cellulose peeling gel. Cellulose 3% is the roll;
  // papaya and moringa sit at trace. No clinical percentages.
  '12': EpiProductPage,
  // 24 is the daily EyeCell cream. Arbutin 2% is the figure on the card;
  // peptides sit at cosmetic trace. No clinical percentages.
  '24': EyeCreamProductPage,
  // 38 is the two-part carboxy kit. Sodium bicarbonate 9% in the sheet
  // plus an acidic gel. Ten minutes. No clinical percentages.
  '38': EzCo2ProductPage,
  '19': AfsProductPage,
  // 51 is the Bio-Ferment powder modeling mask. DTS MG deck + clinical
  // hydration trial; no safety assessment. The page is built on the
  // diatomaceous-earth set, not on the six peptides at 1 ppb.
  '51': BioFermentProductPage,
  // 52 and 53 are both masks but share no layout: 52 has a clinical study and a
  // Korean functional licence to build on, 53 has neither.
  '52': PdrnMaskProductPage,
  '53': CollagenMaskProductPage,
  // 55 to 59 are beauty boxes: one layout, configured in beautyBoxes.ts.
  '55': BeautyBoxProductPage,
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
  const key = (product.productNumber || product.id) as BespokeProductNumber | undefined
  if (!key || !allowed.includes(key)) return null
  return BESPOKE_PDP_LAYOUTS[key] ?? null
}

/**
 * Products whose cross-sell is not a retail routine.
 *
 * PRODUCT_ROUTINES only covers the retail line; the professional Power Solution
 * ampoules are deliberately absent from it, because a routine that tells a
 * shopper to layer a clinic ampoule at home is the wrong advice. What those
 * pages cross-sell instead is the rest of their own range, since choosing
 * between the six vials IS the decision a buyer is making.
 */
const BESPOKE_COMPANIONS: Record<string, readonly string[]> = {
  // The other five Power Solutions, for the range table on each ampoule's page.
  '4': ['5', '6', '7', '8', '9'],
  '5': ['4', '6', '7', '8', '9'],
}

/**
 * The bespoke layouts add companion products straight to the bag, so they need
 * real price and stock records. Resolved on the server so the cross-sell is
 * render-complete on first paint rather than popping in after hydration.
 */
export async function getRoutineProducts(productNumber: string): Promise<Product[]> {
  const companions = BESPOKE_COMPANIONS[productNumber]
  if (companions) return getProductsByNumbers([...companions])

  const numbers = (PRODUCT_ROUTINES[productNumber]?.steps ?? [])
    .map(step => ROUTINE_STEP_PRODUCT_IDS[step.titleKey])
    .filter((n): n is string => Boolean(n))
  return numbers.length ? getProductsByNumbers(numbers) : []
}
