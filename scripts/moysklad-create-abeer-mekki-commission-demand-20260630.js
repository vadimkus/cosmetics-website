#!/usr/bin/env node

/**
 * Abeer Mekki — Полученный отчёт комиссионера (consignment sales).
 *
 *   Skin Barrier Protecting Cream 100g (00037 / SPC) ×1
 *   Skin Rescue Overnight Cream Mask 100g (00189 / ROM) ×1
 *   Snow O₂ Cleanser 180ml (00021 / SOC) ×1
 *   Multi Sun Cream SPF40 40g (00041 / MSC) ×1
 *
 * Clinic list salePrice × 0.9 (−10% Al Ain representative discount) on every line.
 * Report only — no demand (Abeer settlement pattern).
 *
 *   node --import dotenv/config scripts/moysklad-create-abeer-mekki-commission-demand-20260630.js
 *   node --import dotenv/config scripts/moysklad-create-abeer-mekki-commission-demand-20260630.js --commit
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

const { uaeToday, uaeMomentNow } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')
const EXPORT_PDF = !process.argv.includes('--no-pdf')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const AGENT_ID = '39a7af2b-f5d0-11f0-0a80-108500063cb5' // ABEER MEKKI BEAUTY LADIES CENTER
const CONTRACT_ID = 'a5ab62b9-f5d1-11f0-0a80-1085000693a6' // Contract 31
const STATE_REPORT_NOT_PAID_ID = '3203736c-c43b-11eb-0a80-093a002b59a6'
const CONSIGNMENT_SALES_TEMPLATE_ID = '9db2a6fb-fd0e-4a35-ab2c-443f47cc3ede'

const DISCOUNT_MULT = 0.9
const DISCOUNT_LABEL = '10% Al Ain representative discount (clinic list × 0.9 on each line)'

const MARKER_BASE = 'Abeer Mekki consignment sold SPC ROM SOC MSC photo 2026-06-30'

/** [code, qty, label] */
const LINES = [
  ['00037', 1, 'Skin Barrier Protecting Cream 100g (SPC)'],
  ['00189', 1, 'Skin Rescue Overnight Cream Mask 100g (ROM)'],
  ['00021', 1, 'Snow O₂ Cleanser 180ml (SOC)'],
  ['00041', 1, 'Multi Sun Cream SPF40/PA++ 40g (MSC)'],
]

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
    if (res.status === 429 && attempt < 8) {
      await new Promise((r) => setTimeout(r, 800 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1200)}`)
    return text ? JSON.parse(text) : null
  } catch (e) {
    if (attempt < 5 && (e.cause?.code === 'UND_ERR_CONNECT_TIMEOUT' || e.message === 'fetch failed')) {
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

function stateHref(entityType, stateId) {
  return {
    meta: {
      href: `${API}/entity/${entityType}/metadata/states/${stateId}`,
      type: 'state',
      mediaType: 'application/json',
    },
  }
}

function money(minor) {
  return (minor / 100).toFixed(2)
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
      listPrice: Number(row.salePrice || 0),
    })
  }
  return stock
}

async function ensureNoDuplicate() {
  const date = uaeToday()
  const filter = [
    `agent=${API}/entity/counterparty/${AGENT_ID}`,
    `moment>=${date} 00:00:00`,
    `moment<=${date} 23:59:59`,
  ].join(';')
  const reports = await fetchAll(`/entity/commissionreportin?filter=${encodeURIComponent(filter)}`)
  const dup = reports.find((r) => (r.description || '').includes(MARKER_BASE))
  if (dup) {
    throw new Error(
      `Duplicate report: ${dup.name} (${dup.id}) https://online.moysklad.ru/app/#commissionreport/edit?id=${dup.id}`
    )
  }
}

