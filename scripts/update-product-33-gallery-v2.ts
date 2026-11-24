/**
 * Product 33 (EyeCell EYE PEPTIDE GEL PATCH): GENOSYS Bible 9.14 gallery refresh.
 *
 * - Keeps main hero untouched (/images/patch/main-v2.jpg).
 * - Updates gallery images to /images/patch/s1-v2.jpg ... s6-v2.jpg (new filenames
 *   for immutable 1-year CDN cache).
 *
 * Run after the deploy carrying the files is live; it refuses to write otherwise.
 *   npx tsx --env-file=.env.local scripts/update-product-33-gallery-v2.ts          (dry run)
 *   npx tsx --env-file=.env.local scripts/update-product-33-gallery-v2.ts --apply
 */
import { prisma } from '../lib/prisma'

const GALLERY = [
  '/images/patch/s1-v2.jpg',
  '/images/patch/s2-v2.jpg',
  '/images/patch/s3-v2.jpg',
  '/images/patch/s4-v2.jpg',
  '/images/patch/s5-v2.jpg',
  '/images/patch/s6-v2.jpg',
]

async function live(path: string): Promise<boolean> {
  for (let attempt = 1; ; attempt++) {
    try {
      const res = await fetch(`https://genosys.ae${path}`, { method: 'HEAD' })
      return res.ok
    } catch (error) {
      if (attempt === 3) throw error
    }
  }
}

async function main() {
  const apply = process.argv.includes('--apply')
  const product = await prisma.product.findFirst({
    where: { productNumber: '33' },
    select: { id: true, productNumber: true, name: true, image: true, images: true },
  })
  if (!product) throw new Error('Product 33 not found')

  console.log(product.name, `id=${product.id}`, `productNumber=${product.productNumber}`)
  console.log('  image (unchanged):', product.image)
  console.log('  old images       :', product.images)
  console.log('  new images       :', JSON.stringify(GALLERY))

  const missing: string[] = []
  for (const path of GALLERY) {
    if (!(await live(path))) missing.push(path)
  }
  if (missing.length) {
    console.error(`Not live yet (${missing.length}):`, missing.join(', '))
    process.exitCode = 1
    return
  }
  console.log(`  all ${GALLERY.length} files return 200 on genosys.ae`)

  if (!apply) {
    console.log('Dry run — pass --apply to write.')
    return
  }

  await prisma.product.update({
    where: { id: product.id },
    data: { images: JSON.stringify(GALLERY) },
  })
  console.log('Updated product 33 images in DB.')
}

main()
  .catch(error => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
