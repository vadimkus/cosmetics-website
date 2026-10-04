/**
 * Product 66 (CERABARRIER BIOME GEL CLEANSER), 4 Oct 2026: gallery with the re-shot two-sizes slide
 * (m7b) and the m2b / m4b / m5b slides without dossier wording, plus the RU/AR description columns
 * rewritten in selling voice (data/product66LocalizedCopy.ts). The EN record is not touched.
 *
 * Run after the deploy carrying the files is live; it refuses to write otherwise.
 *   npx tsx --env-file=.env.local scripts/update-product-66-selling-copy-20261004.ts          (dry run)
 *   npx tsx --env-file=.env.local scripts/update-product-66-selling-copy-20261004.ts --apply
 */
import { PrismaClient } from '@prisma/client'

import { PRODUCT_66_AR_TRANSLATION, PRODUCT_66_RU_TRANSLATION } from '../data/product66LocalizedCopy'

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL or PRISMA_DATABASE_URL is required')

const prisma = new PrismaClient(
  databaseUrl.includes('prisma.io') || databaseUrl.includes('accelerate')
    ? { accelerateUrl: databaseUrl, log: ['error'] }
    : { datasourceUrl: databaseUrl, log: ['error'] } as never,
)

const ORDER = ['m1.jpg', 's1.jpeg', 's2.jpeg', 'm2b.jpg', 's3.jpeg', 'm3.jpg', 's4.jpeg', 'm4b.jpg', 's5.jpeg',
  'm5b.jpg', 's6.jpeg', 'm6.jpg', 'm7b.jpg', 's7.jpeg']
const GALLERY = ORDER.map(f => `/images/cera_o/${f}`)
const LOCALIZED = ['ru', 'ar'].flatMap(l => GALLERY.map(p => p.replace('/cera_o/', `/cera_o/${l}/`)))

async function main() {
  const p = await prisma.product.findFirst({
    where: { productNumber: '66' },
    select: { id: true, name: true, image: true, images: true, descriptionRu: true, descriptionAr: true },
  })
  if (!p) throw new Error('Product 66 not found')
  console.log('BEFORE:', JSON.stringify(p, null, 2))

  if (!process.argv.includes('--apply')) {
    console.log('DRY RUN - pass --apply to write')
    console.log('Would set gallery:', GALLERY)
    console.log('Would set descriptionRu:', PRODUCT_66_RU_TRANSLATION.description)
    console.log('Would set descriptionAr:', PRODUCT_66_AR_TRANSLATION.description)
    return
  }

  for (const path of [...GALLERY, ...LOCALIZED]) {
    const live = await fetch('https://genosys.ae' + path, { method: 'HEAD' })
    if (!live.ok) throw new Error(`${path} is not live yet (HTTP ${live.status})`)
  }

  const updated = await prisma.product.update({
    where: { id: p.id },
    data: {
      images: JSON.stringify(GALLERY),
      descriptionRu: PRODUCT_66_RU_TRANSLATION.description,
      descriptionAr: PRODUCT_66_AR_TRANSLATION.description,
    },
    select: { id: true, name: true, image: true, images: true, descriptionRu: true, descriptionAr: true },
  })
  console.log('AFTER:', JSON.stringify(updated, null, 2))
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
