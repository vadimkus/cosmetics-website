#!/usr/bin/env node

/**
 * Move FOC gifts from presents write-off 00008-00474 back onto PARTW2607160539.
 * Keep cushions only on the write-off.
 *
 *   00013 Hydro Cool ×1 @ 300 clinic 100%
 *   00024 Cleanser 500ml ×1 @ 255 clinic 100%
 *   00025 Snow Booster 1000ml ×1 @ 245 clinic 100%
 *   00011 EZ CO₂ MASK ×1 @ 230 clinic 100%
 *
 *   node --import dotenv/config scripts/moysklad-reclass-genesis-foc-from-writeoff-20260718.js
 *   node --import dotenv/config scripts/moysklad-reclass-genesis-foc-from-writeoff-20260718.js --commit
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const LOSS_ID = '669325d3-8262-11f1-0a80-0f9b002e7682' // 00008-00474
const ORDER_ID = '361f8c3d-8130-11f1-0a80-0dc40023a524'
const INVOICE_ID = '36623435-8130-11f1-0a80-04d100239d31'
const DEMAND_ID = '36efaf8c-8130-11f1-0a80-0bab00236329'
const EXPECTED_SUM_MINOR = 297000
const EXPECTED_LOSS_MINOR = 15542 // 52+51.42+52 = 155.42

/** [code, productId, clinicAed] */
const FOC = [
  ['00013', '806e9e52-3444-11ea-0a80-05dc00014e2d', 300],
  ['00024', '0a27b901-344a-11ea-0a80-021700017918', 255],
  ['00025', '48952d7e-344a-11ea-0a80-00e50001bb46', 245],
  ['00011', 'f34ed25a-343f-11ea-0a80-05dc0001110e', 230],
]
const FOC_CODES = new Set(FOC.map(([c]) => c))
const CUSHION_CODES = new Set(['54464', '00144', '00143'])

