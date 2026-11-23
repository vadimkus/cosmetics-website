/**
 * GENCardW2611223311 — Helena Shepiatkova, Stripe. Ultra Shield SPF50 50g (original) + Snow O2 Cleanser 180ml (added per Vadim) + Dubai delivery, 625.
 *
 *   npx tsx --env-file=.env --env-file=.env.local scripts/moysklad-push-helena-shepiatkova-20261123.ts --commit
 */

import fs from 'fs'
import path from 'path'
import { prisma } from '../lib/prisma'
import {
  createMoySkladOrder,
  findMoySkladCustomerOrderByName,
} from '../lib/moysklad'

const COMMIT = process.argv.includes('--commit')
const ORDER_NUMBER = 'GENCardW2611223311'
const RETAIL_TEMPLATE_ID = 'b2cde0a1-ec18-4ea5-ac56-813a26308f10'
const API = 'https://api.moysklad.ru/api/remap/1.2'
const ORDERS_DIR = path.join(process.env.HOME || '', 'Desktop', 'orders')
const PDF_NAME = 'Helena Shepiatkova'

function authHeader() {
  const login = process.env.MOYSKLAD_LOGIN?.trim()
  const password = process.env.MOYSKLAD_PASSWORD?.trim()
  if (!login || !password) throw new Error('MoySklad credentials missing')
  return `Basic ${Buffer.from(`${login}:${password}`).toString('base64')}`
}

function addressForMoySklad(address: string, emirate: string): string {
  const parts = address
    .replace(/\s+/g, ' ')
    .split(',')
    .map((p) => p.trim().replace(/[.\s]+$/g, ''))
    .filter(Boolean)
  const em = emirate.trim().toLowerCase()
  while (parts.length && parts[0].toLowerCase() === em) parts.shift()
  while (parts.length) {
    const last = parts[parts.length - 1].toLowerCase()
    if (last === em || /^(uae|u\.a\.e\.?|united arab emirates)$/.test(last)) {
      parts.pop()
      continue
    }
    break
  }
  return parts.join(', ')
}

