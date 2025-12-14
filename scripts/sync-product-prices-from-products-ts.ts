/**
 * Sync Product Prices Script (DB <- lib/products.ts)
 *
 * Problem:
 * - Web API (/api/products) uses `lib/products.ts` pricing.
 * - Mobile API (/api/mobile/products) uses DB pricing (prisma.product.price).
 * If the DB is out of sync, mobile will show "wrong" prices vs website.
 *
 * This script compares DB product.price with the canonical price in `lib/products.ts`
 * and (optionally) updates the DB to match.
 *
 * Usage:
 *   npx tsx scripts/sync-product-prices-from-products-ts.ts          # dry-run (prints mismatches)
 *   npx tsx scripts/sync-product-prices-from-products-ts.ts --apply  # apply updates
 */
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import { prisma } from '../lib/prisma'
import { products as canonicalProducts } from '../lib/products'

function num(x: unknown): number | null {
  const n = Number(x)
  return Number.isFinite(n) ? n : null
}

function absDiff(a: number, b: number) {
  return Math.abs(a - b)
}

async function main(apply: boolean) {
  const expectedById = new Map<string, number>()
  for (const p of canonicalProducts as any[]) {
    const id = String(p?.id ?? '')
    const price = num(p?.price)
    if (id && price !== null) expectedById.set(id, price)
  }

  const dbProducts = await prisma.product.findMany({
    where: { isHidden: false },
    select: {
      id: true,
      productNumber: true,
      name: true,
      price: true,
      category: true,
    },
    orderBy: { name: 'asc' },
  })

  const mismatches: Array<{
    dbId: string
    productNumber: string | null
    name: string
    category: string | null
    current: number
    expected: number
  }> = []

  for (const p of dbProducts) {
    const key = String(p.productNumber || p.id)
    const expected = expectedById.get(key)
    const current = num(p.price)
    if (expected === undefined || current === null) continue
    if (absDiff(current, expected) > 0.01) {
      mismatches.push({
        dbId: p.id,
        productNumber: p.productNumber,
        name: p.name,
        category: p.category ?? null,
        current,
        expected,
      })
    }
  }

  console.log(`DB products checked: ${dbProducts.length}`)
  console.log(`Canonical products loaded: ${expectedById.size}`)
  console.log(`Price mismatches: ${mismatches.length}`)

  for (const m of mismatches.slice(0, 80)) {
    console.log(
      `${m.productNumber || m.dbId}\t${m.category || ''}\t${m.name}\tDB=${m.current}\tEXPECTED=${m.expected}\tDIFF=${(m.current - m.expected).toFixed(2)}`
    )
  }

  if (!apply) {
    console.log('\nDRY RUN. To apply updates: npx tsx scripts/sync-product-prices-from-products-ts.ts --apply')
    return
  }

  console.log('\nApplying updates...\n')
  let updated = 0
  for (const m of mismatches) {
    await prisma.product.update({
      where: { id: m.dbId },
      data: { price: m.expected },
    })
    updated++
  }
  console.log(`✅ Updated ${updated} products.`)
}

const apply = process.argv.slice(2).includes('--apply')

main(apply)
  .then(async () => {
    await prisma.$disconnect()
    process.exit(0)
  })
  .catch(async (err) => {
    console.error('❌ Sync failed:', err)
    await prisma.$disconnect()
    process.exit(1)
  })
