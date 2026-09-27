/**
 * Product 40 (MULTI SUN CREAM SPF 40 PA++): the "Your daily shade." campaign.
 *
 * - Main image -> /images/multisun_campaign/main.jpg, gallery -> s1.jpg ... s12.jpg. AR/RU
 *   slides swap in at render through lib/localizedProductImages.ts, so the record holds the
 *   EN paths.
 * - EN text fields move to the selling copy; descriptionRu / descriptionAr follow
 *   data/product40LocalizedCopy.ts.
 *
 * Run after the deploy carrying the files is live; it refuses to write otherwise.
 *   npx tsx --env-file=.env.local scripts/update-product-40-campaign-gallery.ts          (dry run)
 *   npx tsx --env-file=.env.local scripts/update-product-40-campaign-gallery.ts --apply
 */
import { PrismaClient } from '@prisma/client'

import { PRODUCT_40_AR_DESCRIPTION, PRODUCT_40_FULL_INCI, PRODUCT_40_RU_DESCRIPTION } from '../data/product40LocalizedCopy'

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL or PRISMA_DATABASE_URL is required')

const prisma = new PrismaClient(
  databaseUrl.includes('prisma.io') || databaseUrl.includes('accelerate')
    ? { accelerateUrl: databaseUrl, log: ['error'] }
    : { datasourceUrl: databaseUrl, log: ['error'] } as never,
)

const MAIN = '/images/multisun_campaign/main.jpg'
const GALLERY = Array.from({ length: 12 }, (_, i) => `/images/multisun_campaign/s${i + 1}.jpg`)
const LOCALIZED = ['ru', 'ar'].flatMap(l => GALLERY.map(p => p.replace('/multisun_campaign/', `/multisun_campaign/${l}/`)))

const COPY = {
  description:
    'Your daily shade. Light, broad-spectrum sun protection for every morning: SPF 40 PA++ from four UV filters making up 18.50% of the formula, in a soft, non-greasy cream that sits smoothly under make-up. Finished with centella asiatica, scutellaria root and rose and grape callus extracts. Dermatologically tested, heat-tested at 50 °C, free from parabens, drying alcohol and colourants. Made in Korea. Not water resistant: reapply after swimming, sweating or towelling.',
  descriptionRu: PRODUCT_40_RU_DESCRIPTION,
  descriptionAr: PRODUCT_40_AR_DESCRIPTION,
  productDetails: JSON.stringify({
    size: '40 g',
    protection: 'SPF 40 PA++ - UVB and UVA protection for every day',
    technology: 'Four UV filters, 18.50% of the formula: octinoxate 7.50%, octisalate 5.00%, titanium dioxide 3.00%, amiloxate 3.00%',
    texture: 'Light, non-greasy cream that sits under make-up',
    application: 'Last step of the morning routine, 15 minutes before going out',
    reapplication: 'At least every two hours outdoors',
    waterResistance: 'Not water resistant: reapply after swimming, sweating or towelling',
    ph: '6.71, inside a 5.00-7.00 specification',
    heat: 'Tested stable at 50 °C',
    freeFrom: 'Parabens, drying alcohol, colourants',
    fragrance: 'Light, 0.25%',
    testing: 'Dermatologically tested',
    licence: 'Korean functional cosmetic for UV protection',
    origin: 'Made in Korea',
  }),
  keyFeatures: JSON.stringify([
    { title: 'SPF 40 PA++, every day', description: 'UVB and UVA protection for the city, the office and the school run.' },
    { title: 'Four filters, 18.50%', description: 'Octinoxate 7.50%, octisalate 5.00%, titanium dioxide 3.00% and amiloxate 3.00%, working as one.' },
    { title: 'Light under make-up', description: 'A soft, non-greasy cream that settles quickly, so foundation goes straight on top.' },
    { title: 'Heat-tested at 50 °C', description: 'Tested stable at 50 °C, made for Gulf summers.' },
  ]),
  benefits: JSON.stringify([
    'Daily UV protection - SPF 40 PA++ for UVB and UVA',
    'Four UV filters at 18.50% of the formula',
    'Light under make-up - soft, non-greasy and quick to settle',
    'Heat-tested - stable at 50 °C',
    'No parabens, drying alcohol or colourants',
    'Dermatologically tested',
  ]),
  ingredients: JSON.stringify([
    { name: 'Four UV filters, 18.50%', description: 'Ethylhexyl methoxycinnamate 7.50%, ethylhexyl salicylate 5.00%, titanium dioxide 3.00% and isoamyl p-methoxycinnamate 3.00%: three organic filters and one mineral, together giving SPF 40 PA++.' },
    { name: 'Butylene glycol, dimethicone, glycerin', description: 'The light base: soft, non-greasy and quick to settle under make-up.' },
    { name: 'Centella asiatica and scutellaria root', description: 'Botanical extracts in the finish, with rose and grape callus extracts alongside.' },
    { name: 'Fragrance 0.25%', description: 'A light scent. Its allergens - benzyl benzoate, citronellol, hexyl cinnamal, alpha-isomethyl ionone and limonene - are named in the full INCI.' },
    { name: 'Full INCI', description: PRODUCT_40_FULL_INCI },
  ]),
  howToUse: [
    '1. Apply as the last step of your morning skincare, after moisturiser',
    '2. Use a line along two fingers for the face and neck',
    '3. Spread evenly 15 minutes before going out',
    '4. Reapply at least every two hours outdoors',
    '5. Reapply after swimming, sweating or towelling',
  ].join('\n'),
  directions:
    "For external use only. Avoid contact with eyes and mucous membranes; if contact occurs, rinse thoroughly with cool water. Do not use near the eyes or on broken skin. Stop use and ask a doctor if redness, swelling or irritation occurs. Contains fragrance. Keep in a cool, dry place out of children's reach.",
}

async function main() {
  const p = await prisma.product.findFirst({
    where: { productNumber: '40' },
    select: { id: true, name: true, image: true, images: true },
  })
  if (!p) throw new Error('Product 40 not found')
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
    where: { productNumber: '40' },
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
