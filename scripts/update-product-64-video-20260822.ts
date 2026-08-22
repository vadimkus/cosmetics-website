/**
 * Product 64 — Hair Stamp for HairGen Booster.
 *
 * Attaches the product clip. The page renders its video section only when
 * videoUrl is set, so this write is what makes the section appear.
 *
 * Dry run by default:
 *   npx tsx --env-file=.env.local scripts/update-product-64-video-20260822.ts
 *   npx tsx --env-file=.env.local scripts/update-product-64-video-20260822.ts --apply
 */
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { prisma } from '../lib/prisma'

const APPLY = process.argv.includes('--apply')
const VIDEO = '/videos/needls.mp4'

async function main() {
  if (!existsSync(join(process.cwd(), 'public', VIDEO))) {
    throw new Error(`missing asset: public${VIDEO}`)
  }

  const product = await prisma.product.findFirst({
    where: { productNumber: '64' },
    select: { id: true, name: true, videoUrl: true },
  })
  if (!product) throw new Error('product 64 not found')

  console.log(`Product 64 → ${product.name} (${product.id})`)
  console.log(`Mode: ${APPLY ? 'APPLY' : 'DRY RUN'}`)
  console.log(`  videoUrl ${product.videoUrl ?? '(none)'} -> ${VIDEO}`)

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
