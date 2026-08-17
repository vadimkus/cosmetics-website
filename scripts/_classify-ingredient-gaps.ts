/**
 * Classifies every ingredients-array difference between EN and AR/RU:
 *   - MISSING_FULL_INCI : EN ends with a "Full INCI" item the locale lacks
 *   - LOCALE_HAS_MORE   : locale has items EN does not
 *   - OTHER             : anything else, needs eyes
 * Read-only diagnostic.
 */
import { prisma } from '../lib/prisma'
import { productTranslations } from '../data/productTranslations'
import { productTranslationsRu } from '../data/productTranslationsRu'

type Item = { name?: string; description?: string }

const parseArr = (s: unknown): Item[] | null => {
  if (typeof s !== 'string' || !s.trim()) return null
  try {
    const v = JSON.parse(s)
    return Array.isArray(v) ? (v as Item[]) : null
  } catch {
    return null
  }
}

const isInci = (it: Item | undefined) =>
  !!it && /full\s*inci|inci|القائمة الكاملة|полный состав|состав/i.test(`${it.name ?? ''}`)

async function main() {
  const products = await prisma.product.findMany({ orderBy: { productNumber: 'asc' } })
  const rows: string[] = []
  const counts = { MISSING_FULL_INCI: 0, LOCALE_HAS_MORE: 0, OTHER: 0 }
  const inciTargets: Array<{ num: string; locale: 'AR' | 'RU' }> = []

  for (const p of products) {
    const key = p.productNumber || p.id
    const en = parseArr((p as unknown as Record<string, unknown>).ingredients)
    if (!en) continue

    for (const [locale, map] of [
      ['AR', productTranslations],
      ['RU', productTranslationsRu],
    ] as const) {
      const loc = parseArr((map as Record<string, Record<string, unknown>>)[key]?.ingredients)
      if (!loc) continue
      if (loc.length === en.length) continue

      const enHasInci = en.some(isInci)
      const locHasInci = loc.some(isInci)

      let kind: keyof typeof counts
      if (loc.length < en.length && enHasInci && !locHasInci && en.length - loc.length === 1) {
        kind = 'MISSING_FULL_INCI'
        inciTargets.push({ num: key, locale: locale as 'AR' | 'RU' })
      } else if (loc.length > en.length) {
        kind = 'LOCALE_HAS_MORE'
      } else {
        kind = 'OTHER'
      }
      counts[kind]++
      rows.push(
        `${key.padStart(3)} ${locale} ${String(kind).padEnd(18)} EN ${en.length} vs ${loc.length}  enInci=${enHasInci} locInci=${locHasInci}  | ${p.name.slice(0, 32)}`,
      )
    }
  }

  console.log(rows.join('\n'))
  console.log('\n=== COUNTS ===')
  for (const [k, v] of Object.entries(counts)) console.log(`${k.padEnd(20)} ${v}`)
  console.log(`\nProducts+locales needing only a Full INCI append: ${inciTargets.length}`)
  console.log(JSON.stringify(inciTargets))
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
