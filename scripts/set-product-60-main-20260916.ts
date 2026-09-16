import { prisma } from '@/lib/prisma'

// Product 60, Bio Meso PDRN Ampoule 60000: new render as main.
// Gallery (S1-S6) unchanged. Run after the deploy carrying the file is live.
const MAIN = '/images/6000/main-v2.jpg'
const apply = process.argv.includes('--apply')

async function main() {
  const product = await prisma.product.findFirst({
    where: { productNumber: '60' },
    select: { id: true, name: true, image: true, images: true },
  })
  if (!product) throw new Error('No product 60')
  console.log(`${product.name}\n  image  ${product.image}\n      -> ${MAIN}\n  images ${product.images}`)
  if (!apply) return console.log('dry run. Re-run with --apply')
  const live = await fetch('https://genosys.ae' + MAIN, { method: 'HEAD' })
  if (!live.ok) throw new Error(`${MAIN} is not live yet (HTTP ${live.status})`)
  await prisma.product.update({ where: { id: product.id }, data: { image: MAIN } })
  console.log('updated')
}

main().catch((e) => { console.error(e); process.exitCode = 1 }).finally(() => prisma.$disconnect())
