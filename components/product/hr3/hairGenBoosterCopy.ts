import {
  HAIRGEN_BOOSTER_AR,
  HAIRGEN_BOOSTER_RU,
} from './hairGenBoosterLocalizedCopy'

/**
 * Bespoke copy for the HairGen BOOSTER (product 3), the powered device the HR³ MATRIX
 * hair system is built around. Campaign: "IN. NOT ON." (27 Sep 2026), slides in
 * public/images/hairgen_campaign/.
 *
 * SOURCING - the 17 Jun 2021 sales leaflet and the multilingual user manual, both in
 * `~/Desktop/Drive/Genosys/Training Materials/HairGen_Booster/`. There is no Intertek
 * dossier because it is a device rather than a cosmetic; the specification does the job a
 * formula table does elsewhere. Audit:
 * docs/SESSION_CHANGES_2026-08-18_PRODUCT_3_HAIRGEN_BOOSTER_AUDIT.md
 *
 * Carried, because the leaflet and manual state them in cosmetic terms:
 *   - 52 microneedles per stamp; 14 LEDs, blue and red, through 48 light bumps
 *   - three speeds, 280 / 330 / 400 per minute; ten minutes, then it stops itself
 *   - "no pain during treatment - massaging sensation instead of needling sensation"
 *   - "hair solution is absorbed within 10 mins"
 *   - the stamp creates pathways that allow the ampoule's actives to be delivered
 *   - "help to make the right environment for healthy scalp and hair"
 *   - a fresh vial and stamp every session; in the box: device, USB-C cable, stand
 *   - 5.0 V DC / 2.0 A, charge after use; 24-month warranty
 *
 * The leaflet also makes medical claims (alopecia and its clinical photographs, new vessel
 * formation, blood circulation, wound healing, collagen, hair-cycle mechanics, 5α-reductase
 * / DHT, VEGF). None of them may appear, in any language. The scalp-care framing follows the
 * manual's Korean, German and Chinese panels, as on products 43-47.
 *
 * NEEDLE DEPTH belongs to the stamp, not the handpiece: 0.3 mm, the same figure product 64's
 * page states (from the product artwork; written confirmation requested from DTS MG). If DTS
 * MG answers differently, both pages change together. The Mesopecia kit's 0.5 mm is its
 * roller, a different applicator.
 *
 * MUST NEVER BE ADDED:
 *   - Alopecia, alopecia areata, androgenic alopecia, or the before/after photographs.
 *   - Angiogenesis, vasodilation, new vessel formation, blood circulation.
 *   - Anagen / telogen / catagen mechanics, or that the light extends the growth phase.
 *   - 5α-reductase, DHT, VEGF as an active.
 *   - Wound healing, collagen and elastin production.
 *   - Any effect for the blue or red light on its own (sebum, microbes, keratin, metabolism).
 *   - Hair regrowth.
 */

export type Locale = 'en' | 'ar' | 'ru'

export interface HairGenBoosterCopy {
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

  whatItIs: {
    eyebrow: string
    title: string
    body: string
    items: string[]
    detail: string
    /** Closing paragraph of the opening section. */
    leaflet: string
  }

  build: {
    eyebrow: string
    title: string
    intro: string
    items: Array<{ name: string; dose: string; body: string }>
  }

  running: {
    eyebrow: string
    title: string
    intro: string
    rows: Array<{ label: string; value: string; note: string; here?: boolean }>
    body: string
  }

  howTo: {
    eyebrow: string
    title: string
    frequency: string
    steps: Array<{ title: string; body: string }>
    note: string
  }

  depth: {
    eyebrow: string
    title: string
    body: string
    note: string
  }

  spec: {
    eyebrow: string
    title: string
    rows: Array<{ label: string; value: string }>
  }

  safety: {
    eyebrow: string
    title: string
    points: string[]
    note: string
  }

  video: { eyebrow: string; title: string; body: string }

  /** `needsPrices` marks answers quoting dirham figures; hidden from signed-out visitors. */
  faq: {
    eyebrow: string
    title: string
    items: Array<{ q: string; a: string; needsPrices?: boolean }>
  }

  companionsTitle: string
  backToProducts: string
}