async function msGet(pathStr: string) {
  const res = await fetch(pathStr.startsWith('http') ? pathStr : `${API}${pathStr}`, {
    headers: {
      Authorization: authHeader(),
      Accept: 'application/json;charset=utf-8',
    },
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`${res.status} ${text.slice(0, 400)}`)
  return JSON.parse(text)
}

async function exportRetailPdf(invoiceId: string, invoiceName: string) {
  const auth = authHeader()
  const res = await fetch(`${API}/entity/invoiceout/${invoiceId}/export`, {
    method: 'POST',
    headers: {
      Authorization: auth,
      Accept: '*/*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      template: {
        meta: {
          href: `${API}/entity/invoiceout/metadata/customtemplate/${RETAIL_TEMPLATE_ID}`,
          type: 'customtemplate',
          mediaType: 'application/json',
        },
      },
      extension: 'pdf',
    }),
    redirect: 'manual',
  })
  if (res.status !== 303 && res.status !== 302) {
    throw new Error(`Invoice export ${res.status}: ${(await res.text()).slice(0, 400)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export missing Location')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const safe = String(invoiceName || 'invoice').replace(/[^\w.-]+/g, '_')
  const orders = path.join(ORDERS_DIR, `GENOSYS_${PDF_NAME}_${safe}.pdf`)
  const buf = Buffer.from(await pdfRes.arrayBuffer())
  fs.writeFileSync(orders, buf)
  return orders
}

async function exportFromSo(soId: string) {
  const so = await msGet(`/entity/customerorder/${soId}?expand=state,agent`)
  const invHref = so.invoicesOut?.[0]?.meta?.href
  if (!invHref) {
    console.log('  No invoice on SO')
    return
  }
  const inv = await msGet(`${invHref}?expand=positions.assortment`)
  const pdf = await exportRetailPdf(inv.id, inv.name)
  for (const p of inv.positions?.rows || []) {
    console.log(`  POS ${p.assortment?.name} qty ${p.quantity} price ${p.price / 100} disc ${p.discount}`)
  }
  const demandHref = inv.demands?.[0]?.meta?.href
  let shipName = 'none'
  let payName = 'none'
  if (demandHref) {
    const demand = await msGet(`${demandHref}?expand=payments`)
    shipName = `${demand.name} ${demand.id} co=${demand.customerOrder ? 'yes' : 'no'}`
    const pay = demand.payments?.[0]
    if (pay?.meta?.href) {
      const payment = await msGet(pay.meta.href)
      payName = `${payment.name} ${payment.id} ${payment.sum / 100}`
    }
  }
  console.log(`  AGENT:     ${so.agent?.name || ''} ${so.agent?.id || ''}`)
  console.log(`  SO:        ${so.name} ${soId} ${so.state?.name || ''}`)
  console.log(`  ADDR:      ${so.shipmentAddress || ''}`)
  console.log(`  Invoice:   ${inv.name} ${inv.id} sum ${inv.sum / 100}`)
  console.log(`  Shipment:  ${shipName}`)
  console.log(`  Payment:   ${payName}`)
  console.log(`  PDF: ${pdf}`)
}

async function main() {
  const order = await prisma.order.findUnique({
    where: { orderNumber: ORDER_NUMBER },
    include: { items: true },
  })
  if (!order) throw new Error(`Order not found: ${ORDER_NUMBER}`)

  const existingSo = await findMoySkladCustomerOrderByName(ORDER_NUMBER)
  const address = 'Grove by Iman, apartment 610, 6th Floor, Dubai Hills'

  console.log('====================================================================')
  console.log(`  ${order.customerName} — ${ORDER_NUMBER}`)
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log('====================================================================')
  console.log(`  ${order.customerName} | ${order.customerEmail} | ${order.customerPhone}`)
  console.log(`  ${order.customerAddress} | ${order.customerEmirate}`)
  console.log(`  Address for MoySklad: ${address}`)
  console.log(`  Total ${order.total} | ship ${order.shipping} | loyalty ${order.loyaltyDiscountAmount}`)
  console.log(`  ${order.paymentMethod} ${order.paymentStatus}`)
  for (const item of order.items) {
    console.log(`  ITEM ${item.productName} | size ${item.size || '-'} | qty ${item.quantity} | price ${item.price}`)
  }
  console.log(`  Website moySkladOrderId: ${order.moySkladOrderId || 'null'}`)
  console.log(`  MoySklad SO by name: ${existingSo ? existingSo.id : 'none'}`)

  if (order.moySkladOrderId || existingSo) {
    console.log('\n  Already in MoySklad — no second push')
    const soId = order.moySkladOrderId || existingSo?.id
    if (COMMIT && existingSo && !order.moySkladOrderId) {
      await prisma.order.update({
        where: { id: order.id },
        data: { moySkladOrderId: existingSo.id, moySkladSyncedAt: new Date() },
      })
    }
    if (COMMIT && soId) await exportFromSo(soId)
    return
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const result = await createMoySkladOrder({
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerPhone: order.customerPhone || '',
    customerAddress: address,
    customerEmirate: order.customerEmirate || '',
    items: order.items.map((item) => ({
      productName: item.productName,
      quantity: item.quantity,
      price: item.price,
      ...(Number(item.price || 0) === 0 ? { discountPercent: 100 } : {}),
      color: item.color,
      size: item.size,
    })),
    total: order.total,
    shipping: order.shipping || 0,
    loyaltyDiscountAmount: order.loyaltyDiscountAmount || 0,
    loyaltyPointsRedeemed: order.loyaltyPointsRedeemed || 0,
    paymentMethod: order.paymentMethod || 'stripe',
    paymentStatus: order.paymentStatus || 'paid',
    description: order.orderNotes || undefined,
    orderNotes: order.orderNotes || undefined,
  })
  if (!result.success) throw new Error(result.error || 'MoySklad push failed')

  await prisma.order.update({
    where: { id: order.id },
    data: {
      moySkladOrderId: result.moySkladOrderId ?? null,
      moySkladSyncedAt: new Date(),
    },
  })

  console.log(`  Paymentin: ${result.moySkladPaymentInId || 'none'}`)
  console.log(`  Invoice id: ${result.moySkladInvoiceId || 'none'}`)
  console.log(`  Demand id: ${result.moySkladDemandId || 'none'}`)
  if (result.moySkladOrderId) await exportFromSo(result.moySkladOrderId)
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
