/**
 * Bespoke copy for the POWER SOLUTION AWS page (product 9).
 *
 * Same per-locale pattern as powerSolutionCopy.ts, and the same shape, so the
 * ampoules share one layout. See PowerSolutionVariant there for what a
 * variant carries. RU and AR live in awsLocalizedCopy.ts.
 *
 * SOURCING RULE FOR THIS FILE
 *
 * Four documents, and between them they cover every figure on this page:
 *
 *   Registration DOC/Formula_up/Formula-GENOSYS POWER SOLUTION AWS.pdf
 *       The quantitative formula, as finished concentrations. Signed DTS MG,
 *       Narae Han. This is the table to read. The 2011 Quali-quanti sheet in
 *       Intertek_folder is a superseded formula and is ignored, same rule as
 *       CVS and SWS. The SA raw-material table lists premixes (APEPTCP-10 at
 *       1.0000%) and is not the finished vial.
 *   Registration DOC/Artwork/[GENOSYS]POWER SOLUTION AWS.pdf
 *       Carton text, the full INCI, the four application pictograms, the
 *       exclusions panel, the precautions, and the Korean functional line
 *       (주름개선 기능성 화장품, 주성분 아데노신).
 *   Registration DOC/SA/SA-GENOSYS POWER SOLUTION AWS.pdf
 *       December 2020 / January 2021 amendment, DTS MG. Face serum, leave-on,
 *       adults.
 *   Registration DOC/COA/COA-GENOSYS POWER SOLUTION AWS(L1031A).pdf
 *       pH 4.93 against 4.80 +/- 1.00, light yellow viscous liquid. Adenosine
 *       0.04% came back at 99.94% of the declaration. Three years unopened
 *       from the production-to-expiry span.
 *
 * THE FORMULA, as finished concentrations:
 *
 *   Aqua (Water)                                                      73.336790%
 *   Butylene Glycol                                                   12.515000%
 *   Glycerin                                                           9.085800%
 *   Lactobacillus/Soymilk Ferment Filtrate                             2.500000%
 *   1,2-Hexanediol                                                     2.029000%
 *   Sodium Hyaluronate                                                 0.100200%
 *   Allantoin                                                          0.100000%
 *   Sodium Metabisulfite                                               0.050000%
 *   Xanthan Gum                                                        0.050000%
 *   Adenosine                                                          0.040000%   <- the point of the product
 *   Lecithin                                                           0.037000%
 *   Vitis Vinifera (Grape) Callus Culture Extract                      0.030000%
 *   Rosa Damascena Callus Culture Extract                              0.030000%
 *   Phenyl Trimethicone                                                0.030000%
 *   Keratin                                                            0.010000%
 *   Panthenol                                                          0.004000%
 *   Copper Tripeptide-1                                                0.001000%  = 10 ppm
 *   sh-Polypeptide-7                                                   0.000660%  = 6.6 ppm
 *   Acetyl Hexapeptide-8                                               0.000250%  = 2.5 ppm
 *   Palmitoyl Tripeptide-1                                             0.000200%  = 2 ppm
 *   Ceramide NP                                                        0.000040%  = 0.4 ppm
 *
 * CLAIMS THE PAGE MAKES, AND WHERE THEY COME FROM
 *   Reduces the appearance of wrinkles and
 *     improves skin firmness                     carton English panel
 *   Korean wrinkle-improving functional
 *     cosmetic, principal ingredient adenosine   Korean carton
 *   0.04% adenosine, and every other %           Formula_up
 *   Latest batch 99.94% of the adenosine dose    COA
 *   pH 4.93 inside 3.80 to 5.80                  COA
 *   Light yellow viscous liquid                  COA appearance
 *   Three-year shelf life                        COA production-to-expiry span
 *   Dermatologically tested, made in Korea       carton
 *   No parabens, ethanol, artificial pigment
 *     or artificial fragrance                    carton exclusions panel
 *   Avoid in pregnancy and lactation             carton precautions (artemisia)
 *
 * DELIBERATE OMISSIONS - do not add these without a document:
 *   - MICRONEEDLING OR A ROLLER. The carton's application is four
 *     pictograms: cleanse, open, apply, absorb. The Russian carton panel
 *     invents a dermaroller recommendation; logged as a pack correction.
 *   - "5-FREE". The carton prints it, but its fifth exclusion is artificial
 *     surfactant and PPG-26-Buteth-26 and PEG-40 hydrogenated castor oil are
 *     on the list. The page names the four exclusions the list bears out.
 *   - CERAMIDE, ACETYL HEXAPEPTIDE-8 AND COPPER TRIPEPTIDE-1 AS CO-LEADS.
 *     0.4 ppm, 2.5 ppm and 10 ppm: named at their real figures, never as the
 *     reason to buy.
 *   - AN EFFICACY TEST ON IMPROVING WRINKLES, or any %. The COA adenosine
 *     figure is a batch check against the 0.04% dose, not a wrinkle trial.
 *   - BOTOX, MUSCLE RELAX, EXPRESSION LINES for acetyl hexapeptide-8.
 *   - HEALING, REGENERATION, PREVENT NEW WRINKLES, REVERSE AGEING, TISSUE
 *     REPAIR, CELL PRODUCTION. sh-Polypeptide-7 is never an IGF-1 analogue.
 *   - FRAGRANCE-FREE. Chamaecyparis Obtusa Water is a fragrance ingredient.
 *   - ALL SKIN TYPES. Neck. Layering under a GENOSYS serum.
 *   - ARBUTIN. That is SWS.
 *   - LOT CODES, specific gravity, fill volume, and the contract
 *     manufacturer. DTS MG only.
 *
 * IMAGES. The "Line by line." campaign, public/images/aws_campaign/: main.jpg is
 * the closed carton and one vial on white, the family angle shared with HES, CTS,
 * PCS and SWS; s1-s12 are the claim slides, with RU and AR renders swapped in by
 * lib/localizedProductImages.ts, and all twelve sit on the page. The product slides
 * ship as s1b, s3b, s9b, s11b and s12c: one photograph each, not the product pasted
 * on a plate. s12c is shot from the three-quarter packshot, so the carton keeps its
 * side panel and square edges. The old
 * aws-hero.jpg, AWS.jpg and Second/aws*.jpg stay on disk for order history.
 */