const EN: HairGenBoosterCopy = {
  eyebrow: 'HairGen BOOSTER · auto-microneedling with blue and red LED',
  headline: 'In, not on: the ampoule goes into the scalp as it stamps.',
  subheadline:
    'Professional scalp care that runs itself. A fresh stamp of 52 microneedles screws onto a sealed 4 ml vial of HR³ MATRIX HAIR SOLUTION α, the vial loads into the handpiece, and the head stamps for you while the solution feeds through it - so the ampoule goes into the scalp, not onto the hair. Three speeds, blue and red light, and a ten-minute session that ends itself.',
  heroBullets: [
    'Feels like a scalp massage, not needles',
    '52 microneedles on a fresh stamp every session',
    'Three speeds: 280, 330 and 400 stamps per minute',
    'Ten-minute session, then it switches itself off',
  ],
  badges: ['Made in Korea', 'Blue + red LED', '10-minute session', '24-month warranty'],

  addToBag: 'Add to bag',
  adding: 'Adding…',
  added: 'Added to bag',
  inBag: 'In bag',
  viewBag: 'View bag',
  outOfStock: 'Out of stock',
  vatIncluded: 'VAT included',
  freeDelivery: 'Free delivery over AED 1,000 · Dispatched from Dubai',

  stats: [
    { value: '52', label: 'microneedles on every stamp' },
    { value: '280-400', label: 'stamps per minute, three speeds' },
    { value: '10 min', label: 'timed session, then it stops' },
    { value: '24 mo', label: 'warranty' },
  ],

  whatItIs: {
    eyebrow: 'The idea',
    title: 'In, not on.',
    body:
      'A serum rubbed onto the scalp has to find its own way down through the hair. HairGen BOOSTER takes it the rest of the way: the needles open micro-pathways in the scalp and the ampoule feeds through the stamp at the same moment, so the HR³ solution goes in while the head works. Even rate, even pressure, the same ten minutes every time.',
    items: [
      'Works the HR³ MATRIX HAIR SOLUTION α ampoule into the scalp as it stamps',
      'The ampoule absorbs within the ten-minute session',
      'Blue and red light from 14 LEDs in the head',
      'Feels like a massage: no pain, no needling feel',
    ],
    detail:
      'The ampoule is made to nourish the scalp and condition hair, and microneedling with LED light sets the right environment for a healthy scalp and hair.',
    leaflet:
      'Charge it, load a fresh stamp and vial, and let the device keep the rate and the time. You just glide.',
  },

  build: {
    eyebrow: 'Inside the head',
    title: 'Built to do the stamping for you',
    intro: 'Six numbers that make every session the same good session.',
    items: [
      {
        name: 'Microneedles',
        dose: '52',
        body: 'On a fresh single-use stamp that screws straight onto the ampoule. A new one every session keeps every treatment clean and every needle sharp.',
      },
      {
        name: 'Stamping rate',
        dose: '280 · 330 · 400',
        body: 'Stamps per minute, across three speeds. A short press of the power button changes the pace, and the device holds it evenly while you glide.',
      },
      {
        name: 'Session',
        dose: '10 min',
        body: 'The device counts the session and switches itself off, and the ampoule absorbs within those ten minutes. Nothing to time, nothing to guess.',
      },
      {
        name: 'LEDs',
        dose: '14',
        body: 'Blue and red, glowing through 48 clear light bumps in the head that meets the scalp.',
      },
      {
        name: 'Power',
        dose: '5 V / 2 A',
        body: 'Rechargeable over the USB-C cable in the box. Charge it after each session and it is ready for the next one.',
      },
      {
        name: 'Warranty',
        dose: '24 months',
        body: 'Two years from the date of purchase.',
      },
    ],
  },

  running: {
    eyebrow: 'Every session',
    title: 'What each session takes',
    intro: 'A fresh stamp and a fresh ampoule every time, both sold in boxes of eight.',
    rows: [
      { label: 'HR³ MATRIX HAIR SOLUTION α - one 4 ml vial', value: '92.50', note: 'AED 740 for eight' },
      { label: 'HR³ MATRIX HAIR STAMP - one stamp', value: '57.50', note: 'AED 460 for eight' },
      { label: 'Per session', value: '150', note: 'consumables', here: true },
      { label: 'The device itself', value: '1,800', note: 'once' },
    ],
    body: 'A box of each covers eight sessions, so buy them in pairs and they run out together.',
  },

  howTo: {
    eyebrow: 'How to use',
    title: 'Load it, part the hair, glide along the parting',
    frequency: 'One vial and one stamp per session · ten minutes',
    steps: [
      {
        title: 'Fit a fresh stamp to the ampoule',
        body: 'Take the cap and the metal lid off a sealed HR³ MATRIX HAIR SOLUTION α vial and screw a new HR³ MATRIX HAIR STAMP onto the opening.',
      },
      {
        title: 'Load it into the device',
        body: 'Twist the LED cover off the handpiece, seat the vial and stamp in the bottom of the device, then twist the cover back on until it clicks.',
      },
      {
        title: 'Switch on, pick a speed',
        body: 'Hold the power button for about two seconds. A short press moves through levels 1, 2 and 3: 280, 330 and 400 stamps per minute.',
      },
      {
        title: 'Part the hair and glide',
        body: 'Take a parting with a comb and glide the head along it; the device does the stamping, so there is no need to press. Move to the next parting and repeat across the area.',
      },
      {
        title: 'Let it finish',
        body: 'After ten minutes it switches itself off. That is one full session.',
      },
      {
        title: 'Empty it and charge it',
        body: 'Twist the cover off, throw away the used vial and stamp, and put the device on charge so it is ready next time.',
      },
    ],
    note:
      'Use the ampoule as soon as it is open: each vial is one session. And pair the device only with the HR³ products made for it - the stamp screws onto the HR³ vial, and the system is built around the two together.',
  },

  depth: {
    eyebrow: 'The stamp',
    title: 'Why it feels like a massage',
    body:
      'The needle depth is set by the stamp, not the handpiece, and the HR³ MATRIX HAIR STAMP is 0.3 mm: a cosmetic depth. Add an even, powered rhythm instead of hand pressure, and what you feel is a steady massage along the parting rather than needles.',
    note: 'A fresh stamp every session means sharp needles and the same feel every time.',
  },

  spec: {
    eyebrow: 'The details',
    title: 'Specification',
    rows: [
      { label: 'Type', value: 'Rechargeable auto-microneedling handpiece with LED head' },
      { label: 'Microneedles', value: '52, on a single-use HR³ MATRIX HAIR STAMP' },
      { label: 'Needle depth', value: '0.3 mm, set by the stamp' },
      { label: 'Speeds', value: 'Three levels: 280, 330 and 400 stamps per minute' },
      { label: 'Session', value: 'Ten minutes, then automatic shut-off' },
      { label: 'LEDs', value: '14, blue and red, through 48 light bumps' },
      { label: 'Used with', value: 'HR³ MATRIX HAIR SOLUTION α, one sealed 4 ml vial per session' },
      { label: 'In the box', value: 'HairGen BOOSTER, USB-C cable, stand' },
      { label: 'Power', value: '5.0 V DC / 2.0 A · charger rated 5 V, 1-2 A' },
      { label: 'Warranty', value: '24 months from purchase, normal use' },
      { label: 'Origin', value: 'Made in South Korea · DTS MG Co., Ltd.' },
    ],
  },

  safety: {
    eyebrow: 'Before you use it',
    title: 'Who should not use it',
    points: [
      'Do not use if you have progressive acne, eczema or any dermatitis.',
      'Do not use if you have complications of diabetes or another serious illness.',
      'Do not use if you are keloid-prone or have a metal allergy - the needles are steel.',
      'Do not use over inflamed areas, or areas at risk of infection.',
      'Do not use on broken, wounded, sunburned or freshly shaved scalp.',
      'Stop immediately and seek medical advice if a rash or allergic reaction appears.',
      'Use it only with the HR³ products made for it.',
      'A fresh stamp every session. It is single use and it is personal - never share one.',
      'Do not disassemble, modify or repair the device yourself.',
      'Do not handle the device or the charger with wet hands. Keep out of reach of children.',
    ],
    note: 'If any of these apply to you, talk to your doctor before you start.',
  },

  video: {
    eyebrow: 'In use',
    title: 'The device, working',
    body: 'A short demonstration of loading an ampoule and gliding along a parting.',
  },

  faq: {
    eyebrow: 'Questions',
    title: 'Before you buy',
    items: [
      {
        q: 'Does it hurt?',
        a: 'No. It feels like a scalp massage rather than needling: the 0.3 mm stamp and the even, powered rhythm see to that. If your routine starts with the HR³ MATRIX SCALP PEELING α, use it on intact scalp and let it dry fully before the device goes on.',
      },
      {
        q: 'How deep do the needles go?',
        a: '0.3 mm, a cosmetic depth, set by the HR³ MATRIX HAIR STAMP rather than the handpiece. That is why it feels like a massage rather than needles.',
      },
      {
        q: 'What does a session cost?',
        a: 'A fresh 4 ml ampoule and a fresh stamp: AED 92.50 and AED 57.50 at list price, so AED 150 a session on top of the device. Both come in boxes of eight - eight sessions when you buy them in pairs.',
        needsPrices: true,
      },
      {
        q: 'Will it help with hair loss?',
        a: 'HairGen BOOSTER is scalp care: it works the HR³ ampoule, made to nourish the scalp and condition hair, into the scalp evenly and on schedule. If hair is falling out suddenly, in patches or in large amounts, see a doctor first - the device does not replace diagnosis or treatment, and it fits alongside what they advise.',
      },
      {
        q: 'Can I use my own serum in it?',
        a: 'Use HR³ MATRIX HAIR SOLUTION α. The stamp screws onto the HR³ vial, so the ampoule is part of the mechanism, and the device is designed to be used only with the products made for it.',
      },
      {
        q: 'What comes in the box?',
        a: 'The HairGen BOOSTER handpiece, a USB-C charging cable and a stand. Stamps and ampoules are sold separately, in boxes of eight.',
      },
    ],
  },

  companionsTitle: 'What it works with',
  backToProducts: 'Products',
}

export const HAIRGEN_BOOSTER_COPY: Record<Locale, HairGenBoosterCopy> = {
  en: EN,
  ar: HAIRGEN_BOOSTER_AR,
  ru: HAIRGEN_BOOSTER_RU,
}

export function getHairGenBoosterCopy(locale: string | undefined): HairGenBoosterCopy {
  return HAIRGEN_BOOSTER_COPY[(locale as Locale) ?? 'en'] ?? HAIRGEN_BOOSTER_COPY.en
}

/** The two consumables it cannot run without, then the prep step. */
export const COMPANION_PRODUCT_IDS = ['45', '64', '46'] as const
