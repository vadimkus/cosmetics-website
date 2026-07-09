#!/usr/bin/env node

/**
 * Serene Skin Beauty — fix consignment stock vs physical count (2026-07-03).
 *
 * Root cause:
 *   • Erroneous commission report 01399 (8628 AED, 29 lines) zeroed book stock.
 *   • Morning return 00302 + loss 00008-00458 assumed wrong physical (items still on shelf).
 *
 * Physical count (salon):
 *   00021 x3, 00035 x2, 00040 x1, 00041 x1, 00144 x2, 00195 x0, 54457 x1
 *
 * Fix:
 *   1) Delete report 01399, return 00302, loss 00008-00458
 *   2) Commissioner report — unreported sales: 00021 x1, 00035 x1, 00040 x1
 *   3) Return + loss — hyaluron 00195 x1 (not on shelf)
 *   Keep demand 06466 (SPF40 surplus from earlier recon).
 *
 *   node --import dotenv/config scripts/moysklad-fix-serene-skin-stock-adjust-20260703.js
 *   node --import dotenv/config scripts/moysklad-fix-serene-skin-stock-adjust-20260703.js --commit
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

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'
const AGENT_ID = '993395aa-8da2-11ec-0a80-006b0038cd99'
const CONTRACT_ID = 'dc5c469a-d943-11ed-0a80-05bd0013eb27'
const STATE_SHIPPED_ID = '50d70717-4582-11ea-0a80-05e3001273a2'
const STATE_RETURN_ID = 'f793c585-01bb-11f1-0a80-1ac1000b5df5'
const STATE_REPORT_ID = '3203736c-c43b-11eb-0a80-093a002b59a6'

const MARKER = 'SERENE-SKIN-STOCK-ADJUST-2026-07-03'
const CONSIGNMENT_REPORT_TEMPLATE = '26c9d8c4-999b-407b-8038-4d6400eb6322'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')

const DELETE_REPORT = { name: '01399', id: '483727a6-76d2-11f1-0a80-152e000c6584' }
const DELETE_RETURN = { name: '00302', id: 'fe8e89c8-76b3-11f1-0a80-0d9f001185f2' }
const DELETE_LOSS = { name: '00008-00458', id: 'fee06b58-76b3-11f1-0a80-08c20010d53e' }

const SALE_DEMAND_NAMES = new Set(['06271', '06436'])
const TARGET = {
  '00021': 3,
  '00035': 2,
  '00040': 1,
  '00041': 1,
  '00144': 2,
  '00195': 0,
  '54457': 1,
}

/** [code, qty, label] — book high vs physical → sold */
const SOLD_LINES = [
  ['00021', 1, 'Snow O₂ Cleanser 180ml'],
  ['00035', 1, 'Intensive Problem Control Cream 50g'],
  ['00040', 1, 'Intensive Blemish Balm Cream 50g'],
]

const LOST_LINES = [['00195', 1, 'Moisture Replenishing Hyaluron Serum 30ml']]

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
      price: Number(row.salePrice || 0),
    })
  }
  return stock
}

async function verifyDoc(name, id, entity, agentName) {
  const doc = await api('GET', `/entity/${entity}/${id}?expand=agent`)
  if (doc.name !== name) throw new Error(`${entity} ${id} name is ${doc.name}, expected ${name}`)
  if (agentName && doc.agent?.name !== agentName) {
    throw new Error(`${entity} ${name} agent is ${doc.agent?.name}, expected ${agentName}`)
  }
  return doc
}

async function ensureNoDuplicate(entity, marker) {
  const filter = [
    `agent=${API}/entity/counterparty/${AGENT_ID}`,
    `moment>=${uaeToday()} 00:00:00`,
    `moment<=${uaeToday()} 23:59:59`,
  ].join(';')
  const docs = await fetchAll(`/entity/${entity}?filter=${encodeURIComponent(filter)}`)
  const dup = docs.find((d) => (d.description || '').includes(marker))
  if (dup) throw new Error(`Duplicate ${entity} ${dup.name} already posted today`)
}

function resolveLines(stock, lines) {
  return lines.map(([code, qty, label]) => {
    const row = stock.get(code)
    if (!row?.id) throw new Error(`Unknown code: ${code}`)
    if (!row.price) throw new Error(`No salePrice for ${code}`)
    return { ...row, qty, label }
  })
}