async function api(method, pathStr, body, attempt = 1) {
  const url = pathStr.startsWith('http') ? pathStr : API + pathStr
  try {
    const res = await fetch(url, {
      method,
      headers: {
        Authorization: AUTH,
        Accept: 'application/json;charset=utf-8',
        'Accept-Encoding': 'gzip',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(60000),
    })
    const text = await res.text()
    if ((res.status === 429 || res.status >= 500) && attempt < 8) {
      await new Promise((r) => setTimeout(r, 800 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1600)}`)
    return text ? JSON.parse(text) : null
  } catch (e) {
    const retryable =
      e.cause?.code === 'ECONNRESET' ||
      e.cause?.code === 'UND_ERR_CONNECT_TIMEOUT' ||
      e.name === 'TimeoutError' ||
      e.message === 'fetch failed'
    if (attempt < 8 && retryable) {
      await new Promise((r) => setTimeout(r, 2000 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    throw e
  }
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

function href(type, id) {
  return { meta: { href: `${API}/entity/${type}/${id}`, type, mediaType: 'application/json' } }
}

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

function lineCode(pos) {
  return pos.assortment?.code || ''
}

async function removeFocFromLoss() {
  const rows = await fetchAll(`/entity/loss/${LOSS_ID}/positions?expand=assortment`)
  console.log('  Loss lines now:')
  for (const p of rows) console.log(`    ${lineCode(p)} ×${p.quantity} @ ${money(p.price)}`)

  for (const pos of rows) {
    const code = lineCode(pos)
    if (!FOC_CODES.has(code)) continue
    console.log(`  Loss: delete ${code}`)
    if (COMMIT) await api('DELETE', `/entity/loss/${LOSS_ID}/positions/${pos.id}`)
  }
}

async function addFocToDoc(entityType, docId, label) {
  const rows = await fetchAll(`/entity/${entityType}/${docId}/positions?expand=assortment`)
  const codes = new Set(rows.map(lineCode))
  for (const [code, productId, clinicAed] of FOC) {
    if (codes.has(code)) {
      const existing = rows.find((p) => lineCode(p) === code)
      if (existing?.discount === 100) {
        console.log(`  ${label}: ${code} already FOC — skip`)
        continue
      }
      throw new Error(`${label}: ${code} present but not 100% off`)
    }
    const payload = {
      quantity: 1,
      price: Math.round(clinicAed * 100),
      discount: 100,
      assortment: href('product', productId),
      vat: 5,
      vatEnabled: true,
    }
    console.log(`  ${label}: + ${code} @ ${clinicAed} clinic, 100% off`)
    if (COMMIT) await api('POST', `/entity/${entityType}/${docId}/positions`, payload)
  }
}

async function main() {
  console.log('====================================================================')
  console.log('  Genesis — FOC back on order; cushions stay on write-off')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}\n`)

  console.log('  Step 1 — remove FOC from write-off:')
  await removeFocFromLoss()

  console.log('\n  Step 2 — add FOC to SO / invoice / shipment:')
  await addFocToDoc('customerorder', ORDER_ID, 'Order')
  await addFocToDoc('invoiceout', INVOICE_ID, 'Invoice')
  await addFocToDoc('demand', DEMAND_ID, 'Shipment')

  if (!COMMIT) {
    console.log(`\n  Expected: order ${money(EXPECTED_SUM_MINOR)} | loss cushions ~${money(EXPECTED_LOSS_MINOR)}`)
    console.log('  DRY RUN — re-run with --commit')
    return
  }

  const lossMeta = await api('GET', `/entity/loss/${LOSS_ID}`)
  await api('PUT', `/entity/loss/${LOSS_ID}`, {
    meta: lossMeta.meta,
    description: [
      'GENESIS-PRESENTS-WRITE-OFF-2026-07-18',
      'Cushions only (FOC gifts moved back to PARTW2607160539): 54464 Camel x1, 00144 Beige x1, 00143 Ivory x1.',
    ].join(' | '),
  })

  const orderMeta = await api('GET', `/entity/customerorder/${ORDER_ID}`)
  await api('PUT', `/entity/customerorder/${ORDER_ID}`, {
    meta: orderMeta.meta,
    description: [
      orderMeta.description || '',
      'FOC restored from write-off: 00013 Hydro Cool, 00024 Cleanser 500, 00025 Snow Booster 1000, 00011 EZ mask (clinic @ 100%).',
    ]
      .filter(Boolean)
      .join(' | '),
  })

  const [order, invoice, demand, loss] = await Promise.all([
    api('GET', `/entity/customerorder/${ORDER_ID}`),
    api('GET', `/entity/invoiceout/${INVOICE_ID}`),
    api('GET', `/entity/demand/${DEMAND_ID}`),
    api('GET', `/entity/loss/${LOSS_ID}`),
  ])

  const lossRows = await fetchAll(`/entity/loss/${LOSS_ID}/positions?expand=assortment`)
  console.log(`\n  After:`)
  console.log(`    Order ${order.name}: ${money(order.sum)}`)
  console.log(`    Invoice ${invoice.name}: ${money(invoice.sum)}`)
  console.log(`    Shipment ${demand.name}: ${money(demand.sum)}`)
  console.log(`    Loss ${loss.name}: ${money(loss.sum)}`)
  console.log('    Loss lines:', lossRows.map((p) => lineCode(p)).join(', '))

  if (order.sum !== EXPECTED_SUM_MINOR || invoice.sum !== EXPECTED_SUM_MINOR || demand.sum !== EXPECTED_SUM_MINOR) {
    throw new Error('Order chain should stay 2970 AED')
  }
  if (Math.round(loss.sum) !== EXPECTED_LOSS_MINOR) {
    throw new Error(`Loss should be ${money(EXPECTED_LOSS_MINOR)}, got ${money(loss.sum)}`)
  }
  for (const p of lossRows) {
    if (!CUSHION_CODES.has(lineCode(p))) throw new Error(`Unexpected loss line ${lineCode(p)}`)
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
