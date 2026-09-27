/**
 * Bespoke copy for the POWER SOLUTION CTS page (product 6).
 *
 * Same per-locale pattern as powerSolutionCopy.ts, and the same shape, so the
 * ampoules share one layout. See PowerSolutionVariant there for what a
 * variant carries. RU and AR live in ctsLocalizedCopy.ts.
 *
 * SOURCING RULE FOR THIS FILE
 *
 * Four documents, and between them they cover every figure on this page:
 *
 *   Registration DOC/Formula_up/Formula-GENOSYS POWER SOLUTION CTS.pdf
 *       The quantitative formula, as finished concentrations. Signed DTS MG,
 *       Narae Han. This is the table to read. The 2011 Quali-quanti sheet in
 *       Intertek_folder is a superseded formula and is ignored, same rule as
 *       CVS, SWS and AWS. The SA raw-material table lists premixes
 *       (SUNPEP GHK-CU 5000 at 4.0000%, C-PEP ELASTYL at 1.0000%,
 *       APEPPOLY-3 at 1.0000%) and is not the finished vial.
 *   Registration DOC/Artwork/[GENOSYS]POWER SOLUTION CTS.pdf
 *       Carton text, the full INCI, the four application pictograms, the
 *       exclusions panel, the precautions, and the English function line.
 *   Registration DOC/SA/SA-GENOSYS POWER SOLUTION CTS.pdf
 *       December 2020 amendment, DTS MG. Face serum, leave-on, adults.
 *       Function: improvement of skin texture. Hydrolyzed collagen is
 *       named as fish collagen in the raw table.
 *   Registration DOC/COA/COA-GENOSYS POWER SOLUTION CTS(L1133A).pdf
 *       pH 7.61 against 7.00 +/- 1.00, light blue viscous liquid. Three
 *       years unopened from the production-to-expiry span.
 *
 * THE FORMULA, as finished concentrations:
 *
 *   Aqua (Water)                                                      66.137700%
 *   Glycerin                                                          14.579800%
 *   Butylene Glycol                                                   13.485000%
 *   1,2-Hexanediol                                                     2.579000%
 *   Lactobacillus/Soymilk Ferment Filtrate                             2.500000%
 *   Sodium Lactate                                                     0.180000%
 *   Sodium Hyaluronate                                                 0.100200%
 *   Hydrolyzed Collagen                                                0.100000%
 *   Hydroxyethylcellulose                                              0.098900%
 *   Arginine                                                           0.065000%
 *   Allantoin                                                          0.050000%
 *   Vitis Vinifera (Grape) Callus Culture Extract                      0.030000%
 *   Rosa Damascena Callus Culture Extract                              0.030000%
 *   Copper Tripeptide-1                                                0.021200%  = 212 ppm
 *   Glycolic Acid                                                      0.020000%  pH adjuster
 *   Beta-Glucan                                                        0.012000%
 *   Lecithin                                                           0.005000%
 *   sh-Polypeptide-7                                                   0.000100%  = 1 ppm
 *   Palmitoyl Tripeptide-1                                             0.000100%  = 1 ppm
 *   Palmitoyl Hexapeptide-12                                           0.000100%  = 1 ppm
 *
 * CLAIMS THE PAGE MAKES, AND WHERE THEY COME FROM
 *   Smoother texture                             carton, registered function
 *                                                (improvement of skin texture)
 *   Keeps natural elasticity, stronger skin      carton English panel
 *   Cytokine Concentrate Solution                carton front panel and vial label
 *   Copper tripeptide-1 212 ppm, largest peptide
 *     dose in the six-vial range                 Formula_up against the five siblings
 *   Four peptides                                Formula_up
 *   28.06% glycerin + butylene glycol, the
 *     richest moisture base of the six           Formula_up against the five siblings
 *   pH 7.61 inside 6.00 to 8.00                  COA
 *   Light blue viscous liquid                    COA appearance
 *   Three-year shelf life                        COA production-to-expiry span
 *   Dermatologically tested, made in Korea       carton front panel
 *   No parabens, ethanol, artificial pigment
 *     or artificial fragrance                    carton exclusions panel
 *   Avoid in pregnancy and lactation             carton precautions (artemisia)
 *
 * DELIBERATE OMISSIONS - do not add these without a document:
 *   - MICRONEEDLING OR A ROLLER. The carton's application is four
 *     pictograms: cleanse, open, apply, absorb. The Russian carton panel
 *     invents a dermaroller protocol; logged as a pack correction.
 *   - "5-FREE". The carton prints it, but its fifth exclusion is artificial
 *     surfactant and polysorbate 60 is on the list. The page names the four
 *     exclusions the list bears out.
 *   - GROWTH HORMONE, TISSUE REPAIR, CELL PRODUCTION, REGENERATION,
 *     HEALING, NEOCOLLAGENESIS, SCAR SMOOTHING, "THE REGENERATOR". Carton
 *     peptide panel and the Russian panel. sh-Polypeptide-7 is never an
 *     IGF-1 analogue and never human growth hormone.
 *   - A KOREAN FUNCTIONAL LICENCE. CTS is not a functional cosmetic.
 *   - GLYCOLIC ACID AS A PEEL. 0.02%, a pH adjuster.
 *   - FRAGRANCE-FREE. Chamaecyparis Obtusa Water is a fragrance ingredient;
 *     the exclusion is artificial fragrance only.
 *   - ALL SKIN TYPES. Neck. Layering under a GENOSYS serum.
 *   - LOT CODES, specific gravity, fill volume, and the contract
 *     manufacturer. DTS MG only.
 *
 * IMAGES. The "Back to smooth." campaign, public/images/cts_campaign/: main.jpg
 * is the closed carton and one vial on white, the family angle shared with HES,
 * PCS and SWS; s1-s12 are the claim slides, with RU and AR renders swapped in by
 * lib/localizedProductImages.ts. The two inline figures use s2 and s6, and
 * `sectionSlides` places the other ten in the formula, how-to, suited and
 * details sections. The product slides ship as s1b, s3b, s9c, s11b and s12c: one
 * photograph each, not the product pasted on a plate. s12c is shot from the
 * three-quarter packshot, so the carton keeps its side panel and square edges; s9c
 * stands the ten vials as one receding group instead of a stamped grid. The old
 * cts-hero.jpg, CTS.jpg and Second/cts_big*.jpg stay on disk for order history.
 */