async function resolveLostLines(stock) {
  const resolved = []
  for (const [code, qty, label] of LOST_LINES) {
    const row = stock.get(code)
    if (!row?.id) throw new Error(`Unknown code: ${code}`)
    const p = await api('GET', `/entity/product/${row.id}`)
    const buyMinor = p.buyPrice?.value ?? 0
    resolved.push({ ...row, qty, label, buyMinor, returnPrice: row.price })
  }
  return resolved
}

async function verifyBalances() {
  const agentHref = `${API}/entity/counterparty/${AGENT_ID}`
  const contractHref = `${API}/entity/contract/${CONTRACT_ID}`
  const filter = encodeURIComponent(`agent=${agentHref};contract=${contractHref}`)

  const demands = await fetchAll(`/entity/demand?filter=${filter}`)
  const reports = await fetchAll(`/entity/commissionreportin?filter=${filter}`)
  const returns = await fetchAll(
    `/entity/salesreturn?filter=${encodeURIComponent(`agent=${agentHref}`)}`
  )

  const cache = new Map()
  async function assortment(ref) {
    const h = ref?.meta?.href
    if (!h) return {}
    if (!cache.has(h)) cache.set(h, api('GET', h.replace(API, '')))
    return cache.get(h)
  }

  const map = new Map()
  async function addFrom(entity, id, field) {
    const pos = await fetchAll(`/entity/${entity}/${id}/positions`)
    for (const p of pos) {
      const a = await assortment(p.assortment)
      if (!a.code || !(a.code in TARGET)) continue
      if (!map.has(a.code)) map.set(a.code, { in: 0, sold: 0, ret: 0 })
      map.get(a.code)[field] += Number(p.quantity)
    }
  }

  for (const d of demands) {
    if (SALE_DEMAND_NAMES.has(d.name)) continue
    await addFrom('demand', d.id, 'in')
  }
  for (const r of reports) await addFrom('commissionreportin', r.id, 'sold')
  for (const r of returns) await addFrom('salesreturn', r.id, 'ret')

  console.log('\n  Balance check (book vs physical):')
  let ok = true
  for (const [code, target] of Object.entries(TARGET)) {
    const r = map.get(code) || { in: 0, sold: 0, ret: 0 }
    const book = r.in - r.sold - r.ret
    const match = book === target
    if (!match) ok = false
    console.log(`    ${code} book ${book} target ${target} ${match ? 'OK' : 'MISMATCH'}`)
  }
  if (!ok) throw new Error('Post-commit balance check failed')
}

