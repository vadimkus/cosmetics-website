/**
 * Compare Olga Lysenko website vs MoySklad addresses for GENCardM2609016564.
 *   npx tsx --env-file=.env.local scripts/inspect-olga-lysenko-address-20260901.ts
 */

import { prisma } from '../lib/prisma'

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD
if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}
const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')

async function api(method: string, pathStr: string) {
  const url = pathStr.startsWith('http') ? pathStr : API + pathStr
  const res = await fetch(url, {
    method,
    headers: { Authorization: AUTH, Accept: 'application/json;charset=utf-8', 'Accept-Encoding': 'gzip' },
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`HTTP ${res.status} ${pathStr} — ${text.slice(0, 800)}`)
  return text ? JSON.parse(text) : null
}

function dumpAddr(label: string, doc: any) {
  const f = doc.shipmentAddressFull || doc.actualAddressFull || {}
  console.log(`\n--- ${label} ---`)
  console.log(`  name: ${doc.name}`)
  console.log(`  id: ${doc.id}`)
  console.log(`  shipmentAddress: ${doc.shipmentAddress || '—'}`)
  console.log(`  actualAddress: ${doc.actualAddress || '—'}`)
  console.log(`  city: ${f.city || '—'}`)
  console.log(`  street: ${f.street || '—'}`)
  console.log(`  addInfo: ${f.addInfo || '—'}`)
  console.log(`  comment: ${f.comment || '—'}`)
}

async function main() {
  const order = await prisma.order.findFirst({
    where: {
      OR: [
        { orderNumber: { contains: '2609016564', mode: 'insensitive' } },
        { customerEmail: { equals: 'olgalita888@gmail.com', mode: 'insensitive' } },
      ],
    },
    orderBy: { createdAt: 'desc' },
    include: { items: true, customer: { include: { addresses: true } } },
  })

  console.log('========== WEBSITE ==========')
  if (!order) {
    console.log('Order not found')
  } else {
    console.log(`orderNumber: ${order.orderNumber}`)
    console.log(`id: ${order.id}`)
    console.log(`status: ${order.status} payment: ${order.paymentMethod} ${order.paymentStatus}`)
    console.log(`created: ${order.createdAt.toISOString()}`)
    console.log(`customerName: ${order.customerName}`)
    console.log(`email: ${order.customerEmail}`)
    console.log(`phone: ${order.customerPhone}`)
    console.log(`order.customerEmirate: ${order.customerEmirate}`)
    console.log(`order.customerAddress: ${order.customerAddress}`)
    console.log(`user.address (legacy): ${order.customer.address || '—'}`)
    console.log(`user.phone: ${order.customer.phone || '—'}`)
    console.log(`moySkladOrderId: ${order.moySkladOrderId || '—'}`)
    console.log(`moySkladSyncedAt: ${order.moySkladSyncedAt?.toISOString() || '—'}`)
    for (const a of order.customer.addresses || []) {
      console.log(
        `  saved addr ${a.id} default=${a.isDefault}: ${a.addressLine1} | ${a.addressLine2 || ''} | ${a.emirate}`,
      )
    }
    const recent = await prisma.order.findMany({
      where: { customerEmail: { equals: 'olgalita888@gmail.com', mode: 'insensitive' } },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: { orderNumber: true, createdAt: true, customerAddress: true, customerEmirate: true, status: true },
    })
    console.log('\nPrior website orders:')
    for (const o of recent) {
      console.log(
        `  ${o.orderNumber} ${o.createdAt.toISOString().slice(0, 10)} ${o.status} | ${o.customerEmirate} | ${o.customerAddress}`,
      )
    }
  }

  console.log('\n========== MOYSKLAD ==========')
  let so: any = null
  if (order?.moySkladOrderId) {
    so = await api('GET', `/entity/customerorder/${order.moySkladOrderId}`)
  }
  if (!so) {
    for (const name of ['GENCardM2609016564', 'GENcardM2609016564']) {
      const d = await api('GET', `/entity/customerorder?filter=name=${encodeURIComponent(name)}&limit=5`)
      if (d.rows?.length) {
        so = d.rows[0]
        break
      }
    }
  }

  const searches = [
    `/entity/counterparty?search=${encodeURIComponent('olgalita888@gmail.com')}&limit=10`,
    `/entity/counterparty?filter=phone=${encodeURIComponent('+971585602388')}&limit=10`,
    `/entity/counterparty?filter=phone=${encodeURIComponent('0585602388')}&limit=10`,
    `/entity/counterparty?search=${encodeURIComponent('Olga Lysenko')}&limit=10`,
  ]
  const seen = new Set<string>()
  for (const q of searches) {
    const rows = (await api('GET', q)).rows || []
    for (const cp of rows) {
      if (seen.has(cp.id)) continue
      seen.add(cp.id)
      const full = await api('GET', `/entity/counterparty/${cp.id}`)
      dumpAddr(`COUNTERPARTY ${full.name} ${full.phone || ''} ${full.email || ''}`, full)
    }
  }

  if (so) {
    const fullSo = await api('GET', `/entity/customerorder/${so.id}?expand=agent`)
    dumpAddr(`SO ${fullSo.name}`, fullSo)
    console.log(`  agent: ${fullSo.agent?.name} ${fullSo.agent?.id}`)
    console.log(`  description: ${fullSo.description || '—'}`)

    const invoices = await api(
      'GET',
      `/entity/invoiceout?filter=customerOrder=${API}/entity/customerorder/${so.id}&limit=10`,
    )
    for (const inv of invoices.rows || []) {
      dumpAddr(`INV ${inv.name}`, await api('GET', `/entity/invoiceout/${inv.id}`))
    }

    const demands = await api(
      'GET',
      `/entity/demand?filter=customerOrder=${API}/entity/customerorder/${so.id}&limit=10`,
    )
    const demands2 = await api('GET', `/entity/demand?search=${encodeURIComponent(fullSo.name)}&limit=10`)
    const dseen = new Set<string>()
    for (const d of [...(demands.rows || []), ...(demands2.rows || [])]) {
      if (dseen.has(d.id)) continue
      dseen.add(d.id)
      const f = await api('GET', `/entity/demand/${d.id}`)
      dumpAddr(`SHIP ${f.name}`, f)
      console.log(`  description: ${f.description || '—'}`)
      console.log(`  customerOrder: ${f.customerOrder ? 'YES' : 'no'}`)
    }
  } else {
    console.log('SO not found')
  }

  await prisma.$disconnect()
}

main().catch((e) => {
  console.error('FATAL:', e)
  process.exit(1)
})