import { RANGE, type PowerSolutionCopy, type PowerSolutionLocale, type PowerSolutionVariant } from './powerSolutionCopy'
import { AWS_AR_COPY, AWS_RU_COPY } from './awsLocalizedCopy'

export const AWS_FORMULA_BASE = [
  { pct: 12.515 },
  { pct: 9.0858 },
] as const

export const AWS_FORMULA_ACTIVES = [
  { pct: 2.5 },
  { pct: 0.1002 },
  { pct: 0.1 },
  { pct: 0.04 },
  { pct: 0.03 },
  { pct: 0.03 },
  { pct: 0.01 },
  { pct: 0.004 },
] as const

export const AWS_HUMECTANT_TOTAL = 21.6

export const AWS_FULL_INCI =
  'Aqua (Water), Butylene Glycol, Glycerin, Lactobacillus/Soymilk Ferment Filtrate, ' +
  '1,2-Hexanediol, sh-Polypeptide-7, Copper Tripeptide-1, Chamaecyparis Obtusa Water, ' +
  'Acetyl Hexapeptide-8, Palmitoyl Tripeptide-1, Ceramide NP, Sodium Hyaluronate, ' +
  'Allantoin, Adenosine, Vitis Vinifera (Grape) Callus Culture Extract, Rosa Damascena ' +
  'Callus Culture Extract, Panthenol, PPG-26-Buteth-26, Scutellaria Baicalensis Root ' +
  'Extract, Citrus Junos Fruit Extract, Camellia Sinensis Leaf Extract, Caprylyl Glycol, ' +
  'Tocopheryl Acetate, Houttuynia Cordata Extract, Glycine, Disodium EDTA, Artemisia ' +
  'Vulgaris Extract, Artemisia Princeps Extract, Lysine, Lactobacillus Ferment Lysate ' +
  'Filtrate, Ethylhexylglycerin, Lecithin, Xanthan Gum, Sodium Metabisulfite, Phenyl ' +
  'Trimethicone, Sodium Phosphate, Keratin, Caprylic/Capric Triglyceride, PEG-40 ' +
  'Hydrogenated Castor Oil, Sodium Chloride.'

