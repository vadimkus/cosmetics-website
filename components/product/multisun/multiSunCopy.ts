import { MULTI_SUN_AR_COPY, MULTI_SUN_RU_COPY } from './multiSunLocalizedCopy'

/**
 * Bespoke copy for MULTI SUN CREAM [SPF40 / PA++] (product 40).
 *
 * SOURCES:
 *   - DTS MG signed formula: four filters totalling 18.50% (octinoxate 7.50%, octisalate 5.00%,
 *     titanium dioxide 3.00%, amiloxate 3.00%), butylene glycol, dimethicone, glycerin,
 *     fragrance 0.25%.
 *   - COA: pH 6.71 inside a 5.00-7.00 specification, stable at 50 °C, microbially clean,
 *     three-year life.
 *   - The registered carton: broad-spectrum UV A & B protection, DERMATOLOGICALLY TESTED, the
 *     calming ingredients line, free from parabens, alcohol and colourants, the precautions.
 *
 * The light, affordable everyday sunscreen of the pair: SPF 40 PA++ under make-up. Ultra Shield
 * is the one for long days outdoors and the highest UVA grade.
 *
 * MUST STAY OUT: a dose-based calming claim for palmitoyl pentapeptide-4 or the ferment (both
 * trace), an unqualified "suitable for sensitive skin" on a fragranced product, any
 * water-resistance or swimming claim, the contract manufacturer and lot codes.
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
    columns: { name: string; amount: string; role: string }
    rows: Array<{ name: string; amount: string; role: string }>
    total: string
  }

  grade: {
    eyebrow: string
    title: string
    body: string
    aside: string
  }

  texture: {
    eyebrow: string
    title: string
    body: string
    aside: string
  }

  calm: {
    eyebrow: string
    title: string
    body: string
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
  headline: 'Your daily shade.',
  subheadline:
    'Light, broad-spectrum sun protection for every morning: SPF 40 PA++ from four UV filters, in a soft cream that sits smoothly under make-up. Dermatologically tested, heat-tested at 50 °C, made in Korea.',
  heroBullets: [
    'SPF 40 PA++: UVB and UVA protection for every day',
    'Four UV filters, 18.50% of the formula',
    'A light cream that sits smoothly under make-up',
    'No parabens, drying alcohol or colourants',
  ],
  badges: ['Made in Korea', '40 g', 'Dermatologically tested', 'Heat-tested at 50 °C'],

  addToBag: 'Add to bag',
  adding: 'Adding…',
  added: 'Added to bag',
  inBag: 'In bag',
  viewBag: 'View bag',
  outOfStock: 'Out of stock',
  vatIncluded: 'VAT included',
  freeDelivery: 'Free delivery over AED 1,000 · Dispatched from Dubai',

  stats: [
    { value: 'SPF 40', label: 'UVB protection for every day' },
    { value: 'PA++', label: 'UVA protection built in' },
    { value: '18.50%', label: 'Four UV filters in the formula' },
    { value: '50 °C', label: 'Heat-tested for Gulf summers' },
  ],

  filters: {
    eyebrow: 'The filter system',
    title: 'Four filters, working as one.',
    intro:
      'Three organic filters and titanium dioxide share the work. Together they give SPF 40 PA++ in a cream light enough for every morning.',
    columns: { name: 'Filter', amount: 'Concentration', role: 'Covers' },
    rows: [
      { name: 'Ethylhexyl Methoxycinnamate', amount: '7.50%', role: 'UVB' },
      { name: 'Ethylhexyl Salicylate', amount: '5.00%', role: 'UVB' },
      { name: 'Titanium Dioxide', amount: '3.00%', role: 'UVB and short-wave UVA' },
      { name: 'Isoamyl p-Methoxycinnamate', amount: '3.00%', role: 'UVB' },
    ],
    total: 'Combined: 18.50% of the formula.',
  },

  grade: {
    eyebrow: 'Reading the label',
    title: 'SPF 40 for UVB. PA++ for UVA.',
    body:
      'SPF measures protection against UVB, the rays behind sunburn; PA grades protection against UVA. Multi Sun pairs SPF 40 with PA++ for the city, the office and the school run, in a texture light enough to wear every single morning.',
    aside: 'Heading out for a long day in strong sun? Ultra Shield SPF 50+ PA++++ is made for it.',
  },

  texture: {
    eyebrow: 'The texture',
    title: 'Light enough for every morning.',
    body:
      'Butylene glycol, dimethicone and glycerin give a soft, non-greasy cream that spreads in seconds and settles quickly, so foundation goes straight on top.',
    aside: 'No parabens, no drying alcohol, no colourants.',
  },

  calm: {
    eyebrow: 'The finish',
    title: 'Calm under the sun.',
    body:
      'Centella asiatica and scutellaria root join rose and grape callus extracts and a touch of hyaluronic acid in the base, with a light, fresh scent.',
  },

  pick: {
    eyebrow: 'Choosing your sunscreen',
    title: 'Two GENOSYS sunscreens, two kinds of day.',
    intro: 'Choose by how long you will be out in the sun.',
    thisOne: {
      title: 'MULTI SUN · SPF 40 PA++',
      items: [
        'The city, the office and the school run',
        'A light texture under make-up',
        'UVA protection at PA++',
        '40 g, at an easy everyday price',
      ],
    },
    otherOne: {
      title: 'ULTRA SHIELD · SPF 50+ PA++++',
      items: [
        'Long days outdoors and high UV',
        'The highest UVA grade, PA++++',
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
        body: 'Apply after your moisturiser and before make-up. It sits smoothly under foundation.',
      },
      {
        title: 'Two fingers for face and neck',
        body: 'A line along your index and middle finger covers the face and neck. Apply less and you get less protection.',
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
    note: 'Sun protection works best every day, not only on beach days.',
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
    title: 'Made for the heat.',
    intro: 'Made in Korea, heat-tested, and checked before it ships.',
    rows: [
      { label: 'Heat', value: 'Tested stable at 50 °C' },
      { label: 'pH', value: '6.71, inside a 5.00-7.00 specification' },
      { label: 'Purity', value: 'Every batch tested; the latest came back ten times cleaner than the microbial limit' },
      { label: 'Testing', value: 'Dermatologically tested' },
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
      'Contains fragrance; the allergens are named in the full ingredient list.',
      'Store cool and dry, away from direct sun and out of reach of children.',
    ],
    note: 'Precautions as printed on the carton.',
  },

  spec: {
    eyebrow: 'The details',
    title: 'At a glance',
    rows: [
      { label: 'Size', value: '40 g' },
      { label: 'Protection', value: 'SPF 40 PA++' },
      { label: 'Filters', value: 'Four · 18.50% combined' },
      { label: 'Texture', value: 'Light cream, made for under make-up' },
      { label: 'pH', value: '6.71' },
      { label: 'Free from', value: 'Parabens, drying alcohol and colourants' },
      { label: 'Fragrance', value: 'Light, 0.25%' },
      { label: 'Water resistance', value: 'Not water resistant: reapply after swimming' },
      { label: 'Testing', value: 'Dermatologically tested' },
      { label: 'Origin', value: 'Made in Korea' },
    ],
  },

  faq: {
    eyebrow: 'Questions',
    title: 'Before you buy',
    items: [
      {
        q: 'How much UVA protection does it give?',
        a: 'PA++, alongside SPF 40, made for everyday city life. For long days in strong sun, Ultra Shield SPF 50+ PA++++ goes further.',
      },
      {
        q: 'Can I wear it under make-up?',
        a: 'Yes, it is made for it: a light cream that settles quickly, so foundation goes straight on top.',
      },
      {
        q: 'How much should I use?',
        a: 'A line along two fingers for the face and neck. Apply less and you get less protection.',
      },
      {
        q: 'How often should I reapply?',
        a: 'At least every two hours outdoors, and after water, sweat or towelling.',
      },
      {
        q: 'Is it water resistant?',
        a: 'No. Reapply after swimming, heavy sweating or towelling.',
      },
      {
        q: 'Does it contain octinoxate?',
        a: 'Yes, at 7.50%, within the 10% European limit. If you prefer a formula without it, Ultra Shield is made without octinoxate.',
      },
      {
        q: 'Is it fragranced?',
        a: 'Lightly, at 0.25%. If fragrance bothers your skin, patch test on a small area first.',
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

/** Ultra Shield first: the page sends long-day and octinoxate-free shoppers straight to it. */
export const COMPANION_PRODUCT_IDS = ['39', '16', '36', '13'] as const
