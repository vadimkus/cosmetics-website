/**
 * Product 64 (Hair Stamp For HAIRGEN BOOSTER) — image swap + needle-count correction.
 *
 * Needle count source of truth: DTS MG "HairGen Booster" leaflet, 17 Jun 2021
 * (Desktop/Drive/Genosys/Training Materials/HairGen_Booster/
 *  210617_Hairgen Booster leaflet-small.pdf) — "GENOSYS HAIR STAMP Microneedles 52EA".
 * The 140 figure currently in the record appears in no manufacturer document.
 *
 * "medical-grade" is dropped from the stamp-head description: the Korean
 * registration for this device is 두피관리기기 (scalp care device), not a medical
 * device, and no manufacturer document uses the term.
 *
 * Needle depth is deliberately absent. No manufacturer document states one.
 *
 * Run:  npx tsx --env-file=.env.local scripts/update-product-64-images-and-specs.ts [--apply]
 */
import { mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import { prisma } from '../lib/prisma'

const APPLY = process.argv.includes('--apply')

const NEW_MAIN = '/images/needles/main_new.jpeg'
const NEW_GALLERY = [
  '/images/needles/s1_new.jpeg',
  '/images/needles/s2.jpg',
  '/images/needles/s3_new.jpeg',
  '/images/needles/s4.jpg',
]

const NEW_STAMP_HEAD_DESC =
  'Array of 52 ultra-fine microneedles that physically penetrate the upper scalp ' +
  'to open transient delivery channels.'
const NEW_NEEDLES_SPEC = '52 ultra-fine microneedles per stamp'

async function main() {
  const p = await prisma.product.findFirst({ where: { productNumber: '64' } })
  if (!p) throw new Error('Product 64 not found')

  const backupDir = join(process.cwd(), 'backups')
  mkdirSync(backupDir, { recursive: true })
  const backupPath = join(backupDir, `product-64-before-image-spec-fix-${Date.now()}.json`)
  writeFileSync(backupPath, JSON.stringify(p, null, 2))
  console.log('Backup written:', backupPath)

  // --- description: add the now-verified 52 figure ---
  let description = p.description ?? ''
  const descBefore = description
  description = description.replace(
    'fitted with an array of ultra-fine microneedles',
    'fitted with an array of 52 ultra-fine microneedles'
  )

  // --- ingredients: 140 -> 52, drop "medical-grade" ---
  let ingredients = p.ingredients
  let ingredientsChanged = false
  if (ingredients) {
    const parsed = JSON.parse(ingredients as string) as Array<{
      name: string
      description: string
    }>
    for (const item of parsed) {
      if (/140|medical-grade/i.test(item.description)) {
        item.description = NEW_STAMP_HEAD_DESC
        ingredientsChanged = true
      }
    }
    ingredients = JSON.stringify(parsed)
  }

  // --- productDetails: needles spec ---
  let productDetails = p.productDetails
  let detailsChanged = false
  if (productDetails) {
    const parsed = JSON.parse(productDetails as string) as Record<string, string>
    if (parsed.needles && parsed.needles !== NEW_NEEDLES_SPEC) {
      parsed.needles = NEW_NEEDLES_SPEC
      detailsChanged = true
    }
    productDetails = JSON.stringify(parsed)
  }

  const diff = (label: string, before: unknown, after: unknown) => {
    const same = String(before) === String(after)
    console.log(`\n===== ${label} ${same ? '(unchanged)' : '(CHANGED)'} =====`)
    if (!same) {
      console.log('BEFORE:', before)
      console.log('AFTER :', after)
    }
  }

  diff('image', p.image, NEW_MAIN)
  diff('images', p.images, JSON.stringify(NEW_GALLERY))
  diff('description', descBefore, description)
  diff('ingredients', p.ingredients, ingredients)
  diff('productDetails', p.productDetails, productDetails)

  if (!APPLY) {
    console.log('\nDRY RUN — nothing written. Re-run with --apply to write to the live DB.')
    return
  }

  await prisma.product.update({
    where: { id: p.id },
    data: {
      image: NEW_MAIN,
      images: JSON.stringify(NEW_GALLERY),
      description,
      ...(ingredientsChanged ? { ingredients } : {}),
      ...(detailsChanged ? { productDetails } : {}),
    },
  })
  console.log('\nLive DB updated for product 64.')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
