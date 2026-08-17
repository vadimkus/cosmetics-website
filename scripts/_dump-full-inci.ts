/**
 * Prints the English ingredient objects in full (including the Full INCI row)
 * for the products whose localised lists diverge, so claims can be checked
 * against the declared INCI before any copy is written.
 *
 * Usage: npx tsx --env-file=.env.local scripts/_dump-full-inci.ts 43 46 51
 */
import { prisma } from '../lib/prisma'

const keys = process.argv.slice(2).filter((a) => !a.startsWith('-'))

async function main() {
  for (const key of keys) {
    const p = await prisma.product.findFirst({ where: { OR: [{ productNumber: key }, { id: key }] } })
    if (!p) {
      console.log(`\n### ${key}: NOT FOUND`)
      continue
    }
    const row = p as unknown as Record<string, unknown>
    console.log(`\n\n======== ${key} — ${p.name} ========`)
    for (const field of ['ingredients', 'benefits'] as const) {
      const raw = row[field] as string | null
      console.log(`\n-- ${field} --`)
      if (!raw) {
        console.log('  (empty)')
        continue
      }
      try {
        const v = JSON.parse(raw)
        if (Array.isArray(v)) {
          v.forEach((item, i) => {
            if (typeof item === 'string') console.log(`  [${i}] ${item}`)
            else {
              const o = item as Record<string, unknown>
              console.log(`  [${i}] ${o.name}`)
              console.log(`       ${o.description}`)
            }
          })
        } else console.log(raw)
      } catch {
        console.log(`  <<UNPARSEABLE>> ${raw.slice(0, 300)}`)
      }
    }
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
