/**
 * Product 3 (HairGen BOOSTER): the "In. Not on." campaign.
 * Main image -> /images/hairgen_campaign/main-v3.jpg (device alone on white, 1 Oct 2026),
 * gallery -> the twelve slides in SLIDES. AR/RU slides swap in at render
 * through lib/localizedProductImages.ts, so the record holds the EN paths only.
 * Text fields move to the selling copy of the bespoke page: EN fields plus the RU/AR
 * description columns (same text as product3Ru / product3Ar in data/productLocalizedCopyAudit.ts).
 * The old /images/Booster.jpg and /images/Second/hair_*.jpg stay on disk.
 *
 * Run after the deploy carrying the files is live; it refuses to write otherwise.
 *   npx tsx --env-file=.env.local scripts/update-product-3-campaign-gallery.ts          (dry run)
 *   npx tsx --env-file=.env.local scripts/update-product-3-campaign-gallery.ts --apply
 */
import { PrismaClient } from '@prisma/client'

import { AUDITED_PRODUCT_LOCALIZED_COPY } from '../data/productLocalizedCopyAudit'

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL or PRISMA_DATABASE_URL is required')

const prisma = new PrismaClient(
  databaseUrl.includes('prisma.io') || databaseUrl.includes('accelerate')
    ? { accelerateUrl: databaseUrl, log: ['error'] }
    : { datasourceUrl: databaseUrl, log: ['error'] } as never,
)

// Second pass (27 Sep): renders showing a handle the device does not have were redone under new
// names, because /images is served immutable.
const SLIDES = ['s1', 's2', 's3', 's4b', 's5b', 's6', 's7b', 's8b', 's9b', 's10', 's11b', 's12b']
const MAIN = '/images/hairgen_campaign/main-v3.jpg'
const GALLERY = SLIDES.map(s => `/images/hairgen_campaign/${s}.jpg`)
const LOCALIZED = ['ru', 'ar'].flatMap(l => GALLERY.map(p => p.replace('/hairgen_campaign/', `/hairgen_campaign/${l}/`)))

const COPY = {
  description:
    'Auto-microneedling handpiece with blue and red LED for professional scalp care. A fresh stamp of 52 microneedles screws onto a sealed 4 ml vial of HR³ MATRIX HAIR SOLUTION α, and the head stamps for you while the solution feeds through it - so the ampoule goes into the scalp, not onto the hair. Feels like a massage, not needles. Three speeds, 280, 330 and 400 stamps per minute; 14 blue and red LEDs through 48 light bumps; a ten-minute session that ends itself, with the ampoule absorbed within it. 0.3 mm depth, set by the stamp. USB-C cable and stand in the box, 24-month warranty. Made in Korea.',
  descriptionRu: AUDITED_PRODUCT_LOCALIZED_COPY.ru['3'].description,
  descriptionAr: AUDITED_PRODUCT_LOCALIZED_COPY.ar['3'].description,
  productDetails: JSON.stringify({
    form: 'Rechargeable auto-microneedling handpiece with LED head',
    usedWith: 'HR³ MATRIX HAIR SOLUTION α, one sealed 4 ml vial per session',
    applicator: 'HR³ MATRIX HAIR STAMP, 52 microneedles, single use; sold separately in boxes of eight',
    needleDepth: '0.3 mm, set by the HR³ MATRIX HAIR STAMP',
    leds: '14 LEDs, blue and red, through 48 light bumps',
    speeds: 'Three levels: 280, 330 and 400 stamps per minute',
    runTime: 'Ten minutes, then automatic shut-off; the ampoule absorbs within the session',
    inBox: 'HairGen BOOSTER, USB-C cable, stand',
    power: '5.0 V DC / 2.0 A; charger rated 5 V, 1-2 A',
    warranty: '24 months from purchase, normal use',
    origin: 'South Korea',
  }),
  keyFeatures: JSON.stringify([
    { title: 'In, not on', description: 'The ampoule feeds through the stamp while the needles work, so the HR³ solution goes into the scalp during the session.' },
    { title: 'Feels like a massage', description: 'The 0.3 mm stamp and an even, powered rhythm feel like a scalp massage, not needles.' },
    { title: '52 microneedles on a fresh stamp', description: 'The single-use stamp screws straight onto a fresh ampoule and is replaced after every session.' },
    { title: 'Three speeds', description: '280, 330 and 400 stamps per minute, changed with a short press; the device holds the pace evenly.' },
    { title: 'Ten minutes, then it stops', description: 'The built-in timer ends the session after ten minutes, and the ampoule absorbs within it.' },
    { title: 'Blue and red light', description: '14 LEDs glow through 48 clear light bumps in the head.' },
    { title: '24-month warranty', description: 'Two years from the date of purchase.' },
  ]),
  benefits: JSON.stringify([
    'Works the HR³ MATRIX HAIR SOLUTION α ampoule into the scalp as it stamps',
    'A massaging feel instead of a needling one',
    'Three speeds: 280, 330 and 400 stamps per minute',
    'Ten-minute session with automatic shut-off',
    'A fresh stamp and a fresh ampoule every session',
    '24-month warranty · Made in Korea',
  ]),
  howToUse: [
    '1. Screw a new HR³ MATRIX HAIR STAMP onto a sealed 4 ml HR³ MATRIX HAIR SOLUTION α vial.',
    '2. Twist the LED cover off, load the vial and stamp into the device, and twist the cover back on.',
    '3. Hold the power button for two seconds; a short press sets the speed - 280, 330 or 400 stamps per minute.',
    '4. Part the hair with a comb and glide the head along the parting, with no need to press.',
    '5. After ten minutes the device switches itself off. That is one session.',
    '6. Throw away the used vial and stamp, and put the device on charge.',
  ].join('\n'),
  directions:
    'Use a new HR³ MATRIX HAIR SOLUTION α 4 ml vial and a new HR³ MATRIX HAIR STAMP every session. Do not use with progressive acne, eczema or dermatitis, complications of diabetes or another serious illness, a tendency to keloids or a metal allergy, or over inflamed areas or areas at risk of infection. Do not use on broken, sunburned or freshly shaved scalp. Stop and see a doctor if a rash or allergic reaction appears. Sudden or patchy hair loss needs a medical assessment; HairGen BOOSTER does not replace diagnosis or treatment.',
}

async function main() {
  const p = await prisma.product.findFirst({
    where: { productNumber: '3' },
    select: { id: true, productNumber: true, name: true, image: true, images: true, description: true },
  })
  if (!p) throw new Error('Product 3 not found')
  console.log('BEFORE:', JSON.stringify(p, null, 2))

  if (!process.argv.includes('--apply')) {
    console.log('DRY RUN - pass --apply to write')
    console.log('Would set image:', MAIN)
    console.log('Would set gallery:', GALLERY)
    console.log('Would set fields:', Object.keys(COPY).join(', '))
    return
  }

  for (const path of [MAIN, ...GALLERY, ...LOCALIZED]) {
    const live = await fetch('https://genosys.ae' + path, { method: 'HEAD' })
    if (!live.ok) throw new Error(`${path} is not live yet (HTTP ${live.status})`)
  }

  const updated = await prisma.product.update({
    where: { id: p.id },
    data: { image: MAIN, images: JSON.stringify(GALLERY), ...COPY },
    select: { id: true, name: true, image: true, images: true, description: true },
  })
  console.log('AFTER:', JSON.stringify(updated, null, 2))
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