function resolveLines(stock) {
  return LINES.map(([code, qty, label]) => {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    if (!item.listPrice) throw new Error(`No salePrice for ${code}`)
    const price = Math.round(item.listPrice * DISCOUNT_MULT)
    return { ...item, qty, label, price, listPrice: item.listPrice }
  })
}

async function exportCommissionSalesPdf(reportId, reportName) {
  const body = {
    template: {
      meta: {
        href: `${API}/entity/commissionreportin/metadata/customtemplate/${CONSIGNMENT_SALES_TEMPLATE_ID}`,
        type: 'customtemplate',
        mediaType: 'application/json',
      },
    },
    extension: 'pdf',
  }
  const res = await fetch(`${API}/entity/commissionreportin/${reportId}/export`, {
    method: 'POST',
    headers: {
      Authorization: AUTH,
      Accept: '*/*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    redirect: 'manual',
  })
  if (res.status !== 303 && res.status !== 302) {
    const t = await res.text()
    throw new Error(`PDF export ${res.status}: ${t.slice(0, 400)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('PDF export missing Location')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  const buf = Buffer.from(await pdfRes.arrayBuffer())
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const out = path.join(ORDERS_DIR, `GENOSYS_ABEER_MEKKI_Consignment_Sales_${reportName}.pdf`)
  fs.writeFileSync(out, buf)
  return { out, bytes: buf.length }
}

async function main() {
  console.log('====================================================================')
  console.log('  Abeer Mekki — consignment sales report (SPC ROM SOC MSC) −10%')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Discount: ${DISCOUNT_LABEL}\n`)

  const agent = await api('GET', `/entity/counterparty/${AGENT_ID}`)
  const contract = await api('GET', `/entity/contract/${CONTRACT_ID}`)
  console.log(`  Customer: ${agent.name}`)
  console.log(`  Phone   : ${agent.phone || '+971556717564'}`)
  console.log(`  Contract: ${contract.name}`)

  const stock = await fetchStockByCode()
  const resolved = resolveLines(stock)

  console.log('\n  Sold lines (AED VAT incl.):')
  let totalMinor = 0
  for (const line of resolved) {
    totalMinor += line.price * line.qty
    console.log(
      `    ${line.code} ${line.label} x${line.qty} | list ${money(line.listPrice)} → ${money(line.price)} (−10%) | line ${money(line.price * line.qty)}`
    )
  }
  console.log(`\n  Total: ${money(totalMinor)} AED`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  await ensureNoDuplicate()

  const marker = `${MARKER_BASE} ${uaeToday()}`
  const moment = uaeMomentNow()

  const report = await api('POST', '/entity/commissionreportin', {
    moment,
    applicable: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    contract: href('contract', CONTRACT_ID),
    state: stateHref('commissionreportin', STATE_REPORT_NOT_PAID_ID),
    commissionPeriodStart: moment,
    commissionPeriodEnd: moment,
    rewardType: 'PercentOfSales',
    rewardPercent: 0,
    description: [
      marker,
      'Consignment sales — sold items settlement (photo 2026-06-30).',
      DISCOUNT_LABEL,
      'Lines: SPC 00037 ×1; ROM 00189 ×1; SOC 00021 ×1; MSC 00041 ×1.',
      'Buyer: ABEER MEKKI BEAUTY LADIES CENTER - L.L.C - S.P.C | +971556717564 | Al Ain.',
    ].join('\n'),
    positions: resolved.map((line) => ({
      quantity: line.qty,
      price: line.price,
      assortment: href('product', line.id),
      vat: 5,
      vatEnabled: true,
      reward: 0,
    })),
  })

  console.log(`\n  Report ${report.name}: ${money(report.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#commissionreport/edit?id=${report.id}`)

  if (EXPORT_PDF) {
    try {
      const pdf = await exportCommissionSalesPdf(report.id, report.name)
      console.log(`  PDF: ${pdf.out} (${pdf.bytes} bytes)`)
    } catch (e) {
      console.log(`  PDF export skipped: ${e.message}`)
    }
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