async function exportConsignmentReportPdf() {
  const body = {
    template: {
      meta: {
        href: `${API}/entity/commissionreportin/metadata/customtemplate/${CONSIGNMENT_REPORT_TEMPLATE}`,
        type: 'customtemplate',
        mediaType: 'application/json',
      },
    },
    extension: 'pdf',
  }
  const res = await fetch(`${API}/entity/contract/${CONTRACT_ID}/export`, {
    method: 'POST',
    headers: { Authorization: AUTH, Accept: '*/*', 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    redirect: 'manual',
  })
  if (res.status !== 302 && res.status !== 303) {
    throw new Error(`Consignment report export ${res.status}: ${(await res.text()).slice(0, 400)}`)
  }
  const location = res.headers.get('location')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  const buf = Buffer.from(await pdfRes.arrayBuffer())
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const out = path.join(ORDERS_DIR, 'GENOSYS_Serene_Skin_Consignment_Report_00060.pdf')
  fs.writeFileSync(out, buf)
  return { out, bytes: buf.length }
}

async function main() {
  console.log('====================================================================')
  console.log('  Serene Skin — stock adjust to physical count')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Marker: ${MARKER}`)

  const report = await verifyDoc(
    DELETE_REPORT.name,
    DELETE_REPORT.id,
    'commissionreportin',
    'Serene Skin Beauty Salon LLC'
  )
  await verifyDoc(DELETE_RETURN.name, DELETE_RETURN.id, 'salesreturn', 'Serene Skin Beauty Salon LLC')
  await verifyDoc(DELETE_LOSS.name, DELETE_LOSS.id, 'loss', null)

  console.log(`\n  Delete erroneous report ${report.name} | ${money(report.sum)} AED`)
  console.log(`  Delete wrong return ${DELETE_RETURN.name} + loss ${DELETE_LOSS.name}`)

  const stock = await fetchStockByCode()
  const soldResolved = resolveLines(stock, SOLD_LINES)
  const lostResolved = await resolveLostLines(stock)

  console.log('\n  Sold (commission report):')
  let soldMinor = 0
  for (const line of soldResolved) {
    soldMinor += line.price * line.qty
    console.log(`    ${line.code} x${line.qty} @ ${money(line.price)}`)
  }
  console.log(`    Total: ${money(soldMinor)} AED`)

  console.log('\n  Lost (return + loss @ buy):')
  for (const line of lostResolved) {
    console.log(`    ${line.code} x${line.qty} return ${money(line.returnPrice)} | buy ${money(line.buyMinor)}`)
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  await ensureNoDuplicate('commissionreportin', MARKER)
  await ensureNoDuplicate('salesreturn', MARKER)
  await ensureNoDuplicate('loss', MARKER)

  console.log('\n  Step 1: delete wrong docs')
  await api('DELETE', `/entity/loss/${DELETE_LOSS.id}`)
  await api('DELETE', `/entity/salesreturn/${DELETE_RETURN.id}`)
  await api('DELETE', `/entity/commissionreportin/${DELETE_REPORT.id}`)

  const reportMoment = uaeMomentNow()
  const returnMoment = uaeMomentAddMinutes(2)
  const lossMoment = uaeMomentAddMinutes(4)
  const periodEnd = `${uaeToday()} 23:59:59`

  console.log('  Step 2: commission report (unreported sales)')
  const newReport = await api('POST', '/entity/commissionreportin', {
    moment: reportMoment,
    applicable: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    contract: href('contract', CONTRACT_ID),
    state: stateHref('commissionreportin', STATE_REPORT_ID),
    commissionPeriodStart: reportMoment,
    commissionPeriodEnd: periodEnd,
    rewardType: 'PercentOfSales',
    rewardPercent: 0,
    description: [
      MARKER,
      'Physical stock recon Jul 2026 — unreported sales vs book.',
      'Cleanser x1, PCC cream x1, blemish balm x1.',
    ].join('\n'),
    positions: soldResolved.map((line) => ({
      quantity: line.qty,
      price: line.price,
      assortment: href('product', line.id),
      vat: 5,
      vatEnabled: true,
      reward: 0,
    })),
  })
  console.log(`    Report ${newReport.name} | ${money(newReport.sum)} AED`)
  console.log(`    https://online.moysklad.ru/app/#commissionreport/edit?id=${newReport.id}`)

  console.log('  Step 3: hyaluron lost (return + loss)')
  const salesReturn = await api('POST', '/entity/salesreturn', {
    applicable: true,
    moment: returnMoment,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    contract: href('contract', CONTRACT_ID),
    store: href('store', STORE_ID),
    state: stateHref('salesreturn', STATE_RETURN_ID),
    description: [MARKER, 'Hyaluron serum x1 — not on shelf (not sold).'].join('\n'),
    positions: lostResolved.map((line) => ({
      quantity: line.qty,
      price: line.returnPrice,
      assortment: href('product', line.id),
      vat: 5,
      vatEnabled: true,
    })),
  })
  console.log(`    Return ${salesReturn.name} | ${money(salesReturn.sum)} AED`)

  const lossDoc = await api('POST', '/entity/loss', {
    applicable: true,
    moment: lossMoment,
    organization: href('organization', ORG_ID),
    store: href('store', STORE_ID),
    description: [MARKER, 'Consignment loss hyaluron x1 @ buyPrice. Not billed.'].join('\n'),
    positions: lostResolved.map((line) => ({
      quantity: line.qty,
      price: line.buyMinor,
      assortment: href('product', line.id),
      vat: 0,
      vatEnabled: false,
    })),
  })
  console.log(`    Loss ${lossDoc.name} | buy ${money(lossDoc.sum || 0)} AED`)

  await verifyBalances()

  console.log('\n  Step 4: consignment report PDF')
  const pdf = await exportConsignmentReportPdf()
  console.log(`    ${pdf.out} (${pdf.bytes} bytes)`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
