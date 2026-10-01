/**
 * Product 67 (GENOSYS DTS Microneedle Stamp): gallery -> the "Press. Don't pull." set in
 * /images/stamp_press (s1-s12; RU/AR swap in through lib/localizedProductImages.ts), shot from the
 * owner's photographs of the real stamp, box and blister (1 Oct 2026). The main image stays
 * /images/stamp_scalp/main.jpg. Only the images field changes. Refuses to write until all 36 slide
 * URLs return 200.
 *   npx tsx --env-file=.env.local scripts/update-product-67-press-campaign-20261001.ts
 */
import { PrismaClient } from '@prisma/client'

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL or PRISMA_DATABASE_URL is required')

const prisma = new PrismaClient(
  databaseUrl.includes('prisma.io') || databaseUrl.includes('accelerate')
    ? { accelerateUrl: databaseUrl, log: ['error'] }
    : { datasourceUrl: databaseUrl, log: ['error'] } as never,
)

const GALLERY = Array.from({ length: 12 }, (_, i) => `/images/stamp_press/s${i + 1}.jpg`)
const ALL = ['', 'ru/', 'ar/'].flatMap(l => GALLERY.map(p => p.replace('/stamp_press/', `/stamp_press/${l}`)))

async function main() {
  const missing: string[] = []
  for (const path of ALL) {
    const res = await fetch(`https://genosys.ae${path}`, { method: 'HEAD' })
    if (!res.ok) missing.push(`${path} ${res.status}`)
  }
  if (missing.length) throw new Error(`not live yet:\n${missing.join('\n')}`)

  const product = await prisma.product.findFirst({ where: { productNumber: '67' } })
  if (!product) throw new Error('product 67 not found')
  const next = JSON.stringify(GALLERY)
  if (product.images === next) {
    console.log('product 67 gallery already on stamp_press')
    return
  }
  await prisma.product.update({ where: { id: product.id }, data: { images: next } })
  console.log(`product 67 gallery: ${product.images} -> ${next}`)
}

main().finally(() => prisma.$disconnect())
