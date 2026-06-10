#!/usr/bin/env node

/**
 * Shakirovna — received commissioner reports (11.05.2026–06.06.2026 sales table).
 *
 *   ELITE SHAKIROVNA LADIES SALON L.L.C   — Salon block (7 lines)
 *   SHAKIROVNA ESTHETIC CLINIC L.L.C      — Clinic block (6 lines)
 *
 *   node --import dotenv/config scripts/moysklad-create-shakirovna-elite-clinic-commission-20260607.js
 *   node --import dotenv/config scripts/moysklad-create-shakirovna-elite-clinic-commission-20260607.js --commit
 *   node --import dotenv/config scripts/moysklad-create-shakirovna-elite-clinic-commission-20260607.js --commit --report=elite
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
  stateNotPaidId: '3203736c-c43b-11eb-0a80-093a002b59a6',
  commissionPeriodStart: '2026-05-11 00:00:00',
  commissionPeriodEnd: '2026-06-06 23:59:59',
}

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

const REPORTS = [
  {
    key: 'elite',
    title: 'ELITE SHAKIROVNA LADIES SALON L.L.C',
    exactName: 'ELITE SHAKIROVNA LADIES SALON L.L.C',
    marker: `Shakirovna ELITE SALON consignment sold 2026-05-11 to 2026-06-06 ${uaeToday()}`,
    lines: [
      ['00053', 1], // EyeCell Eye Peptide Gel Patch (box)
      ['00189', 1], // Skin Rescue Overnight Cream Mask 100g
      ['00144', 3], // Skin Caring Blemish Balm Cushion #2 Beige
      ['54464', 1], // Skin Caring Blemish Balm Cushion #3 Camel
      ['00021', 3], // Snow O2 Cleanser 180ml
      ['00063', 1], // Intensive Repair Collagen Mask 23g
      ['00140', 4], // Soothing Bomb Sea Algae Mask 23g (table 25g → catalog 23g)
    ],
  },
  {
    key: 'clinic',
    title: 'SHAKIROVNA ESTHETIC CLINIC L.L.C',
    exactName: 'SHAKIROVNA ESTHETIC CLINIC L.L.C',
    marker: `Shakirovna ESTHETIC CLINIC consignment sold 2026-05-11 to 2026-06-06 ${uaeToday()}`,
    lines: [
      ['00122', 1], // Multi Vita Radiance Cream 50g
      ['00144', 1], // Skin Caring Blemish Balm Cushion #2 Beige
      ['54464', 1], // Skin Caring Blemish Balm Cushion #3 Camel
      ['00021', 1], // Snow O2 Cleanser 180ml
      ['00145', 1], // Intensive Problem Control Toner 200ml
      ['00029', 1], // Problem Control Serum 30ml
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

async function ensureNoDuplicate(agentId, marker, date) {
  const filter = [
    `agent=${API}/entity/counterparty/${agentId}`,
    `moment>=${date} 00:00:00`,
    `moment<=${date} 23:59:59`,
  ].join(';')
  const reports = await fetchAll(`/entity/commissionreportin?filter=${encodeURIComponent(filter)}`)
  const dup = reports.find((r) => (r.description || '').includes(marker))
  if (dup) throw new Error(`Duplicate report (${dup.name}, id=${dup.id})`)
}

function printLines(resolved) {
  const totalMinor = resolved.reduce((sum, line) => sum + line.qty * line.price, 0)
  const totalQty = resolved.reduce((sum, line) => sum + line.qty, 0)
  console.log()
  for (const line of resolved) {
    console.log(
      `    ${line.code} ${line.name.slice(0, 58)} x${line.qty} @ ${money(line.price)} = ${money(line.qty * line.price)} AED`
    )
  }
  console.log(`  Total: ${money(totalMinor)} AED | ${totalQty} units | ${resolved.length} lines`)
}

function positions(resolved) {
  return resolved.map((line) => ({
    quantity: line.qty,
    price: line.price,
    assortment: href('product', line.id),
    vat: 5,
    vatEnabled: true,
    reward: 0,
  }))
}

const filtered =
  ARG_REPORT === 'all' ? REPORTS : REPORTS.filter((r) => r.key === ARG_REPORT)

if (!filtered.length) {
  console.error(`Unknown --report=${ARG_REPORT} (elite|clinic|all)`)
  process.exit(1)
}

async function main() {
  console.log('====================================================================')
  console.log('  Shakirovna Elite + Clinic — commissioner reports')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Period: ${COMMON.commissionPeriodStart} → ${COMMON.commissionPeriodEnd}`)

  const stock = await fetchStockByCode()

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

    await ensureNoDuplicate(agentId, cfg.marker, COMMON.date)

    const resolved = cfg.lines.map(([code, qty]) => {
      const item = stock.get(code)
      if (!item?.id) throw new Error(`Unknown code: ${code}`)
      if (!item.price) throw new Error(`No salePrice for ${code}`)
      return { ...item, qty }
    })

    printLines(resolved)

    if (!COMMIT) {
      console.log('\n  DRY RUN — re-run with --commit')
      continue
    }

    const created = await api('POST', '/entity/commissionreportin', {
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
        `Sold table 11.05.2026–06.06.2026 for ${cfg.title}.`,
        'Sea algae mask table 25g → catalog 00140 23g.',
      ].join('\n'),
      positions: positions(resolved),
    })
    const readback = await fetchAll(`/entity/commissionreportin/${created.id}/positions`)
    console.log(`\n  Report: ${created.name} | ${money(created.sum)} AED | lines=${readback.length}`)
    console.log(`  https://online.moysklad.ru/app/#commissionreport/edit?id=${created.id}`)
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
