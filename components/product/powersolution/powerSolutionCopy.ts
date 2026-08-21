/**
 * Bespoke copy for the POWER SOLUTION CVS page (product 5).
 *
 * Same self-contained per-locale pattern as pdrnMaskCopy.ts and
 * collagenMaskCopy.ts, so the layout ships EN/AR/RU without adding ~130 keys to
 * the shared messages bundles.
 *
 * SOURCING RULE FOR THIS FILE
 *
 * Four documents, and between them they cover everything on this page:
 *
 *   Registration DOC/SA/SA-GENOSYS POWER SOLUTION CVS.pdf
 *       January 2021, DTS MG. The current quantitative formula. Page 21 carries
 *       the AGGREGATED percentages - the finished concentration of every INCI
 *       line - which is the table to read. The raw-material table earlier in the
 *       document lists premixes, not ingredients, and reading it as if it were
 *       the formula is how the first pass got the peptide doses wrong.
 *   Registration DOC/Artwork/[GENOSYS]POWER SOLUTION CVS.pdf
 *       Carton text in seven languages, the four application pictograms, the
 *       full INCI and the precautions.
 *   Registration DOC/COA/COA-GENOSYS POWER SOLUTION CVS(L1036B).pdf
 *       Lot L1036B, made 2 Dec 2024, expires 25 Nov 2027. pH 5.94 against a
 *       6.00 +/- 1.00 spec, specific gravity 1.032, 10,000 units released.
 *   Registration DOC/Artwork/[GENOSYS]POWER SOLUTION {HES,AWS,CTS,PCS,SWS}.pdf
 *       The five sibling cartons, for the range table. Each one prints its own
 *       full name and a one-line declared function.
 *
 * THE FORMULA, as finished concentrations. Every figure on this page is from
 * the aggregated table:
 *
 *   Aqua (Water)                          70.5259%
 *   Butylene Glycol                       12.4850%
 *   Glycerin                              11.4800%
 *   1,2-Hexanediol                         2.1190%
 *   Lactobacillus/Soymilk Ferment Filtrate 2.5000%   <- largest active
 *   Panthenol                              0.5000%
 *   Sodium Hyaluronate                     0.1002%
 *   Allantoin                              0.1000%
 *   Hydrolyzed Collagen                    0.1000%
 *   Grape Callus Culture Extract           0.0300%
 *   Rosa Damascena Callus Culture Extract  0.0300%
 *   Beta-Glucan                            0.0200%
 *   Lecithin                               0.0050%
 *   sh-Polypeptide-7                       0.0001%   =  1 ppm
 *   Palmitoyl Tripeptide-1                 0.00005%  =  0.5 ppm
 *
 * Butylene glycol and glycerin together are 23.965% of the vial, which is the
 * "nearly a quarter humectant" figure the page leads on. It is the most
 * unusual thing about the formula and it is checkable off the dossier.
 *
 * sh-POLYPEPTIDE-7 - what it is, and what it is not.
 *
 * The dossier: "sh-Polypeptide-7 is a single chain recombinant human peptide,
 * produced by fermentation in E. coli. The starting gene is a synthesized copy
 * of the human gene which codes for Somatotropin, the synthetically produced
 * Human Growth Hormone... It contains a maximum of 217 amino acids." COSING
 * functions: antiseborrhoeic, skin protecting.
 *
 * It is therefore a somatotropin-sequence peptide. It is NOT an IGF-1 analogue.
 * Every Power Solution on this site described it as "an IGF-1-analog peptide"
 * in English, Arabic and Russian; IGF-1 analogue is sh-Oligopeptide-2, which is
 * in none of these products. Corrected across all six on 14 Aug 2026. Do not
 * let it back.
 *
 * CLAIMS THE PAGE MAKES, AND WHERE THEY COME FROM
 *   Skin nourishment                       carton, "Function Skin nourishment"
 *   Concentrated Vitality Solution         carton front panel and vial label
 *   Four verified exclusions               carton, checked against current INCI
 *   23.97% humectant, and every %          safety assessment, aggregated table
 *   pH 5.94, SG 1.032                      COA lot L1036B
 *   Three-year shelf life                  COA, made Dec 2024 / exp Nov 2027
 *   Dermatologically tested                carton front panel
 *   Avoid in pregnancy and lactation       carton precautions, all languages
 *   Marine collagen                        safety assessment, "FISH COLLAGEN"
 *   The five sibling functions             the five sibling cartons
 *
 * DELIBERATE OMISSIONS - do not add these without a document:
 *   - MICRONEEDLING. Not in the carton, not in the dossier. The carton's
 *     application is four pictograms: cleanse, open, apply, absorb, and the
 *     safety assessment studies it "as a face cream" that "is not rinsed-off".
 *     The first pass built the whole page around a needling protocol and it had
 *     to come out. The roller survives in exactly one place, the FAQ, answered
 *     as what GENOSYS designs around rather than as an instruction from this
 *     carton.
 *   - LAYERING UNDER A GENOSYS SERUM. Same problem. No document says it.
 *   - TISSUE REPAIR, CELL PRODUCTION, REGENERATION. The carton's own
 *     sh-Polypeptide-7 panel says the peptide has "the same structure and
 *     function as human growth hormone which is the key hormone in body to
 *     stimulate tissue repair and encourage growth, cell production and
 *     regeneration". The identity half of that is worth printing and the page
 *     prints it. The mechanism half is drug-register for a cosmetic sold in the
 *     UAE and stays off.
 *   - THE RUSSIAN CARTON PANEL. It claims regeneration, collagen production and
 *     vessel strengthening. None of the three is supportable at these
 *     concentrations and none of them appears on the English panel. Logged as a
 *     pack correction; not used here in any locale.
 *   - THE 2011 QUALI-QUANTI SHEETS. Intertek_folder/Quali-quanti Ingredients
 *     holds two COTDE documents for CVS, both dated 2011, both a superseded
 *     formula that does not match the current INCI. Ignore them.
 *
 * IMAGE NOTE. Three shots on file, all verified at full resolution, all real
 * photographs:
 *
 *   cvs-hero-square.jpg      main. Box, flask, ten vials, petri dish and
 *                            pipette on a cool lilac-grey studio sweep. NOT on
 *                            white, so it must never carry .ps-figure - the
 *                            multiply rule would darken the sweep into a block.
 *   Second/cvs_big1.jpg      the open box, 2000px, pure white. The printed
 *                            exclusions panel is legible on the lid.
 *   Second/cvs_big2.jpg      a single vial, 2000px, pure white.
 *
 * The two on white carry the inline figures and multiply into the stage tint.
 *
 * The hero is squared, and that is load-bearing. The original CVS.jpg is
 * 956x662, and the gallery stage is square with object-contain, so it sat inside
 * the stage tint with 147px of a different grey above and below - a
 * hard-cornered rectangle inside a rounded card. scripts/square-cvs-hero-image-20260814.py
 * extended the sweep to 956x956 by continuing the photo's own vertical gradient,
 * so it now fills the stage edge to edge. Any replacement hero for this page has
 * to be square for the same reason. CVS.jpg is kept on disk for historical order
 * emails.
 */

import { CVS_AR_COPY, CVS_RU_COPY } from './cvsLocalizedCopy'

export type PowerSolutionLocale = 'en' | 'ar' | 'ru'

/** Finished concentrations, shared across locales because they are data. Only
 *  the labels are translated, and they are matched by index, so the label
 *  arrays in each locale must stay the same length and order as these. */
export const FORMULA_BASE = [
  { pct: 12.485 },
  { pct: 11.48 },
] as const

export const FORMULA_ACTIVES = [
  { pct: 2.5 },
  { pct: 0.5 },
  { pct: 0.1002 },
  { pct: 0.1 },
  { pct: 0.1 },
  { pct: 0.03 },
  { pct: 0.03 },
  { pct: 0.02 },
] as const

/** 12.485 + 11.48, printed as the headline figure for the humectant base. */
export const HUMECTANT_TOTAL = 23.965

/** The six ampoules, in catalogue order. Codes and product numbers are data;
 *  the names and the one-line functions are translated. */
export const RANGE = [
  { code: 'HES', productNumber: '4' },
  { code: 'CVS', productNumber: '5' },
  { code: 'CTS', productNumber: '6' },
  { code: 'PCS', productNumber: '7' },
  { code: 'SWS', productNumber: '8' },
  { code: 'AWS', productNumber: '9' },
] as const

