/**
 * Product 15 (INTENSIVE PROBLEM CONTROL TONER): the "Oil off. Cool on." campaign.
 *
 * - Main image -> /images/pct_campaign/main.jpg (the 200 ml mist and 500 ml pump on white),
 *   gallery -> s1.jpg ... s12.jpg. AR/RU slides swap in at render through
 *   lib/localizedProductImages.ts, so the record holds the EN paths.
 * - EN text fields move to the selling copy of the page (no "the carton stops here", no
 *   "not why you pick this bottle", no specific gravity or fill); descriptionRu /
 *   descriptionAr follow data/productLocalizedCopyAudit.ts.
 *
 * Run after the deploy carrying the files is live; it refuses to write otherwise.
 *   npx tsx --env-file=.env.local scripts/update-product-15-campaign-gallery.ts          (dry run)
 *   npx tsx --env-file=.env.local scripts/update-product-15-campaign-gallery.ts --apply
 */
import { PrismaClient } from '@prisma/client'

import { PCT_TONER_FULL_INCI } from '../components/product/pcttoner/pctTonerCopy'
import { AUDITED_PRODUCT_LOCALIZED_COPY } from '../data/productLocalizedCopyAudit'

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL or PRISMA_DATABASE_URL is required')

const prisma = new PrismaClient(
  databaseUrl.includes('prisma.io') || databaseUrl.includes('accelerate')
    ? { accelerateUrl: databaseUrl, log: ['error'] }
    : { datasourceUrl: databaseUrl, log: ['error'] } as never,
)

const MAIN = '/images/pct_campaign/main.jpg'
// s9b (28 Sep): the "BACK DAY" gym slide replaced the first upside-down slide; new name, as /images/* is cached immutable.
const GALLERY = ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9b', 's10', 's11', 's12'].map(n => `/images/pct_campaign/${n}.jpg`)
const LOCALIZED = ['ru', 'ar'].flatMap(l => GALLERY.map(p => p.replace('/pct_campaign/', `/pct_campaign/${l}/`)))
const CUTOUT = '/images/cutout/15-v3.webp'

const PRODUCT_15_EN_DESCRIPTION =
  'Oil off. Cool on. INTENSIVE PROBLEM CONTROL TONER is the cooling oil-control toner for blemish-prone skin: it takes excess oil and sebum off and puts quick hydration straight back. Zinc PCA 0.5% on a 13.4% hydrating base of butylene glycol, glycerin and dipropylene glycol, with tea tree, peppermint, Anti Sebum P and the SNOW ICE cooling complex for a fresh, cool finish. In a four-week study, measured sebum fell by about half. Non-comedogenic (QACS Ltd.) and dermatologically tested. The 200 ml mist sprays at any angle, even upside down for the back; the 500 ml pump is for the treatment room. Made in Korea.'

const COPY = {
  description: PRODUCT_15_EN_DESCRIPTION,
  descriptionRu: AUDITED_PRODUCT_LOCALIZED_COPY.ru['15'].description,
  descriptionAr: AUDITED_PRODUCT_LOCALIZED_COPY.ar['15'].description,
  productDetails: JSON.stringify({
    form: 'Leave-on oil-control toner',
    size: '200ml / 500ml',
    target: 'Shine, excess sebum, blemish-prone skin',
    keyActive: 'Zinc PCA 0.5%',
    hydratingBase: 'Butylene glycol 5.4% + glycerin 5% + dipropylene glycol 3% = 13.4%',
    feel: 'Cooling, from the SNOW ICE complex',
    application: 'Cotton pad, mist or a 5-10 minute pad mask, morning and evening',
    spray: 'The 200 ml sprays 360°, upside down for the back',
    study: 'About 50% less sebum after 4 weeks',
    ph: '4.81, inside a 4.30 to 5.50 specification',
    testing: 'Non-comedogenic (QACS Ltd.); dermatologically tested',
    pao: '12 months after opening',
    shelfLife: 'Three years unopened, with the expiry date on the bottle',
    origin: 'Made in Korea by DTS MG',
  }),
  keyFeatures: JSON.stringify([
    { title: 'Zinc PCA 0.5%', description: 'The oil-control active at a working dose, for a fresher, more matte look.' },
    { title: '13.4% hydrating base', description: 'Quick hydration goes back in as the oil comes off, so skin never feels stripped.' },
    { title: 'Cool on contact', description: 'The SNOW ICE cooling complex takes the heat off skin the moment it lands.' },
    { title: 'Sprays at any angle', description: 'The 200 ml mist works upside down for the neck, shoulders and back.' },
  ]),
  benefits: JSON.stringify([
    'Takes excess oil and sebum off blemish-prone skin',
    'Puts quick hydration straight back, never stripped',
    'About 50% less sebum after four weeks of use',
    'Cools on contact with the SNOW ICE complex',
    'Non-comedogenic and dermatologically tested',
    '200 ml mist for home, 500 ml pump for the treatment room',
  ]),
  ingredients: JSON.stringify([
    { name: 'Zinc PCA · 0.5%', description: 'The oil-control active: helps keep sebum in check and pores looking cleaner.' },
    { name: 'Butylene glycol 5.4% + glycerin 5%', description: 'The two lead humectants hold water in the skin after cleansing.' },
    { name: 'Dipropylene glycol · 3%', description: 'Rounds out the light hydrating base and spreads the toner evenly.' },
    { name: 'Panthenol, allantoin and trehalose · 0.1% each', description: 'Keep skin soft and comfortable after cleansing.' },
    { name: 'Anti Sebum P', description: 'A patented complex of elm root, kudzu root, evening primrose and longleaf pine, for a fresh, clean look.' },
    { name: 'Tea tree and peppermint', description: 'Tea tree leaf oil and extract, peppermint and rosemary for a fresh, herbal finish.' },
    { name: 'SNOW ICE cooling complex', description: 'Takes the heat off skin as it lands and leaves a cool freshness.' },
    { name: 'Full INCI', description: PCT_TONER_FULL_INCI },
  ]),
  howToUse: JSON.stringify([
    { step: 'After cleansing', instruction: 'Apply enough toner to cover clean skin, morning and evening, avoiding the eye area.' },
    { step: 'Cotton pad', instruction: 'Soak a pad and sweep it gently along the skin.' },
    { step: 'Mist', instruction: 'Spray evenly over the face; turn the 200 ml upside down for the neck, shoulders and back.' },
    { step: 'Pad mask', instruction: 'For a longer cool-down, leave soaked cotton pads on for 5 to 10 minutes, then continue with serum and cream.' },
  ]),
  directions:
    'For external use only. Avoid the eyes and mucous membranes; if contact occurs, rinse thoroughly with cool water. Stop use and ask a doctor if redness, swelling or irritation occurs. Keep in a cool, dry place, out of the reach of children. Use within 12 months of opening. Not fragrance-free: tea tree leaf oil and the cooling agents give a fresh, herbal scent.',
}

async function main() {
  const p = await prisma.product.findFirst({
    where: { productNumber: '15' },
    select: { id: true, name: true, image: true, images: true },
  })
  if (!p) throw new Error('Product 15 not found')
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
    where: { productNumber: '15' },
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
