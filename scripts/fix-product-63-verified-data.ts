/**
 * Corrects product 63 (Revita Glow BB Cream) against the Intertek filing.
 *
 * Three defects, all traced to cushion-product copy contaminating the record:
 *   1. RU/AR descriptions state 7 herbal extracts; the formula has 8.
 *   2. The Full INCI entry omits Parfum and five declared fragrance allergens.
 *   3. The benefits list describes a puff and air-cell structure that belong to
 *      the separate Skin Caring Blemish Balm Cushion.
 *
 * Dry run by default. Pass --apply to write. Originals are always backed up to
 * docs/backups/ before any write.
 *
 *   npx tsx --env-file=.env.local scripts/fix-product-63-verified-data.ts
 *   npx tsx --env-file=.env.local scripts/fix-product-63-verified-data.ts --apply
 */
import { mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import { prisma } from '../lib/prisma'
import { getRevitaGlowFullInci } from '../components/product/revitaglow/revitaGlowCopy'

const APPLY = process.argv.includes('--apply')

/** Sourced from the Intertek artwork declaration for #01 Bright / #02 Natural. */
const VERIFIED_INCI = getRevitaGlowFullInci()

const VERIFIED_BENEFITS = [
  'Instantly revitalizes complexion with a clear, glass-like glow',
  'Natural coverage that conceals skin imperfections',
  'UV protection with SPF 38 PA+++',
  'Infused with 10 Vitamin Complex for skin energizing',
  '8 Herb Complex for soothing and barrier protection',
  'Niacinamide 2% for brightening and barrier support',
  'Adenosine 0.04% for wrinkle improvement',
  'Maintains a smooth, radiant complexion without dryness',
  'Hydrating formula with plant-derived moisturizing ingredients',
]

function diff(label: string, before: string | null, after: string) {
  const changed = (before ?? '') !== after
  console.log(`\n----- ${label} ${changed ? '(CHANGED)' : '(no change)'} -----`)
  if (!changed) return false
  console.log('BEFORE:', before ?? '(null)')
  console.log('AFTER :', after)
  return true
}

async function main() {
  const p = await prisma.product.findFirst({ where: { productNumber: '63' } })
  if (!p) throw new Error('Product 63 not found')
  console.log(`Product 63 → id ${p.id}\nMode: ${APPLY ? 'APPLY (writing to live DB)' : 'DRY RUN'}`)

  // 1. Herb count in the localized descriptions.
  const descriptionRu = (p.descriptionRu ?? '').replace(
    '7 растительных экстрактов',
    '8 растительных экстрактов'
  )
  const descriptionAr = (p.descriptionAr ?? '').replace('و7 مستخلصات عشبية', 'و8 مستخلصات عشبية')

  // 2. Full INCI, replacing only the "Full INCI" entry and leaving the
  //    active-ingredient cards untouched.
  const ingredients = JSON.parse(p.ingredients ?? '[]') as { name: string; description: string }[]
  const inciEntry = ingredients.find(i => i.name === 'Full INCI')
  if (!inciEntry) throw new Error('No "Full INCI" entry found in ingredients')
  const ingredientsAfter = JSON.stringify(
    ingredients.map(i => (i.name === 'Full INCI' ? { ...i, description: VERIFIED_INCI } : i))
  )

  // 3. Benefits, with cushion-only claims removed.
  const benefitsAfter = JSON.stringify(VERIFIED_BENEFITS)

  const changes = [
    diff('descriptionRu', p.descriptionRu, descriptionRu),
    diff('descriptionAr', p.descriptionAr, descriptionAr),
    diff('ingredients → Full INCI', inciEntry.description, VERIFIED_INCI),
    diff('benefits', p.benefits, benefitsAfter),
  ]

  if (!changes.some(Boolean)) {
    console.log('\nNothing to change — record already correct.')
    return
  }

  if (!APPLY) {
    console.log('\nDry run complete. Re-run with --apply to write.')
    return
  }

  const backupDir = join(process.cwd(), 'docs', 'backups')
  mkdirSync(backupDir, { recursive: true })
  const backupPath = join(backupDir, `product-63-before-${new Date().toISOString().slice(0, 10)}.json`)
  writeFileSync(
    backupPath,
    JSON.stringify(
      {
        id: p.id,
        productNumber: p.productNumber,
        descriptionRu: p.descriptionRu,
        descriptionAr: p.descriptionAr,
        ingredients: p.ingredients,
        benefits: p.benefits,
      },
      null,
      2
    )
  )
  console.log(`\nBackup written to ${backupPath}`)

  await prisma.product.update({
    where: { id: p.id },
    data: { descriptionRu, descriptionAr, ingredients: ingredientsAfter, benefits: benefitsAfter },
  })
  console.log('Live DB updated.')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
