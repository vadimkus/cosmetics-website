#!/usr/bin/env node

/**
 * PRECISE MEDICAL CENTER L.L.C SO GENCardM260831PMC
 * Swap Hyaluron Cream 50g 54458 → 250g 54460 @ 210. Reissue proforma.
 *
 *   node --import dotenv/config scripts/moysklad-amend-precise-medical-hyaluron-250g-20260831.js
 *   node --import dotenv/config scripts/moysklad-amend-precise-medical-hyaluron-250g-20260831.js --commit
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

const ORDER_ID = '9a08c3b9-a533-11f1-0a80-1ecb00d00a73'
const ORDER_PROFORMA_TEMPLATE_ID = '80b38aad-4f55-4bd8-a4a4-d8ed5bf69d2f'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')
const DROP_CODE = '54458'
const ADD = { code: '54460', qty: 1, clinicAed: 210 }
const EXPECTED_SUM_MINOR = 285700

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

async function fetchAssortmentByCode(code) {
  const d = await api('GET', `/entity/assortment?filter=code=${encodeURIComponent(code)}&limit=5&stockMode=all`)
  const row = (d.rows || []).find((r) => r.code === code && !r.archived)
  if (!row?.id) throw new Error(`Unknown code: ${code}`)
  return {
    id: row.id,
    name: row.name,
    available: Number(row.stock || 0) - Number(row.reserve || 0),
  }
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
    throw new Error(`SO export ${res.status}: ${(await res.text()).slice(0, 600)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export missing Location')
  const pdfRes = await fetch(location, { headers: { Authorization: AUTH } })
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  const buf = Buffer.from(await pdfRes.arrayBuffer())
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const safe = String(orderName || 'SO').replace(/[^\w.-]+/g, '_')
  const outPath = path.join(ORDERS_DIR, `GENOSYS_Precise_Medical_Center_${safe}.pdf`)
  fs.writeFileSync(outPath, buf)
  return outPath
}

async function main() {
  console.log('====================================================================')
  console.log('  Precise Medical Center — 54458 → 54460 hyaluron 250g')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const order = await api('GET', `/entity/customerorder/${ORDER_ID}?expand=state,agent`)
  if (!/precise medical/i.test(order.agent?.name || '')) {
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
  const already = rows.filter((p) => p.assortment?.code === ADD.code)
  if (!drop.length) throw new Error(`No ${DROP_CODE} to remove`)
  if (already.length) throw new Error(`${ADD.code} already on SO`)

  const addItem = await fetchAssortmentByCode(ADD.code)
  if (addItem.available < ADD.qty) {
    throw new Error(`Insufficient ${ADD.code}: need ${ADD.qty}, available ${addItem.available}`)
  }
  console.log(`  Add ${ADD.code} ${addItem.name} x${ADD.qty} @ ${ADD.clinicAed} (avail ${addItem.available})`)
  console.log(`  New total: ${money(EXPECTED_SUM_MINOR)} AED | SO only`)

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
      quantity: ADD.qty,
      price: Math.round(ADD.clinicAed * 100),
      discount: 0,
      assortment: href('product', addItem.id),
      vat: 5,
      vatEnabled: true,
    },
  ])

  const after = await api('GET', `/entity/customerorder/${ORDER_ID}`)
  if (after.sum !== EXPECTED_SUM_MINOR) {
    throw new Error(`Sum ${money(after.sum)} ≠ expected ${money(EXPECTED_SUM_MINOR)}`)
  }

  await api('PUT', `/entity/customerorder/${ORDER_ID}`, {
    meta: after.meta,
    description: [
      'PRECISE-MEDICAL-CENTER-CLINIC-SO-2026-08-31',
      'Clinic list. SO only — no invoice / shipment / payment.',
      'Snow O2 500, Booster 200, PC toner 200, EPI x2, SRS x10, SWS x10, EZ x2, Hydro Cool, PDRN pack, hyaluron 250g, post 20g, Revita Natural.',
      '2026-08-31: 54458 hyaluron 50g → 54460 hyaluron 250g @210.',
      'License 922438. Address / phone / TRN TBC.',
    ].join(' | '),
  })

  const pdfPath = await exportOrderPdf(ORDER_ID, order.name)
  console.log(`\n  Order: ${order.name} | ${money(after.sum)} AED`)
  console.log(`  PDF: ${pdfPath}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
