/**
 * The beauty boxes that use the shared BeautyBoxProductPage layout.
 *
 * One entry per box: the copy module in three languages, and the palette class
 * from beautybox.css. Everything else the page needs - the five member products,
 * their prices, sizes, stock, images and barcodes - is read live from the
 * catalogue, so adding a box here is a copy module and two lines, not a layout.
 *
 * The member products themselves come from PRODUCT_ROUTINES[productNumber] via
 * getRoutineProducts in bespokePdp.tsx, which is also what the shared PDP uses
 * for its routine strip, so the box and the routine can never disagree about
 * what is in the box.
 */

import type { BeautyBoxLocaleCopy } from './beautyBoxCopy'
import { ANTI_AGING_COPY } from './copy/antiAging'
import { CHARMING_LOOK_COPY } from './copy/charmingLook'
import { DEEP_MOISTURIZING_COPY } from './copy/deepMoisturizing'

export interface BeautyBoxConfig {
  copy: BeautyBoxLocaleCopy
  /** Palette class defined in beautybox.css. */
  palette: string
}

/* `satisfies` rather than an annotation, so the catalogue numbers stay literal
   types and bespokePdp.tsx can check that every box listed here has a route. */
export const BEAUTY_BOXES = {
  '57': { copy: CHARMING_LOOK_COPY, palette: 'bb-mauve' },
  '58': { copy: ANTI_AGING_COPY, palette: 'bb-garnet' },
  '59': { copy: DEEP_MOISTURIZING_COPY, palette: 'bb-water' },
} satisfies Record<string, BeautyBoxConfig>

export type BeautyBoxNumber = keyof typeof BEAUTY_BOXES
