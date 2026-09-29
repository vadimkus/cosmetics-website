/**
 * Creates product 67, the GENOSYS DTS Microneedle Stamp: a scalp stamp made for HR³ MATRIX HAIR
 * SOLUTION α, sold in the roller's five needle lengths (0.25 / 0.5 / 1.0 / 1.5 / 2.0 mm) at
 * 230 AED, with the "Press here." scalp campaign as its gallery.
 *
 * - id and productNumber are both '67', so id-keyed lookups (translations, mobile routes) and
 *   number-keyed ones agree without alias entries.
 * - Size variants are the size selector's source of truth; created in length order because the
 *   mobile API lists DB variants as stored.
 * - Copy: EN from data/product67LocalizedCopy.ts (PRODUCT_67_EN), RU/AR descriptions and names
 *   from the same file. MoySklad items 54504-54508 are mapped in lib/moysklad.ts.
 *
 * Run after the deploy carrying the images is live; it refuses to write otherwise.
 *   npx tsx --env-file=.env.local scripts/create-product-67-dts-stamp.ts          (dry run)
 *   npx tsx --env-file=.env.local scripts/create-product-67-dts-stamp.ts --apply
 */
import { prisma } from '../lib/prisma'
import {
  PRODUCT_67_AR_DESCRIPTION,
  PRODUCT_67_AR_NAME,
  PRODUCT_67_EN,
  PRODUCT_67_NAME,
  PRODUCT_67_PRICE,
  PRODUCT_67_RU_DESCRIPTION,
  PRODUCT_67_RU_NAME,
  PRODUCT_67_SIZES,
} from '../data/product67LocalizedCopy'

const ID = '67'
const DIR = '/images/stamp_scalp'
const MAIN = `${DIR}/main.jpg`
const GALLERY = Array.from({ length: 12 }, (_, i) => `${DIR}/s${i + 1}.jpg`)
const LOCALIZED = ['ru', 'ar'].flatMap(l => GALLERY.map(p => p.replace(`${DIR}/`, `${DIR}/${l}/`)))

const DATA = {
  productNumber: ID,
  name: PRODUCT_67_NAME,
  nameRu: PRODUCT_67_RU_NAME,
  nameAr: PRODUCT_67_AR_NAME,
  price: PRODUCT_67_PRICE,
  category: 'Scalp/Hair',
  image: MAIN,
  images: JSON.stringify(GALLERY),
  inStock: true,
  size: PRODUCT_67_SIZES[0],
  ...PRODUCT_67_EN,
  descriptionRu: PRODUCT_67_RU_DESCRIPTION,
  descriptionAr: PRODUCT_67_AR_DESCRIPTION,
  skinType: null,
  targetConcerns: JSON.stringify(['hair']),
  usage: 'as-needed',
  ageGroup: 'adult',
  rating: 5,
  noDiscount: false,
  isHidden: false,
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
  const existing = await prisma.product.findFirst({
    where: { OR: [{ id: ID }, { productNumber: ID }] },
    include: { variants: true },
  })
  console.log(existing ? `exists: ${existing.name} (${existing.id}), will update` : 'new product 67')

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

  await prisma.$transaction(async tx => {
    if (existing) {
      await tx.product.update({ where: { id: existing.id }, data: DATA })
      await tx.productVariant.deleteMany({ where: { productId: existing.id } })
    } else {
      await tx.product.create({ data: { id: ID, ...DATA } })
    }
    for (const [i, size] of PRODUCT_67_SIZES.entries()) {
      await tx.productVariant.create({
        data: { productId: existing?.id ?? ID, size, price: PRODUCT_67_PRICE, available: true, isDefault: i === 0 },
      })
    }
  })

  const check = await prisma.product.findUnique({ where: { id: existing?.id ?? ID }, include: { variants: true } })
  console.log(JSON.stringify({
    id: check?.id,
    productNumber: check?.productNumber,
    name: check?.name,
    price: check?.price,
    image: check?.image,
    gallery: check?.images ? JSON.parse(check.images).length : 0,
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
