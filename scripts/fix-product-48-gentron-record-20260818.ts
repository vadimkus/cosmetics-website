/**
 * Product 48 (Hair-GENTRON) — correct the record against the documents we actually hold.
 *
 * ★ THE RECORD WAS WRONG IN BOTH DIRECTIONS.
 *
 * Before 18 Aug it claimed "professional hair loss treatment and scalp therapy",
 * "promote hair growth, improve scalp circulation". Those were stripped that morning by
 * scripts/fix-hair-devices-claims-20260818.ts — correctly.
 *
 * But the replacement text said: "We hold no manual, no leaflet and no efficacy study for
 * this device", and productDetails.evidence said no user manual, leaflet or specification
 * sheet was on file. That is false, and it was written without looking. The folder
 * ~/Desktop/Drive/Genosys/Registration/Gentron/ holds:
 *
 *   - User's manual-HAIR GENTRON.pdf      EN / KR / JP, with the full specification,
 *                                          the operating sequence and eight contraindications
 *   - Declaration of Conformity-...pdf     EU DoC, 17 Dec 2019, EMC 2014/30/EU + LVD 2014/35/EU
 *   - Low Voltage Directory-...pdf         IEC/EN 60335-2-32 test report LR500121912U,
 *                                          105 pages — "particular requirements for massage appliance"
 *   - EMC / EMS test reports                LR500121910I, LR500121910J
 *   - Genosys_HAIR_GENTRON.pdf              sales brochure, also at public/documents/PPT/HAIR GENTRON.pdf
 *
 * So the record now carries the real specification: model HGHY01, 230 × 240 × 300 mm,
 * 1.0 kg, four LED modes, 10/20/30-minute timer with a 30-minute maximum, adaptor 5 V
 * 1.5 A or 4 × AA, 24-month warranty, and the manual's eight "consult your doctor first"
 * groups — which were on no surface of our site at all.
 *
 * WHAT IS STILL REFUSED, and why it is not a contradiction: the brochure claims the light
 * is absorbed by follicle mitochondria, extends the growth phase, stimulates anagen
 * re-entry, prolongs anagen, prevents premature catagen, improves blood flow and delivers
 * nutrients to the follicle. That is the same claim family refused on products 3 and
 * 43–47. Having a document is not the same as the document being true: the certificates
 * test this as a household massage appliance, not as phototherapy.
 *
 * WAVELENGTHS ARE BROCHURE-ONLY (840 / 640 / 420 nm) and third-party listings disagree
 * with them (850 / 620 / 470 nm, 60 LEDs). The manual prints no wavelength, no LED count
 * and no irradiance, so the record says exactly that rather than picking a set.
 *
 * Run: npx tsx --env-file=.env.local scripts/fix-product-48-gentron-record-20260818.ts
 */

import { prisma } from '../lib/prisma'

const DESCRIPTION = [
  'An LED helmet for the scalp with air-pressure massage and a heating function, on a separate controller.',
  'Four light modes — red with infrared, blue, off, or all three together — and a timer set to ten, twenty or',
  'thirty minutes. Holding the power button starts a ten-minute preset that runs the massage, the heat, all',
  'three lights and music together, and the helmet switches itself off at the end.',
  '',
  'The helmet weighs 1.0 kg and runs from the USB-C adaptor in the box or from four AA batteries, which are not',
  'included. Korea and the EU certify it as a household massage appliance under IEC/EN 60335-2-32; it is not a',
  'medical or phototherapy device, and it is not registered to treat hair loss.',
  '',
  'The manufacturer manual positions a session as a supplement after a medical or aesthetic procedure rather',
  'than as a treatment of its own. No efficacy study for this device is held, and the claims in the sales',
  'brochure about the hair cycle are not carried. If you are losing hair, see a doctor first.',
].join(' ')

