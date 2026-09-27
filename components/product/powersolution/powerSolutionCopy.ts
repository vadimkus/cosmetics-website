/**
 * Bespoke copy for the POWER SOLUTION CVS page (product 5), and the types the six
 * Power Solution pages share.
 *
 * Same self-contained per-locale pattern as the other ampoules. RU and AR live in
 * cvsLocalizedCopy.ts.
 *
 * SOURCING RULE FOR THIS FILE
 *
 * Four documents, and between them they cover every figure on this page:
 *
 *   Registration DOC/Formula_up/Formula-GENOSYS POWER SOLUTION CVS .pdf
 *       The quantitative formula, as finished concentrations. Signed DTS MG,
 *       Narae Han. The SA aggregated table (p. 21) agrees line for line. The SA
 *       raw-material table lists premixes, not ingredients. The 2011 Quali-quanti
 *       sheets in Intertek_folder are a superseded formula and are ignored.
 *   Registration DOC/Artwork/[GENOSYS]POWER SOLUTION CVS.pdf
 *       Carton text: "a highly concentrated solution for skin nourishment. It
 *       supplies nutrients to the skin, revitalizes and hydrates the skin", the
 *       Korean line (supplies moisture and nourishment for glow and vitality), the
 *       5-Free panel, the four application pictograms and the precautions.
 *   Registration DOC/SA/SA-GENOSYS POWER SOLUTION CVS.pdf
 *       January 2021, DTS MG. Leave-on face product, adults; the collagen is fish.
 *   Registration DOC/COA/COA-GENOSYS POWER SOLUTION CVS(L1036B).pdf
 *       pH 5.94 against 6.00 +/- 1.00, transparent viscous liquid, three years from
 *       production to expiry.
 *
 * THE FORMULA, as finished concentrations:
 *
 *   Aqua (Water)                          70.5259%
 *   Butylene Glycol                       12.4850%
 *   Glycerin                              11.4800%   base together 23.965%
 *   Lactobacillus/Soymilk Ferment Filtrate 2.5000%   <- largest active
 *   1,2-Hexanediol                         2.1190%
 *   Panthenol                              0.5000%
 *   Sodium Hyaluronate                     0.1002%
 *   Allantoin                              0.1000%
 *   Hydrolyzed Collagen                    0.1000%   marine
 *   Grape Callus Culture Extract           0.0300%
 *   Rosa Damascena Callus Culture Extract  0.0300%
 *   Beta-Glucan                            0.0200%
 *   Lecithin                               0.0050%
 *   sh-Polypeptide-7                       0.0001%   =  1 ppm
 *   Palmitoyl Tripeptide-1                 0.00005%  =  0.5 ppm (SA aggregated table)
 *
 * sh-Polypeptide-7 is a somatotropin-sequence recombinant peptide. It is NOT an
 * IGF-1 analogue (that is sh-Oligopeptide-2, in none of the six). Do not let it back.
 *
 * CLAIMS THE PAGE MAKES, AND WHERE THEY COME FROM
 *   Moisture and nourishment for glow
 *     and vitality; supplies nutrients,
 *     revitalises, hydrates                  carton English and Korean panels
 *   Function: skin nourishment               carton
 *   23.97% moisture base, and every %        Formula_up
 *   No parabens, ethanol, artificial pigment
 *     or artificial fragrance                carton exclusions panel
 *   pH 5.94 inside 5.00 to 7.00              COA
 *   Transparent viscous liquid               COA appearance
 *   Three-year shelf life                    COA production-to-expiry span
 *   Dermatologically tested, made in Korea   carton
 *   Avoid in pregnancy and lactation         carton precautions (artemisia)
 *   Marine collagen, fish allergy            SA
 *
 * DELIBERATE OMISSIONS - do not add these without a document:
 *   - MICRONEEDLING OR A ROLLER. The carton's application is four pictograms:
 *     cleanse, open, apply, absorb. The Russian carton panel invents a
 *     dermaroller protocol, regeneration and vessel claims; logged as a pack
 *     correction and used in no locale.
 *   - "5-FREE". The carton prints it, but its fifth exclusion, artificial
 *     surfactant, was ruled out of the RU and AR copy by the product 5 audit
 *     (lecithin and ethylhexylglycerin are on the list), so no locale uses it.
 *   - FRAGRANCE-FREE. Chamaecyparis Obtusa Water is a fragrance ingredient.
 *   - TISSUE REPAIR, CELL PRODUCTION, REGENERATION. The carton's peptide panel
 *     says so; it is drug register for a cosmetic and stays off.
 *   - "THE MOST-USED VIAL" or any efficacy figure: no document measures either.
 *   - LOT CODES, specific gravity, fill volume, microbial counts and the contract
 *     manufacturer. DTS MG only.
 *
 * IMAGES. The "Vitality, concentrated." campaign, public/images/cvs_campaign/:
 * main.jpg is the closed carton and one vial on white, the family angle shared with
 * HES, CTS, PCS, SWS and AWS; s1-s12 are the claim slides on warm coral and golden
 * sunlight, every plate generated in CapCut and every product slide re-shot there
 * as one photograph, with RU and AR renders swapped in by
 * lib/localizedProductImages.ts. The old cvs-hero.jpg, CVS.jpg and
 * Second/cvs_big*.jpg stay on disk for order history.
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
   * The two figures above are full-bleed campaign slides rather than packs on
   * white: square, cropped to fill, never multiplied (a slide's own backdrop
   * would muddy into the tint), and swapped per locale through
   * lib/localizedProductImages.ts because they carry type.
   */
  figureSlides?: boolean
  /**
   * Further campaign slides set into the sections they illustrate, as a row of
   * squares after the section's own content. Localized like the figures above.
   * A variant without it renders exactly as before.
   */
  sectionSlides?: Partial<Record<'formula' | 'howTo' | 'suited' | 'details', readonly string[]>>
  /**
   * Gallery slides to multiply into the stage tint. Every slide in these
   * galleries is square and so fills the square stage edge to edge, which means
   * a slide shot on pure white turns the whole card into a stark white block
   * unless it is multiplied down to the tint.
   *
   * Only worth doing where it makes the rail consistent. The campaign galleries
   * are full-bleed slides and blend none.
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
  headline: 'Vitality, concentrated.',
  subheadline:
    'POWER SOLUTION CVS, Concentrated Vitality Solution, is the nourishing vial of the range: a highly concentrated solution that supplies moisture and nutrients to tired, dry skin, for glow and vitality. Nearly a quarter of the vial is moisture base, carrying soy ferment at 2.5% and panthenol at 0.5%. Ten sealed 2 ml vials, one per treatment.',
  heroBullets: [
    'Moisture and nourishment for tired, dry skin, for glow and vitality',
    'A 23.97% moisture base, so a full 2 ml feels cushioning, never tight',
    'Soy ferment at 2.5% and panthenol at 0.5%, both at real working doses',
    'Ten sealed glass vials, so every treatment starts fresh',
  ],
  badges: ['Dermatologically tested', 'Made in Korea', 'Soy ferment 2.5%', 'Skin nourishment'],
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
    { value: '23.97%', label: 'Butylene glycol and glycerin, the moisture base' },
    { value: '2.5%', label: 'Soy ferment, the largest active in the vial' },
    { value: '0.5%', label: 'Panthenol, provitamin B5 at a full working dose' },
    { value: '10 × 2 ml', label: 'Sealed glass vials, opened one at a time' },
  ],
  solution: {
    eyebrow: 'The ampoule',
    title: 'For skin that needs feeding.',
    body:
      'CVS stands for Concentrated Vitality Solution, and it is the Power Solution for nourishment. When skin looks tired, dull and dry, this is the vial to open: it supplies moisture and nutrients, revitalises and hydrates, for skin with glow and vitality, treatment after treatment.',
    points: [
      {
        title: 'A quarter of it is moisture',
        body:
          'Butylene glycol and glycerin make up 23.97% of the vial. That is what lets a full 2 ml spread across the whole face and leave it cushioned rather than tight.',
      },
      {
        title: 'One vial, one treatment',
        body:
          'Two millilitres, sealed in glass and opened only when you need it. Nothing is decanted, nothing is kept, and nothing sits open between treatments. Ten vials, ten full doses.',
      },
      {
        title: 'Gentle on treated skin',
        body:
          'No parabens, no ethanol, no artificial colour and no artificial fragrance, at a mildly acidic pH of 5.94. On a face fresh from a treatment, what a vial leaves out matters as much as what it puts in.',
      },
    ],
    figureAlt: 'Tired skin? Feed it: a woman in warm sunlight, from the POWER SOLUTION CVS campaign',
  },
  formula: {
    eyebrow: 'The formula',
    title: 'Every percentage, in the vial.',
    intro:
      'The finished concentration of everything that matters, charted. Water carries the formula at 70.5%; the rest is a rich moisture base and the actives, led by a 2.5% soy ferment.',
    baseTitle: 'The base - 23.97% of the vial',
    baseRows: ['Butylene Glycol', 'Glycerin'],
    baseNote:
      'Two humectants, nearly a quarter of the vial between them. They draw water into the skin and hold it there, which is why CVS feels cushioning on a face that has just been treated.',
    activesTitle: 'The actives',
    activesRows: [
      'Soy Ferment Filtrate',
      'Panthenol',
      'Sodium Hyaluronate',
      'Allantoin',
      'Marine Collagen',
      'Grape Callus Culture Extract',
      'Rose Callus Culture Extract',
      'Beta-Glucan',
    ],
    activesNote:
      'Soy ferment leads at 2.5%, and panthenol at 0.5% is a full working dose of provitamin B5. Each group is charted on its own scale, so the actives stay readable beside the base.',
    traceTitle: 'And the peptides',
    traceBody:
      'sh-Polypeptide-7 at 1 ppm and palmitoyl tripeptide-1 at 0.5 ppm: the parts-per-million doses peptides are made to work at. sh-Polypeptide-7 is the signature peptide of the range, grown by fermentation, so every batch carries the same 217-amino-acid sequence.',
  },
  freeFrom: {
    eyebrow: 'Left out',
    title: 'Four things it does without.',
    body:
      'No parabens, no ethanol, no artificial colour and no artificial fragrance: a clean base for a vial that goes straight onto freshly treated skin.',
    items: ['Parabens', 'Ethanol', 'Artificial pigment', 'Artificial fragrance'],
    note:
      'Its soft natural scent comes from hinoki cypress water, a plant fragrance ingredient, so it is not a fragrance-free vial. No artificial fragrance is added.',
    figureAlt: 'Nothing harsh: the POWER SOLUTION CVS vial in warm sunlight, from the campaign',
  },
  range: {
    eyebrow: 'The range',
    title: 'Six vials, one job each.',
    intro:
      'The Power Solutions are a set: the same sealed 2 ml format and the same price, with a different job for each. CVS is the one for skin that is tired and dry.',
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
    note: 'All six are 2 ml × 10 vials at the same price, so you choose by skin, not by budget.',
  },
  howTo: {
    eyebrow: 'How to use',
    title: 'One vial, start to finish.',
    frequency: 'One vial per treatment',
    steps: [
      { title: 'Cleanse', body: 'Wash the face and pat it dry.' },
      { title: 'Open one vial', body: 'Snap the cap. Each 2 ml vial is one treatment, and there are ten in the box.' },
      { title: 'Apply', body: 'Smooth the solution over the face, keeping clear of the eyes. Two millilitres covers the whole face generously.' },
      { title: 'Let it absorb', body: 'Pat gently until it sinks in. It is a leave-on treatment, so there is nothing to rinse.' },
      { title: 'Follow with a moisturiser', body: 'Finish with your moisturiser, or with the next step your practitioner has set.' },
      { title: 'Use it fresh', body: 'An opened vial does not reseal, so use it all in one go. That is why there are ten.' },
    ],
    note:
      'Avoid during pregnancy and breastfeeding: the formula contains two artemisia extracts. It also contains marine collagen, so avoid it if you are allergic to fish.',
  },
  actives: {
    eyebrow: 'What is in it',
    title: 'What does the work.',
    intro: 'The ingredients behind softer, comfortable, glowing skin, each with its finished concentration.',
    cards: [
      {
        name: 'Soy ferment filtrate, 2.5%',
        body: 'The largest active by weight. Soy milk fermented with lactobacillus and filtered, to feed and condition the skin surface.',
      },
      {
        name: 'Panthenol, 0.5%',
        body: 'Provitamin B5 at a full working dose. It holds water in the skin and eases the tight feeling after a treatment.',
      },
      {
        name: 'Sodium hyaluronate 0.1% and marine collagen 0.1%',
        body: 'Hyaluronic acid draws in water and hydrolysed marine collagen holds it at the surface, for a plump, dewy look.',
      },
      {
        name: 'Allantoin 0.1% and beta-glucan 0.02%',
        body: 'Two comfort ingredients that keep freshly treated skin soft and calm.',
      },
      {
        name: 'Two peptides',
        body: 'sh-Polypeptide-7 at 1 ppm and palmitoyl tripeptide-1 at 0.5 ppm, the signature peptides of the Power Solution range.',
      },
      {
        name: 'Grape and rose callus cultures, 0.03% each',
        body: 'Plant cell cultures from Vitis vinifera and Rosa damascena, grown in the lab so they are the same batch after batch.',
      },
      {
        name: 'The Korean botanicals',
        body: 'Green tea, yuzu, mugwort, houttuynia, baicalensis root and hinoki cypress water, each named in full.',
      },
    ],
    inciTitle: 'Full ingredient list (INCI)',
    inciNote: 'Every ingredient, in the same order as printed on the carton.',
  },
  suited: {
    eyebrow: 'Is it for you?',
    title: 'Who it is for.',
    forTitle: 'Choose it if',
    forList: [
      'Skin looks tired, dull or dry and needs feeding',
      'You want a rich moisture base without a heavy cream',
      'You want a gentle vial for skin fresh from a treatment',
      'You prefer a sealed single-use vial to a bottle that sits open',
    ],
    notTitle: 'Look elsewhere if',
    notList: [
      'Lines or loss of firmness are the concern: that is AWS',
      'Pigmentation is the concern: that is SWS',
      'You are treating oil and breakouts: that is PCS',
      'Rough texture is the brief: that is CTS, or HES for instant plumping',
      'You are pregnant or breastfeeding',
      'You are allergic to fish: the collagen in this one is marine',
      'You need a fragrance-free vial: hinoki water is in this one',
    ],
    note:
      'For external use only. Keep it away from the eyes and mucous membranes, and rinse with cool water if it gets there. Stop and see a doctor if redness, swelling or irritation appear.',
  },
  faq: {
    eyebrow: 'Questions',
    title: 'Before you buy.',
    items: [
      {
        q: 'What does CVS stand for?',
        a: 'Concentrated Vitality Solution, the nourishing vial of the Power Solution range. The name is on the front of the box and on every vial, and the function printed beside it is skin nourishment.',
      },
      {
        q: 'What will I notice?',
        a: 'Skin that feels soft, supple and comfortable as the solution absorbs, and looks fresher and more radiant. Treatment after treatment, CVS supplies moisture and nutrients for glow and vitality.',
      },
      {
        q: 'Can I use it straight after a treatment?',
        a: 'Yes, it is made for the treatment room. It leaves out parabens, ethanol and artificial fragrance, and its moisture base and panthenol keep freshly treated skin comfortable. If a practitioner has set you a protocol, follow theirs.',
      },
      {
        q: 'Can I use it at home?',
        a: 'Yes. It is a professional line, with "PROFESSIONAL" on every vial, and it is simple to use at home: cleanse, open, apply, absorb.',
      },
      {
        q: 'Which of the six should I pick?',
        a: 'Match the vial to the concern. Tired and dry is CVS, dehydrated and flat is HES, pigmentation is SWS, lines are AWS, rough texture is CTS, oil and breakouts are PCS. The range table above sets them side by side.',
      },
      {
        q: 'How long does a box last?',
        a: 'Ten treatments, one vial each. Unopened it keeps for three years, with the expiry date on the box.',
      },
      {
        q: 'Can I use it in pregnancy?',
        a: 'Avoid it during pregnancy and breastfeeding. The formula contains two artemisia extracts, so ask your doctor before using it.',
      },
    ],
  },
  details: {
    eyebrow: 'The detail',
    title: 'At a glance.',
    rows: [
      { label: 'Format', value: 'Leave-on solution in a sealed 2 ml glass vial' },
      { label: 'Pack', value: '2 ml × 10 vials' },
      { label: 'Made for', value: 'Moisture and nourishment for tired, dry skin' },
      { label: 'Function', value: 'Skin nourishment' },
      { label: 'Moisture base', value: 'Butylene glycol 12.485% and glycerin 11.48%, 23.97% together' },
      { label: 'Largest active', value: 'Soy ferment filtrate 2.5%' },
      { label: 'Comfort', value: 'Panthenol 0.5%, allantoin 0.1%, sodium hyaluronate 0.1%, marine collagen 0.1%' },
      { label: 'Peptides', value: 'sh-Polypeptide-7 1 ppm, palmitoyl tripeptide-1 0.5 ppm' },
      { label: 'pH', value: '5.94, inside a 5.00 to 7.00 specification' },
      { label: 'Appearance', value: 'Transparent viscous liquid' },
      { label: 'Free from', value: 'Parabens, ethanol, artificial pigment and artificial fragrance' },
      { label: 'Shelf life', value: 'Three years unopened, with the expiry date on the box' },
      { label: 'Tested', value: 'Dermatologically tested' },
      { label: 'Made by', value: 'DTS MG Co., Ltd., South Korea' },
    ],
  },
  closing: {
    title: 'Vitality, concentrated, one vial at a time.',
    body: 'Ten sealed treatments of the Power Solution for nourishment: a rich moisture base, soy ferment and panthenol, for tired skin with glow and vitality.',
  },
  backToProducts: 'Products',
}

const BY_LOCALE: Record<PowerSolutionLocale, PowerSolutionCopy> = {
  en: EN,
  ar: CVS_AR_COPY,
  ru: CVS_RU_COPY,
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
  vialImage: '/images/cvs_campaign/s2.jpg',
  boxImage: '/images/cvs_campaign/s8.jpg',
  figureSlides: true,
  sectionSlides: {
    formula: ['s3', 's4', 's6', 's7'].map((s) => `/images/cvs_campaign/${s}.jpg`),
    howTo: ['s9', 's10'].map((s) => `/images/cvs_campaign/${s}.jpg`),
    suited: ['/images/cvs_campaign/s5.jpg'],
    details: ['s1', 's11', 's12'].map((s) => `/images/cvs_campaign/${s}.jpg`),
  },
  blendGallerySlides: new Set(),
  heroOnWhite: true,
}

if (
  EN.formula.baseRows.length !== FORMULA_BASE.length ||
  EN.formula.activesRows.length !== FORMULA_ACTIVES.length ||
  EN.range.entries.length !== RANGE.length
) {
  throw new Error('powerSolutionCopy: formula or range label arrays are out of step with their data')
}
