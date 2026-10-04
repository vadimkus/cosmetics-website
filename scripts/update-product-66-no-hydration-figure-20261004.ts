/**
 * Product 66 (CERABARRIER BIOME GEL CLEANSER), 4 Oct 2026: drop the deck's 145.8% / 2.4x hydration
 * figures from the EN record and swap gallery slide s4 (CLINICAL PROOF +145.8% / 2.4x) for s4b
 * (AFTER THE WASH. SOFT. DAILY.). Only the sentences carrying the figures change; RU/AR are untouched.
 *
 * Run after the deploy carrying the files is live; it refuses to write otherwise.
 *   npx tsx --env-file=.env.local scripts/update-product-66-no-hydration-figure-20261004.ts          (dry run)
 *   npx tsx --env-file=.env.local scripts/update-product-66-no-hydration-figure-20261004.ts --apply
 */
import { PrismaClient } from '@prisma/client'

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL or PRISMA_DATABASE_URL is required')

const prisma = new PrismaClient(
  databaseUrl.includes('prisma.io') || databaseUrl.includes('accelerate')
    ? { accelerateUrl: databaseUrl, log: ['error'] }
    : { datasourceUrl: databaseUrl, log: ['error'] } as never,
)

const DESCRIPTION_OLD =
  'Clinically proven hydration power in just one use: 145.8% immediate skin hydration improvement post-wash and a 2.4x increase in skin hydration - a powerful barrier cleanser that inhibits moisture loss.'
const DESCRIPTION_NEW =
  'An amino-acid cleanser leads the formula at a gentle pH of 6.37, with glycerin, butylene glycol and betaine in the base, so skin is left soft and hydrated rather than stripped.'
const BENEFITS_OLD = [
  'Clinically proven: 145.8% immediate hydration improvement post-wash',
  '2.4x increase in skin hydration - inhibits moisture loss',
]
const BENEFITS_NEW = [
  'Led by an amino-acid cleanser at a gentle pH of 6.37',
  'Glycerin, butylene glycol and betaine for a soft, hydrated finish',
]

async function main() {
  const p = await prisma.product.findFirst({
    where: { productNumber: '66' },
    select: { id: true, name: true, images: true, description: true, benefits: true },
  })
  if (!p) throw new Error('Product 66 not found')
  if (!p.description?.includes(DESCRIPTION_OLD)) throw new Error('description sentence not found')
  const benefits: string[] = JSON.parse(p.benefits || '[]')
  for (const b of BENEFITS_OLD) if (!benefits.includes(b)) throw new Error(`benefit not found: ${b}`)
  const gallery: string[] = JSON.parse(p.images || '[]')
  if (!gallery.includes('/images/cera_o/s4.jpeg')) throw new Error('s4 not in gallery')

  const next = {
    description: p.description.replace(DESCRIPTION_OLD, DESCRIPTION_NEW),
    benefits: JSON.stringify(benefits.map(b => BENEFITS_NEW[BENEFITS_OLD.indexOf(b)] ?? b)),
    images: JSON.stringify(gallery.map(g => (g === '/images/cera_o/s4.jpeg' ? '/images/cera_o/s4b.jpeg' : g))),
  }
  console.log('NEXT:', JSON.stringify(next, null, 2))
  if (!process.argv.includes('--apply')) {
    console.log('DRY RUN - pass --apply to write')
    return
  }

  for (const path of ['/images/cera_o/s4b.jpeg', '/images/cera_o/ru/s4b.jpeg', '/images/cera_o/ar/s4b.jpeg']) {
    const live = await fetch('https://genosys.ae' + path, { method: 'HEAD' })
    if (!live.ok) throw new Error(`${path} is not live yet (HTTP ${live.status})`)
  }
  await prisma.product.update({ where: { id: p.id }, data: next })
  console.log('APPLIED')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
