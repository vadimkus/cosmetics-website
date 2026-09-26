/**
 * Product 16 (SNOW BOOSTER): the "Let it snow" campaign.
 * Main image -> /images/booster_campaign/main.jpg (both sizes on powder snow, no type),
 * gallery -> /images/booster_campaign/s1.jpg ... s12.jpg. AR/RU slides swap in at render
 * through lib/localizedProductImages.ts, so the record holds the EN paths only.
 * The English text fields move to the selling copy of the bespoke page (same claims as the
 * RU/AR fields, which already read that way).
 * The old /images/Second/main_booster.jpg and main_booster2.png stay on disk
 * (routineStepImages still uses main_booster.jpg).
 *
 * Run after the deploy carrying the files is live; it refuses to write otherwise.
 *   npx tsx --env-file=.env.local scripts/update-product-16-campaign-gallery.ts          (dry run)
 *   npx tsx --env-file=.env.local scripts/update-product-16-campaign-gallery.ts --apply
 */
import { PrismaClient } from '@prisma/client'

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL or PRISMA_DATABASE_URL is required')

const prisma = new PrismaClient(
  databaseUrl.includes('prisma.io') || databaseUrl.includes('accelerate')
    ? { accelerateUrl: databaseUrl, log: ['error'] }
    : { datasourceUrl: databaseUrl, log: ['error'] } as never,
)

const MAIN = '/images/booster_campaign/main.jpg'
const GALLERY = Array.from({ length: 12 }, (_, i) => `/images/booster_campaign/s${i + 1}.jpg`)
const LOCALIZED = ['ru', 'ar'].flatMap(l => GALLERY.map(p => p.replace('/booster_campaign/', `/booster_campaign/${l}/`)))

const INCI =
  'Aqua (Water), Glycerin, Butylene Glycol, Dipropylene Glycol, Betaine, Lactobacillus/Pumpkin Ferment Extract, Citrus Grandis (Grapefruit) Seed Extract, Propylene Glycol, Sodium Lactate, Dimethicone, Hydrogenated Lecithin, Phaseolus Radiatus Extract, Betula Platyphylla Japonica Bark Extract, Rumex Crispus Root Extract, Beta-Glucan, Nelumbo Nucifera Flower Extract, Prunus Mume Fruit Extract, Citric Acid, Lactic Acid, Disodium EDTA, Potassium Hydroxide, 1,2-Hexanediol, Tripropylene Glycol.'

const COPY = {
  description:
    '200ml / 1000ml. Daily hydrating toner for all skin types. 3% betaine with glycerin 5.78%, butylene glycol 4.55% and dipropylene glycol 4.00% brings moisture, softness and comfort straight back after cleansing. Smooth it on or spray it morning and evening; the fine mist works over makeup too. Dermatologically tested. Made in Korea.',
  productDetails: JSON.stringify({
    form: 'Leave-on hydrating toner',
    size: '200ml / 1000ml',
    target: 'Moisture, all skin types',
    technology: 'Betaine 3%',
    keyBenefits: 'Moisture after cleansing; works over makeup',
    usage: 'Morning and evening',
    application: 'Apply or spray after cleansing',
    ph: '6.14, inside a 5.00 to 7.00 specification',
    appearance: 'Clear, water-light liquid',
    pao: '6 months after opening',
    shelfLife: '3 years unopened; expiry date on the bottle',
    origin: 'South Korea',
  }),
  keyFeatures: JSON.stringify([
    { title: 'Apply or spray', description: 'Morning and evening after cleansing, by hand or as a fine mist. Works over makeup.' },
    { title: 'Betaine 3%', description: 'The key active in a moisture base of about 18%, for soft, comfortable skin.' },
    { title: 'All skin types', description: 'Moisturizes and soothes with botanical extracts, then refines skin with pH balancing.' },
    { title: 'Two sizes, one formula', description: '200 ml spray for home care, 1000 ml pump for the treatment room.' },
  ]),
  benefits: JSON.stringify([
    'Daily hydrating toner for all skin types',
    'Moisture back straight after cleansing',
    'Apply or spray morning and evening',
    'Fine mist works over makeup',
    '3% betaine in a moisture base of about 18%',
    'Dermatologically tested · Made in Korea',
  ]),
  ingredients: JSON.stringify([
    { name: 'Betaine 3%', description: 'An osmolyte and humectant that helps skin hold on to water and stay soft after cleansing.' },
    { name: 'Glycerin 5.78%', description: 'The lead humectant of the formula keeps skin smooth and comfortable without a heavy texture.' },
    { name: 'Butylene glycol 4.55% + dipropylene glycol 4.00%', description: 'They round out the water base, help the toner spread evenly and keep skin feeling hydrated.' },
    { name: 'Phytolex SC (0.5% premix)', description: 'A botanical complex of mung bean, birch bark and curly dock root, alongside lotus flower and pumpkin ferment.' },
    { name: 'Full INCI', description: INCI },
  ]),
  howToUse: JSON.stringify([
    { step: 'After cleansing', instruction: 'Use as the first leave-on step on clean skin of the face and décolleté.' },
    { step: 'Apply', instruction: 'Spray an even, generous amount, or smooth it on with your palms or a cotton pad.' },
    { step: 'Press gently', instruction: 'Let it sink in without rubbing. No need to rinse.' },
    { step: 'Carry on', instruction: 'Follow with serum and cream; finish the morning with sunscreen.' },
  ]),
  directions:
    'For external use only. Avoid the eye area and mucous membranes; if contact occurs, rinse with cool water. Stop use and ask a doctor if redness, swelling or irritation occurs. Keep in a cool, dry place, out of reach of children. Use within 6 months of opening.',
}

async function main() {
  const p = await prisma.product.findFirst({
    where: { productNumber: '16' },
    select: { id: true, productNumber: true, name: true, image: true, images: true, description: true },
  })
  if (!p) throw new Error('Product 16 not found')
  console.log('BEFORE:', JSON.stringify(p, null, 2))

  if (!process.argv.includes('--apply')) {
    console.log('DRY RUN - pass --apply to write')
    console.log('Would set image:', MAIN)
    console.log('Would set gallery:', GALLERY)
    console.log('Would set EN fields:', Object.keys(COPY).join(', '))
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
