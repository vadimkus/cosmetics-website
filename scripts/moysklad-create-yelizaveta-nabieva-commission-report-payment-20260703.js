#!/usr/bin/env node

/**
 * Yelizaveta Nabieva Cosmetologist — consignment sales report + partial payment.
 *
 * Contract **00038**. Sold = full consignment remainder on books (ledger on-hand).
 * Payment today: **1,050 AED** partial; balance stays open for full settlement soon.
 *
 *   node --import dotenv/config scripts/moysklad-create-yelizaveta-nabieva-commission-report-payment-20260703.js
 *   node --import dotenv/config scripts/moysklad-create-yelizaveta-nabieva-commission-report-payment-20260703.js --commit
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

const { uaeToday, uaeMomentNow, uaeMomentAddMinutes } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')
const EXPORT_PDF = !process.argv.includes('--no-pdf')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const AGENT_ID = '6162b5f6-552a-11ec-0a80-022700228ff7' // Yelizaveta Nabieva Cosmetologist
const CONTRACT_ID = '3185cec4-552b-11ec-0a80-01060020cf1e' // Agreement 00038
const BANK_ACCOUNT_ID = 'e1852e1c-33c5-11ea-0a80-043f000b2739'
const STATE_REPORT_NOT_PAID_ID = '3203736c-c43b-11eb-0a80-093a002b59a6'
const CONSIGNMENT_SALES_TEMPLATE_ID = '9db2a6fb-fd0e-4a35-ab2c-443f47cc3ede'

const PARTIAL_PAYMENT_MINOR = 105000 // 1,050 AED
const MARKER = `YELIZAVETA-NABIEVA-CONSIGNMENT-PARTIAL-${uaeToday()}`
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
    if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1600)}`)
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
    const data = await api('GET', `${pathStr}${sep}limit=100&offset=${offset}`)
    rows.push(...(data.rows || []))
    if ((data.rows || []).length < 100) break
    offset += 100
  }
  return rows
}

async function fetchPositions(docHref) {
  return fetchAll(`${docHref}/positions?expand=assortment`)
}

function href(type, id) {
  return { meta: { href: `${API}/entity/${type}/${id}`, type, mediaType: 'application/json' } }
}

function orgAccountHref(id) {
  return {
    meta: {
      href: `${API}/entity/organization/${ORG_ID}/accounts/${id}`,
      type: 'account',
      mediaType: 'application/json',
    },
  }
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

async function computeOnHandLines() {
  const agentHref = `${API}/entity/counterparty/${AGENT_ID}`
  const contractHref = `${API}/entity/contract/${CONTRACT_ID}`
  const cf = encodeURIComponent(`agent=${agentHref};contract=${contractHref}`)

  const [demands, reports, returns] = await Promise.all([
    fetchAll(`/entity/demand?filter=${cf}`),
    fetchAll(`/entity/commissionreportin?filter=${cf}`),
    fetchAll(`/entity/salesreturn?filter=${encodeURIComponent(`agent=${agentHref}`)}`),
  ])

  const shipped = new Map()
  const reported = new Map()
  const returned = new Map()
  const meta = new Map()

  const add = (map, code, qty, price, productId, name) => {
    if (!code || qty <= 0) return
    map.set(code, (map.get(code) || 0) + qty)
    if (price) meta.set(code, { price: Math.round(price), productId, name })
  }

  for (const d of demands) {
    for (const p of await fetchPositions(d.meta.href)) {
      add(
        shipped,
        p.assortment?.code,
        p.quantity,
        p.price,
        p.assortment?.meta?.href?.split('/').pop(),
        p.assortment?.name
      )
    }
  }
  for (const r of reports) {
    for (const p of await fetchPositions(r.meta.href)) {
      add(reported, p.assortment?.code, p.quantity, p.price, null, p.assortment?.name)
    }
  }
  for (const r of returns) {
    for (const p of await fetchPositions(r.meta.href)) {
      add(returned, p.assortment?.code, p.quantity, p.price, null, p.assortment?.name)
    }
  }

  const lines = []
  for (const [code, shipQty] of shipped) {
    const hand = shipQty - (reported.get(code) || 0) - (returned.get(code) || 0)
    if (hand <= 0) continue
    const m = meta.get(code) || {}
    lines.push({
      code,
      qty: hand,
      price: m.price || 0,
      productId: m.productId || null,
      name: m.name || code,
    })
  }

  lines.sort((a, b) => a.code.localeCompare(b.code))
  return lines
}

async function resolveOnHandLines(stock) {
  const raw = await computeOnHandLines()
  return raw.map((line) => {
    const row = stock.get(line.code)
    if (!row?.id) throw new Error(`Unknown product code ${line.code}`)
    const price = line.price || row.price
    if (!price) throw new Error(`No consignment price for ${line.code}`)
    return {
      ...line,
      productId: line.productId || row.id,
      price,
      name: line.name || row.name,
    }
  })
}

async function ensureNoDuplicate() {
  const filter = [
    `agent=${API}/entity/counterparty/${AGENT_ID}`,
    `moment>=${uaeToday()} 00:00:00`,
    `moment<=${uaeToday()} 23:59:59`,
  ].join(';')
  const reports = await fetchAll(`/entity/commissionreportin?filter=${encodeURIComponent(filter)}`)
  const dup = reports.find((r) => (r.description || '').includes(MARKER))
  if (dup) throw new Error(`Duplicate report today: ${dup.name} (${dup.id})`)
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
  const out = path.join(ORDERS_DIR, `GENOSYS_Yelizaveta_Nabieva_Consignment_Sales_${reportName}.pdf`)
  fs.writeFileSync(out, buf)
  return { out, bytes: buf.length }
}

async function main() {
  console.log('====================================================================')
  console.log('  Yelizaveta Nabieva — consignment report + partial payment 1,050')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [agent, contract] = await Promise.all([
    api('GET', `/entity/counterparty/${AGENT_ID}`),
    api('GET', `/entity/contract/${CONTRACT_ID}`),
  ])
  console.log(`  Customer: ${agent.name}`)
  console.log(`  Agreement: ${contract.name}`)

  console.log('\n  Computing on-hand from ledger (contract 00038)...')
  const stock = await fetchStockByCode()
  const lines = await resolveOnHandLines(stock)
  if (!lines.length) throw new Error('No on-hand consignment lines — nothing to report')

  let totalMinor = 0
  let totalQty = 0
  console.log('\n  Sold lines (full remainder on books):')
  for (const line of lines) {
    const lineMinor = line.price * line.qty
    totalMinor += lineMinor
    totalQty += line.qty
    console.log(
      `    ${line.code} ${(line.name || '').slice(0, 52)} x${line.qty} @ ${money(line.price)} = ${money(lineMinor)}`
    )
  }
  console.log(`  Report total: ${money(totalMinor)} AED | ${totalQty} pcs | ${lines.length} lines`)
  console.log(`  Payment today: ${money(PARTIAL_PAYMENT_MINOR)} AED`)
  console.log(`  Open balance: ${money(totalMinor - PARTIAL_PAYMENT_MINOR)} AED`)

  if (PARTIAL_PAYMENT_MINOR >= totalMinor) {
    throw new Error('Partial payment must be less than report total')
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  await ensureNoDuplicate()

  const t0 = uaeMomentNow()
  const t1 = uaeMomentAddMinutes(2)

  const report = await api('POST', '/entity/commissionreportin', {
    moment: t0,
    applicable: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    contract: href('contract', CONTRACT_ID),
    state: stateHref('commissionreportin', STATE_REPORT_NOT_PAID_ID),
    commissionPeriodStart: t0,
    commissionPeriodEnd: t0,
    rewardType: 'PercentOfSales',
    rewardPercent: 0,
    description: [
      MARKER,
      'Yelizaveta Nabieva Cosmetologist | Agreement 00038.',
      `Consignment sold — full remainder on books (${money(totalMinor)} AED).`,
      `Partial payment ${money(PARTIAL_PAYMENT_MINOR)} AED today; balance open pending full settlement.`,
    ].join('\n'),
    positions: lines.map((line) => ({
      quantity: line.qty,
      price: line.price,
      assortment: href('product', line.productId),
      vat: 5,
      vatEnabled: true,
      reward: 0,
    })),
  })

  console.log(`\n  Report: ${report.name} | ${money(report.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#commissionreport/edit?id=${report.id}`)

  const paymentIn = await api('POST', '/entity/paymentin', {
    moment: t1,
    applicable: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    contract: href('contract', CONTRACT_ID),
    organizationAccount: orgAccountHref(BANK_ACCOUNT_ID),
    description: [
      `Partial payment commissioner report ${report.name} | ${MARKER}`,
      `AED ${money(PARTIAL_PAYMENT_MINOR)} today — balance ${money(totalMinor - PARTIAL_PAYMENT_MINOR)} open.`,
    ].join(' | '),
    sum: PARTIAL_PAYMENT_MINOR,
    operations: [
      {
        meta: {
          href: `${API}/entity/commissionreportin/${report.id}`,
          type: 'commissionreportin',
          mediaType: 'application/json',
        },
        linkedSum: PARTIAL_PAYMENT_MINOR,
      },
    ],
  })

  console.log(`  Payment: ${paymentIn.name} | ${money(paymentIn.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#paymentin/edit?id=${paymentIn.id}`)

  const reportAfter = await api('GET', `/entity/commissionreportin/${report.id}`)
  console.log('\n  Verification:')
  console.log(`    payedSum: ${money(reportAfter.payedSum)} / ${money(reportAfter.sum)} AED`)
  console.log(`    open: ${money((reportAfter.sum || 0) - (reportAfter.payedSum || 0))} AED`)

  if (EXPORT_PDF) {
    const pdf = await exportCommissionSalesPdf(report.id, report.name)
    console.log(`  PDF: ${pdf.out} (${pdf.bytes} bytes)`)
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
