/** Diagnostic: list every product id + productNumber to resolve the key question. */
import { prisma } from '../lib/prisma'

async function main() {
  const all = await prisma.product.findMany({
    select: { id: true, productNumber: true, name: true },
    orderBy: { productNumber: 'asc' },
  })
  console.log(`total=${all.length}\n`)
  all.forEach((p, i) => {
    console.log(`${String(i + 1).padStart(2)} id=${p.id.padEnd(26)} pn=${JSON.stringify(p.productNumber)} ${p.name.slice(0, 40)}`)
  })
  const nulls = all.filter((p) => p.productNumber === null || p.productNumber === undefined)
  console.log(`\nnull productNumber: ${nulls.length}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
