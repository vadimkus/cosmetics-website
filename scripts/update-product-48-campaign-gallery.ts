/**
 * Product 48 (Hair-GENTRON): the "Lights on. World off." campaign.
 * Main image -> /images/gentron_campaign/main.jpg (helmet + controller on black, no type),
 * gallery -> s1 ... s12. AR/RU slides swap in at render through lib/localizedProductImages.ts,
 * so the record holds the EN paths only.
 * Text fields move to the selling copy of the bespoke page: EN description, details, features,
 * benefits, how to use and directions, plus descriptionRu / descriptionAr from
 * data/product48LocalizedCopy.ts. Replaces an EN howToUse that still claimed follicle
 * stimulation and blood flow, and the "evidence" / "patent" rows.
 * The old /images/gen.jpg stays on disk.
 *
 * Run after the deploy carrying the files is live; it refuses to write otherwise.
 *   npx tsx --env-file=.env.local scripts/update-product-48-campaign-gallery.ts          (dry run)
 *   npx tsx --env-file=.env.local scripts/update-product-48-campaign-gallery.ts --apply
 */
import { prisma } from '../lib/prisma'
import { PRODUCT_48_AR_TRANSLATION, PRODUCT_48_RU_TRANSLATION } from '../data/product48LocalizedCopy'

const DIR = '/images/gentron_campaign'
const MAIN = `${DIR}/main.jpg`
const GALLERY = Array.from({ length: 12 }, (_, i) => `${DIR}/s${i + 1}.jpg`)
const LOCALIZED = ['ru', 'ar'].flatMap(l => GALLERY.map(p => p.replace(`${DIR}/`, `${DIR}/${l}/`)))

const COPY = {
  description:
    'Lights on, world off. Hair-GENTRON is an LED helmet for the scalp: put it on, press one button and sit back. Red, infrared and blue light, an air-pressure massage around the head, gentle warmth and your own music run together for ten minutes, then the helmet switches itself off. Four light modes, a 10, 20 or 30-minute timer, and separate buttons for the massage and the heat. It weighs 1.0 kg, runs from the USB-C adaptor in the box or four AA batteries, and needs nothing replaced between sessions, at home or in the treatment room. CE marked (EMC and LVD), safety tested to IEC/EN 60335-2-32. Model HGHY01, made in Korea.',
  descriptionRu: PRODUCT_48_RU_TRANSLATION.description,
  descriptionAr: PRODUCT_48_AR_TRANSLATION.description,
  productDetails: JSON.stringify({
    form: 'LED helmet with air-pressure massage and heat, on a separate controller',
    model: 'HGHY01',
    contents: 'Helmet, stand, controller, USB-C cable and power adaptor',
    light: 'Red 640 nm · infrared 840 nm · blue 420 nm',
    ledModes: 'Red + infrared · blue · red + blue + infrared · off',
    session: '10, 20 or 30 minutes, set on the controller; the helmet switches itself off. Up to 30 minutes at a time',
    preset: 'A one-second hold starts ten minutes of air-pressure massage, heat, all three lights and music',
    power: 'Adaptor input AC 100-240 V 50/60 Hz, output DC 5 V 1.5 A · or 4 × AA batteries, not included',
    size: 'Helmet 230 × 240 × 300 mm · controller 158 × 68 × 42 mm · 1.0 kg',
    storage: '5-40 °C, humidity 80% or below',
    certification: 'CE · EMC 2014/30/EU and LVD 2014/35/EU · IEC/EN 60335-2-32',
    design: 'Registered design in the EU and China',
    warranty: '24 months from the date of purchase',
    origin: 'DTS MG Co., Ltd., Seoul · Made in Korea',
  }),
  keyFeatures: JSON.stringify([
    { title: 'Press once', description: 'A one-second hold starts ten minutes of light, air-pressure massage, warmth and music, then the helmet switches itself off.' },
    { title: 'Red, infrared and blue', description: 'Four light modes on one button: red + infrared, blue, all three together, or off.' },
    { title: 'Air-pressure massage and heat', description: 'Each on its own button, with the lights on or off.' },
    { title: 'Hands free', description: '1.0 kg on the head, with height and width dials for a snug fit and the front above the eyes.' },
    { title: 'Your own music', description: 'One track is loaded; copy your own onto the controller over USB-C.' },
    { title: 'Nothing to refill', description: 'No ampoule, stamp or cartridge between sessions. Runs on the USB-C adaptor or four AA batteries.' },
  ]),
  benefits: JSON.stringify([
    'Ten minutes of light, massage, warmth and music from one button',
    'Hands free: nothing to hold and no technique to learn',
    'Red, infrared and blue light, alone or all together',
    'A timer that ends the session for you',
    'No consumables, at home or in the treatment room',
    '24-month warranty · Made in Korea',
  ]),
  howToUse: JSON.stringify([
    { step: 'Wash and dry', instruction: 'Start with a clean scalp, dry enough that the helmet does not sit on wet hair.' },
    { step: 'Put it on', instruction: 'Set the height and width dials so the helmet sits snug, with the front above your eyes.' },
    { step: 'Press once', instruction: 'Hold On/Time/Off for a second: ten minutes of air-pressure massage, heat, red + blue + infrared and music. A short press sets 20 or 30 minutes.' },
    { step: 'Make it yours', instruction: 'Four light modes on one button; the massage and the heat each have their own. Hold the music button two seconds to turn music on or off.' },
    { step: 'Sit back', instruction: 'The helmet switches itself off at the end. Hold the power button two seconds to stop early.' },
  ]),
  directions:
    'Up to 30 minutes at a time. Straight after a procedure on the scalp, use the helmet only when the specialist who did it says so. Ask a doctor first if you are under medical treatment, have an implanted electronic medical device, heart disease, a disease of the head, osteoporosis or a fractured spine, circulation problems from diabetes or another disease, a body temperature over 38 °C, or are pregnant. If you do not feel heat well, keep the heating off. Keep away from children, liquid and heat; do not use a damaged adaptor or operate it with wet hands. Stop and see a doctor if anything feels wrong. If hair falls out suddenly or in patches, see a doctor first.',
}

async function live(path: string): Promise<boolean> {
  for (let attempt = 1; ; attempt++) {
    try {
      const res = await fetch(`https://genosys.ae${path}`, { method: 'HEAD' })
      return res.ok
    } catch (error) {
      if (attempt === 3) throw error
    }
  }
}

async function main() {
  const apply = process.argv.includes('--apply')
  const product = await prisma.product.findFirst({
    where: { productNumber: '48' },
    select: { id: true, name: true, image: true, images: true },
  })
  if (!product) throw new Error('Product 48 not found')

  console.log(product.name, product.id)
  console.log('  image  :', product.image, '->', MAIN)
  console.log('  images :', product.images ?? 'null', '->', `${GALLERY.length} campaign slides`)
  console.log('  fields :', Object.keys(COPY).join(', '))

  const missing: string[] = []
  for (const path of [MAIN, ...GALLERY, ...LOCALIZED]) {
    if (!(await live(path))) missing.push(path)
  }
  if (missing.length) {
    console.error(`Not live yet (${missing.length}):`, missing.slice(0, 6).join(', '))
    process.exitCode = 1
    return
  }
  console.log(`  all ${1 + GALLERY.length + LOCALIZED.length} files return 200`)

  if (!apply) {
    console.log('Dry run - pass --apply to write.')
    return
  }
  await prisma.product.update({
    where: { id: product.id },
    data: { image: MAIN, images: JSON.stringify(GALLERY), ...COPY },
  })
  console.log('Updated product 48.')
}

main()
  .catch(error => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
