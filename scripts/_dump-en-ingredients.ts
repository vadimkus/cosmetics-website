/** Dumps EN ingredient name+description plus current AR strings for the 8 broken products. */
import { prisma } from '../lib/prisma'
import { productTranslations } from '../data/productTranslations'
import { isFullInciEntry } from '../lib/localizedIngredients'

const NUMS = ['41', '42', '43', '45', '52', '53']

const parse = (s: unknown): unknown[] | null => {
  if (typeof s !== 'string' || !s.trim()) return null
  try {
    const v = JSON.parse(s)
    return Array.isArray(v) ? v : null
  } catch {
    return null
  }
}

async function main() {
  for (const num of NUMS) {
    const p = await prisma.product.findFirst({ where: { OR: [{ productNumber: num }, { id: num }] } })
    if (!p) continue
    const en = (parse((p as unknown as Record<string, unknown>).ingredients) ?? []) as Array<{ name?: string; description?: string }>
    const ar = (parse((productTranslations[num] as Record<string, unknown> | undefined)?.ingredients) ?? []) as unknown[]

    console.log(`\n\n########## ${num} — ${p.name} ##########`)
    console.log(`--- EN items (${en.filter((i) => !isFullInciEntry(i.name)).length} real) ---`)
    en.forEach((i, idx) => {
      if (false) {
        console.log(`${idx + 1}. [FULL INCI — handled by fallback]`)
        return
      }
      console.log(`${idx + 1}. ${i.name}\n    ${i.description}`)
    })
    console.log(`--- current AR strings (${ar.length}) ---`)
    ar.forEach((s, idx) => console.log(`${idx + 1}. ${typeof s === 'string' ? s : JSON.stringify(s)}`))
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
