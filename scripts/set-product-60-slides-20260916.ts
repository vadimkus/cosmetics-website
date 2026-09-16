import { prisma } from '@/lib/prisma'

// Product 60, Bio Meso PDRN Ampoule 60000: gallery re-rendered on the
// main-v2 white canvas (scripts/render-bio-meso-slides-20260916.py).
// Main image unchanged. Run after the deploy carrying the files is live.
const SLIDES = [1, 2, 3, 4, 5, 6].map((n) => `/images/6000/S${n}-v2.jpeg`)
const apply = process.argv.includes('--apply')

async function main() {
  const product = await prisma.product.findFirst({
    where: { productNumber: '60' },
    select: { id: true, name: true, image: true, images: true },
  })
  if (!product) throw new Error('No product 60')
  console.log(`${product.name}\n  image  ${product.image}\n  images ${product.images}\n      -> ${JSON.stringify(SLIDES)}`)
  if (!apply) return console.log('dry run. Re-run with --apply')
  for (const slide of SLIDES) {
    const live = await fetch('https://genosys.ae' + slide, { method: 'HEAD' })
    if (!live.ok) throw new Error(`${slide} is not live yet (HTTP ${live.status})`)
  }
  await prisma.product.update({ where: { id: product.id }, data: { images: JSON.stringify(SLIDES) } })
  console.log('updated')
}

main().catch((e) => { console.error(e); process.exitCode = 1 }).finally(() => prisma.$disconnect())
