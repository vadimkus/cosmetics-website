/**
 * Dumps the exact English source copy needed to author the missing AR/RU entries,
 * plus the current localised values where they exist. Read-only diagnostic.
 */
import { prisma } from '../lib/prisma'
import { productTranslations } from '../data/productTranslations'
import { productTranslationsRu } from '../data/productTranslationsRu'

const TARGETS: Array<{ num: string; fields: string[]; locales: Array<'AR' | 'RU'> }> = [
  { num: '2', fields: ['description', 'productDetails', 'keyFeatures', 'benefits', 'howToUse', 'directions'], locales: ['RU'] },
  { num: '62', fields: ['benefits', 'howToUse', 'productDetails'], locales: ['AR', 'RU'] },
  { num: '42', fields: ['description', 'productDetails'], locales: ['AR', 'RU'] },
  { num: '23', fields: ['ingredients'], locales: ['AR'] },
]

async function main() {
  for (const t of TARGETS) {
    const p = await prisma.product.findFirst({ where: { OR: [{ productNumber: t.num }, { id: t.num }] } })
    if (!p) {
      console.log(`\n### Product ${t.num} NOT FOUND`)
      continue
    }
    console.log(`\n\n========== PRODUCT ${t.num}: ${p.name} ==========`)
    for (const f of t.fields) {
      const en = (p as unknown as Record<string, unknown>)[f]
      console.log(`\n----- ${f} :: EN -----`)
      console.log(typeof en === 'string' && en.trim() ? en : '(empty)')
      for (const loc of t.locales) {
        const map = loc === 'AR' ? productTranslations : productTranslationsRu
        const v = (map as Record<string, Record<string, unknown>>)[t.num]?.[f]
        console.log(`----- ${f} :: ${loc} (current) -----`)
        console.log(typeof v === 'string' && v.trim() ? v : '(empty)')
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