/** Shared across locales: the INCI is a regulatory string and stays in Latin
 *  script in every locale, exactly as the carton prints it. */
export const FULL_INCI =
  'Aqua (Water), Butylene Glycol, Glycerin, Lactobacillus/Soymilk Ferment Filtrate, ' +
  '1,2-Hexanediol, sh-Polypeptide-7, Palmitoyl Tripeptide-1, Panthenol, Sodium Hyaluronate, ' +
  'Hydrolyzed Collagen, Allantoin, Vitis Vinifera (Grape) Callus Culture Extract, Rosa ' +
  'Damascena Callus Culture Extract, Beta-Glucan, Lecithin, Sodium Phosphate, Sodium Chloride, ' +
  'Scutellaria Baicalensis Root Extract, Citrus Junos Fruit Extract, Camellia Sinensis Leaf ' +
  'Extract, Houttuynia Cordata Extract, Glycine, Ethylhexylglycerin, Disodium EDTA, Artemisia ' +
  'Vulgaris Extract, Artemisia Princeps Extract, Lysine, Lactobacillus Ferment Lysate Filtrate, ' +
  'Chamaecyparis Obtusa Water.'

export interface PowerSolutionCopy {
  eyebrow: string
  headline: string
  subheadline: string
  heroBullets: string[]
  badges: string[]
  packSize: string
  usageNote: string
  addToBag: string
  adding: string
  added: string
  inBag: string
  viewBag: string
  loginToShop: string
  outOfStock: string
  vatIncluded: string
  freeDelivery: string
  /** Russian writes 12,485; English and the Arabic pages write 12.485. */
  decimalSeparator: string
  stats: Array<{ value: string; label: string }>
  /** What the ampoule is. Leads the body of the page. */
  solution: {
    eyebrow: string
    title: string
    body: string
    points: Array<{ title: string; body: string }>
    figureAlt: string
  }
  /** The quantitative formula, charted. */
  formula: {
    eyebrow: string
    title: string
    intro: string
    baseTitle: string
    /** Matched by index to FORMULA_BASE. */
    baseRows: string[]
    baseNote: string
    activesTitle: string
    /** Matched by index to FORMULA_ACTIVES. */
    activesRows: string[]
    activesNote: string
    traceTitle: string
    traceBody: string
  }
  /** Exclusions retained only when verified against the current INCI. */
  freeFrom: {
    eyebrow: string
    title: string
    body: string
    items: string[]
    note: string
    figureAlt: string
  }
  /** The other five ampoules. This is the cross-sell on this page: the Power
   *  Solutions are a professional line and are deliberately absent from
   *  PRODUCT_ROUTINES, so there is no retail routine to show. */
  range: {
    eyebrow: string
    title: string
    intro: string
    thisOne: string
    /** Matched by index to RANGE. */
    entries: Array<{ name: string; forWhat: string }>
    viewProduct: string
    note: string
  }
  howTo: {
    eyebrow: string
    title: string
    frequency: string
    steps: Array<{ title: string; body: string }>
    note: string
  }
  /** Held here rather than read from product.ingredients, because the bespoke
   *  layouts are handed the untranslated row. This is what makes the Arabic and
   *  Russian pages read in Arabic and Russian. */
  actives: {
    eyebrow: string
    title: string
    intro: string
    cards: Array<{ name: string; body: string }>
    inciTitle: string
    inciNote: string
  }
  suited: {
    eyebrow: string
    title: string
    forTitle: string
    forList: string[]
    notTitle: string
    notList: string[]
    note: string
  }
  faq: {
    eyebrow: string
    title: string
    items: Array<{ q: string; a: string }>
  }
  details: {
    eyebrow: string
    title: string
    rows: Array<{ label: string; value: string }>
  }
  closing: {
    title: string
    body: string
  }
  backToProducts: string
  /**
   * Optional. Rendered only by products whose selling point is the molecular
   * weight of one ingredient, which so far is HES alone: its hyaluronic acid
   * sits between filler grade and the grade ordinary cosmetics use, and the
   * whole reason the carton pairs it with a roller is that weight. CVS has no
   * equivalent story and leaves this undefined, which drops the section.
   */
  ladder?: {
    eyebrow: string
    title: string
    intro: string
    /** Three grades, lightest last, with the product's own marked `self`. */
    columns: Array<{
      grade: string
      weight: string
      delivery: string
      effect: string
      self?: boolean
    }>
    note: string
  }
}

/**
 * What differs between one Power Solution page and the next.
 *
 * The six ampoules share a carton design, a range table, an exclusions panel and a
 * formula worth charting, so they share a layout. What they do not share is the
 * formula itself, the photography, the accent colour off the vial label, or
 * whether there is a molecular-weight story to tell. Those go here, and
 * PowerSolutionProductPage reads everything product-specific through this.
 */
export interface PowerSolutionVariant {
  /** Sits alongside .powersolution-page and restates the palette variables. */
  paletteClass: string
  getCopy: (locale: string) => PowerSolutionCopy
  /** Matched by index to copy.formula.baseRows. */
  formulaBase: readonly { pct: number }[]
  /** Matched by index to copy.formula.activesRows. */
  formulaActives: readonly { pct: number }[]
  fullInci: string
  /** Square, on pure white: it multiplies into the stage tint. */
  vialImage: string
  /** 4:3, on pure white, with the no-additions badge legible. */
  boxImage: string
  /**
   * Gallery slides to multiply into the stage tint. Every slide in these
   * galleries is square and so fills the square stage edge to edge, which means
   * a slide shot on pure white turns the whole card into a stark white block
   * unless it is multiplied down to the tint.
   *
   * Only worth doing where it makes the rail consistent. CVS is three shots on
   * white and blends all three, so the card is the same colour on every slide.
   * HES is eight, four on white and four full-bleed infographics; blending half
   * of them would change the card colour as you click through, so it blends
   * none and takes a near-white stage instead.
   */
  blendGallerySlides: ReadonlySet<string>
  /**
   * Whether the hero is on pure white, which decides how the closing band
   * carries it. A hero on a studio sweep must not be multiplied: the sweep
   * darkens into a grey block instead of dissolving.
   */
  heroOnWhite: boolean
}

