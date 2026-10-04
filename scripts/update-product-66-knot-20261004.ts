/**
 * Product 66 (CERABARRIER BIOME GEL CLEANSER), 4 Oct 2026: the brick-wall slide m2j swapped for m2k, TIED
 * TOGETHER., a clear gel strand and an ivory cream strand tied in one knot (Vadim's reference). Images only.
 *   npx tsx --env-file=.env.local scripts/update-product-66-knot-20261004.ts          (dry run)
 *   npx tsx --env-file=.env.local scripts/update-product-66-knot-20261004.ts --apply
 */
import { PrismaClient } from '@prisma/client'

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL or PRISMA_DATABASE_URL is required')

const prisma = new PrismaClient(
  databaseUrl.includes('prisma.io') || databaseUrl.includes('accelerate')
    ? { accelerateUrl: databaseUrl, log: ['error'] }
    : { datasourceUrl: databaseUrl, log: ['error'] } as never,
)

const OLD = '/images/cera_o/m2j.jpg'
const NEW = '/images/cera_o/m2k.jpg'

async function main() {
  const p = await prisma.product.findFirst({ where: { productNumber: '66' }, select: { id: true, images: true } })
  if (!p) throw new Error('Product 66 not found')
  const gallery: string[] = JSON.parse(p.images || '[]')
  if (!gallery.includes(OLD)) throw new Error(`${OLD} not in gallery`)
  const next = gallery.map(g => (g === OLD ? NEW : g))
  console.log('NEXT:', next)
  if (!process.argv.includes('--apply')) {
    console.log('DRY RUN - pass --apply to write')
    return
  }
  for (const path of [NEW, NEW.replace('/cera_o/', '/cera_o/ru/'), NEW.replace('/cera_o/', '/cera_o/ar/')]) {
    const live = await fetch('https://genosys.ae' + path, { method: 'HEAD' })
    if (!live.ok) throw new Error(`${path} is not live yet (HTTP ${live.status})`)
  }
  await prisma.product.update({ where: { id: p.id }, data: { images: JSON.stringify(next) } })
  console.log('APPLIED')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
