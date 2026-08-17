/**
 * Finds localised list fields whose ITEM shape does not match what the renderer
 * expects, which makes them render as blank rows.
 *   ingredients  -> expects { name, description }
 *   keyFeatures  -> expects { title, description }
 *   benefits     -> expects plain strings
 * Read-only.
 */
import { prisma } from '../lib/prisma'
import { productTranslations } from '../data/productTranslations'
import { productTranslationsRu } from '../data/productTranslationsRu'

const parse = (s: unknown): unknown[] | null => {
  if (typeof s !== 'string' || !s.trim()) return null
  try {
    const v = JSON.parse(s)
    return Array.isArray(v) ? v : null
  } catch {
    return null
  }
}

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v)

async function main() {
  const products = await prisma.product.findMany({ orderBy: { productNumber: 'asc' } })
  const problems: string[] = []

  for (const p of products) {
    const key = p.productNumber || p.id
    for (const [locale, map] of [
      ['AR', productTranslations],
      ['RU', productTranslationsRu],
    ] as const) {
      const entry = (map as Record<string, Record<string, unknown>>)[key]
      if (!entry) continue

      // ingredients: every item must be an object with a name
      const ing = parse(entry.ingredients)
      if (ing?.length) {
        const stringItems = ing.filter((i) => typeof i === 'string').length
        const noName = ing.filter((i) => isObj(i) && !i.name).length
        if (stringItems) problems.push(`${key.padStart(3)} ${locale} ingredients  ${stringItems}/${ing.length} items are plain strings -> blank rows | ${p.name.slice(0, 32)}`)
        else if (noName) problems.push(`${key.padStart(3)} ${locale} ingredients  ${noName}/${ing.length} objects lack name | ${p.name.slice(0, 32)}`)
      }

      // keyFeatures: objects with title
      const kf = parse(entry.keyFeatures)
      if (kf?.length) {
        const bad = kf.filter((i) => typeof i === 'string' || (isObj(i) && !i.title)).length
        if (bad) problems.push(`${key.padStart(3)} ${locale} keyFeatures  ${bad}/${kf.length} items lack title | ${p.name.slice(0, 32)}`)
      }

      // benefits: plain strings expected
      const bn = parse(entry.benefits)
      if (bn?.length) {
        const bad = bn.filter((i) => typeof i !== 'string').length
        if (bad) problems.push(`${key.padStart(3)} ${locale} benefits  ${bad}/${bn.length} items are not strings | ${p.name.slice(0, 32)}`)
      }
    }
  }

  console.log(problems.length ? problems.join('\n') : 'no shape problems found')
  console.log(`\ntotal shape problems: ${problems.length}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
