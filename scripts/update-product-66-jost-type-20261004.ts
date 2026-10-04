/**
 * Product 66 (CERABARRIER BIOME GEL CLEANSER), 4 Oct 2026: the eight new slides re-set in the type of the
 * Aug 2026 studio slides (Jost, Tajawal for Arabic) ship as *j files. Images only.
 *   npx tsx --env-file=.env.local scripts/update-product-66-jost-type-20261004.ts          (dry run)
 *   npx tsx --env-file=.env.local scripts/update-product-66-jost-type-20261004.ts --apply
 */
import { PrismaClient } from '@prisma/client'

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL or PRISMA_DATABASE_URL is required')

const prisma = new PrismaClient(
  databaseUrl.includes('prisma.io') || databaseUrl.includes('accelerate')
    ? { accelerateUrl: databaseUrl, log: ['error'] }
    : { datasourceUrl: databaseUrl, log: ['error'] } as never,
)

const SWAP: Record<string, string> = {
  'm1.jpg': 'm1j.jpg',
  'm2c.jpg': 'm2j.jpg',
  'm3.jpg': 'm3j.jpg',
  'm4b.jpg': 'm4j.jpg',
  'm5b.jpg': 'm5j.jpg',
  'm6.jpg': 'm6j.jpg',
  'm7b.jpg': 'm7j.jpg',
  's4b.jpeg': 's4j.jpeg',
}
const DIR = '/images/cera_o/'

async function main() {
  const p = await prisma.product.findFirst({ where: { productNumber: '66' }, select: { id: true, images: true } })
  if (!p) throw new Error('Product 66 not found')
  const gallery: string[] = JSON.parse(p.images || '[]')
  for (const old of Object.keys(SWAP)) if (!gallery.includes(DIR + old)) throw new Error(`${old} not in gallery`)
  const next = gallery.map(g => (g.startsWith(DIR) && SWAP[g.slice(DIR.length)] ? DIR + SWAP[g.slice(DIR.length)] : g))
  console.log('NEXT:', next)
  if (!process.argv.includes('--apply')) {
    console.log('DRY RUN - pass --apply to write')
    return
  }
  for (const f of Object.values(SWAP)) {
    for (const sub of ['', 'ru/', 'ar/']) {
      const live = await fetch(`https://genosys.ae${DIR}${sub}${f}`, { method: 'HEAD' })
      if (!live.ok) throw new Error(`${DIR}${sub}${f} is not live yet (HTTP ${live.status})`)
    }
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
