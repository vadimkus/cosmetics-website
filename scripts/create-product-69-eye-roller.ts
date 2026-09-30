/**
 * Creates product 69, the GENOSYS Eye Roller 0.25 mm (MoySklad code 00084, 210 AED), with the
 * "For your eyes only." art set as its main and gallery.
 *
 * - id and productNumber are both '69', so id-keyed and number-keyed lookups agree.
 * - One size variant, 0.25mm, so the cart line carries the length like the other DTS tools.
 * - Copy: EN from data/product69LocalizedCopy.ts (PRODUCT_69_EN), RU/AR from the same file.
 * - Product 50 (Eye Zone Care Kit): its RU/AR descriptions stop calling the roller exclusive to the
 *   kit, from data/product50LocalizedCopy.ts.
 *
 * Run after the deploy carrying the images is live; it refuses to write otherwise.
 *   npx tsx --env-file=.env.local scripts/create-product-69-eye-roller.ts          (dry run)
 *   npx tsx --env-file=.env.local scripts/create-product-69-eye-roller.ts --apply
 */
import { prisma } from '../lib/prisma'
import { PRODUCT_50_AR_TRANSLATION, PRODUCT_50_RU_TRANSLATION } from '../data/product50LocalizedCopy'
import {
  PRODUCT_69_AR_DESCRIPTION,
  PRODUCT_69_AR_NAME,
  PRODUCT_69_EN,
  PRODUCT_69_NAME,
  PRODUCT_69_PRICE,
  PRODUCT_69_RU_DESCRIPTION,
  PRODUCT_69_RU_NAME,
  PRODUCT_69_SIZES,
} from '../data/product69LocalizedCopy'

const ID = '69'
const DIR = '/images/eyeroller_art'
const MAIN = `${DIR}/main.jpg`
const GALLERY = Array.from({ length: 12 }, (_, i) => `${DIR}/s${i + 1}.jpg`)
const LOCALIZED = ['ru', 'ar'].flatMap(l => GALLERY.map(p => p.replace(`${DIR}/`, `${DIR}/${l}/`)))

const DATA = {
  productNumber: ID,
  name: PRODUCT_69_NAME,
  nameRu: PRODUCT_69_RU_NAME,
  nameAr: PRODUCT_69_AR_NAME,
  price: PRODUCT_69_PRICE,
  category: 'Microneedling',
  image: MAIN,
  images: JSON.stringify(GALLERY),
  inStock: true,
  size: PRODUCT_69_SIZES[0],
  ...PRODUCT_69_EN,
  descriptionRu: PRODUCT_69_RU_DESCRIPTION,
  descriptionAr: PRODUCT_69_AR_DESCRIPTION,
  skinType: null,
  targetConcerns: null,
  usage: null,
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
  console.log(existing ? `exists: ${existing.name} (${existing.id}), will update` : 'new product 69')
  const kit = await prisma.product.findFirst({ where: { productNumber: '50' }, select: { id: true } })
  if (!kit) throw new Error('Product 50 not found')

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
    for (const [i, size] of PRODUCT_69_SIZES.entries()) {
      await tx.productVariant.create({
        data: { productId: existing?.id ?? ID, size, price: PRODUCT_69_PRICE, available: true, isDefault: i === 0 },
      })
    }
    await tx.product.update({
      where: { id: kit.id },
      data: { descriptionRu: PRODUCT_50_RU_TRANSLATION.description, descriptionAr: PRODUCT_50_AR_TRANSLATION.description },
    })
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
  console.log('URL: https://genosys.ae/products/69')
}

main()
  .catch(error => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
