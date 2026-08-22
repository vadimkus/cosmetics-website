/**
 * Product 51 — Bio-Ferment Age Defying Powder Mask.
 *
 * Repoints the packshot and adds the first real gallery: the /images/bio_ferment2
 * studio set. The record previously carried a single jar shot with images null.
 *
 * The gallery field never carries the main image: both the web gallery in
 * ProductImageGallery and the mobile payload in pricingEngine prepend
 * product.image themselves, so listing it here would show it twice.
 *
 * s8 in the delivered set is a cropped duplicate of s4 — same artwork with the
 * headline clipped and the case-study footnote cut off — so it is not published.
 *
 * The old /images/bio_ferment files stay on disk; every path below is a new
 * filename, so no cached copy can go stale.
 *
 * Dry run by default:
 *   npx tsx --env-file=.env.local scripts/update-product-51-bio-ferment2-images-20260822.ts
 *   npx tsx --env-file=.env.local scripts/update-product-51-bio-ferment2-images-20260822.ts --apply
 */
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { prisma } from '../lib/prisma'

const APPLY = process.argv.includes('--apply')

const MAIN = '/images/bio_ferment2/main.jpeg'
const GALLERY = [
  '/images/bio_ferment2/s1.jpeg',
  '/images/bio_ferment2/s2.jpeg',
  '/images/bio_ferment2/s3.jpeg',
  '/images/bio_ferment2/s4.jpeg',
  '/images/bio_ferment2/s5.jpeg',
  '/images/bio_ferment2/s6.jpeg',
  '/images/bio_ferment2/s7.jpeg',
  // Also the closing spec card, so the strip ends on the jar rather than on
  // the last instruction slide.
  '/images/bio_ferment2/Closing.jpeg',
]

async function main() {
  for (const path of [MAIN, ...GALLERY]) {
    if (!existsSync(join(process.cwd(), 'public', path))) {
      throw new Error(`missing asset: public${path}`)
    }
  }

  const product = await prisma.product.findFirst({
    where: { productNumber: '51' },
    select: { id: true, name: true, image: true, images: true },
  })
  if (!product) throw new Error('product 51 not found')

  const images = JSON.stringify(GALLERY)
  console.log(`Product 51 → ${product.name} (${product.id})`)
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
