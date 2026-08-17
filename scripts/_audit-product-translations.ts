/**
 * Audits every live product against the Arabic and Russian translation maps,
 * field by field. Read-only. Temporary diagnostic script.
 */
import { prisma } from '../lib/prisma'
import { productTranslations } from '../data/productTranslations'
import { productTranslationsRu } from '../data/productTranslationsRu'

const FIELDS = [
  'description',
  'productDetails',
  'keyFeatures',
  'benefits',
  'ingredients',
  'howToUse',
  'directions',
] as const

type Field = (typeof FIELDS)[number]

const filled = (v: unknown): boolean => typeof v === 'string' && v.trim().length > 0

async function main() {
  const products = await prisma.product.findMany({
    orderBy: { productNumber: 'asc' },
    select: {
      id: true,
      productNumber: true,
      name: true,
      description: true,
      productDetails: true,
      keyFeatures: true,
      benefits: true,
      ingredients: true,
      howToUse: true,
      directions: true,
      descriptionRu: true,
      descriptionAr: true,
      inStock: true,
    },
  })

  console.log(`Live products: ${products.length}\n`)

  const rows: Array<{
    num: string
    name: string
    enFields: Field[]
    arMissing: Field[]
    ruMissing: Field[]
    arEntry: boolean
    ruEntry: boolean
  }> = []

  for (const p of products) {
    const key = p.productNumber || p.id
    const ar = productTranslations[key] ?? null
    const ru = productTranslationsRu[key] ?? null

    // Only count a locale gap where English actually has content to translate.
    const enFields = FIELDS.filter((f) => filled((p as Record<string, unknown>)[f]))
    const arMissing = enFields.filter((f) => !filled(ar?.[f]))
    const ruMissing = enFields.filter((f) => !filled(ru?.[f]))

    rows.push({
      num: key,
      name: p.name,
      enFields,
      arMissing,
      ruMissing,
      arEntry: !!ar,
      ruEntry: !!ru,
    })
  }

  const numeric = (s: string) => (/^\d+$/.test(s) ? parseInt(s, 10) : Number.MAX_SAFE_INTEGER)
  rows.sort((a, b) => numeric(a.num) - numeric(b.num) || a.num.localeCompare(b.num))

  console.log('=== PER-PRODUCT GAPS ===')
  console.log('num | name | EN fields | AR entry | AR missing | RU entry | RU missing')
  for (const r of rows) {
    const flag = r.arMissing.length || r.ruMissing.length ? '!' : ' '
    console.log(
      `${flag} ${r.num} | ${r.name.slice(0, 46)} | ${r.enFields.length} | ${r.arEntry ? 'Y' : 'NO'} | ${
        r.arMissing.join(',') || '-'
      } | ${r.ruEntry ? 'Y' : 'NO'} | ${r.ruMissing.join(',') || '-'}`,
    )
  }

  console.log('\n=== SUMMARY ===')
  const noArEntry = rows.filter((r) => !r.arEntry)
  const noRuEntry = rows.filter((r) => !r.ruEntry)
  console.log(`Products with NO Arabic entry at all: ${noArEntry.length}`)
  console.log(`  -> ${noArEntry.map((r) => r.num).join(', ') || 'none'}`)
  console.log(`Products with NO Russian entry at all: ${noRuEntry.length}`)
  console.log(`  -> ${noRuEntry.map((r) => r.num).join(', ') || 'none'}`)

  const arGap = rows.filter((r) => r.arMissing.length > 0)
  const ruGap = rows.filter((r) => r.ruMissing.length > 0)
  console.log(`\nProducts with at least one Arabic field gap: ${arGap.length}`)
  console.log(`Products with at least one Russian field gap: ${ruGap.length}`)

  console.log('\nMissing-field counts by field:')
  for (const f of FIELDS) {
    const a = rows.filter((r) => r.arMissing.includes(f)).length
    const ru = rows.filter((r) => r.ruMissing.includes(f)).length
    console.log(`  ${f.padEnd(15)} AR ${String(a).padStart(3)}   RU ${String(ru).padStart(3)}`)
  }

  const totalAr = rows.reduce((s, r) => s + r.arMissing.length, 0)
  const totalRu = rows.reduce((s, r) => s + r.ruMissing.length, 0)
  console.log(`\nTotal field-level gaps: AR ${totalAr}, RU ${totalRu}, combined ${totalAr + totalRu}`)

  const fullyMissing = rows.filter((r) => !r.arEntry && !r.ruEntry)
  console.log(`\nProducts missing BOTH locales entirely: ${fullyMissing.length}`)
  for (const r of fullyMissing) console.log(`  ${r.num} - ${r.name}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
