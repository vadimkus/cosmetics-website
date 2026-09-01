/**
 * Product 25 (SOOTHING REPAIR POSTCREAM) onto the new campaign slides.
 *
 * Nine slides plus a clean packshot, in the order Vadim gave:
 *   Main     clean two-tube packshot, no campaign copy   -> the product card
 *   S1       MORE THAN POST-TREATMENT.
 *   S2       18.4% HUMECTANT SYSTEM.
 *   S3       RECOVERY HAS AN ARCHITECTURE.
 *   S4       MORE THAN ONE KIND OF STRESS.
 *   S5       CLEAN. STILL SENSITIVE.
 *   S6       HAIR OFF. SKIN STILL FEELS IT.
 *   S7       AFTER THE INTENSITY. THEN RECOVERY.
 *   S8       AFTER MORE. DO LESS.
 *   Closing  SOOTHING REPAIR POSTCREAM, 20 g / 100 g
 *
 * Main is deliberately not in `images`: both the web gallery and the mobile
 * app prepend `product.image` themselves, so listing it here shows it twice.
 *
 * Story.jpeg is in the folder too but stays out of the gallery. It is the 9:16
 * Instagram cut, not a square PDP slide.
 */
import { prisma } from '@/lib/prisma'

const PRODUCT_NUMBER = '25'
const DIR = '/images/soothing_rep_o'

const MAIN = `${DIR}/Main.jpeg`
const GALLERY = [
  `${DIR}/S1.jpeg`,
  `${DIR}/S2.jpeg`,
  `${DIR}/S3.jpeg`,
  `${DIR}/S4.jpeg`,
  `${DIR}/S5.jpeg`,
  `${DIR}/S6.jpeg`,
  `${DIR}/S7.jpeg`,
  `${DIR}/S8.jpeg`,
  `${DIR}/Closing.jpeg`,
]

const apply = process.argv.includes('--apply')

async function main() {
  const product = await prisma.product.findFirst({
    where: { productNumber: PRODUCT_NUMBER },
    select: { id: true, name: true, image: true, images: true },
  })
  if (!product) throw new Error(`No product with productNumber ${PRODUCT_NUMBER}`)

  console.log(`${product.name} (${product.id})`)
  console.log(`  image  ${product.image}  ->  ${MAIN}`)
  console.log(`  images ${product.images ?? '(none)'}`)
  console.log(`      -> ${JSON.stringify(GALLERY)}`)

  if (!apply) {
    console.log('\ndry run. Re-run with --apply')
    return
  }

  await prisma.product.update({
    where: { id: product.id },
    data: { image: MAIN, images: JSON.stringify(GALLERY) },
  })
  console.log('\nupdated')
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
