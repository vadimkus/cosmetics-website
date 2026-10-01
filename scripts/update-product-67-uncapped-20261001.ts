/**
 * Product 67 (GENOSYS DTS Microneedle Stamp): owner on the "Press. Don't pull." set, "remove the lid
 * from stamp; slide 12 - reshoot, no box and open roller" (1 Oct 2026). Slides 1-8 re-shot with the
 * head uncapped (s1b-s8b) and slide 12 as the bare stamp, no box (s12b). Slides 9-11 show the
 * sealed pack, where the cap belongs, and stay. Only the images field changes; refuses to write
 * until every new slide returns 200 in EN/RU/AR.
 *   npx tsx --env-file=.env.local scripts/update-product-67-uncapped-20261001.ts
 */
import { PrismaClient } from '@prisma/client'

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL or PRISMA_DATABASE_URL is required')

const prisma = new PrismaClient(
  databaseUrl.includes('prisma.io') || databaseUrl.includes('accelerate')
    ? { accelerateUrl: databaseUrl, log: ['error'] }
    : { datasourceUrl: databaseUrl, log: ['error'] } as never,
)

const SLIDES = ['s1b', 's2b', 's3b', 's4b', 's5b', 's6b', 's7b', 's8b', 's9', 's10', 's11', 's12b']
const GALLERY = SLIDES.map(s => `/images/stamp_press/${s}.jpg`)
const NEW = ['', 'ru/', 'ar/'].flatMap(l =>
  SLIDES.filter(s => s.endsWith('b')).map(s => `/images/stamp_press/${l}${s}.jpg`))

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
    console.log('product 67 gallery already uncapped')
    return
  }
  await prisma.product.update({ where: { id: product.id }, data: { images: next } })
  console.log(`product 67 gallery -> ${SLIDES.join(', ')}`)
}

main().finally(() => prisma.$disconnect())
