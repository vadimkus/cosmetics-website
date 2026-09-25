import { prisma } from '@/lib/prisma'

// Product 39, ULTRA SHIELD SUN CREAM: new tube packshot as main, and s2 swapped
// for s2-v2 (claim lines retouched: no reef-safe or swimming claim). Run after the deploy carrying the file is live.
const MAIN = '/images/ultra/main-v3.jpeg'
const SWAP: Record<string, string> = { '/images/ultra/s2.jpeg': '/images/ultra/s2-v2.jpeg' }
const apply = process.argv.includes('--apply')

async function main() {
  const product = await prisma.product.findFirst({ where: { productNumber: '39' }, select: { id: true, name: true, image: true, images: true } })
  if (!product) throw new Error('No product 39')
  console.log(`${product.name}\n  image  ${product.image}\n      -> ${MAIN}`)
  if (!apply) return console.log('dry run. Re-run with --apply')
  const gallery: string[] = JSON.parse(product.images || '[]').map((src: string) => SWAP[src] || src)
  for (const path of [MAIN, ...Object.values(SWAP)]) {
    const live = await fetch('https://genosys.ae' + path, { method: 'HEAD' })
    if (!live.ok) throw new Error(`${path} is not live yet (HTTP ${live.status})`)
  }
  await prisma.product.update({ where: { id: product.id }, data: { image: MAIN, images: JSON.stringify(gallery) } })
  console.log('images', JSON.stringify(gallery))
  console.log('updated')
}

main().catch((e) => { console.error(e); process.exitCode = 1 }).finally(() => prisma.$disconnect())
