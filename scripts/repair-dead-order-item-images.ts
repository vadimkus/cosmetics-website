/**
 * Audit and repair order-item images whose local /images/* asset no longer
 * exists. The replacement is the product's current canonical DB image.
 *
 * Dry run:
 *   npx tsx --env-file=.env.local scripts/repair-dead-order-item-images.ts
 *
 * Apply:
 *   npx tsx --env-file=.env.local scripts/repair-dead-order-item-images.ts --apply
 */
import fs from 'node:fs'
import path from 'node:path'
import { prisma } from '../lib/prisma'

const PUBLIC_DIR = path.resolve(process.cwd(), 'public')
const OWN_HOSTS = new Set(['genosys.ae', 'www.genosys.ae'])

function localAssetPath(value: string): string | null {
  const image = value.trim()
  if (!image) return null
  if (image.startsWith('/')) return image.split(/[?#]/, 1)[0]
  try {
    const url = new URL(image)
    return OWN_HOSTS.has(url.hostname.toLowerCase()) ? url.pathname : null
  } catch {
    return null
  }
}

function assetExists(image: string): boolean {
  const local = localAssetPath(image)
  if (!local) return true // External CDN URL; do not mutate without an HTTP audit.
  return fs.existsSync(path.join(PUBLIC_DIR, local.replace(/^\/+/, '')))
}

function normalizeName(value: string): string {
  return value
    .replace(/\s*\(FREE\)\s*/gi, ' ')
    .replace(/[^a-z0-9]+/gi, ' ')
    .trim()
    .toLowerCase()
}

async function main() {
  const [products, orderItems] = await Promise.all([
    prisma.product.findMany({
      select: { id: true, productNumber: true, name: true, image: true },
    }),
    prisma.orderItem.findMany({
      select: { id: true, productId: true, productName: true, image: true },
    }),
  ])

  const productByKey = new Map<string, (typeof products)[number]>()
  const productByName = new Map<string, (typeof products)[number]>()
  for (const product of products) {
    productByKey.set(product.id, product)
    if (product.productNumber) productByKey.set(product.productNumber, product)
    productByName.set(normalizeName(product.name), product)
  }

  const repairs: Array<{
    id: string
    productName: string
    oldImage: string
    newImage: string
  }> = []
  const unresolved: Array<{ id: string; productName: string; image: string; reason: string }> = []

  for (const item of orderItems) {
    const oldImage = String(item.image || '').trim()
    const local = localAssetPath(oldImage)
    if (!local || assetExists(oldImage)) continue

    const product =
      productByKey.get(String(item.productId || '').trim()) ||
      productByName.get(normalizeName(item.productName))

    if (!product) {
      unresolved.push({ ...item, image: oldImage, reason: 'product not found' })
      continue
    }

    const newImage = String(product.image || '').trim()
    if (!newImage || !assetExists(newImage)) {
      unresolved.push({
        ...item,
        image: oldImage,
        reason: `canonical image unavailable: ${newImage || '(empty)'}`,
      })
      continue
    }

    repairs.push({ id: item.id, productName: item.productName, oldImage, newImage })
  }

  const grouped = new Map<string, { oldImage: string; newImage: string; count: number }>()
  for (const repair of repairs) {
    const key = `${repair.oldImage}\n${repair.newImage}`
    const row = grouped.get(key)
    if (row) row.count += 1
    else grouped.set(key, { oldImage: repair.oldImage, newImage: repair.newImage, count: 1 })
  }

  console.log(`Products scanned: ${products.length}`)
  console.log(`Order items scanned: ${orderItems.length}`)
  console.log(`Dead local image rows repairable: ${repairs.length}`)
  for (const row of [...grouped.values()].sort((a, b) => b.count - a.count)) {
    console.log(`  ${row.count} × ${row.oldImage} -> ${row.newImage}`)
  }
  console.log(`Unresolved dead local image rows: ${unresolved.length}`)
  for (const row of unresolved.slice(0, 20)) {
    console.log(`  ${row.id} | ${row.productName} | ${row.image} | ${row.reason}`)
  }

  if (!process.argv.includes('--apply')) {
    console.log('DRY RUN — pass --apply to update repairable rows')
    return
  }

  // Accelerate/proxy connections can expire multi-statement transactions at
  // five seconds. One updateMany per small ID chunk is both atomic and fast.
  const chunkSize = 25
  for (let i = 0; i < repairs.length; i += chunkSize) {
    const chunk = repairs.slice(i, i + chunkSize)
    const byImage = new Map<string, string[]>()
    for (const repair of chunk) {
      const ids = byImage.get(repair.newImage) || []
      ids.push(repair.id)
      byImage.set(repair.newImage, ids)
    }
    for (const [newImage, ids] of byImage) {
      await prisma.orderItem.updateMany({
        where: { id: { in: ids } },
        data: { image: newImage },
      })
    }
  }
  console.log(`UPDATED ${repairs.length} order-item image rows`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
