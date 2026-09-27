/**
 * Product 36 (SOOTHING BOMB SEA ALGAE MASK): the "Calm on contact." campaign.
 *
 * - Main image -> /images/seaalgae_campaign/main.jpg, gallery -> s1.jpg ... s12.jpg. AR/RU
 *   slides swap in at render through lib/localizedProductImages.ts, so the record holds the
 *   EN paths.
 * - EN text fields move to the selling copy; descriptionRu / descriptionAr follow
 *   data/product36LocalizedCopy.ts.
 * - Full INCI: "Polyglutamic Acid" was a typo for Polyglyceryl-10 Myristate, the ingredient the
 *   registered pouch artwork prints in that position.
 *
 * Run after the deploy carrying the files is live; it refuses to write otherwise.
 *   npx tsx --env-file=.env.local scripts/update-product-36-campaign-gallery.ts          (dry run)
 *   npx tsx --env-file=.env.local scripts/update-product-36-campaign-gallery.ts --apply
 */
import { PrismaClient } from '@prisma/client'

import { PRODUCT_36_AR_DESCRIPTION, PRODUCT_36_FULL_INCI, PRODUCT_36_RU_DESCRIPTION } from '../data/product36LocalizedCopy'

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL or PRISMA_DATABASE_URL is required')

const prisma = new PrismaClient(
  databaseUrl.includes('prisma.io') || databaseUrl.includes('accelerate')
    ? { accelerateUrl: databaseUrl, log: ['error'] }
    : { datasourceUrl: databaseUrl, log: ['error'] } as never,
)

const MAIN = '/images/seaalgae_campaign/main.jpg'
const GALLERY = Array.from({ length: 12 }, (_, i) => `/images/seaalgae_campaign/s${i + 1}.jpg`)
const LOCALIZED = ['ru', 'ar'].flatMap(l => GALLERY.map(p => p.replace('/seaalgae_campaign/', `/seaalgae_campaign/${l}/`)))

const COPY = {
  description:
    'Calm on contact. One Eucalace® eucalyptus sheet soaked in 25 g of cool essence: glycerin at 5% and methylpropanediol at 10% with betaine to hydrate, allantoin and panthenol to calm, with sea algae and centella asiatica. Twenty minutes after sun, after a flight or on any evening your face feels tight and hot. Green from gardenia fruit, no artificial pigment, dermatologically tested, made in Korea.',
  descriptionRu: PRODUCT_36_RU_DESCRIPTION,
  descriptionAr: PRODUCT_36_AR_DESCRIPTION,
  productDetails: JSON.stringify({
    form: 'Eucalace® sheet mask',
    size: '1 sheet (25 g)',
    technology: 'Eucalace® eucalyptus spunlace sheet',
    keyBenefits: 'Soothing, cooling, moisturising',
    skinType: 'Tight, hot and sensitive skin, and after professional treatments',
    application: 'Apply to clean skin, leave on for 15-20 minutes',
    formulation: 'Methylpropanediol 10%, glycerin 5.04%, betaine 0.5%, allantoin 0.1%, panthenol 0.1%, with sea algae and centella asiatica',
    ph: '5.69, inside a 5.00-6.00 specification',
    colour: 'Green from gardenia fruit extract - no artificial pigment',
    testing: 'Dermatologically tested',
    origin: 'Made in Korea',
  }),
  keyFeatures: JSON.stringify([
    { title: 'Eucalace® eucalyptus sheet', description: 'Finer fibres at a higher count than a standard sheet: it holds more essence, gives more of it to your skin and breathes for the full twenty minutes.' },
    { title: 'Glycerin 5% + methylpropanediol 10%', description: 'The humectant pair behind the hydration, with betaine at 0.5% alongside.' },
    { title: 'Allantoin + panthenol, 0.1% each', description: 'Two classic calmers for skin that feels tight, hot or overworked.' },
    { title: 'Sea algae + centella', description: 'Red and brown sea algae with centella asiatica: intensive relief and moisture in one sheet.' },
  ]),
  benefits: JSON.stringify([
    'Soothing - allantoin and panthenol settle tight, hot skin',
    'Cooling - a cool essence with a touch of peppermint',
    'Moisturising - glycerin 5% and methylpropanediol 10% draw water in and hold it',
    'Breathable - the eucalyptus spunlace stays comfortable for twenty minutes',
    'Clean fibre - water-jet bonded, with no chemical residue against the skin',
    'Green by nature - coloured with gardenia fruit, no artificial pigment',
  ]),
  ingredients: JSON.stringify([
    { name: 'Glycerin 5% + Methylpropanediol 10%', description: 'The humectant base, with betaine at 0.5%: it draws water into the top layers of the skin and holds it there while the sheet is on.' },
    { name: 'Allantoin 0.1%', description: 'A classic soothing ingredient that takes the heat out of a tight face.' },
    { name: 'Panthenol 0.1%', description: 'Provitamin B5, for comfort and a well-supported barrier.' },
    { name: 'Red and brown sea algae', description: 'Jania rubens, a red coralline alga, and Undaria pinnatifida, the brown kelp known as wakame.' },
    { name: 'Centella asiatica and botanicals', description: 'Centella asiatica with witch hazel leaf, bamboo and chestnut shell complete the botanical side of the essence.' },
    { name: 'Gardenia fruit extract', description: 'The natural colorant that turns the essence green, so the mask needs no artificial pigment.' },
    { name: 'Full INCI', description: PRODUCT_36_FULL_INCI },
  ]),
  howToUse: [
    '1. Cleanse and pat dry, then mist on GENOSYS Snow Booster',
    '2. Unfold the sheet and press it on along the nose, the jaw and under the eyes',
    '3. Leave on for 15-20 minutes while you relax',
    '4. Lift the sheet off while it is still wet',
    '5. Pat the remaining essence in - no rinse',
    '6. Use straight after opening: one sheet, one use',
  ].join('\n'),
  directions:
    'For external use only. Avoid the eyes and mucous membranes; if contact occurs, rinse thoroughly with cool water. Do not use directly around the eyes. Stop use and ask a doctor if redness, swelling or irritation occurs. If you react to bandages or compresses, use with caution. Use immediately after opening. Store in a cool, dry place out of reach of children.',
}

async function main() {
  const p = await prisma.product.findFirst({
    where: { productNumber: '36' },
    select: { id: true, name: true, image: true, images: true },
  })
  if (!p) throw new Error('Product 36 not found')
  console.log('BEFORE:', JSON.stringify(p, null, 2))

  if (!process.argv.includes('--apply')) {
    console.log('DRY RUN - pass --apply to write')
    console.log('Would set image:', MAIN, 'and', GALLERY.length, 'slides')
    console.log('Would set fields:', Object.keys(COPY).join(', '))
    return
  }

  for (const path of [MAIN, ...GALLERY, ...LOCALIZED]) {
    const live = await fetch('https://genosys.ae' + path, { method: 'HEAD' })
    if (!live.ok) throw new Error(`${path} is not live yet (HTTP ${live.status})`)
  }

  await prisma.product.update({ where: { id: p.id }, data: { image: MAIN, images: JSON.stringify(GALLERY), ...COPY } })
  const after = await prisma.product.findFirst({
    where: { productNumber: '36' },
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
