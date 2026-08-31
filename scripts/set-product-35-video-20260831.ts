/**
 * Point product 35 (HYDRO COOL MODELING MASK) at the new mixing video.
 *
 * Replaces the 8-second /videos/hydro.mp4 shipped in Aug 2026 with a
 * 30-second version of the same mix. New filename because /videos/* is
 * served immutable for a year, so replacing in place would leave repeat
 * visitors on the old cut.
 */
import { prisma } from '@/lib/prisma'

const PRODUCT_NUMBER = '35'
const VIDEO_URL = '/videos/hydro-cool-modeling-mask-20260831.mp4'
const apply = process.argv.includes('--apply')

async function main() {
  const product = await prisma.product.findFirst({
    where: { productNumber: PRODUCT_NUMBER },
    select: { id: true, name: true, videoUrl: true },
  })

  if (!product) throw new Error(`No product with productNumber ${PRODUCT_NUMBER}`)

  console.log(`${product.name} (${product.id})`)
  console.log(`  from: ${product.videoUrl ?? '(none)'}`)
  console.log(`  to:   ${VIDEO_URL}`)

  if (!apply) {
    console.log('\ndry run. Re-run with --apply')
    return
  }

  await prisma.product.update({
    where: { id: product.id },
    data: { videoUrl: VIDEO_URL },
  })
  console.log('\nupdated')
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
