/**
 * Trash incomplete PARTW2607160539 MoySklad chain (if any) and re-push
 * Genesis Healthcare Center partner order with peptide pack explosion.
 *
 *   npx tsx --env-file=.env.local scripts/moysklad-repush-partw2607160539-genesis-20260716.ts
 *   npx tsx --env-file=.env.local scripts/moysklad-repush-partw2607160539-genesis-20260716.ts --commit
 */

import { prisma } from '../lib/database'
import {
  createMoySkladOrder,
  findMoySkladCustomerOrderByName,
  isMoySkladEnabled,
  prepareMoySkladOrderForPush,
  trashMoySkladOrderChain,
} from '../lib/moysklad'

const ORDER_NUMBER = 'PARTW2607160539'
const COMMIT = process.argv.includes('--commit')

const API = 'https://api.moysklad.ru/api/remap/1.2'

function authHeader(): string {
  const login = process.env.MOYSKLAD_LOGIN?.trim()
  const password = process.env.MOYSKLAD_PASSWORD?.trim()
  if (!login || !password) throw new Error('MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD missing')
  return 'Basic ' + Buffer.from(`${login}:${password}`).toString('base64')
}

async function api(path: string, method = 'GET', attempt = 1): Promise<{ ok: boolean; status: number; data: any }> {
  try {
    const res = await fetch(API + path, {
      method,
      headers: {
        Authorization: authHeader(),
        Accept: 'application/json;charset=utf-8',
        'Accept-Encoding': 'gzip',
      },
    })
    const text = await res.text()
    if ((res.status === 429 || res.status >= 500) && attempt < 10) {
      await new Promise((r) => setTimeout(r, 1000 * attempt))
      return api(path, method, attempt + 1)
    }
    return { ok: res.ok, status: res.status, data: text ? JSON.parse(text) : null }
  } catch (e) {
    if (attempt < 10) {
      console.warn(`  API retry ${attempt}/10 after network error…`)
      await new Promise((r) => setTimeout(r, 3000 * attempt))
      return api(path, method, attempt + 1)
    }
    throw e
  }
}

/** Force-delete any docs named exactly ORDER_NUMBER (order → invoice → demand → payment). */
async function forceTrashByName(orderNumber: string): Promise<void> {
  const orderRes = await api(
    `/entity/customerorder?filter=name=${encodeURIComponent(orderNumber)}&limit=5`
  )
  const orders = (orderRes.data?.rows || []).filter((r: any) => !r.deleted)
  for (const order of orders) {
    console.log(`  Force-trash chain for SO ${order.name} (${order.id})`)
    const ok = await trashMoySkladOrderChain(order.id)
    console.log(`  trashMoySkladOrderChain: ${ok ? 'OK' : 'FAILED'}`)
    if (!ok) {
      // Manual cascade by name search
      for (const type of ['paymentin', 'demand', 'invoiceout', 'customerorder'] as const) {
        const found = await api(`/entity/${type}?search=${encodeURIComponent(orderNumber)}&limit=50`)
        for (const row of found.data?.rows || []) {
          if (row.deleted) continue
          if (row.name !== orderNumber && type === 'customerorder') continue
          const del = await api(`/entity/${type}/${row.id}`, 'DELETE')
          console.log(`    DELETE ${type} ${row.name}: ${del.status}`)
        }
      }
    }
  }
}

