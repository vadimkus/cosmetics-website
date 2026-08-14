/**
 * Point product 4's gallery at the corrected slide 6.
 *
 * s6.jpeg claims a "Hydration Rescue Protocol" that exists in no DTS MG or
 * Intertek document. s6new.jpeg is the same slide with the invented protocol
 * replaced. Images are served immutable for a year, so the fix ships under a
 * new filename rather than in place.
 *
 * The database is shared with production, so the swap can only happen once the
 * asset is actually deployed. The guard below refuses to write until
 * s6new.jpeg answers 200 on the live domain; pass --skip-live-check only when
 * running against a local database.
 *
 *   npx tsx --env-file=.env.local scripts/update-power-solution-hes-4-gallery-20260814.ts
 *   npx tsx --env-file=.env.local scripts/update-power-solution-hes-4-gallery-20260814.ts --apply
 */
import { prisma } from '../lib/prisma'

const OLD = '/images/hes_power/s6.jpeg'
const NEW = '/images/hes_power/s6new.jpeg'
const LIVE_ORIGIN = 'https://genosys.ae'

async function assetIsLive(path: string): Promise<boolean> {
  try {
    const res = await fetch(`${LIVE_ORIGIN}${path}`, { method: 'HEAD' })
    return res.ok
  } catch {
    return false
  }
}

async function main() {
  const apply = process.argv.includes('--apply')
  const skipLiveCheck = process.argv.includes('--skip-live-check')

  const product = await prisma.product.findFirst({ where: { productNumber: '4' } })
  if (!product) throw new Error('product 4 not found')

  const gallery: string[] = product.images ? JSON.parse(product.images) : []
  console.log('current gallery:')
  gallery.forEach((p) => console.log(`  ${p}`))

  if (!gallery.includes(OLD)) {
    console.log(`\n${OLD} is not in the gallery — nothing to do.`)
    return
  }

  if (!skipLiveCheck) {
    const live = await assetIsLive(NEW)
    console.log(`\n${LIVE_ORIGIN}${NEW} → ${live ? '200' : 'not live yet'}`)
    if (!live) {
      console.log('Refusing to write. Wait for the Vercel deploy, then run again.')
      return
    }
  }

  const next = gallery.map((p) => (p === OLD ? NEW : p))
  console.log('\nnew gallery:')
  next.forEach((p) => console.log(`  ${p}`))

  if (!apply) {
    console.log('\nDry run. Re-run with --apply to write.')
    return
  }

  await prisma.product.update({
    where: { id: product.id },
    data: { images: JSON.stringify(next) },
  })
  console.log('\nWritten.')
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