const EN: PowerSolutionCopy = {
  eyebrow: 'Professional ampoule · Ten sealed vials',
  headline: 'The vial you reach for when skin needs feeding.',
  subheadline:
    'CVS is Concentrated Vitality Solution, and Korea registers its function in two words: skin nourishment. It is the general-purpose ampoule of the six-strong Power Solution range, the one for skin that is tired and dry rather than pigmented, oily or lined. Nearly a quarter of the vial is humectant, which is what lets a full 2 ml sit comfortably on a face that has just been treated. Ten sealed glass vials, one per treatment.',
  heroBullets: [
    'Nearly a quarter humectant, so a full 2 ml stays comfortable on treated skin',
    'Soy ferment at 2.5% and panthenol at 0.5%, both real working doses',
    'No parabens, ethanol, artificial pigment or artificial fragrance',
    'Ten sealed glass vials, so nothing oxidises between one face and the next',
  ],
  badges: ['Dermatologically tested', 'Made in Korea', 'No parabens', 'No added fragrance'],
  packSize: '10 vials · 2 ml each',
  usageNote: 'One vial per treatment',
  addToBag: 'Add to bag',
  adding: 'Adding…',
  added: 'Added',
  inBag: 'In your bag',
  viewBag: 'View bag',
  loginToShop: 'Log in to shop',
  outOfStock: 'Out of stock',
  vatIncluded: 'VAT included',
  freeDelivery: 'Free delivery across the UAE',
  decimalSeparator: '.',
  stats: [
    { value: '24%', label: 'Of the vial is humectant, before a single active is counted' },
    { value: '2.5%', label: 'Soy ferment, the largest active in the formula' },
    { value: '4', label: 'Excluded additives: parabens, ethanol, artificial pigment and fragrance' },
    { value: '10 × 2 ml', label: 'Sealed glass vials, opened one at a time' },
  ],
  solution: {
    eyebrow: 'The ampoule',
    title: 'Three letters that stand for something.',
    body:
      'Every vial in the Power Solution range wears a code, and the codes are not decoration. Each one is a registered product name with a single job printed beside it. CVS is Concentrated Vitality Solution, and the function on the carton is skin nourishment: it supplies, it revitalises, it hydrates. That is the whole brief, and it is why this is the vial that gets used most.',
    points: [
      {
        title: 'One vial, one treatment',
        body:
          'Two millilitres, sealed in glass under a crimped cap and opened at the chair. Nothing is decanted, nothing is kept, and nothing oxidises between one face and the next. Ten vials is ten full doses.',
      },
      {
        title: 'Nothing harsh in it',
        body:
          'No fragrance, no ethanol, no pigment, and a pH of 5.94, which is close to skin. On a face that has just been through a treatment, what a product leaves out matters as much as what it puts in.',
      },
      {
        title: 'It stays on',
        body:
          'A leave-on solution, not a rinse-off. It stays on the skin and works there the way a treatment cream does, in four steps: cleanse, open, apply, absorb.',
      },
    ],
    figureAlt: 'A single 2 ml POWER SOLUTION CVS glass vial, showing the Concentrated Vitality Solution label',
  },
  formula: {
    eyebrow: 'The formula',
    title: 'Where the vial actually goes.',
    intro:
      'Every percentage below is the finished concentration in the vial, not a guess at what a name near the top of an ingredient list might mean. Water is the carrier, 70.5% of it, as in every serum on earth. What sets this one apart is the other 29.5%.',
    baseTitle: 'The base — 23.97% of the vial',
    baseRows: ['Butylene Glycol', 'Glycerin'],
    baseNote:
      'Two humectants, almost a quarter of the bottle between them. That is a lot, and it is deliberate: it is what carries the actives across a whole face and leaves it feeling cushioned instead of tight.',
    activesTitle: 'The actives',
    activesRows: [
      'Lactobacillus/Soymilk Ferment Filtrate',
      'Panthenol',
      'Sodium Hyaluronate',
      'Allantoin',
      'Hydrolyzed Collagen',
      'Grape Callus Culture Extract',
      'Rose Callus Culture Extract',
      'Beta-Glucan',
    ],
    activesNote:
      'Panthenol at 0.5% and allantoin at 0.1% are both at the top of the range you normally see them used at. Each group is charted on its own scale so the actives stay readable beside the base.',
    traceTitle: 'And the peptides',
    traceBody:
      'These are the two ingredients the Power Solution name is built on: sh-Polypeptide-7 at 1 ppm and palmitoyl tripeptide-1 at 0.5 ppm. Peptides work at parts per million by design, and the CIR expert panel puts typical cosmetic use of the palmitoyl tripeptide family under 10 ppm.',
  },
  freeFrom: {
    eyebrow: 'A considered formula',
    title: 'Four additives left out.',
    body:
      'The formula leaves out four common additives, each checked directly against the current ingredient list.',
    items: [
      'Parabens',
      'Ethanol',
      'Artificial pigment',
      'Artificial fragrance',
    ],
    note:
      'Ethanol is the one worth pausing on. A great many professional ampoules use alcohol to thin the solution and speed the dry-down, and on skin that has just been treated it is exactly what stings.',
    figureAlt: 'The POWER SOLUTION CVS box open, showing ten sealed vials inside the lid',
  },
  range: {
    eyebrow: 'The range',
    title: 'Six vials, one problem each.',
    intro:
      'The Power Solutions are a set, and each one is chosen for the skin in front of you. Same format, same price, same 2 ml sealed vial — a different job printed on each carton. CVS is the one for skin that is simply tired.',
    thisOne: 'This one',
    entries: [
      { name: 'HA Volume Enhancing Solution', forWhat: 'Plumping and instant hydration' },
      { name: 'Concentrated Vitality Solution', forWhat: 'Nourishment for tired, dry skin' },
      { name: 'Cytokine Concentrate Solution', forWhat: 'Texture, firmness and elasticity' },
      { name: 'Problem Control Solution', forWhat: 'Excess oil and blemishes' },
      { name: 'Skin Depigmenting & Whitening Solution', forWhat: 'Pigmentation and uneven tone' },
      { name: 'Anti-Wrinkle Solution', forWhat: 'Lines and loss of firmness' },
    ],
    viewProduct: 'View',
    note: 'All six are 2 ml × 10 vials at the same price, so the choice is about the skin, not the budget.',
  },
  howTo: {
    eyebrow: 'How to use',
    title: 'One vial, start to finish.',
    frequency: 'One vial per treatment',
    steps: [
      { title: 'Cleanse', body: 'Wash the face thoroughly and pat it dry. The carton starts here, and on a treatment day so should you.' },
      { title: 'Open one vial', body: 'Snap the crimped cap. Each 2 ml vial is a single use, and there are ten in the box.' },
      { title: 'Apply', body: 'Work the solution across the whole face. Two millilitres is more than it sounds; it will cover a face and a neck without being spread thin.' },
      { title: 'Let it absorb', body: 'It is a leave-on product and it is not rinsed off. Give it a minute before anything goes on top.' },
      { title: 'Follow with a moisturiser', body: 'Or with whatever your practitioner has set for you. There is no acid and no fragrance in this vial, so it does not restrict what comes next.' },
      { title: 'Discard the rest', body: 'An opened vial does not reseal, and the solution is meant to be used fresh rather than kept. That is the point of ten of them.' },
    ],
    note:
      'Avoid it during pregnancy and while breastfeeding — a precaution the carton prints itself, on account of the two artemisia extracts. It also contains marine collagen, so avoid it if you are allergic to fish.',
  },
  actives: {
    eyebrow: 'What is in it',
    title: 'The ingredients, with their real figures.',
    intro:
      'Every percentage here is the finished concentration in the vial, not an inference from where a name sits in the list.',
    cards: [
      {
        name: 'sh-Polypeptide-7, 1 ppm',
        body:
          'The signature peptide of the range. A single-chain recombinant human peptide grown by fermentation from a synthesised copy of the human gene that codes for somatotropin, so every batch arrives with the same 217-amino-acid sequence instead of varying the way a harvested extract does.',
      },
      {
        name: 'Palmitoyl Tripeptide-1, 0.5 ppm',
        body:
          'Three amino acids anchored to a fatty acid so the peptide stays where it is put. One of the most studied peptides in cosmetic use, and one of the most widely used.',
      },
      {
        name: 'Lactobacillus/Soymilk Ferment Filtrate, 2.5%',
        body:
          'Soymilk fermented with lactobacillus, then filtered. At 2.5% it is by a wide margin the largest active in the vial, and it is where the nourishment comes from.',
      },
      {
        name: 'Panthenol, 0.5%',
        body:
          'Provitamin B5 at a full working dose. It holds water in the skin and takes the edge off the tightness that follows a treatment.',
      },
      {
        name: 'Allantoin, 0.1%',
        body:
          'A comfort ingredient with decades of use behind it, here at the top of the range it is normally used at.',
      },
      {
        name: 'Sodium Hyaluronate, 0.1%',
        body:
          'Holds many times its own weight in water at the skin surface, which is what keeps a treated face looking full rather than drawn.',
      },
      {
        name: 'Hydrolyzed Collagen, 0.1%',
        body:
          'Marine collagen, broken down small enough to sit on the skin as a humectant film. The source is fish.',
      },
      {
        name: 'Grape and rose callus cultures, 0.03% each',
        body:
          'Plant stem-cell cultures from Vitis vinifera and Rosa damascena, grown in a lab rather than harvested from a field, which is what makes them consistent batch to batch.',
      },
      {
        name: 'The Korean botanicals',
        body:
          'Green tea, yuzu, mugwort, houttuynia, baicalensis root and hinoki cypress water. Each one named in full rather than folded into an invented complex name.',
      },
    ],
    inciTitle: 'Full ingredient list (INCI)',
    inciNote:
      'Every ingredient, in the same order as the box in your hand. Every batch is tested for pH, and the last came back at 5.94 inside a 6.00 ± 1.00 specification.',
  },
  suited: {
    eyebrow: 'Honestly',
    title: 'Who this is for.',
    forTitle: 'Buy it if',
    forList: [
      'You run treatments and want a nourishing base ampoule that suits almost every face that walks in',
      'Your skin is tired, dull and dehydrated rather than pigmented, oily or lined',
      'You want a sealed single-use dose rather than a bottle that stays open for months',
      'You react to fragrance and alcohol, which this leaves out and prints that it leaves out',
      'You want the percentages, because every one of them is on this page',
    ],
    notTitle: 'Look elsewhere if',
    notList: [
      'Pigmentation is your main concern — SWS is the vial registered for that',
      'Lines and firmness are the problem — that is AWS, or CTS for texture',
      'You are treating oil and breakouts, which is what PCS is for',
      'You are pregnant or breastfeeding, which the carton itself asks you to avoid',
      'You are allergic to fish, because the collagen in this one is marine',
    ],
    note:
      'For external use only. Keep it away from the eyes and mucous membranes, and rinse with cool water if it gets there. Stop and speak to a doctor if redness, swelling or irritation occurs.',
  },
  faq: {
    eyebrow: 'Questions',
    title: 'Before you buy.',
    items: [
      {
        q: 'What does CVS actually stand for?',
        a: 'Concentrated Vitality Solution. It is printed on the front of the box and on every vial, under the code. The function printed beside it is skin nourishment.',
      },
      {
        q: 'Can I use it with a GENOSYS roller?',
        a: 'That is the pairing GENOSYS designs its system around, and the range is sold into clinics that do exactly that. This carton itself gives the simple version — cleanse, open, apply, absorb — so if a practitioner has set you a protocol, follow theirs rather than ours.',
      },
      {
        q: 'Is it a professional-only product?',
        a: 'It is a professional line: "PROFESSIONAL" is printed on each vial and the format is a clinic format. Nothing in it is restricted, so it is fine at home on a practitioner’s advice, which is exactly how most of our customers use it.',
      },
      {
        q: 'What does sh-Polypeptide-7 do?',
        a: 'It is a recombinant human peptide built to the somatotropin sequence and grown by fermentation, and COSING classifies it as a skin-protecting ingredient. Tissue repair and new cell production are drug claims that belong to medicine rather than to a cosmetic; what this peptide brings to the vial is a sequence that is identical every time.',
      },
      {
        q: 'Which of the six should I pick?',
        a: 'Match the vial to the complaint. Tired and dry is CVS, dehydrated and flat is HES, pigmented is SWS, lined is AWS, rough or slack is CTS, oily or breaking out is PCS. The range table above sets them side by side.',
      },
      {
        q: 'How long does a box last?',
        a: 'Ten treatments, one vial each. Unopened it holds three years from manufacture, and the expiry date is printed on the box.',
      },
      {
        q: 'Is it safe in pregnancy?',
        a: 'The carton asks you to avoid it during pregnancy and lactation, so we pass that on rather than talk you out of it. It is the two artemisia extracts. Take the ingredient list to whoever is looking after you.',
      },
    ],
  },
  details: {
    eyebrow: 'The detail',
    title: 'Specification.',
    rows: [
      { label: 'Format', value: 'Leave-on solution in a sealed 2 ml glass vial' },
      { label: 'Pack', value: '2 ml × 10 vials' },
      { label: 'Function', value: 'Skin nourishment, the function registered in Korea' },
      { label: 'Base', value: 'Butylene glycol 12.5% and glycerin 11.5%, 23.97% together' },
      { label: 'Key actives', value: 'Soy ferment 2.5%, panthenol 0.5%, allantoin 0.1%, sodium hyaluronate 0.1%, marine collagen 0.1%' },
      { label: 'Peptides', value: 'sh-Polypeptide-7 1 ppm, palmitoyl tripeptide-1 0.5 ppm' },
      { label: 'pH', value: '5.94, inside a 6.00 ± 1.00 specification' },
      { label: 'Free from', value: 'Parabens, ethanol, artificial pigment and artificial fragrance' },
      { label: 'Shelf life', value: 'Three years unopened, with the expiry date on the box' },
      { label: 'Tested', value: 'Dermatologically tested, and every batch tested for pH, gravity and microbial count' },
      { label: 'Made by', value: 'DTS MG Co., Ltd., South Korea' },
    ],
  },
  closing: {
    title: 'Ten treatments, sealed one at a time.',
    body: 'The nourishing vial of the Power Solution range, with the whole formula and every percentage printed above, nothing held back.',
  },
  backToProducts: 'Products',
}

