#!/usr/bin/env node

/**
 * LODY ANA.SPA. LLC SO GENCardM260823LODY — SO only.
 * Remove 00074 stamp 0.25mm @100.
 * Add 00048 Hair Solution Pro box ×1 at MoySklad оптовая.
 * Re-export proforma → ~/Desktop/orders/
 *
 *   node --import dotenv/config scripts/moysklad-amend-lodyana-drop-stamp-add-hair-solution-20260823.js
 *   node --import dotenv/config scripts/moysklad-amend-lodyana-drop-stamp-add-hair-solution-20260823.js --commit
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

const ORDER_ID = '90bfd901-9eec-11f1-0a80-1eb700920c73'
const DROP_CODE = '00074'
const ADD_CODE = '00048'
const KEEP_STAMP_CODE = '00141'
const ORDER_PROFORMA_TEMPLATE_ID = '80b38aad-4f55-4bd8-a4a4-d8ed5bf69d2f'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')

async function api(method, pathStr, body, attempt = 1) {
  const url = pathStr.startsWith('http') ? pathStr : API + pathStr
  try {
    const res = await fetch(url, {
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
    if ((res.status === 429 || res.status >= 500) && attempt < 8) {
      await new Promise((r) => setTimeout(r, 800 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1600)}`)
    return text ? JSON.parse(text) : null
  } catch (e) {
    if (attempt < 5 && (e.message === 'fetch failed' || e.cause?.code === 'ECONNRESET')) {
      await new Promise((r) => setTimeout(r, 1500 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    throw e
  }
}

function href(type, id) {
  return { meta: { href: `${API}/entity/${type}/${id}`, type, mediaType: 'application/json' } }
}

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

function salePrices(row) {
  const out = {}
  for (const p of row.salePrices || []) {
    const name = p.priceType?.name || '?'
    out[name] = (p.value || 0) / 100
  }
  return out
}

async function fetchAssortmentByCode(code) {
  const d = await api('GET', `/entity/assortment?filter=code=${encodeURIContext(code)}&limit=5&stockMode=all`)
  const row = (d.rows || []).find((r) => r.code === code && !r.archived)
  if (!row?.id) throw new Error(`Unknown code: ${code}`)
  return {
    id: row.id,
    name: row.name,
    available: Number(row.stock || 0) - Number(row.reserve || 0),
    prices: salePrices(row),
  }
}

function encodeURIContext(code) {
  return encodeURIComponent(code)
}

async function exportOrderPdf(orderId, orderName) {
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
  const buf = Buffer.from(await pdfRes.arrayBuffer())
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const safe = String(orderName || 'SO').replace(/[^\w.-]+/g, '_')
  const out = path.join(ORDERS_DIR, `GENOSYS_LODYANA_${safe}.pdf`)
  fs.writeFileSync(out, buf)
  return out
}

async function main() {
  console.log('====================================================================')
  console.log('  LODY ANA.SPA. LLC — drop stamp 0.25, add Hair Solution box')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const order = await api('GET', `/entity/customerorder/${ORDER_ID}?expand=state,agent`)
  if (!/lody\s*ana\.spa/i.test(order.agent?.name || '')) {
    throw new Error(`Unexpected agent: ${order.agent?.name}`)
  }
  if ((order.invoicesOut?.meta?.size || 0) > 0 || (order.demands?.meta?.size || 0) > 0) {
    throw new Error('SO has invoice/shipment — stop, this is SO-only')
  }

  const posData = await api('GET', `/entity/customerorder/${ORDER_ID}/positions?expand=assortment&limit=100`)
  const rows = posData.rows || []
  console.log(`  ${order.name} | ${money(order.sum)} AED | ${order.state?.name || ''}`)
  for (const p of rows) {
    console.log(`    ${p.assortment?.code} ${p.assortment?.name} x${p.quantity} @ ${money(p.price)}`)
  }

  const drop = rows.filter((p) => p.assortment?.code === DROP_CODE)
  const keepStamp = rows.filter((p) => p.assortment?.code === KEEP_STAMP_CODE)
  const already = rows.filter((p) => p.assortment?.code === ADD_CODE)
  if (!drop.length) throw new Error(`No ${DROP_CODE} to remove`)
  if (!keepStamp.length) throw new Error(`Missing ${KEEP_STAMP_CODE}`)
  if (already.length) throw new Error(`${ADD_CODE} already on SO`)

  const addItem = await fetchAssortmentByCode(ADD_CODE)
  const clinicAed = addItem.prices['оптовая']
  if (!clinicAed) throw new Error(`No оптовая on ${ADD_CODE}: ${JSON.stringify(addItem.prices)}`)
  if (addItem.available < 1) {
    console.log(`  WARN stock ${ADD_CODE}: available ${addItem.available}`)
  }
  console.log(`  Add ${ADD_CODE} ${addItem.name} x1 @ ${clinicAed} оптовая (avail ${addItem.available})`)
  console.log(`    salePrices: ${JSON.stringify(addItem.prices)}`)

  const expectedMinor =
    rows.reduce((sum, p) => {
      if (p.assortment?.code === DROP_CODE) return sum
      return sum + Math.round(p.price) * p.quantity
    }, 0) + Math.round(clinicAed * 100)

  console.log(`  New total: ${money(expectedMinor)} AED | SO only`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  for (const p of drop) {
    await api('DELETE', `/entity/customerorder/${ORDER_ID}/positions/${p.id}`)
    console.log(`    deleted ${DROP_CODE}`)
  }

  await api('POST', `/entity/customerorder/${ORDER_ID}/positions`, [
    {
      quantity: 1,
      price: Math.round(clinicAed * 100),
      discount: 0,
      assortment: href('product', addItem.id),
      vat: 5,
      vatEnabled: true,
    },
  ])

  const after = await api('GET', `/entity/customerorder/${ORDER_ID}`)
  if (after.sum !== expectedMinor) {
    throw new Error(`Sum ${money(after.sum)} ≠ expected ${money(expectedMinor)}`)
  }

  await api('PUT', `/entity/customerorder/${ORDER_ID}`, {
    meta: after.meta,
    description: [
      'LODYANA-HAIRSTAMP-HAIRSOL-AD70-2026-08-23',
      `00141 Hair Stamp HairGen box x1 @230; ${ADD_CODE} Hair Solution Pro box x1 @${clinicAed}; Delivery Abu Dhabi 70. Removed 00074 stamp 0.25. SO only.`,
      'Ship: Al Sahel Towers, Block A, Al Bateen, Abu Dhabi.',
    ].join('\n'),
  })

  const pdfPath = await exportOrderPdf(ORDER_ID, after.name)
  console.log(`\n  Amended ${after.name} | ${money(after.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#customerorder/edit?id=${ORDER_ID}`)
  console.log(`  PDF: ${pdfPath}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
