/**
 * Product 67 scalp rework: points the GENOSYS DTS Microneedle Stamp at its new "Press here."
 * scalp gallery (/images/stamp_scalp) and writes the scalp copy from
 * data/product67LocalizedCopy.ts, with the Scalp/Hair category and the `hair` concern so it
 * leaves the face-analysis pool and joins the HR³ line.
 *
 * Product fields only: the five size variants (and any cart lines on them) are left alone.
 * Refuses to write until every new image returns 200.
 *   npx tsx --env-file=.env.local scripts/update-product-67-scalp-rework.ts          (dry run)
 *   npx tsx --env-file=.env.local scripts/update-product-67-scalp-rework.ts --apply
 */
import { prisma } from '../lib/prisma'
import {
  PRODUCT_67_AR_DESCRIPTION,
  PRODUCT_67_EN,
  PRODUCT_67_RU_DESCRIPTION,
} from '../data/product67LocalizedCopy'

const DIR = '/images/stamp_scalp'
const MAIN = `${DIR}/main.jpg`
// Re-shot slides ship under a new name: s10b (sterile, no pack shot) and s11b (the real roller).
const RESHOT: Record<number, string> = { 10: 's10b', 11: 's11b' }
const GALLERY = Array.from({ length: 12 }, (_, i) => `${DIR}/${RESHOT[i + 1] ?? `s${i + 1}`}.jpg`)
const LOCALIZED = ['ru', 'ar'].flatMap(l => GALLERY.map(p => p.replace(`${DIR}/`, `${DIR}/${l}/`)))

const DATA = {
  category: 'Scalp/Hair',
  image: MAIN,
  images: JSON.stringify(GALLERY),
  ...PRODUCT_67_EN,
  descriptionRu: PRODUCT_67_RU_DESCRIPTION,
  descriptionAr: PRODUCT_67_AR_DESCRIPTION,
  skinType: null,
  targetConcerns: JSON.stringify(['hair']),
  usage: 'as-needed',
}

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
  const product = await prisma.product.findFirst({ where: { productNumber: '67' } })
  if (!product) throw new Error('product 67 not found')
  console.log(`product 67: ${product.name} (${product.id}), ${product.category}, image ${product.image}`)

  const missing: string[] = []
  for (const path of [MAIN, ...GALLERY, ...LOCALIZED]) {
    if (!(await live(path))) missing.push(path)
  }
  if (missing.length) {
    console.error(`Not live yet (${missing.length}):`, missing.slice(0, 6).join(', '))
    process.exitCode = 1
    return
  }
  console.log(`  all ${1 + GALLERY.length + LOCALIZED.length} files return 200`)

  if (!apply) {
    console.log('Dry run - pass --apply to write.')
    return
  }

  await prisma.product.update({ where: { id: product.id }, data: DATA })
  const check = await prisma.product.findUnique({ where: { id: product.id }, include: { variants: true } })
  console.log(JSON.stringify({
    id: check?.id,
    category: check?.category,
    image: check?.image,
    gallery: check?.images ? JSON.parse(check.images) : [],
    targetConcerns: check?.targetConcerns,
    variants: check?.variants.map(v => `${v.size}:${v.price}${v.isDefault ? '*' : ''}`),
  }, null, 2))
  console.log('URL: https://genosys.ae/products/67')
}

main()
  .catch(error => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