import { RANGE, type PowerSolutionCopy, type PowerSolutionLocale, type PowerSolutionVariant } from './powerSolutionCopy'
import { CTS_AR_COPY, CTS_RU_COPY } from './ctsLocalizedCopy'

export const CTS_FORMULA_BASE = [
  { pct: 14.5798 },
  { pct: 13.485 },
] as const

export const CTS_FORMULA_ACTIVES = [
  { pct: 2.5 },
  { pct: 0.1002 },
  { pct: 0.1 },
  { pct: 0.065 },
  { pct: 0.05 },
  { pct: 0.03 },
  { pct: 0.03 },
  { pct: 0.0212 },
] as const

export const CTS_HUMECTANT_TOTAL = 28.06

export const CTS_FULL_INCI =
  'Aqua (Water), Glycerin, Butylene Glycol, 1,2-Hexanediol, ' +
  'Lactobacillus/Soymilk Ferment Filtrate, sh-Polypeptide-7, Copper Tripeptide-1, ' +
  'Palmitoyl Tripeptide-1, Palmitoyl Hexapeptide-12, Sodium Lactate, Sodium Hyaluronate, ' +
  'Hydrolyzed Collagen, Hydroxyethylcellulose, Arginine, Allantoin, Vitis Vinifera (Grape) ' +
  'Callus Culture Extract, Rosa Damascena Callus Culture Extract, Glycolic Acid, Beta-Glucan, ' +
  'Lecithin, Sodium Phosphate, Sodium Chloride, Polysorbate 60, Disodium Phosphate, ' +
  'Scutellaria Baicalensis Root Extract, Citrus Junos Fruit Extract, Camellia Sinensis Leaf ' +
  'Extract, Houttuynia Cordata Extract, Glycine, Ethylhexylglycerin, Disodium EDTA, ' +
  'Artemisia Vulgaris Extract, Artemisia Princeps Extract, Lysine, Lactobacillus Ferment ' +
  'Lysate Filtrate, Chamaecyparis Obtusa Water.'

