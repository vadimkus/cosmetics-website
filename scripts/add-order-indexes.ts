/**
 * One-shot: add performance indexes flagged by the DB audit (2026-07-06).
 *   - order_items(productId)        — product-performance report + delete check
 *   - orders(status, createdAt)     — revenue-trends / CLV reports
 *
 * Uses CREATE INDEX CONCURRENTLY (non-blocking, no table lock) via the direct
 * Postgres connection — the pooled Accelerate role lacks DDL permission, and
 * CONCURRENTLY cannot run inside a transaction (pg runs each query on its own).
 * Idempotent (IF NOT EXISTS). Run: npx tsx scripts/add-order-indexes.ts
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
    console.log('Creating order_items_productId_idx (CONCURRENTLY)…')
    await client.query('CREATE INDEX CONCURRENTLY IF NOT EXISTS "order_items_productId_idx" ON "order_items" ("productId")')

    console.log('Creating orders_status_createdAt_idx (CONCURRENTLY)…')
    await client.query('CREATE INDEX CONCURRENTLY IF NOT EXISTS "orders_status_createdAt_idx" ON "orders" ("status", "createdAt")')

    console.log('ANALYZE order_items, orders…')
    await client.query('ANALYZE "order_items"')
    await client.query('ANALYZE "orders"')

    const { rows } = await client.query(
      `SELECT indexname FROM pg_indexes WHERE indexname IN ('order_items_productId_idx','orders_status_createdAt_idx') ORDER BY indexname`
    )
    console.log('Present indexes:', rows.map((r) => r.indexname))
  } finally {
    await client.end()
  }
}

main().then(() => { console.log('Done.'); process.exit(0) }).catch((e) => { console.error(e); process.exit(1) })