async function main() {
  console.log('====================================================================')
  console.log(`  Re-push ${ORDER_NUMBER} (peptide pack → 00012 ×5)`)
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  if (!isMoySkladEnabled()) throw new Error('MoySklad not configured')

  const order = await prisma.order.findFirst({
    where: { orderNumber: ORDER_NUMBER },
    include: { items: true },
  })
  if (!order) throw new Error(`Order not found in DB: ${ORDER_NUMBER}`)

  console.log(`  DB order id: ${order.id}`)
  console.log(`  Customer: ${order.customerName} <${order.customerEmail}>`)
  console.log(`  Total: ${order.total} AED | items: ${order.items.length}`)
  for (const item of order.items) {
    console.log(
      `    ${item.productName} ×${item.quantity} @ ${item.price}` +
        (item.color ? ` [${item.color}]` : '') +
        (item.size ? ` (${item.size})` : '')
    )
  }

  const orphan = await findMoySkladCustomerOrderByName(ORDER_NUMBER)
  console.log(`  MoySklad orphan SO: ${orphan ? `${orphan.name} ${orphan.id}` : 'none'}`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    await prisma.$disconnect()
    return
  }

  try {
    await forceTrashByName(ORDER_NUMBER)
  } catch (e) {
    console.warn('  forceTrashByName soft-fail:', e instanceof Error ? e.message : e)
  }

  // Clear stale moySkladOrderId so prepare doesn't fight a deleted id
  if (order.moySkladOrderId) {
    await prisma.order.update({
      where: { id: order.id },
      data: { moySkladOrderId: null },
    })
  }

  const prep = await prepareMoySkladOrderForPush(ORDER_NUMBER, null, order.total)
  if (!prep.ok) {
    console.error('  prepare failed:', prep.error)
    try {
      await forceTrashByName(ORDER_NUMBER)
    } catch (e) {
      console.warn('  second forceTrash soft-fail:', e instanceof Error ? e.message : e)
    }
  }

  const freePromoProductIds = order.items
    .filter((item) => Number(item.price || 0) === 0 && item.size === '__PROMO__')
    .map((item) => item.productId)

  const freePromoProducts =
    freePromoProductIds.length > 0
      ? await prisma.product.findMany({
          where: { id: { in: freePromoProductIds } },
          select: { id: true, price: true },
        })
      : []

  const productPriceById = new Map(freePromoProducts.map((p) => [p.id, p.price]))

  const result = await createMoySkladOrder({
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerPhone: order.customerPhone || '',
    customerAddress: order.customerAddress || '',
    customerEmirate: order.customerEmirate || '',
    items: order.items.map((item) => {
      const bundleDiscount = Number(item.bundleDiscount || 0)
      const hasBundleDiscount = bundleDiscount > 0 && bundleDiscount < 100 && Number(item.price || 0) > 0
      const isFreePromo = Number(item.price || 0) === 0 && item.size === '__PROMO__'
      const isBeautyBox = item.productName.toLowerCase().includes('beauty box')
      const retailPrice = isFreePromo
        ? productPriceById.get(item.productId) || item.price
        : hasBundleDiscount || isBeautyBox
          ? Math.round((item.price / (1 - (hasBundleDiscount ? bundleDiscount : 15) / 100)) * 100) / 100
          : item.price

      return {
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
        retailPrice,
        ...(isFreePromo || hasBundleDiscount || isBeautyBox
          ? { discountPercent: isFreePromo ? 100 : hasBundleDiscount ? bundleDiscount : 15 }
          : {}),
        color: item.color,
        size: item.size,
      }
    }),
    total: order.total,
    shipping: order.shipping || 0,
    paymentMethod: order.paymentMethod || 'cod',
    paymentStatus: order.paymentStatus || 'pending',
  })

  if (!result.success) {
    console.error('  PUSH FAILED:', result.error)
    process.exitCode = 1
    await prisma.$disconnect()
    return
  }

  await prisma.order.update({
    where: { id: order.id },
    data: {
      moySkladOrderId: result.moySkladOrderId || null,
      moySkladSyncedAt: new Date(),
    },
  })

  console.log('\n  PUSH OK')
  console.log(`  SO: ${result.moySkladOrderId}`)
  console.log(`  Invoice: ${result.moySkladInvoiceId || '—'}`)
  console.log(`  Demand: ${result.moySkladDemandId || '—'}`)
  console.log(`  Paymentin: ${result.moySkladPaymentInId || '—'}`)

  await prisma.$disconnect()
}

main().catch(async (e) => {
  console.error('FATAL:', e)
  await prisma.$disconnect()
  process.exit(1)
})
