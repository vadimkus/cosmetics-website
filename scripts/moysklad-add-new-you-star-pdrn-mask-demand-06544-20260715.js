#!/usr/bin/env node

/**
 * NEW YOU STAR demand 06544 — add PDRN mask pack ×2.
 *
 *   node --import dotenv/config scripts/moysklad-add-new-you-star-pdrn-mask-demand-06544-20260715.js
 *   node --import dotenv/config scripts/moysklad-add-new-you-star-pdrn-mask-demand-06544-20260715.js --commit
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

const DEMAND_ID = 'e16899aa-8005-11f1-0a80-04cd0031d143' // 06544
const STOCK_NOTE_TEMPLATE_ID = '09ef2604-4a14-4571-bc17-dc266c9190c3'
const MARKER = `NEW-YOU-STAR-06544-ADD-PDRN-MASK-${uaeToday()}`

const ADD_LINE = ['54467', 2, 'Skin Reboot PDRN Mask Pack 350g']

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
      signal: AbortSignal.timeout(60000),
    })
    const text = await res.text()
    if ((res.status === 429 || res.status >= 500) && attempt < 8) {
      await new Promise((r) => setTimeout(r, 800 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1200)}`)
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

const money = (minor) => (minor / 100).toFixed(2)

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

function positionPayload(line) {
  return {
    quantity: line.qty,
    price: line.price,
    assortment: href('product', line.id),
    vat: 5,
    vatEnabled: true,
  }
}

async function exportStockNotePdf(demandName) {
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
  const pdfRes = await fetch(res.headers.get('location'))
  const buf = Buffer.from(await pdfRes.arrayBuffer())
  const ordersDir = path.join(os.homedir(), 'Desktop', 'orders')
  fs.mkdirSync(ordersDir, { recursive: true })
  const out = path.join(ordersDir, `GENOSYS_NEW_YOU_STAR_${demandName}_Consignment_Stock_Note.pdf`)
  fs.writeFileSync(out, buf)
  return { out, bytes: buf.length }
}

async function main() {
  const [code, qty, label] = ADD_LINE
  console.log('====================================================================')
  console.log('  NEW YOU STAR 06544 — add PDRN mask pack ×2')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const demand = await api('GET', `/entity/demand/${DEMAND_ID}`)
  console.log(`  Demand: ${demand.name} | current ${money(demand.sum)} AED`)

  const positions = await fetchAll(`/entity/demand/${DEMAND_ID}/positions?expand=assortment`)
  const existing = positions.find((p) => p.assortment?.code === code)
  if (existing) {
    throw new Error(`${code} already on ${demand.name} qty=${existing.quantity} — use amend not add`)
  }

  const stock = await fetchStockRow(code)
  if (stock.available < qty) {
    throw new Error(`Insufficient ${code}: need ${qty}, avail ${stock.available}`)
  }

  const line = { ...stock, qty, label }
  console.log(`  Add: ${line.code} x${line.qty} @ ${money(line.price)} → ${money(line.price * line.qty)} | ${label}`)
  console.log(`  New demand total: ~${money(Number(demand.sum) + line.price * line.qty)} AED`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  await api('POST', `/entity/demand/${DEMAND_ID}/positions`, positionPayload(line))

  const updated = await api('GET', `/entity/demand/${DEMAND_ID}`)
  const desc = [updated.description || '', MARKER, `${code}x${qty}`].filter(Boolean).join(' | ')
  await api('PUT', `/entity/demand/${DEMAND_ID}`, { description: desc })

  console.log(`\n  Updated: ${updated.name} | ${money(updated.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#demand/edit?id=${DEMAND_ID}`)

  const { out, bytes } = await exportStockNotePdf(updated.name)
  console.log(`  Stock note PDF: ${out} (${bytes} bytes)`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
