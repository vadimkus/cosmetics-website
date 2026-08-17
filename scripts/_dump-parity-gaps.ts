/**
 * Prints the item names for each of the remaining list-parity gaps so the
 * missing or extra entry can be identified by hand.
 *
 * Usage: npx tsx --env-file=.env.local scripts/_dump-parity-gaps.ts
 */
import { prisma } from '../lib/prisma'
import { productTranslations } from '../data/productTranslations'
import { productTranslationsRu } from '../data/productTranslationsRu'

type Bag = Record<string, string | null | undefined>

const TARGETS: Array<[string, 'AR' | 'RU', 'ingredients' | 'benefits' | 'keyFeatures']> = [
  ['2', 'RU', 'benefits'],
  ['9', 'AR', 'ingredients'],
  ['9', 'RU', 'ingredients'],
  ['12', 'AR', 'benefits'],
  ['17', 'AR', 'benefits'],
  ['19', 'RU', 'ingredients'],
  ['24', 'AR', 'benefits'],
  ['24', 'RU', 'ingredients'],
  ['26', 'AR', 'benefits'],
  ['26', 'RU', 'ingredients'],
  ['27', 'RU', 'ingredients'],
  ['33', 'RU', 'ingredients'],
  ['38', 'AR', 'ingredients'],
  ['38', 'AR', 'benefits'],
  ['38', 'RU', 'ingredients'],
  ['43', 'AR', 'ingredients'],
  ['43', 'RU', 'ingredients'],
  ['46', 'AR', 'ingredients'],
  ['46', 'RU', 'ingredients'],
  ['49', 'AR', 'keyFeatures'],
  ['51', 'AR', 'ingredients'],
  ['51', 'RU', 'ingredients'],
  ['63', 'AR', 'ingredients'],
  ['63', 'AR', 'benefits'],
  ['63', 'RU', 'ingredients'],
  ['63', 'RU', 'benefits'],
]

function names(raw: string | null | undefined): string[] {
  if (!raw) return []
  try {
    const v = JSON.parse(raw)
    if (!Array.isArray(v)) return []
    return v.map((i) =>
      typeof i === 'string' ? i.slice(0, 70) : String((i as Record<string, unknown>)?.name ?? JSON.stringify(i)).slice(0, 70),
    )
  } catch {
    return ['<<UNPARSEABLE>>']
  }
}

async function main() {
  const seen = new Set<string>()
  for (const [key, locale, field] of TARGETS) {
    const dedupe = `${key}|${locale}|${field}`
    if (seen.has(dedupe)) continue
    seen.add(dedupe)

    const p = await prisma.product.findFirst({ where: { OR: [{ productNumber: key }, { id: key }] } })
    if (!p) {
      console.log(`\n### ${key} ${locale} ${field}: PRODUCT NOT FOUND`)
      continue
    }
    const row = p as unknown as Record<string, unknown>
    const bag = (locale === 'AR' ? productTranslations[key] : productTranslationsRu[key]) as Bag | undefined

    const en = names(row[field] as string | null)
    const loc = names(bag?.[field])

    console.log(`\n### ${key} ${locale} ${field} — ${p.name}`)
    const max = Math.max(en.length, loc.length)
    for (let i = 0; i < max; i++) {
      console.log(`  [${i}] EN: ${en[i] ?? '—'}`)
      console.log(`      ${locale}: ${loc[i] ?? '—'}`)
    }
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
