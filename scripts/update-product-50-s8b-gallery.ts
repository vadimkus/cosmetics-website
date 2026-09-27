/**
 * Product 50 (EyeCell EYE ZONE CARE KIT): slide 8 reissued as s8b.jpg with the real
 * patches (crystal-clear hydrogel crescents fanned in essence), replacing s8.jpg, whose
 * patches were pearl-grey film. Swaps that one gallery entry and touches nothing else.
 *
 * Run after the deploy carrying the files is live; it refuses to write otherwise.
 *   npx tsx --env-file=.env.local scripts/update-product-50-s8b-gallery.ts          (dry run)
 *   npx tsx --env-file=.env.local scripts/update-product-50-s8b-gallery.ts --apply
 */
import { PrismaClient } from '@prisma/client'

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL or PRISMA_DATABASE_URL is required')

const prisma = new PrismaClient(
  databaseUrl.includes('prisma.io') || databaseUrl.includes('accelerate')
    ? { accelerateUrl: databaseUrl, log: ['error'] }
    : { datasourceUrl: databaseUrl, log: ['error'] } as never,
)

const OLD = '/images/eyekit_campaign/s8.jpg'
const NEW = '/images/eyekit_campaign/s8b.jpg'
const LIVE = [NEW, NEW.replace('/eyekit_campaign/', '/eyekit_campaign/ru/'), NEW.replace('/eyekit_campaign/', '/eyekit_campaign/ar/')]

async function main() {
  const p = await prisma.product.findFirst({ where: { productNumber: '50' }, select: { id: true, images: true } })
  if (!p) throw new Error('Product 50 not found')
  const gallery: string[] = JSON.parse(p.images || '[]')
  if (!gallery.includes(OLD)) {
    console.log('Nothing to do:', gallery.includes(NEW) ? 's8b already in the gallery' : 's8 not in the gallery')
    return
  }
  const next = gallery.map(src => (src === OLD ? NEW : src))
  console.log('BEFORE:', gallery.join(', '))
  console.log('AFTER: ', next.join(', '))

  if (!process.argv.includes('--apply')) {
    console.log('DRY RUN - pass --apply to write')
    return
  }
  for (const path of LIVE) {
    const live = await fetch('https://genosys.ae' + path, { method: 'HEAD' })
    if (!live.ok) throw new Error(`${path} is not live yet (HTTP ${live.status})`)
  }
  await prisma.product.update({ where: { id: p.id }, data: { images: JSON.stringify(next) } })
  console.log('written')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
