/**
 * Product 9 (POWER SOLUTION AWS): the "Line by line." campaign.
 *
 * - Main image -> /images/aws_campaign/main.jpg (closed carton and one vial on white, the
 *   Power Solution family angle), gallery -> s1.jpg ... s12.jpg. AR/RU slides swap in at
 *   render through lib/localizedProductImages.ts, so the record holds the EN paths.
 * - EN text fields move to the selling copy (no 5-Free, no specific gravity, no roller);
 *   descriptionRu / descriptionAr follow data/productLocalizedCopyAudit.ts.
 *
 * Run after the deploy carrying the files is live; it refuses to write otherwise.
 *   npx tsx --env-file=.env.local scripts/update-product-9-campaign-gallery.ts          (dry run)
 *   npx tsx --env-file=.env.local scripts/update-product-9-campaign-gallery.ts --apply
 */
import { PrismaClient } from '@prisma/client'

import { AWS_FULL_INCI } from '../components/product/powersolution/awsCopy'
import { AUDITED_PRODUCT_LOCALIZED_COPY } from '../data/productLocalizedCopyAudit'

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL or PRISMA_DATABASE_URL is required')

const prisma = new PrismaClient(
  databaseUrl.includes('prisma.io') || databaseUrl.includes('accelerate')
    ? { accelerateUrl: databaseUrl, log: ['error'] }
    : { datasourceUrl: databaseUrl, log: ['error'] } as never,
)

const MAIN = '/images/aws_campaign/main.jpg'
const GALLERY = ['s1b', 's2', 's3b', 's4', 's5', 's6', 's7', 's8', 's9b', 's10', 's11b', 's12b'].map(n => `/images/aws_campaign/${n}.jpg`)
const LOCALIZED = ['ru', 'ar'].flatMap(l => GALLERY.map(p => p.replace('/aws_campaign/', `/aws_campaign/${l}/`)))
const CUTOUT = '/images/cutout/9-v2.webp'

const COPY = {
  description:
    'Line by line. POWER SOLUTION AWS, Anti-Wrinkle Solution, is the wrinkle vial of the Power Solution range: it reduces the appearance of wrinkles and improves skin firmness. Korea registers it as a wrinkle-improving functional cosmetic with adenosine at 0.04% as the principal ingredient, and every batch is tested to prove the dose. A 21.60% moisture base of butylene glycol and glycerin, with soy ferment 2.5%, sodium hyaluronate 0.1% and allantoin 0.1%. Ten sealed 2 ml glass vials, one per treatment. Dermatologically tested. Made in Korea by DTS MG.',
  descriptionRu: AUDITED_PRODUCT_LOCALIZED_COPY.ru['9'].description,
  descriptionAr: AUDITED_PRODUCT_LOCALIZED_COPY.ar['9'].description,
  productDetails: JSON.stringify({
    form: 'Leave-on solution in a sealed 2 ml glass vial',
    size: '2ml x 10ea',
    target: 'Wrinkles and loss of firmness',
    keyBenefits: 'Softer-looking wrinkles, firmer skin',
    registration: 'Wrinkle-improving functional cosmetic, Korea; principal ingredient adenosine',
    principalIngredient: 'Adenosine 0.04% (latest batch 99.94% of the dose)',
    moistureBase: 'Butylene glycol 12.515% + glycerin 9.086% = 21.60%',
    application: 'Cleanse, open one vial, apply, let it absorb. Leave-on. Keep away from the eyes.',
    ph: '4.93, inside a 3.80 to 5.80 specification',
    freeFrom: 'Parabens, ethanol, artificial pigment and artificial fragrance',
    shelfLife: 'Three years unopened, with the expiry date on the box',
    testing: 'Dermatologically tested',
    origin: 'Made in Korea by DTS MG',
  }),
  keyFeatures: JSON.stringify([
    { title: 'Line by line', description: 'The wrinkle vial of the Power Solution range: reduces the appearance of wrinkles and improves skin firmness.' },
    { title: 'Adenosine 0.04%', description: 'The principal ingredient Korea registers for wrinkle care, at the full dose; the latest batch came back at 99.94%.' },
    { title: '21.60% moisture base', description: 'Butylene glycol and glycerin, so a full 2 ml feels cushioning rather than tight.' },
    { title: 'One sealed vial per treatment', description: 'Ten 2 ml glass vials, each opened only when you need it, so every treatment starts fresh.' },
  ]),
  benefits: JSON.stringify([
    'Reduces the appearance of wrinkles',
    'Improves skin firmness',
    'Adenosine at 0.04%, the registered wrinkle-care active',
    'A 21.60% moisture base keeps skin supple and comfortable',
    'No parabens, ethanol, artificial pigment or artificial fragrance',
    'Ten sealed single-use vials, so every treatment starts fresh',
  ]),
  ingredients: JSON.stringify([
    { name: 'Adenosine · 0.04%', description: 'The principal ingredient Korea registers for wrinkle care, at the full dose.' },
    { name: 'Soy ferment filtrate · 2.5%', description: 'The largest active by weight, conditioning the surface for a smoother feel.' },
    { name: 'Sodium hyaluronate 0.1% + allantoin 0.1%', description: 'Water-holding and comfort for softer, calmer skin.' },
    { name: 'Four peptides + ceramide NP', description: 'Copper tripeptide-1 10 ppm, sh-Polypeptide-7 6.6 ppm, acetyl hexapeptide-8 2.5 ppm, palmitoyl tripeptide-1 2 ppm, ceramide NP 0.4 ppm.' },
    { name: 'Grape and rose callus cultures · 0.03% each', description: 'Plant cell cultures grown in the lab, the same batch after batch.' },
    { name: 'Full INCI', description: AWS_FULL_INCI },
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
    'Dermatologically tested. For external use only. Keep away from the eyes and mucous membranes, and rinse with cool water if contact occurs. Avoid during pregnancy and breastfeeding: the formula contains two artemisia extracts. Not fragrance-free: hinoki cypress water gives a soft natural scent. Stop use and see a doctor if redness, swelling, small bumps or irritation appear. Store in a cool, dry place out of direct sunlight and out of the reach of children.',
}

async function main() {
  const p = await prisma.product.findFirst({
    where: { productNumber: '9' },
    select: { id: true, name: true, image: true, images: true },
  })
  if (!p) throw new Error('Product 9 not found')
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
    where: { productNumber: '9' },
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