const AR: PowerSolutionCopy = {
  eyebrow: 'أمبولة احترافية · عشر قوارير مُحكمة',
  headline: 'القارورة التي تلجأ إليها حين تحتاج البشرة إلى غذاء.',
  subheadline:
    'CVS هي Concentrated Vitality Solution، وتسجّل كوريا وظيفتها بكلمتين: تغذية البشرة. هي الأمبولة متعددة الاستخدامات في مجموعة Power Solution المكوّنة من ستة مستحضرات، تلك المخصّصة للبشرة المتعبة والجافة لا للمصطبغة أو الدهنية أو ذات التجاعيد. ما يقارب ربع محتوى القارورة مرطِّبات، وهو ما يجعل 2 مل كاملة تستقر بارتياح على وجه خرج للتو من جلسة عناية. عشر قوارير زجاجية مُحكمة، واحدة لكل جلسة.',
  heroBullets: [
    'ما يقارب الربع مرطِّبات، فتبقى 2 مل كاملة مريحة على بشرة معالَجة',
    'خميرة صويا 2.5% وبانثينول 0.5%، وكلاهما بجرعة فعّالة حقيقية',
    'من دون بارابين أو إيثانول أو أصباغ أو عطور صناعية',
    'عشر قوارير زجاجية مُحكمة، فلا شيء يتأكسد بين وجه وآخر',
  ],
  badges: ['مختبر جلدياً', 'صنع في كوريا', 'من دون بارابين', 'من دون عطر مضاف'],
  packSize: '10 قوارير · 2 مل لكل واحدة',
  usageNote: 'قارورة واحدة لكل جلسة',
  addToBag: 'أضف إلى الحقيبة',
  adding: 'جارٍ الإضافة…',
  added: 'تمت الإضافة',
  inBag: 'في حقيبتك',
  viewBag: 'عرض الحقيبة',
  loginToShop: 'سجّل الدخول للشراء',
  outOfStock: 'غير متوفر',
  vatIncluded: 'شامل ضريبة القيمة المضافة',
  freeDelivery: 'توصيل مجاني داخل الإمارات',
  decimalSeparator: '.',
  stats: [
    { value: '24%', label: 'من القارورة مرطِّبات، قبل حساب أي مادة فعّالة' },
    { value: '2.5%', label: 'خميرة صويا، أكبر مادة فعّالة في التركيبة' },
    { value: '4', label: 'إضافات مستبعدة: البارابين والإيثانول والأصباغ والعطور الصناعية' },
    { value: '10 × 2 مل', label: 'قوارير زجاجية مُحكمة، تُفتح واحدة تلو الأخرى' },
  ],
  solution: {
    eyebrow: 'الأمبولة',
    title: 'ثلاثة أحرف لها معنى.',
    body:
      'كل قارورة في مجموعة Power Solution تحمل رمزاً، والرموز ليست زينة. كل واحد منها اسم منتج مسجّل تُطبع بجانبه مهمة واحدة. CVS هي Concentrated Vitality Solution، والوظيفة على العلبة هي تغذية البشرة: تمدّها وتنعشها وترطّبها. هذا هو المطلوب كله، ولهذا هي القارورة الأكثر استخداماً.',
    points: [
      {
        title: 'قارورة واحدة، جلسة واحدة',
        body:
          'ملليلتران، مُحكمان في زجاج تحت غطاء مضغوط، يُفتحان عند الكرسي. لا شيء يُنقل، ولا شيء يُحفظ، ولا شيء يتأكسد بين وجه وآخر. عشر قوارير تعني عشر جرعات كاملة.',
      },
      {
        title: 'لا شيء قاسٍ فيه',
        body:
          'بلا عطر، بلا إيثانول، بلا صبغة، وبحموضة 5.94، وهي قريبة من البشرة. وعلى وجه خرج للتو من جلسة، ما يخلو منه المستحضر لا يقل أهمية عما يحويه.',
      },
      {
        title: 'يبقى على البشرة',
        body:
          'محلول يبقى على البشرة ولا يُغسل. يبقى على البشرة ويعمل عليها كما يعمل كريم العناية، في أربع خطوات: نظّف، افتح، طبّق، اترك حتى يُمتَص.',
      },
    ],
    figureAlt: 'قارورة زجاجية واحدة سعة 2 مل من POWER SOLUTION CVS، ويظهر عليها اسم Concentrated Vitality Solution',
  },
  formula: {
    eyebrow: 'التركيبة',
    title: 'أين تذهب محتويات القارورة فعلاً.',
    intro:
      'كل نسبة أدناه هي التركيز النهائي في القارورة، لا تخميناً لما قد يعنيه اسم قريب من رأس قائمة المكوّنات. الماء هو الحامل، 70.5% منها، كما في كل سيروم على وجه الأرض. وما يميّز هذه القارورة هو الـ29.5% الباقية.',
    baseTitle: 'القاعدة — 23.97% من القارورة',
    baseRows: ['بيوتيلين جلايكول', 'جليسرين'],
    baseNote:
      'مرطِّبان اثنان يشكّلان معاً ما يقارب ربع القارورة. هذه نسبة كبيرة، وهي مقصودة: هي ما يحمل المواد الفعّالة عبر الوجه كله ويتركه محميّاً لا مشدوداً.',
    activesTitle: 'المواد الفعّالة',
    activesRows: [
      'خميرة اللاكتوباسيلوس/حليب الصويا المُرشَّحة',
      'بانثينول',
      'هيالورونات الصوديوم',
      'ألانتوين',
      'كولاجين مُحلَّل',
      'مستخلص كالوس العنب',
      'مستخلص كالوس الورد',
      'بيتا-جلوكان',
    ],
    activesNote:
      'البانثينول 0.5% والألانتوين 0.1% كلاهما في أعلى النطاق الذي يُستعملان فيه عادة. وكل مجموعة مرسومة بمقياسها الخاص لتبقى المواد الفعّالة واضحة بجانب القاعدة.',
    traceTitle: 'وأما الببتيدات',
    traceBody:
      'هما المكوّنان اللذان بُني عليهما اسم Power Solution: sh-Polypeptide-7 بجزء واحد في المليون، وpalmitoyl tripeptide-1 بنصف جزء في المليون. تعمل الببتيدات بأجزاء من المليون بحكم تصميمها، وتضع لجنة خبراء CIR الاستخدام المعتاد لعائلة palmitoyl tripeptide دون 10 أجزاء في المليون.',
  },
  freeFrom: {
    eyebrow: 'تركيبة مدروسة',
    title: 'أربع إضافات ليست فيها.',
    body:
      'تخلو التركيبة من أربع إضافات شائعة، وقد حُققت هذه الاستثناءات مباشرة مقابل قائمة المكونات الحالية.',
    items: [
      'البارابين',
      'الإيثانول',
      'الأصباغ الصناعية',
      'العطور الصناعية',
    ],
    note:
      'الإيثانول هو ما يستحق التوقف عنده. كثير من الأمبولات الاحترافية تستعمل الكحول لتخفيف المحلول وتسريع جفافه، وهو تحديداً ما يلسع بشرة خرجت للتو من جلسة.',
    figureAlt: 'علبة POWER SOLUTION CVS مفتوحة، وتظهر عشر قوارير مُحكمة داخل الغطاء',
  },
  range: {
    eyebrow: 'المجموعة',
    title: 'ست قوارير، لكل واحدة مشكلتها.',
    intro:
      'مستحضرات Power Solution مجموعة واحدة، وكل واحدة منها تُختار حسب البشرة التي أمامك. الشكل نفسه والسعر نفسه والقارورة المُحكمة نفسها سعة 2 مل — ومهمة مختلفة مطبوعة على كل علبة. وCVS هي المخصّصة للبشرة المتعبة ببساطة.',
    thisOne: 'هذا المنتج',
    entries: [
      { name: 'HA Volume Enhancing Solution', forWhat: 'امتلاء وترطيب فوري' },
      { name: 'Concentrated Vitality Solution', forWhat: 'تغذية للبشرة المتعبة والجافة' },
      { name: 'Cytokine Concentrate Solution', forWhat: 'الملمس والشد والمرونة' },
      { name: 'Problem Control Solution', forWhat: 'الدهون الزائدة والبثور' },
      { name: 'Skin Depigmenting & Whitening Solution', forWhat: 'التصبّغ وتفاوت اللون' },
      { name: 'Anti-Wrinkle Solution', forWhat: 'الخطوط وفقدان الشد' },
    ],
    viewProduct: 'عرض',
    note: 'الستة جميعاً 2 مل × 10 قوارير بالسعر نفسه، فالاختيار يخصّ البشرة لا الميزانية.',
  },
  howTo: {
    eyebrow: 'طريقة الاستخدام',
    title: 'قارورة واحدة، من البداية إلى النهاية.',
    frequency: 'قارورة واحدة لكل جلسة',
    steps: [
      { title: 'التنظيف', body: 'اغسلي الوجه جيداً وجفّفيه بالتربيت. العلبة تبدأ من هنا، وفي يوم الجلسة ينبغي أن تبدئي من هنا أيضاً.' },
      { title: 'افتحي قارورة', body: 'اكسري الغطاء المضغوط. كل قارورة سعة 2 مل مخصّصة لاستعمال واحد، وفي العلبة عشر منها.' },
      { title: 'التطبيق', body: 'وزّعي المحلول على الوجه كله. الملليلتران أكثر مما يبدو؛ يكفيان الوجه والعنق دون أن يُفرَدا رقيقين.' },
      { title: 'اتركيه يُمتَص', body: 'هو مستحضر يبقى على البشرة ولا يُغسل. امنحيه دقيقة قبل وضع أي شيء فوقه.' },
      { title: 'أتبعيه بمرطّب', body: 'أو بما حدّده لك المختص. لا حمض ولا عطر في هذه القارورة، فهي لا تقيّد ما يأتي بعدها.' },
      { title: 'تخلّصي من الباقي', body: 'القارورة المفتوحة لا تُغلق ثانية، والمحلول مُعدّ ليُستعمل طازجاً لا ليُحفظ. ولهذا هي عشر قوارير.' },
    ],
    note:
      'تجنّبيه أثناء الحمل والرضاعة — وهو تحذير تطبعه العلبة نفسها بسبب مستخلصَي الشيح. كما يحتوي على كولاجين بحري، فتجنّبيه إن كانت لديك حساسية تجاه الأسماك.',
  },
  actives: {
    eyebrow: 'المكوّنات',
    title: 'المكوّنات، بأرقامها الحقيقية.',
    intro: 'كل نسبة هنا هي التركيز النهائي في القارورة، لا استنتاجاً من موقع الاسم في القائمة.',
    cards: [
      {
        name: 'sh-Polypeptide-7، جزء واحد في المليون',
        body:
          'الببتيد المميّز للمجموعة. ببتيد بشري مُعاد تركيبه أحادي السلسلة، يُنتَج بالتخمير انطلاقاً من نسخة مُصنَّعة من الجين البشري المسؤول عن السوماتوتروبين، فتأتي كل دفعة بالتسلسل نفسه المكوَّن من 217 حمضاً أمينياً بدل أن تتغيّر كما يتغيّر المستخلص المحصود.',
      },
      {
        name: 'Palmitoyl Tripeptide-1، 0.5 جزء في المليون',
        body:
          'ثلاثة أحماض أمينية مرتبطة بحمض دهني ليبقى الببتيد في موضعه. من أكثر الببتيدات دراسةً واستعمالاً في مستحضرات التجميل.',
      },
      {
        name: 'خميرة اللاكتوباسيلوس/حليب الصويا المُرشَّحة، 2.5%',
        body:
          'حليب صويا مخمَّر باللاكتوباسيلوس ثم مُرشَّح. بنسبة 2.5% هو بفارق كبير أكبر مادة فعّالة في القارورة، ومنه تأتي التغذية.',
      },
      {
        name: 'البانثينول، 0.5%',
        body:
          'بروفيتامين B5 بجرعة فعّالة كاملة. يحبس الماء في البشرة ويخفّف الشدّ الذي يلي الجلسة.',
      },
      {
        name: 'الألانتوين، 0.1%',
        body:
          'مكوّن مريح للبشرة وراءه عقود من الاستعمال، وهو هنا في أعلى النطاق الذي يُستعمل فيه عادة.',
      },
      {
        name: 'هيالورونات الصوديوم، 0.1%',
        body:
          'تحتفظ بأضعاف وزنها ماءً عند سطح البشرة، وهو ما يُبقي الوجه المعالَج ممتلئاً لا شاحباً.',
      },
      {
        name: 'الكولاجين المُحلَّل، 0.1%',
        body:
          'كولاجين بحري، مُجزَّأ إلى جزيئات صغيرة تكفي ليستقر على البشرة كطبقة مرطِّبة. ومصدره الأسماك.',
      },
      {
        name: 'كالوس العنب والورد، 0.03% لكل منهما',
        body:
          'مزارع خلايا جذعية نباتية من Vitis vinifera وRosa damascena، مُنمّاة في المختبر لا محصودة من حقل، وهذا ما يجعلها ثابتة من دفعة إلى أخرى.',
      },
      {
        name: 'النباتات الكورية',
        body:
          'شاي أخضر ويوزو وشيح وهوتونيا وجذر القُبَّعية وماء السرو الياباني. كل واحد منها مذكور باسمه كاملاً لا مخبّأ خلف اسم مركّب مُبتكَر.',
      },
    ],
    inciTitle: 'قائمة المكوّنات الكاملة (INCI)',
    inciNote:
      'كل مكوّن، بالترتيب نفسه الذي على العلبة بين يديك. تُختبر الحموضة في كل تشغيلة، وجاءت الأخيرة 5.94 داخل مواصفة 6.00 ± 1.00.',
  },
  suited: {
    eyebrow: 'بصراحة',
    title: 'لمن هذه الأمبولة.',
    forTitle: 'اشتريها إذا',
    forList: [
      'كنت تقدّمين جلسات وتريدين أمبولة مغذّية أساسية تناسب كل وجه تقريباً',
      'كانت بشرتك متعبة وباهتة وجافة لا مصطبغة أو دهنية أو ذات تجاعيد',
      'أردت جرعة مُحكمة لاستعمال واحد بدل زجاجة تبقى مفتوحة لأشهر',
      'كنت تتفاعلين مع العطور والكحول، وهذه تخلو منهما وتطبع أنها تخلو منهما',
      'أردت النسب المئوية، فهي كلها مطبوعة على هذه الصفحة',
    ],
    notTitle: 'ابحثي عن غيرها إذا',
    notList: [
      'كان التصبّغ همّك الأول — فـ SWS هي القارورة المخصّصة له',
      'كانت الخطوط والشد هي المشكلة — فتلك AWS، أو CTS للملمس',
      'كنت تعالجين الدهون والبثور، وهذا ما وُجدت له PCS',
      'كنت حاملاً أو مرضعة، وهو ما تطلب العلبة نفسها تجنّبه',
      'كانت لديك حساسية تجاه الأسماك، فالكولاجين هنا بحري',
    ],
    note:
      'للاستخدام الخارجي فقط. تجنّبي العينين والأغشية المخاطية، واشطفي بماء بارد عند الملامسة. أوقفي الاستخدام واستشيري طبيباً عند حدوث احمرار أو تورّم أو تهيّج.',
  },
  faq: {
    eyebrow: 'أسئلة',
    title: 'قبل الشراء.',
    items: [
      {
        q: 'ماذا ترمز إليه CVS فعلاً؟',
        a: 'Concentrated Vitality Solution. مطبوعة على واجهة العلبة وعلى كل قارورة تحت الرمز. والوظيفة المطبوعة بجانبها هي تغذية البشرة.',
      },
      {
        q: 'هل أستعملها مع رولر GENOSYS؟',
        a: 'هذا هو الاقتران الذي يصمّم GENOSYS نظامه حوله، والمجموعة تُباع للعيادات التي تفعل ذلك تماماً. أما هذه العلبة فتعطي النسخة البسيطة — نظّف، افتح، طبّق، اترك حتى يُمتَص — فإن كان المختص قد وضع لك بروتوكولاً فاتّبعي بروتوكوله لا بروتوكولنا.',
      },
      {
        q: 'هل هي للاستعمال الاحترافي فقط؟',
        a: 'هي خط احترافي: كلمة PROFESSIONAL مطبوعة على كل قارورة، والشكل شكل عيادي. لا شيء فيها مقيّد، فلا مانع من استعمالها في المنزل بنصيحة المختص، وهكذا يستعملها معظم عملائنا فعلاً.',
      },
      {
        q: 'ماذا يفعل sh-Polypeptide-7؟',
        a: 'هو ببتيد بشري مُعاد تركيبه مبني على تسلسل السوماتوتروبين ويُنتَج بالتخمير، وتصنّفه قاعدة COSING ضمن المكوّنات الحامية للبشرة. أما تجديد الأنسجة وإنتاج الخلايا فادعاءات دوائية تخصّ الطب لا مستحضرات التجميل؛ وما يقدّمه هذا الببتيد هنا تسلسل واحد لا يتغيّر.',
      },
      {
        q: 'أيّ الست أختار؟',
        a: 'طابقي القارورة مع الشكوى. المتعبة والجافة هي CVS، والمجفّفة الباهتة هي HES، والمصطبغة SWS، وذات الخطوط AWS، والخشنة أو المترهّلة CTS، والدهنية أو ذات البثور PCS. وجدول المجموعة أعلاه يضعها جنباً إلى جنب.',
      },
      {
        q: 'كم تكفي العلبة؟',
        a: 'عشر جلسات، قارورة لكل واحدة. وغير مفتوحة تبقى ثلاث سنوات من تاريخ الإنتاج، وتاريخ انتهاء الصلاحية مطبوع على العلبة.',
      },
      {
        q: 'هل هي آمنة أثناء الحمل؟',
        a: 'تطلب العلبة تجنّبها أثناء الحمل والرضاعة، فننقل ذلك إليك بدل أن نصرفك عنه. والسبب مستخلصا الشيح. خذي قائمة المكوّنات إلى من يتابع حالتك.',
      },
    ],
  },
  details: {
    eyebrow: 'التفاصيل',
    title: 'المواصفات.',
    rows: [
      { label: 'الشكل', value: 'محلول يبقى على البشرة في قارورة زجاجية مُحكمة سعة 2 مل' },
      { label: 'العبوة', value: '2 مل × 10 قوارير' },
      { label: 'الوظيفة', value: 'تغذية البشرة، الوظيفة المسجّلة في كوريا' },
      { label: 'القاعدة', value: 'بيوتيلين جلايكول 12.5% وجليسرين 11.5%، أي 23.97% معاً' },
      { label: 'المواد الفعالة', value: 'خميرة صويا 2.5%، بانثينول 0.5%، ألانتوين 0.1%، هيالورونات الصوديوم 0.1%، كولاجين بحري 0.1%' },
      { label: 'الببتيدات', value: 'sh-Polypeptide-7 جزء واحد في المليون، palmitoyl tripeptide-1 نصف جزء في المليون' },
      { label: 'الحموضة', value: '5.94، داخل مواصفة 6.00 ± 1.00' },
      { label: 'خالٍ من', value: 'البارابين، الإيثانول، الأصباغ الصناعية والعطور الصناعية' },
      { label: 'مدة الصلاحية', value: 'ثلاث سنوات غير مفتوحة، وتاريخ انتهاء الصلاحية مطبوع على العلبة' },
      { label: 'الاختبارات', value: 'مختبر جلدياً، وكل دفعة تُختبَر للحموضة والكثافة والعدّ الميكروبي' },
      { label: 'الصانع', value: 'DTS MG Co., Ltd.، كوريا الجنوبية' },
    ],
  },
  closing: {
    title: 'عشر جلسات، مُحكمة واحدة تلو الأخرى.',
    body: 'القارورة المغذّية في مجموعة Power Solution، وتركيبتها كاملة وكل نسبة فيها مطبوعة أعلاه، دون إخفاء شيء.',
  },
  backToProducts: 'المنتجات',
}

