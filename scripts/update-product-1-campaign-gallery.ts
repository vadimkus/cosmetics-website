/**
 * Product 1 (GENOSYS DTS Microneedle Roller): the "Every needle counts." campaign.
 *
 * - Main image -> /images/roller_campaign/main.jpg, gallery -> s1.jpg ... s12.jpg. AR/RU slides
 *   swap in at render through lib/localizedProductImages.ts, so the record holds the EN paths.
 * - EN text fields move to the selling copy; descriptionRu / descriptionAr follow
 *   data/product1LocalizedCopy.ts.
 * - Size variants: the record held 0.1 / 0.15 / 0.2 mm, but the roller is sold in 0.25 / 0.5 /
 *   1.0 / 1.5 / 2.0 mm (MoySklad codes 00001-00005, the web size picker, and past orders at 1.0 and
 *   1.5 mm). The three mislabelled rows are renamed in place, so cart and favourite links keep
 *   their variant ids.
 *
 * Run after the deploy carrying the files is live; it refuses to write otherwise.
 *   npx tsx --env-file=.env.local scripts/update-product-1-campaign-gallery.ts          (dry run)
 *   npx tsx --env-file=.env.local scripts/update-product-1-campaign-gallery.ts --apply
 */
import { PrismaClient } from '@prisma/client'

import { PRODUCT_1_AR_DESCRIPTION, PRODUCT_1_RU_DESCRIPTION } from '../data/product1LocalizedCopy'

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL or PRISMA_DATABASE_URL is required')

const prisma = new PrismaClient(
  databaseUrl.includes('prisma.io') || databaseUrl.includes('accelerate')
    ? { accelerateUrl: databaseUrl, log: ['error'] }
    : { datasourceUrl: databaseUrl, log: ['error'] } as never,
)

const MAIN = '/images/roller_campaign/main.jpg'
const GALLERY = Array.from({ length: 12 }, (_, i) => `/images/roller_campaign/s${i + 1}.jpg`)
const LOCALIZED = ['ru', 'ar'].flatMap(l => GALLERY.map(p => p.replace('/roller_campaign/', `/roller_campaign/${l}/`)))
const SIZE_FIX: Record<string, string> = { '0.1mm': '1.0mm', '0.15mm': '1.5mm', '0.2mm': '2.0mm' }

