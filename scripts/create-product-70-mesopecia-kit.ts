/**
 * Creates product 70, the MESOPECIA KIT (1,100 AED): Scalp Peeling α 100 ml (46), Hair Solution α
 * 4 ml × 8 (45) and one Microneedle Stamp 0.25 mm (67), with the "The root of it." art set as its main
 * and gallery. Hides product 47, the HR³ MATRIX MESOPECIA KIT it replaces (next.config.js redirects
 * /products/47 here).
 *
 * - id and productNumber are both '70', so id-keyed and number-keyed lookups agree.
 * - One variant, no size, like the Eye Zone Care Kit.
 * - Copy: data/product70LocalizedCopy.ts. Ingredients: a short card per liquid plus both full INCI
 *   lists, read from products 45 and 46 so the kit can never disagree with them.
 *
 * Run after the deploy carrying the images is live; it refuses to write otherwise.
 *   npx tsx --env-file=.env.local scripts/create-product-70-mesopecia-kit.ts          (dry run)
 *   npx tsx --env-file=.env.local scripts/create-product-70-mesopecia-kit.ts --apply
 */
import { prisma } from '../lib/prisma'
import {
  PRODUCT_70_AR_DESCRIPTION,
  PRODUCT_70_AR_NAME,
  PRODUCT_70_EN,
  PRODUCT_70_NAME,
  PRODUCT_70_PRICE,
  PRODUCT_70_RU_DESCRIPTION,
  PRODUCT_70_RU_NAME,
  PRODUCT_70_SIZE,
} from '../data/product70LocalizedCopy'

const ID = '70'
const REPLACED = '47'
const DIR = '/images/mesopecia_tend'
const MAIN = `${DIR}/main.jpg`
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

async function fullInci(productNumber: string): Promise<string> {
  const p = await prisma.product.findFirst({ where: { productNumber }, select: { ingredients: true } })
  const cards: { name?: string; description?: string }[] = JSON.parse(p?.ingredients || '[]')
  const inci = cards.find(c => c.name === 'Full INCI')?.description
  if (!inci) throw new Error(`product ${productNumber} has no Full INCI card`)
  return inci
}

async function main() {
  const apply = process.argv.includes('--apply')
  const existing = await prisma.product.findFirst({ where: { OR: [{ id: ID }, { productNumber: ID }] } })
  console.log(existing ? `exists: ${existing.name} (${existing.id}), will update` : 'new product 70')
  const old = await prisma.product.findFirst({ where: { productNumber: REPLACED }, select: { id: true, isHidden: true } })
  if (!old) throw new Error('product 47 not found')

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

  const ingredients = JSON.stringify([
    { name: 'Scalp Peeling α · 100 ml', description: 'Alcohol denat. 33.6% and propylene glycol lift sebum and build-up; menthol 0.9% with menthyl lactate 0.8% for a cold, fresh feel.' },
    { name: 'Hair Solution α · 4 ml × 8', description: 'Copper tripeptide-1, niacinamide and panthenol to nourish and condition, with menthol for a cool finish.' },
    { name: 'Peeling full INCI', description: await fullInci('46') },
    { name: 'Solution full INCI', description: await fullInci('45') },
  ])

  const data = {
    productNumber: ID,
    name: PRODUCT_70_NAME,
    nameRu: PRODUCT_70_RU_NAME,
    nameAr: PRODUCT_70_AR_NAME,
    price: PRODUCT_70_PRICE,
    category: 'Scalp/Hair',
    image: MAIN,
    images: JSON.stringify(GALLERY),
    inStock: true,
    size: PRODUCT_70_SIZE,
    ...PRODUCT_70_EN,
    ingredients,
    descriptionRu: PRODUCT_70_RU_DESCRIPTION,
    descriptionAr: PRODUCT_70_AR_DESCRIPTION,
    skinType: null,
    targetConcerns: null,
    usage: null,
    ageGroup: 'adult',
    rating: 5,
    noDiscount: false,
    isHidden: false,
  }

  if (!apply) {
    console.log('Dry run - pass --apply to write.')
    return
  }

  await prisma.$transaction(async tx => {
    if (existing) {
      await tx.product.update({ where: { id: existing.id }, data })
      await tx.productVariant.deleteMany({ where: { productId: existing.id } })
    } else {
      await tx.product.create({ data: { id: ID, ...data } })
    }
    await tx.productVariant.create({
      data: { productId: existing?.id ?? ID, size: null, price: PRODUCT_70_PRICE, available: true, isDefault: true },
    })
    await tx.product.update({ where: { id: old.id }, data: { isHidden: true } })
  })

  const check = await prisma.product.findUnique({ where: { id: existing?.id ?? ID }, include: { variants: true } })
  const hidden = await prisma.product.findUnique({ where: { id: old.id }, select: { isHidden: true } })
  console.log(JSON.stringify({
    id: check?.id,
    productNumber: check?.productNumber,
    name: check?.name,
    price: check?.price,
    image: check?.image,
    gallery: check?.images ? JSON.parse(check.images).length : 0,
    variants: check?.variants.map(v => `${v.size ?? '-'}:${v.price}${v.isDefault ? '*' : ''}`),
    product47Hidden: hidden?.isHidden,
  }, null, 2))
  console.log('URL: https://genosys.ae/products/70')
}

main()
  .catch(error => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
