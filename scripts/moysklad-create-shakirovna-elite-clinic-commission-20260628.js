#!/usr/bin/env node

/**
 * Shakirovna Business Bay — consignment sold 07.06.2026–27.06.2026.
 * ELITE SHAKIROVNA LADIES SALON (contract 21) + SHAKIROVNA ESTHETIC CLINIC (contract 26).
 *
 * Creates: commissioner report + matching Отгрузка per site.
 *
 *   node --import dotenv/config scripts/moysklad-create-shakirovna-elite-clinic-commission-20260628.js
 *   node --import dotenv/config scripts/moysklad-create-shakirovna-elite-clinic-commission-20260628.js --commit
 *   node --import dotenv/config scripts/moysklad-create-shakirovna-elite-clinic-commission-20260628.js --commit --report=elite
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

const ARG_REPORT = (() => {
  const a = process.argv.find((x) => x.startsWith('--report='))
  return a ? a.split('=')[1] : 'all'
})()

const COMMON = {
  date: uaeToday(),
  moment: uaeMomentNow(),
  organizationId: 'e18525a4-33c5-11ea-0a80-043f000b2738',
  storeId: 'e186d449-33c5-11ea-0a80-043f000b273a',
  stateNotPaidId: '3203736c-c43b-11eb-0a80-093a002b59a6',
  stateShippedId: '50d70717-4582-11ea-0a80-05e3001273a2',
  commissionPeriodStart: '2026-06-07 00:00:00',
  commissionPeriodEnd: '2026-06-27 23:59:59',
}

const MARKER_BASE = 'Shakirovna ELITE+CLINIC consignment sold 2026-06-07 to 2026-06-27'

const FALLBACK = {
  elite: {
    agentId: null,
    contractId: 'c24b0b09-5e34-11f0-0a80-1b1c0008232a', // agreement 21
  },
  clinic: {
    agentId: 'a187255f-a9b6-11f0-0a80-09900022125b',
    contractId: 'd08f670e-b993-11f0-0a80-19750031f04a', // agreement 26
  },
}

const SITES = [
  {
    key: 'elite',
    title: 'ELITE SHAKIROVNA LADIES SALON L.L.C',
    exactName: 'ELITE SHAKIROVNA LADIES SALON L.L.C',
    marker: `${MARKER_BASE} — ELITE SALON`,
    lines: [
      ['54473', 2], // Revita Glow BB #02 Natural 50g
      ['00012', 1], // Peptide Gel Mask 39g (sheet 38g)
      ['00129', 1], // EPI Turnover Boosting Peeling Gel 100g
      ['00144', 2], // Skin Caring Blemish Balm Cushion #2 Beige
      ['00041', 2], // Multi Sun Cream SPF40 40ml
      ['00140', 3], // Soothing Bomb Sea Algae Mask 23g (sheet 25g)
      ['00063', 5], // Intensive Repair Collagen Mask 23g
      ['54464', 2], // Skin Caring Blemish Balm Cushion #3 Camel
    ],
  },
  {
    key: 'clinic',
    title: 'SHAKIROVNA ESTHETIC CLINIC L.L.C',
    exactName: 'SHAKIROVNA ESTHETIC CLINIC L.L.C',
    marker: `${MARKER_BASE} — ESTHETIC CLINIC`,
    lines: [
      ['00144', 1], // Skin Caring Blemish Balm Cushion #2 Beige
      ['00053', 1], // EyeCell Eye Peptide Gel Patch (box)
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

async function ensureNoDuplicate(agentId, marker, entityType) {
  const filter = [
    `agent=${API}/entity/counterparty/${agentId}`,
    `moment>=${COMMON.date} 00:00:00`,
    `moment<=${COMMON.date} 23:59:59`,
  ].join(';')
  const docs = await fetchAll(`/entity/${entityType}?filter=${encodeURIComponent(filter)}`)
  const dup = docs.find((d) => (d.description || '').includes(marker))
  if (dup) throw new Error(`Duplicate ${entityType} (${dup.name}, id=${dup.id})`)
}

function resolveLines(stock, lineTuples, checkStock) {
  return lineTuples.map(([code, qty]) => {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    if (!item.price) throw new Error(`No salePrice for ${code}`)
    if (checkStock && item.available < qty) {
      throw new Error(`Insufficient stock ${code}: need ${qty}, have ${item.available}`)
    }
    return { ...item, qty }
  })
}

function printLines(resolved) {
  let sumMinor = 0
  let totalQty = 0
  for (const line of resolved) {
    sumMinor += line.qty * line.price
    totalQty += line.qty
    console.log(
      `    ${line.code} ${line.name.slice(0, 58)} x${line.qty} @ ${money(line.price)} = ${money(line.qty * line.price)} AED`
    )
  }
  console.log(`  Total: ${money(sumMinor)} AED | ${totalQty} units | ${resolved.length} lines`)
  return sumMinor
}

function reportPositions(resolved) {
  return resolved.map((line) => ({
    quantity: line.qty,
    price: line.price,
    assortment: href('product', line.id),
    vat: 5,
    vatEnabled: true,
    reward: 0,
  }))
}

function demandPositions(resolved) {
  return resolved.map((line) => ({
    quantity: line.qty,
    price: line.price,
    assortment: href('product', line.id),
    vat: 5,
    vatEnabled: true,
  }))
}

async function fetchReportLines(reportId) {
  const pos = await api('GET', `/entity/commissionreportin/${reportId}/positions?expand=assortment`)
  return (pos.rows || []).map((p) => ({
    code: p.assortment?.code,
    qty: Number(p.quantity),
    price: Number(p.price),
  }))
}

function verifyReportVsResolved(cfg, resolved, reportRows) {
  const expected = new Map(cfg.lines.map(([code, qty]) => [code, qty]))
  const fromReport = new Map()
  for (const r of reportRows) {
    if (!r.code) throw new Error('Report position missing code')
    fromReport.set(r.code, (fromReport.get(r.code) || 0) + r.qty)
  }
  for (const [code, qty] of expected) {
    if (fromReport.get(code) !== qty) {
      throw new Error(`Qty mismatch ${code}: expected ${qty}, report ${fromReport.get(code)}`)
    }
  }
  for (const line of resolved) {
    const rep = reportRows.find((r) => r.code === line.code)
    if (!rep) throw new Error(`Report missing line ${line.code}`)
    if (rep.price !== line.price) {
      throw new Error(`Price mismatch ${line.code}: stock ${money(line.price)} vs report ${money(rep.price)}`)
    }
  }
}

const filtered = ARG_REPORT === 'all' ? SITES : SITES.filter((s) => s.key === ARG_REPORT)

if (!filtered.length) {
  console.error(`Unknown --report=${ARG_REPORT} (elite|clinic|all)`)
  process.exit(1)
}

async function main() {
  console.log('====================================================================')
  console.log('  Shakirovna Elite + Clinic — consignment 07.06–27.06.2026')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Period: ${COMMON.commissionPeriodStart} → ${COMMON.commissionPeriodEnd}`)

  const stock = await fetchStockByCode()
  const results = []

  for (const cfg of filtered) {
    console.log('\n--------------------------------------------------------------------')
    console.log(`  ${cfg.title}`)
    console.log('--------------------------------------------------------------------')

    const { agentId, contractId } = await resolveAgentAndContract(cfg)
    const [agent, contract] = await Promise.all([
      api('GET', `/entity/counterparty/${agentId}`),
      api('GET', `/entity/contract/${contractId}`),
    ])
    console.log(`  Customer: ${agent.name}`)
    console.log(`  Contract: ${contract.name} (${contractId})`)

    const resolved = resolveLines(stock, cfg.lines, false)
    printLines(resolved)

    if (!COMMIT) {
      console.log('  DRY RUN — add --commit to post report + demand')
      continue
    }

    await ensureNoDuplicate(agentId, cfg.marker, 'commissionreportin')
    await ensureNoDuplicate(agentId, cfg.marker, 'demand')

    const report = await api('POST', '/entity/commissionreportin', {
      moment: COMMON.moment,
      applicable: true,
      vatEnabled: true,
      vatIncluded: true,
      organization: href('organization', COMMON.organizationId),
      agent: href('counterparty', agentId),
      contract: href('contract', contractId),
      state: stateHref('commissionreportin', COMMON.stateNotPaidId),
      commissionPeriodStart: COMMON.commissionPeriodStart,
      commissionPeriodEnd: COMMON.commissionPeriodEnd,
      rewardType: 'PercentOfSales',
      rewardPercent: 0,
      description: [
        cfg.marker,
        `Sold table 07.06.2026–27.06.2026 Business Bay — ${cfg.title}.`,
        'Sea algae mask table 25g → catalog 00140 23g.',
      ].join('\n'),
      positions: reportPositions(resolved),
    })

    const reportRows = await fetchReportLines(report.id)
    const forDemand = resolveLines(stock, cfg.lines, true)
    verifyReportVsResolved(cfg, forDemand, reportRows)
    console.log(`  Report ${report.name}: ${money(report.sum)} AED — verify OK`)

    const demandMarker = `${cfg.marker} — demand matching report ${report.name}`
    const demand = await api('POST', '/entity/demand', {
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
        demandMarker,
        `Same lines as commissioner report ${report.name} (07.06.2026–27.06.2026).`,
      ].join('\n'),
      positions: demandPositions(forDemand),
    })

    console.log(`  Demand ${demand.name}: ${money(demand.sum)} AED`)
    console.log(`  Report: https://online.moysklad.ru/app/#commissionreport/edit?id=${report.id}`)
    console.log(`  Demand: https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)

    results.push({
      site: cfg.key,
      reportName: report.name,
      reportId: report.id,
      reportSum: money(report.sum),
      demandName: demand.name,
      demandId: demand.id,
      demandSum: money(demand.sum),
      lines: cfg.lines.length,
      units: cfg.lines.reduce((s, [, q]) => s + q, 0),
    })
  }

  if (COMMIT && results.length) {
    console.log('\n=== SUMMARY ===')
    for (const r of results) {
      console.log(
        `${r.site}: report ${r.reportName} (${r.reportSum} AED) + demand ${r.demandName} (${r.demandSum} AED)`
      )
    }
    console.log(JSON.stringify(results, null, 2))
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
