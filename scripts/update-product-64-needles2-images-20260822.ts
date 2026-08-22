/**
 * Product 64 — Hair Stamp for HairGen Booster.
 *
 * Repoints the packshot and gallery to the new /images/needles2 set.
 *
 * The gallery field never carries the main image: both the web gallery in
 * ProductImageGallery and the mobile payload in pricingEngine prepend
 * product.image themselves, so listing it here would show it twice.
 *
 * The old /images/needles files are left on disk. Nothing is replaced in place,
 * so no cached copy can go stale: every path below is a new filename.
 *
 * Dry run by default:
 *   npx tsx --env-file=.env.local scripts/update-product-64-needles2-images-20260822.ts
 *   npx tsx --env-file=.env.local scripts/update-product-64-needles2-images-20260822.ts --apply
 */
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { prisma } from '../lib/prisma'

const APPLY = process.argv.includes('--apply')

const MAIN = '/images/needles2/Main.jpeg'
const GALLERY = [
  '/images/needles2/s1.jpeg',
  '/images/needles2/s2.jpeg',
  '/images/needles2/s3.jpeg',
  '/images/needles2/s4.jpeg',
  '/images/needles2/s5.jpeg',
]

async function main() {
  for (const path of [MAIN, ...GALLERY]) {
    if (!existsSync(join(process.cwd(), 'public', path))) {
      throw new Error(`missing asset: public${path}`)
    }
  }

  const product = await prisma.product.findFirst({
    where: { productNumber: '64' },
    select: { id: true, name: true, image: true, images: true },
  })
  if (!product) throw new Error('product 64 not found')

  const images = JSON.stringify(GALLERY)
  console.log(`Product 64 → ${product.name} (${product.id})`)
  console.log(`Mode: ${APPLY ? 'APPLY' : 'DRY RUN'}`)
  console.log(`  image  ${product.image} -> ${MAIN}`)
  console.log(`  images ${product.images} -> ${images}`)

  if (product.image === MAIN && product.images === images) {
    console.log('\nRecord already points at the new set.')
    return
  }
  if (!APPLY) {
    console.log('\nDry run complete. Re-run with --apply to write.')
    return
  }

  await prisma.product.update({ where: { id: product.id }, data: { image: MAIN, images } })

  const after = await prisma.product.findFirst({
    where: { id: product.id },
    select: { image: true, images: true },
  })
  if (after?.image !== MAIN || after?.images !== images) {
    throw new Error('post-write check failed')
  }
  console.log('\nLive record updated and verified.')
}

main()
  .catch(error => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
