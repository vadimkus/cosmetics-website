/**
 * Product 67 (GENOSYS DTS Microneedle Stamp): owner on slides 10 and 11, "these 2 - do not use stamp,
 * use other objects as comparison, reshoot" (1 Oct 2026). s10b: a torn ADMIT ONE ticket (one session,
 * one stamp). s11b: a Korean white porcelain moon jar (made in Korea). Only the images field changes;
 * refuses to write until both slides return 200 in EN/RU/AR.
 *   npx tsx --env-file=.env.local scripts/update-product-67-slides-10-11-20261001.ts
 */
import { PrismaClient } from '@prisma/client'

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL or PRISMA_DATABASE_URL is required')

const prisma = new PrismaClient(
  databaseUrl.includes('prisma.io') || databaseUrl.includes('accelerate')
    ? { accelerateUrl: databaseUrl, log: ['error'] }
    : { datasourceUrl: databaseUrl, log: ['error'] } as never,
)

const SLIDES = ['s1b', 's2b', 's3b', 's4b', 's5b', 's6b', 's7b', 's8b', 's9', 's10b', 's11b', 's12b']
const GALLERY = SLIDES.map(s => `/images/stamp_press/${s}.jpg`)
const NEW = ['', 'ru/', 'ar/'].flatMap(l =>
  ['s10b', 's11b'].map(s => `/images/stamp_press/${l}${s}.jpg`))

async function main() {
  const missing: string[] = []
  for (const path of NEW) {
    const res = await fetch(`https://genosys.ae${path}`, { method: 'HEAD' })
    if (!res.ok) missing.push(`${path} ${res.status}`)
  }
  if (missing.length) throw new Error(`not live yet:\n${missing.join('\n')}`)

  const product = await prisma.product.findFirst({ where: { productNumber: '67' } })
  if (!product) throw new Error('product 67 not found')
  const next = JSON.stringify(GALLERY)
  if (product.images === next) {
    console.log('product 67 gallery already on s10b and s11b')
    return
  }
  await prisma.product.update({ where: { id: product.id }, data: { images: next } })
  console.log(`product 67 gallery -> ${SLIDES.join(', ')}`)
}

main().finally(() => prisma.$disconnect())
