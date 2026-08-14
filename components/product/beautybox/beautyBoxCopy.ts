/**
 * Shared copy contract for the beauty box pages.
 *
 * Every box is the same proposition - five products that already have their own
 * pages, sold together for less than the sum of the parts - so they share one
 * layout and one copy shape, and differ only in the words, the accent colour and
 * which five products are inside.
 *
 * A box has no paperwork of its own: no formula, no COA, no barcode, because it
 * is assembled in the UAE from five registered Korean products. So every claim
 * in a box copy module has to trace to a document belonging to one of the five,
 * and each module names those documents at the top. Nothing may be asserted
 * about the box as a whole that is not true of a member product.
 *
 * No price is written into these modules. The page derives the comparison from
 * the five live product records, so it cannot drift when a price changes, and a
 * customer on a tier discount is not shown a saving they would not get (their
 * discount applies to the five products but not to the box, per
 * lib/discountUtils.ts, which excludes Beauty Boxes from user discounts).
 */

export interface BeautyBoxItemCopy {
  /** i18n key under `product.` for the short catalogue name. */
  titleKey: string
  /** Catalogue number of the live record, for pricing, stock and the link. */
  productNumber: string
  quantity: number
  /** Where it sits in the routine, e.g. "Step 1 - Cleanse". */
  step: string
  /** Two sentences at most: what it is, and what it does here. */
  body: string
  /**
   * Measured facts from that product's own paperwork - a pH, an assayed
   * percentage, a fragrance declaration. Optional, because the older boxes were
   * written before the item cards carried them.
   */
  facts?: string[]
}

export interface BeautyBoxCopy {
  eyebrow: string
  backToProducts: string
  headline: string
  subheadline: string
  heroBullets: string[]
  kitSize: string
  fullSizeNote: string
  vatIncluded: string
  freeDelivery: string
  addToBag: string
  adding: string
  added: string
  outOfStock: string
  loginToShop: string
  inBag: string
  viewBag: string
  badges: string[]
  stats: { value: string; label: string }[]
  contents: {
    eyebrow: string
    title: string
    intro: string
    items: BeautyBoxItemCopy[]
    eanLabel: string
    each: string
    viewItem: string
    boughtSeparately: string
    inThisBox: string
    youSave: string
    /** Completes "You save 197.70 AED ..." at the buy button. The strikethrough
     *  beside the price says 1,318 without saying what 1,318 is, and on a kit
     *  page that reads as a former price rather than as the sum of the parts. */
    againstSeparate: string
    seeBreakdown: string
    savingNote: string
  }
  howTo: {
    eyebrow: string
    title: string
    intro: string
    steps: { title: string; body: string }[]
    note: string
  }
  evidence: {
    eyebrow: string
    title: string
    intro: string
    cards: { value: string; title: string; body: string }[]
    footnote: string
  }
  suited: {
    eyebrow: string
    title: string
    forTitle: string
    forList: string[]
    notForTitle: string
    notForList: string[]
    /** The other boxes named in notForList, as links. Telling someone to buy a
     *  different box and then making them search for it is a dead end. */
    alternativesLabel: string
    alternatives: { productNumber: string; label: string }[]
    note: string
  }
  details: {
    eyebrow: string
    title: string
    rows: { label: string; value: string }[]
  }
  faq: {
    eyebrow: string
    title: string
    items: { q: string; a: string }[]
  }
}

export type BeautyBoxLocaleCopy = {
  en: BeautyBoxCopy
  ar: BeautyBoxCopy
  ru: BeautyBoxCopy
}

export function pickBeautyBoxLocale(copy: BeautyBoxLocaleCopy, locale: string): BeautyBoxCopy {
  if (locale === 'ar') return copy.ar
  if (locale === 'ru') return copy.ru
  return copy.en
}
