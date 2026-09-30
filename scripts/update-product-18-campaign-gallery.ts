/**
 * Product 18 (MOISTURE REPLENISHING HYALURON SERUM): "Drink up." campaign.
 *
 * - Main image -> /images/hsserum_campaign/main.jpg (carton and dropper bottle on white, no type),
 *   gallery -> s1.jpg ... s12.jpg. AR/RU slides swap in at render through
 *   lib/localizedProductImages.ts, so the record holds the EN paths.
 * - Descriptions move to the campaign voice in all three languages. RU/AR come from
 *   data/productLocalizedCopyAudit.ts so the record and the code never drift.
 *
 * Run after the deploy carrying the files is live; it refuses to write otherwise.
 *   npx tsx --env-file=.env.local scripts/update-product-18-campaign-gallery.ts          (dry run)
 *   npx tsx --env-file=.env.local scripts/update-product-18-campaign-gallery.ts --apply
 */
import { prisma } from '../lib/prisma'
import { AUDITED_PRODUCT_LOCALIZED_COPY } from '../data/productLocalizedCopyAudit'

const DIR = '/images/hsserum_campaign'
const MAIN = `${DIR}/main.jpg`
const GALLERY = Array.from({ length: 12 }, (_, i) => `${DIR}/s${i + 1}.jpg`)
const LOCALIZED = ['ru', 'ar'].flatMap(l => GALLERY.map(p => p.replace(`${DIR}/`, `${DIR}/${l}/`)))

const DESCRIPTION =
  'Drink up. 30 ml hydrating serum. A sky-blue coconut-water serum for skin that runs dry in the AC: hydrolyzed hyaluronic acid at 2,000 ppm leads the Hyaluronan 11 Multi-Complex for multi-level hydration, and PENTAVITIN (saccharide isomerate) 0.615% helps skin hold the water. In a DTS MG test on 21 women, deep skin hydration rose immediately after one use. Smooth over clean skin and pat in, morning and evening, then seal with Moisture Replenishing Hyaluron Cream. The colour is the formula itself, no pigment added. Dermatologically tested. Made in Korea.'

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
    where: { OR: [{ productNumber: '18' }, { id: '18' }] },
    select: { id: true, name: true, image: true, images: true },
  })
  if (!product) throw new Error('Product 18 not found')

  console.log(product.name, product.id)
  console.log('  image  :', product.image, '->', MAIN)
  console.log('  images :', product.images ?? 'null', '->', `${GALLERY.length} campaign slides`)

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
  await prisma.product.update({
    where: { id: product.id },
    data: {
      image: MAIN,
      images: JSON.stringify(GALLERY),
      description: DESCRIPTION,
      descriptionRu: AUDITED_PRODUCT_LOCALIZED_COPY.ru['18'].description,
      descriptionAr: AUDITED_PRODUCT_LOCALIZED_COPY.ar['18'].description,
    },
  })
  console.log('Updated product 18.')
}

main()
  .catch(error => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