const EN: PowerSolutionCopy = {
  eyebrow: 'Professional ampoule · Ten sealed vials',
  headline: 'Back to smooth.',
  subheadline:
    'POWER SOLUTION CTS, Cytokine Concentrate Solution, is the texture vial of the range. It refines rough skin and helps it keep its natural elasticity and strength, with copper tripeptide-1 at 212 ppm, the largest peptide dose of the six, over a 28% moisture base. Ten sealed 2 ml vials, one per treatment.',
  heroBullets: [
    'Refines skin texture and helps skin keep its natural elasticity',
    'Copper tripeptide-1 at 212 ppm, the largest peptide dose in the range',
    'A 28% glycerin and butylene glycol base keeps skin supple and comfortable',
    'Ten sealed glass vials, so every treatment starts fresh',
  ],
  badges: ['Dermatologically tested', 'Made in Korea', 'Four peptides', 'Texture'],
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
    { value: 'Texture', label: 'Smoother, stronger-feeling skin is what CTS is made for' },
    { value: '212 ppm', label: 'Copper tripeptide-1, the largest peptide dose in the range' },
    { value: '28.06%', label: 'Glycerin and butylene glycol, the richest moisture base of the six' },
    { value: '10 × 2 ml', label: 'Sealed glass vials, opened one at a time' },
  ],
  solution: {
    eyebrow: 'The ampoule',
    title: 'For skin that has lost its smoothness.',
    body:
      'CTS stands for Cytokine Concentrate Solution, and it is the Power Solution for texture. When skin feels rough, looks tired and has lost some of its bounce, this is the vial to open: it refines the surface and helps skin keep its natural elasticity and strength.',
    points: [
      {
        title: 'Elasticity and strength',
        body:
          'CTS helps skin keep its natural elasticity and makes it feel stronger, with four peptides led by copper tripeptide-1 over a rich moisture base.',
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
    figureAlt: 'Smoother texture: a woman touching her cheek, from the POWER SOLUTION CTS campaign',
  },
  formula: {
    eyebrow: 'The formula',
    title: 'Every percentage, in the vial.',
    intro:
      'The finished concentration of everything that matters, charted. Water carries the formula at 66.1%; the rest is a rich moisture base and the actives that give CTS its texture work.',
    baseTitle: 'The base - 28.06% of the vial',
    baseRows: ['Glycerin', 'Butylene Glycol'],
    baseNote:
      'Glycerin and butylene glycol draw water into the skin and hold it there. At 28.06% together it is the richest base of the six vials, which is why a full 2 ml feels cushioning rather than tight.',
    activesTitle: 'The actives',
    activesRows: [
      'Soy Ferment Filtrate',
      'Sodium Hyaluronate',
      'Hydrolyzed Collagen',
      'Arginine',
      'Allantoin',
      'Grape Callus Culture Extract',
      'Rose Callus Culture Extract',
      'Copper Tripeptide-1',
    ],
    activesNote:
      'Soy ferment leads by weight at 2.5%. Copper tripeptide-1 at 0.0212% is the largest peptide dose in the range. Each group is charted on its own scale, so the actives stay readable beside the base.',
    traceTitle: 'Three more peptides',
    traceBody:
      'sh-Polypeptide-7, palmitoyl tripeptide-1 and palmitoyl hexapeptide-12 join at 1 ppm each, the parts-per-million doses peptides are made to work at. sh-Polypeptide-7 is the signature peptide of the range, grown by fermentation, so every batch carries the same 217-amino-acid sequence.',
  },
  freeFrom: {
    eyebrow: 'Left out',
    title: 'Four things it does without.',
    body:
      'No parabens, no ethanol, no artificial colour and no artificial fragrance: a clean base for a vial that goes straight onto freshly cleansed skin.',
    items: ['Parabens', 'Ethanol', 'Artificial pigment', 'Artificial fragrance'],
    note:
      'Its soft natural scent comes from hinoki cypress water, a plant fragrance ingredient, so it is not a fragrance-free vial. Nothing artificial was added.',
    figureAlt: 'Silk in a vial: a swatch of POWER SOLUTION CTS, from the campaign',
  },
  range: {
    eyebrow: 'The range',
    title: 'Six vials, one job each.',
    intro:
      'The Power Solutions are a set: the same sealed 2 ml format and the same price, with a different job for each. CTS is the one for texture, elasticity and strength.',
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
      'Avoid during pregnancy and breastfeeding: the formula contains two artemisia extracts. It also contains hydrolyzed fish collagen, so skip it if you are allergic to fish. Keep it away from the eyes and mucous membranes, and rinse with cool water if it gets there.',
  },
  actives: {
    eyebrow: 'What is in it',
    title: 'What does the work.',
    intro: 'The ingredients behind a smoother texture, each with its finished concentration.',
    cards: [
      {
        name: 'Copper tripeptide-1, 212 ppm',
        body: 'The lead peptide, at 0.0212%: the largest peptide dose in the six-vial range, a copper peptide that conditions the skin.',
      },
      {
        name: 'Soy ferment filtrate, 2.5%',
        body: 'The largest active by weight. Soy milk fermented with lactobacillus and filtered, to condition the surface for a smoother feel.',
      },
      {
        name: 'Sodium hyaluronate 0.1% and hydrolyzed collagen 0.1%',
        body: 'Hyaluronic acid draws in water and collagen leaves a light moisture film, for a softer, suppler finish. The collagen is from fish.',
      },
      {
        name: 'sh-Polypeptide-7, 1 ppm',
        body: 'The signature peptide of the Power Solution range, grown by fermentation so every batch carries the same sequence.',
      },
      {
        name: 'Palmitoyl tripeptide-1 and palmitoyl hexapeptide-12, 1 ppm each',
        body: 'Two palmitoylated peptides that complete the four-peptide blend.',
      },
      {
        name: 'Grape and rose callus cultures, 0.03% each',
        body: 'Plant cell cultures from Vitis vinifera and Rosa damascena, grown in the lab so they are the same batch after batch.',
      },
      {
        name: 'Arginine 0.065% and allantoin 0.05%',
        body: 'An amino acid and a classic soothing agent, for comfort on freshly cleansed skin.',
      },
      {
        name: 'Glycolic acid 0.02% and beta-glucan 0.012%',
        body: 'Glycolic acid keeps the pH right; it is not a peel. Beta-glucan conditions the surface.',
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
      'Skin feels rough or looks tired, and you want it smooth again',
      'You want to help skin keep its natural elasticity and strength',
      'You like rich moisture without a heavy cream',
      'You prefer a sealed single-use vial to a bottle that sits open',
    ],
    notTitle: 'Look elsewhere if',
    notList: [
      'Lines are the main concern: that is AWS',
      'Skin is tired and dry rather than rough: that is CVS',
      'Pigmentation is the concern: that is SWS, or HES for a flat, dehydrated face',
      'You are treating oil and breakouts: that is PCS',
      'You are pregnant or breastfeeding',
      'You are allergic to fish: the collagen in this vial is from fish',
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
        q: 'What does CTS stand for?',
        a: 'Cytokine Concentrate Solution, the texture vial of the Power Solution range. The name is on the front of the box and on every vial.',
      },
      {
        q: 'What will I notice?',
        a: 'Skin that feels smoother and more supple as the solution absorbs, with the moisture base keeping it comfortable. Treatment after treatment, CTS helps skin keep its natural elasticity and strength.',
      },
      {
        q: 'Does it exfoliate?',
        a: 'No. Glycolic acid is there at 0.02% to set the pH, not to peel.',
      },
      {
        q: 'Can I use it at home?',
        a: 'Yes. It is a professional line, with "PROFESSIONAL" on every vial, and it is simple to use at home: cleanse, open, apply, absorb. If a practitioner has set you a protocol, follow theirs.',
      },
      {
        q: 'Can I keep the rest of an opened vial?',
        a: 'No. A vial does not reseal once opened, so use the full 2 ml in one treatment.',
      },
      {
        q: 'Which of the six should I pick?',
        a: 'Match the vial to the concern. Rough or tired texture is CTS, lines are AWS, tired and dry is CVS, dehydrated and flat is HES, pigmentation is SWS, oil and breakouts are PCS. The range table above sets them side by side.',
      },
      {
        q: 'How long does a box last?',
        a: 'Ten treatments, one vial each. Unopened it keeps for three years, with the expiry date on the box.',
      },
      {
        q: 'Can I use it in pregnancy?',
        a: 'Avoid it during pregnancy and breastfeeding. The formula contains two artemisia extracts, so ask your doctor before using it.',
      },
      {
        q: 'Is there anything from fish in it?',
        a: 'Yes. The hydrolyzed collagen is from fish, so skip CTS if you are allergic to fish.',
      },
    ],
  },
  details: {
    eyebrow: 'The detail',
    title: 'At a glance.',
    rows: [
      { label: 'Format', value: 'Leave-on solution in a sealed 2 ml glass vial' },
      { label: 'Pack', value: '2 ml × 10 vials' },
      { label: 'Made for', value: 'Smoother texture, natural elasticity and stronger-feeling skin' },
      { label: 'Name', value: 'Cytokine Concentrate Solution' },
      { label: 'Moisture base', value: 'Glycerin 14.580% and butylene glycol 13.485%, 28.06% together' },
      { label: 'Largest active', value: 'Soy ferment filtrate 2.5%' },
      { label: 'Lead peptide', value: 'Copper tripeptide-1 0.0212% (212 ppm)' },
      { label: 'Other peptides', value: 'sh-Polypeptide-7, palmitoyl tripeptide-1 and palmitoyl hexapeptide-12, 1 ppm each' },
      { label: 'pH', value: '7.61, inside a 6.00 to 8.00 specification' },
      { label: 'Appearance', value: 'Light blue viscous liquid' },
      { label: 'Free from', value: 'Parabens, ethanol, artificial pigment and artificial fragrance' },
      { label: 'Shelf life', value: 'Three years unopened, with the expiry date on the box' },
      { label: 'Tested', value: 'Dermatologically tested' },
      { label: 'Made by', value: 'DTS MG Co., Ltd., South Korea' },
    ],
  },
  closing: {
    title: 'Back to smooth, one vial at a time.',
    body: 'Ten sealed treatments of the Power Solution for texture: four peptides over a rich moisture base, for skin that feels smooth, supple and strong again.',
  },
  backToProducts: 'Products',
}

const BY_LOCALE: Record<PowerSolutionLocale, PowerSolutionCopy> = {
  en: EN,
  ar: CTS_AR_COPY,
  ru: CTS_RU_COPY,
}

export function getCtsCopy(locale: string): PowerSolutionCopy {
  return BY_LOCALE[(locale as PowerSolutionLocale) in BY_LOCALE ? (locale as PowerSolutionLocale) : 'en']
}

export const CTS_VARIANT: PowerSolutionVariant = {
  paletteClass: 'ps-cts',
  getCopy: getCtsCopy,
  formulaBase: CTS_FORMULA_BASE,
  formulaActives: CTS_FORMULA_ACTIVES,
  fullInci: CTS_FULL_INCI,
  vialImage: '/images/cts_campaign/s2.jpg',
  boxImage: '/images/cts_campaign/s6.jpg',
  figureSlides: true,
  sectionSlides: {
    formula: ['s4', 's5', 's7', 's8'].map((s) => `/images/cts_campaign/${s}.jpg`),
    howTo: ['/images/cts_campaign/s3b.jpg', '/images/cts_campaign/s10b.jpg'],
    suited: ['/images/cts_campaign/s1b.jpg'],
    details: ['s9c', 's11b', 's12c'].map((s) => `/images/cts_campaign/${s}.jpg`),
  },
  blendGallerySlides: new Set(),
  heroOnWhite: true,
}

if (
  EN.formula.baseRows.length !== CTS_FORMULA_BASE.length ||
  EN.formula.activesRows.length !== CTS_FORMULA_ACTIVES.length ||
  EN.range.entries.length !== RANGE.length
) {
  throw new Error('ctsCopy: formula or range label arrays are out of step with their data')
}
