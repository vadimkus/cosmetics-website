/**
 * Product 6 (POWER SOLUTION CTS): the "Back to smooth." campaign.
 *
 * - Main image -> /images/cts_campaign/main.jpg (closed carton and one vial on white, the
 *   Power Solution family angle), gallery -> s1.jpg ... s12.jpg. AR/RU slides swap in at
 *   render through lib/localizedProductImages.ts, so the record holds the EN paths.
 * - EN text fields move to the selling copy; descriptionRu / descriptionAr follow
 *   data/productLocalizedCopyAudit.ts.
 *
 * Run after the deploy carrying the files is live; it refuses to write otherwise.
 *   npx tsx --env-file=.env.local scripts/update-product-6-campaign-gallery.ts          (dry run)
 *   npx tsx --env-file=.env.local scripts/update-product-6-campaign-gallery.ts --apply
 */
import { PrismaClient } from '@prisma/client'

import { CTS_FULL_INCI } from '../components/product/powersolution/ctsCopy'
import { AUDITED_PRODUCT_LOCALIZED_COPY } from '../data/productLocalizedCopyAudit'

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL or PRISMA_DATABASE_URL is required')

const prisma = new PrismaClient(
  databaseUrl.includes('prisma.io') || databaseUrl.includes('accelerate')
    ? { accelerateUrl: databaseUrl, log: ['error'] }
    : { datasourceUrl: databaseUrl, log: ['error'] } as never,
)

const MAIN = '/images/cts_campaign/main.jpg'
const GALLERY = ['s1b', 's2', 's3b', 's4', 's5', 's6', 's7', 's8', 's9b', 's10b', 's11b', 's12c'].map(n => `/images/cts_campaign/${n}.jpg`)
const LOCALIZED = ['ru', 'ar'].flatMap(l => GALLERY.map(p => p.replace('/cts_campaign/', `/cts_campaign/${l}/`)))
const CUTOUT = '/images/cutout/6-v2.webp'

const COPY = {
  description:
    'Back to smooth. POWER SOLUTION CTS, Cytokine Concentrate Solution, is the texture vial of the Power Solution range: it refines rough skin and helps it keep its natural elasticity and strength. Copper tripeptide-1 at 0.0212% (212 ppm), the largest peptide dose of the six, leads four peptides over a 28.06% moisture base of glycerin and butylene glycol, with soy ferment 2.5%, sodium hyaluronate 0.1% and hydrolyzed collagen 0.1%. Ten sealed 2 ml glass vials, one per treatment. Dermatologically tested. Made in Korea by DTS MG.',
  descriptionRu: AUDITED_PRODUCT_LOCALIZED_COPY.ru['6'].description,
  descriptionAr: AUDITED_PRODUCT_LOCALIZED_COPY.ar['6'].description,
  productDetails: JSON.stringify({
    form: 'Leave-on solution in a sealed 2 ml glass vial',
    size: '2ml x 10ea',
    target: 'Rough, tired texture and loss of elasticity',
    keyBenefits: 'Smoother texture, natural elasticity, stronger-feeling skin',
    leadPeptide: 'Copper tripeptide-1 0.0212% (212 ppm), the largest peptide dose in the range',
    moistureBase: 'Glycerin 14.580% + butylene glycol 13.485% = 28.06%',
    application: 'Cleanse, open one vial, apply, let it absorb. Leave-on. Keep away from the eyes.',
    ph: '7.61, inside a 6.00 to 8.00 specification',
    freeFrom: 'Parabens, ethanol, artificial pigment and artificial fragrance',
    shelfLife: 'Three years unopened, with the expiry date on the box',
    testing: 'Dermatologically tested',
    origin: 'Made in Korea by DTS MG',
  }),
  keyFeatures: JSON.stringify([
    {
      title: 'Back to smooth',
      description: 'The texture vial of the Power Solution range: refines rough skin and helps it keep its natural elasticity and strength.',
    },
    {
      title: 'Copper tripeptide-1, 212 ppm',
      description: 'The largest peptide dose of the six vials, leading a blend of four peptides.',
    },
    {
      title: '28.06% moisture base',
      description: 'Glycerin and butylene glycol, the richest base of the range, so a full 2 ml feels cushioning rather than tight.',
    },
    {
      title: 'One sealed vial per treatment',
      description: 'Ten 2 ml glass vials, each opened only when you need it, so every treatment starts fresh.',
    },
  ]),
  benefits: JSON.stringify([
    'Refines skin texture for a smoother feel',
    'Helps skin keep its natural elasticity and strength',
    'Copper tripeptide-1 at 212 ppm, the largest peptide dose in the range',
    'A 28.06% moisture base keeps skin supple and comfortable',
    'No parabens, ethanol, artificial pigment or artificial fragrance',
    'Ten sealed single-use vials, so every treatment starts fresh',
  ]),
  ingredients: JSON.stringify([
    { name: 'Copper tripeptide-1 · 0.0212% (212 ppm)', description: 'The lead peptide and the largest peptide dose in the six-vial range, a copper peptide that conditions the skin.' },
    { name: 'Soy ferment filtrate · 2.5%', description: 'The largest active by weight, conditioning the surface for a smoother feel.' },
    { name: 'Sodium hyaluronate 0.1% + hydrolyzed collagen 0.1%', description: 'Water-holding and a light moisture film for softer, suppler skin. The collagen is from fish.' },
    { name: 'sh-Polypeptide-7, palmitoyl tripeptide-1, palmitoyl hexapeptide-12 · 1 ppm each', description: 'Three more peptides that complete the four-peptide blend.' },
    { name: 'Grape and rose callus cultures · 0.03% each', description: 'Plant cell cultures grown in the lab, the same batch after batch.' },
    { name: 'Full INCI', description: CTS_FULL_INCI },
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
    'Dermatologically tested. For external use only. Keep away from the eyes and mucous membranes, and rinse with cool water if contact occurs. Avoid during pregnancy and breastfeeding: the formula contains two artemisia extracts. Contains hydrolyzed fish collagen: avoid if you are allergic to fish. Not fragrance-free: hinoki cypress water gives a soft natural scent. Stop use and see a doctor if redness, swelling, small bumps or irritation appear. Store in a cool, dry place out of direct sunlight and out of the reach of children.',
}

async function main() {
  const p = await prisma.product.findFirst({
    where: { productNumber: '6' },
    select: { id: true, name: true, image: true, images: true },
  })
  if (!p) throw new Error('Product 6 not found')
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
    where: { productNumber: '6' },
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