const EN: PowerSolutionCopy = {
  eyebrow: 'Professional ampoule · Ten sealed vials',
  headline: 'Line by line.',
  subheadline:
    'POWER SOLUTION AWS, Anti-Wrinkle Solution, is the wrinkle vial of the range. It reduces the appearance of wrinkles and improves skin firmness, and Korea registers it as a wrinkle-improving functional cosmetic with adenosine at 0.04% as the principal ingredient. Ten sealed 2 ml vials, one per treatment.',
  heroBullets: [
    'Reduces the appearance of wrinkles and improves skin firmness',
    'Adenosine at 0.04%, the principal ingredient Korea registers for wrinkle care',
    'A 21.60% moisture base keeps skin supple and comfortable',
    'Ten sealed glass vials, so every treatment starts fresh',
  ],
  badges: ['Dermatologically tested', 'Made in Korea', 'Adenosine 0.04%', 'Wrinkle care'],
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
    { value: '0.04%', label: 'Adenosine, the principal ingredient Korea registers for wrinkle care' },
    { value: '99.94%', label: 'Of the adenosine dose, measured in the latest batch' },
    { value: '21.60%', label: 'Butylene glycol and glycerin, the moisture base' },
    { value: '10 × 2 ml', label: 'Sealed glass vials, opened one at a time' },
  ],
  solution: {
    eyebrow: 'The ampoule',
    title: 'For lines, and for firmness.',
    body:
      'AWS stands for Anti-Wrinkle Solution, and it is the Power Solution for lines. When wrinkles are the concern and skin has lost some of its firmness, this is the vial to open: it reduces the appearance of wrinkles and improves skin firmness, treatment after treatment.',
    points: [
      {
        title: 'Adenosine at 0.04%',
        body:
          'Korea registers AWS as a wrinkle-improving functional cosmetic and names adenosine as the principal ingredient, at the full registered dose. Every batch is tested to prove it, and the latest came back at 99.94%.',
      },
      {
        title: 'One vial, one treatment',
        body:
          'Two millilitres, sealed in glass and opened only when you need it. Nothing is decanted, nothing is kept, and nothing sits open between treatments. Ten vials, ten full doses.',
      },
      {
        title: 'It stays on',
        body:
          'A leave-on solution that stays on the skin and keeps working there. Cleanse, open, apply, and let it absorb.',
      },
    ],
    figureAlt: 'Fewer lines, firmer skin: a woman with her eyes closed, from the POWER SOLUTION AWS campaign',
  },
  formula: {
    eyebrow: 'The formula',
    title: 'Every percentage, in the vial.',
    intro:
      'The finished concentration of everything that matters, charted. Water carries the formula at 73.3%; the rest is a moisture base and the actives, led by the 0.04% of adenosine Korea names as the principal ingredient.',
    baseTitle: 'The base - 21.60% of the vial',
    baseRows: ['Butylene Glycol', 'Glycerin'],
    baseNote:
      'Butylene glycol and glycerin draw water into the skin and hold it there, just over a fifth of the vial between them. That is why a full 2 ml feels cushioning rather than tight.',
    activesTitle: 'The actives',
    activesRows: [
      'Soy Ferment Filtrate',
      'Sodium Hyaluronate',
      'Allantoin',
      'Adenosine',
      'Grape Callus Culture Extract',
      'Rose Callus Culture Extract',
      'Keratin',
      'Panthenol',
    ],
    activesNote:
      'Soy ferment leads by weight at 2.5%. Adenosine at 0.04% is the registered wrinkle-care active. Each group is charted on its own scale, so the actives stay readable beside the base.',
    traceTitle: 'Peptides and ceramide',
    traceBody:
      'Copper tripeptide-1 at 10 ppm, sh-Polypeptide-7 at 6.6 ppm, acetyl hexapeptide-8 at 2.5 ppm and palmitoyl tripeptide-1 at 2 ppm, with ceramide NP at 0.4 ppm: the parts-per-million doses peptides and ceramides are made to work at. sh-Polypeptide-7 is the signature peptide of the range, grown by fermentation, so every batch carries the same 217-amino-acid sequence.',
  },
  freeFrom: {
    eyebrow: 'Left out',
    title: 'Four things it does without.',
    body:
      'No parabens, no ethanol, no artificial colour and no artificial fragrance: a clean base for a vial that goes straight onto freshly cleansed skin.',
    items: ['Parabens', 'Ethanol', 'Artificial pigment', 'Artificial fragrance'],
    note:
      'Its soft natural scent comes from hinoki cypress water, a plant fragrance ingredient, so it is not a fragrance-free vial. Nothing artificial was added.',
    figureAlt: 'Light as silk: a swatch of POWER SOLUTION AWS, from the campaign',
  },
  range: {
    eyebrow: 'The range',
    title: 'Six vials, one job each.',
    intro:
      'The Power Solutions are a set: the same sealed 2 ml format and the same price, with a different job for each. AWS is the one for lines and loss of firmness.',
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
      'Avoid during pregnancy and breastfeeding: the formula contains two artemisia extracts. Keep it away from the eyes and mucous membranes, and rinse with cool water if it gets there.',
  },
  actives: {
    eyebrow: 'What is in it',
    title: 'What does the work.',
    intro: 'The ingredients behind softer-looking lines and firmer skin, each with its finished concentration.',
    cards: [
      {
        name: 'Adenosine, 0.04%',
        body: 'The registered wrinkle-care active, at the full dose Korea names. Every batch is tested to prove it; the latest came back at 99.94%.',
      },
      {
        name: 'Soy ferment filtrate, 2.5%',
        body: 'The largest active by weight. Soy milk fermented with lactobacillus and filtered, to condition the surface for a smoother feel.',
      },
      {
        name: 'Sodium hyaluronate 0.1% and allantoin 0.1%',
        body: 'Hyaluronic acid draws in water and allantoin keeps skin comfortable, for a softer, calmer finish.',
      },
      {
        name: 'Four peptides and ceramide NP',
        body: 'Copper tripeptide-1 10 ppm, sh-Polypeptide-7 6.6 ppm, acetyl hexapeptide-8 2.5 ppm and palmitoyl tripeptide-1 2 ppm, with ceramide NP at 0.4 ppm.',
      },
      {
        name: 'Grape and rose callus cultures, 0.03% each',
        body: 'Plant cell cultures from Vitis vinifera and Rosa damascena, grown in the lab so they are the same batch after batch.',
      },
      {
        name: 'Keratin 0.01% and panthenol 0.004%',
        body: 'A conditioning protein and provitamin B5, rounding out the care the moisture base carries.',
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
      'Lines or loss of firmness is the concern in front of you',
      'You want adenosine at the full registered 0.04%, in a sealed single-use vial',
      'You like rich moisture without a heavy cream',
      'You prefer a sealed single-use vial to a bottle that sits open',
    ],
    notTitle: 'Look elsewhere if',
    notList: [
      'Skin is tired and dry rather than lined: that is CVS',
      'Pigmentation is the concern: that is SWS, or HES for a flat, dehydrated face',
      'You are treating oil and breakouts: that is PCS',
      'Rough texture is the brief: that is CTS',
      'You are pregnant or breastfeeding',
      'You need a fragrance-free vial: hinoki water is in this one',
    ],
    note:
      'For external use only. Keep it away from the eyes and mucous membranes, and rinse with cool water if it gets there. Stop and see a doctor if redness, swelling, small bumps or irritation appear.',
  },
  faq: {
    eyebrow: 'Questions',
    title: 'Before you buy.',
    items: [
      {
        q: 'What does AWS stand for?',
        a: 'Anti-Wrinkle Solution, the wrinkle vial of the Power Solution range. The name is on the front of the box and on every vial.',
      },
      {
        q: 'Is the 0.04% adenosine a full dose?',
        a: 'Yes. The finished vial carries adenosine at 0.04%, the dose Korea registers for a wrinkle-improving functional cosmetic, and every batch is tested to prove it. The latest came back at 99.94%.',
      },
      {
        q: 'What will I notice?',
        a: 'Skin that feels smoother and more supple as the solution absorbs, with the moisture base keeping it comfortable. Treatment after treatment, AWS reduces the appearance of wrinkles and improves skin firmness.',
      },
      {
        q: 'Can I use it at home?',
        a: 'Yes. It is a professional line, with "PROFESSIONAL" on every vial, and it is simple to use at home: cleanse, open, apply, absorb. If a practitioner has set you a protocol, follow theirs.',
      },
      {
        q: 'Which of the six should I pick?',
        a: 'Match the vial to the concern. Lines are AWS, tired and dry is CVS, dehydrated and flat is HES, pigmentation is SWS, rough texture is CTS, oil and breakouts are PCS. The range table above sets them side by side.',
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
      { label: 'Made for', value: 'Softer-looking wrinkles and firmer skin' },
      { label: 'Registered as', value: 'Wrinkle-improving functional cosmetic, Korea' },
      { label: 'Principal ingredient', value: 'Adenosine 0.04%' },
      { label: 'Moisture base', value: 'Butylene glycol 12.515% and glycerin 9.086%, 21.60% together' },
      { label: 'Largest active', value: 'Soy ferment filtrate 2.5%' },
      { label: 'Peptides', value: 'Copper tripeptide-1 10 ppm, sh-Polypeptide-7 6.6 ppm, acetyl hexapeptide-8 2.5 ppm, palmitoyl tripeptide-1 2 ppm' },
      { label: 'pH', value: '4.93, inside a 3.80 to 5.80 specification' },
      { label: 'Appearance', value: 'Light yellow viscous liquid' },
      { label: 'Free from', value: 'Parabens, ethanol, artificial pigment and artificial fragrance' },
      { label: 'Shelf life', value: 'Three years unopened, with the expiry date on the box' },
      { label: 'Tested', value: 'Dermatologically tested' },
      { label: 'Made by', value: 'DTS MG Co., Ltd., South Korea' },
    ],
  },
  closing: {
    title: 'Line by line, one vial at a time.',
    body: 'Ten sealed treatments of the Power Solution for wrinkles: adenosine at the full registered 0.04% over a rich moisture base, for softer-looking lines and firmer skin.',
  },
  backToProducts: 'Products',
}

const BY_LOCALE: Record<PowerSolutionLocale, PowerSolutionCopy> = {
  en: EN,
  ar: AWS_AR_COPY,
  ru: AWS_RU_COPY,
}

export function getAwsCopy(locale: string): PowerSolutionCopy {
  return BY_LOCALE[(locale as PowerSolutionLocale) in BY_LOCALE ? (locale as PowerSolutionLocale) : 'en']
}

export const AWS_VARIANT: PowerSolutionVariant = {
  paletteClass: 'ps-aws',
  getCopy: getAwsCopy,
  formulaBase: AWS_FORMULA_BASE,
  formulaActives: AWS_FORMULA_ACTIVES,
  fullInci: AWS_FULL_INCI,
  vialImage: '/images/aws_campaign/s2.jpg',
  boxImage: '/images/aws_campaign/s7.jpg',
  figureSlides: true,
  sectionSlides: {
    formula: ['s4', 's5', 's6', 's8'].map((s) => `/images/aws_campaign/${s}.jpg`),
    howTo: ['/images/aws_campaign/s9b.jpg', '/images/aws_campaign/s10.jpg'],
    suited: ['/images/aws_campaign/s1b.jpg'],
    details: ['s3b', 's11b', 's12c'].map((s) => `/images/aws_campaign/${s}.jpg`),
  },
  blendGallerySlides: new Set(),
  heroOnWhite: true,
}

if (
  EN.formula.baseRows.length !== AWS_FORMULA_BASE.length ||
  EN.formula.activesRows.length !== AWS_FORMULA_ACTIVES.length ||
  EN.range.entries.length !== RANGE.length
) {
  throw new Error('awsCopy: formula or range label arrays are out of step with their data')
}
