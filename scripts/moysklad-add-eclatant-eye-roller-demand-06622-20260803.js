#!/usr/bin/env node

/**
 * ECLATANT demand 06622 — add Eye Roller 00084 ×4 @ clinic salePrice, refresh stock note PDF.
 *
 *   node --import dotenv/config scripts/moysklad-add-eclatant-eye-roller-demand-06622-20260803.js
 *   node --import dotenv/config scripts/moysklad-add-eclatant-eye-roller-demand-06622-20260803.js --commit
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

const { uaeToday } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const DEMAND_ID = '6abfb5d4-8f28-11f1-0a80-0fc50078c2df' // 06622
const STOCK_NOTE_TEMPLATE_ID = '09ef2604-4a14-4571-bc17-dc266c9190c3'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')
const MARKER = `ECLATANT-06622-ADD-EYE-ROLLER-${uaeToday()}`

const CODE = '00084'
const QTY = 4
const LABEL = 'Genosys Eye Roller 0,25mm'

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
    if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1200)}`)
    return text ? JSON.parse(text) : null
  } catch (e) {
    if (attempt < 5 && (e.message === 'fetch failed' || e.cause?.code === 'ECONNRESET')) {
      await new Promise((r) => setTimeout(r, 1500 * attempt))
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

const money = (minor) => ((minor || 0) / 100).toFixed(2)

async function fetchStockRow(code) {
  const rows = await fetchAll('/report/stock/all?stockMode=all&stockMoreThan=-1')
  const row = rows.find((r) => r.code === code)
  if (!row) throw new Error(`Code not found in stock: ${code}`)
  return {
    id: row.meta?.href?.split('/').pop()?.split('?')[0],
    code: row.code,
    name: row.name,
    available: Number(row.stock || 0) - Number(row.reserve || 0),
    price: Number(row.salePrice || 0),
  }
}

async function exportStockNote(demandName) {
  const body = {
    template: {
      meta: {
        href: `${API}/entity/demand/metadata/customtemplate/${STOCK_NOTE_TEMPLATE_ID}`,
        type: 'customtemplate',
        mediaType: 'application/json',
      },
    },
    extension: 'pdf',
  }
  const res = await fetch(`${API}/entity/demand/${DEMAND_ID}/export`, {
    method: 'POST',
    headers: { Authorization: AUTH, Accept: '*/*', 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    redirect: 'manual',
  })
  if (res.status !== 302 && res.status !== 303) {
    throw new Error(`Export ${res.status}: ${(await res.text()).slice(0, 400)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export missing Location')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  const buf = Buffer.from(await pdfRes.arrayBuffer())
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const out = path.join(ORDERS_DIR, `GENOSYS_Eclatant_Consignment_Stock_Note_${demandName}.pdf`)
  fs.writeFileSync(out, buf)
  return out
}

async function main() {
  console.log('====================================================================')
  console.log('  ECLATANT 06622 — add Eye Roller ×4 + refresh stock note')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const demand = await api('GET', `/entity/demand/${DEMAND_ID}`)
  console.log(`  Demand: ${demand.name} | current ${money(demand.sum)} AED`)

  if ((demand.description || '').includes(MARKER)) {
    throw new Error(`Already applied: ${MARKER}`)
  }

  const positions = await fetchAll(`/entity/demand/${DEMAND_ID}/positions?expand=assortment`)
  const existing = positions.find((p) => p.assortment?.code === CODE)
  if (existing) {
    throw new Error(`${CODE} already on ${demand.name} qty=${existing.quantity}`)
  }

  const stock = await fetchStockRow(CODE)
  if (stock.available < QTY) {
    throw new Error(`Insufficient ${CODE}: need ${QTY}, avail ${stock.available}`)
  }
  if (!stock.price) throw new Error(`No salePrice for ${CODE}`)

  const lineMinor = stock.price * QTY
  const expected = Number(demand.sum) + lineMinor
  console.log(`  Add: ${CODE} ${LABEL} x${QTY} @ ${money(stock.price)} = ${money(lineMinor)}`)
  console.log(`  Avail: ${stock.available}`)
  console.log(`  Expected demand total: ${money(expected)} AED`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  await api('POST', `/entity/demand/${DEMAND_ID}/positions`, {
    quantity: QTY,
    price: stock.price,
    assortment: href('product', stock.id),
    vat: 5,
    vatEnabled: true,
  })

  const updated = await api('GET', `/entity/demand/${DEMAND_ID}`)
  await api('PUT', `/entity/demand/${DEMAND_ID}`, {
    description: [updated.description || '', MARKER, `${CODE}x${QTY} @ clinic`].filter(Boolean).join(' | '),
  })

  const finalDem = await api('GET', `/entity/demand/${DEMAND_ID}`)
  console.log(`\n  Updated: ${finalDem.name} | ${money(finalDem.sum)} AED`)
  if (finalDem.sum !== expected) {
    throw new Error(`Sum ${money(finalDem.sum)} ≠ expected ${money(expected)}`)
  }
  console.log(`  https://online.moysklad.ru/app/#demand/edit?id=${DEMAND_ID}`)

  const pdf = await exportStockNote(finalDem.name)
  console.log(`  PDF: ${pdf}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
