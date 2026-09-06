import { prisma } from '@/lib/prisma'

// Product 7, POWER SOLUTION PCS: September 2026 campaign slides.
// Hero moves to /images/pcs_v/Main.jpeg (closed box and vial on
// white). Run after the deploy carrying the files is live.
const PRODUCT_NUMBER = '7'
const DIR = '/images/pcs_v'
const MAIN = `${DIR}/Main.jpeg`
const GALLERY = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8-v2', 'Closing'].map((n) => `${DIR}/${n}.jpeg`)
const apply = process.argv.includes('--apply')

async function main() {
  const product = await prisma.product.findFirst({
    where: { productNumber: PRODUCT_NUMBER },
    select: { id: true, name: true, image: true, images: true },
  })
  if (!product) throw new Error(`No product with productNumber ${PRODUCT_NUMBER}`)
  console.log(`${product.name} (${product.id})`)
  console.log(`  image  ${product.image}\n      -> ${MAIN}`)
  console.log(`  images ${product.images}`)
  console.log(`      -> ${JSON.stringify(GALLERY)}`)
  if (!apply) {
    console.log('\ndry run. Re-run with --apply')
    return
  }
  for (const g of [MAIN, ...GALLERY]) {
    const live = await fetch('https://genosys.ae' + g, { method: 'HEAD' })
    if (!live.ok) throw new Error(`${g} is not live yet (HTTP ${live.status}); deploy first`)
  }
  await prisma.product.update({ where: { id: product.id }, data: { image: MAIN, images: JSON.stringify(GALLERY) } })
  console.log('\nupdated')
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
