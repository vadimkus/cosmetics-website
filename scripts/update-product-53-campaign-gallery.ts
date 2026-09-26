/**
 * Product 53 (INTENSIVE REPAIR COLLAGEN MASK): the "Red means stop" campaign.
 * Main image -> /images/collagen_campaign/main.jpg (clean sachet packshot, no type),
 * gallery -> /images/collagen_campaign/s1.jpg ... s11.jpg. AR/RU slides swap in at
 * render through lib/localizedProductImages.ts, so the record holds the EN paths only.
 * The old /images/collagen_mask/ files stay on disk (static references still use Main.jpeg).
 *
 * Run after the deploy carrying the files is live; it refuses to write otherwise.
 *   npx tsx --env-file=.env.local scripts/update-product-53-campaign-gallery.ts          (dry run)
 *   npx tsx --env-file=.env.local scripts/update-product-53-campaign-gallery.ts --apply
 */
import { PrismaClient } from '@prisma/client'

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL or PRISMA_DATABASE_URL is required')

const prisma = new PrismaClient(
  databaseUrl.includes('prisma.io') || databaseUrl.includes('accelerate')
    ? { accelerateUrl: databaseUrl, log: ['error'] }
    : { datasourceUrl: databaseUrl, log: ['error'] } as never,
)

const MAIN = '/images/collagen_campaign/main.jpg'
const GALLERY = Array.from({ length: 11 }, (_, i) => `/images/collagen_campaign/s${i + 1}.jpg`)
const LOCALIZED = ['ru', 'ar'].flatMap(l => GALLERY.map(p => p.replace('/collagen_campaign/', `/collagen_campaign/${l}/`)))

async function main() {
  const p = await prisma.product.findFirst({
    where: { productNumber: '53' },
    select: { id: true, productNumber: true, name: true, image: true, images: true },
  })
  if (!p) throw new Error('Product 53 not found')
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
