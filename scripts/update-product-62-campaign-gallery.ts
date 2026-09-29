/**
 * Product 62 (SENSITIVE SKIN BEAUTY BOX): "Handle with care." campaign, Beauty Box style v1.
 *
 * - Main image -> /images/bb_sensitive_campaign/main.jpg (the six singles in the kit case, top
 *   down), gallery -> s1.jpg ... s12.jpg. AR/RU slides swap in at render through
 *   lib/localizedProductImages.ts, so the record holds the EN paths. A box with its own
 *   slides shows main + slides only (BeautyBoxProductPage, lib/beautyBoxGallery.ts).
 * - Descriptions move to the selling copy in all three languages: no hard-coded prices, the
 *   redness and water-loss readings credited to the overnight mask, fragrance by product.
 *   RU/AR come from data/product62LocalizedCopy.ts so the record and the code never drift.
 *
 * Run after the deploy carrying the files is live; it refuses to write otherwise.
 *   npx tsx --env-file=.env.local scripts/update-product-62-campaign-gallery.ts          (dry run)
 *   npx tsx --env-file=.env.local scripts/update-product-62-campaign-gallery.ts --apply
 */
import { prisma } from '../lib/prisma'
import { PRODUCT_62_AR_DESCRIPTION, PRODUCT_62_RU_DESCRIPTION } from '../data/product62LocalizedCopy'

const DIR = '/images/bb_sensitive_campaign'
const MAIN = `${DIR}/main.jpg`
const GALLERY = Array.from({ length: 12 }, (_, i) => `${DIR}/s${i + 1}.jpg`)
const LOCALIZED = ['ru', 'ar'].flatMap(l => GALLERY.map(p => p.replace(`${DIR}/`, `${DIR}/${l}/`)))

const DESCRIPTION =
  'Handle with care. Reactive skin flushes at the smallest thing: heat, air conditioning, a new cream. This box goes gently from the first step to the last. SNOW O₂ Cleanser 180 ml goes on a dry face and bubbles up on its own, so nothing is scrubbed. SNOW BOOSTER 200 ml is the toner with no parfum and no essential oils, with 3% betaine. All For Sensitive Serum 30 ml carries MultiEx BSASM® Plus at 1%, seven plant extracts from centella to chamomile, to relieve and protect. Skin Barrier Protecting Cream 100 g is the richest cream GENOSYS makes: Ceramide NP at 5,000 ppm, glycerin at 17.49% and shea butter. Skin Rescue Overnight Cream Mask 100 g takes the cream\u2019s place once or twice a week and stays on until morning: redness down 26% and water loss down 15% after four weeks. One Soothing Bomb Sea Algae Mask 25 g for the evening skin runs hot, 15 to 20 minutes after the toner. Cleanse, tone, serum, cream, morning and night, with sunscreen last in the morning. Only the toner is free of parfum and essential oils; each fragrance ingredient is named on its product page. Made in Korea. Together for less than the six bought separately.'

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
    where: { productNumber: '62' },
    select: { id: true, name: true, image: true, images: true },
  })
  if (!product) throw new Error('Product 62 not found')

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
      descriptionRu: PRODUCT_62_RU_DESCRIPTION,
      descriptionAr: PRODUCT_62_AR_DESCRIPTION,
    },
  })
  console.log('Updated product 62.')
}

main()
  .catch(error => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
