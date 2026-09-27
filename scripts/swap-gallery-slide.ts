/**
 * Swap one slide in a product's DB gallery for a reissued file, touching nothing else.
 *
 * /images is served immutable for a year, so a corrected slide ships under a new name
 * (s10.jpg -> s10b.jpg) and the record has to follow. Before writing it checks that the new
 * path, and its ru/ and ar/ twins when the folder is localized, are live.
 *
 *   npx tsx --env-file=.env.local scripts/swap-gallery-slide.ts 6 /images/cts_campaign/s10.jpg /images/cts_campaign/s10b.jpg          (dry run)
 *   npx tsx --env-file=.env.local scripts/swap-gallery-slide.ts 6 /images/cts_campaign/s10.jpg /images/cts_campaign/s10b.jpg --apply
 */
import { PrismaClient } from '@prisma/client'

import { localizeProductImage } from '../lib/localizedProductImages'

const [productNumber, from, to] = process.argv.slice(2).filter(a => !a.startsWith('--'))
if (!productNumber || !from || !to) {
  throw new Error('usage: swap-gallery-slide.ts <productNumber> <old path> <new path> [--apply]')
}

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL or PRISMA_DATABASE_URL is required')

const prisma = new PrismaClient(
  databaseUrl.includes('prisma.io') || databaseUrl.includes('accelerate')
    ? { accelerateUrl: databaseUrl, log: ['error'] }
    : { datasourceUrl: databaseUrl, log: ['error'] } as never,
)

/** The ru/ar files the registry will actually serve for this path. */
function localizedTwins(path: string): string[] {
  return ['ru', 'ar'].map(l => localizeProductImage(path, l)).filter(p => p !== path)
}

async function main() {
  const p = await prisma.product.findFirst({ where: { productNumber }, select: { id: true, images: true } })
  if (!p) throw new Error(`Product ${productNumber} not found`)
  const gallery: string[] = JSON.parse(p.images || '[]')
  if (!gallery.includes(from)) {
    console.log('Nothing to do:', gallery.includes(to) ? `${to} is already in the gallery` : `${from} is not in the gallery`)
    return
  }
  const next = gallery.map(src => (src === from ? to : src))
  console.log('BEFORE:', gallery.join(', '))
  console.log('AFTER: ', next.join(', '))

  if (!process.argv.includes('--apply')) {
    console.log('DRY RUN - pass --apply to write')
    return
  }
  for (const path of [to, ...localizedTwins(to)]) {
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
