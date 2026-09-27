/**
 * Product 5 (POWER SOLUTION CVS): the "Vitality, concentrated." campaign.
 *
 * - Main image -> /images/cvs_campaign/main.jpg (closed carton and one vial on white, the
 *   Power Solution family angle), gallery -> s1.jpg ... s12.jpg. AR/RU slides swap in at
 *   render through lib/localizedProductImages.ts, so the record holds the EN paths.
 * - EN text fields move to the selling copy (no 5-Free, no fragrance-free, no specific
 *   gravity, no roller, no microneedling); descriptionRu / descriptionAr follow
 *   data/productLocalizedCopyAudit.ts.
 *
 * Run after the deploy carrying the files is live; it refuses to write otherwise.
 *   npx tsx --env-file=.env.local scripts/update-product-5-campaign-gallery.ts          (dry run)
 *   npx tsx --env-file=.env.local scripts/update-product-5-campaign-gallery.ts --apply
 */
import { PrismaClient } from '@prisma/client'

import { FULL_INCI } from '../components/product/powersolution/powerSolutionCopy'
import { AUDITED_PRODUCT_LOCALIZED_COPY } from '../data/productLocalizedCopyAudit'

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL or PRISMA_DATABASE_URL is required')

const prisma = new PrismaClient(
  databaseUrl.includes('prisma.io') || databaseUrl.includes('accelerate')
    ? { accelerateUrl: databaseUrl, log: ['error'] }
    : { datasourceUrl: databaseUrl, log: ['error'] } as never,
)

const MAIN = '/images/cvs_campaign/main.jpg'
const GALLERY = ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10', 's11', 's12'].map(n => `/images/cvs_campaign/${n}.jpg`)
const LOCALIZED = ['ru', 'ar'].flatMap(l => GALLERY.map(p => p.replace('/cvs_campaign/', `/cvs_campaign/${l}/`)))
const CUTOUT = '/images/cutout/5-v2.webp'

const COPY = {
  description:
    'Vitality, concentrated. POWER SOLUTION CVS, Concentrated Vitality Solution, is the nourishing vial of the Power Solution range: a highly concentrated solution that supplies moisture and nutrients to tired, dry skin, for glow and vitality. A 23.97% moisture base of butylene glycol and glycerin, with soy ferment 2.5%, panthenol 0.5%, sodium hyaluronate 0.1%, allantoin 0.1% and marine collagen 0.1%. No parabens, ethanol, artificial pigment or artificial fragrance. Ten sealed 2 ml glass vials, one per treatment. Dermatologically tested. Made in Korea by DTS MG.',
  descriptionRu: AUDITED_PRODUCT_LOCALIZED_COPY.ru['5'].description,
  descriptionAr: AUDITED_PRODUCT_LOCALIZED_COPY.ar['5'].description,
  productDetails: JSON.stringify({
    form: 'Leave-on solution in a sealed 2 ml glass vial',
    size: '2ml x 10ea',
    target: 'Tired, dull and dry skin',
    keyBenefits: 'Moisture and nourishment, for glow and vitality',
    function: 'Skin nourishment',
    moistureBase: 'Butylene glycol 12.485% + glycerin 11.48% = 23.97%',
    largestActive: 'Soy ferment filtrate 2.5%',
    comfort: 'Panthenol 0.5%, allantoin 0.1%, sodium hyaluronate 0.1%, marine collagen 0.1%',
    application: 'Cleanse, open one vial, apply, let it absorb. Leave-on. Keep away from the eyes.',
    ph: '5.94, inside a 5.00 to 7.00 specification',
    freeFrom: 'Parabens, ethanol, artificial pigment and artificial fragrance',
    shelfLife: 'Three years unopened, with the expiry date on the box',
    testing: 'Dermatologically tested',
    origin: 'Made in Korea by DTS MG',
  }),
  keyFeatures: JSON.stringify([
    { title: 'Vitality, concentrated', description: 'The nourishing vial of the Power Solution range: moisture and nutrients for tired, dry skin, for glow and vitality.' },
    { title: '23.97% moisture base', description: 'Butylene glycol and glycerin, nearly a quarter of the vial, so a full 2 ml feels cushioning, never tight.' },
    { title: 'Soy ferment 2.5% and panthenol 0.5%', description: 'The largest active in the vial, with provitamin B5 at a full working dose.' },
    { title: 'One sealed vial per treatment', description: 'Ten 2 ml glass vials, each opened only when you need it, so every treatment starts fresh.' },
  ]),
  benefits: JSON.stringify([
    'Supplies moisture and nutrients to tired, dry skin',
    'For skin with glow and vitality, treatment after treatment',
    'A 23.97% moisture base keeps skin soft, supple and comfortable',
    'Panthenol and allantoin keep freshly treated skin comfortable',
    'No parabens, ethanol, artificial pigment or artificial fragrance',
    'Ten sealed single-use vials, so every treatment starts fresh',
  ]),
  ingredients: JSON.stringify([
    { name: 'Soy ferment filtrate · 2.5%', description: 'The largest active by weight, feeding and conditioning the skin surface.' },
    { name: 'Panthenol · 0.5%', description: 'Provitamin B5 at a full working dose; holds water and eases the tight feeling after a treatment.' },
    { name: 'Sodium hyaluronate 0.1% + marine collagen 0.1%', description: 'Water-holding at the surface, for a plump, dewy look. The collagen is fish.' },
    { name: 'Allantoin 0.1% + beta-glucan 0.02%', description: 'Comfort for freshly treated skin.' },
    { name: 'Two peptides', description: 'sh-Polypeptide-7 1 ppm, palmitoyl tripeptide-1 0.5 ppm.' },
    { name: 'Grape and rose callus cultures · 0.03% each', description: 'Plant cell cultures grown in the lab, the same batch after batch.' },
    { name: 'Full INCI', description: FULL_INCI },
  ]),
  howToUse: JSON.stringify([
    { step: 'Cleanse', instruction: 'Wash the face and pat it dry.' },
    { step: 'Open one vial', instruction: 'Snap the cap. Each 2 ml vial is one treatment.' },
    { step: 'Apply', instruction: 'Smooth the solution over the face, keeping clear of the eyes.' },
    { step: 'Let it absorb', instruction: 'Pat gently until it sinks in. Leave-on, nothing to rinse.' },
    { step: 'Moisturise', instruction: 'Finish with your moisturiser, or the next step your practitioner has set.' },
    { step: 'Use it fresh', instruction: 'An opened vial does not reseal, so use it all in one go.' },
  ]),
  directions:
    'Dermatologically tested. For external use only. Keep away from the eyes and mucous membranes, and rinse with cool water if contact occurs. Avoid during pregnancy and breastfeeding: the formula contains two artemisia extracts. Contains marine collagen, so avoid it if you are allergic to fish. Not fragrance-free: hinoki cypress water gives a soft natural scent. Stop use and see a doctor if redness, swelling or irritation appear. Store in a cool, dry place out of direct sunlight and out of the reach of children.',
}

async function main() {
  const p = await prisma.product.findFirst({
    where: { productNumber: '5' },
    select: { id: true, name: true, image: true, images: true },
  })
  if (!p) throw new Error('Product 5 not found')
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
    where: { productNumber: '5' },
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
