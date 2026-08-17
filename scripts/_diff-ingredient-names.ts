/** Side-by-side ingredient NAME lists for the products whose locale lists diverge. */
import { prisma } from '../lib/prisma'
import { productTranslations } from '../data/productTranslations'
import { productTranslationsRu } from '../data/productTranslationsRu'
import { isFullInciEntry } from '../lib/localizedIngredients'

const NUMS = ['9', '19', '24', '26', '27', '33', '41', '42', '43', '45', '52', '53']

type Item = { name?: string; description?: string }
const parse = (s: unknown): Item[] | null => {
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
    const en = parse((p as unknown as Record<string, unknown>).ingredients) ?? []
    const ar = parse((productTranslations[num] as Record<string, unknown> | undefined)?.ingredients) ?? []
    const ru = parse((productTranslationsRu[num] as Record<string, unknown> | undefined)?.ingredients) ?? []

    const enReal = en.filter((i) => !isFullInciEntry(i.name))
    console.log(`\n===== ${num} ${p.name} =====`)
    console.log(`EN real=${enReal.length} (+inci:${en.length !== enReal.length})  AR=${ar.length}  RU=${ru.length}`)
    const rows = Math.max(enReal.length, ar.length, ru.length)
    for (let i = 0; i < rows; i++) {
      const e = (enReal[i]?.name ?? '—').slice(0, 34)
      const a = (ar[i]?.name ?? '—').slice(0, 30)
      const r = (ru[i]?.name ?? '—').slice(0, 30)
      console.log(`  ${String(i + 1).padStart(2)} EN:${e.padEnd(34)} AR:${a.padEnd(30)} RU:${r}`)
    }
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
