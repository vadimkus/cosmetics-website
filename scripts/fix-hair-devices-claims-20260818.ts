/**
 * Products 3 (HairGen BOOSTER) and 48 (Hair-GENTRON) — remove the hair-loss treatment
 * claims from the database records.
 *
 * Both device records were written before the HR³ MATRIX line was audited, and both
 * still claimed what was stripped from products 43–47 on 17–18 Aug:
 *
 *   3  "designed for comprehensive scalp treatment and hair loss prevention",
 *      "promote hair growth", "deliver nutrients directly to the hair follicles"
 *   48 "designed for professional hair loss treatment and scalp therapy",
 *      "promote hair growth, improve scalp circulation"
 *
 * PRODUCT 3 is now described from what its own documents actually specify — the 2021
 * leaflet and the user manual. See
 * docs/SESSION_CHANGES_2026-08-18_PRODUCT_3_HAIRGEN_BOOSTER_AUDIT.md. Note the leaflet
 * itself is the worst claim document in the line (subtitled "for Alopecia Treatment",
 * with before/after photographs captioned alopecia areata); none of it is carried.
 *
 * PRODUCT 48 has no documentation on file at all — no manual, no leaflet, no study. So
 * its record is now limited to what the device physically is and says plainly that no
 * efficacy evidence is held. The patent number and the award are kept because they are
 * verifiable identity facts, but they are not evidence that the device does anything.
 *
 * NEEDLE DEPTH is deliberately absent from product 3: it is stated in neither the
 * leaflet nor the manual.
 *
 * Run: npx tsx --env-file=.env.local scripts/fix-hair-devices-claims-20260818.ts
 */

import { prisma } from '../lib/prisma'

const BOOSTER_DESCRIPTION = [
  'A powered microneedling handpiece for the scalp with LED, used with the HR³ MATRIX HAIR SOLUTION α',
  'ampoule. A single-use stamp carrying 52 microneedles screws onto a sealed 4 ml vial, the vial loads into',
  'the device, and the head stamps automatically while the solution feeds through it — so the liquid goes in',
  'as the needles work rather than being rubbed on afterwards.',
  '',
  'Three speeds: 280, 330 and 400 stamps per minute. It runs for ten minutes and then stops itself, which is',
  'one session. A fresh vial and a fresh stamp are fitted each time. Fourteen LEDs, blue and red, sit behind',
  '48 light bumps in the head.',
  '',
  'The ampoule it delivers is registered for nutrition supply and hair conditioning. Neither it nor this device',
  'is registered to treat hair loss, and no efficacy study for the device is held. If you are losing hair, see a',
  'doctor first.',
].join(' ')

const BOOSTER_DETAILS = JSON.stringify({
  form: 'Rechargeable auto-microneedling handpiece with LED head',
  usedWith: 'HR³ MATRIX HAIR SOLUTION α, one sealed 4 ml vial per session',
  applicator:
    'HR³ MATRIX HAIR STAMP — 52 microneedles, single use. Sold separately as product 64, a box of eight',
  needleDepth:
    'Not stated in the manufacturer documents we hold — neither the leaflet nor the user manual gives a depth',
  leds: '14 LEDs, blue and red, dispersed through 48 light bumps',
  speeds: 'Three levels — 280, 330 and 400 RPM',
  runTime: 'Ten minutes, then the device stops automatically. One session',
  consumables:
    'A new stamp and a new solution vial every session. Roughly AED 167 per session at list prices — AED 92.50 for '
    + 'a vial and AED 75 for a stamp',
  power: '5.0 V DC / 2.0 A. Charger rated output 5 V, 1–2 A. Charge after use',
  warranty: '24 months from purchase, for normal use per the manufacturer guidelines',
  sensation:
    'The manufacturer describes it as a massaging rather than a needling sensation, with no pain during '
    + 'treatment',
  doNotUse:
    'Progressive acne, eczema or any dermatitis; complications of diabetes or other serious illness; '
    + 'keloid-prone skin or metal allergy; inflamed areas or areas at risk of infection. Stop and seek medical '
    + 'advice on rash or allergic reaction',
  notWith:
    'Do not use with cosmetics other than those the manufacturer recommends — this device opens channels in '
    + 'skin, and a formula that is safe on the surface is a different proposition below it',
  evidence:
    'No efficacy study is held for this device. The manufacturer literature makes claims we do not carry',
  origin: 'South Korea — DTS MG Co., Ltd.',
})

