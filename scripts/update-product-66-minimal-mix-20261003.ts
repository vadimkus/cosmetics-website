/**
 * Product 66 (CERABARRIER BIOME GEL CLEANSER): keep the Aug 2026 studio slides (cera_o/s1-s7) and
 * interleave the seven minimalist red/blush slides of 3 Oct 2026 (cera_o/m1-m7). Images field only;
 * the main stays /images/cera_o/Main.jpeg. RU/AR files swap in through lib/localizedProductImages.ts.
 *
 * Run after the deploy carrying the files is live; it refuses to write otherwise.
 *   npx tsx --env-file=.env.local scripts/update-product-66-minimal-mix-20261003.ts          (dry run)
 *   npx tsx --env-file=.env.local scripts/update-product-66-minimal-mix-20261003.ts --apply
 */
import { PrismaClient } from '@prisma/client'

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL or PRISMA_DATABASE_URL is required')

const prisma = new PrismaClient(
  databaseUrl.includes('prisma.io') || databaseUrl.includes('accelerate')
    ? { accelerateUrl: databaseUrl, log: ['error'] }
    : { datasourceUrl: databaseUrl, log: ['error'] } as never,
)

const ORDER = ['m1.jpg', 's1.jpeg', 's2.jpeg', 'm2.jpg', 's3.jpeg', 'm3.jpg', 's4.jpeg', 'm4.jpg', 's5.jpeg',
  'm5.jpg', 's6.jpeg', 'm6.jpg', 'm7.jpg', 's7.jpeg']
const GALLERY = ORDER.map(f => `/images/cera_o/${f}`)
const LOCALIZED = ['ru', 'ar'].flatMap(l => GALLERY.map(p => p.replace('/cera_o/', `/cera_o/${l}/`)))

async function main() {
  const p = await prisma.product.findFirst({
    where: { productNumber: '66' },
    select: { id: true, name: true, image: true, images: true },
  })
  if (!p) throw new Error('Product 66 not found')
  console.log('BEFORE:', JSON.stringify(p, null, 2))

  if (!process.argv.includes('--apply')) {
    console.log('DRY RUN - pass --apply to write')
    console.log('Would set gallery:', GALLERY)
    return
  }

  for (const path of [...GALLERY, ...LOCALIZED]) {
    const live = await fetch('https://genosys.ae' + path, { method: 'HEAD' })
    if (!live.ok) throw new Error(`${path} is not live yet (HTTP ${live.status})`)
  }

  const updated = await prisma.product.update({
    where: { id: p.id },
    data: { images: JSON.stringify(GALLERY) },
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
