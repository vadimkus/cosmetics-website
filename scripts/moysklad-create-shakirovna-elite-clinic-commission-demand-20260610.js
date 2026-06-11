#!/usr/bin/env node

/**
 * Shakirovna Elite + Clinic — Отгрузка (demand) matching commissioner reports 01374 / 01375.
 * Period on reports: 11.05.2026–07.06.2026 (API may show 06.06 end).
 *
 *   node --import dotenv/config scripts/moysklad-create-shakirovna-elite-clinic-commission-demand-20260610.js
 *   node --import dotenv/config scripts/moysklad-create-shakirovna-elite-clinic-commission-demand-20260610.js --commit
 *   node --import dotenv/config scripts/moysklad-create-shakirovna-elite-clinic-commission-demand-20260610.js --commit --report=elite
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
const VERIFY_REPORTS = !process.argv.includes('--skip-verify')

const ARG_REPORT = (() => {
  const a = process.argv.find((x) => x.startsWith('--report='))
  return a ? a.split('=')[1] : 'all'
})()

const COMMON = {
  date: uaeToday(),
  moment: uaeMomentNow(),
  organizationId: 'e18525a4-33c5-11ea-0a80-043f000b2738',
  storeId: 'e186d449-33c5-11ea-0a80-043f000b273a',
  stateShippedId: '50d70717-4582-11ea-0a80-05e3001273a2',
}

const FALLBACK = {
  elite: {
    agentId: null,
    contractId: 'c24b0b09-5e34-11f0-0a80-1b1c0008232a',
  },
  clinic: {
    agentId: 'a187255f-a9b6-11f0-0a80-09900022125b',
    contractId: 'd08f670e-b993-11f0-0a80-19750031f04a',
  },
}

const MARKER_BASE = 'Shakirovna ELITE+CLINIC commission demand matching report 01374/01375 2026-06-10'

const DEMANDS = [
  {
    key: 'elite',
    title: 'ELITE SHAKIROVNA LADIES SALON L.L.C',
    exactName: 'ELITE SHAKIROVNA LADIES SALON L.L.C',
    commissionReportName: '01374',
    marker: `${MARKER_BASE} — report 01374`,
    lines: [
      ['00053', 1],
      ['00189', 1],
      ['00144', 3],
      ['54464', 1],
      ['00021', 3],
      ['00063', 1],
      ['00140', 4],
    ],
  },
  {
    key: 'clinic',
    title: 'SHAKIROVNA ESTHETIC CLINIC L.L.C',
    exactName: 'SHAKIROVNA ESTHETIC CLINIC L.L.C',
    commissionReportName: '01375',
    marker: `${MARKER_BASE} — report 01375`,
    lines: [
      ['00122', 1],
      ['00144', 1],
      ['54464', 1],
      ['00021', 1],
      ['00145', 1],
      ['00029', 1],
    ],
  },
]

async function api(method, pathStr, body) {
  const res = await fetch(pathStr.startsWith('http') ? pathStr : API + pathStr, {
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
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1200)}`)
  return text ? JSON.parse(text) : null
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
  return ((minor || 0) / 100).toFixed(2)
}

async function findCounterpartyByExactName(exactName) {
  const token = exactName.split(/\s+/)[0]
  const data = await api('GET', `/entity/counterparty?limit=100&search=${encodeURIComponent(token)}`)
  const hit = (data?.rows || []).find((r) => r.name === exactName)
  if (!hit) throw new Error(`Counterparty not found: "${exactName}"`)
  return hit
}

function isCommissionContract(c) {
  const t = c.contractType || c.type
  return t === 'Commission' || String(t).toLowerCase() === 'commission'
}

async function findCommissionContractId(agentId) {
  const filter = `agent=${API}/entity/counterparty/${agentId}`
  const data = await api('GET', `/entity/contract?filter=${encodeURIComponent(filter)}&limit=100`)
  const rows = data?.rows || []
  const comm = rows.filter(isCommissionContract)
  const pick = (list) => {
    if (!list.length) return null
    if (list.length === 1) return list[0].id
    list.sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'ru'))
    return list[0].id
  }
  return pick(comm.length ? comm : rows)
}

async function resolveAgentAndContract(cfg) {
  const fb = FALLBACK[cfg.key]
  const agent = fb?.agentId ? { id: fb.agentId } : await findCounterpartyByExactName(cfg.exactName)
  const contractId = fb?.contractId || (await findCommissionContractId(agent.id))
  if (!contractId) throw new Error(`No commission contract for ${cfg.exactName}`)
  return { agentId: agent.id, contractId }
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
      available: Number(row.stock || 0) - Number(row.reserve || 0),
      price: Number(row.salePrice || 0),
    })
  }
  return stock
}

async function ensureNoDuplicateDemand(agentId, marker, date) {
  const filter = [
    `agent=${API}/entity/counterparty/${agentId}`,
    `moment>=${date} 00:00:00`,
    `moment<=${date} 23:59:59`,
  ].join(';')
  const docs = await fetchAll(`/entity/demand?filter=${encodeURIComponent(filter)}`)
  const dup = docs.find((d) => (d.description || '').includes(marker))
  if (dup) throw new Error(`Duplicate Отгрузка with marker (${dup.name}, id=${dup.id})`)
}

function resolveLines(stock, lineTuples) {
  return lineTuples.map(([code, qty]) => {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown product code: ${code}`)
    if (!item.price) throw new Error(`No salePrice for ${code}`)
    if (item.available < qty) {
      throw new Error(`Insufficient stock ${code}: need ${qty}, have ${item.available}`)
    }
    return { ...item, qty }
  })
}

function positionsFromResolved(resolved) {
  return resolved.map((line) => ({
    quantity: line.qty,
    price: line.price,
    assortment: href('product', line.id),
    vat: 5,
    vatEnabled: true,
  }))
}

function lineKey(code, qty, priceMinor) {
  return `${code}:${qty}:${priceMinor}`
}

async function fetchCommissionReportLines(reportName) {
  const data = await api('GET', `/entity/commissionreportin?search=${encodeURIComponent(reportName)}`)
  const doc = (data?.rows || []).find((r) => r.name === reportName)
  if (!doc) throw new Error(`Commission report ${reportName} not found`)
  const pos = await api('GET', `/entity/commissionreportin/${doc.id}/positions?expand=assortment`)
  const rows = (pos.rows || []).map((p) => ({
    code: p.assortment?.code,
    qty: Number(p.quantity),
    price: Number(p.price),
  }))
  return { doc, rows }
}

function verifyAgainstReport(cfg, resolved, reportRows) {
  const expected = new Map(cfg.lines.map(([code, qty]) => [code, qty]))
  const fromReport = new Map()
  for (const r of reportRows) {
    if (!r.code) throw new Error(`Report ${cfg.commissionReportName} position missing code`)
    fromReport.set(r.code, (fromReport.get(r.code) || 0) + r.qty)
  }
  for (const [code, qty] of expected) {
    if (fromReport.get(code) !== qty) {
      throw new Error(
        `Qty mismatch ${code}: script ${qty} vs report ${fromReport.get(code)} (${cfg.commissionReportName})`
      )
    }
  }
  for (const line of resolved) {
    const rep = reportRows.find((r) => r.code === line.code)
    if (!rep) throw new Error(`Report ${cfg.commissionReportName} missing line ${line.code}`)
    if (rep.price !== line.price) {
      throw new Error(
        `Price mismatch ${line.code}: stock ${money(line.price)} vs report ${money(rep.price)}`
      )
    }
  }
}

const filtered = ARG_REPORT === 'all' ? DEMANDS : DEMANDS.filter((d) => d.key === ARG_REPORT)

if (!filtered.length) {
  console.error(`Unknown --report=${ARG_REPORT} (elite|clinic|all)`)
  process.exit(1)
}

async function main() {
  console.log('====================================================================')
  console.log('  Shakirovna Elite + Clinic — demand matching reports 01374 / 01375')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Date: ${COMMON.date}`)

  const stock = await fetchStockByCode()

  for (const cfg of filtered) {
    console.log('\n--------------------------------------------------------------------')
    console.log(`  ${cfg.title} — report ${cfg.commissionReportName}`)
    console.log('--------------------------------------------------------------------')

    if (VERIFY_REPORTS) {
      const { doc, rows } = await fetchCommissionReportLines(cfg.commissionReportName)
      console.log(`  Verified report ${doc.name}: ${money(doc.sum)} AED, ${rows.length} lines`)
    }

    const { agentId, contractId } = await resolveAgentAndContract(cfg)
    const [agent, contract] = await Promise.all([
      api('GET', `/entity/counterparty/${agentId}`),
      api('GET', `/entity/contract/${contractId}`),
    ])
    console.log(`  Customer: ${agent.name}`)
    console.log(`  Contract: ${contract.name} (${contractId})`)

    const resolved = resolveLines(stock, cfg.lines)
    if (VERIFY_REPORTS) {
      const { rows } = await fetchCommissionReportLines(cfg.commissionReportName)
      verifyAgainstReport(cfg, resolved, rows)
      console.log('  Report line/qty/price check: OK')
    }

    let sumMinor = 0
    let totalQty = 0
    for (const line of resolved) {
      sumMinor += line.price * line.qty
      totalQty += line.qty
      console.log(
        `    ${line.code} ${line.name.slice(0, 55)} x${line.qty} @ ${money(line.price)} = ${money(line.qty * line.price)} AED`
      )
    }
    console.log(`  Total: ${money(sumMinor)} AED | ${totalQty} pcs | ${resolved.length} lines`)

    if (COMMIT) await ensureNoDuplicateDemand(agentId, cfg.marker, COMMON.date)

    const payload = {
      moment: COMMON.moment,
      applicable: true,
      vatEnabled: true,
      vatIncluded: true,
      organization: href('organization', COMMON.organizationId),
      agent: href('counterparty', agentId),
      contract: href('contract', contractId),
      store: href('store', COMMON.storeId),
      state: stateHref('demand', COMMON.stateShippedId),
      description: [
        cfg.marker,
        `Same lines as commissioner report ${cfg.commissionReportName} (11.05.2026–07.06.2026).`,
      ].join('\n'),
      positions: positionsFromResolved(resolved),
    }

    if (!COMMIT) {
      console.log('  DRY RUN — add --commit to create')
      continue
    }

    const created = await api('POST', '/entity/demand', payload)
    const readback = await fetchAll(`/entity/demand/${created.id}/positions`)
    console.log(`  Created Отгрузка: ${created.name} | ${money(created.sum)} AED | lines=${readback.length}`)
    console.log(`  UI: https://online.moysklad.ru/app/#demand/edit?id=${created.id}`)
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
