/**
 * Product 8 — POWER SOLUTION SWS.
 *
 * Points the record at /videos/sws_v.mp4, a 1080x1920 portrait export of the
 * vial promo. The clip renders in the how-to section of the shared Power
 * Solution layout, which is gated on videoUrl, so the other five ampoules are
 * unaffected until they get a clip of their own.
 *
 * Dry run by default:
 *   npx tsx --env-file=.env.local scripts/update-product-8-video-20260825.ts
 *   npx tsx --env-file=.env.local scripts/update-product-8-video-20260825.ts --apply
 */
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { prisma } from '../lib/prisma'

const APPLY = process.argv.includes('--apply')
const VIDEO = '/videos/sws_v.mp4'

async function main() {
  if (!existsSync(join(process.cwd(), 'public', VIDEO))) {
    throw new Error(`missing asset: public${VIDEO}`)
  }

  const product = await prisma.product.findFirst({
    where: { productNumber: '8' },
    select: { id: true, name: true, videoUrl: true },
  })
  if (!product) throw new Error('product 8 not found')

  console.log(`Product 8 → ${product.name} (${product.id})`)
  console.log(`Mode: ${APPLY ? 'APPLY' : 'DRY RUN'}`)
  console.log(`  videoUrl ${product.videoUrl} -> ${VIDEO}`)

  if (product.videoUrl === VIDEO) {
    console.log('\nRecord already points at this clip.')
    return
  }
  if (!APPLY) {
    console.log('\nDry run complete. Re-run with --apply to write.')
    return
  }

  await prisma.product.update({ where: { id: product.id }, data: { videoUrl: VIDEO } })

  const after = await prisma.product.findFirst({
    where: { id: product.id },
    select: { videoUrl: true },
  })
  if (after?.videoUrl !== VIDEO) throw new Error('post-write check failed')
  console.log('\nLive record updated and verified.')
}

main()
  .catch(error => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
