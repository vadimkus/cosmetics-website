/**
 * Product 29 (MOISTURE REPLENISHING HYALURON CREAM): the "Sealed fresh." campaign.
 *
 * - Main image -> /images/mhcream_campaign/main.jpg (the 50g and 250g tubes on white),
 *   gallery -> s1.jpg ... s12.jpg. AR/RU slides swap in at render through
 *   lib/localizedProductImages.ts, so the record holds the EN paths.
 * - EN text fields move to the selling copy of the page (no "printed on the carton", no
 *   "declared", no "the manufacturer calls it"); the Full INCI entry is kept as it is, since the
 *   page reads the ingredient list from it. descriptionRu / descriptionAr follow
 *   data/productLocalizedCopyAudit.ts.
 *
 * Run after the deploy carrying the files is live; it refuses to write otherwise.
 *   npx tsx --env-file=.env.local scripts/update-product-29-campaign-gallery.ts          (dry run)
 *   npx tsx --env-file=.env.local scripts/update-product-29-campaign-gallery.ts --apply
 */
import { prisma } from '../lib/prisma'
import { AUDITED_PRODUCT_LOCALIZED_COPY } from '../data/productLocalizedCopyAudit'

const DIR = '/images/mhcream_campaign'
const MAIN = `${DIR}/main.jpg`
const GALLERY = Array.from({ length: 12 }, (_, i) => `${DIR}/s${i + 1}.jpg`)
const LOCALIZED = ['ru', 'ar'].flatMap(l => GALLERY.map(p => p.replace(`${DIR}/`, `${DIR}/${l}/`)))
const CUTOUT = '/images/cutout/29-v2.webp'

const DESCRIPTION =
  'Sealed fresh. Dubai air takes water from your skin all day; this cream puts it back and puts a lid on it. Glycerin at 9% and PENTAVITIN 0.615% pull water in, and 1,000.9 ppm of high-weight hyaluronic acid rests on the surface like a fine film and keeps it there. Hydration rose 82% straight after one use and was still significantly higher 72 hours later. Massage it in morning and night, after the Hyaluron Serum: the serum fills, the cream seals. The 50g tube fits your hand luggage; the 250g is the professional size.'

type Ingredient = { name: string; description: string }

const INGREDIENTS: Ingredient[] = [
  { name: 'Hyaluronan 11 Multi-Complex', description: 'Eleven grades of hyaluronic acid, from light to heavy, led by 1,000.9 ppm of the heavy grade that seals water in.' },
  { name: 'High-weight hyaluronic acid · 1,000.9 ppm', description: 'Rests on the surface as a light film that keeps water from escaping, so skin stays soft for hours.' },
  { name: 'Glycerin · 9%', description: 'Nearly a tenth of the tube, pulling water into the outer layer of skin.' },
  { name: 'PENTAVITIN · 0.615%', description: 'A plant-derived sugar close to the ones already in skin, known as the moisture magnet.' },
  { name: 'Five mushrooms', description: 'Tremella, turkey tail, cauliflower fungus, reishi and blackhood: the "with MUSHROOMS" on the tube.' },
]

const COPY = {
  description: DESCRIPTION,
  descriptionRu: AUDITED_PRODUCT_LOCALIZED_COPY.ru['29'].description,
  descriptionAr: AUDITED_PRODUCT_LOCALIZED_COPY.ar['29'].description,
  productDetails: JSON.stringify({
    form: 'Leave-on moisturizing cream, tube',
    size: '50g homecare / 250g professional',
    function: 'Moisturizing',
    technology: 'Hyaluronan 11 Multi-Complex, led by 1,000.9 ppm of high-weight hyaluronic acid',
    keyBenefits: '+82% hydration after one use, still higher 72 hours later',
    usage: 'Morning and night, after the serum',
    skinType: 'Dry skin, and dehydrated skin of any type',
    application: 'Apply on the face and gently massage, like laying down a fine film of moisture',
    fragrance: 'Light floral: geranium flower oil, with citronellol and geraniol',
    storage: 'Cool and dry, but not the fridge',
    testing: 'Dermatologically tested',
    origin: 'Made in Korea by DTS MG',
  }),
  keyFeatures: JSON.stringify([
    { title: '+82% after one use', description: 'Hydration rose 82% straight after a single application, and was still significantly higher 72 hours later.' },
    { title: 'The seal', description: '1,000.9 ppm of high-weight hyaluronic acid rests on the surface as a light film and keeps the water in.' },
    { title: 'Glycerin 9% + PENTAVITIN', description: 'The humectant pair that pulls water toward the skin: more than a tenth of the tube between them.' },
    { title: 'Fill, then seal', description: 'Pair it with the Hyaluron Serum: the serum fills skin with water, the cream keeps it there.' },
  ]),
  benefits: JSON.stringify([
    'Hydration up 82% after a single use',
    'Still significantly higher 72 hours later',
    'High-weight hyaluronic acid seals the water in',
    'Glycerin 9% and PENTAVITIN 0.615% draw it into skin',
    'A soft, refreshing cream for morning and night',
    '50g for your hand luggage, 250g for home or clinic',
  ]),
  howToUse:
    '1. Cleanse, then tone\n2. Pat in the Moisture Replenishing Hyaluron Serum first\n3. Massage this cream over the face, like laying down a fine film of moisture\n4. Last step at night; sunscreen over it in the morning\n5. Keep it cool and dry, but out of the fridge',
  directions:
    'Dermatologically tested. For dry skin and for dehydrated skin of any type. Contains geranium flower oil, with citronellol and geraniol. For external use only. Keep clear of the eye area. Stop and speak to a doctor if redness, swelling or irritation appears. Keep in a cool dry place, but not the fridge. Three years unopened, with the expiry date on the box.',
}

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
    where: { productNumber: '29' },
    select: { id: true, name: true, image: true, images: true, ingredients: true },
  })
  if (!product) throw new Error('Product 29 not found')

  const current = JSON.parse(product.ingredients || '[]') as Ingredient[]
  const fullInci = current.find(i => i.name === 'Full INCI')
  if (!fullInci) throw new Error('Product 29 has no Full INCI entry to keep')

  console.log(product.name, product.id)
  console.log('  image  :', product.image, '->', MAIN)
  console.log('  images :', product.images ?? 'null', '->', `${GALLERY.length} campaign slides`)

  const missing: string[] = []
  for (const path of [MAIN, ...GALLERY, ...LOCALIZED, CUTOUT]) {
    if (!(await live(path))) missing.push(path)
  }
  if (missing.length) {
    console.error(`Not live yet (${missing.length}):`, missing.slice(0, 6).join(', '))
    process.exitCode = 1
    return
  }
  console.log(`  all ${2 + GALLERY.length + LOCALIZED.length} files return 200`)

  if (!apply) {
    console.log('Dry run - pass --apply to write. Fields:', ['image', 'images', 'ingredients', ...Object.keys(COPY)].join(', '))
    return
  }
  await prisma.product.update({
    where: { id: product.id },
    data: {
      image: MAIN,
      images: JSON.stringify(GALLERY),
      ingredients: JSON.stringify([...INGREDIENTS, fullInci]),
      ...COPY,
    },
  })
  console.log('Updated product 29.')
}

main()
  .catch(error => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
