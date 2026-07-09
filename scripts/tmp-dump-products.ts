import { prisma } from '../lib/prisma'

async function main() {
  const products = await (prisma as any).product.findMany({
    orderBy: { id: 'asc' },
    select: { id: true, productNumber: true, name: true, price: true, category: true, inStock: true, isPriceOnRequest: true, size: true, image: true },
  })
  console.log(JSON.stringify(products, null, 1))
}
main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1) })
