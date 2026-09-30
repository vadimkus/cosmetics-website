/**
 * Bespoke copy for INTENSIVE PROBLEM CONTROL CREAM (product 30), "Everything under control."
 *
 * EN lives here; RU and AR live in pccreamLocalizedCopy.ts. Selling voice (.cursor/rules/
 * selling-tone.mdc): an oil-free gel cream (no plant oils, butters or waxes), zinc PCA 0.05% at the
 * serum's dose, trehalose and xylitol for water, panthenol, allantoin and beta-glucan for comfort,
 * no perfume, dermatologically tested, massaged in as the last step morning and night, 50g / 250g.
 * Never claimed: non-comedogenic, acne treatment, "no emulsifier" or "no oil at all".
 */

import { PCCREAM_AR_COPY, PCCREAM_RU_COPY } from './pccreamLocalizedCopy'

export type PccreamLocale = 'en' | 'ar' | 'ru'

export interface PccreamCopy {
  eyebrow: string
  headline: string
  subheadline: string
  heroBullets: string[]
  badges: string[]
  packSize: string
  usageNote: string
  chooseSize: string
  sizes: {
    homecareLabel: string
    homecareNote: string
    proLabel: string
    proNote: string
  }
  addToBag: string
  adding: string
  added: string
  inBag: string
  viewBag: string
  loginToShop: string
  outOfStock: string
  vatIncluded: string
  freeDelivery: string
  stats: Array<{ value: string; label: string }>
  effects: {
    eyebrow: string
    title: string
    intro: string
    cards: Array<{ title: string; body: string }>
  }
  engine: {
    eyebrow: string
    title: string
    body: string
    points: Array<{ title: string; body: string }>
    figureAlt: string
  }
  clean: {
    eyebrow: string
    title: string
    intro: string
    items: string[]
    note: string
  }
  howTo: {
    eyebrow: string
    title: string
    frequency: string
    steps: Array<{ title: string; body: string }>
    note: string
    videoTitle: string
  }
  actives: {
    eyebrow: string
    title: string
    intro: string
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
  routine: {
    eyebrow: string
    title: string
    intro: string
    thisProduct: string
    viewProduct: string
    chooseOptions: string
    fromPrice: string
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
    barcodeLabel: string
  }
  closing: {
    title: string
    body: string
  }
  reviewsTitle: string
  backToProducts: string
}

const EN: PccreamCopy = {
  eyebrow: 'Gel cream · Oily and blemish-prone skin',
  headline: 'Everything under control.',
  subheadline:
    'The moisturiser oily skin actually wants to wear. A fresh, oil-free gel cream with zinc PCA to keep shine in check, two sugars that hold water and a comfort trio that keeps skin calm. Massage it in as the last step, morning and night.',
  heroBullets: [
    'Oil-free gel cream: no plant oils, butters or waxes',
    'Zinc PCA 0.05% keeps oil and shine in check',
    'Made for blemish-prone skin and oil control',
    'No perfume · dermatologically tested',
  ],
  badges: ['Dermatologically tested', 'Made in Korea', 'Oil-free gel cream', 'Morning and night'],
  packSize: '50g / 250g',
  usageNote: 'Morning and night, last step',
  chooseSize: 'Choose your size',
  sizes: {
    homecareLabel: 'Homecare',
    homecareNote: 'The 50g tube, for your daily routine at home',
    proLabel: 'Professional',
    proNote: 'The 250g tube, for clinic use',
  },
  addToBag: 'Add to bag',
  adding: 'Adding…',
  added: 'Added',
  inBag: 'In your bag',
  viewBag: 'View bag',
  loginToShop: 'Log in to shop',
  outOfStock: 'Out of stock',
  vatIncluded: 'VAT included',
  freeDelivery: 'Free delivery over 1,000 AED · Ships from Dubai',
  stats: [
    { value: '0', label: 'plant oils, butters or waxes' },
    { value: '0.05%', label: 'zinc PCA, the same as the serum' },
    { value: '86%', label: 'water, set into a fresh gel' },
    { value: 'AM & PM', label: 'the last step, massaged in' },
  ],
  effects: {
    eyebrow: 'What it does',
    title: 'Shine down. Water in. Skin calm.',
    intro:
      'The last step for oily, breakout-prone skin, and the one it should never skip. Oily skin still needs water. It just does not need oil.',
    cards: [
      {
        title: 'Shine in check',
        body: 'Zinc PCA at 0.05% helps keep oil and shine under control all day. Korea licenses the cream for blemish care and oil control.',
      },
      {
        title: 'Water that stays',
        body: 'Trehalose and xylitol, two sugars that help skin hold on to water without any weight.',
      },
      {
        title: 'Calm skin',
        body: 'Panthenol, allantoin and beta-glucan keep skin soft and comfortable, even after toner and serum.',
      },
    ],
  },
  engine: {
    eyebrow: 'The formula',
    title: 'Water, set into a gel.',
    body:
      'An ordinary cream blends oil and water. This one leaves the oil out: water is set into a light gel, so it glides over your serum and sinks in without ever feeling like another layer.',
    points: [
      {
        title: 'Zinc PCA 0.05%',
        body: 'The oil-control star, at the same dose as the Problem Control Serum. Zinc paired with PCA, a moisture factor skin makes itself.',
      },
      {
        title: 'Trehalose · Xylitol',
        body: 'Two sugar humectants that help skin hold water, so oily skin stops feeling tight.',
      },
      {
        title: 'Panthenol · Allantoin · Beta-glucan',
        body: 'The comfort trio, for skin that stays soft and calm.',
      },
      {
        title: 'Ferments and botanicals',
        body: 'Pumpkin and radish root ferments, mung bean, white birch bark and yellow dock, with polyglutamic acid.',
      },
    ],
    figureAlt: 'Intensive Problem Control Cream: water set into a gel, with zinc PCA',
  },
  clean: {
    eyebrow: 'Left out',
    title: 'Nothing your skin does not need.',
    intro: 'A clean formula for skin that reacts easily.',
    items: [
      'No paraben',
      'No artificial surfactant',
      'No artificial fragrance',
      'No artificial pigment',
      'No ethanol',
      'No plant oils, butters or waxes',
    ],
    note: 'No perfume at all, synthetic or botanical.',
  },
  howTo: {
    eyebrow: 'How to use',
    title: 'Last step. Massage it in.',
    frequency: 'Morning and night',
    steps: [
      {
        title: 'Cleanse',
        body: 'Start on clean skin. Snow O₂ Cleanser is the perfect first step.',
      },
      {
        title: 'Toner, then serum',
        body: 'Intensive Problem Control Toner, then Problem Control Serum patted in.',
      },
      {
        title: 'Massage it in',
        body: 'Smooth a little over the face and massage gently until it sinks in.',
      },
      {
        title: 'Sunscreen by day',
        body: 'At night it is the last step. In the morning, sunscreen goes on top.',
      },
    ],
    note: 'Keep it away from the eye area. An eye cream does that job.',
    videoTitle: 'See the texture',
  },
  actives: {
    eyebrow: 'What is in it',
    title: 'The full formula.',
    intro: 'Zinc PCA, two water-holding sugars and a comfort trio, in a light water gel.',
    inciTitle: 'Full ingredient list (INCI)',
    inciNote: 'Every ingredient, exactly as printed on the carton.',
  },
  suited: {
    eyebrow: 'Is it for you',
    title: 'Made for oily skin.',
    forTitle: 'Perfect if',
    forList: [
      'Your skin is oily or combination and every cream feels like too much',
      'You break out and have been skipping moisturiser because of it',
      'You use the Problem Control toner or serum and want the step that finishes them',
      'You want a light last layer that sits well under sunscreen in Gulf heat',
      'You want no perfume and no heavy oils',
    ],
    notTitle: 'Look elsewhere if',
    notList: [
      'Your skin is dry and craves a rich cream: a nourishing formula will suit it better',
      'You are treating diagnosed acne, which is a job for your doctor',
      'You want brightening or wrinkle care, which other GENOSYS creams cover',
    ],
    note:
      'For external use only. Keep it away from the eye area, and stop and speak to a doctor if redness, swelling or irritation appears.',
  },
  routine: {
    eyebrow: 'Complete the routine',
    title: 'What to put it with.',
    intro: 'The last step of the Problem Control routine. Add the steps that come before it.',
    thisProduct: 'This product',
    viewProduct: 'View product',
    chooseOptions: 'Choose options',
    fromPrice: 'From',
  },
  faq: {
    eyebrow: 'Questions',
    title: 'Common questions.',
    items: [
      {
        q: 'Is it really oil-free?',
        a: 'Yes. No plant oils, no butters, no waxes: it is a water gel, which is why it feels so light on oily skin.',
      },
      {
        q: 'If I have the serum, do I need the cream?',
        a: 'They work as a pair. Both carry zinc PCA at 0.05%: the serum is the light layer that absorbs straight away, and the cream is the gel that finishes the routine and holds hydration in. Very oily skin starting with one should start with the serum.',
      },
      {
        q: 'Will a cream make me break out?',
        a: 'Heavy oils and butters are what most people worry about, and this cream leaves them out. It is a light water gel with zinc PCA to keep oil in check, made for blemish-prone skin.',
      },
      {
        q: 'Why massage it in?',
        a: 'A gel spreads best when you work it in. Massage gently until it sinks in. The serum before it is patted.',
      },
      {
        q: 'What is the difference between 50g and 250g?',
        a: 'Only the size. The 50g is the home tube and the 250g the professional tube, with the same formula inside.',
      },
      {
        q: 'Does it have a scent?',
        a: 'No. There is no perfume in it at all.',
      },
      {
        q: 'Can I wear it under sunscreen?',
        a: 'Yes. It is light enough to sit under sunscreen every morning.',
      },
    ],
  },
  details: {
    eyebrow: 'Details',
    title: 'The details.',
    rows: [
      { label: 'Format', value: 'Oil-free gel cream, tube' },
      { label: 'Sizes', value: '50g homecare / 250g professional' },
      { label: 'Made for', value: 'Blemish-prone skin and oil control' },
      { label: 'When', value: 'Morning and night, as the last step' },
      { label: 'Skin types', value: 'Oily and combination skin' },
      { label: 'Texture', value: 'Light gel cream' },
      { label: 'Fragrance', value: 'None' },
      { label: 'Shelf life', value: 'Three years unopened, with the expiry date on the box' },
      { label: 'Testing', value: 'Dermatologically tested' },
      { label: 'Origin', value: 'Made in Korea by DTS MG' },
    ],
    barcodeLabel: 'Barcode',
  },
  closing: {
    title: 'The moisturiser oily skin can actually keep on.',
    body: 'Zinc PCA in a fresh, oil-free gel cream. Everything under control.',
  },
  reviewsTitle: 'Reviews',
  backToProducts: 'All products',
}

const BY_LOCALE: Record<PccreamLocale, PccreamCopy> = {
  en: EN,
  ar: PCCREAM_AR_COPY,
  ru: PCCREAM_RU_COPY,
}

export function getPccreamCopy(locale: string): PccreamCopy {
  return BY_LOCALE[(locale as PccreamLocale) in BY_LOCALE ? (locale as PccreamLocale) : 'en']
}
