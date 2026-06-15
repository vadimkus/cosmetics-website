/**
 * One-off: rename product 64 from "HairStamp For HAIRGEN BOOSTER" to
 * "Hair Stamp For HAIRGEN BOOSTER".
 * Usage: npx tsx scripts/rename-product-64-20260615.ts
 */
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
if (!process.env.DATABASE_URL && !process.env.PRISMA_DATABASE_URL) {
  dotenv.config({ path: path.resolve(process.cwd(), '.env') })
}

const NEW_NAME = 'Hair Stamp For HAIRGEN BOOSTER'

async function main() {
  const { prisma } = await import('../lib/prisma')
  const before = await prisma.product.findFirst({
    where: { productNumber: '64' },
    select: { id: true, name: true },
  })
  if (!before) throw new Error('Product 64 not found')
  console.log('BEFORE:', before)

  const after = await prisma.product.update({
    where: { id: before.id },
    data: { name: NEW_NAME },
    select: { id: true, name: true },
  })
  console.log('AFTER:', after)
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1) })
