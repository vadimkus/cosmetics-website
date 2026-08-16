import { PrismaClient } from '@prisma/client'

const url = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL || ''
const prisma = new PrismaClient({ accelerateUrl: url } as never)

async function main() {
  const p = await prisma.product.findFirst({
    where: { OR: [{ productNumber: '29' }, { id: '29' }] },
  })
  if (!p) throw new Error('not found')
  for (const [k, v] of Object.entries(p)) {
    console.log(`--- ${k}\n${typeof v === 'string' ? v : JSON.stringify(v)}`)
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