const RU: PowerSolutionCopy = {
  eyebrow: 'Профессиональная ампула · Десять запаянных флаконов',
  headline: 'Тот флакон, к которому тянутся, когда коже нужно питание.',
  subheadline:
    'CVS — это Concentrated Vitality Solution, и Корея регистрирует её функцию двумя словами: питание кожи. Это универсальная ампула линии Power Solution из шести позиций, та, что нужна уставшей и сухой коже, а не пигментированной, жирной или с морщинами. Почти четверть флакона — увлажнители, и именно поэтому полные 2 мл спокойно ложатся на лицо сразу после процедуры. Десять запаянных стеклянных флаконов, по одному на процедуру.',
  heroBullets: [
    'Почти четверть — увлажнители, поэтому полные 2 мл остаются комфортными на обработанной коже',
    'Соевый фермент 2,5% и пантенол 0,5%, оба в реальной рабочей дозировке',
    'Без парабенов, этанола, искусственных красителей и отдушки',
    'Десять запаянных стеклянных флаконов, поэтому между лицами ничего не окисляется',
  ],
  badges: ['Дерматологически протестировано', 'Сделано в Корее', 'Без парабенов', 'Без добавленной отдушки'],
  packSize: '10 флаконов · по 2 мл',
  usageNote: 'Один флакон на процедуру',
  addToBag: 'В корзину',
  adding: 'Добавляем…',
  added: 'Добавлено',
  inBag: 'В корзине',
  viewBag: 'Открыть корзину',
  loginToShop: 'Войдите, чтобы купить',
  outOfStock: 'Нет в наличии',
  vatIncluded: 'НДС включён',
  freeDelivery: 'Бесплатная доставка по ОАЭ',
  decimalSeparator: ',',
  stats: [
    { value: '24%', label: 'Флакона — увлажнители, ещё до подсчёта активных веществ' },
    { value: '2,5%', label: 'Соевый фермент, самый крупный актив состава' },
    { value: '4', label: 'Исключённые добавки: парабены, этанол, искусственные красители и отдушка' },
    { value: '10 × 2 мл', label: 'Запаянные стеклянные флаконы, вскрываются по одному' },
  ],
  solution: {
    eyebrow: 'Ампула',
    title: 'Три буквы, за которыми что-то стоит.',
    body:
      'На каждом флаконе линии Power Solution стоит код, и коды здесь не украшение. Каждый из них — зарегистрированное название продукта, рядом с которым напечатана одна задача. CVS — это Concentrated Vitality Solution, и функция на упаковке одна: питание кожи. Она снабжает, оживляет и увлажняет. В этом всё задание, и поэтому этот флакон используют чаще остальных.',
    points: [
      {
        title: 'Один флакон, одна процедура',
        body:
          'Два миллилитра, запаянные в стекло под обжимной крышкой и вскрываемые у кресла. Ничего не переливают, ничего не хранят и ничего не окисляется между лицами. Десять флаконов — это десять полных доз.',
      },
      {
        title: 'Ничего агрессивного в составе',
        body:
          'Ни отдушки, ни этанола, ни красителя, и pH 5,94 — то есть близко к коже. На лице, которое только что прошло процедуру, отсутствие компонента значит не меньше, чем его наличие.',
      },
      {
        title: 'Остаётся на коже',
        body:
          'Несмываемый раствор. Он остаётся на коже и работает на ней, как уходовый крем, в четыре шага: очистить, вскрыть, нанести, дать впитаться.',
      },
    ],
    figureAlt: 'Один стеклянный флакон POWER SOLUTION CVS на 2 мл с надписью Concentrated Vitality Solution',
  },
  formula: {
    eyebrow: 'Состав',
    title: 'Куда на самом деле уходит флакон.',
    intro:
      'Каждый процент ниже — готовая концентрация во флаконе, а не догадка о том, что означает название в начале списка ингредиентов. Вода здесь носитель, 70,5% флакона, как в любой сыворотке на свете. Отличают этот флакон остальные 29,5%.',
    baseTitle: 'База — 23,97% флакона',
    baseRows: ['Бутиленгликоль', 'Глицерин'],
    baseNote:
      'Два увлажнителя, вместе почти четверть флакона. Это много, и это сделано намеренно: именно они разносят активные вещества по всему лицу и оставляют его смягчённым, а не стянутым.',
    activesTitle: 'Активные вещества',
    activesRows: [
      'Фильтрат ферментации лактобактерий/соевого молока',
      'Пантенол',
      'Гиалуронат натрия',
      'Аллантоин',
      'Гидролизованный коллаген',
      'Экстракт каллуса винограда',
      'Экстракт каллуса розы',
      'Бета-глюкан',
    ],
    activesNote:
      'Пантенол 0,5% и аллантоин 0,1% — оба в верхней части того диапазона, в котором их обычно применяют. Каждая группа построена в своём масштабе, чтобы активы оставались читаемыми рядом с базой.',
    traceTitle: 'И пептиды',
    traceBody:
      'Именно на них построено само название Power Solution: sh-Polypeptide-7 в концентрации 1 ppm и palmitoyl tripeptide-1 в концентрации 0,5 ppm. Пептиды работают в частях на миллион по самой своей природе, и экспертная панель CIR указывает типичное косметическое применение семейства palmitoyl tripeptide ниже 10 ppm.',
  },
  freeFrom: {
    eyebrow: 'Продуманная формула',
    title: 'Четыре добавки, которых здесь нет.',
    body:
      'В формуле нет четырёх распространённых добавок; каждое исключение проверено непосредственно по актуальному составу.',
    items: [
      'Парабены',
      'Этанол',
      'Искусственные красители',
      'Искусственная отдушка',
    ],
    note:
      'Остановиться стоит на этаноле. Очень многие профессиональные ампулы используют спирт, чтобы разжижить раствор и ускорить высыхание, и именно он щиплет кожу сразу после процедуры.',
    figureAlt: 'Открытая коробка POWER SOLUTION CVS с десятью запаянными флаконами',
  },
  range: {
    eyebrow: 'Линия',
    title: 'Шесть флаконов, по одной задаче на каждый.',
    intro:
      'Power Solution — это набор, и каждый выбирают под ту кожу, что перед вами. Один формат, одна цена, один и тот же запаянный флакон 2 мл — и своя задача, напечатанная на каждой коробке. CVS для кожи, которая просто устала.',
    thisOne: 'Этот',
    entries: [
      { name: 'HA Volume Enhancing Solution', forWhat: 'Наполненность и мгновенное увлажнение' },
      { name: 'Concentrated Vitality Solution', forWhat: 'Питание уставшей сухой кожи' },
      { name: 'Cytokine Concentrate Solution', forWhat: 'Текстура, плотность и упругость' },
      { name: 'Problem Control Solution', forWhat: 'Избыток себума и высыпания' },
      { name: 'Skin Depigmenting & Whitening Solution', forWhat: 'Пигментация и неровный тон' },
      { name: 'Anti-Wrinkle Solution', forWhat: 'Морщины и потеря упругости' },
    ],
    viewProduct: 'Открыть',
    note: 'Все шесть — 2 мл × 10 флаконов по одной цене, так что выбор о коже, а не о бюджете.',
  },
  howTo: {
    eyebrow: 'Как использовать',
    title: 'Один флакон, от начала до конца.',
    frequency: 'Один флакон на процедуру',
    steps: [
      { title: 'Очищение', body: 'Тщательно умойтесь и промокните лицо насухо. Упаковка начинается отсюда, и в день процедуры вам стоит начать так же.' },
      { title: 'Вскройте флакон', body: 'Отломите обжимную крышку. Каждый флакон 2 мл рассчитан на одно применение, в коробке их десять.' },
      { title: 'Нанесение', body: 'Распределите раствор по всему лицу. Два миллилитра — это больше, чем кажется: хватит на лицо и шею, не растягивая тонким слоем.' },
      { title: 'Дайте впитаться', body: 'Средство несмываемое. Подождите минуту, прежде чем наносить что-то поверх.' },
      { title: 'Затем крем', body: 'Или то, что назначил ваш специалист. Ни кислот, ни отдушки в этом флаконе нет, поэтому он не ограничивает следующий шаг.' },
      { title: 'Остаток не хранят', body: 'Вскрытый флакон не закрывается повторно, а раствор рассчитан на свежее применение, а не на хранение. Именно поэтому их десять.' },
    ],
    note:
      'Избегайте применения во время беременности и грудного вскармливания — это предупреждение печатает сама упаковка, из-за двух экстрактов полыни. В составе также морской коллаген, поэтому не используйте при аллергии на рыбу.',
  },
  actives: {
    eyebrow: 'Что внутри',
    title: 'Ингредиенты, с настоящими цифрами.',
    intro: 'Каждый процент здесь — готовая концентрация во флаконе, а не вывод из места названия в списке.',
    cards: [
      {
        name: 'sh-Polypeptide-7, 1 ppm',
        body:
          'Фирменный пептид линии. Одноцепочечный рекомбинантный человеческий пептид, полученный ферментацией по синтезированной копии человеческого гена соматотропина, поэтому каждая партия приходит с одной и той же последовательностью из 217 аминокислот, а не меняется, как собранный экстракт.',
      },
      {
        name: 'Palmitoyl Tripeptide-1, 0,5 ppm',
        body:
          'Три аминокислоты, закреплённые на жирной кислоте, чтобы пептид оставался там, куда нанесён. Один из самых изученных и самых распространённых пептидов в косметике.',
      },
      {
        name: 'Фильтрат ферментации лактобактерий/соевого молока, 2,5%',
        body:
          'Соевое молоко, сброженное лактобактериями и отфильтрованное. При 2,5% это с большим отрывом самый крупный актив во флаконе, и именно отсюда берётся питание.',
      },
      {
        name: 'Пантенол, 0,5%',
        body:
          'Провитамин B5 в полной рабочей дозировке. Удерживает воду в коже и снимает стянутость, которая следует за процедурой.',
      },
      {
        name: 'Аллантоин, 0,1%',
        body:
          'Успокаивающий компонент с десятилетиями применения за плечами, здесь — в верхней части того диапазона, в котором его обычно применяют.',
      },
      {
        name: 'Гиалуронат натрия, 0,1%',
        body:
          'Удерживает воду во много раз больше собственного веса на поверхности кожи — именно это сохраняет обработанное лицо наполненным, а не осунувшимся.',
      },
      {
        name: 'Гидролизованный коллаген, 0,1%',
        body:
          'Морской коллаген, расщеплённый достаточно мелко, чтобы лежать на коже увлажняющей плёнкой. Источник — рыба.',
      },
      {
        name: 'Каллус винограда и розы, по 0,03%',
        body:
          'Растительные стволовые культуры Vitis vinifera и Rosa damascena, выращенные в лаборатории, а не собранные в поле, — именно поэтому они одинаковы от партии к партии.',
      },
      {
        name: 'Корейские растительные экстракты',
        body:
          'Зелёный чай, юдзу, полынь, хауттюйния, корень шлемника и вода хиноки. Каждое названо полностью, а не спрятано за придуманным названием комплекса.',
      },
    ],
    inciTitle: 'Полный список ингредиентов (INCI)',
    inciNote:
      'Каждый ингредиент, в том же порядке, что и на коробке у вас в руках. pH проверяют в каждой партии, последняя дала 5,94 внутри спецификации 6,00 ± 1,00.',
  },
  suited: {
    eyebrow: 'Честно',
    title: 'Кому это подойдёт.',
    forTitle: 'Берите, если',
    forList: [
      'Вы ведёте процедуры и вам нужна питательная базовая ампула, которая подходит почти каждому лицу',
      'Кожа уставшая, тусклая и обезвоженная, а не пигментированная, жирная или с морщинами',
      'Вам нужна запаянная доза на одно применение, а не флакон, который стоит открытым месяцами',
      'Вы реагируете на отдушку и спирт, а здесь их нет и об этом написано на упаковке',
      'Вам нужны проценты — здесь они все до одного',
    ],
    notTitle: 'Ищите другое, если',
    notList: [
      'Главная задача — пигментация: под неё зарегистрирована SWS',
      'Проблема в морщинах и упругости: это AWS, а для текстуры CTS',
      'Вы работаете с жирностью и высыпаниями, для этого есть PCS',
      'Вы беременны или кормите грудью — упаковка сама просит этого избегать',
      'У вас аллергия на рыбу, потому что коллаген здесь морской',
    ],
    note:
      'Только для наружного применения. Избегайте попадания в глаза и на слизистые, при попадании промойте прохладной водой. Прекратите применение и обратитесь к врачу при покраснении, отёке или раздражении.',
  },
  faq: {
    eyebrow: 'Вопросы',
    title: 'Перед покупкой.',
    items: [
      {
        q: 'Что на самом деле означает CVS?',
        a: 'Concentrated Vitality Solution. Это напечатано на лицевой стороне коробки и на каждом флаконе под кодом. Заявленная функция рядом — питание кожи.',
      },
      {
        q: 'Можно использовать с роллером GENOSYS?',
        a: 'Именно вокруг этой пары GENOSYS и строит свою систему, а линия продаётся в клиники, которые так и работают. Сама упаковка даёт простой вариант — очистить, вскрыть, нанести, дать впитаться, — так что если специалист составил вам протокол, следуйте его порядку, а не нашему.',
      },
      {
        q: 'Это только для профессионалов?',
        a: 'Это профессиональная линия: на каждом флаконе напечатано PROFESSIONAL, и формат клинический. Ничего ограниченного в составе нет, поэтому дома по рекомендации специалиста — нормально, и именно так её используют большинство наших покупателей.',
      },
      {
        q: 'Что делает sh-Polypeptide-7?',
        a: 'Это рекомбинантный человеческий пептид, построенный по последовательности соматотропина и полученный ферментацией; COSING относит его к защитным компонентам кожи. Восстановление тканей и производство новых клеток — лекарственные заявления, они относятся к медицине, а не к косметике; здесь пептид даёт последовательность, одинаковую в каждой партии.',
      },
      {
        q: 'Какую из шести выбрать?',
        a: 'Подбирайте флакон под жалобу. Уставшая и сухая — CVS, обезвоженная и плоская — HES, пигментированная — SWS, с морщинами — AWS, шероховатая или потерявшая тонус — CTS, жирная или с высыпаниями — PCS. Таблица линии выше ставит их рядом.',
      },
      {
        q: 'На сколько хватает коробки?',
        a: 'На десять процедур, по флакону на каждую. Невскрытая она хранится три года с даты производства, срок годности напечатан на коробке.',
      },
      {
        q: 'Безопасно при беременности?',
        a: 'Упаковка просит избегать применения при беременности и лактации, и мы это передаём, а не отговариваем вас. Причина — два экстракта полыни. Покажите список ингредиентов тому, кто вас ведёт.',
      },
    ],
  },
  details: {
    eyebrow: 'Детали',
    title: 'Характеристики.',
    rows: [
      { label: 'Формат', value: 'Несмываемый раствор в запаянном стеклянном флаконе 2 мл' },
      { label: 'Упаковка', value: '2 мл × 10 флаконов' },
      { label: 'Функция', value: 'Питание кожи — функция, зарегистрированная в Корее' },
      { label: 'База', value: 'Бутиленгликоль 12,5% и глицерин 11,5%, вместе 23,97%' },
      { label: 'Активы', value: 'Соевый фермент 2,5%, пантенол 0,5%, аллантоин 0,1%, гиалуронат натрия 0,1%, морской коллаген 0,1%' },
      { label: 'Пептиды', value: 'sh-Polypeptide-7 1 ppm, palmitoyl tripeptide-1 0,5 ppm' },
      { label: 'pH', value: '5,94, в пределах спецификации 6,00 ± 1,00' },
      { label: 'Без', value: 'Парабенов, этанола, искусственных красителей и искусственной отдушки' },
      { label: 'Срок годности', value: 'Три года невскрытым, срок годности напечатан на коробке' },
      { label: 'Тестирование', value: 'Дерматологически протестировано, и каждая партия проверяется по pH, плотности и микробиологии' },
      { label: 'Производитель', value: 'DTS MG Co., Ltd., Южная Корея' },
    ],
  },
  closing: {
    title: 'Десять процедур, запаянных по одной.',
    body: 'Питательный флакон линии Power Solution: полный состав и все проценты выше, без умолчаний.',
  },
  backToProducts: 'Продукты',
}

