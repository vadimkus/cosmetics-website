import { MULTI_SUN_AR_COPY, MULTI_SUN_RU_COPY } from './multiSunLocalizedCopy'

/**
 * Bespoke copy for MULTI SUN CREAM [SPF40 / PA++] (product 40).
 *
 * SOURCING - every figure traces to the audit in
 * docs/SESSION_CHANGES_2026-08-17_PRODUCT_40_MULTI_SUN_SOURCE_AUDIT.md:
 *   - DTS MG signed formula: four filters totalling 18.50%, and the trace
 *     complex running from 100 ppm down to a declared zero.
 *   - COA lot WOB053: pH 6.71, net 41.07 g, under 10 cfu/ml, three-year life,
 *     and an assay of all four filters.
 *   - The registered carton, including the single-function Korean declaration
 *     and the five declared fragrance allergens.
 *   - Regulation (EC) 1223/2009 Annex VI as at 1 May 2026 for the caps, and
 *     SCCS/1671/24 (June 2025, corrigendum March 2026) for octinoxate.
 *
 * THE SPINE OF THIS PAGE. The light, affordable everyday sunscreen of the
 * pair: SPF 40 PA++ under make-up. Ultra Shield is the one for long days
 * outdoors and higher UVA cover. Every figure stays; the audit voice does not.
 *
 * OCTINOXATE. This contains it at 7.50% and product 39 is made without it.
 * State the figure and the EU limit, and point anyone who prefers to avoid it
 * to Ultra Shield, in the selling voice (see .cursor/rules/selling-tone.mdc).
 *
 * MUST STAY OUT:
 *   - Palmitoyl Pentapeptide-4 as a calming active. It is at 1 ppb, and the
 *     Lactobacillus/Soymilk ferment is declared at literally zero.
 *   - "Mannan", which is not an INCI name.
 *   - An unqualified "suitable for sensitive skin" on a fragranced product with
 *     five declared allergens.
 *   - Any water-resistance or swimming claim. No test exists.
 *   - The contract manufacturer's name, and the lot code.
 */

export type Locale = 'en' | 'ar' | 'ru'

export interface MultiSunCopy {
  eyebrow: string
  headline: string
  subheadline: string
  heroBullets: string[]
  badges: string[]

  addToBag: string
  adding: string
  added: string
  inBag: string
  viewBag: string
  outOfStock: string
  vatIncluded: string
  freeDelivery: string

  stats: Array<{ value: string; label: string }>

  filters: {
    eyebrow: string
    title: string
    intro: string
    columns: { name: string; amount: string; role: string; cap: string }
    rows: Array<{ name: string; amount: string; role: string; cap: string }>
    total: string
  }

  grade: {
    eyebrow: string
    title: string
    body: string
    aside: string
  }

  octinoxate: {
    eyebrow: string
    title: string
    body: string
    points: string[]
    verdict: string
  }

  assay: {
    eyebrow: string
    title: string
    intro: string
    columns: { name: string; declared: string; found: string }
    rows: Array<{ name: string; declared: string; found: string }>
    note: string
  }

  honesty: {
    eyebrow: string
    title: string
    body: string
    aside: string
  }

  fragrance: {
    eyebrow: string
    title: string
    body: string
    allergens: string[]
  }

  pick: {
    eyebrow: string
    title: string
    intro: string
    thisOne: { title: string; items: string[] }
    otherOne: { title: string; items: string[] }
  }

  howTo: {
    eyebrow: string
    title: string
    frequency: string
    steps: Array<{ title: string; body: string }>
    note: string
  }

  video: { title: string; body: string; unsupported: string }

  inci: {
    eyebrow: string
    title: string
    intro: string
    fullInci: string
    fullInciNote: string
  }

  lab: {
    eyebrow: string
    title: string
    intro: string
    rows: Array<{ label: string; value: string }>
  }

  safety: {
    eyebrow: string
    title: string
    points: string[]
    note: string
  }

  spec: {
    eyebrow: string
    title: string
    rows: Array<{ label: string; value: string }>
  }

  faq: {
    eyebrow: string
    title: string
    items: Array<{ q: string; a: string }>
  }

  backToProducts: string
}

