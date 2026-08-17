#!/usr/bin/env node

/**
 * BELLECHIK SO GENCardM260723BLCH amend:
 *   - Hair Solution Pro Box (00048) → qty 3 @ 370 = 1,110 AED
 *   - Remove Excellent Delivery Dubai
 *   - Refresh proforma PDF in ~/Desktop/orders/
 *
 *   node --import dotenv/config scripts/moysklad-amend-bellechik-hair-solution-qty-20260723.js
 *   node --import dotenv/config scripts/moysklad-amend-bellechik-hair-solution-qty-20260723.js --commit
 */

const fs = require('fs')
const path = require('path')
const os = require('os')

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const ORDER_ID = 'd2189bc5-8683-11f1-0a80-105f0017c014'
const ORDER_NAME = 'GENCardM260723BLCH'
const PRODUCT_CODE = '00048'
const QTY = 3
const UNIT_AED = 370
const EXPECTED_SUM_MINOR = QTY * UNIT_AED * 100 // 111000
const DELIVERY_SERVICE_ID = 'a97cfeeb-814e-11ea-0a80-004a001516bd'
const ORDER_PROFORMA_TEMPLATE_ID = '80b38aad-4f55-4bd8-a4a4-d8ed5bf69d2f'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')

async function api(method, pathStr, body) {
  const res = await fetch(pathStr.startsWith('http') ? pathStr : API + pathStr, {
    method,
    headers: {
      Authorization: AUTH,
      Accept: 'application/json;charset=utf-8',
      'Accept-Encoding': 'gzip',
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1600)}`)
  return text ? JSON.parse(text) : null
}

async function fetchAll(pathStr) {
  const rows = []
  let offset = 0
  while (true) {
    const sep = pathStr.includes('?') ? '&' : '?'
    const data = await api('GET', `${pathStr}${sep}limit=1000&offset=${offset}`)
    rows.push(...(data.rows || []))
    if ((data.rows || []).length < 1000) break
    offset += 1000
  }
  return rows
}

async function exportOrderPdf(orderId) {
  const body = {
    template: {
      meta: {
        href: `${API}/entity/customerorder/metadata/customtemplate/${ORDER_PROFORMA_TEMPLATE_ID}`,
        type: 'customtemplate',
        mediaType: 'application/json',
      },
    },
    extension: 'pdf',
  }
  const res = await fetch(`${API}/entity/customerorder/${orderId}/export`, {
    method: 'POST',
    headers: { Authorization: AUTH, Accept: '*/*', 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    redirect: 'manual',
  })
  if (res.status !== 303 && res.status !== 302) {
    throw new Error(`Export ${res.status}: ${(await res.text()).slice(0, 600)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export missing Location')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  return Buffer.from(await pdfRes.arrayBuffer())
}

function assortmentId(pos) {
  const href = pos.assortment?.meta?.href || ''
  return href.split('/').pop()?.split('?')[0] || ''
}

async function main() {
  console.log('====================================================================')
  console.log('  BELLECHIK — amend SO: 3× Hair Solution, no delivery')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}\n`)

  const order = await api('GET', `/entity/customerorder/${ORDER_ID}`)
  console.log(`  Order: ${order.name} | sum now ${(order.sum || 0) / 100} AED`)

  const positions = await fetchAll(
    `/entity/customerorder/${ORDER_ID}/positions?expand=assortment`,
  )

  let productPos = null
  const deliveryPos = []

  for (const p of positions) {
    const code = p.assortment?.code || ''
    const id = assortmentId(p)
    const name = p.assortment?.name || ''
    console.log(`  line: ${code || id.slice(0, 8)} | qty=${p.quantity} | price=${(p.price || 0) / 100} | ${name}`)

    if (code === PRODUCT_CODE || (name || '').toLowerCase().includes('hair solution')) {
      productPos = p
    } else if (id === DELIVERY_SERVICE_ID || /delivery/i.test(name)) {
      deliveryPos.push(p)
    }
  }

  if (!productPos) throw new Error('Hair Solution position not found on order')

  console.log(`\n  Plan: qty ${productPos.quantity} → ${QTY} @ ${UNIT_AED}`)
  console.log(`  Plan: delete delivery lines: ${deliveryPos.length}`)
  console.log(`  Expected total: ${EXPECTED_SUM_MINOR / 100} AED`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  await api('PUT', `/entity/customerorder/${ORDER_ID}/positions/${productPos.id}`, {
    quantity: QTY,
    price: UNIT_AED * 100,
    discount: 0,
  })
  console.log('  Product qty updated')

  for (const d of deliveryPos) {
    await api('DELETE', `/entity/customerorder/${ORDER_ID}/positions/${d.id}`)
    console.log(`  Deleted delivery position ${d.id}`)
  }

  await api('PUT', `/entity/customerorder/${ORDER_ID}`, {
    meta: order.meta,
    description: [
      order.description || '',
      `Amended ${new Date().toISOString().slice(0, 10)}: 00048 Hair Solution Pro Box x${QTY} @${UNIT_AED}; delivery removed. Total ${EXPECTED_SUM_MINOR / 100} AED.`,
    ]
      .filter(Boolean)
      .join(' | '),
  })

  const refreshed = await api('GET', `/entity/customerorder/${ORDER_ID}`)
  const sumMinor = refreshed.sum || 0
  console.log(`\n  New sum: ${sumMinor / 100} AED (expected ${EXPECTED_SUM_MINOR / 100})`)
  if (sumMinor !== EXPECTED_SUM_MINOR) {
    throw new Error(`Sum mismatch: got ${sumMinor}, expected ${EXPECTED_SUM_MINOR}`)
  }

  const buf = await exportOrderPdf(ORDER_ID)
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const pdfPath = path.join(ORDERS_DIR, `GENOSYS_BELLECHIK_${ORDER_NAME}.pdf`)
  fs.writeFileSync(pdfPath, buf)
  console.log(`  PDF updated: ${pdfPath}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
