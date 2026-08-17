import { prisma } from '../lib/prisma'
async function main() {
  const rows = await prisma.product.findMany({
    where: { OR: [{ productNumber: '10' }, { id: '10' }, { name: { contains: 'SNOW O' } }] },
    select: { id: true, productNumber: true, name: true, ingredients: true },
  })
  for (const p of rows) {
    const cards = JSON.parse(p.ingredients || '[]')
    console.log({ id: p.id, pn: p.productNumber, name: p.name, names: cards.map((c: any) => c.name) })
  }
}
main().finally(() => prisma.$disconnect())