const DETAILS = JSON.stringify({
  form: 'LED helmet with air-pressure massage and heating, on a separate controller',
  model: 'HGHY01',
  contents: 'Helmet, stand, controller, USB-C cable and power adaptor',
  ledModes: 'Four — red + infrared / blue / off / red + blue + infrared',
  wavelengths:
    'The sales brochure prints 840 nm infrared, 640 nm red and 420 nm blue. The user manual prints no '
    + 'wavelength, no LED count and no irradiance, and third-party listings quote different figures, so treat '
    + 'the brochure numbers as unconfirmed',
  session:
    'Ten, twenty or thirty minutes, set on the controller; the helmet stops itself. The manual sets a maximum '
    + 'of thirty minutes at a time',
  preset: 'A one-second hold starts a ten-minute preset: air-pressure massage, heat, all three lights and music',
  power: 'Adaptor input AC 100–240 V 50/60 Hz, output DC 5 V 1.5 A. Or 4 × 1.5 V AA batteries, not included',
  size: 'Helmet L 230 × W 240 × H 300 mm. Controller L 158 × W 68 × H 42 mm. Net weight 1.0 kg',
  storage: 'Temperature 5–40 °C, humidity 80% or below',
  certification:
    'CE. EU Declaration of Conformity dated 17 Dec 2019 against EMC 2014/30/EU and LVD 2014/35/EU. Tested to '
    + 'IEC/EN 60335-2-32, the particular requirements for a massage appliance',
  patent:
    'Korea 10-2151442. Bronze medal, 2020 Korea Invention Patent Exhibition — an award, not evidence of efficacy',
  warranty: '24 months from purchase, for normal use per the user manual',
  consultDoctorFirst:
    'Anyone under medical treatment; anyone with an implanted electronic medical device; heart disease; disease '
    + 'of the head; pregnancy; osteoporosis or a fractured spine; circulation problems from diabetes or another '
    + 'disease; body temperature over 38 °C',
  precautions:
    'Keep away from children, liquid and heat. Do not use a damaged adaptor or operate with wet hands. Do not '
    + 'run longer than thirty minutes at a time. Users insensitive to heat should turn the heating off. Stop '
    + 'and consult a doctor if anything feels abnormal',
  evidence:
    'No efficacy study for this device is held. The user manual, the EU Declaration of Conformity and the '
    + 'IEC 60335-2-32 test report are on file; the sales brochure makes hair-cycle claims we do not carry',
  origin: 'South Korea — DTS MG Co., Ltd., Seoul',
})

const FEATURES = JSON.stringify([
  {
    title: 'Four LED modes on one button',
    description:
      'Red with infrared, blue alone, lights off, or all three together. The massage and the heat run with the '
      + 'lights on or off. The manual prints no wavelength or LED count, so we publish none.',
  },
  {
    title: 'Ten, twenty or thirty minutes, then it stops',
    description:
      'The controller times the session and switches the helmet off. Thirty minutes is the manual\u2019s maximum '
      + 'for a single session, not a suggestion.',
  },
  {
    title: 'Air-pressure massage and heat',
    description:
      'Each on its own button, usable together or separately. This is what the certificates test the device as: '
      + 'a massage appliance.',
  },
  {
    title: 'Mains or batteries',
    description:
      'USB-C adaptor in the box, or four AA cells in the controller for a session away from a socket. The '
      + 'batteries are not included.',
  },
])

const BENEFITS = JSON.stringify([
  'Hands-free — the helmet sits on the head, so a session needs no technique and no second person',
  'Light, air-pressure massage and warmth in one device, usable together or separately',
  'The session is timed and ends itself, with a thirty-minute ceiling set by the manufacturer',
  'No consumable — nothing is replaced between sessions',
  'CE marked; tested to IEC/EN 60335-2-32 as a massage appliance',
  'No efficacy study for this device is held, and we make no claim about results',
])

async function main() {
  const p = await prisma.product.findFirst({
    where: { OR: [{ productNumber: '48' }, { name: { contains: 'GENTRON' } }] },
  })
  if (!p) throw new Error('Hair-GENTRON not found')

  await prisma.product.update({
    where: { id: p.id },
    data: {
      description: DESCRIPTION,
      productDetails: DETAILS,
      keyFeatures: FEATURES,
      benefits: BENEFITS,
    },
  })

  // Claims that must not survive, plus the false "no documents" line that this script exists
  // to remove, plus any price (productDetails is serialised into the RSC payload).
  const banned = [
    'hair loss treatment', 'hair growth', 'anagen', 'telogen', 'catagen', 'mitochondria',
    'blood circulation', 'scalp circulation', 'angiogenesis', 'no manual', 'no leaflet',
    'medical-grade', 'AED',
  ]
  const after = await prisma.product.findUnique({ where: { id: p.id } })
  const blob = [after?.description, after?.benefits, after?.keyFeatures, after?.productDetails]
    .join(' ')
    .toLowerCase()
  const hits = banned.filter(t => blob.includes(t.toLowerCase()))
  console.log(`${after?.name}: ${hits.length ? `STILL PRESENT → ${hits.join(', ')}` : 'clean'}`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
