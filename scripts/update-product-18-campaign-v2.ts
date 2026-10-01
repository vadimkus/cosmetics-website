/**
 * Product 18, MOISTURE REPLENISHING HYALURON SERUM: the "Drink up." set (v2, 1 Oct 2026) as main and
 * gallery. The main is the bottle alone on white (no carton): single-item products show the product,
 * the carton appears in the gallery (card slide). Also replaces the EN detail and benefit rows that
 * still carried dossier lines (pH specification, "coconut water 0.80%, not 78%").
 *
 * Run after the deploy carrying the images is live; it refuses to write otherwise.
 *   npx tsx --env-file=.env.local scripts/update-product-18-campaign-v2.ts          (dry run)
 *   npx tsx --env-file=.env.local scripts/update-product-18-campaign-v2.ts --apply
 */
import { prisma } from '../lib/prisma'

const DIR = '/images/hsserum_v2'
const MAIN = `${DIR}/main.jpg`
// s4b (1 Oct 2026) replaces s4, which cited a test panel.
const GALLERY = Array.from({ length: 11 }, (_, i) => `${DIR}/s${i + 1}${i === 3 ? 'b' : ''}.jpg`)
const LOCALIZED = ['ru', 'ar'].flatMap(l => GALLERY.map(p => p.replace(`${DIR}/`, `${DIR}/${l}/`)))

const PRODUCT_DETAILS = JSON.stringify({
  form: 'Leave-on moisturizing serum',
  size: '30ml',
  target: 'Dry or dehydrated skin',
  technology: 'Hyaluronan 11 Multi-Complex, led by hydrolyzed hyaluronic acid 2,000 ppm',
  keyBenefits: 'Deep hydration that stays, light enough to sink straight in',
  usage: 'Morning and evening',
  application: 'Smooth over clean skin and pat in',
  appearance: 'Sky-blue serum, no pigment added',
  pao: '12 months after opening',
  shelfLife: 'Three years unopened, expiry printed on the bottle',
  origin: 'South Korea',
})

const BENEFITS = JSON.stringify([
  'Deep hydration for skin that runs dry in the AC',
  'Hyaluronan 11 Multi-Complex with hydrolyzed hyaluronic acid 2,000 ppm',
  'PENTAVITIN helps skin hold on to the water',
  'Deep hydration rises from the very first use',
  'Light coconut-water serum, sky blue with no pigment added',
  'Dermatologically tested. Made in Korea',
])

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
  const product = await prisma.product.findFirst({ where: { productNumber: '18' } })
  if (!product) throw new Error('Product 18 not found')

  const missing: string[] = []
  for (const path of [MAIN, ...GALLERY, ...LOCALIZED]) if (!(await live(path))) missing.push(path)
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
  await prisma.product.update({
    where: { id: product.id },
    data: { image: MAIN, images: JSON.stringify(GALLERY), productDetails: PRODUCT_DETAILS, benefits: BENEFITS },
  })
  const check = await prisma.product.findUnique({ where: { id: product.id } })
  console.log({ image: check?.image, gallery: check?.images ? JSON.parse(check.images).length : 0 })
}

main()
  .catch(error => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
