/**
 * Prints English vs localised productDetails key/value pairs so the missing
 * spec rows can be authored with the right wording.
 *
 * Usage: npx tsx --env-file=.env.local scripts/_dump-product-details.ts 60 61 65 66
 */
import { prisma } from '../lib/prisma'
import { productTranslations } from '../data/productTranslations'
import { productTranslationsRu } from '../data/productTranslationsRu'

const keys = process.argv.slice(2).filter((a) => !a.startsWith('-'))

function parse(raw: string | null | undefined): Record<string, string> | null {
  if (!raw) return null
  try {
    const v = JSON.parse(raw)
    return v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, string>) : null
  } catch {
    return null
  }
}

async function main() {
  for (const key of keys) {
    const p = await prisma.product.findFirst({ where: { OR: [{ productNumber: key }, { id: key }] } })
    if (!p) {
      console.log(`\n### ${key}: NOT FOUND`)
      continue
    }
    const row = p as unknown as Record<string, unknown>
    const en = parse(row.productDetails as string | null)
    const ar = parse((productTranslations[key] as Record<string, string | null> | undefined)?.productDetails)
    const ru = parse((productTranslationsRu[key] as Record<string, string | null> | undefined)?.productDetails)

    console.log(`\n\n======== ${key} — ${p.name} ========`)
    const all = new Set([...Object.keys(en ?? {}), ...Object.keys(ar ?? {}), ...Object.keys(ru ?? {})])
    for (const k of all) {
      console.log(`  ${k}`)
      console.log(`    EN: ${en?.[k] ?? '—'}`)
      console.log(`    AR: ${ar?.[k] ?? '—'}`)
      console.log(`    RU: ${ru?.[k] ?? '—'}`)
    }
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
