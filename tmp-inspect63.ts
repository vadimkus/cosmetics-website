import { prisma } from '@/lib/prisma'

async function main() {
  const prod = await prisma.product.findFirst({ where: { productNumber: '63' } })
  if (!prod) {
    console.log('product 63 not found')
    return
  }
  console.log(JSON.stringify(prod, null, 2))
}

main().finally(() => process.exit(0))
