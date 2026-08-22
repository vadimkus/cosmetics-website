/**
 * Product 51 — Bio-Ferment Age Defying Powder Mask.
 *
 * Swaps the how-to clip to /videos/ferment2.mp4, a 720x1280 portrait export.
 * The old /videos/bio.mp4 stays on disk; this is a new filename, so no cached
 * copy can go stale.
 *
 * The page frame was moved to 9:16 in the same change. A portrait clip in the
 * previous square and widescreen frames lost most of its height to the cover
 * crop.
 *
 * Dry run by default:
 *   npx tsx --env-file=.env.local scripts/update-product-51-video-20260822.ts
 *   npx tsx --env-file=.env.local scripts/update-product-51-video-20260822.ts --apply
 */
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { prisma } from '../lib/prisma'

const APPLY = process.argv.includes('--apply')
const VIDEO = '/videos/ferment2.mp4'

async function main() {
  if (!existsSync(join(process.cwd(), 'public', VIDEO))) {
    throw new Error(`missing asset: public${VIDEO}`)
  }

  const product = await prisma.product.findFirst({
    where: { productNumber: '51' },
    select: { id: true, name: true, videoUrl: true },
  })
  if (!product) throw new Error('product 51 not found')

  console.log(`Product 51 → ${product.name} (${product.id})`)
  console.log(`Mode: ${APPLY ? 'APPLY' : 'DRY RUN'}`)
  console.log(`  videoUrl ${product.videoUrl} -> ${VIDEO}`)

  if (product.videoUrl === VIDEO) {
    console.log('\nRecord already points at the new clip.')
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
