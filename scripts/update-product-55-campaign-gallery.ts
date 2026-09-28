/**
 * Product 55 (PROBLEM SKIN CARE BEAUTY BOX): "The Oil Change" campaign, Beauty Box style v1.
 *
 * - Main image -> /images/bb_problem_campaign/main.jpg (the five singles in the kit case, top
 *   down), gallery -> s1.jpg ... s12.jpg. AR/RU slides swap in at render through
 *   lib/localizedProductImages.ts, so the record holds the EN paths. The box page and the
 *   mobile box gallery add the member packshots after these.
 * - EN description moves to the audited selling copy (no inflammation, oxygen-therapy or
 *   balance-oil claims, no hard-coded prices: the page computes the saving live).
 *
 * Run after the deploy carrying the files is live; it refuses to write otherwise.
 *   npx tsx --env-file=.env.local scripts/update-product-55-campaign-gallery.ts          (dry run)
 *   npx tsx --env-file=.env.local scripts/update-product-55-campaign-gallery.ts --apply
 */
import { prisma } from '../lib/prisma'

const DIR = '/images/bb_problem_campaign'
const MAIN = `${DIR}/main.jpg`
const GALLERY = Array.from({ length: 12 }, (_, i) => `${DIR}/s${i + 1}.jpg`)
const LOCALIZED = ['ru', 'ar'].flatMap(l => GALLERY.map(p => p.replace(`${DIR}/`, `${DIR}/${l}/`)))

const DESCRIPTION =
  'An oil change for oily, blemish-prone skin. Five GENOSYS singles in routine order: SNOW O₂ Cleanser 180 ml goes on a dry face and builds its own air foam; Intensive Problem Control Toner 200 ml puts zinc PCA 0.5% on a 13.4% hydrating base, and in a four-week study of the finished toner measured sebum fell by about half; Problem Control Serum 30 ml carries zinc PCA 0.05%, and Korea registers it for oil and sebum control; Intensive Problem Control Cream 50 g is a light gel with no traditional oil phase, trehalose 1.5% and xylitol 0.5%; and three Soothing Bomb Sea Algae Masks 25 g are there for the evenings skin needs a break. Cleanse, tone, serum, cream, morning and night. The toner is non-comedogenic, tested by QACS Ltd. Made in Korea. Together for less than the five bought separately.'

async function live(path: string): Promise<boolean> {
  const res = await fetch(`https://genosys.ae${path}`, { method: 'HEAD' })
  return res.ok
}

async function main() {
  const apply = process.argv.includes('--apply')
  const product = await prisma.product.findFirst({
    where: { productNumber: '55' },
    select: { id: true, name: true, image: true, images: true, description: true },
  })
  if (!product) throw new Error('Product 55 not found')

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
    data: { image: MAIN, images: JSON.stringify(GALLERY), description: DESCRIPTION },
  })
  console.log('Updated product 55.')
}

main()
  .catch(error => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
