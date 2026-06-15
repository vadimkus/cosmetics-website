/**
 * One-off helper: list existing productNumbers so we can pick the next id.
 * Usage: npx tsx scripts/list-product-numbers.ts
 */
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
if (!process.env.DATABASE_URL && !process.env.PRISMA_DATABASE_URL) {
  dotenv.config({ path: path.resolve(process.cwd(), '.env') })
}

async function main() {
  const { prisma } = await import('../lib/prisma')
  const rows = await prisma.product.findMany({
    select: { id: true, productNumber: true, name: true, category: true },
  })
  const nums = rows
    .map(r => Number(r.productNumber))
    .filter(n => Number.isFinite(n))
    .sort((a, b) => a - b)
  console.log('total products:', rows.length)
  console.log('numeric productNumbers:', nums.join(', '))
  console.log('max productNumber:', nums[nums.length - 1])
  console.log('next free:', (nums[nums.length - 1] ?? 0) + 1)
  const scalp = rows.filter(r => (r.category || '').toLowerCase().includes('scalp'))
  console.log('Scalp/Hair products:', scalp.map(r => `${r.productNumber}:${r.name}`).join(' | '))
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1) })
