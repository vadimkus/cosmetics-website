/**
 * Product 37 (PEPTIDE GEL MASK): the "Blue means cool" campaign.
 * Main image -> /images/peptide_campaign/main.jpg (pouch + box packshot, no type),
 * gallery -> /images/peptide_campaign/s1.jpg ... s12.jpg. AR/RU slides swap in at
 * render through lib/localizedProductImages.ts, so the record holds the EN paths only.
 * The old /images/peptide_mask/ files stay on disk (static references still use main.jpeg).
 *
 * Run after the deploy carrying the files is live; it refuses to write otherwise.
 *   npx tsx --env-file=.env.local scripts/update-product-37-campaign-gallery.ts          (dry run)
 *   npx tsx --env-file=.env.local scripts/update-product-37-campaign-gallery.ts --apply
 */
import { PrismaClient } from '@prisma/client'

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL or PRISMA_DATABASE_URL is required')

const prisma = new PrismaClient(
  databaseUrl.includes('prisma.io') || databaseUrl.includes('accelerate')
    ? { accelerateUrl: databaseUrl, log: ['error'] }
    : { datasourceUrl: databaseUrl, log: ['error'] } as never,
)

const MAIN = '/images/peptide_campaign/main.jpg'
const GALLERY = Array.from({ length: 12 }, (_, i) => `/images/peptide_campaign/s${i + 1}.jpg`)
const LOCALIZED = ['ru', 'ar'].flatMap(l => GALLERY.map(p => p.replace('/peptide_campaign/', `/peptide_campaign/${l}/`)))

async function main() {
  const p = await prisma.product.findFirst({
    where: { productNumber: '37' },
    select: { id: true, productNumber: true, name: true, image: true, images: true },
  })
  if (!p) throw new Error('Product 37 not found')
  console.log('BEFORE:', JSON.stringify(p, null, 2))

  if (!process.argv.includes('--apply')) {
    console.log('DRY RUN - pass --apply to write')
    console.log('Would set image:', MAIN)
    console.log('Would set gallery:', GALLERY)
    return
  }

  for (const path of [MAIN, ...GALLERY, ...LOCALIZED]) {
    const live = await fetch('https://genosys.ae' + path, { method: 'HEAD' })
    if (!live.ok) throw new Error(`${path} is not live yet (HTTP ${live.status})`)
  }

  const updated = await prisma.product.update({
    where: { id: p.id },
    data: { image: MAIN, images: JSON.stringify(GALLERY) },
    select: { id: true, name: true, image: true, images: true },
  })
  console.log('AFTER:', JSON.stringify(updated, null, 2))
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
