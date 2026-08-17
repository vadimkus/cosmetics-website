/** Diagnostic: why does findFirst({productNumber:'2'}) miss? Read-only. */
import { prisma } from '../lib/prisma'

async function main() {
  const all = await prisma.product.findMany({ select: { id: true, productNumber: true, name: true } })
  const interesting = all.filter((p) => ['2', '23', '42', '62', '64'].includes(String(p.productNumber ?? '').trim()))
  for (const p of interesting) {
    const pn = p.productNumber
    console.log(
      `id=${p.id} | productNumber=${JSON.stringify(pn)} | len=${String(pn ?? '').length} | codes=[${String(pn ?? '')
        .split('')
        .map((c) => c.charCodeAt(0))
        .join(',')}] | ${p.name}`,
    )
  }
  console.log('\n--- direct lookups ---')
  for (const key of ['2', '23', '42', '62']) {
    const hit = await prisma.product.findFirst({ where: { productNumber: key }, select: { id: true, name: true } })
    console.log(`findFirst('${key}') -> ${hit ? hit.name : 'NULL'}`)
  }
  console.log('\n--- duplicates check ---')
  const counts = new Map<string, number>()
  for (const p of all) {
    const k = String(p.productNumber ?? 'NULL')
    counts.set(k, (counts.get(k) || 0) + 1)
  }
  const dupes = [...counts.entries()].filter(([, n]) => n > 1)
  console.log(dupes.length ? JSON.stringify(dupes) : 'no duplicate productNumbers')
  console.log(`total products: ${all.length}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
