/**
 * Product 49 (GENO-LED IR II): the "Five lights. One dome." campaign.
 *
 * - Main image -> /images/led_campaign/main.jpg (the IR II dome on white with its real control
 *   panel), gallery -> s1.jpg ... s12.jpg. AR/RU slides swap in at render through
 *   lib/localizedProductImages.ts, so the record holds the EN paths.
 * - EN text fields move to copy that matches the bespoke page and the IR II brochure. The
 *   previous keyFeatures / benefits / howToUse / directions carried claims no document supports
 *   ("medical-grade", "safe home treatments", "accelerates healing", "all skin types") and the
 *   description said the dome folds flat, which the brochure does not state.
 * - descriptionRu / descriptionAr are left as they are (data/product49LocalizedCopy.ts).
 *
 * Run after the deploy carrying the files is live; it refuses to write otherwise.
 *   npx tsx --env-file=.env.local scripts/update-product-49-campaign-gallery.ts          (dry run)
 *   npx tsx --env-file=.env.local scripts/update-product-49-campaign-gallery.ts --apply
 */
import { PrismaClient } from '@prisma/client'

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL or PRISMA_DATABASE_URL is required')

const prisma = new PrismaClient(
  databaseUrl.includes('prisma.io') || databaseUrl.includes('accelerate')
    ? { accelerateUrl: databaseUrl, log: ['error'] }
    : { datasourceUrl: databaseUrl, log: ['error'] } as never,
)

const MAIN = '/images/led_campaign/main.jpg'
// s9 (woman in a towel) dropped 30 Sep 2026 - a marketplace shot in a premium set.
const GALLERY = [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12].map(i => `/images/led_campaign/s${i}.jpg`)
const LOCALIZED = ['ru', 'ar'].flatMap(l => GALLERY.map(p => p.replace('/led_campaign/', `/led_campaign/${l}/`)))
const CUTOUT = '/images/cutout/49-v2.webp'

const COPY = {
  description:
    'Five lights. One dome. GENO-LED IR II is a professional LED unit for the treatment room: 1,710 LEDs across red 640 nm, blue 423 nm, green 532 nm, yellow 583 nm and infrared 830 nm, run alone or in pairs over face, body or scalp. Every mode is published with its irradiance and standard dose, so a session is planned rather than guessed: 42 mW/cm² and 28 J/cm² on red, 46 mW/cm² and 28 J/cm² on blue. Any colour runs with infrared at the same time, and red alternates with another colour every three seconds. Nothing touches the client and there are no tips, cartridges or gels to reorder. 70 W rated, 520 × 220 × 315 mm, 2.6 kg.',
  keyFeatures: JSON.stringify([
    { title: 'Five wavelengths, 1,710 LEDs', description: '380 each of red, blue, green and yellow, plus 190 infrared, from 423 to 830 nm.' },
    { title: 'Every mode dosed', description: 'Irradiance and standard dose published for all five lights, from 42 mW/cm² and 28 J/cm² on red.' },
    { title: 'Two at once', description: 'Any colour runs with infrared at the same time; red with another colour alternates every three seconds.' },
    { title: 'Nothing to reorder', description: 'No tips, cartridges or gels, and nothing touches the skin.' },
  ]),
  benefits: JSON.stringify([
    'Red 640 nm, the recovery light and the post-care step after needling',
    'Blue 423 nm, the breakout light for blemish-prone skin',
    'Green 532 nm for sensitive, reactive skin and a restful finish',
    'Yellow 583 nm for flushed, redness-prone skin',
    'Infrared 830 nm runs under any colour at the same time',
    'Face, body and scalp in one 2.6 kg unit with voice guidance in English, Korean and Chinese',
  ]),
  howToUse: JSON.stringify([
    { step: 'Position the dome', instruction: 'Cleanse the area and bring the dome over the face, body or scalp. Nothing touches the skin.' },
    { step: 'Set the time', instruction: 'Time goes up and down in five-minute steps; a voice cue plays a minute before the end and the unit switches itself off.' },
    { step: 'Choose the light', instruction: 'One touch for red, blue, green or yellow. Add infrared to run underneath it, or a second colour to alternate with red every three seconds.' },
    { step: 'Eye protection', instruction: 'The client wears eye protection and nobody looks into the array.' },
  ]),
  directions:
    'A professional device for trained operators. Set dose and time from the published dosimetry for each mode. The client wears eye protection and nobody looks into the array. Photosensitising medication, recent photosensitising treatment or a light-aggravated condition need clearing with the treating doctor before a session. Keep the vents clear and run the unit on a stable surface.',
}

async function main() {
  const p = await prisma.product.findFirst({
    where: { productNumber: '49' },
    select: { id: true, name: true, image: true, images: true },
  })
  if (!p) throw new Error('Product 49 not found')
  console.log('BEFORE:', JSON.stringify(p, null, 2))

  if (!process.argv.includes('--apply')) {
    console.log('DRY RUN - pass --apply to write')
    console.log('Would set image:', MAIN, 'and', GALLERY.length, 'slides')
    console.log('Would set fields:', Object.keys(COPY).join(', '))
    return
  }

  for (const path of [MAIN, ...GALLERY, ...LOCALIZED, CUTOUT]) {
    const live = await fetch('https://genosys.ae' + path, { method: 'HEAD' })
    if (!live.ok) throw new Error(`${path} is not live yet (HTTP ${live.status})`)
  }

  await prisma.product.update({ where: { id: p.id }, data: { image: MAIN, images: JSON.stringify(GALLERY), ...COPY } })
  const after = await prisma.product.findFirst({
    where: { productNumber: '49' },
    select: { image: true, images: true, description: true },
  })
  console.log('AFTER:', JSON.stringify(after, null, 2))
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
