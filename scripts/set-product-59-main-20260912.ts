import { prisma } from '@/lib/prisma'

// Product 59, DEEP MOISTURIZING BEAUTY BOX: new studio kit shot as main.
// Gallery unchanged. Run after the deploy carrying the file is live.
const MAIN = '/images/bb_box_deep/Main.jpeg'
const apply = process.argv.includes('--apply')

async function main() {
  const product = await prisma.product.findFirst({ where: { productNumber: '59' }, select: { id: true, name: true, image: true } })
  if (!product) throw new Error('No product 59')
  console.log(`${product.name}\n  image  ${product.image}\n      -> ${MAIN}`)
  if (!apply) return console.log('dry run. Re-run with --apply')
  const live = await fetch('https://genosys.ae' + MAIN, { method: 'HEAD' })
  if (!live.ok) throw new Error(`${MAIN} is not live yet (HTTP ${live.status})`)
  await prisma.product.update({ where: { id: product.id }, data: { image: MAIN } })
  console.log('updated')
}

main().catch((e) => { console.error(e); process.exitCode = 1 }).finally(() => prisma.$disconnect())
