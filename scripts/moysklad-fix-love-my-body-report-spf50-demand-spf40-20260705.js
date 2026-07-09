#!/usr/bin/env node

/**
 * Love My Body — revert report 01400 to SPF50 sold; keep demand 06474 as SPF40 shipped.
 *
 *   node --import dotenv/config scripts/moysklad-fix-love-my-body-report-spf50-demand-spf40-20260705.js
 *   node --import dotenv/config scripts/moysklad-fix-love-my-body-report-spf50-demand-spf40-20260705.js --commit
 */

const fs = require('fs')
const path = require('path')
const os = require('os')
const { execFileSync } = require('child_process')

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

const REPORT_ID = 'f71a7d09-77cd-11f1-0a80-1c6d0044629f' // 01400 — sold SPF50
const DEMAND_ID = 'f781359f-77cd-11f1-0a80-1a6900452413' // 06474 — shipped SPF40

const REPORT_SPF_CODE = '54457'
const DEMAND_SPF_CODE = '00041'
const QTY = 1
const REPORT_SUM_MINOR = 266000
const DEMAND_SUM_MINOR = 264000

const CONSIGNMENT_SALES_TEMPLATE_ID = '9db2a6fb-fd0e-4a35-ab2c-443f47cc3ede'
const STOCK_NOTE_TEMPLATE_ID = '09ef2604-4a14-4571-bc17-dc266c9190c3'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')

const MARKER = `Love My Body report SPF50 demand SPF40 ${uaeToday()}`

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

async function replaceLine(entityType, entityId, fromCode, toCode, stock) {
  const positions = await fetchAll(`/entity/${entityType}/${entityId}/positions?expand=assortment`)
  const fromPos = positions.find((p) => p.assortment?.code === fromCode && p.quantity === QTY)
  const hasTo = positions.some((p) => p.assortment?.code === toCode && p.quantity === QTY)

  if (hasTo && !fromPos) {
    console.log(`  ${entityType}: already ${toCode} x${QTY}`)
    return false
  }
  if (!fromPos) throw new Error(`${entityType}: ${fromCode} x${QTY} not found to replace`)

  const toProduct = stock.get(toCode)
  if (!toProduct?.id || !toProduct.price) throw new Error(`No product/price for ${toCode}`)

  console.log(`  ${entityType}: ${fromCode} → ${toCode} @ ${money(toProduct.price)}`)

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

async function appendDescription(entityType, entityId, note) {
  if (!COMMIT) return
  const doc = await api('GET', `/entity/${entityType}/${entityId}`)
  if ((doc.description || '').includes(MARKER)) return
  await api('PUT', `/entity/${entityType}/${entityId}`, {
    meta: doc.meta,
    description: [doc.description || '', MARKER, note].filter(Boolean).join('\n'),
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
    throw new Error(`PDF export ${res.status}: ${(await res.text()).slice(0, 400)}`)
  }
  const pdfRes = await fetch(res.headers.get('location'))
  const buf = Buffer.from(await pdfRes.arrayBuffer())
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, buf)
  return { out: outPath, bytes: buf.length }
}

async function verifyReport() {
  const doc = await api('GET', `/entity/commissionreportin/${REPORT_ID}`)
  const positions = await fetchAll(`/entity/commissionreportin/${REPORT_ID}/positions?expand=assortment`)
  if (!positions.some((p) => p.assortment?.code === REPORT_SPF_CODE && p.quantity === QTY)) {
    throw new Error(`Report missing ${REPORT_SPF_CODE}`)
  }
  if (positions.some((p) => p.assortment?.code === DEMAND_SPF_CODE)) {
    throw new Error(`Report still has ${DEMAND_SPF_CODE}`)
  }
  if (Math.abs(doc.sum - REPORT_SUM_MINOR) > 1) {
    throw new Error(`Report sum ${money(doc.sum)} != ${money(REPORT_SUM_MINOR)}`)
  }
  console.log(`  Report ${doc.name}: ${money(doc.sum)} AED (${REPORT_SPF_CODE} sold) ✓`)
}

async function verifyDemand() {
  const doc = await api('GET', `/entity/demand/${DEMAND_ID}`)
  const positions = await fetchAll(`/entity/demand/${DEMAND_ID}/positions?expand=assortment`)
  if (!positions.some((p) => p.assortment?.code === DEMAND_SPF_CODE && p.quantity === QTY)) {
    throw new Error(`Demand missing ${DEMAND_SPF_CODE}`)
  }
  if (positions.some((p) => p.assortment?.code === REPORT_SPF_CODE)) {
    throw new Error(`Demand still has ${REPORT_SPF_CODE}`)
  }
  if (Math.abs(doc.sum - DEMAND_SUM_MINOR) > 1) {
    throw new Error(`Demand sum ${money(doc.sum)} != ${money(DEMAND_SUM_MINOR)}`)
  }
  console.log(`  Demand ${doc.name}: ${money(doc.sum)} AED (${DEMAND_SPF_CODE} shipped) ✓`)
}

async function main() {
  console.log('====================================================================')
  console.log('  Love My Body — report SPF50 sold / demand SPF40 shipped')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const stock = await fetchStockByCode()

  console.log('\n  Report 01400 — restore SPF50 sold:')
  await replaceLine('commissionreportin', REPORT_ID, DEMAND_SPF_CODE, REPORT_SPF_CODE, stock)

  console.log('\n  Demand 06474 — keep SPF40 shipped (no change if already correct):')
  const demandPositions = await fetchAll(`/entity/demand/${DEMAND_ID}/positions?expand=assortment`)
  const demandOk = demandPositions.some((p) => p.assortment?.code === DEMAND_SPF_CODE)
  if (demandOk) {
    console.log('  demand: already 00041 x1')
  } else {
    await replaceLine('demand', DEMAND_ID, REPORT_SPF_CODE, DEMAND_SPF_CODE, stock)
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  await appendDescription(
    'commissionreportin',
    REPORT_ID,
    'Sales report unchanged: customer sold Ultra Shield SPF50 (54457) ×1.'
  )
  await appendDescription(
    'demand',
    DEMAND_ID,
    'Consignment note only: shipped Multi Sun SPF40 (00041) ×1 instead of SPF50.'
  )

  console.log('\n  Verify:')
  await verifyReport()
  await verifyDemand()

  console.log('\n  Export PDFs to ~/Desktop/orders/ ...')
  const salesOut = path.join(ORDERS_DIR, 'GENOSYS_Love_My_Body_Consignment_Sales_01400.pdf')
  const stockOut = path.join(ORDERS_DIR, 'GENOSYS_Love_My_Body_Consignment_Stock_Note_06474.pdf')

  const salesPdf = await exportPdf(
    'commissionreportin',
    REPORT_ID,
    CONSIGNMENT_SALES_TEMPLATE_ID,
    salesOut
  )
  const stockPdf = await exportPdf('demand', DEMAND_ID, STOCK_NOTE_TEMPLATE_ID, stockOut)

  if (salesPdf) console.log(`    Sales: ${salesPdf.out}`)
  if (stockPdf) {
    console.log(`    Stock note: ${stockPdf.out}`)
    try {
      execFileSync('lp', ['-o', 'orientation-requested=4', stockPdf.out], { stdio: 'inherit' })
      console.log('    Stock note sent to printer (landscape)')
    } catch (e) {
      console.warn('    lp failed:', e.message)
    }
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
