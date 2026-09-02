import { prisma } from '@/lib/prisma'

// Product 34, SKIN RESCUE OVERNIGHT CREAM MASK: new main packshot.
// Run after the deploy carrying public/images/overnight/main-v2.jpeg is live,
// so the database never points at a file the CDN does not have yet.
const PRODUCT_NUMBER = '34'
const MAIN = '/images/overnight/main-v2.jpeg'
const apply = process.argv.includes('--apply')

async function main() {
  const product = await prisma.product.findFirst({
    where: { productNumber: PRODUCT_NUMBER },
    select: { id: true, name: true, image: true },
  })
  if (!product) throw new Error(`No product with productNumber ${PRODUCT_NUMBER}`)
  console.log(`${product.name} (${product.id})`)
  console.log(`  image  ${product.image}  ->  ${MAIN}`)
  if (!apply) {
    console.log('\ndry run. Re-run with --apply')
    return
  }
  const live = await fetch('https://genosys.ae' + MAIN, { method: 'HEAD' })
  if (!live.ok) throw new Error(`${MAIN} is not live yet (HTTP ${live.status}); deploy first`)
  await prisma.product.update({ where: { id: product.id }, data: { image: MAIN } })
  console.log('\nupdated')
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