const BOOSTER_FEATURES = JSON.stringify([
  {
    title: '52 microneedles, replaced every session',
    description:
      'The stamp is single use. A fresh one goes on with a fresh 4 ml ampoule each time, which is the honest '
      + 'running cost of the device rather than a detail buried in the manual.',
  },
  {
    title: 'Stamps for you, at 280 to 400 per minute',
    description:
      'Three speed levels. The point of a powered handpiece over a hand roller is an even rate and even '
      + 'pressure across the parting.',
  },
  {
    title: 'Ten minutes, then it stops',
    description:
      'The device times the session itself and switches off, so the treatment length is not a judgement call.',
  },
  {
    title: '14 LEDs behind 48 light bumps',
    description:
      'Blue and red, in the head that contacts the scalp. We make no claim for what the light does; the '
      + 'manufacturer does, and we are not carrying it.',
  },
])

const BOOSTER_BENEFITS = JSON.stringify([
  'Delivers the HR³ MATRIX HAIR SOLUTION α ampoule as it needles, rather than leaving it on the surface',
  'An even, powered stamping rate instead of hand pressure',
  'A timed ten-minute session that ends itself',
  'A fresh single-use stamp every treatment',
  '24-month warranty',
])

const GENTRON_DESCRIPTION = [
  'An LED helmet for the scalp, with massage and heating functions. It combines infrared, red and blue light',
  'with air-pressure massage, and is intended for professional use.',
  '',
  'We hold no manual, no leaflet and no efficacy study for this device, so this description is limited to what',
  'it physically is. It is not registered to treat hair loss, and nothing here should be read as evidence that',
  'it does. Korean patent 10-2151442.',
].join(' ')

const GENTRON_DETAILS = JSON.stringify({
  form: 'LED helmet with massage and heating functions',
  light: 'Infrared, red and blue LEDs',
  functions: 'Air-pressure massage, heating, music mode',
  use: 'Professional and home use',
  patent: 'Korea, 10-2151442',
  award: 'Bronze medal, 2020 Korea invention patent competition. An award, not evidence of efficacy',
  evidence:
    'No user manual, leaflet, specification sheet or efficacy study for this device is on file. Treatment '
    + 'times, wavelengths and irradiance are therefore not published here — ask before recommending a protocol',
  doNotUse:
    'Follow the same caution as any scalp device: avoid over active dermatitis, broken or inflamed skin, and '
    + 'ask a doctor first if you have a photosensitivity condition or take photosensitising medication',
  origin: 'South Korea',
})

// Purely descriptive. The previous set claimed hair growth stimulation, improved blood
// circulation, "no side effects" and "guaranteed … maximum effectiveness" for a device we
// hold no documentation of whatsoever.
const GENTRON_FEATURES = JSON.stringify([
  {
    title: 'Infrared, red and blue LEDs',
    description:
      'Three light types in one helmet. We do not publish wavelengths, irradiance or treatment times, because '
      + 'the manufacturer has not supplied them to us.',
  },
  {
    title: 'Air-pressure massage',
    description: 'Can run at the same time as the light. It is a massage function; it feels pleasant.',
  },
  {
    title: 'Heating',
    description: 'An optional warmth setting that can be added during a session.',
  },
  {
    title: 'Music mode',
    description: 'Built in, to make sitting under a helmet for a session more comfortable.',
  },
])

const GENTRON_BENEFITS = JSON.stringify([
  'Hands-free — it sits on the head, so a session needs no technique',
  'Light, massage and warmth in one device, usable together',
  'Suitable for clinic or home use',
  'Korean patent 10-2151442',
  'No efficacy study for this device is held, and we make no claim about results',
])

async function main() {
  const booster = await prisma.product.findFirst({ where: { name: { contains: 'HairGen' } } })
  const gentron = await prisma.product.findFirst({ where: { name: { contains: 'GENTRON' } } })
  if (!booster) throw new Error('HairGen BOOSTER not found')
  if (!gentron) throw new Error('Hair-GENTRON not found')

  await prisma.product.update({
    where: { id: booster.id },
    data: {
      description: BOOSTER_DESCRIPTION,
      productDetails: BOOSTER_DETAILS,
      keyFeatures: BOOSTER_FEATURES,
      benefits: BOOSTER_BENEFITS,
    },
  })

  await prisma.product.update({
    where: { id: gentron.id },
    data: {
      description: GENTRON_DESCRIPTION,
      productDetails: GENTRON_DETAILS,
      keyFeatures: GENTRON_FEATURES,
      benefits: GENTRON_BENEFITS,
    },
  })

  const banned = [
    'hair loss treatment', 'hair loss prevention', 'promote hair growth', 'stimulate',
    'angiogenesis', 'regrowth', 'follicle stimulation',
  ]
  for (const id of [booster.id, gentron.id]) {
    const p = await prisma.product.findUnique({ where: { id } })
    const blob = [p?.description, p?.benefits, p?.keyFeatures, p?.productDetails].join(' ').toLowerCase()
    const hits = banned.filter(t => blob.includes(t))
    console.log(`${p?.name}: ${hits.length ? `STILL PRESENT → ${hits.join(', ')}` : 'clean'}`)
  }
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
