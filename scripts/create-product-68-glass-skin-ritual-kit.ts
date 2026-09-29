/**
 * Product 68, GLASS SKIN RITUAL KIT: the DTS MG 2026 holiday kit, "Full moon glow." campaign.
 *
 * - Price 740 AED, the MoySklad retail price of both kit SKUs (54501 #01 Bright and 54502
 *   #02 Natural, identical). The shade is a colour option from data/productConfig.ts and
 *   lib/moysklad.ts maps each value to its SKU, so the record carries no DB variants, the
 *   same way product 63 (Revita Glow) does.
 * - Category Beauty Boxes, noDiscount: the page is BeautyBoxProductPage, the kit price is
 *   already the saving, and account discounts must not stack on it.
 * - id and productNumber are both "68". Several client hooks read productConfig by product.id,
 *   so a CUID here would hide the shade options from them.
 * - Main /images/glass_skin_campaign/main.jpg, gallery s1 ... s12; RU/AR slides swap in at
 *   render through lib/localizedProductImages.ts.
 *
 * Run after the deploy carrying the files is live; it refuses to write otherwise.
 *   npx tsx --env-file=.env.local scripts/create-product-68-glass-skin-ritual-kit.ts          (dry run)
 *   npx tsx --env-file=.env.local scripts/create-product-68-glass-skin-ritual-kit.ts --apply
 */
import { prisma } from '../lib/prisma'
import {
  PRODUCT_68_AR_DESCRIPTION,
  PRODUCT_68_AR_NAME,
  PRODUCT_68_EN_RECORD,
  PRODUCT_68_RU_DESCRIPTION,
  PRODUCT_68_RU_NAME,
} from '../data/product68LocalizedCopy'

const NUMBER = '68'
const PRICE = 740
const DIR = '/images/glass_skin_campaign'
const MAIN = `${DIR}/main.jpg`
const GALLERY = Array.from({ length: 12 }, (_, i) => `${DIR}/s${i + 1}.jpg`)
const LOCALIZED = ['ru', 'ar'].flatMap(l => GALLERY.map(p => p.replace(`${DIR}/`, `${DIR}/${l}/`)))

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
  const existing = await prisma.product.findFirst({
    where: { OR: [{ productNumber: NUMBER }, { id: NUMBER }] },
    select: { id: true, name: true },
  })
  console.log(existing ? `Updating ${existing.name} (${existing.id})` : `Creating product ${NUMBER}`)

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

  const data = {
    productNumber: NUMBER,
    name: PRODUCT_68_EN_RECORD.name,
    nameRu: PRODUCT_68_RU_NAME,
    nameAr: PRODUCT_68_AR_NAME,
    price: PRICE,
    description: PRODUCT_68_EN_RECORD.description,
    descriptionRu: PRODUCT_68_RU_DESCRIPTION,
    descriptionAr: PRODUCT_68_AR_DESCRIPTION,
    productDetails: PRODUCT_68_EN_RECORD.productDetails,
    keyFeatures: PRODUCT_68_EN_RECORD.keyFeatures,
    benefits: PRODUCT_68_EN_RECORD.benefits,
    howToUse: PRODUCT_68_EN_RECORD.howToUse,
    directions: PRODUCT_68_EN_RECORD.directions,
    ingredients: null,
    image: MAIN,
    images: JSON.stringify(GALLERY),
    category: 'Beauty Boxes',
    size: '1 kit',
    inStock: true,
    noDiscount: true,
    isHidden: false,
    isPriceOnRequest: false,
  }
  console.log('  name   :', data.name, '|', data.nameRu, '|', data.nameAr)
  console.log('  price  :', data.price, 'AED ·', data.category, '·', data.size, '· noDiscount')
  console.log('  image  :', data.image, '+', GALLERY.length, 'slides')

  if (!apply) {
    console.log('Dry run - pass --apply to write.')
    return
  }
  if (existing) {
    await prisma.product.update({ where: { id: existing.id }, data })
    console.log(`Updated product ${NUMBER}.`)
  } else {
    await prisma.product.create({ data: { id: NUMBER, ...data } })
    console.log(`Created product ${NUMBER}.`)
  }
}

main()
  .catch(error => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
