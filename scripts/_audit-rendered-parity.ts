/**
 * Re-runs the list-length parity check against the RENDERED list, i.e. after
 * lib/localizedIngredients.ts has appended the Full INCI row. Anything still
 * flagged here is a real content gap rather than the INCI fallback.
 *
 * Usage: npx tsx --env-file=.env.local scripts/_audit-rendered-parity.ts
 */
import { prisma } from '../lib/prisma'
import { productTranslations } from '../data/productTranslations'
import { productTranslationsRu } from '../data/productTranslationsRu'
import { withFullInciFallback } from '../lib/localizedIngredients'

type Bag = Record<string, string | null | undefined>

function len(raw: string | null | undefined): number | null {
  if (!raw) return null
  try {
    const v = JSON.parse(raw)
    return Array.isArray(v) ? v.length : null
  } catch {
    return null
  }
}

async function main() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'asc' } })
  const rows: string[] = []

  for (const p of products) {
    const row = p as unknown as Record<string, unknown>
    const key = (row.productNumber as string) || p.id
    const ar = productTranslations[key] as Bag | undefined
    const ru = productTranslationsRu[key] as Bag | undefined
    if (!ar && !ru) continue

    for (const [locale, bag] of [
      ['AR', ar],
      ['RU', ru],
    ] as const) {
      if (!bag) continue
      for (const field of ['ingredients', 'benefits', 'keyFeatures'] as const) {
        const en = row[field] as string | null
        let loc = bag[field]
        if (field === 'ingredients') {
          loc = withFullInciFallback(loc ?? en, en, locale.toLowerCase())
        }
        const a = len(en)
        const b = len(loc)
        if (a == null || b == null || a === b) continue
        rows.push(
          `${key.padStart(3)} ${locale} ${field.padEnd(12)} EN ${a} vs ${locale} ${b}  (${b > a ? '+' : ''}${b - a})  | ${p.name.slice(0, 40)}`,
        )
      }
    }
  }

  console.log(`\nreal list-parity gaps after INCI fallback: ${rows.length}\n`)
  rows.forEach((r) => console.log(r))
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
