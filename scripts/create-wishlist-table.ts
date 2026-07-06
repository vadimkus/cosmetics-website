/**
 * One-shot: create wishlist_items table (DB-backed favorites sync).
 * Uses the direct Postgres connection (POSTGRES_URL) because the pooled
 * Accelerate role lacks DDL permission. Idempotent (IF NOT EXISTS).
 * Run: npx tsx scripts/create-wishlist-table.ts
 */
import { Client } from 'pg'
import { config } from 'dotenv'

config({ path: '.env.local' })
config({ path: '.env' })

const connectionString = process.env.POSTGRES_URL
if (!connectionString) throw new Error('POSTGRES_URL is required')

async function main() {
  const client = new Client({ connectionString })
  await client.connect()
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS "wishlist_items" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "productId" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "wishlist_items_pkey" PRIMARY KEY ("id")
      )
    `)
    await client.query(
      'CREATE UNIQUE INDEX IF NOT EXISTS "wishlist_items_userId_productId_key" ON "wishlist_items"("userId", "productId")'
    )
    await client.query(
      'CREATE INDEX IF NOT EXISTS "wishlist_items_userId_idx" ON "wishlist_items"("userId")'
    )
    const { rows } = await client.query('SELECT COUNT(*)::int AS total FROM "wishlist_items"')
    console.log('wishlist_items table ready:', JSON.stringify(rows[0]))
  } finally {
    await client.end()
  }
}

main()