const EN: MultiSunCopy = {
  eyebrow: 'MULTI SUN · SPF 40 PA++',
  headline: 'Light daily sun protection that sits comfortably under make-up.',
  subheadline:
    'Four UV filters make up 18.50% of the formula. SPF 40 guards mainly against UVB, and PA++ adds moderate UVA protection. The easy everyday choice for the city, the office and the school run.',
  heroBullets: [
    'SPF 40 PA++ for everyday city life',
    'Four UV filters at 18.50% combined',
    'Light cream texture that wears well under make-up',
    'Not water resistant: reapply after swimming or sweating',
  ],
  badges: ['Made in Korea', '40 g', 'Dermatologically tested', 'No parabens, drying alcohol or colourants'],

  addToBag: 'Add to bag',
  adding: 'Adding…',
  added: 'Added to bag',
  inBag: 'In bag',
  viewBag: 'View bag',
  outOfStock: 'Out of stock',
  vatIncluded: 'VAT included',
  freeDelivery: 'Free delivery over AED 1,000 · Dispatched from Dubai',

  stats: [
    { value: 'SPF 40', label: 'Everyday UVB protection' },
    { value: 'PA++', label: 'Moderate UVA protection' },
    { value: '18.50%', label: 'Four UV filters in the formula' },
    { value: 'pH 6.71', label: 'Gentle, skin-friendly pH' },
  ],

  filters: {
    eyebrow: 'The filter system',
    title: 'Four filters, each at a clear concentration.',
    intro:
      'Three organic filters and titanium dioxide work together to give SPF 40 PA++, each well within its European limit.',
    columns: { name: 'Filter', amount: 'Concentration', role: 'Covers', cap: 'EU limit' },
    rows: [
      { name: 'Ethylhexyl Methoxycinnamate', amount: '7.50%', role: 'UVB', cap: '10%' },
      { name: 'Ethylhexyl Salicylate', amount: '5.00%', role: 'UVB', cap: '5%' },
      { name: 'Titanium Dioxide', amount: '3.00%', role: 'UVB and part of short UVA', cap: '25%' },
      { name: 'Isoamyl p-Methoxycinnamate', amount: '3.00%', role: 'UVB', cap: '10%' },
    ],
    total: 'Combined: 18.50%.',
  },

  grade: {
    eyebrow: 'Reading the label',
    title: 'SPF 40 and PA++ cover different parts of the spectrum.',
    body:
      'SPF measures protection mainly against UVB, the rays behind sunburn. PA++ stands for moderate protection against UVA. Three of the filters here work in the UVB range, and titanium dioxide covers UVB and part of short-wave UVA. That balance is what makes it such a light, comfortable daily cream.',
    aside:
      'Planning a long day in direct sun? Choose a sunscreen with higher UVA protection, such as Ultra Shield SPF 50+ PA++++, and reapply regularly either way.',
  },

  octinoxate: {
    eyebrow: 'Good to know',
    title: 'Prefer a formula without octinoxate?',
    body:
      'Octinoxate (Ethylhexyl Methoxycinnamate) is the main UVB filter in Multi Sun, at 7.50%.',
    points: [
      'It is used here at 7.50%, below the 10% European limit for sunscreens.',
      'Tested in the finished cream at 7.21%, right where it should be.',
      'If you would rather avoid octinoxate, Ultra Shield SPF 50+ PA++++ is made without it.',
    ],
    verdict:
      'Both are GENOSYS daily sunscreens. Pick the one that suits your skin and your day.',
  },

  assay: {
    eyebrow: 'Quality',
    title: 'Every UV filter checked in the finished cream.',
    intro: 'Each filter was measured in the finished cream, not just at the mixing stage.',
    columns: { name: 'Filter', declared: 'Formula', found: 'Measured' },
    rows: [
      { name: 'Ethylhexyl Methoxycinnamate', declared: '7.50%', found: '7.21%' },
      { name: 'Ethylhexyl Salicylate', declared: '5.00%', found: '4.96%' },
      { name: 'Isoamyl p-Methoxycinnamate', declared: '3.00%', found: '2.98%' },
      { name: 'Titanium Dioxide', declared: '3.00%', found: '2.75%' },
    ],
    note: 'All four sit comfortably inside the standard of at least 90% of the formula amount.',
  },

  honesty: {
    eyebrow: 'Everyday comfort',
    title: 'A light base for your morning routine.',
    body:
      'Butylene glycol at 5%, dimethicone at 2.30% and glycerin at 1% give a soft, non-greasy cream that spreads easily and settles quickly before make-up.',
    aside: 'Reliable daily sun protection in a texture you will actually want to wear every morning.',
  },

  fragrance: {
    eyebrow: 'Fragrance',
    title: 'A light lavender scent at 0.25%.',
    body:
      'The fragrance contains five allergens listed below. If your skin reacts to fragrance, patch test on a small area before first use, or choose a fragrance-free sunscreen.',
    allergens: [
      'Benzyl Benzoate - 0.025%',
      'Citronellol - 0.011%',
      'Hexyl Cinnamal - 0.011%',
      'Alpha-Isomethyl Ionone - 0.011%',
      'Limonene - 0.004%',
    ],
  },

  pick: {
    eyebrow: 'Choosing your sunscreen',
    title: 'Two GENOSYS sunscreens for different days.',
    intro: 'Choose by how long you will be outside and how much UVA protection you need.',
    thisOne: {
      title: 'MULTI SUN · SPF 40 PA++',
      items: [
        'The city, the office and short trips outside',
        'Light texture under make-up',
        'Moderate UVA protection',
        '40 g, and the more affordable of the two',
      ],
    },
    otherOne: {
      title: 'ULTRA SHIELD · SPF 50+ PA++++',
      items: [
        'Long days outdoors, or a UV index of 11 and up',
        'Higher UVA protection',
        'Made without octinoxate',
        '50 g',
      ],
    },
  },

  howTo: {
    eyebrow: 'How to use',
    title: 'An even layer, refreshed on time.',
    frequency: 'Every morning · reapply at least every two hours outdoors',
    steps: [
      {
        title: 'The last step of skincare',
        body: 'Apply after your moisturiser and before make-up. It sits well under foundation.',
      },
      {
        title: 'Two fingers for face and neck',
        body: 'A line along your index and middle finger is roughly the amount SPF is tested at. Apply less and you get less protection.',
      },
      {
        title: '15 minutes before you go out',
        body: 'Spread evenly over the face, neck and any exposed skin, and give it a few minutes to settle.',
      },
      {
        title: 'Reapply outdoors',
        body: 'At least every two hours in the sun, and after swimming, heavy sweating or towelling.',
      },
    ],
    note: 'No parabens, no drying alcohol and no colourants.',
  },

  video: {
    title: 'The texture',
    body: 'How it spreads and how it finishes before make-up.',
    unsupported: 'Your browser does not support the video tag.',
  },

  inci: {
    eyebrow: 'The formula',
    title: 'Everything in the tube',
    intro: 'The UV filters, base and fragrance, in INCI order.',
    fullInci: 'Full ingredient list (INCI)',
    fullInciNote: 'Every ingredient, in the same order as the carton in your hand.',
  },

  lab: {
    eyebrow: 'Quality',
    title: 'Made to a high standard',
    intro: 'Made in Korea and checked before it ships.',
    rows: [
      { label: 'pH', value: '6.71, inside a 5.00-7.00 specification' },
      { label: 'Fill', value: '40 g, filled at 41.07 g' },
      { label: 'Bacteria', value: 'Under 10 cfu/ml, against a limit of 100' },
      { label: 'Moulds and yeasts', value: 'Under 10 cfu/ml, against a limit of 100' },
      { label: 'Stability', value: 'Stable at 50 °C' },
      { label: 'Shelf life', value: 'Three years unopened, with the expiry date on the box' },
      { label: 'Licence', value: 'Korean functional cosmetic for UV protection' },
    ],
  },

  safety: {
    eyebrow: 'Before you use it',
    title: 'Precautions',
    points: [
      'For external use only.',
      'Avoid the eyes and mucous membranes; rinse thoroughly with cool water on contact.',
      'Do not apply directly around the eyes or on broken skin.',
      'Stop and see a doctor if redness, swelling, itching or irritation appears.',
      'Contains fragrance with five listed allergens.',
      'Store cool and dry, away from direct sun and out of reach of children.',
    ],
    note: 'Precautions as printed on the carton.',
  },

  spec: {
    eyebrow: 'The details',
    title: 'At a glance',
    rows: [
      { label: 'Size', value: '40 g' },
      { label: 'Protection', value: 'SPF 40 PA++ · moderate UVA' },
      { label: 'Filters', value: 'Four · 18.50% combined' },
      { label: 'Octinoxate', value: '7.50%, below the 10% EU limit' },
      { label: 'pH', value: '6.71' },
      { label: 'Free from', value: 'Parabens, drying alcohol and colourants' },
      { label: 'Fragrance', value: '0.25% · five listed allergens' },
      { label: 'Water resistance', value: 'Not water resistant' },
      { label: 'Origin', value: 'Made in Korea' },
    ],
  },

  faq: {
    eyebrow: 'Questions',
    title: 'Before you buy',
    items: [
      {
        q: 'How much UVA protection does it give?',
        a: 'PA++ stands for moderate UVA protection. For long days in strong sun, Ultra Shield SPF 50+ PA++++ gives higher UVA cover.',
      },
      {
        q: 'Does it contain octinoxate?',
        a: 'Yes, at 7.50%, below the 10% European limit. If you prefer to avoid it, choose Ultra Shield, which is made without octinoxate.',
      },
      {
        q: 'Can I wear it under make-up?',
        a: 'Yes. The light texture is made for every morning, straight before foundation.',
      },
      {
        q: 'Is it water resistant?',
        a: 'No. Reapply after swimming, heavy sweating or towelling.',
      },
      {
        q: 'How often should I reapply?',
        a: 'At least every two hours outdoors, and after water, sweat or towelling.',
      },
      {
        q: 'Is it suitable for reactive skin?',
        a: 'It is dermatologically tested, and it contains fragrance at 0.25% with five listed allergens. If fragrance bothers your skin, patch test first.',
      },
    ],
  },

  backToProducts: 'Products',
}

export const MULTI_SUN_COPY: Record<Locale, MultiSunCopy> = {
  en: EN,
  ar: MULTI_SUN_AR_COPY,
  ru: MULTI_SUN_RU_COPY,
}

export function getMultiSunCopy(locale: string | undefined): MultiSunCopy {
  return MULTI_SUN_COPY[(locale as Locale) ?? 'en'] ?? MULTI_SUN_COPY.en
}

/** Ultra Shield first: the page sends octinoxate-avoiders straight to it. */
export const COMPANION_PRODUCT_IDS = ['39', '16', '36', '13'] as const
