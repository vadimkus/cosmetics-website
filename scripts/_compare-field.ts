/**
 * Prints EN / AR / RU side by side for one product field. Read-only diagnostic.
 * Usage: npx tsx --env-file=.env.local scripts/_compare-field.ts <productNumber> <field>
 */
import { prisma } from '../lib/prisma'
import { productTranslations } from '../data/productTranslations'
import { productTranslationsRu } from '../data/productTranslationsRu'

const num = process.argv[2]
const field = process.argv[3] || 'ingredients'

const show = (label: string, raw: unknown) => {
  console.log(`\n--- ${label} ---`)
  if (typeof raw !== 'string' || !raw.trim()) {
    console.log('(empty)')
    return
  }
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    console.log('[does not parse as JSON]')
    console.log(raw.slice(0, 600))
    return
  }
  if (Array.isArray(parsed)) {
    parsed.forEach((item, i) => {
      if (item && typeof item === 'object') {
        const o = item as Record<string, unknown>
        console.log(`${i + 1}. name=${String(o.name ?? '')} | ${String(o.description ?? '').slice(0, 90)}`)
      } else {
        console.log(`${i + 1}. ${String(item).slice(0, 120)}`)
      }
    })
  } else if (parsed && typeof parsed === 'object') {
    for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
      console.log(`${k}: ${String(v).slice(0, 100)}`)
    }
  } else {
    console.log(String(parsed).slice(0, 600))
  }
}

async function main() {
  const p = await prisma.product.findFirst({ where: { OR: [{ productNumber: num }, { id: num }] } })
  if (!p) throw new Error(`Product ${num} not found`)
  console.log(`Product ${num}: ${p.name}  [field: ${field}]`)
  show('EN (db)', (p as unknown as Record<string, unknown>)[field])
  show('AR (file)', (productTranslations[num] as Record<string, unknown> | undefined)?.[field])
  show('RU (file)', (productTranslationsRu[num] as Record<string, unknown> | undefined)?.[field])
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
