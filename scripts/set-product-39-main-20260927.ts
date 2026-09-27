import { prisma } from '@/lib/prisma'

// Product 39, ULTRA SHIELD SUN CREAM: main re-framed so the tube stands as tall in its card
// as the Multi Sun SPF 40 tube, on the same pure white. Run after the deploy carrying the
// file is live.
const MAIN = '/images/ultra/main-v4.jpg'
const apply = process.argv.includes('--apply')

async function main() {
  const product = await prisma.product.findFirst({ where: { productNumber: '39' }, select: { id: true, name: true, image: true } })
  if (!product) throw new Error('No product 39')
  console.log(`${product.name}\n  image  ${product.image}\n      -> ${MAIN}`)
  if (!apply) return console.log('dry run. Re-run with --apply')
  for (const path of [MAIN, '/images/cutout/39-v4.webp']) {
    const live = await fetch('https://genosys.ae' + path, { method: 'HEAD' })
    if (!live.ok) throw new Error(`${path} is not live yet (HTTP ${live.status})`)
  }
  await prisma.product.update({ where: { id: product.id }, data: { image: MAIN } })
  console.log('updated')
}

main().catch((e) => { console.error(e); process.exitCode = 1 }).finally(() => prisma.$disconnect())