const COPY = {
  description:
    'The GENOSYS DTS microneedle roller: every needle cut from a metal disk, 0.2 mm fine and gamma-sterilised, for one precise, comfortable, perfectly clean session. The 0.25 mm head carries 540 needles, 0.5 and 1.0 mm carry 450, 1.5 and 2.0 mm carry 405 - where a typical wire roller carries 192. No wire and no glue, so no needle comes loose mid-pass. Up to 500,000 micro-channels in a ten-minute session open the way for the ampoule you apply. Sealed, single use, CE-marked, made in Korea under ISO 13485.',
  descriptionRu: PRODUCT_1_RU_DESCRIPTION,
  descriptionAr: PRODUCT_1_AR_DESCRIPTION,
  productDetails: JSON.stringify({
    type: 'Single-use microneedle roller, DTS disk needle system',
    availableLengths: '0.25 / 0.5 / 1.0 / 1.5 / 2.0 mm',
    needleCount: '540 at 0.25 mm · 450 at 0.5 and 1.0 mm · 405 at 1.5 and 2.0 mm',
    needleThickness: '0.2 mm',
    needleMaterial: 'SUS 304(H) stainless steel',
    construction: 'Needles cut from metal disks - no wire, no glue',
    sterilization: 'Gamma-sterilised; the indicator turns from yellow to red',
    shelfLife: '3 years',
    safety: 'Single use only',
    certification: 'CE · ISO 13485',
    origin: 'Made in Korea · DTS MG Co., Ltd.',
  }),
  keyFeatures: JSON.stringify([
    { title: 'Cut from disks', description: 'Every row of needles is cut from a single metal disk. No wire and no glue, so the drum stays perfect for the whole session.' },
    { title: '540 needles', description: '540 on the 0.25 mm head, 450 at 0.5 and 1.0 mm, 405 at 1.5 and 2.0 mm. A typical wire roller carries 192.' },
    { title: '0.2 mm fine', description: 'SUS 304(H) stainless steel, finer than the usual 0.25-0.3 mm needle, for a more comfortable pass.' },
    { title: 'Yellow to red', description: 'Every roller is gamma-sterilised, and the indicator turns from yellow to red to prove it. Sealed until the session.' },
    { title: 'Five lengths', description: '0.25, 0.5, 1.0, 1.5 and 2.0 mm, so the practitioner matches the roller to the area and the goal.' },
    { title: 'CE · ISO 13485', description: 'CE-marked and made in Korea under ISO 13485 quality management.' },
  ]),
  benefits: JSON.stringify([
    'Even micro-channels across the whole area - up to 500,000 in a ten-minute session',
    'Opens the way for the ampoule you apply',
    'A smoother, more comfortable pass with 0.2 mm needles',
    'No wire, no glue: no needle comes loose mid-pass',
    'Sterile and sealed for one perfectly clean session',
    'Five lengths for every area and goal',
  ]),
  howToUse: JSON.stringify([
    { step: 'Choose the length', instruction: 'The practitioner picks the needle length and the interval between sessions for the area and the goal.' },
    { step: 'Prepare', instruction: 'Cleanse, then spread a Power Solution ampoule over the skin. Open the sterile pack right before the session.' },
    { step: 'Roll', instruction: 'Slow, even passes with steady pressure: horizontal, vertical, then diagonal. No zig-zags, no sudden moves.' },
    { step: 'Finish', instruction: 'Follow with a treatment mask and the Soothing Repair Postcream; wear sun protection during the day.' },
    { step: 'Dispose', instruction: 'One roller, one session: discard it afterwards. Never clean or reuse it.' },
  ]),
  directions:
    'For professional use by a trained practitioner. Do not use with metal allergy, a tendency to keloid scarring, severe atopic dermatitis, rosacea, couperose, psoriasis, bleeding disorders, uncontrolled diabetes or severe hypertension. Do not use on damaged, inflamed or infected skin, and never with spicule products. Needle length, pressure and interval are set individually by the practitioner. Sterile, single use only.',
}

async function main() {
  const p = await prisma.product.findFirst({
    where: { productNumber: '1' },
    select: { id: true, name: true, image: true, images: true, variants: { select: { id: true, size: true } } },
  })
  if (!p) throw new Error('Product 1 not found')
  console.log('BEFORE:', JSON.stringify(p, null, 2))
  const renames = p.variants.filter(v => v.size && SIZE_FIX[v.size])

  if (!process.argv.includes('--apply')) {
    console.log('DRY RUN - pass --apply to write')
    console.log('Would set image:', MAIN, 'and', GALLERY.length, 'slides')
    console.log('Would rename variants:', renames.map(v => `${v.size} -> ${SIZE_FIX[v.size!]}`).join(', ') || 'none')
    console.log('Would set fields:', Object.keys(COPY).join(', '))
    return
  }

  for (const path of [MAIN, ...GALLERY, ...LOCALIZED]) {
    const live = await fetch('https://genosys.ae' + path, { method: 'HEAD' })
    if (!live.ok) throw new Error(`${path} is not live yet (HTTP ${live.status})`)
  }

  await prisma.$transaction([
    ...renames.map(v => prisma.productVariant.update({ where: { id: v.id }, data: { size: SIZE_FIX[v.size!] } })),
    prisma.product.update({ where: { id: p.id }, data: { image: MAIN, images: JSON.stringify(GALLERY), ...COPY } }),
  ])
  const after = await prisma.product.findFirst({
    where: { productNumber: '1' },
    select: { image: true, images: true, description: true, variants: { select: { size: true } } },
  })
  console.log('AFTER:', JSON.stringify(after, null, 2))
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
