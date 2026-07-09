#!/usr/bin/env node

/**
 * Serene Skin Beauty — FINAL consignment recon vs full physical count (2026-07-03).
 *
 * Context: an earlier fix wrongly EXCLUDED shipments 06271/06436 as "settlement
 * mirrors". They are REAL shipments (sea algae masks x10, Revita BB creams x3+x3,
 * makeup remover, microbiome mist). The salon confirmed it HAS those items, so the
 * full ledger (no exclusions) is the correct base. Only 3 SKUs remain over-counted.
 *
 * Full physical count (salon, both messages 2026-07-03):
 *   00021 x3, 00035 x2, 00040 x1, 00041 x1, 00144 x2, 00195 x0, 54457 x1,
 *   54461 x3, 00188 x5, 00140 x10, 54472 x3, 54473 x3
 *
 * Remaining discrepancies (full ledger vs physical):
 *   00041 SPF40   book 3 -> 1  (delete erroneous demand 06466 +1, report 1 sold)
 *   00144 cushion book 3 -> 2  (report 1 sold)
 *   54457 SPF50   book 2 -> 1  (report 1 sold)
 *
 * Fix:
 *   1) Delete demand 06466 (phantom SPF40 surplus from morning recon)
 *   2) Commission report — unreported sales: 00041 x1, 00144 x1, 54457 x1
 *   3) Verify FULL ledger (all demands) == full physical
 *
 *   node --import dotenv/config scripts/moysklad-fix-serene-skin-final-recon-20260703.js
 *   node --import dotenv/config scripts/moysklad-fix-serene-skin-final-recon-20260703.js --commit
 */

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

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const AGENT_ID = '993395aa-8da2-11ec-0a80-006b0038cd99'
const CONTRACT_ID = 'dc5c469a-d943-11ed-0a80-05bd0013eb27'
const STATE_REPORT_ID = '3203736c-c43b-11eb-0a80-093a002b59a6'

const MARKER = 'SERENE-SKIN-FINAL-RECON-2026-07-03'

const DELETE_DEMAND = { name: '06466', id: 'ff188de6-76b3-11f1-0a80-0c6400116710' }

/** [code, qty, label] — shipped, now gone from shelf → unreported sale */
const SOLD_LINES = [
  ['00041', 1, 'Multi Sun Cream SPF40/PA++ 40g'],
  ['00144', 1, 'Skin Caring Blemish Balm Cushion #2 Beige'],
  ['54457', 1, 'Ultra Shield Sun Cream SPF50/PA++++ 50g'],
]

/** Full physical count from salon (authoritative). */
const TARGET = {
  '00021': 3,
  '00035': 2,
  '00040': 1,
  '00041': 1,
  '00144': 2,
  '00195': 0,
  '54457': 1,
  '54461': 3,
  '00188': 5,
  '00140': 10,
  '54472': 3,
  '54473': 3,
}

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

const money = (minor) => (minor / 100).toFixed(2)

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

function resolveLines(stock, lines) {
  return lines.map(([code, qty, label]) => {
    const row = stock.get(code)
    if (!row?.id) throw new Error(`Unknown code: ${code}`)
    if (!row.price) throw new Error(`No salePrice for ${code}`)
    return { ...row, qty, label }
  })
}

async function verifyDemand() {
  const doc = await api('GET', `/entity/demand/${DELETE_DEMAND.id}?expand=agent`)
  if (doc.name !== DELETE_DEMAND.name) {
    throw new Error(`demand ${DELETE_DEMAND.id} name is ${doc.name}, expected ${DELETE_DEMAND.name}`)
  }
  if (doc.agent?.name !== 'Serene Skin Beauty Salon LLC') {
    throw new Error(`demand ${DELETE_DEMAND.name} wrong agent: ${doc.agent?.name}`)
  }
  return doc
}

async function ensureNoDuplicate() {
  const filter = [
    `agent=${API}/entity/counterparty/${AGENT_ID}`,
    `moment>=${uaeToday()} 00:00:00`,
    `moment<=${uaeToday()} 23:59:59`,
  ].join(';')
  const docs = await fetchAll(`/entity/commissionreportin?filter=${encodeURIComponent(filter)}`)
  const dup = docs.find((d) => (d.description || '').includes(MARKER))
  if (dup) throw new Error(`Duplicate commission report ${dup.name} already posted today`)
}

/** Full ledger, NO exclusions: Σ demands − Σ reports − Σ returns. */
async function verifyBalances() {
  const agentHref = `${API}/entity/counterparty/${AGENT_ID}`
  const contractHref = `${API}/entity/contract/${CONTRACT_ID}`
  const filter = encodeURIComponent(`agent=${agentHref};contract=${contractHref}`)

  const demands = await fetchAll(`/entity/demand?filter=${filter}`)
  const reports = await fetchAll(`/entity/commissionreportin?filter=${filter}`)
  const returns = await fetchAll(`/entity/salesreturn?filter=${encodeURIComponent(`agent=${agentHref}`)}`)

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

  for (const d of demands) await addFrom('demand', d.id, 'in')
  for (const r of reports) await addFrom('commissionreportin', r.id, 'sold')
  for (const r of returns) await addFrom('salesreturn', r.id, 'ret')

  console.log('\n  Balance check (full ledger vs physical):')
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

async function main() {
  console.log('====================================================================')
  console.log('  Serene Skin — FINAL recon (full physical count)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Marker: ${MARKER}`)

  const demand = await verifyDemand()
  console.log(`\n  Delete phantom demand ${demand.name} | ${money(demand.sum)} AED (SPF40 surplus artifact)`)

  const stock = await fetchStockByCode()
  const soldResolved = resolveLines(stock, SOLD_LINES)
  console.log('\n  Unreported sales (commission report):')
  let soldMinor = 0
  for (const line of soldResolved) {
    soldMinor += line.price * line.qty
    console.log(`    ${line.code} x${line.qty} @ ${money(line.price)}  ${line.label}`)
  }
  console.log(`    Total: ${money(soldMinor)} AED`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  await ensureNoDuplicate()

  console.log('\n  Step 1: delete phantom demand 06466')
  await api('DELETE', `/entity/demand/${DELETE_DEMAND.id}`)

  console.log('  Step 2: commission report (unreported sales)')
  const reportMoment = uaeMomentNow()
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
    commissionPeriodEnd: `${uaeToday()} 23:59:59`,
    rewardType: 'PercentOfSales',
    rewardPercent: 0,
    description: [
      MARKER,
      'Physical stock recon Jul 2026 — unreported sales vs book.',
      'SPF40 x1, BB Cushion #2 Beige x1, SPF50 x1.',
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

  await verifyBalances()
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
