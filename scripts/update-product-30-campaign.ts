/**
 * Product 30, INTENSIVE PROBLEM CONTROL CREAM: the "Everything under control." art set as the
 * gallery, plus the selling-voice copy (EN fields from PRODUCT_30_EN, RU/AR descriptions from
 * product30Ru / product30Ar in data/product30LocalizedCopy.ts). The main stays at
 * /images/problem_cream/main.jpeg.
 *
 * Run after the deploy carrying the images is live; it refuses to write otherwise.
 *   npx tsx --env-file=.env.local scripts/update-product-30-campaign.ts          (dry run)
 *   npx tsx --env-file=.env.local scripts/update-product-30-campaign.ts --apply
 */
import { prisma } from '../lib/prisma'
import { PRODUCT_30_EN, product30Ar, product30Ru } from '../data/product30LocalizedCopy'

const DIR = '/images/problemcream_art'
const GALLERY = Array.from({ length: 12 }, (_, i) => `${DIR}/s${i + 1}.jpg`)
const LOCALIZED = ['ru', 'ar'].flatMap(l => GALLERY.map(p => p.replace(`${DIR}/`, `${DIR}/${l}/`)))

async function live(path: string): Promise<boolean> {
  for (let attempt = 1; ; attempt++) {
    try {
      return (await fetch(`https://genosys.ae${path}`, { method: 'HEAD' })).ok
    } catch (error) {
      if (attempt === 3) throw error
    }
  }
}

async function main() {
  const apply = process.argv.includes('--apply')
  const product = await prisma.product.findFirst({ where: { productNumber: '30' } })
  if (!product) throw new Error('Product 30 not found')
  console.log(`product 30: ${product.name} (${product.id}), gallery now ${product.images}`)

  const missing: string[] = []
  for (const path of [...GALLERY, ...LOCALIZED]) {
    if (!(await live(path))) missing.push(path)
  }
  if (missing.length) {
    console.error(`Not live yet (${missing.length}):`, missing.slice(0, 6).join(', '))
    process.exitCode = 1
    return
  }
  console.log(`  all ${GALLERY.length + LOCALIZED.length} files return 200`)

  if (!apply) {
    console.log('Dry run - pass --apply to write.')
    return
  }

  await prisma.product.update({
    where: { id: product.id },
    data: {
      images: JSON.stringify(GALLERY),
      ...PRODUCT_30_EN,
      descriptionRu: product30Ru.description,
      descriptionAr: product30Ar.description,
    },
  })
  const check = await prisma.product.findUnique({ where: { id: product.id } })
  console.log(JSON.stringify({
    image: check?.image,
    gallery: check?.images ? JSON.parse(check.images).length : 0,
    description: check?.description?.slice(0, 90),
  }, null, 2))
}

main()
  .catch(error => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
