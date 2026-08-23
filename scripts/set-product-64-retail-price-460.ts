/**
 * Align Hair Stamp (product 64) retail to MoySklad розничная 460 AED.
 *
 *   npx tsx --env-file=.env.local scripts/set-product-64-retail-price-460.ts
 */
import * as dotenv from 'dotenv'
import * as path from 'path'
import { Pool } from 'pg'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
if (!process.env.DATABASE_URL && !process.env.PRISMA_DATABASE_URL) {
  dotenv.config({ path: path.resolve(process.cwd(), '.env') })
}

const url = [
  process.env.POSTGRES_URL_NON_POOLING,
  process.env.POSTGRES_PRISMA_URL,
  process.env.DATABASE_URL,
  process.env.POSTGRES_URL,
].find((u) => u && /^(postgres|postgresql):\/\//.test(u))

if (!url) throw new Error('No direct Postgres URL')

async function main() {
  const pool = new Pool({
    connectionString: url,
    max: 1,
    connectionTimeoutMillis: 20000,
    ssl: { rejectUnauthorized: false },
  })
  try {
    const before = await pool.query(
      'SELECT id, name, price FROM products WHERE "productNumber" = $1',
      ['64'],
    )
    if (!before.rows[0]) throw new Error('Product 64 not found')
    console.log('BEFORE:', before.rows[0])

    const after = await pool.query(
      'UPDATE products SET price = 460, "updatedAt" = NOW() WHERE "productNumber" = $1 RETURNING id, name, price',
      ['64'],
    )
    console.log('AFTER:', after.rows[0])
  } finally {
    await pool.end()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
