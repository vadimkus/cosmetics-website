import { prisma } from '@/lib/prisma'

// Product 12, EPI TURNOVER BOOSTING PEELING GEL: Sep 2026 campaign set.
// Main = padded tube packshot; S1-S8 in Vadim's locked sequence (01-08 of 12,
// slides 09-12 not yet delivered); S9 = closing card, added 18 Sep 12:00. Run after the deploy carrying the files.
const MAIN = '/images/epi_peel_o/Main.jpeg'
const SLIDES = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `/images/epi_peel_o/S${n}.jpeg`)
const apply = process.argv.includes('--apply')

async function main() {
  const product = await prisma.product.findFirst({
    where: { productNumber: '12' },
    select: { id: true, name: true, image: true, images: true },
  })
  if (!product) throw new Error('No product 12')
  console.log(`${product.name}\n  image  ${product.image}\n      -> ${MAIN}\n  images ${product.images}\n      -> ${JSON.stringify(SLIDES)}`)
  if (!apply) return console.log('dry run. Re-run with --apply')
  for (const path of [MAIN, ...SLIDES]) {
    const live = await fetch('https://genosys.ae' + path, { method: 'HEAD' })
    if (!live.ok) throw new Error(`${path} is not live yet (HTTP ${live.status})`)
  }
  await prisma.product.update({ where: { id: product.id }, data: { image: MAIN, images: JSON.stringify(SLIDES) } })
  console.log('updated')
}

main().catch((e) => { console.error(e); process.exitCode = 1 }).finally(() => prisma.$disconnect())
