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
import SnowO2ProductPage from '@/components/product/snowo2/SnowO2ProductPage'
import RemoverProductPage from '@/components/product/remover/RemoverProductPage'
import SrsProductPage from '@/components/product/srs/SrsProductPage'
import MistProductPage from '@/components/product/mist/MistProductPage'
import PctTonerProductPage from '@/components/product/pcttoner/PctTonerProductPage'
import BoosterProductPage from '@/components/product/booster/BoosterProductPage'
import HsserumProductPage from '@/components/product/hsserum/HsserumProductPage'
import EyeCreamProductPage from '@/components/product/eyecream/EyeCreamProductPage'
import EyePatchProductPage from '@/components/product/eyepatch/EyePatchProductPage'
import EyeSerumProductPage from '@/components/product/eyeserum/EyeSerumProductPage'
import EyeKitProductPage from '@/components/product/eyekit/EyeKitProductPage'
import OvernightProductPage from '@/components/product/overnight/OvernightProductPage'
import HydroCoolProductPage from '@/components/product/hydrocool/HydroCoolProductPage'
import PeptideGelProductPage from '@/components/product/peptidegel/PeptideGelProductPage'
import EzCo2ProductPage from '@/components/product/ezco2/EzCo2ProductPage'
import CvsProductPage from '@/components/product/powersolution/CvsProductPage'
import HesProductPage from '@/components/product/powersolution/HesProductPage'
import SwsProductPage from '@/components/product/powersolution/SwsProductPage'
import AwsProductPage from '@/components/product/powersolution/AwsProductPage'
import CtsProductPage from '@/components/product/powersolution/CtsProductPage'
import PcsProductPage from '@/components/product/powersolution/PcsProductPage'
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
  // 4 to 9 are the six professional Power Solution ampoules.
  // They share one layout and differ only by variant; see powerSolutionCopy.ts.
  '4': HesProductPage,
  '5': CvsProductPage,
  '6': CtsProductPage,
  '7': PcsProductPage,
  '8': SwsProductPage,
  '9': AwsProductPage,
  // 10 is the dry-skin oxygen-bubble cleanser. Ether 8% is the figure on
  // the card. Phytolex and MultiEx sit at cosmetic trace. No clinical
  // percentages. Not oxygen therapy.
  '10': SnowO2ProductPage,
  // 11 is the biphasic lip-and-eye makeup remover. The oil layer is
  // nearly half the bottle. Shake, hold a few seconds, wipe. Vitamins
  // and peptides sit at cosmetic trace. Not a face wash.
  '11': RemoverProductPage,
  // 19 is the sensitive-skin serum. Single SKU, no deck, no efficacy study;
  // the page is built on the artwork sentence and MultiEx BSASM Plus at 1%.
  // 12 is the enzyme + cellulose peeling gel. Cellulose 3% is the roll;
  // papaya and moringa sit at trace. No clinical percentages.
  '12': EpiProductPage,
  // 13 is the professional AHA peel. Glycolic 15%, lactic 13.5%,
  // mandelic 2%. Apply, 15-20 min, cold rinse. Peptide at 0.1 ppb.
  // No home routine. Not Epi.
  '13': SrsProductPage,
  // 14 is the sprayable shea emulsion mist. Shea 1.2% is the figure
  // on the card. FENSEBIOME and the hyaluronan complex sit at
  // cosmetic trace. Shake, 10-20 cm, over makeup. Not a water toner.
  '14': MistProductPage,
  // 15 is the oil-control toner. Zinc PCA 0.5% is the figure on the
  // card. Apply or spray AM/PM. 200 ml is the 360° back spray.
  // Salicylic acid is 0.001%. Copper peptide is not in the INCI.
  '15': PctTonerProductPage,
  // 16 is the daily hydration toner. Betaine 3% is the figure on the
  // card. Apply or spray AM/PM, over makeup. Phytolex is a 0.5%
  // premix. Not the oil-control toner. Not the mist.
  '16': BoosterProductPage,
  // 18 is the moisturizing hyaluron serum. Hydrolyzed HA 2,000 ppm is
  // the figure on the card. Apply and pat AM/PM. Coconut water is 0.80%.
  // Not the cream. Not a 4-step electrolyte story. Not +52%.
  '18': HsserumProductPage,
  // 17 is the first-layer EyeCell serum. Arbutin 2% is the figure on the
  // card; peptides sit at cosmetic trace. No clinical percentages.
  '17': EyeSerumProductPage,
  // 50 is the registered four-piece EyeCell kit. Serum + 0.25mm eye
  // roller, patches 20-40 min, then cream. Not a beauty box. The roller
  // is not product 1.
  '50': EyeKitProductPage,
  // 33 is the take-off EyeCell hydrogel mask. Niacinamide 2% is the
  // figure on the card; the peptide sits at 46.5 ppb. No clinical
  // percentages.
  '33': EyePatchProductPage,
  // 34 is the leave-on overnight cream mask. Niacinamide 2% is the
  // figure on the card; oxygen and the growth-factor list print at 0%.
  // Four-week TEWL / erythema figures come from the DTS MG deck.
  '34': OvernightProductPage,
  // 35 is the clinic-kilo cooling alginate. Diatomaceous earth 65% is
  // the pouch. Mix 30g at 1 : 0.8, peel after 15-20 min. HA / ceramide
  // / centella sit at 0.01%. No clinical deck on file.
  '35': HydroCoolProductPage,
  // 37 is the face hydrogel sheet. Glycerin 20% is the figure on the
  // card. Acetyl Hexapeptide-8 sits at 0.05 ppm. Sit 20-40 min, take
  // the sheet off, massage the leftover in. No clinical percentages.
  '37': PeptideGelProductPage,
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
  // The three cosmetics inside the Eye Zone Care Kit. The 0.25mm eye
  // roller has no retail PDP, so it is never fetched here.
  '50': ['17', '24', '33'],
  // The other five Power Solutions, for the range table on each ampoule's page.
  '4': ['5', '6', '7', '8', '9'],
  '5': ['4', '6', '7', '8', '9'],
  '6': ['4', '5', '7', '8', '9'],
  '7': ['4', '5', '6', '8', '9'],
  '8': ['4', '5', '6', '7', '9'],
  '9': ['4', '5', '6', '7', '8'],
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
