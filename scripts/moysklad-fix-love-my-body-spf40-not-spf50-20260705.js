#!/usr/bin/env node

/**
 * Love My Body — fix June 2026 consignment docs 01400 / 06474:
 * shipped SPF 40 (00041) instead of SPF 50 (54457) ×1.
 *
 *   node --import dotenv/config scripts/moysklad-fix-love-my-body-spf40-not-spf50-20260705.js
 *   node --import dotenv/config scripts/moysklad-fix-love-my-body-spf40-not-spf50-20260705.js --commit
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

const REPORT_ID = 'f71a7d09-77cd-11f1-0a80-1c6d0044629f' // 01400
const DEMAND_ID = 'f781359f-77cd-11f1-0a80-1a6900452413' // 06474

const FROM_CODE = '54457' // Ultra Shield SPF50 @ 125
const TO_CODE = '00041' // Multi Sun SPF40 @ 105
const QTY = 1
const EXPECTED_SUM_MINOR = 264000 // 2660 - 20

const CONSIGNMENT_SALES_TEMPLATE_ID = '9db2a6fb-fd0e-4a35-ab2c-443f47cc3ede'
const STOCK_NOTE_TEMPLATE_ID = '09ef2604-4a14-4571-bc17-dc266c9190c3'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')

const MARKER = `Love My Body SPF40 not SPF50 fix ${uaeToday()}`

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
    if (attempt < 5 && (e.cause?.code === 'ECONNRESET' || e.message === 'fetch failed')) {
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

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

async function fetchStockByCode() {
  const rows = await fetchAll('/report/stock/all?stockMode=all&stockMoreThan=-1')
  const stock = new Map()
  for (const row of rows) {
    if (!row.code) continue
    stock.set(row.code, {
      id: row.meta?.href?.split('/').pop()?.split('?')[0],
      code: row.code,
      name: row.name,
      price: Number(row.salePrice || 0),
    })
  }
  return stock
}

async function swapSpfLine(entityType, entityId, stock) {
  const positions = await fetchAll(`/entity/${entityType}/${entityId}/positions?expand=assortment`)
  const fromPos = positions.find((p) => p.assortment?.code === FROM_CODE && p.quantity === QTY)
  if (!fromPos) {
    const hasTo = positions.some((p) => p.assortment?.code === TO_CODE)
    if (hasTo) {
      console.log(`  ${entityType}: already has ${TO_CODE} — skip swap`)
      return false
    }
    throw new Error(`${entityType}: ${FROM_CODE} x${QTY} not found`)
  }

  const toProduct = stock.get(TO_CODE)
  if (!toProduct?.id || !toProduct.price) throw new Error(`No product/price for ${TO_CODE}`)

  console.log(`  ${entityType}: remove ${FROM_CODE} @ ${money(fromPos.price)} → add ${TO_CODE} @ ${money(toProduct.price)}`)

  if (!COMMIT) return true

  await api('DELETE', `/entity/${entityType}/${entityId}/positions/${fromPos.id}`)
  const payload = {
    quantity: QTY,
    price: toProduct.price,
    assortment: href('product', toProduct.id),
    vat: 5,
    vatEnabled: true,
  }
  if (entityType === 'commissionreportin') payload.reward = 0
  await api('POST', `/entity/${entityType}/${entityId}/positions`, payload)
  return true
}

async function appendDescription(entityType, entityId) {
  if (!COMMIT) return
  const doc = await api('GET', `/entity/${entityType}/${entityId}`)
  if ((doc.description || '').includes(MARKER)) return
  await api('PUT', `/entity/${entityType}/${entityId}`, {
    meta: doc.meta,
    description: [
      doc.description || '',
      MARKER,
      `Correction: shipped Multi Sun SPF40 (${TO_CODE}) ×1, not Ultra Shield SPF50 (${FROM_CODE}).`,
    ]
      .filter(Boolean)
      .join('\n'),
  })
}

async function exportPdf(entityType, entityId, templateId, outPath) {
  const body = {
    template: {
      meta: {
        href: `${API}/entity/${entityType}/metadata/customtemplate/${templateId}`,
        type: 'customtemplate',
        mediaType: 'application/json',
      },
    },
    extension: 'pdf',
  }
  const res = await fetch(`${API}/entity/${entityType}/${entityId}/export`, {
    method: 'POST',
    headers: { Authorization: AUTH, Accept: '*/*', 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    redirect: 'manual',
  })
  if (res.status === 412) return null
  if (res.status !== 303 && res.status !== 302) {
    const t = await res.text()
    throw new Error(`PDF export ${res.status}: ${t.slice(0, 400)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('PDF export missing Location')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  const buf = Buffer.from(await pdfRes.arrayBuffer())
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, buf)
  return { out: outPath, bytes: buf.length }
}

async function verifyDoc(entityType, entityId, label) {
  const doc = await api('GET', `/entity/${entityType}/${entityId}`)
  const positions = await fetchAll(`/entity/${entityType}/${entityId}/positions?expand=assortment`)
  const hasFrom = positions.some((p) => p.assortment?.code === FROM_CODE)
  const hasTo = positions.some((p) => p.assortment?.code === TO_CODE && p.quantity === QTY)
  if (hasFrom) throw new Error(`${label}: still has ${FROM_CODE}`)
  if (!hasTo) throw new Error(`${label}: missing ${TO_CODE} x${QTY}`)
  if (Math.abs(doc.sum - EXPECTED_SUM_MINOR) > 1) {
    throw new Error(`${label} sum ${money(doc.sum)} != ${money(EXPECTED_SUM_MINOR)}`)
  }
  console.log(`  ${label} ${doc.name}: ${money(doc.sum)} AED ✓`)
  return doc
}

async function main() {
  console.log('====================================================================')
  console.log('  Love My Body — SPF50 → SPF40 fix (01400 / 06474)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [report, demand, stock] = await Promise.all([
    api('GET', `/entity/commissionreportin/${REPORT_ID}`),
    api('GET', `/entity/demand/${DEMAND_ID}`),
    fetchStockByCode(),
  ])

  console.log(`\n  Report ${report.name}: ${money(report.sum)} AED`)
  console.log(`  Demand ${demand.name}: ${money(demand.sum)} AED`)
  console.log(`  Target total: ${money(EXPECTED_SUM_MINOR)} AED`)

  console.log('\n  Swap:')
  await swapSpfLine('commissionreportin', REPORT_ID, stock)
  await swapSpfLine('demand', DEMAND_ID, stock)

  if (!COMMIT) {
    console.log('\n  Would re-export PDFs to ~/Desktop/orders/')
    console.log('  DRY RUN — re-run with --commit')
    return
  }

  await appendDescription('commissionreportin', REPORT_ID)
  await appendDescription('demand', DEMAND_ID)

  console.log('\n  Verify:')
  const reportAfter = await verifyDoc('commissionreportin', REPORT_ID, 'Report')
  const demandAfter = await verifyDoc('demand', DEMAND_ID, 'Demand')

  console.log('\n  Export PDFs...')
  const salesOut = path.join(ORDERS_DIR, `GENOSYS_Love_My_Body_Consignment_Sales_${reportAfter.name}.pdf`)
  const stockOut = path.join(ORDERS_DIR, `GENOSYS_Love_My_Body_Consignment_Stock_Note_${demandAfter.name}.pdf`)

  const salesPdf = await exportPdf(
    'commissionreportin',
    REPORT_ID,
    CONSIGNMENT_SALES_TEMPLATE_ID,
    salesOut
  )
  const stockPdf = await exportPdf('demand', DEMAND_ID, STOCK_NOTE_TEMPLATE_ID, stockOut)

  if (salesPdf) console.log(`    Sales: ${salesPdf.out} (${salesPdf.bytes} bytes)`)
  if (stockPdf) console.log(`    Stock note: ${stockPdf.out} (${stockPdf.bytes} bytes)`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