const BY_LOCALE: Record<PowerSolutionLocale, PowerSolutionCopy> = {
  en: EN,
  ar: { ...AR, ...CVS_AR_COPY },
  ru: { ...RU, ...CVS_RU_COPY },
}

export function getPowerSolutionCopy(locale: string): PowerSolutionCopy {
  return BY_LOCALE[(locale as PowerSolutionLocale) in BY_LOCALE ? (locale as PowerSolutionLocale) : 'en']
}

export const CVS_VARIANT: PowerSolutionVariant = {
  paletteClass: 'ps-cvs',
  getCopy: getPowerSolutionCopy,
  formulaBase: FORMULA_BASE,
  formulaActives: FORMULA_ACTIVES,
  fullInci: FULL_INCI,
  vialImage: '/images/Second/cvs_big2.jpg',
  boxImage: '/images/Second/cvs_big1.jpg',
  // Three slides: the hero on a lilac-grey sweep, then the box and a vial on
  // pure white. The two on white are blended down to the stage tint so the card
  // holds one colour across the rail.
  blendGallerySlides: new Set(['/images/Second/cvs_big1.jpg', '/images/Second/cvs_big2.jpg']),
  // The hero is on that sweep, not on white, so it must never be multiplied.
  heroOnWhite: false,
}
