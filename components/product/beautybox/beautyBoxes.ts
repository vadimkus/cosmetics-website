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
import { GLASS_SKIN_RITUAL_COPY } from './copy/glassSkinRitual'
import { PROBLEM_SKIN_COPY } from './copy/problemSkin'
import { SENSITIVE_SKIN_COPY } from './copy/sensitiveSkin'
import { SKIN_BRIGHTENING_COPY } from './copy/skinBrightening'

export interface BeautyBoxConfig {
  copy: BeautyBoxLocaleCopy
  /** Palette class defined in beautybox.css. */
  palette: string
  /**
   * A box whose complexion product comes in shades carries the shade on the cart
   * line, so the right one is packed. The value names the shade list the page
   * offers; the cart and MoySklad key on that list's `value` strings.
   */
  shade?: 'cushion' | 'revita'
}

/* `satisfies` rather than an annotation, so the catalogue numbers stay literal
   types and bespokePdp.tsx can check that every box listed here has a route. */
export const BEAUTY_BOXES = {
  '55': { copy: PROBLEM_SKIN_COPY, palette: 'bb-livery' },
  '56': { copy: SKIN_BRIGHTENING_COPY, palette: 'bb-amber' },
  '57': { copy: CHARMING_LOOK_COPY, palette: 'bb-mauve', shade: 'cushion' },
  '58': { copy: ANTI_AGING_COPY, palette: 'bb-garnet' },
  '59': { copy: DEEP_MOISTURIZING_COPY, palette: 'bb-water' },
  /* 62 is the only box with six members rather than five, because its treatment
     slot and its sheet mask are separate items. The layout maps over
     contents.items, so nothing needed changing for that. */
  '62': { copy: SENSITIVE_SKIN_COPY, palette: 'bb-oat' },
  /* 68 is the DTS MG holiday kit rather than a box assembled here: three members
     in the brand's own gift box, plus a puff and a mirror case that have no
     catalogue record and so sit in the copy, not in contents.items. MoySklad
     holds it as two SKUs, one per BB cream shade. */
  '68': { copy: GLASS_SKIN_RITUAL_COPY, palette: 'bb-moon', shade: 'revita' },
} satisfies Record<string, BeautyBoxConfig>

export type BeautyBoxNumber = keyof typeof BEAUTY_BOXES
