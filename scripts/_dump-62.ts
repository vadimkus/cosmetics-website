/** Diagnostic: full EN record for product 62 to verify box contents. Read-only. */
import { prisma } from '../lib/prisma'

async function main() {
  const p = await prisma.product.findFirst({ where: { OR: [{ productNumber: '62' }, { id: '62' }] } })
  if (!p) throw new Error('not found')
  const r = p as unknown as Record<string, unknown>
  for (const f of ['name', 'description', 'productDetails', 'keyFeatures', 'howToUse', 'directions', 'ingredients']) {
    console.log(`\n----- ${f} -----`)
    console.log(r[f] ?? '(empty)')
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
